// src/app/tentang-kami/page.tsx
'use client'

import { MapPin, Mail, Phone, Instagram, MessageCircle } from 'lucide-react'
import { motion } from 'framer-motion'

type Team = {
  name: string
  role: string
  photo: string // path di /public/team/...
  bio?: string
}

const TEAM: Team[] = [
  { name: 'Syafira', role: 'Conceptor', photo: '/team/60D62A14-6A64-4E80-B931-743720185577.PNG', bio: 'Tata Ruang, Tata Tampilan' },
  { name: 'Arya', role: 'Curator', photo: '/team/904C342B-A0DA-4FD7-8671-00741720C42A.PNG', bio: 'Kurasi buku, Kurasi kopi.' },
  { name: 'Naufal', role: 'Executor', photo: '/team/D8959784-EAE9-45C1-88B6-A94CB3C33166.PNG', bio: 'Eksekusi rapi, Service sigap.' },
]

// Variants animasi
const fadeUp = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } }
const pop = { initial: { opacity: 0, scale: 0.98 }, animate: { opacity: 1, scale: 1 } }

export default function TentangKamiPage() {
  return (
    <motion.div
      className="grid gap-6"
      initial="initial"
      animate="animate"
      transition={{ staggerChildren: 0.06 }}
    >
      {/* Profil Bisnis */}
      <motion.section
        className="card"
        variants={fadeUp}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        <h1 className="text-2xl font-semibold mb-2">Tentang Kami</h1>
        <p className="text-base-muted text-sm">
          Toko Buku & Kopi Terang adalah salah satu cabang dari Toko Buku & Kitab Terang yang berdiri sejak 1983.
          Kami memperbarui konsep karena sadar bahwa minat baca dan minum kopi adalah pasangan yang saling melengkapi.
          Kopi menjaga tempo, buku menjaga arah.
          Di sini, kami merawat keduanya—memberikan ruang tenang, rasa yang konsisten, dan kurasi bacaan yang jujur.
          Kami percaya tempat yang baik adalah yang membuat kepala lebih TERANG.
        </p>

        <div className="mt-4 grid sm:grid-cols-3 gap-3">
          {[
            { k: 'Komitmen', v: 'Melestarikan minat baca melalui kurasi buku, diskusi, dan rak yang selalu hidup' },
            { k: 'Konsisten', v: 'Menjaga rasa kopi yang jujur lewat resep terukur dan proses yang rapi.' },
            { k: 'Adaptif', v: 'Terbuka pada metode baru, kolaborasi, dan perubahan kebutuhan pembaca dan penikmat kopi di masa depan' },
          ].map((it, i) => (
            <motion.div
              key={it.k}
              className="rounded-2xl border border-base-border p-4"
              variants={pop}
              transition={{ duration: 0.2, delay: i * 0.03 }}
            >
              <div className="text-sm text-base-muted">{it.k}</div>
              <div className="mt-1">{it.v}</div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Our Team */}
      <motion.section
        className="card"
        variants={fadeUp}
        transition={{ duration: 0.25 }}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl">Our Team</h2>
          <span className="badge">Small Team</span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TEAM.map((t, i) => (
            <motion.article
              key={t.name}
              className="rounded-2xl border border-base-border overflow-hidden"
              variants={pop}
              transition={{ duration: 0.22, delay: i * 0.04 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <div className="w-full aspect-[3/4] overflow-hidden bg-gradient-to-b from-orange-50/30 to-orange-100/30"> 
                <img
                    src={t.photo}
                    alt={t.name}
                    className="w-full h-full object-contain p-2"
                    loading="lazy"
                />
              </div>  
              <div className="p-4">
                <div className="font-medium">{t.name}</div>
                <div className="text-sm text-base-muted">{t.role}</div>
                {t.bio && <p className="text-sm mt-2 text-base-muted">{t.bio}</p>}
              </div>
            </motion.article>
          ))}
        </div>
      </motion.section>

      {/* Kontak */}
      <motion.section
        className="card"
        variants={fadeUp}
        transition={{ duration: 0.25 }}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl">Kontak</h2>
          <span className="badge">Ponorogo</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          {/* Info */}
          <motion.div
            className="rounded-2xl border border-base-border p-4"
            variants={pop}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-base-muted" />
              <div className="font-medium">Alamat</div>
            </div>
            <p className="text-sm text-base-muted mt-1">
              Jl. Batoro Katong, Komplek pertokoan pasarpon · Ponorogo
            </p>

            <div className="flex items-center gap-2 mt-4">
              <Phone size={16} className="text-base-muted" />
              <div className="font-medium">Telepon</div>
            </div>
            <p className="text-sm text-base-muted mt-1">0851-6166-0183</p>

            <div className="flex items-center gap-2 mt-4">
              <Mail size={16} className="text-base-muted" />
              <div className="font-medium">Email</div>
            </div>
            <p className="text-sm text-base-muted mt-1">tokoterang83@gmail.com</p>
          </motion.div>

          {/* Jam Buka */}
          <motion.div
            className="rounded-2xl border border-base-border p-4"
            variants={pop}
            transition={{ duration: 0.2, delay: 0.03 }}
          >
            <div className="font-medium">Jam Buka</div>
            <ul className="text-sm text-base-muted mt-2 space-y-1">
              <li>Sen–Min: 17.00 – 00.00</li>
            </ul>
            <div className="text-xs text-base-muted mt-3">*Jam fleksibel saat event.</div>
          </motion.div>

          {/* Sosial */}
          <motion.div
            className="rounded-2xl border border-base-border p-4"
            variants={pop}
            transition={{ duration: 0.2, delay: 0.06 }}
          >
            <div className="font-medium">Sosial</div>
            <div className="flex flex-col gap-2 mt-2 text-sm">
              <a className="navlink inline-flex items-center gap-2" href="https://www.instagram.com/tokobukudankopi.terang/" aria-label="Instagram">
                <Instagram size={16} /> Instagram
              </a>
              <a className="navlink inline-flex items-center gap-2" href="#" aria-label="WhatsApp">
                <MessageCircle size={16} /> WhatsApp
              </a>
              <a className="navlink inline-flex items-center gap-2" href="mailto:tokoterang83@gmail.com" aria-label="Email">
                <Mail size={16} /> Email
              </a>
            </div>
          </motion.div>
        </div>

        {/* Map placeholder */}
        <motion.div
          className="rounded-2xl border border-base-border p-0 overflow-hidden mt-4"
          variants={pop}
          transition={{ duration: 0.22, delay: 0.08 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/map-placeholder.jpg"
            alt="Peta lokasi"
            className="w-full h-56 object-cover"
          />
        </motion.div>

        
      </motion.section>
    </motion.div>
  )
}