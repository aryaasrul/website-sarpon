// src/hooks/useMenu.ts
'use client'

import { useState, useEffect, useCallback } from 'react'
import { menuApi } from '@/lib/database'
import type { MenuItem, MenuItemInput, ApiResponse, PaginatedResponse } from '@/lib/types'

// Hook for getting all menu items (public view)
export function useMenu() {
  const [state, setState] = useState<PaginatedResponse<MenuItem>>({
    data: [],
    count: 0,
    error: null,
    loading: true
  })

  const fetchMenu = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const { data, error } = await menuApi.getAll()
      
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
        error: 'Failed to fetch menu items',
        loading: false
      })
    }
  }, [])

  useEffect(() => {
    fetchMenu()
  }, [fetchMenu])

  return {
    ...state,
    refetch: fetchMenu
  }
}

// Hook for getting all menu items (admin view)
export function useMenuAdmin() {
  const [state, setState] = useState<PaginatedResponse<MenuItem>>({
    data: [],
    count: 0,
    error: null,
    loading: true
  })

  const fetchMenu = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const { data, error } = await menuApi.getAllAdmin()
      
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
        error: 'Failed to fetch menu items',
        loading: false
      })
    }
  }, [])

  useEffect(() => {
    fetchMenu()
  }, [fetchMenu])

  return {
    ...state,
    refetch: fetchMenu
  }
}

// Hook for getting single menu item
export function useMenuItem(id: string | null) {
  const [state, setState] = useState<ApiResponse<MenuItem>>({
    data: null,
    error: null,
    loading: false
  })

  const fetchMenuItem = useCallback(async (itemId: string) => {
    setState({ data: null, error: null, loading: true })
    
    try {
      const { data, error } = await menuApi.getById(itemId)
      setState({ data, error, loading: false })
    } catch (err) {
      setState({ data: null, error: 'Failed to fetch menu item', loading: false })
    }
  }, [])

  useEffect(() => {
    if (id) {
      fetchMenuItem(id)
    } else {
      setState({ data: null, error: null, loading: false })
    }
  }, [id, fetchMenuItem])

  return {
    ...state,
    refetch: id ? () => fetchMenuItem(id) : () => {}
  }
}

// Hook for menu item mutations (create, update, delete)
export function useMenuMutations() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createMenuItem = useCallback(async (input: MenuItemInput) => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await menuApi.create(input)
      setLoading(false)
      
      if (error) {
        setError(error)
        return { success: false, data: null, error }
      }
      
      return { success: true, data, error: null }
    } catch (err) {
      const errorMsg = 'Failed to create menu item'
      setError(errorMsg)
      setLoading(false)
      return { success: false, data: null, error: errorMsg }
    }
  }, [])

  const updateMenuItem = useCallback(async (id: string, input: Partial<MenuItemInput>) => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await menuApi.update(id, input)
      setLoading(false)
      
      if (error) {
        setError(error)
        return { success: false, data: null, error }
      }
      
      return { success: true, data, error: null }
    } catch (err) {
      const errorMsg = 'Failed to update menu item'
      setError(errorMsg)
      setLoading(false)
      return { success: false, data: null, error: errorMsg }
    }
  }, [])

  const deleteMenuItem = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const { error } = await menuApi.delete(id)
      setLoading(false)
      
      if (error) {
        setError(error)
        return { success: false, error }
      }
      
      return { success: true, error: null }
    } catch (err) {
      const errorMsg = 'Failed to delete menu item'
      setError(errorMsg)
      setLoading(false)
      return { success: false, error: errorMsg }
    }
  }, [])

  return {
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    loading,
    error,
    clearError: () => setError(null)
  }
}