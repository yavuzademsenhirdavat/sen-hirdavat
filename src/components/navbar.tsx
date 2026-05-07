'use client'

import Link from 'next/link'
import { ShoppingCart, Menu, Phone, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/lib/cart'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

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
    }
  }

  return (
    <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
      {/* Üst bant */}
      <div className="bg-green-700 text-white text-xs py-1 text-center">
        Aynı gün teslimat · <a href="tel:02242541010" className="underline">0224 254 10 10</a>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-4 h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <span className="text-2xl font-[family-name:var(--font-barlow)] font-bold tracking-wide text-green-700">ŞEN</span>
            <span className="text-2xl font-[family-name:var(--font-barlow)] font-semibold text-slate-700"> Hırdavat</span>
          </Link>

          {/* Arama */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl">
            <div className="flex w-full border rounded-lg overflow-hidden">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Ürün, marka veya kategori ara..."
                className="flex-1 px-4 py-2 text-sm outline-none"
              />
              <button type="submit" className="bg-green-700 text-white px-4 hover:bg-green-800">
                <Search size={18} />
              </button>
            </div>
          </form>

          <div className="ml-auto flex items-center gap-2">
            <a href="tel:02242541010" className="hidden md:flex items-center gap-1 text-sm text-gray-600 hover:text-green-700">
              <Phone size={16} />
              <span>0224 254 10 10</span>
            </a>

            <Link href="/sepet">
              <Button variant="outline" size="sm" className="relative">
                <ShoppingCart size={18} />
                {count > 0 && (
                  <span className="absolute -top-2 -right-2 bg-green-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {count}
                  </span>
                )}
                <span className="ml-1 hidden sm:inline">Sepet</span>
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Menu size={20} />
            </Button>
          </div>
        </div>

        {/* Kategori nav */}
        <nav className="hidden md:flex gap-6 pb-2 text-sm font-medium">
          <Link href="/urunler" className="text-gray-700 hover:text-green-700">Tüm Ürünler</Link>
          <Link href="/urunler?kategori=el-aletleri" className="text-gray-700 hover:text-green-700">El Aletleri</Link>
          <Link href="/urunler?kategori=elektrikli-aletler" className="text-gray-700 hover:text-green-700">Elektrikli Aletler</Link>
          <Link href="/urunler?kategori=tesisat" className="text-gray-700 hover:text-green-700">Tesisat</Link>
          <Link href="/urunler?kategori=vida-civata" className="text-gray-700 hover:text-green-700">Vida & Cıvata</Link>
          <Link href="/urunler?kategori=boya-kimya" className="text-gray-700 hover:text-green-700">Boya & Kimya</Link>
        </nav>
      </div>

      {/* Mobil menü */}
      {menuOpen && (
        <div className="md:hidden border-t bg-white px-4 py-3 space-y-2">
          <form onSubmit={handleSearch} className="flex border rounded-lg overflow-hidden mb-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ürün ara..."
              className="flex-1 px-3 py-2 text-sm outline-none"
            />
            <button type="submit" className="bg-green-700 text-white px-3">
              <Search size={16} />
            </button>
          </form>
          <Link href="/urunler" className="block py-1 text-sm" onClick={() => setMenuOpen(false)}>Tüm Ürünler</Link>
          <Link href="/urunler?kategori=el-aletleri" className="block py-1 text-sm" onClick={() => setMenuOpen(false)}>El Aletleri</Link>
          <Link href="/urunler?kategori=tesisat" className="block py-1 text-sm" onClick={() => setMenuOpen(false)}>Tesisat</Link>
          <a href="tel:02242541010" className="block py-1 text-sm text-green-700">📞 0224 254 10 10</a>
        </div>
      )}
    </header>
  )
}
