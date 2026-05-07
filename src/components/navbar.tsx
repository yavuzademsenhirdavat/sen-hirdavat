'use client'

import Link from 'next/link'
import { ShoppingCart, Search, Menu, X, MessageCircle } from 'lucide-react'
import { useCart } from '@/lib/cart'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const NAV_LINKS = [
  { label: 'El Aletleri', q: 'El Aletleri' },
  { label: 'Elektrikli', q: 'Elektrikli' },
  { label: 'Vida & Cıvata', q: 'Vida & Cıvata' },
  { label: 'Tesisat', q: 'Tesisat' },
  { label: 'Boya', q: 'Boya' },
  { label: 'İş Güvenliği', q: 'İş Güvenliği' },
]

export function Navbar() {
  const { itemCount } = useCart()
  const count = itemCount()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [search, setSearch] = useState('')
  const router = useRouter()

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (search.trim()) {
      router.push(`/urunler?q=${encodeURIComponent(search.trim())}`)
      setSearch('')
      setSearchOpen(false)
      setMenuOpen(false)
    }
  }

  return (
    <>
      {/* ─── Tek satır header ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#0b1220] border-b border-white/[0.06]">
        <div className="max-w-[1280px] mx-auto px-4 h-[68px] flex items-center gap-4">

          {/* Mobil hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden text-slate-300 p-1.5 hover:text-white transition shrink-0"
            aria-label="Menü"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-baseline gap-2.5 select-none shrink-0" style={{ gap: 10 }}>
            <span
              className="font-display font-extrabold leading-none"
              style={{
                color: '#22c55e',
                fontSize: 34,
                letterSpacing: '0.01em',
                textShadow: '0 0 20px rgba(34,197,94,0.4)',
              }}
            >
              ŞEN
            </span>
            <span className="hidden sm:flex flex-col leading-none" style={{ gap: 2 }}>
              <span
                className="font-display font-extrabold uppercase leading-none"
                style={{ color: '#f1f5f9', fontSize: 34, letterSpacing: '0.01em' }}
              >
                HIRDAVAT
              </span>
              <span
                className="font-display uppercase leading-none self-end text-[10px] font-bold tracking-[0.2em]"
                style={{ color: '#475569' }}
              >
                ADEM ŞEN
              </span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center gap-0.5 ml-6 flex-1">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.label}
                href={`/urunler?q=${encodeURIComponent(l.q)}`}
                className="px-3 h-10 flex items-center text-[13px] text-slate-400 hover:text-white font-medium rounded-md hover:bg-white/[0.06] transition"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/urunler"
              className="px-3 h-10 flex items-center text-[13px] font-bold rounded-md transition ml-1"
              style={{ color: 'var(--sh-accent)' }}
            >
              Kampanyalar
            </Link>
          </nav>

          {/* Sağ aksiyonlar */}
          <div className="flex items-center gap-2 ml-auto shrink-0">
            {/* Arama ikonu */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="hidden md:flex items-center justify-center w-10 h-10 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition"
              aria-label="Ara"
            >
              <Search size={18} />
            </button>

            {/* Sepet */}
            <Link
              href="/sepet"
              className="relative flex items-center gap-2 h-10 px-4 rounded-lg text-white text-[13px] font-medium transition hover:opacity-90"
              style={{ background: 'var(--sh-green)' }}
            >
              <ShoppingCart size={17} />
              <span className="hidden md:inline">Sepet</span>
              {count > 0 && (
                <span
                  className="absolute -top-1 -right-1 md:static md:ml-0.5 text-[10px] font-bold rounded-full h-4 min-w-4 px-1 flex items-center justify-center"
                  style={{ background: 'var(--sh-accent)', color: '#000' }}
                >
                  {count}
                </span>
              )}
            </Link>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/902242521347"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-2 h-10 px-4 rounded-lg text-[13px] font-bold transition hover:opacity-90"
              style={{ background: 'var(--sh-accent)', color: '#0b1220' }}
            >
              <MessageCircle size={16} />
              WhatsApp Destek
            </a>
          </div>
        </div>

        {/* Arama overlay — açıldığında */}
        {searchOpen && (
          <div className="border-t border-white/[0.06] bg-[#0b1220] px-4 py-3">
            <form onSubmit={handleSearch} className="max-w-[640px] mx-auto relative">
              <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                autoFocus
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Ürün, marka veya kod ara — Bosch matkap, M8 cıvata…"
                className="w-full h-11 pl-11 pr-4 bg-white/[0.06] border border-white/10 rounded-lg text-[14px] text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-white/20 transition"
              />
            </form>
          </div>
        )}

        {/* Mobil menü */}
        {menuOpen && (
          <div className="lg:hidden border-t border-white/[0.06] bg-[#0b1220] px-4 py-4">
            <form onSubmit={handleSearch} className="relative mb-4">
              <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Ürün ara…"
                className="w-full h-11 pl-11 pr-4 bg-white/[0.06] border border-white/10 rounded-lg text-[14px] text-slate-100 placeholder:text-slate-500 focus:outline-none transition"
              />
            </form>
            <div className="space-y-1">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.label}
                  href={`/urunler?q=${encodeURIComponent(l.q)}`}
                  className="block py-2.5 px-3 text-[14px] text-slate-300 hover:text-white rounded-lg hover:bg-white/[0.06] transition"
                  onClick={() => setMenuOpen(false)}
                >
                  {l.label}
                </Link>
              ))}
            </div>
            <a
              href="https://wa.me/902242521347"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center justify-center gap-2 h-11 rounded-lg text-[14px] font-bold"
              style={{ background: 'var(--sh-accent)', color: '#0b1220' }}
            >
              <MessageCircle size={18} />
              WhatsApp Destek
            </a>
          </div>
        )}
      </header>
    </>
  )
}
