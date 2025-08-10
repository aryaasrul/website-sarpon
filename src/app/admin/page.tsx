// src/app/admin/page.tsx
'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

type ID = string

type Book = {
  id: ID
  title: string
  author: string
  category: string
  price: string
  cover_url?: string
  description?: string
}

type EventItem = {
  id: ID
  title: string
  date: string
  location: string
  is_online: boolean
  rsvp_url?: string
  cover?: string
  desc?: string
}

type MenuItem = {
  id: ID
  name: string
  desc?: string
  price: string
  badge?: string
  group: 'Signature' | 'Espresso' | 'Manual' | 'NonCoffee'
}

type Bean = {
  id: ID
  name: string
  origin: string
  process?: string
  notes: string
  roast?: 'Light' | 'Light-Medium' | 'Medium' | 'Medium-Dark'
  photo?: string
}

const KEY = {
  books: 'tt_admin_books',
  events: 'tt_admin_events',
  menu: 'tt_admin_menu',
  beans: 'tt_admin_beans',
} as const

const SEED_BOOKS: Book[] = [
  { id: 'b1', title: 'Fiqh Islam', author: 'Sayyid Sabiq', category: 'Agama', price: 'Rp65.000', description: 'Kitab fiqh ringkas untuk santri.' },
  { id: 'b2', title: 'Algoritma Dasar', author: 'A. Junaedi', category: 'Teknis', price: 'Rp78.000', description: 'Pengantar algoritma praktis.' },
]

const SEED_EVENTS: EventItem[] = [
  { id: 'e1', title: 'Bedah Buku Kopi', date: new Date(Date.now()+7*86400000).toISOString(), location: 'Kedai Terang', is_online: false },
  { id: 'e2', title: 'Ngopi & Ngoding', date: new Date(Date.now()+14*86400000).toISOString(), location: 'Online', is_online: true },
]

const SEED_MENU: MenuItem[] = [
  { id:'m1', name:'Magic Coffee', price:'25K', badge:'Signature', group:'Signature' },
  { id:'m2', name:'Latte', price:'24K', group:'Espresso' },
]

const SEED_BEANS: Bean[] = [
  { id:'be1', name:'Gayo Atu Lintang', origin:'Aceh, Indonesia', process:'Washed', notes:'Cokelat, herbal', roast:'Medium' },
  { id:'be2', name:'Kintamani Natural', origin:'Bali, Indonesia', process:'Natural', notes:'Red berries, gula aren', roast:'Light-Medium' },
]

function load<T>(k: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try { const raw = localStorage.getItem(k); return raw ? JSON.parse(raw) as T : fallback } catch { return fallback }
}
function save<T>(k: string, v: T) {
  if (typeof window === 'undefined') return
  localStorage.setItem(k, JSON.stringify(v))
}

function RowActions({ editHref, onDelete }: { editHref: string; onDelete: () => void }) {
  return (
    <div className="flex gap-2">
      <Link href={editHref} className="btn">Edit</Link>
      <button className="btn" onClick={onDelete}>Hapus</button>
    </div>
  )
}

