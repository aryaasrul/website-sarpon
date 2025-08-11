// src/components/AdminLayout.tsx
'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useRequireStaff, useAuthActions } from '@/hooks'
import LoadingSpinner, { LoadingCard } from '@/components/LoadingSpinner'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, loading: authLoading, isStaff } = useRequireStaff()
  const { signOut, loading: signOutLoading } = useAuthActions()

  // Handle logout
  const handleLogout = async () => {
    if (!confirm('Logout dari admin dashboard?')) return
    
    const result = await signOut()
    if (result.success) {
      router.push('/admin/login')
    } else {
      alert(`Error logging out: ${result.error}`)
    }
  }

  // Show loading while checking auth
  if (authLoading) {
    return <LoadingCard text="Checking authentication..." />
  }

  // Show loading if no user or not staff (useRequireStaff will redirect)
  if (!user || !isStaff) {
    return <LoadingCard text="Verifying permissions..." />
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Admin Header */}
      <header className="border-b border-base-border">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/admin')}
              className="font-semibold tracking-wide"
            >
              TERANG ADMIN
            </button>
            <span className="text-base-muted text-sm">
              {pathname === '/admin' ? 'Dashboard' : 
               pathname.includes('/admin/form') ? 'Form Editor' : 
               'Admin'}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm text-base-muted">
              {user.email}
            </span>
            <button
              onClick={handleLogout}
              disabled={signOutLoading}
              className="btn bg-red-500 text-white text-sm flex items-center gap-2"
            >
              {signOutLoading ? (
                <>
                  <LoadingSpinner size="sm" text="" />
                  Logging out...
                </>
              ) : (
                'Logout'
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <main className="container py-6">
        {children}
      </main>

      {/* Admin Footer */}
      <footer className="border-t border-base-border mt-10">
        <div className="container py-4 text-xs text-base-muted">
          <div className="flex items-center justify-between">
            <span>© {new Date().getFullYear()} Toko Terang Admin</span>
            <span>
              <button 
                onClick={() => router.push('/')}
                className="navlink"
              >
                View Site →
              </button>
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}