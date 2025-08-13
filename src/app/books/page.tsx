// src/app/books/page.tsx
'use client'

import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useBooks } from '@/hooks'
import { LoadingCard, ErrorMessage } from '@/components/LoadingSpinner'
import type { Book } from '@/lib/types'

export default function BooksPage() {
  const { data: books, loading, error, refetch } = useBooks()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('')
  const [selected, setSelected] = useState<Book | null>(null)

  // Extract categories from books
  const categories = useMemo(() => {
    if (!books) return []
    return Array.from(new Set(books.map(b => b.category))).sort()
  }, [books])

  // Filter books based on search and category
  const filtered = useMemo(() => {
    if (!books) return []
    return books.filter(b => {
      const matchQuery = q ? 
        (b.title + ' ' + b.author + ' ' + b.category).toLowerCase().includes(q.toLowerCase()) : 
        true
      const matchCategory = cat ? b.category === cat : true
      return matchQuery && matchCategory
    })
  }, [books, q, cat])

  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  if (loading) {
    return <LoadingCard text="Memuat katalog buku..." />
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={refetch} />
  }

  return (
    <div className="grid gap-4">
      {/* Search & Filter */}
      <div className="card grid md:grid-cols-3 gap-3">
        <input 
          className="input" 
          placeholder="Cari judul/penulis/kategori" 
          value={q} 
          onChange={(e) => setQ(e.target.value)} 
        />
        <select 
          className="input" 
          value={cat} 
          onChange={(e) => setCat(e.target.value)}
        >
          <option value="">Semua kategori</option>
          {categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <div className="flex items-center text-sm text-base-muted">
          {filtered.length} buku
        </div>
      </div>

      {/* Books Grid */}
      {filtered.length === 0 ? (
        <div className="card">
          {q || cat ? 'Tidak ada buku yang sesuai dengan pencarian.' : 'Belum ada buku tersedia.'}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((book, idx) => (
            <motion.article
              key={book.id}
              className="card p-0 overflow-hidden hover:shadow-soft transition-shadow cursor-pointer"
              onClick={() => setSelected(book)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.03 }}
            >
              {book.cover_url ? (
                <img 
                  src={book.cover_url} 
                  alt={book.title} 
                  className="w-full h-48 object-cover" 
                  loading="lazy"
                  onError={(e) => {
                    // Fallback if image fails to load
                    e.currentTarget.style.display = 'none'
                  }}
                />
              ) : (
                <div className="w-full h-48 bg-base-border flex items-center justify-center">
                  <span className="text-base-muted text-sm">No Image</span>
                </div>
              )}
              <div className="p-4">
                <h3 className="font-medium">{book.title}</h3>
                <p className="text-sm text-base-muted">
                  {book.author} · <span className="badge">{book.category}</span>
                </p>
                {book.description && (
                  <p className="text-sm text-base-muted mt-2 line-clamp-2">
                    {book.description}
                  </p>
                )}
                <p className="text-sm mt-3">
                  Harga: <span className="font-medium">{formatPrice(book.price)}</span>
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      )}

      {/* Book Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div
              className="relative z-10 w-[92vw] max-w-2xl rounded-2xl border border-base-border bg-black p-0 shadow-soft"
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              role="dialog" 
              aria-modal="true"
            >
              <div className="flex items-center justify-between border-b border-base-border px-5 h-12">
                <div className="font-medium">{selected.title}</div>
                <button 
                  className="navlink" 
                  onClick={() => setSelected(null)} 
                  aria-label="Tutup"
                >
                  ✕
                </button>
              </div>
              <div className="p-5 grid gap-4">
                {selected.cover_url && (
                  <img 
                    src={selected.cover_url} 
                    alt={selected.title} 
                    className="w-full h-64 object-cover rounded-xl" 
                  />
                )}
                <div className="grid gap-1">
                  <div className="text-sm text-base-muted">
                    {selected.author} · <span className="badge">{selected.category}</span>
                  </div>
                  <div className="text-sm">
                    Harga: <span className="font-medium">{formatPrice(selected.price)}</span>
                  </div>
                </div>
                {selected.description && (
                  <p className="text-sm">{selected.description}</p>
                )}
                <div className="text-xs text-base-muted">
                  *Katalog buku tersedia di kedai. Hubungi kami untuk pemesanan.
                </div>
                <div className="flex items-center gap-3">
                  <button className="btn" onClick={() => setSelected(null)}>
                    Tutup
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}