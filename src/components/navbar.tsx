'use client'

import Link from 'next/link'
import { ShoppingCart, Heart, User, Search, Menu } from 'lucide-react'
import { useCart } from '@/lib/cart'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const CAT_LINKS = [
  'El Aletleri', 'Elektrikli', 'Vida & Cıvata',
  'Tesisat', 'Boya', 'İş Güvenliği', 'Toptan Satış',
]

function Logo({ dark = false }: { dark?: boolean }) {
  const green = dark ? '#22c55e' : '#15803d'
  const sub = dark ? '#f1f5f9' : '#1e293b'

  return (
    <Link href="/" className="flex items-baseline gap-3 select-none shrink-0">
      <span
        className="font-display font-extrabold leading-none"
        style={{ color: green, fontSize: 36, letterSpacing: '0.015em' }}
      >
        ŞEN
      </span>
      <span className="hidden sm:flex flex-col leading-none" style={{ gap: 2 }}>
        <span
          className="font-display font-extrabold uppercase leading-none"
          style={{ color: sub, fontSize: 36, letterSpacing: '0.015em' }}
        >
          HIRDAVAT
        </span>
        <span
          className="font-display uppercase leading-none self-end text-[11px] font-bold tracking-[0.18em]"
          style={{ color: dark ? '#94a3b8' : '#64748b' }}
        >
          ADEM ŞEN
        </span>
      </span>
    </Link>
  )
}

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
    <>
      {/* TopBar */}
      <div className="bg-slate-800 text-slate-300 text-[12px] tracking-tight">
        <div className="max-w-[1280px] mx-auto px-4 h-9 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5 font-medium text-slate-100">
              <span className="text-slate-400">📞</span>
              0224 254 10 10
            </span>
            <span className="hidden md:flex items-center gap-1.5 text-slate-400">
              📍 Ulu Cami Mh. Demirci Sk. No:14, Osmangazi / Bursa
            </span>
            <span className="flex items-center gap-1.5 text-slate-400 md:hidden">
              📍 Osmangazi / Bursa
            </span>
          </div>
          <div className="hidden lg:flex items-center gap-5 text-slate-400">
            <span>🕐 Hafta içi 08:00–19:00</span>
            <span>🚚 Aynı gün Bursa içi teslimat</span>
          </div>
        </div>
      </div>

      {/* Ana header */}
      <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800">
        <div className="max-w-[1280px] mx-auto px-4 h-[68px] flex items-center gap-4 md:gap-6">
          {/* Mobil menu */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-slate-200 -ml-1 p-1.5 hover:bg-slate-800 rounded"
          >
            <Menu size={22} />
          </button>

          <Logo dark />

          {/* Arama — desktop */}
          <form onSubmit={handleSearch} className="flex-1 max-w-[640px] hidden md:block">
            <div className="relative">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Ürün, marka veya kod ara — Bosch matkap, M8 cıvata…"
                className="w-full h-11 pl-11 pr-4 bg-slate-800 border border-slate-700 rounded-md text-[14px] text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-600 transition"
              />
            </div>
          </form>

          {/* Sağ aksiyonlar */}
          <div className="flex items-center gap-1 md:gap-2 ml-auto">
            <button className="hidden md:flex items-center gap-2 h-11 px-3 rounded text-slate-200 hover:bg-slate-800 transition text-[13px]">
              <User size={20} className="text-slate-300" />
              <span className="font-medium">Hesabım</span>
            </button>
            <button className="relative flex items-center gap-2 h-11 px-3 rounded text-slate-200 hover:bg-slate-800 transition text-[13px]">
              <Heart size={20} className="text-slate-300" />
              <span className="hidden md:inline font-medium">Favoriler</span>
            </button>
            <Link
              href="/sepet"
              className="relative flex items-center gap-2 h-11 px-3 md:px-4 rounded text-white transition text-[13px] font-medium"
              style={{ background: 'var(--sh-green)' }}
            >
              <ShoppingCart size={20} />
              <span className="hidden md:inline">Sepet</span>
              {count > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 md:relative md:top-auto md:right-auto md:ml-0.5 text-[10px] font-semibold rounded-full h-4 min-w-4 px-1 flex items-center justify-center"
                  style={{ background: '#fff', color: 'var(--sh-green)' }}
                >
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobil arama */}
        <div className="md:hidden px-4 pb-3 -mt-1">
          <form onSubmit={handleSearch} className="relative">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ürün ara…"
              className="w-full h-11 pl-11 pr-4 bg-slate-800 border border-slate-700 rounded-md text-[14px] text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-600 transition"
            />
          </form>
        </div>

        {/* Kategori nav — desktop */}
        <nav className="hidden md:block border-t border-slate-800">
          <div className="max-w-[1280px] mx-auto px-4 h-11 flex items-center gap-1 text-[13px]">
            <Link
              href="/urunler"
              className="flex items-center gap-2 h-11 px-3 -ml-3 text-slate-100 hover:bg-slate-800 font-display font-bold tracking-wide uppercase text-[12.5px]"
            >
              <Menu size={16} />
              Tüm Kategoriler
            </Link>
            {CAT_LINKS.map((c) => (
              <Link
                key={c}
                href={`/urunler?q=${encodeURIComponent(c)}`}
                className="px-3 h-11 flex items-center text-slate-400 hover:text-white font-medium transition"
              >
                {c}
              </Link>
            ))}
            <Link
              href="/urunler"
              className="ml-auto flex items-center gap-1.5 px-3 h-11 font-medium transition"
              style={{ color: 'var(--sh-green-2)' }}
            >
              🏷 Kampanyalar
            </Link>
          </div>
        </nav>

        {/* Mobil menü açık */}
        {menuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-slate-900 px-4 py-3 space-y-2">
            {CAT_LINKS.map((c) => (
              <Link
                key={c}
                href={`/urunler?q=${encodeURIComponent(c)}`}
                className="block py-1.5 text-sm text-slate-300 hover:text-white"
                onClick={() => setMenuOpen(false)}
              >
                {c}
              </Link>
            ))}
          </div>
        )}
      </header>
    </>
  )
}
