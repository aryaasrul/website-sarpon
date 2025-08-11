// src/components/LoadingSpinner.tsx
import { motion } from 'framer-motion'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  className?: string
}

export default function LoadingSpinner({ 
  size = 'md', 
  text = 'Loading...', 
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6', 
    lg: 'h-8 w-8'
  }

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <motion.div
        className={`border-2 border-base-border border-t-white rounded-full ${sizeClasses[size]}`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      {text && <span className="text-sm text-base-muted">{text}</span>}
    </div>
  )
}

// Loading card untuk full page loading
export function LoadingCard({ text = 'Memuat data...' }: { text?: string }) {
  return (
    <div className="card">
      <LoadingSpinner size="md" text={text} />
    </div>
  )
}

// Loading overlay untuk modals/forms
export function LoadingOverlay({ text = 'Menyimpan...' }: { text?: string }) {
  return (
    <motion.div
      className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 rounded-2xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="card">
        <LoadingSpinner size="lg" text={text} />
      </div>
    </motion.div>
  )
}

// Error message component
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