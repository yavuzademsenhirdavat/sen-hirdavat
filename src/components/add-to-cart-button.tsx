'use client'

import { useState } from 'react'
import { ShoppingCart, Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/lib/cart'
import { toast } from 'sonner'
import type { Product } from '@/lib/supabase'

export function AddToCartButton({ product }: { product: Product }) {
  const [qty, setQty] = useState(1)
  const { addItem } = useCart()

  function handleAdd() {
    addItem(product, qty)
    toast.success(`${qty} adet "${product.name}" sepete eklendi`)
  }

  if (product.stock === 0) {
    return (
      <Button disabled className="w-full" size="lg">
        Stokta Yok
      </Button>
    )
  }

  return (
    <div className="flex gap-3">
      <div className="flex items-center border rounded-lg">
        <button
          onClick={() => setQty(Math.max(1, qty - 1))}
          className="px-3 py-2 text-gray-600 hover:text-orange-600"
        >
          <Minus size={16} />
        </button>
        <span className="px-4 py-2 font-semibold min-w-[3rem] text-center">{qty}</span>
        <button
          onClick={() => setQty(Math.min(product.stock, qty + 1))}
          className="px-3 py-2 text-gray-600 hover:text-orange-600"
        >
          <Plus size={16} />
        </button>
      </div>
      <Button
        onClick={handleAdd}
        className="flex-1 bg-orange-600 hover:bg-orange-700"
        size="lg"
      >
        <ShoppingCart size={18} className="mr-2" />
        Sepete Ekle
      </Button>
    </div>
  )
}
