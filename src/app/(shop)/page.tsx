import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { ProductCard } from '@/components/product-card'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/lib/supabase'
import { Truck, ShieldCheck, Tag, Phone } from 'lucide-react'

async function getFeaturedProducts() {
  const { data } = await supabase
    .from('products')
    .select('*, categories(name, slug)')
    .eq('is_active', true)
    .eq('is_featured', true)
    .limit(8)
  return data || []
}

async function getHeroProduct() {
  const { data } = await supabase
    .from('products')
    .select('*, categories(name, slug)')
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()
  return data
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

const TONE = {
  eyebrow: 'Endüstriyel tedarikte güven',
  title: 'Profesyonel Hırdavat ve Endüstriyel Çözümler',
  sub: 'Osmangazi\'de sanayi, atölye ve profesyonel ustalar için güvenilir ürün tedariği. 1985\'ten bu yana.',
}

const CAT_ICONS: Record<string, string> = {
  'el-aletleri': '🔨',
  'elektrikli-aletler': '⚡',
  'vida-civata': '🔩',
  'tesisat': '🔧',
  'boya': '🖌️',
  'is-guvenligi': '⛑️',
  'elektrik': '💡',
  'bahce': '🌿',
}

export default async function HomePage() {
  const [featured, categories, heroProduct] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
    getHeroProduct(),
  ])

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-white border-b border-slate-100 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{ backgroundImage: 'repeating-linear-gradient(135deg, #000 0 1px, transparent 1px 14px)' }}
        />

        <div className="relative max-w-[1280px] mx-auto px-4 py-16 md:py-24 grid md:grid-cols-[1.1fr_1fr] gap-10 md:gap-16 items-center">
          {/* Metin */}
          <div>
            {/* Eyebrow — altın */}
            <div className="inline-flex items-center gap-3 mb-8 text-[11.5px] font-display font-bold uppercase tracking-[0.28em]"
                 style={{ color: 'var(--sh-accent)' }}>
              <span className="h-px w-10" style={{ background: 'var(--sh-accent)' }} />
              {TONE.eyebrow}
            </div>

            <h1 className="font-display font-extrabold tracking-tight text-slate-900 leading-[1.0] text-balance"
                style={{ fontSize: 'clamp(36px, 4.5vw, 64px)' }}>
              {TONE.title}
            </h1>
            <p className="mt-7 text-slate-500 leading-relaxed max-w-lg"
               style={{ fontSize: 'clamp(15px, 1.5vw, 19px)' }}>
              {TONE.sub}
            </p>

            {/* Trust badges */}
            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-slate-500">
              {['Aynı gün Bursa içi', 'Orijinal & faturalı', 'Toptan fiyatlar'].map((t) => (
                <span key={t} className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded flex items-center justify-center text-[9px] font-bold"
                        style={{ background: 'rgba(212,160,23,0.2)', color: 'var(--sh-accent)' }}>✓</span>
                  {t}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/urunler"
                className="inline-flex items-center gap-2 h-14 px-8 font-display font-bold text-[#0b1220] text-[15px] rounded-xl transition-all duration-200 hover:brightness-110 active:scale-[0.97]"
                style={{ background: 'var(--sh-accent)', boxShadow: '0 6px 24px rgba(212,160,23,0.38)' }}
              >
                Kategorilere Göz At →
              </Link>
              <a
                href="https://wa.me/902242521347"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 h-14 px-6 text-slate-700 font-medium text-[15px] rounded-xl border border-slate-300 hover:bg-slate-50 transition"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-[#25D366]">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                WhatsApp&apos;tan sor
              </a>
            </div>

            {/* Stats — altın rakamlar */}
            <div className="mt-14 pt-8 grid grid-cols-3 gap-6 max-w-md border-t border-slate-200">
              {[['1985', 'Kuruluş'], ['40+', 'Marka'], ['8.500+', 'Ürün']].map(([n, l]) => (
                <div key={l}>
                  <div className="font-display font-extrabold leading-none"
                       style={{ fontSize: 'clamp(28px, 3vw, 44px)', color: 'var(--sh-accent)' }}>{n}</div>
                  <div className="text-[11px] text-slate-400 uppercase tracking-[0.22em] mt-2">{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Öne çıkan ürün kartı */}
          {heroProduct && <HeroProductCard product={heroProduct} />}
        </div>
      </section>

      {/* Trust Strip */}
      <section className="bg-white border-t border-slate-200">
        <div className="max-w-[1280px] mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { Icon: Truck,        title: 'Aynı Gün Bursa İçi', sub: '16:00\'a kadar olan siparişler aynı gün kapınızda.' },
            { Icon: ShieldCheck,  title: 'Orijinal & Faturalı', sub: 'Yetkili distribütör. Türkçe garanti belgesi.' },
            { Icon: Tag,          title: 'Toptan & Perakende', sub: 'Esnafa özel toptan fiyat. Kapıda ödeme.' },
            { Icon: Phone,        title: 'Ustaya Danışman',    sub: '0224 252 13 47 — pazartesi–cumartesi 08–19.' },
          ].map(({ Icon, title, sub }) => (
            <div key={title} className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-800 shrink-0">
                <Icon size={20} strokeWidth={1.75} />
              </div>
              <div>
                <div className="font-display font-bold text-slate-900 text-[14px] leading-tight">{title}</div>
                <div className="text-[12px] text-slate-500 mt-1 leading-snug">{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Marka Logoları */}
      <BrandLogos />

      {/* Kategori Grid */}
      {categories.length > 0 && (
        <section id="kategoriler" className="bg-slate-100 border-y border-slate-200">
          <div className="max-w-[1280px] mx-auto px-4 py-12 md:py-16">
            <div className="flex items-end justify-between mb-6 md:mb-8">
              <div>
                <div className="text-[11px] font-display font-bold uppercase tracking-[0.18em] text-slate-500 mb-2">
                  Bölümler
                </div>
                <h2 className="font-display font-bold text-slate-900 text-[28px] md:text-[34px] leading-tight">
                  Kategoriler
                </h2>
              </div>
              <Link href="/urunler" className="hidden sm:flex items-center gap-1 text-[13px] font-medium text-slate-600 hover:text-slate-900">
                Tüm kategoriler →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/urunler?kategori=${cat.slug}`}
                  className="group relative bg-white rounded-md p-4 md:p-5 text-left border border-slate-200 hover:border-slate-400 transition"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded bg-slate-100 text-slate-700 group-hover:bg-emerald-700 group-hover:text-white flex items-center justify-center transition text-xl">
                      {CAT_ICONS[cat.slug] || '🔧'}
                    </div>
                  </div>
                  <div className="font-display font-bold text-slate-900 text-[15px] leading-tight">
                    {cat.name}
                  </div>
                  <div className="text-[12px] text-slate-500 mt-0.5">Ürünleri incele</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Öne Çıkan Ürünler */}
      <section className="bg-white">
        <div className="max-w-[1280px] mx-auto px-4 py-12 md:py-20">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 md:mb-8">
            <div>
              <div className="text-[11px] font-display font-bold uppercase tracking-[0.18em] text-slate-500 mb-2">
                Öne Çıkanlar
              </div>
              <h2 className="font-display font-bold text-slate-900 text-[28px] md:text-[34px] leading-tight">
                Çok Satan Ürünler
              </h2>
            </div>
            <Link href="/urunler" className="text-[13px] font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1">
              Tüm ürünler →
            </Link>
          </div>

          {featured.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed border-slate-300 rounded-md bg-slate-50">
              <div className="font-display font-bold text-slate-700 text-[18px]">Henüz ürün eklenmemiş.</div>
              <div className="text-[13px] text-slate-500 mt-1">Admin panelinden ürün ekleyebilirsiniz.</div>
            </div>
          )}
        </div>
      </section>

      {/* Müşteri Yorumları */}
      <section className="bg-slate-100 border-t border-slate-200">
        <div className="max-w-[1280px] mx-auto px-4 py-14 md:py-20">
          <div className="text-[11px] font-display font-bold uppercase tracking-[0.18em] text-slate-500 mb-2">
            Müşteri Yorumları
          </div>
          <h2 className="font-display font-bold text-slate-900 text-[28px] md:text-[34px] leading-tight mb-8">
            Bursa esnafı bize güveniyor.
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { name: 'Mehmet K.', role: 'Mobilyacı, Yıldırım', text: '20 yıldır Şen\'den alıyorum. Söz verdikleri saatte teslim ediyorlar, fiyat dürüst. Esnafa esnaf gibi davranan az kaldı.' },
              { name: 'Ayşe T.', role: 'Ev tadilatı', text: 'Telefonla aradım, tam ihtiyacım olanı buldu. Akşam paket kapımdaydı.' },
              { name: 'Hakan D.', role: 'İnşaat firması', text: 'Toptan fiyatları rakiplerden daha makul. Faturalı satış, KDV dahil net fiyat.' },
            ].map((r) => (
              <div key={r.name} className="bg-white p-5 md:p-6 rounded-md border border-slate-200">
                <div className="flex gap-0.5 text-amber-500 mb-3">
                  {[1,2,3,4,5].map((i) => (
                    <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                    </svg>
                  ))}
                </div>
                <p className="text-[14px] text-slate-700 leading-relaxed">&ldquo;{r.text}&rdquo;</p>
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="font-display font-bold text-slate-900 text-[14px]">{r.name}</div>
                  <div className="text-[12px] text-slate-500">{r.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WhatsApp sabit */}
      <a
        href="https://wa.me/902242521347"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-30 inline-flex items-center gap-2 h-12 pl-3 pr-4 rounded-full bg-[#25D366] text-white font-medium text-[13px] hover:bg-[#1ea855] transition-all duration-300 hover:-translate-y-0.5"
        style={{ boxShadow: '0 4px 20px rgba(37,211,102,0.35), 0 2px 8px rgba(0,0,0,0.12)' }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
        WhatsApp
      </a>
    </div>
  )
}

const BRANDS = [
  { name: 'Bosch', letter: 'B', color: '#005BAC' },
  { name: 'Makita', letter: 'M', color: '#007DC5' },
  { name: 'Stanley', letter: 'S', color: '#FFB600' },
  { name: 'DeWalt', letter: 'D', color: '#FFCD11' },
  { name: 'Ceta Form', letter: 'C', color: '#E30613' },
  { name: 'Marshall', letter: 'M', color: '#004B8D' },
  { name: 'Pilsa', letter: 'P', color: '#00843D' },
  { name: 'Hilti', letter: 'H', color: '#E30713' },
]

function BrandLogos() {
  return (
    <section className="bg-white border-t border-slate-100">
      <div className="max-w-[1280px] mx-auto px-4 py-10">
        <div className="text-center mb-7">
          <p className="text-[11.5px] font-display font-bold uppercase tracking-[0.2em] text-slate-400">
            Yetkili Distribütör — Orijinal & Faturalı
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
          {BRANDS.map((b) => (
            <div
              key={b.name}
              className="flex items-center gap-2 h-11 px-5 rounded-lg border border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm transition-all duration-200 cursor-default"
            >
              <span
                className="w-6 h-6 rounded flex items-center justify-center text-white text-[11px] font-display font-bold shrink-0"
                style={{ background: b.color }}
              >
                {b.letter}
              </span>
              <span className="text-[13px] font-display font-bold text-slate-700">{b.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HeroProductCard({ product }: { product: Product }) {
  const discount = product.compare_price && product.compare_price > product.price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : null

  const catName = (product as Product & { categories?: { name: string } }).categories?.name

  return (
    <div className="relative">
      <div className="absolute -top-3 left-4 z-10 inline-flex items-center gap-1.5 bg-emerald-600 text-white text-[10.5px] font-display font-bold tracking-wider uppercase px-3 py-1.5 rounded">
        <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
        Haftanın Ürünü
      </div>
      <div className="bg-white rounded-lg overflow-hidden shadow-[0_30px_60px_-20px_rgba(0,0,0,0.35)] border border-slate-300">
        <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden flex items-center justify-center">
          <span className="text-7xl opacity-30">🔩</span>
          {discount && (
            <div className="absolute top-3 right-3 bg-slate-900 text-white text-[11px] font-display font-bold tracking-wider px-2.5 py-1 rounded">
              %{discount} İNDİRİM
            </div>
          )}
        </div>
        <div className="p-5 md:p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-display font-bold">
              {catName || 'Hırdavat'}
            </span>
            {product.sku && (
              <span className="text-[11px] text-slate-400 font-mono-custom">{product.sku}</span>
            )}
          </div>
          <h3 className="font-display font-bold text-slate-900 text-[18px] md:text-[20px] leading-tight">
            {product.name}
          </h3>
          <div className="mt-4 flex items-end justify-between">
            <div>
              {product.compare_price && (
                <div className="text-[13px] text-slate-400 line-through">{formatPrice(product.compare_price)}</div>
              )}
              <div className="font-display font-bold text-[28px] leading-none" style={{ color: 'var(--sh-green)' }}>
                {formatPrice(product.price)}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">KDV dahil</div>
            </div>
            <Link
              href={`/urunler/${product.slug}`}
              className="inline-flex items-center gap-2 h-11 px-4 text-white font-medium text-[13px] rounded-md transition"
              style={{ background: 'var(--sh-green)' }}
            >
              İncele →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
