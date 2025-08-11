// src/lib/database.ts
// Database operations wrapper for Supabase

import { supabaseBrowser } from './supabase'
import type { 
  Book, Event, MenuItem, Bean, Profile,
  BookInput, EventInput, MenuItemInput, BeanInput 
} from './types'

const supabase = supabaseBrowser()

// =============================================================================
// BOOKS
// =============================================================================

export const booksApi = {
  // Get all published books
  async getAll() {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
    
    return { data: data as Book[] | null, error: error?.message || null }
  },

  // Get all books (admin only)
  async getAllAdmin() {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .order('created_at', { ascending: false })
    
    return { data: data as Book[] | null, error: error?.message || null }
  },

  // Get book by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('id', id)
      .single()
    
    return { data: data as Book | null, error: error?.message || null }
  },

  // Create new book
  async create(input: BookInput) {
    const { data, error } = await supabase
      .from('books')
      .insert([input])
      .select()
      .single()
    
    return { data: data as Book | null, error: error?.message || null }
  },

  // Update book
  async update(id: string, input: Partial<BookInput>) {
    const { data, error } = await supabase
      .from('books')
      .update(input)
      .eq('id', id)
      .select()
      .single()
    
    return { data: data as Book | null, error: error?.message || null }
  },

  // Delete book
  async delete(id: string) {
    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', id)
    
    return { error: error?.message || null }
  }
}

// =============================================================================
// EVENTS
// =============================================================================

export const eventsApi = {
  // Get all published events
  async getAll() {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('is_published', true)
      .order('date', { ascending: true })
    
    return { data: data as Event[] | null, error: error?.message || null }
  },

  // Get all events (admin only)
  async getAllAdmin() {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true })
    
    return { data: data as Event[] | null, error: error?.message || null }
  },

  // Get event by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single()
    
    return { data: data as Event | null, error: error?.message || null }
  },

  // Create new event
  async create(input: EventInput) {
    const { data, error } = await supabase
      .from('events')
      .insert([input])
      .select()
      .single()
    
    return { data: data as Event | null, error: error?.message || null }
  },

  // Update event
  async update(id: string, input: Partial<EventInput>) {
    const { data, error } = await supabase
      .from('events')
      .update(input)
      .eq('id', id)
      .select()
      .single()
    
    return { data: data as Event | null, error: error?.message || null }
  },

  // Delete event
  async delete(id: string) {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id)
    
    return { error: error?.message || null }
  }
}

// =============================================================================
// MENU ITEMS
// =============================================================================

export const menuApi = {
  // Get all available menu items
  async getAll() {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('is_available', true)
      .order('sort_order', { ascending: true })
    
    return { data: data as MenuItem[] | null, error: error?.message || null }
  },

  // Get all menu items (admin only)
  async getAllAdmin() {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('sort_order', { ascending: true })
    
    return { data: data as MenuItem[] | null, error: error?.message || null }
  },

  // Get menu item by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('id', id)
      .single()
    
    return { data: data as MenuItem | null, error: error?.message || null }
  },

  // Create new menu item
  async create(input: MenuItemInput) {
    const { data, error } = await supabase
      .from('menu_items')
      .insert([input])
      .select()
      .single()
    
    return { data: data as MenuItem | null, error: error?.message || null }
  },

  // Update menu item
  async update(id: string, input: Partial<MenuItemInput>) {
    const { data, error } = await supabase
      .from('menu_items')
      .update(input)
      .eq('id', id)
      .select()
      .single()
    
    return { data: data as MenuItem | null, error: error?.message || null }
  },

  // Delete menu item
  async delete(id: string) {
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id)
    
    return { error: error?.message || null }
  }
}

// =============================================================================
// BEANS
// =============================================================================

export const beansApi = {
  // Get all active beans
  async getAll() {
    const { data, error } = await supabase
      .from('beans')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    
    return { data: data as Bean[] | null, error: error?.message || null }
  },

  // Get all beans (admin only)
  async getAllAdmin() {
    const { data, error } = await supabase
      .from('beans')
      .select('*')
      .order('created_at', { ascending: false })
    
    return { data: data as Bean[] | null, error: error?.message || null }
  },

  // Get bean by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('beans')
      .select('*')
      .eq('id', id)
      .single()
    
    return { data: data as Bean | null, error: error?.message || null }
  },

  // Create new bean
  async create(input: BeanInput) {
    const { data, error } = await supabase
      .from('beans')
      .insert([input])
      .select()
      .single()
    
    return { data: data as Bean | null, error: error?.message || null }
  },

  // Update bean
  async update(id: string, input: Partial<BeanInput>) {
    const { data, error } = await supabase
      .from('beans')
      .update(input)
      .eq('id', id)
      .select()
      .single()
    
    return { data: data as Bean | null, error: error?.message || null }
  },

  // Delete bean
  async delete(id: string) {
    const { error } = await supabase
      .from('beans')
      .delete()
      .eq('id', id)
    
    return { error: error?.message || null }
  }
}

// =============================================================================
// AUTH & PROFILES
// =============================================================================

export const authApi = {
  // Get current user profile
  async getProfile() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { data: null, error: 'Not authenticated' }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    
    return { data: data as Profile | null, error: error?.message || null }
  },

  // Check if user is staff
  async isStaff() {
    const { data } = await supabase.rpc('is_staff')
    return Boolean(data)
  },

  // Sign in with email/password
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    return { data, error: error?.message || null }
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error: error?.message || null }
  }
}

// =============================================================================
// STORAGE / FILE UPLOAD
// =============================================================================

export const storageApi = {
  // Upload file to specific bucket
  async uploadFile(bucket: 'books' | 'events' | 'beans', file: File, fileName?: string) {
    const fileExtension = file.name.split('.').pop()
    const uploadFileName = fileName || `${Date.now()}.${fileExtension}`
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(uploadFileName, file)
    
    if (error) {
      return { url: null, error: error.message }
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(uploadFileName)
    
    return { url: publicUrl, error: null }
  },

  // Delete file from storage
  async deleteFile(bucket: 'books' | 'events' | 'beans', fileName: string) {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([fileName])
    
    return { error: error?.message || null }
  }
}