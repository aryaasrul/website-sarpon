import { createBrowserClient, createServerClient } from '@supabase/ssr'

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
export const HAS_SUPABASE = Boolean(supabaseUrl && supabaseAnonKey)

// Browser client for Client Components / useEffect
export const supabaseBrowser = () => {
  if (!HAS_SUPABASE) {
    console.error('Missing Supabase environment variables. Please check your .env.local file.')
    throw new Error('Supabase configuration missing. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local')
  }
  return createBrowserClient(supabaseUrl!, supabaseAnonKey!)
}

// Server client for Server Components / Route Handlers
export const supabaseServer = async () => {
  if (!HAS_SUPABASE) {
    console.error('Missing Supabase environment variables. Please check your .env.local file.')
    throw new Error('Supabase configuration missing. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local')
  }
  const { cookies } = await import('next/headers')
  return createServerClient(supabaseUrl!, supabaseAnonKey!, {
    cookies: {
      getAll() {
        return cookies().getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookies().set(name, value, options)
          })
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing user sessions.
        }
      },
    },
  })
}