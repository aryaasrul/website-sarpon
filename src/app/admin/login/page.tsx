// src/app/admin/login/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth, useAuthActions } from '@/hooks'
import LoadingSpinner, { ErrorMessage } from '@/components/LoadingSpinner'

export default function AdminLogin() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { signIn, loading: signInLoading, error, clearError } = useAuthActions()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      router.replace('/admin')
    }
  }, [user, authLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()

    if (!email || !password) {
      alert('Email dan password wajib diisi.')
      return
    }

    const result = await signIn(email, password)
    
    if (result.success) {
      router.push('/admin')
    }
    // Error akan ditampilkan otomatis via ErrorMessage component
  }

  // Show loading while checking auth state
  if (authLoading) {
    return (
      <div className="container py-20">
        <div className="max-w-md mx-auto">
          <div className="card">
            <LoadingSpinner size="md" text="Checking authentication..." />
          </div>
        </div>
      </div>
    )
  }

  // Don't render login form if user is already logged in
  if (user) {
    return null
  }

  return (
    <div className="container py-20">
      <div className="max-w-md mx-auto">
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold mb-2">Admin Login</h1>
            <p className="text-base-muted text-sm">
              Masuk untuk mengakses dashboard admin
            </p>
          </div>

          {error && (
            <ErrorMessage 
              error={error} 
              onRetry={clearError}
              className="mb-4"
            />
          )}

          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-1">
              <label className="text-sm text-base-muted">Email</label>
              <input
                type="email"
                className="input"
                placeholder="admin@tokoterang.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={signInLoading}
              />
            </div>

            <div className="grid gap-1">
              <label className="text-sm text-base-muted">Password</label>
              <input
                type="password"
                className="input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={signInLoading}
              />
            </div>

            <button
              type="submit"
              className="btn bg-white text-black w-full flex items-center justify-center gap-2"
              disabled={signInLoading}
            >
              {signInLoading ? (
                <>
                  <LoadingSpinner size="sm" text="" />
                  Signing in...
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>

    

          <div className="mt-4 text-center">
            <button
              type="button"
              className="navlink text-sm"
              onClick={() => router.push('/')}
            >
              ← Kembali ke Home
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}