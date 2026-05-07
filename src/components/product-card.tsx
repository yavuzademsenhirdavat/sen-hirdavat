'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Heart, Minus, Plus } from 'lucide-react'
import { formatPrice, buildWhatsAppUrl } from '@/lib/utils'
import { useCart } from '@/lib/cart'
import { toast } from 'sonner'
import { useState } from 'react'
import type { Product } from '@/lib/supabase'

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '905XXXXXXXXX'

function Stars({ rating }: { rating: number }) {
  const full = Math.round(rating)
  return (
    <div className="flex gap-0.5 text-amber-500">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width="11" height="11" viewBox="0 0 24 24" fill={i <= full ? 'currentColor' : 'none'}
          stroke="currentColor" strokeWidth="2" className={i > full ? 'text-slate-300' : ''}>
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
    </div>
  )
}

export function ProductCard({ product }: { product: Product }) {
  const { addItem, items, updateQuantity } = useCart()
  const [isFav, setIsFav] = useState(false)

  const cartItem = items.find((i) => i.product.id === product.id)
  const qty = cartItem?.quantity || 0

  function handleAdd() {
    addItem(product)
    toast.success(`"${product.name}" sepete eklendi`)
  }

  function handleQty(newQty: number) {
    if (newQty <= 0) {
      updateQuantity(product.id, 0)
    } else {
      updateQuantity(product.id, newQty)
    }
  }

  const img = product.images?.[0]
  const discount = product.compare_price && product.compare_price > product.price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : null

  const catName = (product as Product & { categories?: { name: string } }).categories?.name

  const badge = product.stock === 0 ? null : discount ? 'İndirim' : product.is_featured ? 'Öne Çıkan' : null

  return (
    <article className="group bg-white rounded-md border border-slate-200 hover:border-slate-400 transition overflow-hidden flex flex-col">
      {/* Görsel */}
      <div className="relative aspect-square bg-slate-50 overflow-hidden">
        <Link href={`/urunler/${product.slug}`}>
          {img ? (
            <Image
              src={img}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-[1.03] transition duration-500"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-20">🔩</div>
          )}
        </Link>

        {/* Badge */}
        {discount && (
          <div className="absolute top-2.5 left-2.5 bg-emerald-700 text-white text-[10px] font-display font-bold tracking-wider px-2 py-1 rounded">
            %{discount} İNDİRİM
          </div>
        )}
        {!discount && badge && (
          <div className={`absolute top-2.5 left-2.5 text-[10px] font-display font-bold tracking-wider px-2 py-1 rounded ${
            badge === 'Öne Çıkan' ? 'bg-slate-900 text-white' : 'bg-amber-600 text-white'
          }`}>
            {badge}
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-sm font-display font-bold text-slate-500 uppercase tracking-wider">Stokta Yok</span>
          </div>
        )}

        {/* Favori butonu */}
        <button
          onClick={() => setIsFav(!isFav)}
          className={`absolute top-2.5 right-2.5 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center border border-slate-200 hover:bg-white transition ${isFav ? 'text-rose-600' : 'text-slate-500 hover:text-slate-900'}`}
        >
          <Heart size={16} fill={isFav ? 'currentColor' : 'none'} />
        </button>

        {/* WhatsApp pill */}
        <a
          href={buildWhatsAppUrl(WHATSAPP, `Merhaba, "${product.name}" hakkında bilgi alabilir miyim?`)}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1.5 h-8 px-2.5 rounded bg-[#25D366] text-white text-[11px] font-medium hover:bg-[#1ea855] transition shadow-sm opacity-0 group-hover:opacity-100"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          Sor
        </a>
      </div>

      {/* İçerik */}
      <div className="p-3.5 md:p-4 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10.5px] uppercase tracking-wider text-slate-500 font-display font-bold">
            {catName || product.unit || '—'}
          </span>
          {product.sku && (
            <span className="text-[10.5px] text-slate-400 font-mono-custom">{product.sku}</span>
          )}
        </div>

        <Link href={`/urunler/${product.slug}`}>
          <h3 className="text-[13.5px] text-slate-800 leading-snug font-medium line-clamp-2 mb-2 min-h-[36px] hover:text-emerald-700 transition">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-3">
          <Stars rating={4.7} />
          <span>(24)</span>
        </div>

        <div className="mt-auto">
          <div className="flex items-baseline gap-2">
            {product.compare_price && (
              <span className="text-[12px] text-slate-400 line-through">
                {formatPrice(product.compare_price)}
              </span>
            )}
            <span className="font-display font-bold text-[20px] leading-none" style={{ color: 'var(--sh-green)' }}>
              {formatPrice(product.price)}
            </span>
          </div>
          <div className="text-[10.5px] text-slate-500 mt-1">
            KDV dahil · {product.unit && <span>/ {product.unit}</span>}
          </div>

          {/* Aksiyon */}
          <div className="mt-3 flex items-stretch gap-1.5">
            {qty > 0 ? (
              <div className="flex items-center justify-between flex-1 h-10 border border-emerald-700 rounded-md overflow-hidden">
                <button
                  onClick={() => handleQty(qty - 1)}
                  className="w-9 h-full flex items-center justify-center text-emerald-700 hover:bg-emerald-50 transition"
                >
                  <Minus size={15} />
                </button>
                <span className="font-display font-bold text-[15px]" style={{ color: 'var(--sh-green)' }}>
                  {qty}
                </span>
                <button
                  onClick={() => handleQty(qty + 1)}
                  className="w-9 h-full flex items-center justify-center text-emerald-700 hover:bg-emerald-50 transition"
                >
                  <Plus size={15} />
                </button>
              </div>
            ) : (
              <button
                onClick={handleAdd}
                disabled={product.stock === 0}
                className="flex-1 inline-flex items-center justify-center gap-1.5 h-10 text-white font-medium text-[12.5px] rounded-md transition disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: product.stock === 0 ? '#94a3b8' : 'var(--sh-green)' }}
                onMouseOver={(e) => { if (product.stock > 0) e.currentTarget.style.background = 'var(--sh-green-2)' }}
                onMouseOut={(e) => { if (product.stock > 0) e.currentTarget.style.background = 'var(--sh-green)' }}
              >
                <ShoppingCart size={15} />
                Sepete Ekle
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
