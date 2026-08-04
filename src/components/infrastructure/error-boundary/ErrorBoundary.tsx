import { Component, type ErrorInfo, type ReactNode } from 'react'
import { toast } from 'sonner'
import i18n from '@/i18n'
import { ErrorFallback } from './ErrorFallback'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false }

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    toast.error(i18n.t('errorBoundary.message'))

    if (import.meta.env.DEV) {
      console.error(error, errorInfo)
    }
  }

  public render() {
    if (this.state.hasError) {
      return <ErrorFallback />
    }

    return this.props.children
  }
}
