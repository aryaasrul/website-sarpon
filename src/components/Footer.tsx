// src/components/Footer.tsx
export default function Footer() {
  return (
    <footer className="border-t border-base-border mt-10">
      <div className="container py-6 text-sm text-base-muted">
        © {new Date().getFullYear()} Toko Buku & Kopi Terang.
      </div>
    </footer>
  )
}