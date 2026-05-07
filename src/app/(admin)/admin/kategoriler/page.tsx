import { supabaseAdmin } from '@/lib/supabase'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DeleteCategoryButton } from '@/components/admin/delete-category-button'

async function getCategories() {
  const { data } = await supabaseAdmin
    .from('categories')
    .select('*, parent:parent_id(name)')
    .order('sort_order')
  return data || []
}

export default async function AdminCategoriesPage() {
  const categories = await getCategories()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Kategoriler ({categories.length})</h1>
        <Link href="/admin/kategoriler/ekle">
          <Button size="sm" className="bg-green-700 hover:bg-green-800">
            <Plus size={16} className="mr-1" /> Kategori Ekle
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr className="text-left text-gray-500">
              <th className="px-4 py-3">Kategori Adı</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Üst Kategori</th>
              <th className="px-4 py-3">Sıra</th>
              <th className="px-4 py-3">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{cat.name}</td>
                <td className="px-4 py-3 font-mono text-xs text-gray-500">{cat.slug}</td>
                <td className="px-4 py-3 text-gray-500">{(cat as { parent?: { name: string } | null }).parent?.name || '—'}</td>
                <td className="px-4 py-3 text-gray-500">{cat.sort_order}</td>
                <td className="px-4 py-3">
                  <DeleteCategoryButton categoryId={cat.id} categoryName={cat.name} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            Henüz kategori yok.
            <Link href="/admin/kategoriler/ekle" className="text-green-700 hover:underline ml-1">İlk kategoriyi ekle →</Link>
          </div>
        )}
      </div>
    </div>
  )
}
