// src/hooks/useAuth.ts
'use client'

import { useState, useEffect } from 'react'
import { supabaseBrowser } from '@/lib/supabase'
import { authApi } from '@/lib/database'
import type { AuthState, AuthUser } from '@/lib/types'

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    isStaff: false
  })

  useEffect(() => {
    const supabase = supabaseBrowser()

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          const { data: profile } = await authApi.getProfile()
          const isStaff = await authApi.isStaff()
          
          setState({
            user: {
              id: session.user.id,
              email: session.user.email!,
              profile: profile || undefined
            },
            loading: false,
            isStaff
          })
        } else {
          setState({
            user: null,
            loading: false,
            isStaff: false
          })
        }
      } catch (error) {
        console.error('Error getting initial session:', error)
        setState({
          user: null,
          loading: false,
          isStaff: false
        })
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        
        if (session?.user) {
          const { data: profile } = await authApi.getProfile()
          const isStaff = await authApi.isStaff()
          
          setState({
            user: {
              id: session.user.id,
              email: session.user.email!,
              profile: profile || undefined
            },
            loading: false,
            isStaff
          })
        } else {
          setState({
            user: null,
            loading: false,
            isStaff: false
          })
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return state
}

// Helper hook for requiring authentication
export function useRequireAuth() {
  const auth = useAuth()
  
  useEffect(() => {
    if (!auth.loading && !auth.user) {
      // Redirect to login or show login modal
      window.location.href = '/admin/login'
    }
  }, [auth.loading, auth.user])

  return auth
}

// Helper hook for requiring staff permissions
export function useRequireStaff() {
  const auth = useAuth()
  
  useEffect(() => {
    if (!auth.loading && (!auth.user || !auth.isStaff)) {
      // Redirect to unauthorized page or home
      alert('Access denied. Admin privileges required.')
      window.location.href = '/'
    }
  }, [auth.loading, auth.user, auth.isStaff])

  return auth
}

// Auth actions hook
export function useAuthActions() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await authApi.signIn(email, password)
      setLoading(false)
      
      if (error) {
        setError(error)
        return { success: false, error }
      }
      
      return { success: true, data, error: null }
    } catch (err) {
      const errorMsg = 'Failed to sign in'
      setError(errorMsg)
      setLoading(false)
      return { success: false, data: null, error: errorMsg }
    }
  }

  const signOut = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const { error } = await authApi.signOut()
      setLoading(false)
      
      if (error) {
        setError(error)
        return { success: false, error }
      }
      
      return { success: true, error: null }
    } catch (err) {
      const errorMsg = 'Failed to sign out'
      setError(errorMsg)
      setLoading(false)
      return { success: false, error: errorMsg }
    }
  }

  const clearError = () => setError(null)

  return {
    signIn,
    signOut,
    loading,
    error,
    clearError
  }
}