// src/app/admin/page.tsx
'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  useBooksAdmin, 
  useEventsAdmin, 
  useMenuAdmin, 
  useBeansAdmin,
  useBookMutations,
  useEventMutations,
  useMenuMutations,
  useBeanMutations,
  useRequireStaff,
  useAuthActions
} from '@/hooks'
import LoadingSpinner, { LoadingCard, ErrorMessage } from '@/components/LoadingSpinner'
import type { Book, Event, MenuItem, Bean } from '@/lib/types'

type Tab = 'Books' | 'Events' | 'Coffee Menu' | 'Beans'

// Row Actions Component
function RowActions({ 
  editHref, 
  onDelete, 
  loading 
}: { 
  editHref: string
  onDelete: () => void
  loading?: boolean 
}) {
  return (
    <div className="flex gap-2">
      <Link href={editHref} className="btn">
        Edit
      </Link>
      <button 
        className="btn" 
        onClick={onDelete}
        disabled={loading}
      >
        {loading ? <LoadingSpinner size="sm" text="" /> : 'Hapus'}
      </button>
    </div>
  )
}

// List Table Component
function ListTable({ 
  headers, 
  rows,
  loading = false
}: { 
  headers: (string | JSX.Element)[]
  rows: ((string | JSX.Element)[])[]
  loading?: boolean
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-base-muted border-b border-base-border">
            {headers.map((h, i) => (
              <th key={i} className="py-2 pr-4">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={headers.length} className="py-8 text-center">
                <LoadingSpinner size="md" text="Memuat data..." />
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="py-4 text-base-muted">
                Tidak ada data.
              </td>
            </tr>
          ) : (
            rows.map((r, ri) => (
              <tr key={ri} className="border-b border-base-border/60">
                {r.map((c, ci) => (
                  <td key={ci} className="py-2 pr-4 align-top">{c}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default function AdminDashboard() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('Books')
  
  // Require staff authentication
  const { user, loading: authLoading, isStaff } = useRequireStaff()
  const { signOut, loading: signOutLoading } = useAuthActions()

  // Data hooks
  const { data: books, loading: booksLoading, error: booksError, refetch: refetchBooks } = useBooksAdmin()
  const { data: events, loading: eventsLoading, error: eventsError, refetch: refetchEvents } = useEventsAdmin()
  const { data: menu, loading: menuLoading, error: menuError, refetch: refetchMenu } = useMenuAdmin()
  const { data: beans, loading: beansLoading, error: beansError, refetch: refetchBeans } = useBeansAdmin()

  // Mutation hooks
  const { deleteBook, loading: deletingBook } = useBookMutations()
  const { deleteEvent, loading: deletingEvent } = useEventMutations()
  const { deleteMenuItem, loading: deletingMenu } = useMenuMutations()
  const { deleteBean, loading: deletingBean } = useBeanMutations()

  // Temporary auth check (will be replaced with proper auth)
  if (authLoading) {
    return <LoadingCard text="Checking authentication..." />
  }

  if (!user || !isStaff) {
    return <LoadingCard text="Verifying permissions..." />
  }

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

  // Format functions
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short'
    })
  }

  // Delete handlers with confirmation
  const handleDeleteBook = async (book: Book) => {
    if (!confirm(`Hapus buku "${book.title}"?`)) return
    const result = await deleteBook(book.id)
    if (result.success) {
      refetchBooks()
    } else {
      alert(`Error: ${result.error}`)
    }
  }

  const handleDeleteEvent = async (event: Event) => {
    if (!confirm(`Hapus event "${event.title}"?`)) return
    const result = await deleteEvent(event.id)
    if (result.success) {
      refetchEvents()
    } else {
      alert(`Error: ${result.error}`)
    }
  }

  const handleDeleteMenuItem = async (item: MenuItem) => {
    if (!confirm(`Hapus menu "${item.name}"?`)) return
    const result = await deleteMenuItem(item.id)
    if (result.success) {
      refetchMenu()
    } else {
      alert(`Error: ${result.error}`)
    }
  }

  const handleDeleteBean = async (bean: Bean) => {
    if (!confirm(`Hapus bean "${bean.name}"?`)) return
    const result = await deleteBean(bean.id)
    if (result.success) {
      refetchBeans()
    } else {
      alert(`Error: ${result.error}`)
    }
  }

  return (
    <div className="grid gap-6">
      {/* Header */}
      <header className="card">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold">Admin Dashboard</h1>
            {user && (
              <p className="text-sm text-base-muted">
                Welcome back, {user.email}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {(['Books', 'Events', 'Coffee Menu', 'Beans'] as Tab[]).map(t => (
              <button
                key={t}
                className={`btn ${tab === t ? 'bg-white text-black' : ''}`}
                onClick={() => setTab(t)}
              >
                {t}
              </button>
            ))}
            <button
              className="btn bg-red-500 text-white flex items-center gap-2"
              onClick={handleLogout}
              disabled={signOutLoading}
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
        <p className="text-base-muted text-sm mt-2">
          Kelola konten website dari dashboard ini.
        </p>
      </header>

      {/* Books Tab */}
      {tab === 'Books' && (
        <section className="card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-medium">
              Books <span className="badge">{books?.length || 0}</span>
            </h2>
            <Link href="/admin/form?type=book" className="btn">
              + Tambah Buku
            </Link>
          </div>
          
          {booksError && <ErrorMessage error={booksError} onRetry={refetchBooks} />}
          
          <ListTable
            headers={['Judul', 'Penulis', 'Kategori', 'Harga', 'Status', 'Aksi']}
            loading={booksLoading}
            rows={books?.map(book => [
              book.title,
              book.author,
              book.category,
              formatPrice(book.price),
              book.is_published ? (
                <span key="published" className="badge">Published</span>
              ) : (
                <span key="draft" className="badge">Draft</span>
              ),
              <RowActions
                key={book.id}
                editHref={`/admin/form?type=book&id=${book.id}`}
                onDelete={() => handleDeleteBook(book)}
                loading={deletingBook}
              />
            ]) || []}
          />
        </section>
      )}

      {/* Events Tab */}
      {tab === 'Events' && (
        <section className="card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-medium">
              Events <span className="badge">{events?.length || 0}</span>
            </h2>
            <Link href="/admin/form?type=event" className="btn">
              + Tambah Event
            </Link>
          </div>
          
          {eventsError && <ErrorMessage error={eventsError} onRetry={refetchEvents} />}
          
          <ListTable
            headers={['Judul', 'Waktu', 'Lokasi', 'Tipe', 'Status', 'Aksi']}
            loading={eventsLoading}
            rows={events?.map(event => [
              event.title,
              formatDate(event.date),
              event.location,
              event.is_online ? 'Online' : 'Offline',
              <div key="status" className="flex gap-1">
                <span className="badge">{event.status}</span>
                {event.is_published ? (
                  <span className="badge">Published</span>
                ) : (
                  <span className="badge">Draft</span>
                )}
              </div>,
              <RowActions
                key={event.id}
                editHref={`/admin/form?type=event&id=${event.id}`}
                onDelete={() => handleDeleteEvent(event)}
                loading={deletingEvent}
              />
            ]) || []}
          />
        </section>
      )}

      {/* Coffee Menu Tab */}
      {tab === 'Coffee Menu' && (
        <section className="card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-medium">
              Coffee Menu <span className="badge">{menu?.length || 0}</span>
            </h2>
            <Link href="/admin/form?type=menu" className="btn">
              + Tambah Item
            </Link>
          </div>
          
          {menuError && <ErrorMessage error={menuError} onRetry={refetchMenu} />}
          
          <ListTable
            headers={['Nama', 'Grup', 'Harga', 'Badge', 'Status', 'Aksi']}
            loading={menuLoading}
            rows={menu?.map(item => [
              item.name,
              item.group,
              formatPrice(item.price),
              item.badge || '-',
              item.is_available ? (
                <span key="available" className="badge">Available</span>
              ) : (
                <span key="unavailable" className="badge">Unavailable</span>
              ),
              <RowActions
                key={item.id}
                editHref={`/admin/form?type=menu&id=${item.id}`}
                onDelete={() => handleDeleteMenuItem(item)}
                loading={deletingMenu}
              />
            ]) || []}
          />
        </section>
      )}

      {/* Beans Tab */}
      {tab === 'Beans' && (
        <section className="card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-medium">
              Line Up Beans <span className="badge">{beans?.length || 0}</span>
            </h2>
            <Link href="/admin/form?type=bean" className="btn">
              + Tambah Bean
            </Link>
          </div>
          
          {beansError && <ErrorMessage error={beansError} onRetry={refetchBeans} />}
          
          <ListTable
            headers={['Nama', 'Origin', 'Process', 'Roast', 'Status', 'Aksi']}
            loading={beansLoading}
            rows={beans?.map(bean => [
              bean.name,
              bean.origin,
              bean.process || '-',
              bean.roast || '-',
              bean.is_active ? (
                <span key="active" className="badge">Active</span>
              ) : (
                <span key="inactive" className="badge">Inactive</span>
              ),
              <RowActions
                key={bean.id}
                editHref={`/admin/form?type=bean&id=${bean.id}`}
                onDelete={() => handleDeleteBean(bean)}
                loading={deletingBean}
              />
            ]) || []}
          />
        </section>
      )}
    </div>
  )
}