// src/components/Navbar.tsx
'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { href: '/coffee', label: 'Coffee' },
    { href: '/events', label: 'Events' },
    { href: '/books', label: 'Katalog Buku' },
    { href: '/tentang-kami', label: 'Tentang Kami' },
  ]

  return (
    <header className="border-b border-base-border">
      <nav className="container flex items-center justify-between h-14">
        {/* Logo - tetap sama */}
        <Link href="/" className="font-semibold tracking-wide">TERANG</Link>
        
        {/* Desktop Navigation - tetap sama, hanya ditambah responsive class */}
        <div className="hidden md:flex items-center gap-5">
          <Link className="navlink" href="/coffee">Coffee</Link>
          <Link className="navlink" href="/events">Events</Link>
          <Link className="navlink" href="/books">Katalog Buku</Link>
          <Link className="navlink" href="/tentang-kami">Tentang Kami</Link>
        </div>

        {/* Mobile Hamburger Button - TAMBAHAN UNTUK RESPONSIVE */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-6 h-6 space-y-1"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <motion.span
            className="w-5 h-0.5 bg-white block"
            animate={{
              rotate: isOpen ? 45 : 0,
              y: isOpen ? 6 : 0,
            }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            className="w-5 h-0.5 bg-white block"
            animate={{
              opacity: isOpen ? 0 : 1,
            }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            className="w-5 h-0.5 bg-white block"
            animate={{
              rotate: isOpen ? -45 : 0,
              y: isOpen ? -6 : 0,
            }}
            transition={{ duration: 0.2 }}
          />
        </button>
      </nav>

      {/* Mobile Menu - TAMBAHAN UNTUK RESPONSIVE */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden border-t border-base-border mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div className="container py-4 space-y-4">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    className="block text-white hover:text-base-muted transition-colors py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}