import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { FormField } from '@/components/ui/FormField'
import { Input } from '@/components/ui/Input'
import { AuthLayout } from '@/layouts/AuthLayout'
import { ROUTES } from '@/lib/constants'
import { getErrorMessage } from '@/lib/axios'
import { useAuth } from '@/contexts/useAuth'

export function LoginPage() {
  const navigate = useNavigate()
  const { login: authenticate } = useAuth()

  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (!login.trim() || !password) {
      setError('Login and password are required.')
      return
    }

    setIsSubmitting(true)

    try {
      await authenticate({
        login: login.trim(),
        password,
      })

      navigate(ROUTES.HOME)
    } catch (submitError) {
      setError(getErrorMessage(submitError, 'Unable to sign in.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <Card className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-foreground">
            Sign in
          </h1>

          <p className="mt-1 text-sm text-muted">
            Sign in to continue to Heftin Academy.
          </p>
        </div>

        {error && (
          <Alert
            variant="error"
            className="mb-4"
          >
            {error}
          </Alert>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <FormField
            label="Login"
            htmlFor="login"
          >
            <Input
              id="login"
              value={login}
              onChange={(event) => setLogin(event.target.value)}
              autoComplete="username"
              placeholder="Email or mobile"
              disabled={isSubmitting}
            />
          </FormField>

          <FormField
            label="Password"
            htmlFor="password"
          >
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              placeholder="Password"
              disabled={isSubmitting}
            />
          </FormField>

          <Button
            type="submit"
            className="w-full"
            loading={isSubmitting}
          >
            Sign in
          </Button>
        </form>

        <div className="mt-4 text-center">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => navigate(ROUTES.FORGOT_PASSWORD)}
            disabled={isSubmitting}
          >
            Forgot password?
          </Button>
        </div>
      </Card>
    </AuthLayout>
  )
}
