import { supabase } from '@/lib/supabase'
import { ProductCard } from '@/components/product-card'
import { Filter } from 'lucide-react'

interface Props {
  searchParams: Promise<{ q?: string; kategori?: string; min?: string; max?: string; sayfa?: string }>
}

const PAGE_SIZE = 24

async function getProducts(q?: string, kategori?: string, min?: string, max?: string, sayfa = 1) {
  let query = supabase
    .from('products')
    .select('*, categories(name, slug)', { count: 'exact' })
    .eq('is_active', true)
    .range((sayfa - 1) * PAGE_SIZE, sayfa * PAGE_SIZE - 1)
    .order('created_at', { ascending: false })

  if (q) query = query.ilike('name', `%${q}%`)
  if (min) query = query.gte('price', parseFloat(min))
  if (max) query = query.lte('price', parseFloat(max))

  if (kategori) {
    const { data: cat } = await supabase.from('categories').select('id').eq('slug', kategori).single()
    if (cat) query = query.eq('category_id', cat.id)
  }

  return query
}

async function getCategories() {
  const { data } = await supabase.from('categories').select('*').order('sort_order')
  return data || []
}

export default async function ProductsPage({ searchParams }: Props) {
  const { q, kategori, min, max, sayfa } = await searchParams
  const page = parseInt(sayfa || '1')

  const [{ data: products, count }, categories] = await Promise.all([
    getProducts(q, kategori, min, max, page),
    getCategories(),
  ])

  const totalPages = Math.ceil((count || 0) / PAGE_SIZE)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar filtre */}
        <aside className="w-full md:w-56 flex-shrink-0">
          <div className="bg-white border rounded-xl p-4">
            <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Filter size={16} /> Kategoriler
            </h2>
            <ul className="space-y-1">
              <li>
                <a
                  href="/urunler"
                  className={`block text-sm px-2 py-1 rounded hover:bg-green-50 hover:text-green-700 ${!kategori ? 'text-green-700 font-semibold' : 'text-gray-700'}`}
                >
                  Tüm Ürünler
                </a>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <a
                    href={`/urunler?kategori=${cat.slug}`}
                    className={`block text-sm px-2 py-1 rounded hover:bg-green-50 hover:text-green-700 ${kategori === cat.slug ? 'text-green-700 font-semibold' : 'text-gray-700'}`}
                  >
                    {cat.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Ürünler */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-800">
              {q ? `"${q}" için sonuçlar` : kategori ? categories.find((c) => c.slug === kategori)?.name || 'Ürünler' : 'Tüm Ürünler'}
            </h1>
            <span className="text-sm text-gray-500">{count} ürün</span>
          </div>

          {products && products.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {products.map((p: any) => <ProductCard key={p.id} product={p} />)}
              </div>

              {/* Sayfalama */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <a
                      key={p}
                      href={`/urunler?${new URLSearchParams({ ...(q && { q }), ...(kategori && { kategori }), sayfa: String(p) })}`}
                      className={`px-4 py-2 rounded border text-sm ${p === page ? 'bg-green-700 text-white border-green-700' : 'bg-white text-gray-700 hover:border-green-500'}`}
                    >
                      {p}
                    </a>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 text-gray-400">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-lg font-medium">Ürün bulunamadı</p>
              <p className="text-sm mt-1">Farklı bir arama deneyin veya kategorilere göz atın.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
