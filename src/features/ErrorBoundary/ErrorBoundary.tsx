import { Component, ReactNode, ErrorInfo } from 'react'

interface Props {
  children: ReactNode
  fallback: React.ComponentType<{ error?: Error }>
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback
      return <FallbackComponent error={this.state.error} />
    }

    return this.props.children
  }
}

