'use client'

import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function DeleteProductButton({ productId, productName }: { productId: string; productName: string }) {
  const router = useRouter()

  async function handleDelete() {
    if (!confirm(`"${productName}" ürününü silmek istediğinize emin misiniz?`)) return

    const res = await fetch(`/api/admin/urunler/${productId}`, { method: 'DELETE' })
    if (res.ok) {
      toast.success('Ürün silindi')
      router.refresh()
    } else {
      toast.error('Ürün silinemedi')
    }
  }

  return (
    <button onClick={handleDelete} className="p-1 hover:text-red-600">
      <Trash2 size={14} />
    </button>
  )
}
