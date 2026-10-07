import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { FormField } from '@/components/ui/FormField'
import { Input } from '@/components/ui/Input'
import { AuthLayout } from '@/layouts/AuthLayout'
import { ROUTES } from '@/lib/constants'
import { getErrorMessage } from '@/lib/axios'
import { authService } from '@/services/auth.service'
import { setStoredUser, setTokens } from '@/lib/storage'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors: Record<string, string> = {}

    if (!login.trim()) {
      nextErrors.login = 'Enter your email or mobile number.'
    }

    if (!password) {
      nextErrors.password = 'Enter your password.'
    }

    setErrors(nextErrors)
    setServerError('')

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await authService.login({
        login: login.trim(),
        password,
      })

      setTokens(response.access_token, response.refresh_token)
setStoredUser(response.user)

const params = new URLSearchParams(location.search)
const from = params.get('from')

const destination =
  from &&
  from.startsWith('/') &&
  !from.startsWith('//')
    ? from
    : ROUTES.DASHBOARD

navigate(destination, { replace: true })
    } catch (error) {
      setServerError(
        getErrorMessage(
          error,
          'We could not sign you in. Check your details and try again.',
        ),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <Card>
        <div className="mb-6">
          <p className="text-sm font-medium text-primary">
            Heftin Academy
          </p>

          <h1 className="mt-2 text-2xl font-semibold text-foreground-strong">
            Sign in
          </h1>

          <p className="mt-1 text-sm text-muted">
            Sign in to continue your preparation.
          </p>
        </div>

        {serverError && (
          <Alert
            variant="error"
            className="mb-6"
          >
            {serverError}
          </Alert>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          noValidate
        >
          <FormField
            label="Email or mobile number"
            htmlFor="login"
            error={errors.login}
          >
            <Input
              id="login"
              type="text"
              value={login}
              onChange={(event) => setLogin(event.target.value)}
              autoComplete="username"
              aria-invalid={Boolean(errors.login)}
              disabled={isSubmitting}
            />
          </FormField>

          <FormField
            label="Password"
            htmlFor="password"
            error={errors.password}
          >
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              aria-invalid={Boolean(errors.password)}
              disabled={isSubmitting}
            />
          </FormField>

          <div className="flex justify-end">
            <Link
              className="text-sm font-medium text-primary hover:underline"
              to={ROUTES.FORGOT_PASSWORD}
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full"
            loading={isSubmitting}
          >
            Sign in
          </Button>
        </form>
      </Card>
    </AuthLayout>
  )
}
