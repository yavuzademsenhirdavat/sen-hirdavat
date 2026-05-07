'use client'

import Link from 'next/link'
import { ShoppingCart, Menu, Phone, Search, X } from 'lucide-react'
import { useCart } from '@/lib/cart'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const CATEGORIES = [
  { label: 'Tüm Ürünler', slug: null },
  { label: 'El Aletleri', slug: 'el-aletleri' },
  { label: 'Elektrikli Aletler', slug: 'elektrikli-aletler' },
  { label: 'Tesisat', slug: 'tesisat' },
  { label: 'Vida & Cıvata', slug: 'vida-civata' },
  { label: 'Boya & Kimya', slug: 'boya-kimya' },
]

export function Navbar() {
  const { itemCount } = useCart()
  const count = itemCount()
  const [search, setSearch] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (search.trim()) {
      router.push(`/urunler?q=${encodeURIComponent(search.trim())}`)
      setSearch('')
      setMenuOpen(false)
    }
  }

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: 'var(--sh-surface)',
        borderBottom: '3px solid var(--sh-accent)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 flex-shrink-0">
          <div
            style={{
              width: 36,
              height: 36,
              background: 'var(--sh-accent)',
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              flexShrink: 0,
            }}
          >
            🔧
          </div>
          <span
            style={{
              fontFamily: 'var(--font-barlow), sans-serif',
              fontWeight: 900,
              fontSize: '1.4rem',
              letterSpacing: 2,
              textTransform: 'uppercase',
              color: 'var(--sh-text)',
            }}
          >
            Şen <span style={{ color: 'var(--sh-accent)' }}>Hırdavat</span>
          </span>
        </Link>

        {/* Arama — masaüstü */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md">
          <div
            className="flex w-full overflow-hidden"
            style={{ border: '1px solid var(--sh-border)' }}
          >
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ürün ara... (vida, boya, boru...)"
              className="flex-1 px-4 py-2 text-sm outline-none"
              style={{ background: 'var(--sh-surface2)', color: 'var(--sh-text)' }}
            />
            <button
              type="submit"
              className="px-4 flex items-center justify-center"
              style={{ background: 'var(--sh-accent)', color: '#fff' }}
            >
              <Search size={16} />
            </button>
          </div>
        </form>

        {/* Sağ: iletişim + sepet + hamburger */}
        <div className="flex items-center gap-3 ml-auto md:ml-0">
          <a
            href="tel:02242541010"
            className="hidden md:flex items-center gap-1.5 text-sm"
            style={{ color: 'var(--sh-muted)' }}
          >
            <Phone size={14} />
            <span style={{ fontFamily: 'var(--font-barlow)', fontWeight: 600, letterSpacing: 1 }}>
              0224 254 10 10
            </span>
          </a>

          <Link href="/sepet" className="relative flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium"
            style={{
              border: '1px solid var(--sh-border)',
              background: 'var(--sh-surface)',
              color: 'var(--sh-text)',
            }}
          >
            <ShoppingCart size={16} style={{ color: 'var(--sh-accent)' }} />
            <span className="hidden sm:inline" style={{ fontFamily: 'var(--font-barlow)', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', fontSize: '0.8rem' }}>Sepet</span>
            {count > 0 && (
              <span
                className="absolute -top-2 -right-2 text-xs w-5 h-5 flex items-center justify-center rounded-full"
                style={{ background: 'var(--sh-accent)', color: '#fff' }}
              >
                {count}
              </span>
            )}
          </Link>

          <button
            className="md:hidden p-2"
            style={{ color: 'var(--sh-text)' }}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Kategori nav — masaüstü */}
      <div
        className="hidden md:flex gap-1 px-6 py-1.5"
        style={{ background: 'var(--sh-surface2)', borderTop: '1px solid var(--sh-border)' }}
      >
        {CATEGORIES.map(({ label, slug }) => (
          <Link
            key={label}
            href={slug ? `/urunler?kategori=${slug}` : '/urunler'}
            className="px-3 py-1 text-xs transition-all"
            style={{
              fontFamily: 'var(--font-barlow)',
              fontWeight: 700,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              border: '1px solid var(--sh-border)',
              color: 'var(--sh-muted)',
              background: 'transparent',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--sh-accent)'
              e.currentTarget.style.borderColor = 'var(--sh-accent)'
              e.currentTarget.style.color = '#fff'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.borderColor = 'var(--sh-border)'
              e.currentTarget.style.color = 'var(--sh-muted)'
            }}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Mobil menü */}
      {menuOpen && (
        <div
          className="md:hidden px-4 py-4 space-y-3"
          style={{ background: 'var(--sh-surface)', borderTop: '1px solid var(--sh-border)' }}
        >
          <form onSubmit={handleSearch} className="flex overflow-hidden" style={{ border: '1px solid var(--sh-border)' }}>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ürün ara..."
              className="flex-1 px-3 py-2 text-sm outline-none"
              style={{ background: 'var(--sh-surface2)', color: 'var(--sh-text)' }}
            />
            <button type="submit" className="px-3" style={{ background: 'var(--sh-accent)', color: '#fff' }}>
              <Search size={16} />
            </button>
          </form>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(({ label, slug }) => (
              <Link
                key={label}
                href={slug ? `/urunler?kategori=${slug}` : '/urunler'}
                className="px-3 py-1 text-xs"
                style={{
                  fontFamily: 'var(--font-barlow)',
                  fontWeight: 700,
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  border: '1px solid var(--sh-border)',
                  color: 'var(--sh-muted)',
                  background: 'var(--sh-surface2)',
                }}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
          </div>

          <a
            href="tel:02242541010"
            className="flex items-center gap-2 text-sm"
            style={{ color: 'var(--sh-accent)' }}
          >
            <Phone size={14} />
            0224 254 10 10
          </a>
        </div>
      )}
    </header>
  )
}
