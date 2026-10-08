import axios, { type AxiosInstance } from 'axios'

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
})

type ApiErrorBody = {
  message?: unknown
  detail?: unknown
  errors?: unknown
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function getMessage(value: unknown): string | undefined {
  if (typeof value === 'string') return value.trim() || undefined
  if (!Array.isArray(value)) {
    if (isRecord(value)) return getMessage(value.message) ?? getMessage(value.msg)
    return undefined
  }

  const messages = value.map(getMessage).filter((message): message is string => Boolean(message))
  return messages.length ? messages.join('; ') : undefined
}

function addFieldError(
  fieldErrors: Record<string, string>,
  field: string,
  value: unknown,
) {
  const message = getMessage(value)
  if (message) fieldErrors[field] = fieldErrors[field] ? `${fieldErrors[field]}; ${message}` : message
}

function addValidationErrors(fieldErrors: Record<string, string>, value: unknown) {
  if (Array.isArray(value)) {
    for (const item of value) {
      if (!isRecord(item)) continue
      const location = Array.isArray(item.loc) ? item.loc : []
      const field = [...location].reverse().find(
        (part): part is string =>
          typeof part === 'string' && !['body', 'query', 'path', 'header'].includes(part),
      )
      if (field) addFieldError(fieldErrors, field, item.msg ?? item.message)
    }
    return
  }

  if (!isRecord(value)) return
  for (const [field, message] of Object.entries(value)) {
    addFieldError(fieldErrors, field.split('.').at(-1) ?? field, message)
  }
}

export function getFieldErrors(error: unknown): Record<string, string> {
  if (!axios.isAxiosError<ApiErrorBody>(error)) return {}

  const body = error.response?.data
  if (!body || !isRecord(body)) return {}

  const fieldErrors: Record<string, string> = {}
  addValidationErrors(fieldErrors, body.errors)
  if (isRecord(body.detail) && body.detail.errors !== undefined) {
    addValidationErrors(fieldErrors, body.detail.errors)
  } else {
    addValidationErrors(fieldErrors, body.detail)
  }
  return fieldErrors
}

export function getErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (axios.isAxiosError(error)) {
    const body = error.response?.data
    if (isRecord(body)) {
      return getMessage(body.message) ?? getMessage(body.detail) ?? fallback
    }
    return fallback
  }
  if (error instanceof Error && error.message) {
    return error.message
  }
  return fallback
}

export default api
