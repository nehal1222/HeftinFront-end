import { useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { FormField } from '@/components/ui/FormField'
import { Input } from '@/components/ui/Input'
import { AuthLayout } from '@/layouts/AuthLayout'
import { ROUTES } from '@/lib/constants'
import { getErrorMessage } from '@/lib/axios'
import { authService } from '@/services/auth.service'

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''

  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [error, setError] = useState('')
  const [serverError, setServerError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setServerError('')
    setSuccess(false)

    if (!token) {
      setError('This reset link is missing its token. Request a new link.')
      return
    }

    if (password.length < 8) {
      setError('Your password must be at least 8 characters.')
      return
    }

    if (password !== confirmation) {
      setError('Passwords do not match.')
      return
    }

    setIsSubmitting(true)

    try {
      await authService.resetPassword({
        token,
        password,
        password_confirmation: confirmation,
      })
      setSuccess(true)
    } catch (requestError) {
      setServerError(
        getErrorMessage(
          requestError,
          'This reset link is invalid or has expired.',
        ),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <Card className="p-6">
        <h1 className="text-2xl font-semibold text-foreground-strong">
          Create a new password
        </h1>

        <p className="mt-2 text-sm text-muted">
          Choose a strong password you have not used before.
        </p>

        <form
          className="mt-6 space-y-5"
          onSubmit={handleSubmit}
          noValidate
        >
          {serverError && (
            <Alert variant="error">
              {serverError}
            </Alert>
          )}

          {success && (
            <Alert variant="success">
              Your password has been reset successfully.
            </Alert>
          )}

          {!token && (
            <Alert variant="warning">
              This page needs a reset token from your email link.
            </Alert>
          )}

          <FormField
            label="New password"
            htmlFor="new-password"
            error={error}
          >
            <Input
              id="new-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              aria-invalid={Boolean(error)}
              disabled={isSubmitting || success}
            />
          </FormField>

          <FormField
            label="Confirm new password"
            htmlFor="password-confirmation"
          >
            <Input
              id="password-confirmation"
              type="password"
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              autoComplete="new-password"
              aria-invalid={Boolean(error)}
              disabled={isSubmitting || success}
            />
          </FormField>

          <Button
            type="submit"
            className="w-full"
            loading={isSubmitting}
            disabled={success}
          >
            Reset password
          </Button>
        </form>

        <Link
          className="mt-5 block text-center text-sm font-medium text-primary hover:underline"
          to={ROUTES.LOGIN}
        >
          Back to sign in
        </Link>
      </Card>
    </AuthLayout>
  )
}
