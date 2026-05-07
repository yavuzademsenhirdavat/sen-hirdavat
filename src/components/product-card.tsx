'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, MessageCircle } from 'lucide-react'
import { formatPrice, buildWhatsAppUrl } from '@/lib/utils'
import { useCart } from '@/lib/cart'
import { toast } from 'sonner'
import type { Product } from '@/lib/supabase'

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '905XXXXXXXXX'

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault()
    addItem(product)
    toast.success(`"${product.name}" sepete eklendi`)
  }

  const img = product.images?.[0]
  const discount = product.compare_price && product.compare_price > product.price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : null

  const catName = (product as Product & { categories?: { name: string } }).categories?.name

  return (
    <div
      className="group relative overflow-hidden transition-all duration-200"
      style={{
        background: 'var(--sh-surface)',
        border: '1px solid var(--sh-border)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--sh-accent)'
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--sh-border)'
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Sol yeşil şerit (hover'da açılır) */}
      <div
        className="absolute top-0 left-0 w-[3px] h-full origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-200"
        style={{ background: 'var(--sh-accent)' }}
      />

      {/* Görsel */}
      <Link href={`/urunler/${product.slug}`}>
        <div className="relative aspect-square" style={{ background: 'var(--sh-surface2)' }}>
          {img ? (
            <Image src={img} alt={product.name} fill className="object-contain p-3" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-4xl opacity-40">🔩</div>
          )}
          {discount && (
            <span
              className="absolute top-2 left-2 text-xs px-1.5 py-0.5 font-bold"
              style={{
                background: 'var(--sh-danger)',
                color: '#fff',
                fontFamily: 'var(--font-barlow)',
                letterSpacing: 1,
              }}
            >
              -%{discount}
            </span>
          )}
          {product.stock === 0 && (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.75)' }}
            >
              <span
                className="text-sm font-bold px-3 py-1"
                style={{
                  color: 'var(--sh-muted)',
                  fontFamily: 'var(--font-barlow)',
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  border: '1px solid var(--sh-border)',
                }}
              >
                Tükendi
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-3">
        {catName && (
          <div
            className="text-xs mb-1"
            style={{
              fontFamily: 'var(--font-barlow)',
              fontWeight: 600,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: 'var(--sh-steel)',
            }}
          >
            {catName}
          </div>
        )}

        <Link href={`/urunler/${product.slug}`}>
          <h3
            className="line-clamp-2 mb-2 leading-tight"
            style={{
              fontFamily: 'var(--font-barlow)',
              fontWeight: 700,
              fontSize: '1rem',
              color: 'var(--sh-text)',
            }}
          >
            {product.name}
          </h3>
        </Link>

        <div className="flex items-end justify-between mb-2">
          <div>
            <span
              style={{
                fontFamily: 'var(--font-barlow)',
                fontWeight: 700,
                fontSize: '1.25rem',
                color: 'var(--sh-accent)',
              }}
            >
              {formatPrice(product.price)}
            </span>
            {product.unit && (
              <span className="text-xs ml-1" style={{ color: 'var(--sh-muted)' }}>
                / {product.unit}
              </span>
            )}
            {product.compare_price && (
              <div className="text-xs line-through" style={{ color: 'var(--sh-muted)' }}>
                {formatPrice(product.compare_price)}
              </div>
            )}
          </div>
          <div
            className="text-xs text-right"
            style={{ color: product.stock === 0 ? 'var(--sh-danger)' : product.stock < 15 ? 'var(--sh-danger)' : 'var(--sh-success)' }}
          >
            {product.stock === 0 ? 'Tükendi' : product.stock < 15 ? `⚠ ${product.stock} adet` : `${product.stock} adet`}
          </div>
        </div>

        <div className="flex gap-1.5">
          <button
            onClick={handleAdd}
            disabled={product.stock === 0}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: product.stock === 0 ? 'var(--sh-border)' : 'var(--sh-accent)',
              color: product.stock === 0 ? 'var(--sh-muted)' : '#fff',
              fontFamily: 'var(--font-barlow)',
              letterSpacing: '2px',
              textTransform: 'uppercase',
            }}
            onMouseEnter={(e) => {
              if (product.stock > 0) e.currentTarget.style.background = 'var(--sh-accent2)'
            }}
            onMouseLeave={(e) => {
              if (product.stock > 0) e.currentTarget.style.background = 'var(--sh-accent)'
            }}
          >
            <ShoppingCart size={13} />
            Ekle
          </button>
          <a
            href={buildWhatsAppUrl(WHATSAPP, `Merhaba! "${product.name}" ürünü hakkında bilgi almak istiyorum.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center px-2.5 transition-colors"
            style={{
              border: '1px solid var(--sh-border)',
              color: 'var(--sh-accent)',
              background: 'var(--sh-surface)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--sh-surface2)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--sh-surface)'
            }}
          >
            <MessageCircle size={14} />
          </a>
        </div>
      </div>
    </div>
  )
}
