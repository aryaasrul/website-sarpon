// src/app/events/page.tsx
'use client'

import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useEvents } from '@/hooks'
import { LoadingCard, ErrorMessage } from '@/components/LoadingSpinner'
import type { Event } from '@/lib/types'

export default function EventsPage() {
  const { data: events, loading, error, refetch } = useEvents()
  const [q, setQ] = useState('')
  const [selected, setSelected] = useState<Event | null>(null)

  // Filter and sort events
  const filteredEvents = useMemo(() => {
    if (!events) return []
    
    const filtered = events.filter(event => 
      q ? (event.title + ' ' + event.location).toLowerCase().includes(q.toLowerCase()) : true
    )
    
    // Sort by date (upcoming first)
    return filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [events, q])

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short'
    })
  }

  // Check if event is past
  const isPastEvent = (dateString: string) => {
    return new Date(dateString) < new Date()
  }

  if (loading) {
    return <LoadingCard text="Memuat daftar event..." />
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={refetch} />
  }

  return (
    <div className="grid gap-4">
      {/* Search */}
      <div className="card grid sm:grid-cols-[1fr_auto] gap-3">
        <input 
          className="input" 
          placeholder="Cari event atau lokasi" 
          value={q} 
          onChange={(e) => setQ(e.target.value)} 
        />
        <div className="flex items-center text-sm text-base-muted">
          Total: {filteredEvents.length}
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="card">
          {q ? 'Tidak ada event yang sesuai dengan pencarian.' : 'Belum ada event yang dijadwalkan.'}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents.map((event, idx) => (
            <motion.article
              key={event.id}
              className={`card p-0 overflow-hidden hover:shadow-soft transition-shadow cursor-pointer ${
                isPastEvent(event.date) ? 'opacity-60' : ''
              }`}
              onClick={() => setSelected(event)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.03 }}
            >
              {event.cover_url ? (
                <img 
                  src={event.cover_url} 
                  alt={event.title} 
                  className="w-full h-40 object-cover" 
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              ) : (
                <div className="w-full h-40 bg-base-border flex items-center justify-center">
                  <span className="text-base-muted text-sm">No Image</span>
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{event.title}</h3>
                  <div className="flex gap-1">
                    {event.is_online ? (
                      <span className="badge">Online</span>
                    ) : (
                      <span className="badge">Offline</span>
                    )}
                    {isPastEvent(event.date) && (
                      <span className="badge">Selesai</span>
                    )}
                  </div>
                </div>
                <p className="text-base-muted text-sm">
                  {formatDate(event.date)} · {event.location}
                </p>
                {event.description && (
                  <p className="text-sm mt-2 line-clamp-2">{event.description}</p>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      )}

      {/* Event Detail Modal */}
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
                    className="w-full h-56 object-cover rounded-xl" 
                  />
                )}
                <div className="flex items-center gap-2 flex-wrap">
                  {selected.is_online ? (
                    <span className="badge">Online</span>
                  ) : (
                    <span className="badge">Offline</span>
                  )}
                  <span className="badge">
                    {formatDate(selected.date)}
                  </span>
                  {selected.status && selected.status !== 'scheduled' && (
                    <span className="badge">
                      {selected.status === 'cancelled' ? 'Dibatalkan' : 'Selesai'}
                    </span>
                  )}
                  {isPastEvent(selected.date) && (
                    <span className="badge">Event Selesai</span>
                  )}
                </div>
                <p className="text-sm text-base-muted">
                  <strong>Lokasi:</strong> {selected.location}
                </p>
                {selected.description && (
                  <p className="text-sm">{selected.description}</p>
                )}
                <div className="flex items-center gap-3">
                  {selected.rsvp_url && !isPastEvent(selected.date) && (
                    <a 
                      className="btn" 
                      href={selected.rsvp_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      RSVP
                    </a>
                  )}
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