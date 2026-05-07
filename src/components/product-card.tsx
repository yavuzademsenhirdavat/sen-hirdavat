'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatPrice, buildWhatsAppUrl } from '@/lib/utils'
import { useCart } from '@/lib/cart'
import { toast } from 'sonner'
import type { Product } from '@/lib/supabase'

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '905XXXXXXXXX'

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()

  function handleAdd() {
    addItem(product)
    toast.success(`"${product.name}" sepete eklendi`)
  }

  const img = product.images?.[0]
  const discount = product.compare_price && product.compare_price > product.price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : null

  return (
    <div className="bg-white border rounded-xl overflow-hidden hover:shadow-md transition-shadow group">
      <Link href={`/urunler/${product.slug}`}>
        <div className="relative aspect-square bg-gray-100">
          {img ? (
            <Image src={img} alt={product.name} fill className="object-contain p-2" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-5xl">🔩</div>
          )}
          {discount && (
            <Badge className="absolute top-2 left-2 bg-red-500">-%{discount}</Badge>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <span className="font-semibold text-gray-500 text-sm">Stokta Yok</span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-3">
        <Link href={`/urunler/${product.slug}`}>
          <h3 className="text-sm font-medium text-gray-800 line-clamp-2 hover:text-green-700 mb-1">
            {product.name}
          </h3>
        </Link>

        {product.sku && (
          <p className="text-xs text-gray-400 mb-1">SKU: {product.sku}</p>
        )}

        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-lg font-bold text-green-700">{formatPrice(product.price)}</span>
          {product.compare_price && (
            <span className="text-xs text-gray-400 line-through">{formatPrice(product.compare_price)}</span>
          )}
        </div>

        <div className="flex gap-1">
          <Button
            size="sm"
            className="flex-1 bg-green-700 hover:bg-green-800 text-xs"
            onClick={handleAdd}
            disabled={product.stock === 0}
          >
            <ShoppingCart size={14} className="mr-1" />
            Sepete Ekle
          </Button>
          <a
            href={buildWhatsAppUrl(WHATSAPP, `Merhaba! "${product.name}" ürünü hakkında bilgi almak istiyorum.`)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="sm" variant="outline" className="px-2 border-green-500 text-green-600 hover:bg-green-50">
              <MessageCircle size={14} />
            </Button>
          </a>
        </div>
      </div>
    </div>
  )
}
