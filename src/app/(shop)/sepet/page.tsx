'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Trash2, Plus, Minus, ShoppingBag, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/lib/cart'
import { formatPrice, buildWhatsAppUrl } from '@/lib/utils'

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '905XXXXXXXXX'

import type { CartItem } from '@/lib/supabase'

function buildWhatsAppOrderMessage(items: CartItem[]) {
  const lines = items.map(
    (i) => `• ${i.product.name} x${i.quantity} = ${formatPrice(i.product.price * i.quantity)}`
  )
  const total = items.reduce((s, i) => s + i.product.price * i.quantity, 0)
  return `Merhaba! Şu ürünleri sipariş etmek istiyorum:\n\n${lines.join('\n')}\n\nToplam: ${formatPrice(total)}`
}

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, itemCount, clearCart } = useCart()
  const count = itemCount()
  const totalAmount = total()

  if (count === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-gray-700 mb-2">Sepetiniz boş</h1>
        <p className="text-gray-500 mb-6">Ürünler ekleyin ve sipariş verin.</p>
        <Link href="/urunler">
          <Button className="bg-orange-600 hover:bg-orange-700">Ürünlere Git</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Sepetim ({count} ürün)</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Ürünler */}
        <div className="md:col-span-2 space-y-4">
          {items.map((item) => {
            const img = item.product.images?.[0]
            return (
              <div key={item.product.id} className="bg-white border rounded-xl p-4 flex gap-4">
                <Link href={`/urunler/${item.product.slug}`}>
                  <div className="relative w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                    {img ? (
                      <Image src={img} alt={item.product.name} fill className="object-contain p-1" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-3xl">🔩</div>
                    )}
                  </div>
                </Link>

                <div className="flex-1">
                  <Link href={`/urunler/${item.product.slug}`}>
                    <h3 className="font-medium text-gray-800 hover:text-orange-600 text-sm">{item.product.name}</h3>
                  </Link>
                  {item.product.sku && <p className="text-xs text-gray-400">SKU: {item.product.sku}</p>}
                  <p className="text-orange-600 font-bold mt-1">{formatPrice(item.product.price)}</p>

                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center border rounded">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="px-2 py-1 hover:text-orange-600"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-3 py-1 text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="px-2 py-1 hover:text-orange-600"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <span className="text-sm font-semibold text-gray-700">
                      = {formatPrice(item.product.price * item.quantity)}
                    </span>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="ml-auto text-gray-400 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}

          <button onClick={clearCart} className="text-sm text-gray-400 hover:text-red-500 flex items-center gap-1">
            <Trash2 size={14} /> Sepeti Temizle
          </button>
        </div>

        {/* Özet */}
        <div className="bg-white border rounded-xl p-5 h-fit sticky top-20">
          <h2 className="font-bold text-gray-800 mb-4">Sipariş Özeti</h2>

          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between text-gray-600">
              <span>Ara Toplam</span>
              <span>{formatPrice(totalAmount)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Kargo</span>
              <span className="text-green-600">Hesaplanacak</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-bold text-base">
              <span>Toplam</span>
              <span className="text-orange-600">{formatPrice(totalAmount)}</span>
            </div>
          </div>

          <Link href="/odeme">
            <Button className="w-full bg-orange-600 hover:bg-orange-700 mb-3" size="lg">
              Ödemeye Geç
            </Button>
          </Link>

          <a
            href={buildWhatsAppUrl(WHATSAPP, buildWhatsAppOrderMessage(items))}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border-2 border-green-500 text-green-600 font-semibold hover:bg-green-50 text-sm transition-colors"
          >
            <MessageCircle size={18} />
            WhatsApp ile Sipariş Ver
          </a>
        </div>
      </div>
    </div>
  )
}
