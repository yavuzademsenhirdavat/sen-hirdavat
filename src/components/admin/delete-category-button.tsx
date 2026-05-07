'use client'

import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function DeleteCategoryButton({ categoryId, categoryName }: { categoryId: string; categoryName: string }) {
  const router = useRouter()

  async function handleDelete() {
    if (!confirm(`"${categoryName}" kategorisini silmek istediğinize emin misiniz?`)) return
    const res = await fetch(`/api/admin/kategoriler/${categoryId}`, { method: 'DELETE' })
    if (res.ok) { toast.success('Kategori silindi'); router.refresh() }
    else toast.error('Kategori silinemedi')
  }

  return (
    <button onClick={handleDelete} className="p-1 hover:text-red-600 text-gray-400">
      <Trash2 size={14} />
    </button>
  )
}
