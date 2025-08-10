import { createBrowserClient, createServerClient } from '@supabase/ssr'

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
export const HAS_SUPABASE = Boolean(supabaseUrl && supabaseAnonKey)

// Browser client for Client Components / useEffect
export const supabaseBrowser = () => {
  if (!HAS_SUPABASE) {
    throw new Error('Supabase env not set. Define NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local')
  }
  return createBrowserClient(supabaseUrl!, supabaseAnonKey!)
}

// Server client for Server Components / Route Handlers
export const supabaseServer = async () => {
  if (!HAS_SUPABASE) {
    throw new Error('Supabase env not set. Define NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local')
  }
  const { cookies } = await import('next/headers')
  return createServerClient(supabaseUrl!, supabaseAnonKey!, { cookies })
}