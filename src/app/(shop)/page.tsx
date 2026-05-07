import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { ProductCard } from '@/components/product-card'
import { Truck, ShieldCheck, Phone, Star } from 'lucide-react'

async function getFeaturedProducts() {
  const { data } = await supabase
    .from('products')
    .select('*, categories(name, slug)')
    .eq('is_active', true)
    .eq('is_featured', true)
    .limit(8)
  return data || []
}

async function getCategories() {
  const { data } = await supabase
    .from('categories')
    .select('*')
    .is('parent_id', null)
    .order('sort_order')
    .limit(8)
  return data || []
}

export default async function HomePage() {
  const [featured, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ])

  return (
    <div>
      {/* Hero */}
      <section style={{ background: 'var(--sh-accent)', color: '#fff', padding: '4rem 1rem' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h1
            className="mb-4"
            style={{
              fontFamily: 'var(--font-barlow), sans-serif',
              fontWeight: 900,
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              letterSpacing: 3,
              textTransform: 'uppercase',
              lineHeight: 1.1,
            }}
          >
            Bursa&apos;nın Güvenilir<br />Hırdavat Mağazası
          </h1>
          <p className="mb-8 text-lg" style={{ color: 'rgba(255,255,255,0.85)' }}>
            El aletleri, tesisat, yapı malzemeleri ve daha fazlası.<br />
            Aynı gün teslimat · Osmangazi, Bursa
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/urunler"
              className="sh-btn-white px-8 py-3 font-bold text-sm"
              style={{
                background: '#fff',
                color: 'var(--sh-accent)',
                fontFamily: 'var(--font-barlow)',
                fontWeight: 700,
                letterSpacing: 3,
                textTransform: 'uppercase',
              }}
            >
              Ürünleri İncele
            </Link>
            <a
              href="https://wa.me/905XXXXXXXXX?text=Merhaba,%20ürünler%20hakkında%20bilgi%20almak%20istiyorum."
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 font-bold text-sm"
              style={{
                border: '2px solid rgba(255,255,255,0.7)',
                color: '#fff',
                fontFamily: 'var(--font-barlow)',
                fontWeight: 700,
                letterSpacing: 3,
                textTransform: 'uppercase',
                background: 'transparent',
              }}
            >
              WhatsApp ile Ulaş
            </a>
          </div>
        </div>
      </section>

      {/* Avantajlar */}
      <section style={{ background: 'var(--sh-surface)', borderBottom: '1px solid var(--sh-border)', padding: '1.25rem 0' }}>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Truck, title: 'Aynı Gün Teslimat', desc: 'Bursa içi siparişlerde' },
            { icon: ShieldCheck, title: 'Kaliteli Ürünler', desc: 'Güvenilir markalar' },
            { icon: Phone, title: '7/2 Destek', desc: '0224 254 10 10' },
            { icon: Star, title: '4.5★ Memnuniyet', desc: '32+ değerlendirme' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-3 py-2">
              <Icon size={26} style={{ color: 'var(--sh-accent)', flexShrink: 0 }} />
              <div>
                <div
                  className="text-sm"
                  style={{
                    fontFamily: 'var(--font-barlow)',
                    fontWeight: 700,
                    color: 'var(--sh-text)',
                    letterSpacing: 1,
                  }}
                >
                  {title}
                </div>
                <div className="text-xs" style={{ color: 'var(--sh-muted)' }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Kategoriler */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-10">
          <div
            className="text-xs mb-5 flex items-center gap-3"
            style={{
              fontFamily: 'var(--font-barlow)',
              fontWeight: 700,
              letterSpacing: '3px',
              textTransform: 'uppercase',
              color: 'var(--sh-muted)',
            }}
          >
            Kategoriler
            <div className="flex-1 h-px" style={{ background: 'var(--sh-border)' }} />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/urunler?kategori=${cat.slug}`}
                className="sh-hover-card p-5 text-center"
                style={{
                  background: 'var(--sh-surface)',
                  border: '1px solid var(--sh-border)',
                  display: 'block',
                }}
              >
                <div className="text-3xl mb-2">🔧</div>
                <div
                  className="text-sm"
                  style={{
                    fontFamily: 'var(--font-barlow)',
                    fontWeight: 700,
                    color: 'var(--sh-text)',
                    letterSpacing: 1,
                  }}
                >
                  {cat.name}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Öne Çıkan Ürünler */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-5">
          <div
            className="text-xs flex items-center gap-3 flex-1"
            style={{
              fontFamily: 'var(--font-barlow)',
              fontWeight: 700,
              letterSpacing: '3px',
              textTransform: 'uppercase',
              color: 'var(--sh-muted)',
            }}
          >
            Öne Çıkan Ürünler
            <div className="flex-1 h-px" style={{ background: 'var(--sh-border)' }} />
          </div>
          <Link
            href="/urunler"
            className="text-xs ml-3 shrink-0"
            style={{
              color: 'var(--sh-accent)',
              fontFamily: 'var(--font-barlow)',
              fontWeight: 700,
              letterSpacing: 1,
              textTransform: 'uppercase',
            }}
          >
            Tümünü Gör →
          </Link>
        </div>

        {featured.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div
            className="text-center py-16"
            style={{ color: 'var(--sh-muted)', fontFamily: 'var(--font-barlow)', letterSpacing: 2 }}
          >
            <p className="text-lg mb-2">Henüz ürün eklenmemiş.</p>
            <p className="text-sm">Admin panelinden ürün ekleyebilirsiniz.</p>
          </div>
        )}
      </section>

      {/* CTA */}
      <section
        className="py-12 px-4 text-center"
        style={{ background: 'var(--sh-text)', color: '#fff' }}
      >
        <h2
          className="mb-3"
          style={{
            fontFamily: 'var(--font-barlow)',
            fontWeight: 900,
            fontSize: '1.75rem',
            letterSpacing: 3,
            textTransform: 'uppercase',
          }}
        >
          Toplu Sipariş mi Veriyorsunuz?
        </h2>
        <p className="mb-6" style={{ color: 'var(--sh-muted)' }}>
          Özel fiyat ve fatura için bizi arayın veya WhatsApp&apos;tan ulaşın.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="tel:02242541010"
            className="px-8 py-3 font-bold text-sm"
            style={{
              background: 'var(--sh-accent)',
              color: '#fff',
              fontFamily: 'var(--font-barlow)',
              fontWeight: 700,
              letterSpacing: 3,
              textTransform: 'uppercase',
            }}
          >
            0224 254 10 10
          </a>
          <a
            href="https://wa.me/905XXXXXXXXX"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 font-bold text-sm"
            style={{
              border: '1px solid rgba(255,255,255,0.3)',
              color: '#fff',
              fontFamily: 'var(--font-barlow)',
              fontWeight: 700,
              letterSpacing: 3,
              textTransform: 'uppercase',
              background: 'transparent',
            }}
          >
            WhatsApp
          </a>
        </div>
      </section>
    </div>
  )
}
