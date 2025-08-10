'use client'

import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

type Book = {
  id: string
  title: string
  author: string
  category: string
  cover_url: string
  price: string
  description?: string | null
}

const BOOKS: Book[] = [
  { id:'b1', title:'Fiqh Islam', author:'Sayyid Sabiq', category:'Agama', cover_url:'/books/fiqh-islam.jpg', price:'Rp65.000', description:'Kitab fiqh ringkas untuk santri.' },
  { id:'b2', title:'Algoritma Dasar', author:'A. Junaedi', category:'Teknis', cover_url:'/books/algoritma-dasar.jpg', price:'Rp78.000', description:'Pengantar algoritma praktis.' },
  { id:'b3', title:'Kopi: Dari Kebun ke Cangkir', author:'R. Prabowo', category:'Kopi', cover_url:'/books/kopi-kebun-cangkir.jpg', price:'Rp89.000', description:'Perjalanan biji kopi.' },
  { id:'b4', title:'Storytelling untuk UMKM', author:'D. Mahesa', category:'Bisnis', cover_url:'/books/storytelling-umkm.jpg', price:'Rp72.000', description:'Narasi yang menjual.' },
]

export default function BooksPage() {
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('')
  const [selected, setSelected] = useState<Book | null>(null)

  const cats = useMemo(() => Array.from(new Set(BOOKS.map(b => b.category))).sort(), [])
  const filtered = useMemo(() => BOOKS.filter(b => {
    const mQ = q ? (b.title + ' ' + b.author + ' ' + b.category).toLowerCase().includes(q.toLowerCase()) : true
    const mC = cat ? b.category === cat : true
    return mQ && mC
  }), [q, cat])

  return (
    <div className="grid gap-4">
      <div className="card grid md:grid-cols-3 gap-3">
        <input className="input" placeholder="Cari judul/penulis/kategori" value={q} onChange={(e)=>setQ(e.target.value)} />
        <select className="input" value={cat} onChange={(e)=>setCat(e.target.value)}>
          <option value="">Semua kategori</option>
          {cats.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <div className="flex items-center text-sm text-base-muted">{filtered.length} buku</div>
      </div>

      {filtered.length === 0 ? (
        <div className="card">Belum ada data.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((b, idx) => (
            <motion.article
              key={b.id}
              className="card p-0 overflow-hidden hover:shadow-soft transition-shadow cursor-pointer"
              onClick={() => setSelected(b)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.03 }}
            >
              <img src={b.cover_url} alt={b.title} className="w-full h-48 object-cover" loading="lazy" />
              <div className="p-4">
                <h3 className="font-medium">{b.title}</h3>
                <p className="text-sm text-base-muted">{b.author} · <span className="badge">{b.category}</span></p>
                {b.description && <p className="text-sm text-base-muted mt-2 line-clamp-2">{b.description}</p>}
                <p className="text-sm mt-3">Harga: {b.price}</p>
              </div>
            </motion.article>
          ))}
        </div>
      )}

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
              role="dialog" aria-modal="true"
            >
              <div className="flex items-center justify-between border-b border-base-border px-5 h-12">
                <div className="font-medium">{selected.title}</div>
                <button className="navlink" onClick={() => setSelected(null)} aria-label="Tutup">✕</button>
              </div>
              <div className="p-5 grid gap-4">
                <img src={selected.cover_url} alt={selected.title} className="w-full h-64 object-cover rounded-xl" />
                <div className="grid gap-1">
                  <div className="text-sm text-base-muted">{selected.author} · <span className="badge">{selected.category}</span></div>
                  <div className="text-sm">Harga: {selected.price}</div>
                </div>
                {selected.description && <p className="text-sm">{selected.description}</p>}
                <div className="text-xs text-base-muted">*Statis: tidak menampilkan stok & keranjang.</div>
                <div className="flex items-center gap-3">
                  <button className="btn" onClick={() => setSelected(null)}>Tutup</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}