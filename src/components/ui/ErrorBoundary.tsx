import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle, Home, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ROUTES } from '@/lib/constants'

type Props = {
  children: ReactNode
  fallbackTitle?: string
}

type State = {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo)
  }

  private handleReload = () => {
    window.location.reload()
  }

  private handleGoHome = () => {
    window.location.href = ROUTES.HOME
  }

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[50vh] w-full items-center justify-center p-4 text-foreground">
          <Card className="w-full max-w-md p-6 text-center shadow-xl sm:p-8">
            <div className="mx-auto mb-4 grid size-12 place-items-center rounded-full bg-danger/10 text-danger">
              <AlertTriangle size={24} aria-hidden="true" />
            </div>

            <h1 className="text-xl font-bold tracking-tight text-foreground-strong">
              {this.props.fallbackTitle ?? 'Something went wrong'}
            </h1>

            <p className="mt-2 text-sm text-muted">
              An unexpected error occurred while loading this view. You can try recovering or return to the home screen.
            </p>

            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
              <Button
                variant="primary"
                size="md"
                className="flex-1 justify-center gap-2"
                onClick={this.handleReload}
              >
                <RotateCcw size={15} />
                <span>Reload Page</span>
              </Button>

              <Button
                variant="outline"
                size="md"
                className="flex-1 justify-center gap-2"
                onClick={this.handleGoHome}
              >
                <Home size={15} />
                <span>Go to Home</span>
              </Button>
            </div>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
