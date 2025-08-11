// src/app/coffee/page.tsx
'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useMenu, useBeans } from '@/hooks'
import { LoadingCard, ErrorMessage } from '@/components/LoadingSpinner'
import type { MenuItem, Bean, MenuGroup } from '@/lib/types'

// Group menu items by category
function useMenuByGroup(menuItems: MenuItem[]) {
  return useMemo(() => {
    const grouped = menuItems.reduce((acc, item) => {
      if (!acc[item.group]) acc[item.group] = []
      acc[item.group].push(item)
      return acc
    }, {} as Record<MenuGroup, MenuItem[]>)

    // Sort each group by sort_order
    Object.keys(grouped).forEach(group => {
      grouped[group as MenuGroup].sort((a, b) => a.sort_order - b.sort_order)
    })

    return grouped
  }, [menuItems])
}

// Format price for display
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price)
}

// Menu section component
function MenuSection({ title, items }: { title: string; items: MenuItem[] }) {
  const fadeUp = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } }

  return (
    <motion.section
      className="card"
      variants={fadeUp}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl">{title}</h2>
      </div>
      <ul className="divide-y divide-base-border">
        {items.map((item) => (
          <li key={item.id} className="py-3 flex items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{item.name}</h3>
                {item.badge && <span className="badge">{item.badge}</span>}
              </div>
              {item.description && (
                <p className="text-sm text-base-muted mt-1">{item.description}</p>
              )}
            </div>
            <div className="shrink-0 text-sm font-medium">
              {formatPrice(item.price)}
            </div>
          </li>
        ))}
      </ul>
    </motion.section>
  )
}

// Beans section component
function BeansSection({ beans }: { beans: Bean[] }) {
  const fadeUp = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } }

  return (
    <motion.section
      className="card"
      variants={fadeUp}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl">Line Up Beans</h2>
        <span className="badge">Single Origin</span>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {beans.map((bean, i) => (
          <motion.article
            key={bean.id}
            className="rounded-2xl border border-base-border p-4"
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.22, delay: i * 0.03 }}
          >
            {bean.photo_url && (
              <img 
                src={bean.photo_url} 
                alt={bean.name} 
                className="w-full h-36 object-cover rounded-xl mb-3"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            )}
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-medium">{bean.name}</h3>
              {bean.roast && (
                <span className="badge text-xs">{bean.roast}</span>
              )}
            </div>
            <p className="text-sm text-base-muted mt-1">
              {bean.origin}
              {bean.process && ` · ${bean.process}`}
            </p>
            <p className="text-sm mt-2">{bean.notes}</p>
          </motion.article>
        ))}
      </div>

      {beans.length > 0 && (
        <div className="text-xs text-base-muted mt-4">
          Catatan: Profil roast bisa berubah per batch. Tanyakan barista untuk rekomendasi seduh.
        </div>
      )}
    </motion.section>
  )
}

export default function CoffeePage() {
  const { data: menuItems, loading: menuLoading, error: menuError, refetch: refetchMenu } = useMenu()
  const { data: beans, loading: beansLoading, error: beansError, refetch: refetchBeans } = useBeans()

  const menuByGroup = useMenuByGroup(menuItems || [])
  const fadeUp = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } }

  // Group display names
  const groupNames: Record<MenuGroup, string> = {
    'Signature': 'Signature',
    'Espresso': 'Espresso Based',
    'Manual': 'Manual Brew',
    'NonCoffee': 'Non-Coffee'
  }

  if (menuLoading || beansLoading) {
    return <LoadingCard text="Memuat menu kopi..." />
  }

  return (
    <motion.div
      className="grid gap-6"
      initial="initial"
      animate="animate"
      transition={{ staggerChildren: 0.05 }}
    >
      {/* Hero mini */}
      <motion.section className="card" variants={fadeUp} transition={{ duration: 0.2 }}>
        <h1 className="text-2xl font-semibold mb-2">Coffee Menu</h1>
        <p className="text-base-muted text-sm">
          Hitam–putih, tanpa gimmick. Fokus rasa dan konsistensi. Harga bisa berubah sewaktu-waktu.
        </p>
      </motion.section>

      {/* Menu Error Handling */}
      {menuError && (
        <ErrorMessage error={menuError} onRetry={refetchMenu} />
      )}

      {/* Menu Grid */}
      {menuItems && menuItems.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6">
          {(['Signature', 'Espresso', 'Manual', 'NonCoffee'] as MenuGroup[]).map(group => {
            const items = menuByGroup[group] || []
            if (items.length === 0) return null
            
            return (
              <MenuSection 
                key={group}
                title={groupNames[group]} 
                items={items} 
              />
            )
          })}
        </div>
      )}

      {/* No Menu Items */}
      {menuItems && menuItems.length === 0 && !menuError && (
        <div className="card">Belum ada menu tersedia.</div>
      )}

      {/* Beans Error Handling */}
      {beansError && (
        <ErrorMessage error={beansError} onRetry={refetchBeans} />
      )}

      {/* Line Up Beans */}
      {beans && beans.length > 0 && (
        <BeansSection beans={beans} />
      )}

      {/* No Beans */}
      {beans && beans.length === 0 && !beansError && (
        <motion.div className="card" variants={fadeUp} transition={{ duration: 0.2 }}>
          <h2 className="text-xl mb-2">Line Up Beans</h2>
          <p className="text-base-muted text-sm">Belum ada beans tersedia.</p>
        </motion.div>
      )}

      {/* Note */}
      <motion.div 
        className="card text-sm text-base-muted" 
        variants={fadeUp} 
        transition={{ duration: 0.2 }}
      >
        Request gula/es/susu alternatif? Bilang di kasir. Kami anti rame, pro tenang.
      </motion.div>
    </motion.div>
  )
}