import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Plus, Upload, Pencil, Trash2 } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { DeleteProductButton } from '@/components/admin/delete-product-button'

interface Props {
  searchParams: Promise<{ sayfa?: string; q?: string }>
}

const PAGE = 50

export default async function AdminProductsPage({ searchParams }: Props) {
  const { sayfa, q } = await searchParams
  const page = parseInt(sayfa || '1')

  let query = supabaseAdmin
    .from('products')
    .select('*, categories(name)', { count: 'exact' })
    .range((page - 1) * PAGE, page * PAGE - 1)
    .order('created_at', { ascending: false })

  if (q) query = query.ilike('name', `%${q}%`)

  const { data: products, count } = await query
  const totalPages = Math.ceil((count || 0) / PAGE)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Ürünler ({count})</h1>
        <div className="flex gap-2">
          <Link href="/admin/urunler/csv-yukle">
            <Button variant="outline" size="sm">
              <Upload size={16} className="mr-1" /> CSV Yükle
            </Button>
          </Link>
          <Link href="/admin/urunler/ekle">
            <Button size="sm" className="bg-green-700 hover:bg-green-800">
              <Plus size={16} className="mr-1" /> Ürün Ekle
            </Button>
          </Link>
        </div>
      </div>

      {/* Arama */}
      <form method="get" className="mb-4">
        <input
          name="q"
          defaultValue={q}
          placeholder="Ürün ara..."
          className="border rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </form>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr className="text-left text-gray-500">
              <th className="px-4 py-3">Ürün</th>
              <th className="px-4 py-3">Kategori</th>
              <th className="px-4 py-3">Fiyat</th>
              <th className="px-4 py-3">Stok</th>
              <th className="px-4 py-3">Durum</th>
              <th className="px-4 py-3">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products?.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-800 truncate max-w-xs">{p.name}</div>
                  {p.sku && <div className="text-xs text-gray-400">SKU: {p.sku}</div>}
                </td>
                <td className="px-4 py-3 text-gray-500">{(p as { categories?: { name: string } | null }).categories?.name || '—'}</td>
                <td className="px-4 py-3 font-semibold">{formatPrice(p.price)}</td>
                <td className="px-4 py-3">
                  <span className={p.stock <= 5 ? 'text-red-600 font-semibold' : 'text-gray-700'}>{p.stock}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {p.is_active ? 'Aktif' : 'Pasif'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/urunler/${p.id}/duzenle`}>
                      <button className="p-1 hover:text-green-700"><Pencil size={14} /></button>
                    </Link>
                    <DeleteProductButton productId={p.id} productName={p.name} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(!products || products.length === 0) && (
          <div className="text-center py-12 text-gray-400">
            <p>Henüz ürün yok.</p>
            <Link href="/admin/urunler/ekle" className="text-green-700 hover:underline text-sm mt-1 inline-block">İlk ürünü ekle →</Link>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex gap-2 mt-4 justify-center">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <a key={p} href={`/admin/urunler?sayfa=${p}${q ? `&q=${q}` : ''}`}
              className={`px-3 py-1 rounded border text-sm ${p === page ? 'bg-green-700 text-white' : 'bg-white text-gray-700'}`}>
              {p}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
