'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Minus, Plus } from 'lucide-react'
import { formatPrice, buildWhatsAppUrl } from '@/lib/utils'
import { useCart } from '@/lib/cart'
import { toast } from 'sonner'
import { useState } from 'react'
import type { Product } from '@/lib/supabase'

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '902242521347'

export function ProductCard({ product }: { product: Product }) {
  const { addItem, items, updateQuantity } = useCart()
  const [hovered, setHovered] = useState(false)

  const cartItem = items.find((i) => i.product.id === product.id)
  const qty = cartItem?.quantity || 0

  function handleAdd() {
    addItem(product)
    toast.success(`"${product.name}" sepete eklendi`)
  }

  function handleQty(newQty: number) {
    updateQuantity(product.id, newQty <= 0 ? 0 : newQty)
  }

  const img = product.images?.[0]
  const discount = product.compare_price && product.compare_price > product.price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : null

  return (
    <article
      className="group flex flex-col bg-white overflow-hidden transition-shadow duration-200"
      style={{
        border: '1px solid #e5e5e5',
        borderRadius: 4,
        boxShadow: hovered ? '0 4px 16px rgba(0,0,0,0.10)' : '0 1px 3px rgba(0,0,0,0.06)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Görsel */}
      <div className="relative bg-[#f8f8f8]" style={{ aspectRatio: '1/1' }}>
        <Link href={`/urunler/${product.slug}`} className="block h-full">
          {img ? (
            <Image
              src={img}
              alt={product.name}
              fill
              className="object-contain p-3 group-hover:scale-[1.04] transition-transform duration-300"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-20">🔩</div>
          )}
        </Link>

        {/* İndirim badge */}
        {discount && (
          <div className="absolute top-2 left-2 text-[10px] font-bold px-1.5 py-0.5 rounded text-white"
               style={{ background: '#e42437' }}>
            %{discount}
          </div>
        )}
        {!discount && product.is_featured && (
          <div className="absolute top-2 left-2 text-[10px] font-bold px-1.5 py-0.5 rounded text-[#2c2a28]"
               style={{ background: '#ffc837' }}>
            Öne Çıkan
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-[12px] font-bold text-slate-500 uppercase tracking-wide">Stokta Yok</span>
          </div>
        )}

        {/* WhatsApp */}
        <a
          href={buildWhatsAppUrl(WHATSAPP, `Merhaba, "${product.name}" hakkında bilgi alabilir miyim?`)}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-2 right-2 w-7 h-7 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ background: '#25D366' }}
          title="WhatsApp ile Sor"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
        </a>
      </div>

      {/* İçerik */}
      <div className="flex flex-col flex-1 p-3">
        {product.sku && (
          <div className="text-[10px] text-slate-400 mb-1">{product.sku}</div>
        )}

        <Link href={`/urunler/${product.slug}`}>
          <h3 className="text-[12.5px] font-medium text-[#2c2a28] leading-snug line-clamp-2 min-h-[36px] hover:text-[#ffc837] transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="mt-auto pt-3">
          {/* Fiyat */}
          <div className="flex items-baseline gap-1.5 mb-2">
            {product.compare_price && product.compare_price > product.price && (
              <span className="text-[11px] text-slate-400 line-through">
                {formatPrice(product.compare_price)}
              </span>
            )}
            <span className="font-bold text-[18px] leading-none text-[#2c2a28]">
              {formatPrice(product.price)}
            </span>
          </div>
          <div className="text-[10px] text-slate-400 mb-2.5">KDV dahil</div>

          {/* Sepet aksiyonu */}
          {qty > 0 ? (
            <div
              className="flex items-center justify-between h-9 rounded overflow-hidden"
              style={{ border: '1.5px solid #ffc837' }}
            >
              <button
                onClick={() => handleQty(qty - 1)}
                className="w-9 h-full flex items-center justify-center hover:bg-[#fff8e1] transition"
              >
                <Minus size={13} className="text-[#2c2a28]" />
              </button>
              <span className="font-bold text-[15px] text-[#2c2a28]">{qty}</span>
              <button
                onClick={() => handleQty(qty + 1)}
                className="w-9 h-full flex items-center justify-center hover:bg-[#fff8e1] transition"
              >
                <Plus size={13} className="text-[#2c2a28]" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              disabled={product.stock === 0}
              className="w-full flex items-center justify-center gap-1.5 h-9 rounded text-[12px] font-bold text-[#2c2a28] transition-all active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: product.stock === 0 ? '#e5e5e5' : '#ffc837' }}
            >
              <ShoppingCart size={13} />
              Sepete Ekle
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
