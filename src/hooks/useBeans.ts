// src/hooks/useBeans.ts
'use client'

import { useState, useEffect, useCallback } from 'react'
import { beansApi } from '@/lib/database'
import type { Bean, BeanInput, ApiResponse, PaginatedResponse } from '@/lib/types'

// Hook for getting all beans (public view)
export function useBeans() {
  const [state, setState] = useState<PaginatedResponse<Bean>>({
    data: [],
    count: 0,
    error: null,
    loading: true
  })

  const fetchBeans = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const { data, error } = await beansApi.getAll()
      
      setState({
        data: data || [],
        count: data?.length || 0,
        error,
        loading: false
      })
    } catch (err) {
      setState({
        data: [],
        count: 0,
        error: 'Failed to fetch beans',
        loading: false
      })
    }
  }, [])

  useEffect(() => {
    fetchBeans()
  }, [fetchBeans])

  return {
    ...state,
    refetch: fetchBeans
  }
}

// Hook for getting all beans (admin view)
export function useBeansAdmin() {
  const [state, setState] = useState<PaginatedResponse<Bean>>({
    data: [],
    count: 0,
    error: null,
    loading: true
  })

  const fetchBeans = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const { data, error } = await beansApi.getAllAdmin()
      
      setState({
        data: data || [],
        count: data?.length || 0,
        error,
        loading: false
      })
    } catch (err) {
      setState({
        data: [],
        count: 0,
        error: 'Failed to fetch beans',
        loading: false
      })
    }
  }, [])

  useEffect(() => {
    fetchBeans()
  }, [fetchBeans])

  return {
    ...state,
    refetch: fetchBeans
  }
}

// Hook for getting single bean
export function useBean(id: string | null) {
  const [state, setState] = useState<ApiResponse<Bean>>({
    data: null,
    error: null,
    loading: false
  })

  const fetchBean = useCallback(async (beanId: string) => {
    setState({ data: null, error: null, loading: true })
    
    try {
      const { data, error } = await beansApi.getById(beanId)
      setState({ data, error, loading: false })
    } catch (err) {
      setState({ data: null, error: 'Failed to fetch bean', loading: false })
    }
  }, [])

  useEffect(() => {
    if (id) {
      fetchBean(id)
    } else {
      setState({ data: null, error: null, loading: false })
    }
  }, [id, fetchBean])

  return {
    ...state,
    refetch: id ? () => fetchBean(id) : () => {}
  }
}

// Hook for bean mutations (create, update, delete)
export function useBeanMutations() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createBean = useCallback(async (input: BeanInput) => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await beansApi.create(input)
      setLoading(false)
      
      if (error) {
        setError(error)
        return { success: false, data: null, error }
      }
      
      return { success: true, data, error: null }
    } catch (err) {
      const errorMsg = 'Failed to create bean'
      setError(errorMsg)
      setLoading(false)
      return { success: false, data: null, error: errorMsg }
    }
  }, [])

  const updateBean = useCallback(async (id: string, input: Partial<BeanInput>) => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await beansApi.update(id, input)
      setLoading(false)
      
      if (error) {
        setError(error)
        return { success: false, data: null, error }
      }
      
      return { success: true, data, error: null }
    } catch (err) {
      const errorMsg = 'Failed to update bean'
      setError(errorMsg)
      setLoading(false)
      return { success: false, data: null, error: errorMsg }
    }
  }, [])

  const deleteBean = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const { error } = await beansApi.delete(id)
      setLoading(false)
      
      if (error) {
        setError(error)
        return { success: false, error }
      }
      
      return { success: true, error: null }
    } catch (err) {
      const errorMsg = 'Failed to delete bean'
      setError(errorMsg)
      setLoading(false)
      return { success: false, error: errorMsg }
    }
  }, [])

  return {
    createBean,
    updateBean,
    deleteBean,
    loading,
    error,
    clearError: () => setError(null)
  }
}