// src/components/Navbar.tsx
import Link from 'next/link'

export default function Navbar() {
  return (
    <header className="border-b border-base-border">
      <nav className="container flex items-center justify-between h-14">
        <Link href="/" className="font-semibold tracking-wide">TERANG</Link>
        <div className="flex items-center gap-5">
          <Link className="navlink" href="/coffee">Coffee</Link>
          <Link className="navlink" href="/events">Events</Link>
          <Link className="navlink" href="/books">Katalog Buku</Link>
          <Link className="navlink" href="/tentang-kami">Tentang Kami</Link>
        </div>
      </nav>
    </header>
  )
}