'use client'

import Link from 'next/link'
import { ShoppingCart, Search, Menu, X, Phone } from 'lucide-react'
import { useCart } from '@/lib/cart'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const CAT_LINKS = [
  { label: 'El Aletleri',      q: 'El Aletleri' },
  { label: 'Elektrikli',       q: 'Elektrikli' },
  { label: 'Vida & Cıvata',   q: 'Vida & Cıvata' },
  { label: 'Tesisat',          q: 'Tesisat' },
  { label: 'Boya',             q: 'Boya' },
  { label: 'İş Güvenliği',    q: 'İş Güvenliği' },
  { label: 'Toptan Satış',    q: 'Toptan' },
]

export function Navbar() {
  const { itemCount } = useCart()
  const count = itemCount()
  const [menuOpen, setMenuOpen] = useState(false)
  const [search, setSearch] = useState('')
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
    <header className="sticky top-0 z-40">

      {/* ─── Ana header — beyaz ────────────────────────────────────────── */}
      <div className="bg-white border-b border-[#eeeeee]">
        <div className="max-w-[1280px] mx-auto px-3 h-[60px] flex items-center gap-3">

          {/* Mobil hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden text-[#2c2a28] p-1 shrink-0"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 select-none shrink-0">
            <span
              className="font-display font-extrabold leading-none"
              style={{ fontSize: 26, color: '#2c2a28', letterSpacing: '-0.01em' }}
            >
              ŞEN
            </span>
            <span
              className="hidden sm:block font-display font-extrabold uppercase leading-none"
              style={{ fontSize: 26, color: '#2c2a28', letterSpacing: '-0.01em' }}
            >
              HIRDAVAT
            </span>
          </Link>

          {/* Arama */}
          <form onSubmit={handleSearch} className="flex-1 max-w-[560px] hidden md:flex">
            <div className="flex w-full h-10 rounded-lg overflow-hidden border border-[#dddddd] focus-within:border-[#ffc837] transition">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Ürün, marka veya kod ara…"
                className="flex-1 pl-4 pr-3 text-[13px] text-[#2c2a28] placeholder:text-[#aaa] bg-white focus:outline-none"
              />
              <button
                type="submit"
                className="w-12 flex items-center justify-center text-white shrink-0 transition hover:opacity-90"
                style={{ background: '#ffc837' }}
              >
                <Search size={17} className="text-[#2c2a28]" />
              </button>
            </div>
          </form>

          {/* Sağ */}
          <div className="flex items-center gap-2 ml-auto shrink-0">
            <a
              href="tel:02242521347"
              className="hidden lg:flex items-center gap-1.5 text-[12px] font-semibold text-[#2c2a28] hover:text-[#ffc837] transition"
            >
              <Phone size={15} />
              0224 252 13 47
            </a>

            <Link
              href="/sepet"
              className="relative flex items-center gap-1.5 h-9 px-3 rounded-lg text-[13px] font-bold text-[#2c2a28] transition hover:opacity-90"
              style={{ background: '#ffc837' }}
            >
              <ShoppingCart size={17} />
              <span className="hidden md:inline">Sepet</span>
              {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#e42437] text-white text-[10px] font-bold rounded-full h-4 min-w-4 px-1 flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* ─── Kategori nav — açık gri ─────────────────────────────────── */}
      <nav className="hidden lg:block bg-[#2c2a28]">
        <div className="max-w-[1280px] mx-auto px-3 h-9 flex items-center gap-0.5">
          <Link
            href="/urunler"
            className="flex items-center gap-1.5 h-9 px-3 text-[12px] font-bold text-white hover:text-[#ffc837] transition"
          >
            <Menu size={15} />
            Tüm Kategoriler
          </Link>
          {CAT_LINKS.map((l) => (
            <Link
              key={l.label}
              href={`/urunler?q=${encodeURIComponent(l.q)}`}
              className="px-3 h-9 flex items-center text-[12px] text-[#cccccc] hover:text-white font-medium transition"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/urunler"
            className="ml-auto flex items-center gap-1 h-9 px-3 text-[12px] font-bold transition hover:opacity-80"
            style={{ color: '#ffc837' }}
          >
            🏷 Kampanyalar
          </Link>
        </div>
      </nav>

      {/* Mobil menü */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-b border-[#eeeeee] px-3 py-3">
          <form onSubmit={handleSearch} className="relative mb-3">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aaa]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ürün ara…"
              className="w-full h-10 pl-9 pr-4 border border-[#dddddd] rounded-lg text-[13px] focus:outline-none focus:border-[#ffc837]"
            />
          </form>
          <div className="space-y-0.5">
            {CAT_LINKS.map((l) => (
              <Link
                key={l.label}
                href={`/urunler?q=${encodeURIComponent(l.q)}`}
                className="block py-2 px-2 text-[13px] text-[#2c2a28] hover:text-[#ffc837] font-medium rounded"
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
