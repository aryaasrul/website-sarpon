// src/hooks/useUpload.ts
'use client'

import { useState, useCallback } from 'react'
import { storageApi } from '@/lib/database'
import type { UploadResponse } from '@/lib/types'

export function useUpload() {
  const [state, setState] = useState<UploadResponse>({
    url: null,
    error: null,
    loading: false
  })

  const uploadFile = useCallback(async (
    bucket: 'books' | 'events' | 'beans',
    file: File,
    fileName?: string
  ) => {
    setState({ url: null, error: null, loading: true })
    
    try {
      // Validate file type (optional)
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Only JPEG, PNG, and WebP images are allowed')
      }

      // Validate file size (optional - 5MB limit)
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        throw new Error('File size must be less than 5MB')
      }

      const { url, error } = await storageApi.uploadFile(bucket, file, fileName)
      
      setState({ url, error, loading: false })
      
      return { url, error }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Upload failed'
      setState({ url: null, error: errorMsg, loading: false })
      return { url: null, error: errorMsg }
    }
  }, [])

  const deleteFile = useCallback(async (
    bucket: 'books' | 'events' | 'beans',
    fileName: string
  ) => {
    try {
      const { error } = await storageApi.deleteFile(bucket, fileName)
      return { error }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Delete failed'
      return { error: errorMsg }
    }
  }, [])

  const reset = useCallback(() => {
    setState({ url: null, error: null, loading: false })
  }, [])

  return {
    ...state,
    uploadFile,
    deleteFile,
    reset
  }
}

// Hook for multiple file uploads
export function useMultiUpload() {
  const [uploads, setUploads] = useState<Record<string, UploadResponse>>({})

  const uploadFile = useCallback(async (
    key: string,
    bucket: 'books' | 'events' | 'beans',
    file: File,
    fileName?: string
  ) => {
    setUploads(prev => ({
      ...prev,
      [key]: { url: null, error: null, loading: true }
    }))
    
    try {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Only JPEG, PNG, and WebP images are allowed')
      }

      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        throw new Error('File size must be less than 5MB')
      }

      const { url, error } = await storageApi.uploadFile(bucket, file, fileName)
      
      setUploads(prev => ({
        ...prev,
        [key]: { url, error, loading: false }
      }))
      
      return { url, error }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Upload failed'
      setUploads(prev => ({
        ...prev,
        [key]: { url: null, error: errorMsg, loading: false }
      }))
      return { url: null, error: errorMsg }
    }
  }, [])

  const deleteFile = useCallback(async (
    key: string,
    bucket: 'books' | 'events' | 'beans',
    fileName: string
  ) => {
    try {
      const { error } = await storageApi.deleteFile(bucket, fileName)
      
      if (!error) {
        setUploads(prev => ({
          ...prev,
          [key]: { url: null, error: null, loading: false }
        }))
      }
      
      return { error }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Delete failed'
      return { error: errorMsg }
    }
  }, [])

  const reset = useCallback((key?: string) => {
    if (key) {
      setUploads(prev => ({
        ...prev,
        [key]: { url: null, error: null, loading: false }
      }))
    } else {
      setUploads({})
    }
  }, [])

  const getUpload = useCallback((key: string) => {
    return uploads[key] || { url: null, error: null, loading: false }
  }, [uploads])

  return {
    uploads,
    uploadFile,
    deleteFile,
    reset,
    getUpload
  }
}