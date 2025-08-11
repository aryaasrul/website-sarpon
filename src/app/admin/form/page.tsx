// src/app/admin/form/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AnimatePresence } from 'framer-motion'
import { 
  useBook, 
  useEvent, 
  useMenuItem, 
  useBean,
  useBookMutations,
  useEventMutations, 
  useMenuMutations,
  useBeanMutations,
  useUpload,
  useRequireStaff
} from '@/hooks'
import LoadingSpinner, { LoadingCard, LoadingOverlay, ErrorMessage } from '@/components/LoadingSpinner'
import type { 
  BookInput, 
  EventInput, 
  MenuItemInput, 
  BeanInput,
  MenuGroup,
  RoastLevel,
  EventStatus
} from '@/lib/types'

type FormType = 'book' | 'event' | 'menu' | 'bean'

// Utility function to convert ISO string to local datetime-local input value
function toLocalInputValue(iso: string) {
  if (!iso) return ''
  const d = new Date(iso)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`
}

// Form field wrapper
function Field({ label, children, required = false }: { 
  label: string
  children: React.ReactNode
  required?: boolean 
}) {
  return (
    <label className="grid gap-1">
      <span className="text-sm text-base-muted">
        {label} {required && <span className="text-red-400">*</span>}
      </span>
      {children}
    </label>
  )
}

// Image upload component
function ImageUpload({ 
  bucket, 
  currentUrl, 
  onUpload, 
  loading 
}: {
  bucket: 'books' | 'events' | 'beans'
  currentUrl?: string | null
  onUpload: (url: string | null) => void
  loading?: boolean
}) {
  const { uploadFile, loading: uploading, error, reset } = useUpload()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const result = await uploadFile(bucket, file)
    if (result.url) {
      onUpload(result.url)
    }
  }

  return (
    <div className="grid gap-2">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="input"
        disabled={loading || uploading}
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
      {currentUrl && (
        <div className="flex gap-2">
          <img src={currentUrl} alt="Preview" className="h-20 w-20 object-cover rounded" />
          <button
            type="button"
            className="btn text-sm"
            onClick={() => {
              onUpload(null)
              reset()
            }}
          >
            Remove
          </button>
        </div>
      )}
      {uploading && <p className="text-sm text-base-muted">Uploading...</p>}
    </div>
  )
}

export default function AdminFormPage() {
  const router = useRouter()
  const sp = useSearchParams()
  const type = (sp.get('type') || '') as FormType
  const id = sp.get('id')

  // Require staff authentication
  const { user, loading: authLoading, isStaff } = useRequireStaff()

  // Validation
  useEffect(() => {
    if (!['book', 'event', 'menu', 'bean'].includes(type)) {
      alert('Type tidak valid. Gunakan ?type=book|event|menu|bean')
      router.replace('/admin')
    }
  }, [type, router])

  // Data hooks
  const { data: book, loading: bookLoading } = useBook(type === 'book' && id ? id : null)
  const { data: event, loading: eventLoading } = useEvent(type === 'event' && id ? id : null)
  const { data: menuItem, loading: menuLoading } = useMenuItem(type === 'menu' && id ? id : null)
  const { data: bean, loading: beanLoading } = useBean(type === 'bean' && id ? id : null)

  // Mutation hooks
  const { createBook, updateBook, loading: bookMutating } = useBookMutations()
  const { createEvent, updateEvent, loading: eventMutating } = useEventMutations()
  const { createMenuItem, updateMenuItem, loading: menuMutating } = useMenuMutations()
  const { createBean, updateBean, loading: beanMutating } = useBeanMutations()

  // Form state
  const [formData, setFormData] = useState<any>(null)

  // Initialize form data
  useEffect(() => {
    if (!type) return

    if (id) {
      // Edit mode - populate from fetched data
      switch (type) {
        case 'book':
          if (book) setFormData(book)
          break
        case 'event':
          if (event) setFormData(event)
          break
        case 'menu':
          if (menuItem) setFormData(menuItem)
          break
        case 'bean':
          if (bean) setFormData(bean)
          break
      }
    } else {
      // Create mode - set defaults
      switch (type) {
        case 'book':
          setFormData({
            title: '',
            author: '',
            category: '',
            price: 0,
            cover_url: '',
            description: '',
            is_published: true
          })
          break
        case 'event':
          setFormData({
            title: '',
            date: new Date().toISOString(),
            location: '',
            is_online: false,
            rsvp_url: '',
            cover_url: '',
            description: '',
            status: 'scheduled' as EventStatus,
            is_published: true
          })
          break
        case 'menu':
          setFormData({
            name: '',
            group: 'Signature' as MenuGroup,
            price: 0,
            badge: '',
            description: '',
            is_available: true,
            sort_order: 0
          })
          break
        case 'bean':
          setFormData({
            name: '',
            origin: '',
            process: '',
            roast: null as RoastLevel | null,
            notes: '',
            photo_url: '',
            is_active: true
          })
          break
      }
    }
  }, [type, id, book, event, menuItem, bean])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData) return

    let result: any = null

    try {
      switch (type) {
        case 'book':
          // Validation
          if (!formData.title || !formData.author || !formData.category) {
            alert('Judul, penulis, dan kategori wajib diisi.')
            return
          }
          if (formData.price <= 0) {
            alert('Harga harus lebih dari 0.')
            return
          }

          if (id) {
            result = await updateBook(id, formData as Partial<BookInput>)
          } else {
            result = await createBook(formData as BookInput)
          }
          break

        case 'event':
          if (!formData.title || !formData.location || !formData.date) {
            alert('Judul, lokasi, dan waktu wajib diisi.')
            return
          }

          if (id) {
            result = await updateEvent(id, formData as Partial<EventInput>)
          } else {
            result = await createEvent(formData as EventInput)
          }
          break

        case 'menu':
          if (!formData.name) {
            alert('Nama menu wajib diisi.')
            return
          }
          if (formData.price <= 0) {
            alert('Harga harus lebih dari 0.')
            return
          }

          if (id) {
            result = await updateMenuItem(id, formData as Partial<MenuItemInput>)
          } else {
            result = await createMenuItem(formData as MenuItemInput)
          }
          break

        case 'bean':
          if (!formData.name || !formData.origin || !formData.notes) {
            alert('Nama, origin, dan notes wajib diisi.')
            return
          }

          if (id) {
            result = await updateBean(id, formData as Partial<BeanInput>)
          } else {
            result = await createBean(formData as BeanInput)
          }
          break
      }

      if (result?.success) {
        router.push('/admin')
      } else {
        alert(`Error: ${result?.error || 'Unknown error'}`)
      }
    } catch (error) {
      alert(`Error: ${error}`)
    }
  }

  // Loading states
  const isLoading = authLoading || bookLoading || eventLoading || menuLoading || beanLoading
  const isMutating = bookMutating || eventMutating || menuMutating || beanMutating

  // Auth check
  if (authLoading) {
    return <LoadingCard text="Checking authentication..." />
  }

  if (!user || !isStaff) {
    return <LoadingCard text="Verifying permissions..." />
  }

  if (isLoading) {
    return <LoadingCard text="Memuat form..." />
  }

  if (!formData) {
    return <LoadingCard text="Menyiapkan form..." />
  }

  const getFormTitle = () => {
    const action = id ? 'Edit' : 'Tambah'
    const entityName = type === 'book' ? 'Buku' : 
                      type === 'event' ? 'Event' : 
                      type === 'menu' ? 'Menu Item' : 'Bean'
    return `${action} ${entityName}`
  }

  return (
    <div className="container py-8 relative">
      <h1 className="text-2xl font-semibold mb-6">{getFormTitle()}</h1>

      <form className="card grid gap-4" onSubmit={handleSubmit}>
        {/* BOOK FORM */}
        {type === 'book' && (
          <>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Judul" required>
                <input
                  className="input"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  required
                />
              </Field>
              <Field label="Penulis" required>
                <input
                  className="input"
                  value={formData.author}
                  onChange={e => setFormData({...formData, author: e.target.value})}
                  required
                />
              </Field>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Kategori" required>
                <input
                  className="input"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  required
                />
              </Field>
              <Field label="Harga" required>
                <input
                  className="input"
                  type="number"
                  min="0"
                  step="1000"
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                  required
                />
              </Field>
            </div>
            <Field label="Cover Image">
              <ImageUpload
                bucket="books"
                currentUrl={formData.cover_url}
                onUpload={url => setFormData({...formData, cover_url: url})}
                loading={isMutating}
              />
            </Field>
            <Field label="Deskripsi">
              <textarea
                className="input"
                rows={4}
                value={formData.description || ''}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </Field>
            <Field label="Status">
              <select
                className="input"
                value={formData.is_published ? 'published' : 'draft'}
                onChange={e => setFormData({...formData, is_published: e.target.value === 'published'})}
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </Field>
          </>
        )}

        {/* EVENT FORM */}
        {type === 'event' && (
          <>
            <Field label="Judul Event" required>
              <input
                className="input"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                required
              />
            </Field>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Waktu" required>
                <input
                  className="input"
                  type="datetime-local"
                  value={toLocalInputValue(formData.date)}
                  onChange={e => setFormData({...formData, date: new Date(e.target.value).toISOString()})}
                  required
                />
              </Field>
              <Field label="Lokasi" required>
                <input
                  className="input"
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                  required
                />
              </Field>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Tipe">
                <select
                  className="input"
                  value={formData.is_online ? 'online' : 'offline'}
                  onChange={e => setFormData({...formData, is_online: e.target.value === 'online'})}
                >
                  <option value="offline">Offline</option>
                  <option value="online">Online</option>
                </select>
              </Field>
              <Field label="Status">
                <select
                  className="input"
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value})}
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
              </Field>
            </div>
            <Field label="RSVP URL">
              <input
                className="input"
                type="url"
                value={formData.rsvp_url || ''}
                onChange={e => setFormData({...formData, rsvp_url: e.target.value})}
                placeholder="https://..."
              />
            </Field>
            <Field label="Cover Image">
              <ImageUpload
                bucket="events"
                currentUrl={formData.cover_url}
                onUpload={url => setFormData({...formData, cover_url: url})}
                loading={isMutating}
              />
            </Field>
            <Field label="Deskripsi">
              <textarea
                className="input"
                rows={4}
                value={formData.description || ''}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </Field>
            <Field label="Publish Status">
              <select
                className="input"
                value={formData.is_published ? 'published' : 'draft'}
                onChange={e => setFormData({...formData, is_published: e.target.value === 'published'})}
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </Field>
          </>
        )}

        {/* MENU FORM */}
        {type === 'menu' && (
          <>
            <Field label="Nama Menu" required>
              <input
                className="input"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                required
              />
            </Field>
            <div className="grid md:grid-cols-3 gap-4">
              <Field label="Grup" required>
                <select
                  className="input"
                  value={formData.group}
                  onChange={e => setFormData({...formData, group: e.target.value})}
                >
                  <option value="Signature">Signature</option>
                  <option value="Espresso">Espresso</option>
                  <option value="Manual">Manual</option>
                  <option value="NonCoffee">Non-Coffee</option>
                </select>
              </Field>
              <Field label="Harga" required>
                <input
                  className="input"
                  type="number"
                  min="0"
                  step="1000"
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                  required
                />
              </Field>
              <Field label="Sort Order">
                <input
                  className="input"
                  type="number"
                  min="0"
                  value={formData.sort_order}
                  onChange={e => setFormData({...formData, sort_order: parseInt(e.target.value) || 0})}
                />
              </Field>
            </div>
            <Field label="Badge (opsional)">
              <input
                className="input"
                value={formData.badge || ''}
                onChange={e => setFormData({...formData, badge: e.target.value})}
                placeholder="Signature, Seasonal, etc."
              />
            </Field>
            <Field label="Deskripsi">
              <textarea
                className="input"
                rows={3}
                value={formData.description || ''}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </Field>
            <Field label="Availability">
              <select
                className="input"
                value={formData.is_available ? 'available' : 'unavailable'}
                onChange={e => setFormData({...formData, is_available: e.target.value === 'available'})}
              >
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </Field>
          </>
        )}

        {/* BEAN FORM */}
        {type === 'bean' && (
          <>
            <Field label="Nama Bean" required>
              <input
                className="input"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                required
              />
            </Field>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Origin" required>
                <input
                  className="input"
                  value={formData.origin}
                  onChange={e => setFormData({...formData, origin: e.target.value})}
                  required
                />
              </Field>
              <Field label="Process">
                <input
                  className="input"
                  value={formData.process || ''}
                  onChange={e => setFormData({...formData, process: e.target.value})}
                  placeholder="Washed, Natural, Honey, etc."
                />
              </Field>
            </div>
            <Field label="Roast Level">
              <select
                className="input"
                value={formData.roast || ''}
                onChange={e => setFormData({...formData, roast: e.target.value || null})}
              >
                <option value="">— Pilih Roast —</option>
                <option value="Light">Light</option>
                <option value="Light-Medium">Light-Medium</option>
                <option value="Medium">Medium</option>
                <option value="Medium-Dark">Medium-Dark</option>
              </select>
            </Field>
            <Field label="Catatan Rasa" required>
              <textarea
                className="input"
                rows={3}
                value={formData.notes}
                onChange={e => setFormData({...formData, notes: e.target.value})}
                required
                placeholder="Cokelat, herbal, citrus, floral, etc."
              />
            </Field>
            <Field label="Foto Bean">
              <ImageUpload
                bucket="beans"
                currentUrl={formData.photo_url}
                onUpload={url => setFormData({...formData, photo_url: url})}
                loading={isMutating}
              />
            </Field>
            <Field label="Status">
              <select
                className="input"
                value={formData.is_active ? 'active' : 'inactive'}
                onChange={e => setFormData({...formData, is_active: e.target.value === 'active'})}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </Field>
          </>
        )}

        {/* FORM ACTIONS */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="btn bg-white text-black"
            disabled={isMutating}
          >
            {isMutating ? 'Menyimpan...' : 'Simpan'}
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => router.push('/admin')}
            disabled={isMutating}
          >
            Batal
          </button>
        </div>
      </form>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isMutating && (
          <LoadingOverlay text={id ? 'Mengupdate...' : 'Menyimpan...'} />
        )}
      </AnimatePresence>
    </div>
  )
}