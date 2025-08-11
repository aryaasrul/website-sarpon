// src/app/page.tsx
'use client'

import { motion } from 'framer-motion'

export default function Page() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-base-border bg-black">
      <div className="h-14 border-b border-base-border flex items-center px-6">
        <div className="font-semibold">Toko Buku & Kopi Terang</div>
      </div>

      <div className="relative grid lg:grid-cols-12 gap-8 px-6 py-8 sm:py-10 lg:py-16 items-center min-h-[600px]">
        {/* left content */}
        <motion.div
          className="lg:col-span-3 flex flex-col gap-4 z-10"
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

          {/* Circular Badge - Animated */}
          <motion.div
            className="mt-10 w-32 h-32 sm:w-40 sm:h-40 relative grid place-items-center border border-white/20 rounded-full bg-black/40 backdrop-blur-sm"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ 
              scale: [0.9, 1, 0.9], 
              opacity: [0.7, 1, 0.7],
              rotate: [0, 360]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {/* Inner rotating text */}
            <motion.div
              className="absolute inset-2 border border-white/10 rounded-full flex items-center justify-center"
              animate={{ rotate: [0, -360] }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <div className="text-xs text-white text-center leading-tight px-4">
                Discover<br/>the perfect<br/>brew
              </div>
            </motion.div>
            
            {/* Decorative dots */}
            <motion.div
              className="absolute top-2 left-1/2 w-1 h-1 bg-[#F0822F] rounded-full"
              animate={{ rotate: [0, 360] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            <motion.div
              className="absolute bottom-2 left-1/2 w-1 h-1 bg-[#FFD166] rounded-full"
              animate={{ rotate: [0, -360] }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </motion.div>
        </motion.div>

        {/* Full background hero image */}
        <motion.div
          className="lg:col-span-6 absolute inset-0 lg:relative lg:inset-auto"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div
            className="w-full h-full bg-center bg-cover rounded-2xl lg:rounded-none"
            style={{ 
              backgroundImage: 'url("/DSC00853-Enhanced-NR.jpg")',
              backgroundPosition: 'center center'
            }}
          >
            {/* Overlay gradient for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent lg:hidden" />
            <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-black via-transparent to-black/60" />
          </div>
        </motion.div>

        {/* right content */}
        <motion.div
          className="lg:col-span-3 flex flex-col items-start gap-5 z-10 lg:pl-4"
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25, delay: 0.1 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight text-white">
            Indulge in the<br />
            <span className="text-[#F0822F]">Irresistible</span><br />
            World of <span className="headline-gradient">Coffee Delights</span>
          </h1>
          
          <motion.a 
            href="/books" 
            className="btn bg-[#F0822F] text-black hover:bg-[#E07429] border-0 px-8 py-3 text-sm font-medium transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Buy Now →
          </motion.a>

          {/* Reviews section */}
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <div className="flex -space-x-2">
              {[0.9, 0.7, 0.5, 0.3].map((opacity, i) => (
                <motion.div 
                  key={i}
                  className="h-7 w-7 rounded-full bg-white border-2 border-black"
                  style={{ opacity }}
                  animate={{ 
                    y: [0, -2, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
            <div className="text-sm text-base-muted">37k well reviews</div>
          </motion.div>
          
          <motion.div 
            className="flex gap-1 text-[#F0822F]" 
            aria-label="rating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {[...Array(4)].map((_, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.1 }}
              >
                ★
              </motion.span>
            ))}
            <span className="text-base-muted">★</span>
          </motion.div>
        </motion.div>
      </div>

      {/* watermark (hide on mobile) */}
      <motion.div 
        className="hero-watermark pointer-events-none absolute -bottom-6 left-6 right-6 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 1, delay: 0.8 }}
      >
        <motion.div 
          className="text-outline text-[12vw] leading-none font-extrabold uppercase tracking-tight"
          animate={{ 
            x: [0, 10, 0],
            scale: [1, 1.02, 1]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          Terang Coffee
        </motion.div>
      </motion.div>
    </section>
  )
}