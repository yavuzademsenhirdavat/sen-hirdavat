import { supabase } from '@/lib/supabase'
import { ProductCard } from '@/components/product-card'

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
      {/* Başlık */}
      <div className="mb-4 flex items-center justify-between">
        <h1
          style={{
            fontFamily: 'var(--font-barlow)',
            fontWeight: 900,
            fontSize: '1.5rem',
            letterSpacing: 3,
            textTransform: 'uppercase',
            color: 'var(--sh-text)',
          }}
        >
          {q ? `"${q}" için sonuçlar` : kategori ? categories.find((c) => c.slug === kategori)?.name || 'Ürünler' : 'Tüm Ürünler'}
        </h1>
        <span className="text-sm" style={{ color: 'var(--sh-muted)' }}>{count} ürün</span>
      </div>

      {/* Kategori pill filtreleri */}
      <div className="flex gap-2 flex-wrap mb-6">
        <a
          href="/urunler"
          className="px-3 py-1 text-xs transition-all"
          style={{
            fontFamily: 'var(--font-barlow)',
            fontWeight: 700,
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            border: '1px solid',
            borderColor: !kategori ? 'var(--sh-accent)' : 'var(--sh-border)',
            background: !kategori ? 'var(--sh-accent)' : 'var(--sh-surface)',
            color: !kategori ? '#fff' : 'var(--sh-muted)',
          }}
        >
          Tümü
        </a>
        {categories.map((cat) => {
          const isActive = kategori === cat.slug
          return (
            <a
              key={cat.id}
              href={`/urunler?kategori=${cat.slug}${q ? `&q=${encodeURIComponent(q)}` : ''}`}
              className="px-3 py-1 text-xs transition-all"
              style={{
                fontFamily: 'var(--font-barlow)',
                fontWeight: 700,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                border: '1px solid',
                borderColor: isActive ? 'var(--sh-accent)' : 'var(--sh-border)',
                background: isActive ? 'var(--sh-accent)' : 'var(--sh-surface)',
                color: isActive ? '#fff' : 'var(--sh-muted)',
              }}
            >
              {cat.name}
            </a>
          )
        })}
      </div>

      {/* Arama kutusu */}
      {q && (
        <div
          className="flex items-center gap-2 mb-4 px-3 py-2 text-sm"
          style={{ background: 'var(--sh-surface)', border: '1px solid var(--sh-border)', color: 'var(--sh-muted)' }}
        >
          <span style={{ fontFamily: 'var(--font-barlow)', letterSpacing: 1 }}>
            Arama: <strong style={{ color: 'var(--sh-accent)' }}>{q}</strong>
          </span>
          <a href={kategori ? `/urunler?kategori=${kategori}` : '/urunler'} style={{ color: 'var(--sh-danger)', marginLeft: 'auto', fontWeight: 700 }}>✕ Temizle</a>
        </div>
      )}

      {/* Ürün grid */}
      {products && products.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
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
                  className="px-4 py-2 text-sm font-bold transition-all"
                  style={{
                    fontFamily: 'var(--font-barlow)',
                    letterSpacing: 1,
                    border: '1px solid',
                    borderColor: p === page ? 'var(--sh-accent)' : 'var(--sh-border)',
                    background: p === page ? 'var(--sh-accent)' : 'var(--sh-surface)',
                    color: p === page ? '#fff' : 'var(--sh-muted)',
                  }}
                >
                  {p}
                </a>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20" style={{ color: 'var(--sh-muted)' }}>
          <div className="text-5xl mb-4 opacity-30">🔍</div>
          <p
            className="text-lg font-medium mb-1"
            style={{ fontFamily: 'var(--font-barlow)', letterSpacing: 2, textTransform: 'uppercase' }}
          >
            Ürün bulunamadı
          </p>
          <p className="text-sm">Farklı bir arama deneyin veya kategorilere göz atın.</p>
        </div>
      )}
    </div>
  )
}
