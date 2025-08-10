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
  { name: 'A. Zakaria', role: 'Owner / Roaster', photo: '/team/zakaria.jpg', bio: 'Ngoprek rasa, jaga konsistensi, anti gimmick.' },
  { name: 'R. Partner', role: 'Head Barista', photo: '/team/partner.jpg', bio: 'Eksekusi resep rapi, service santai tapi sigap.' },
  { name: 'M. Crew', role: 'Books Curator', photo: '/team/crew.jpg', bio: 'Kurasi buku yang bikin mikir, bukan sekadar ramai.' },
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
          Toko Buku & Kopi Terang adalah ruang tenang untuk dua hal sederhana: kopi yang konsisten dan bacaan yang
          jujur. Hitam–putih, tanpa gimmick. Kami percaya rasa yang rapi dan kurasi buku yang tepat bisa bikin kepala
          lebih terang.
        </p>

        <div className="mt-4 grid sm:grid-cols-3 gap-3">
          {[
            { k: 'Fokus', v: 'Kopi konsisten, kurasi buku, obrolan tenang.' },
            { k: 'Gaya', v: 'Minimalis, fungsional, warna hitam–putih.' },
            { k: 'Komitmen', v: 'Rasa jujur, servis rapi, harga masuk akal.' },
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
              <img
                src={t.photo}
                alt={t.name}
                className="w-full h-40 object-cover"
                loading="lazy"
              />
              <div className="p-4">
                <div className="font-medium">{t.name}</div>
                <div className="text-sm text-base-muted">{t.role}</div>
                {t.bio && <p className="text-sm mt-2 text-base-muted">{t.bio}</p>}
              </div>
            </motion.article>
          ))}
        </div>

        <div className="text-xs text-base-muted mt-3">
          *Foto tim placeholder. Taruh file di <code>/public/team/</code> sesuai nama pada data di atas.
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
              (Isi alamatmu di sini) · Ponorogo
            </p>

            <div className="flex items-center gap-2 mt-4">
              <Phone size={16} className="text-base-muted" />
              <div className="font-medium">Telepon</div>
            </div>
            <p className="text-sm text-base-muted mt-1">08xx-xxxx-xxxx</p>

            <div className="flex items-center gap-2 mt-4">
              <Mail size={16} className="text-base-muted" />
              <div className="font-medium">Email</div>
            </div>
            <p className="text-sm text-base-muted mt-1">halo@tokoterang.id</p>
          </motion.div>

          {/* Jam Buka */}
          <motion.div
            className="rounded-2xl border border-base-border p-4"
            variants={pop}
            transition={{ duration: 0.2, delay: 0.03 }}
          >
            <div className="font-medium">Jam Buka</div>
            <ul className="text-sm text-base-muted mt-2 space-y-1">
              <li>Sen–Sab: 10.00 – 22.00</li>
              <li>Minggu: Tutup</li>
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
              <a className="navlink inline-flex items-center gap-2" href="#" aria-label="Instagram">
                <Instagram size={16} /> Instagram
              </a>
              <a className="navlink inline-flex items-center gap-2" href="#" aria-label="WhatsApp">
                <MessageCircle size={16} /> WhatsApp
              </a>
              <a className="navlink inline-flex items-center gap-2" href="mailto:halo@tokoterang.id" aria-label="Email">
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

        <div className="text-xs text-base-muted mt-2">
          *Ganti <code>/map-placeholder.jpg</code> dengan embed peta atau screenshot peta lokasi kedai.
        </div>
      </motion.section>
    </motion.div>
  )
}