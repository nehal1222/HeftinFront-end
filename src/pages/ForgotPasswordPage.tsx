import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { FormField } from '@/components/ui/FormField'
import { Input } from '@/components/ui/Input'
import { AuthLayout } from '@/layouts/AuthLayout'
import { ROUTES } from '@/lib/constants'
import { getErrorMessage } from '@/lib/axios'
import { authService } from '@/services/auth.service'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [serverError, setServerError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setServerError('')
    setSuccess(false)

    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError('Enter a valid email address.')
      return
    }

    setIsSubmitting(true)

    try {
      await authService.forgotPassword({
        email: email.trim(),
      })
      setSuccess(true)
    } catch (requestError) {
      setServerError(
        getErrorMessage(
          requestError,
          'We could not send the reset email. Please try again.',
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
          Forgot your password?
        </h1>

        <p className="mt-2 text-sm text-muted">
          Enter your account email and we will send a secure reset link.
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
              If an account exists for this email, a reset link is on its way.
            </Alert>
          )}

          <FormField
            label="Email address"
            htmlFor="email"
            error={error}
          >
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              aria-invalid={Boolean(error)}
              disabled={isSubmitting}
            />
          </FormField>

          <Button
            type="submit"
            className="w-full"
            loading={isSubmitting}
          >
            Send reset link
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
