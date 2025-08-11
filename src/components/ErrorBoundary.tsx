// src/components/ErrorBoundary.tsx
'use client'

import React from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; reset: () => void }>
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  reset = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      return <FallbackComponent error={this.state.error} reset={this.reset} />
    }

    return this.props.children
  }
}

// Default error fallback component
function DefaultErrorFallback({ error, reset }: { error?: Error; reset: () => void }) {
  return (
    <div className="card">
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-2">Oops! Something went wrong</h2>
        <p className="text-base-muted text-sm mb-4">
          {error?.message || 'An unexpected error occurred'}
        </p>
        <button className="btn" onClick={reset}>
          Try again
        </button>
      </div>
    </div>
  )
}

// Simple error display component
export function ErrorMessage({ 
  error, 
  onRetry, 
  className = '' 
}: { 
  error: string | null
  onRetry?: () => void
  className?: string 
}) {
  if (!error) return null

  return (
    <div className={`card border-red-500/20 bg-red-500/5 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-red-400 mb-1">Error</p>
          <p className="text-sm">{error}</p>
        </div>
        {onRetry && (
          <button className="btn text-sm" onClick={onRetry}>
            Retry
          </button>
        )}
      </div>
    </div>
  )
}

export default ErrorBoundary