function ListTable({ headers, rows }: { headers: (string|JSX.Element)[]; rows: ( (string|JSX.Element)[] )[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-base-muted border-b border-base-border">
            {headers.map((h,i)=><th key={i} className="py-2 pr-4">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.length===0 ? (
            <tr><td className="py-4 text-base-muted">Tidak ada data.</td></tr>
          ) : rows.map((r,ri)=>(
            <tr key={ri} className="border-b border-base-border/60">
              {r.map((c,ci)=><td key={ci} className="py-2 pr-4 align-top">{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

type Tab = 'Books'|'Events'|'Coffee Menu'|'Beans'

export default function AdminDashboard() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('Books')

  useEffect(() => {
    if (!localStorage.getItem('isAdmin')) router.replace('/admin/login')
  }, [router])

  const [books, setBooks] = useState<Book[]>([])
  const [events, setEvents] = useState<EventItem[]>([])
  const [menu, setMenu] = useState<MenuItem[]>([])
  const [beans, setBeans] = useState<Bean[]>([])

  useEffect(() => {
    setBooks(load(KEY.books, SEED_BOOKS))
    setEvents(load(KEY.events, SEED_EVENTS))
    setMenu(load(KEY.menu, SEED_MENU))
    setBeans(load(KEY.beans, SEED_BEANS))
  }, [])

  useEffect(() => { save(KEY.books, books) }, [books])
  useEffect(() => { save(KEY.events, events) }, [events])
  useEffect(() => { save(KEY.menu, menu) }, [menu])
  useEffect(() => { save(KEY.beans, beans) }, [beans])

  const count = useMemo(() => ({
    books: books.length,
    events: events.length,
    menu: menu.length,
    beans: beans.length,
  }), [books, events, menu, beans])

  return (
    <div className="grid gap-6">
      <header className="card">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl font-semibold">Admin (Dummy)</h1>
          <div className="flex flex-wrap gap-2">
            {(['Books','Events','Coffee Menu','Beans'] as Tab[]).map(t => (
              <button
                key={t}
                className={`btn ${tab===t?'bg-white text-black':''}`}
                onClick={()=>setTab(t)}
              >
                {t}
              </button>
            ))}
            <button
              className="btn bg-red-500 text-white"
              onClick={() => {
                localStorage.removeItem('isAdmin')
                router.push('/admin/login')
              }}
            >
              Logout
            </button>
          </div>
        </div>
        <p className="text-base-muted text-sm mt-2">
          *Versi dummy: data tersimpan di <code>localStorage</code>.
        </p>
      </header>

      {/* Books */}
      {tab === 'Books' && (
        <section className="card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-medium">Books <span className="badge">{count.books}</span></h2>
            <Link href="/admin/form?type=book" className="btn">+ Tambah Buku</Link>
          </div>
          <ListTable
            headers={['Judul','Penulis','Kategori','Harga','Aksi']}
            rows={books.map(b => [
              b.title, b.author, b.category, b.price,
              <RowActions
                key={b.id}
                editHref={`/admin/form?type=book&id=${b.id}`}
                onDelete={()=>setBooks(prev => prev.filter(x=>x.id!==b.id))}
              />
            ])}
          />
        </section>
      )}

      {/* Events */}
      {tab === 'Events' && (
        <section className="card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-medium">Events <span className="badge">{count.events}</span></h2>
            <Link href="/admin/form?type=event" className="btn">+ Tambah Event</Link>
          </div>
          <ListTable
            headers={['Judul','Waktu','Lokasi','Tipe','Aksi']}
            rows={events.map(ev => [
              ev.title,
              new Date(ev.date).toLocaleString('id-ID',{ dateStyle:'medium', timeStyle:'short' }),
              ev.location,
              ev.is_online ? 'Online' : 'Offline',
              <RowActions
                key={ev.id}
                editHref={`/admin/form?type=event&id=${ev.id}`}
                onDelete={()=>setEvents(prev => prev.filter(x=>x.id!==ev.id))}
              />
            ])}
          />
        </section>
      )}

      {/* Coffee Menu */}
      {tab === 'Coffee Menu' && (
        <section className="card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-medium">Coffee Menu <span className="badge">{count.menu}</span></h2>
            <Link href="/admin/form?type=menu" className="btn">+ Tambah Item</Link>
          </div>
          <ListTable
            headers={['Nama','Grup','Harga','Badge','Aksi']}
            rows={menu.map(m => [
              m.name, m.group, m.price, m.badge ?? '-',
              <RowActions
                key={m.id}
                editHref={`/admin/form?type=menu&id=${m.id}`}
                onDelete={()=>setMenu(prev => prev.filter(x=>x.id!==m.id))}
              />
            ])}
          />
        </section>
      )}

      {/* Beans */}
      {tab === 'Beans' && (
        <section className="card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-medium">Line Up Beans <span className="badge">{count.beans}</span></h2>
            <Link href="/admin/form?type=bean" className="btn">+ Tambah Bean</Link>
          </div>
          <ListTable
            headers={['Nama','Origin','Process','Roast','Aksi']}
            rows={beans.map(b => [
              b.name, b.origin, b.process ?? '-', b.roast ?? '-',
              <RowActions
                key={b.id}
                editHref={`/admin/form?type=bean&id=${b.id}`}
                onDelete={()=>setBeans(prev => prev.filter(x=>x.id!==b.id))}
              />
            ])}
          />
        </section>
      )}
    </div>
  )
}