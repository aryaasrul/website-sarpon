// src/hooks/useEvents.ts
'use client'

import { useState, useEffect, useCallback } from 'react'
import { eventsApi } from '@/lib/database'
import type { Event, EventInput, ApiResponse, PaginatedResponse } from '@/lib/types'

// Hook for getting all events (public view)
export function useEvents() {
  const [state, setState] = useState<PaginatedResponse<Event>>({
    data: [],
    count: 0,
    error: null,
    loading: true
  })

  const fetchEvents = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const { data, error } = await eventsApi.getAll()
      
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
        error: 'Failed to fetch events',
        loading: false
      })
    }
  }, [])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  return {
    ...state,
    refetch: fetchEvents
  }
}

// Hook for getting all events (admin view)
export function useEventsAdmin() {
  const [state, setState] = useState<PaginatedResponse<Event>>({
    data: [],
    count: 0,
    error: null,
    loading: true
  })

  const fetchEvents = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const { data, error } = await eventsApi.getAllAdmin()
      
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
        error: 'Failed to fetch events',
        loading: false
      })
    }
  }, [])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  return {
    ...state,
    refetch: fetchEvents
  }
}

// Hook for getting single event
export function useEvent(id: string | null) {
  const [state, setState] = useState<ApiResponse<Event>>({
    data: null,
    error: null,
    loading: false
  })

  const fetchEvent = useCallback(async (eventId: string) => {
    setState({ data: null, error: null, loading: true })
    
    try {
      const { data, error } = await eventsApi.getById(eventId)
      setState({ data, error, loading: false })
    } catch (err) {
      setState({ data: null, error: 'Failed to fetch event', loading: false })
    }
  }, [])

  useEffect(() => {
    if (id) {
      fetchEvent(id)
    } else {
      setState({ data: null, error: null, loading: false })
    }
  }, [id, fetchEvent])

  return {
    ...state,
    refetch: id ? () => fetchEvent(id) : () => {}
  }
}

// Hook for event mutations (create, update, delete)
export function useEventMutations() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createEvent = useCallback(async (input: EventInput) => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await eventsApi.create(input)
      setLoading(false)
      
      if (error) {
        setError(error)
        return { success: false, data: null, error }
      }
      
      return { success: true, data, error: null }
    } catch (err) {
      const errorMsg = 'Failed to create event'
      setError(errorMsg)
      setLoading(false)
      return { success: false, data: null, error: errorMsg }
    }
  }, [])

  const updateEvent = useCallback(async (id: string, input: Partial<EventInput>) => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await eventsApi.update(id, input)
      setLoading(false)
      
      if (error) {
        setError(error)
        return { success: false, data: null, error }
      }
      
      return { success: true, data, error: null }
    } catch (err) {
      const errorMsg = 'Failed to update event'
      setError(errorMsg)
      setLoading(false)
      return { success: false, data: null, error: errorMsg }
    }
  }, [])

  const deleteEvent = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const { error } = await eventsApi.delete(id)
      setLoading(false)
      
      if (error) {
        setError(error)
        return { success: false, error }
      }
      
      return { success: true, error: null }
    } catch (err) {
      const errorMsg = 'Failed to delete event'
      setError(errorMsg)
      setLoading(false)
      return { success: false, error: errorMsg }
    }
  }, [])

  return {
    createEvent,
    updateEvent,
    deleteEvent,
    loading,
    error,
    clearError: () => setError(null)
  }
}