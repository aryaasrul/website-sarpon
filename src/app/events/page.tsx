'use client'

import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

type EventItem = {
  id: string
  title: string
  date: string
  location: string
  is_online: boolean
  rsvp_url?: string
  cover: string
  desc: string
}

const EVENTS: EventItem[] = [
  { id:'e1', title:'Bedah Buku Kopi', date:new Date(Date.now()+7*86400000).toISOString(), location:'Kedai Terang', is_online:false, cover:'/events/bedah-buku.jpg', desc:'Diskusi santai soal buku kopi.' },
  { id:'e2', title:'Ngopi & Ngoding', date:new Date(Date.now()+14*86400000).toISOString(), location:'Online', is_online:true, rsvp_url:'#', cover:'/events/ngopi-ngoding.jpg', desc:'Sesi pair-coding ringan.' },
  { id:'e3', title:'Cupping: Single Origin', date:new Date(Date.now()+21*86400000).toISOString(), location:'Kedai Terang', is_online:false, cover:'/events/cupping.jpg', desc:'Bandingkan beberapa origin.' },
]

export default function EventsPage() {
  const [q, setQ] = useState('')
  const [selected, setSelected] = useState<EventItem | null>(null)

  const data = useMemo(
    () =>
      EVENTS.filter(e => (q ? (e.title + ' ' + e.location).toLowerCase().includes(q.toLowerCase()) : true))
        .sort((a,b)=>+new Date(a.date)-+new Date(b.date)),
    [q]
  )

  return (
    <div className="grid gap-4">
      <div className="card grid sm:grid-cols-[1fr_auto] gap-3">
        <input className="input" placeholder="Cari event / lokasi" value={q} onChange={(e)=>setQ(e.target.value)} />
        <div className="flex items-center text-sm text-base-muted">Total: {data.length}</div>
      </div>

      {data.length === 0 ? (
        <div className="card">Belum ada event.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((ev, idx) => (
            <motion.article
              key={ev.id}
              className="card p-0 overflow-hidden hover:shadow-soft transition-shadow cursor-pointer"
              onClick={() => setSelected(ev)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.03 }}
            >
              <img src={ev.cover} alt={ev.title} className="w-full h-40 object-cover" loading="lazy" />
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{ev.title}</h3>
                  {ev.is_online ? <span className="badge">Online</span> : <span className="badge">Offline</span>}
                </div>
                <p className="text-base-muted text-sm mt-1">
                  {new Date(ev.date).toLocaleString('id-ID', { dateStyle:'medium', timeStyle:'short' })} · {ev.location}
                </p>
                <p className="text-sm mt-2 line-clamp-2">{ev.desc}</p>
              </div>
            </motion.article>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key="overlay"
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div
              key="dialog"
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
                <button className="navlink" onClick={() => setSelected(null)} aria-label="Tutup">✕</button>
              </div>
              <div className="p-5 grid gap-4">
                <img src={selected.cover} alt={selected.title} className="w-full h-56 object-cover rounded-xl" />
                <div className="flex items-center gap-2">
                  {selected.is_online ? <span className="badge">Online</span> : <span className="badge">Offline</span>}
                  <span className="badge">
                    {new Date(selected.date).toLocaleString('id-ID', { dateStyle:'medium', timeStyle:'short' })}
                  </span>
                </div>
                <p className="text-sm text-base-muted">{selected.location}</p>
                <p className="text-sm">{selected.desc}</p>
                <div className="flex items-center gap-3">
                  {selected.rsvp_url && <a className="btn" href={selected.rsvp_url}>RSVP</a>}
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