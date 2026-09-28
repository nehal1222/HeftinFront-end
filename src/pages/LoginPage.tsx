import { useState, type FormEvent } from 'react'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { FormField } from '@/components/ui/FormField'
import { Input } from '@/components/ui/Input'
import { AuthLayout } from '@/layouts/AuthLayout'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!email || !password) {
      setMessage('Please enter your email and password.')
      return
    }

    setMessage('Login form is ready for authentication integration.')
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
            Sign in to continue to your account.
          </p>
        </div>

        {message && (
          <Alert
            variant="info"
            className="mb-6"
          >
            {message}
          </Alert>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <FormField
            label="Email"
            htmlFor="email"
          >
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              autoComplete="email"
              required
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
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </FormField>

          <Button
            type="submit"
            className="w-full"
          >
            Sign in
          </Button>
        </form>
      </Card>
    </AuthLayout>
  )
}