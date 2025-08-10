// src/app/coffee/page.tsx
'use client'

import { motion } from 'framer-motion'

type Item = {
  name: string
  desc?: string
  price: string
  badge?: string
}

type Bean = {
  name: string
  origin: string
  process?: string
  notes: string
  photo?: string // optional: /public/beans/xxx.jpg
}

const signature: Item[] = [
  { name: 'Magic Coffee', desc: 'Base espresso, creamy, low acid', price: '25K', badge: 'Signature' },
  { name: 'Azure Tonic', desc: 'Espresso + tonic, segar & crisp', price: '28K' },
]

const espresso: Item[] = [
  { name: 'Espresso', price: '18K' },
  { name: 'Americano', price: '20K' },
  { name: 'Latte', price: '24K' },
  { name: 'Cappuccino', price: '24K' },
  { name: 'Flat White', price: '24K' },
]

const manualBrew: Item[] = [
  { name: 'V60', desc: 'Single origin, clean cup', price: '26K' },
  { name: 'Kalita', price: '26K' },
]

const nonCoffee: Item[] = [
  { name: 'Chocolate', price: '22K' },
  { name: 'Oat Cocoa', price: '26K' },
  { name: 'Tea (Hot/Cold)', price: '18K' },
]

// Line Up Beans (contoh)
const beans: Bean[] = [
  { name: 'Gayo Atu Lintang', origin: 'Aceh, Indonesia', process: 'Washed', notes: 'Cokelat, herbal, hint spice' },
  { name: 'Kintamani Natural', origin: 'Bali, Indonesia', process: 'Natural', notes: 'Red berries, gula aren, floral' },
  { name: 'Colombia Huila', origin: 'Huila, Colombia', process: 'Washed', notes: 'Citrus, caramel, clean finish' },
]

// Variants animasi
const fadeUp = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } }

function Section({ title, items }: { title: string; items: Item[] }) {
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
        {items.map((it) => (
          <li key={it.name} className="py-3 flex items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{it.name}</h3>
                {it.badge && <span className="badge">{it.badge}</span>}
              </div>
              {it.desc && <p className="text-sm text-base-muted mt-1">{it.desc}</p>}
            </div>
            <div className="shrink-0 text-sm">{it.price}</div>
          </li>
        ))}
      </ul>
    </motion.section>
  )
}

function BeansSection({ list }: { list: Bean[] }) {
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
        {list.map((b, i) => (
          <motion.article
            key={b.name}
            className="rounded-2xl border border-base-border p-4"
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.22, delay: i * 0.03 }}
          >
            {b.photo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={b.photo} alt={b.name} className="w-full h-36 object-cover rounded-xl mb-3" />
            )}
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-medium">{b.name}</h3>
            </div>
            <p className="text-sm text-base-muted mt-1">{b.origin}{b.process ? ` · ${b.process}` : ''}</p>
            <p className="text-sm mt-2">{b.notes}</p>
          </motion.article>
        ))}
      </div>

      <div className="text-xs text-base-muted mt-4">
        Catatan: Profil roast bisa berubah per batch. Tanyakan barista untuk rekomendasi seduh.
      </div>
    </motion.section>
  )
}

export default function CoffeePage() {
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

      {/* Grid menu */}
      <div className="grid md:grid-cols-2 gap-6">
        <Section title="Signature" items={signature} />
        <Section title="Espresso Based" items={espresso} />
        <Section title="Manual Brew" items={manualBrew} />
        <Section title="Non-Coffee" items={nonCoffee} />
      </div>

      {/* Line Up Beans */}
      <BeansSection list={beans} />

      {/* Note */}
      <motion.div className="card text-sm text-base-muted" variants={fadeUp} transition={{ duration: 0.2 }}>
        Request gula/es/susu alternatif? Bilang di kasir. Kami anti rame, pro tenang.
      </motion.div>
    </motion.div>
  )
}