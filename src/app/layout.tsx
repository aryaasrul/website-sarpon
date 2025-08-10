// src/app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Transition from '@/components/Transition'

export const metadata: Metadata = {
  title: 'Toko Buku & Kopi Terang',
  description: 'Company profile, events, katalog buku — hitam putih.',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className="bg-black text-white">
        <Navbar />
        <main className="container py-6 sm:py-8">
          <Transition>{children}</Transition>
        </main>
        <Footer />
      </body>
    </html>
  )
}