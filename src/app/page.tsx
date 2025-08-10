// src/app/page.tsx
'use client'

import { motion } from 'framer-motion'

export default function Page() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-base-border bg-black">
      <div className="h-14 border-b border-base-border flex items-center px-6">
        <div className="font-semibold">Toko Buku & Kopi Terang</div>
      </div>

      <div className="relative grid lg:grid-cols-12 gap-8 px-6 py-8 sm:py-10 lg:py-16 items-center">
        {/* left */}
        <motion.div
          className="lg:col-span-3 flex flex-col gap-4"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-full" style={{ background: '#FFD166' }} />
            <span className="inline-block h-3 w-3 rounded-full" style={{ background: '#F0822F' }} />
          </div>
          <p className="text-base-muted max-w-xs text-sm leading-relaxed">
            Elevate kopi harianmu. Racikan kami disusun untuk penikmat rasa yang tenang—tanpa gimmick.
          </p>
          <a href="/events" className="text-sm underline underline-offset-4">Learn More ↗</a>

          <motion.div
            className="mt-10 w-32 h-32 sm:w-40 sm:h-40 grid place-items-center ring-dashed"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.05 }}
          >
            <div className="text-xs text-base-muted text-center leading-snug px-4">
              Discover<br/>the perfect brew
            </div>
          </motion.div>
        </motion.div>

        {/* middle image via background cover */}
        <motion.div
          className="lg:col-span-6"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <figure
            className="w-full rounded-2xl border border-base-border shadow-soft
                       bg-center bg-cover
                       aspect-[4/5] sm:aspect-[3/4] md:aspect-[4/3] lg:aspect-[16/10]"
            style={{ backgroundImage: 'url("/DSC00853-Enhanced-NR.jpg")' }}
            aria-label="Hero image"
          />
        </motion.div>

        {/* right */}
        <motion.div
          className="lg:col-span-3 flex flex-col items-start gap-5"
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight">
            Indulge in the<br />Irresistible World<br />of <span className="headline-gradient">Coffee Delights</span>
          </h1>
          <a href="/books" className="btn bg-[#F0822F] text-black hover:opacity-90 border-0">
            Buy Now →
          </a>

          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <div className="h-7 w-7 rounded-full bg-white" />
              <div className="h-7 w-7 rounded-full bg-white/80" />
              <div className="h-7 w-7 rounded-full bg-white/60" />
              <div className="h-7 w-7 rounded-full bg-white/40" />
            </div>
            <div className="text-sm text-base-muted">37k well reviews</div>
          </div>
          <div className="flex gap-1 text-[#F0822F]" aria-label="rating">
            <span>★</span><span>★</span><span>★</span><span>★</span><span className="text-base-muted">★</span>
          </div>
        </motion.div>
      </div>

      {/* watermark (hide on mobile via .hero-watermark) */}
      <div className="hero-watermark pointer-events-none absolute -bottom-6 left-6 right-6">
        <div className="text-outline text-[12vw] leading-none font-extrabold uppercase tracking-tight">
          Terang Coffee
        </div>
      </div>
    </section>
  )
}