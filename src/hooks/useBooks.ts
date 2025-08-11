// src/hooks/useBooks.ts
'use client'

import { useState, useEffect, useCallback } from 'react'
import { booksApi } from '@/lib/database'
import type { Book, BookInput, ApiResponse, PaginatedResponse } from '@/lib/types'

// Hook for getting all books (public view)
export function useBooks() {
  const [state, setState] = useState<PaginatedResponse<Book>>({
    data: [],
    count: 0,
    error: null,
    loading: true
  })

  const fetchBooks = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const { data, error } = await booksApi.getAll()
      
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
        error: 'Failed to fetch books',
        loading: false
      })
    }
  }, [])

  useEffect(() => {
    fetchBooks()
  }, [fetchBooks])

  return {
    ...state,
    refetch: fetchBooks
  }
}

// Hook for getting all books (admin view)
export function useBooksAdmin() {
  const [state, setState] = useState<PaginatedResponse<Book>>({
    data: [],
    count: 0,
    error: null,
    loading: true
  })

  const fetchBooks = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const { data, error } = await booksApi.getAllAdmin()
      
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
        error: 'Failed to fetch books',
        loading: false
      })
    }
  }, [])

  useEffect(() => {
    fetchBooks()
  }, [fetchBooks])

  return {
    ...state,
    refetch: fetchBooks
  }
}

// Hook for getting single book
export function useBook(id: string | null) {
  const [state, setState] = useState<ApiResponse<Book>>({
    data: null,
    error: null,
    loading: false
  })

  const fetchBook = useCallback(async (bookId: string) => {
    setState({ data: null, error: null, loading: true })
    
    try {
      const { data, error } = await booksApi.getById(bookId)
      setState({ data, error, loading: false })
    } catch (err) {
      setState({ data: null, error: 'Failed to fetch book', loading: false })
    }
  }, [])

  useEffect(() => {
    if (id) {
      fetchBook(id)
    } else {
      setState({ data: null, error: null, loading: false })
    }
  }, [id, fetchBook])

  return {
    ...state,
    refetch: id ? () => fetchBook(id) : () => {}
  }
}

// Hook for book mutations (create, update, delete)
export function useBookMutations() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createBook = useCallback(async (input: BookInput) => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await booksApi.create(input)
      setLoading(false)
      
      if (error) {
        setError(error)
        return { success: false, data: null, error }
      }
      
      return { success: true, data, error: null }
    } catch (err) {
      const errorMsg = 'Failed to create book'
      setError(errorMsg)
      setLoading(false)
      return { success: false, data: null, error: errorMsg }
    }
  }, [])

  const updateBook = useCallback(async (id: string, input: Partial<BookInput>) => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await booksApi.update(id, input)
      setLoading(false)
      
      if (error) {
        setError(error)
        return { success: false, data: null, error }
      }
      
      return { success: true, data, error: null }
    } catch (err) {
      const errorMsg = 'Failed to update book'
      setError(errorMsg)
      setLoading(false)
      return { success: false, data: null, error: errorMsg }
    }
  }, [])

  const deleteBook = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const { error } = await booksApi.delete(id)
      setLoading(false)
      
      if (error) {
        setError(error)
        return { success: false, error }
      }
      
      return { success: true, error: null }
    } catch (err) {
      const errorMsg = 'Failed to delete book'
      setError(errorMsg)
      setLoading(false)
      return { success: false, error: errorMsg }
    }
  }, [])

  return {
    createBook,
    updateBook,
    deleteBook,
    loading,
    error,
    clearError: () => setError(null)
  }
}