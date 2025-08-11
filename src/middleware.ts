// src/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables not set, skipping auth middleware')
    return response
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
          })
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Get user session
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Allow access to login page for non-authenticated users
    if (request.nextUrl.pathname === '/admin/login') {
      // Redirect authenticated users away from login page
      if (user) {
        return NextResponse.redirect(new URL('/admin', request.url))
      }
      return response
    }

    // For all other admin routes, require authentication
    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // Check if user has staff role for admin access
    try {
      const { data: isStaff } = await supabase.rpc('is_staff')
      
      if (!isStaff) {
        // Redirect non-staff users to home page
        return NextResponse.redirect(new URL('/?error=unauthorized', request.url))
      }
    } catch (error) {
      console.error('Error checking staff status:', error)
      // On error, redirect to login to be safe
      return NextResponse.redirect(new URL('/admin/login?error=auth_error', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}