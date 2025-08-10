// src/app/admin/form/page.tsx
'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

/* ========= Types ========= */
type ID = string

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

type EventItem = {
  id: ID
  title: string
  date: string // ISO
  location: string
  is_online: boolean
  rsvp_url?: string
  cover?: string
  desc?: string
}

type Book = {
  id: ID
  title: string
  author: string
  category: string
  price: string
  cover_url?: string
  description?: string
}

/* ========= Storage helpers ========= */
const KEY = {
  menu: 'tt_admin_menu',
  beans: 'tt_admin_beans',
  events: 'tt_admin_events',
  books: 'tt_admin_books',
} as const

const load = <T,>(k: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback
  try { const raw = localStorage.getItem(k); return raw ? JSON.parse(raw) as T : fallback } catch { return fallback }
}
const save = <T,>(k: string, v: T) => { if (typeof window !== 'undefined') localStorage.setItem(k, JSON.stringify(v)) }
const uid = () => Math.random().toString(36).slice(2)

/* ========= Util kecil ========= */
function toLocalInputValue(iso: string) {
  if (!iso) return ''
  const d = new Date(iso)
  const p = (n:number)=>String(n).padStart(2,'0')
  return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`
}

/* ========= Page ========= */
export default function AdminFormPage() {
  const router = useRouter()
  const sp = useSearchParams()
  const type = (sp.get('type') || '').toLowerCase() as 'menu'|'bean'|'event'|'book'
  const id = sp.get('id')

  // redirect kalau type gak valid
  useEffect(() => {
    if (!['menu','bean','event','book'].includes(type)) {
      alert('Type tidak valid. Gunakan ?type=menu|bean|event|book')
      router.replace('/admin')
    }
  }, [type, router])

  // load dataset sesuai type
  const dataset = useMemo(() => {
    switch (type) {
      case 'menu':  return load<MenuItem[]>(KEY.menu, [])
      case 'bean':  return load<Bean[]>(KEY.beans, [])
      case 'event': return load<EventItem[]>(KEY.events, [])
      case 'book':  return load<Book[]>(KEY.books, [])
      default:      return []
    }
  }, [type])

  // item yang sedang diedit / baru
  const [value, setValue] = useState<any>(null)

  // inisialisasi form (edit / create default)
  useEffect(() => {
    if (!type) return
    if (id) {
      const found = (dataset as any[]).find((x) => x.id === id) || null
      setValue(found)
    } else {
      switch (type) {
        case 'menu':
          setValue<MenuItem>({ id: '', name:'', desc:'', price:'', badge:'', group:'Signature' })
          break
        case 'bean':
          setValue<Bean>({ id:'', name:'', origin:'', process:'', notes:'', roast:'Light' })
          break
        case 'event':
          setValue<EventItem>({ id:'', title:'', date:new Date().toISOString(), location:'', is_online:false, rsvp_url:'', cover:'', desc:'' })
          break
        case 'book':
          setValue<Book>({ id:'', title:'', author:'', category:'', price:'', cover_url:'', description:'' })
          break
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, id])

  // handler simpan
  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!value) return

    // validasi minimal
    if (type === 'menu' && (!value.name || !value.price)) return alert('Nama & harga wajib.')
    if (type === 'bean' && (!value.name || !value.origin || !value.notes)) return alert('Nama, origin, notes wajib.')
    if (type === 'event' && (!value.title || !value.location || !value.date)) return alert('Judul, lokasi, waktu wajib.')
    if (type === 'book' && (!value.title || !value.author || !value.category || !value.price)) return alert('Judul, penulis, kategori, harga wajib.')

    const list = [...(dataset as any[])]
    if (value.id) {
      const idx = list.findIndex((x) => x.id === value.id)
      if (idx >= 0) list[idx] = value
    } else {
      value.id = uid()
      list.unshift(value)
    }

    switch (type) {
      case 'menu':  save(KEY.menu, list as MenuItem[]);  break
      case 'bean':  save(KEY.beans, list as Bean[]);     break
      case 'event': save(KEY.events, list as EventItem[]); break
      case 'book':  save(KEY.books, list as Book[]);     break
    }
    router.push('/admin')
  }

  // UI form per type
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-semibold mb-6">
        {id ? 'Edit' : 'Tambah'} {type === 'menu' ? 'Coffee Menu' : type === 'bean' ? 'Bean' : type === 'event' ? 'Event' : 'Buku'}
      </h1>

      {!value ? (
        <div className="card">Memuat form…</div>
      ) : (
        <form className="card grid gap-3" onSubmit={handleSave}>
          {/* MENU */}
          {type === 'menu' && (
            <>
              <Field label="Nama">
                <input className="input" value={value.name} onChange={e=>setValue({...value, name:e.target.value})} required />
              </Field>
              <div className="grid md:grid-cols-2 gap-3">
                <Field label="Harga">
                  <input className="input" value={value.price} onChange={e=>setValue({...value, price:e.target.value})} required />
                </Field>
                <Field label="Badge (opsional)">
                  <input className="input" value={value.badge ?? ''} onChange={e=>setValue({...value, badge:e.target.value})} placeholder="Signature / Seasonal" />
                </Field>
              </div>
              <Field label="Grup">
                <select className="input" value={value.group} onChange={e=>setValue({...value, group: e.target.value})}>
                  <option value="Signature">Signature</option>
                  <option value="Espresso">Espresso</option>
                  <option value="Manual">Manual</option>
                  <option value="NonCoffee">NonCoffee</option>
                </select>
              </Field>
              <Field label="Deskripsi (opsional)">
                <textarea className="input" rows={3} value={value.desc ?? ''} onChange={e=>setValue({...value, desc:e.target.value})} />
              </Field>
            </>
          )}

          {/* BEAN */}
          {type === 'bean' && (
            <>
              <Field label="Nama Bean">
                <input className="input" value={value.name} onChange={e=>setValue({...value, name:e.target.value})} required />
              </Field>
              <div className="grid md:grid-cols-2 gap-3">
                <Field label="Origin">
                  <input className="input" value={value.origin} onChange={e=>setValue({...value, origin:e.target.value})} required />
                </Field>
                <Field label="Process (opsional)">
                  <input className="input" value={value.process ?? ''} onChange={e=>setValue({...value, process:e.target.value})} />
                </Field>
              </div>
              <Field label="Roast (opsional)">
                <select className="input" value={value.roast ?? ''} onChange={e=>setValue({...value, roast:e.target.value})}>
                  <option value="">—</option>
                  <option value="Light">Light</option>
                  <option value="Light-Medium">Light-Medium</option>
                  <option value="Medium">Medium</option>
                  <option value="Medium-Dark">Medium-Dark</option>
                </select>
              </Field>
              <Field label="Catatan rasa">
                <textarea className="input" rows={3} value={value.notes} onChange={e=>setValue({...value, notes:e.target.value})} required />
              </Field>
              <Field label="Foto (opsional)">
                <input className="input" value={value.photo ?? ''} onChange={e=>setValue({...value, photo:e.target.value})} placeholder="/beans/xxx.jpg" />
              </Field>
            </>
          )}

          {/* EVENT */}
          {type === 'event' && (
            <>
              <Field label="Judul Event">
                <input className="input" value={value.title} onChange={e=>setValue({...value, title:e.target.value})} required />
              </Field>
              <div className="grid md:grid-cols-2 gap-3">
                <Field label="Waktu">
                  <input
                    className="input"
                    type="datetime-local"
                    value={toLocalInputValue(value.date)}
                    onChange={e=>setValue({...value, date: new Date(e.target.value).toISOString()})}
                    required
                  />
                </Field>
                <Field label="Lokasi">
                  <input className="input" value={value.location} onChange={e=>setValue({...value, location:e.target.value})} required />
                </Field>
              </div>
              <Field label="Tipe">
                <select className="input" value={value.is_online ? 'online' : 'offline'} onChange={e=>setValue({...value, is_online: e.target.value==='online'})}>
                  <option value="offline">Offline</option>
                  <option value="online">Online</option>
                </select>
              </Field>
              <div className="grid md:grid-cols-2 gap-3">
                <Field label="RSVP URL (opsional)">
                  <input className="input" value={value.rsvp_url ?? ''} onChange={e=>setValue({...value, rsvp_url:e.target.value})} />
                </Field>
                <Field label="Cover (opsional)">
                  <input className="input" value={value.cover ?? ''} onChange={e=>setValue({...value, cover:e.target.value})} placeholder="/events/xxx.jpg" />
                </Field>
              </div>
              <Field label="Deskripsi (opsional)">
                <textarea className="input" rows={4} value={value.desc ?? ''} onChange={e=>setValue({...value, desc:e.target.value})} />
              </Field>
            </>
          )}

          {/* BOOK */}
          {type === 'book' && (
            <>
              <div className="grid md:grid-cols-2 gap-3">
                <Field label="Judul">
                  <input className="input" value={value.title} onChange={e=>setValue({...value, title:e.target.value})} required />
                </Field>
                <Field label="Penulis">
                  <input className="input" value={value.author} onChange={e=>setValue({...value, author:e.target.value})} required />
                </Field>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <Field label="Kategori">
                  <input className="input" value={value.category} onChange={e=>setValue({...value, category:e.target.value})} required />
                </Field>
                <Field label="Harga">
                  <input className="input" value={value.price} onChange={e=>setValue({...value, price:e.target.value})} required />
                </Field>
              </div>
              <Field label="Cover URL (opsional)">
                <input className="input" value={value.cover_url ?? ''} onChange={e=>setValue({...value, cover_url:e.target.value})} placeholder="/books/xxx.jpg" />
              </Field>
              <Field label="Deskripsi (opsional)">
                <textarea className="input" rows={4} value={value.description ?? ''} onChange={e=>setValue({...value, description:e.target.value})} />
              </Field>
            </>
          )}

          <div className="flex gap-2 pt-2">
            <button type="submit" className="btn">Simpan</button>
            <button type="button" className="btn" onClick={()=>router.push('/admin')}>Batal</button>
          </div>
        </form>
      )}
    </div>
  )
}

/* ========= Small Field wrapper ========= */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1">
      <span className="text-sm text-base-muted">{label}</span>
      {children}
    </label>
  )
}