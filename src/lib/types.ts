// src/lib/types.ts
// Database-synced TypeScript interfaces

export type MenuGroup = 'Signature' | 'Espresso' | 'Manual' | 'NonCoffee'
export type RoastLevel = 'Light' | 'Light-Medium' | 'Medium' | 'Medium-Dark'
export type EventStatus = 'scheduled' | 'cancelled' | 'completed'
export type UserRole = 'admin' | 'editor' | 'viewer'

// Database Tables Interfaces (match schema exactly)
export interface Profile {
  id: string
  display_name: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Book {
  id: string
  title: string
  author: string
  category: string
  price: number // numeric in DB
  cover_url: string | null
  description: string | null
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface Event {
  id: string
  title: string
  date: string // timestamptz as ISO string
  location: string
  is_online: boolean
  rsvp_url: string | null
  cover_url: string | null
  description: string | null
  status: EventStatus
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface MenuItem {
  id: string
  name: string
  group: MenuGroup
  price: number // numeric in DB
  badge: string | null
  description: string | null
  is_available: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Bean {
  id: string
  name: string
  origin: string
  process: string | null
  roast: RoastLevel | null
  notes: string
  photo_url: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

// Form Input Types (for frontend forms - before DB insert)
export interface BookInput {
  title: string
  author: string
  category: string
  price: number
  cover_url?: string
  description?: string
  is_published?: boolean
}

export interface EventInput {
  title: string
  date: string
  location: string
  is_online: boolean
  rsvp_url?: string
  cover_url?: string
  description?: string
  status?: EventStatus
  is_published?: boolean
}

export interface MenuItemInput {
  name: string
  group: MenuGroup
  price: number
  badge?: string
  description?: string
  is_available?: boolean
  sort_order?: number
}

export interface BeanInput {
  name: string
  origin: string
  process?: string
  roast?: RoastLevel
  notes: string
  photo_url?: string
  is_active?: boolean
}

// API Response Types
export interface ApiResponse<T> {
  data: T | null
  error: string | null
  loading?: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  error: string | null
  loading?: boolean
}

// Auth Types
export interface AuthUser {
  id: string
  email: string
  profile?: Profile
}

export interface AuthState {
  user: AuthUser | null
  loading: boolean
  isStaff: boolean // computed from profile.role
}

// Upload Types
export interface UploadResponse {
  url: string | null
  error: string | null
  loading: boolean
}