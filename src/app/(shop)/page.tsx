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

export default async function HomePage() {
  const [featured, categories, heroProduct] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
    getHeroProduct(),
  ])

  return (
    <div>
      {/* ── Sarı bilgi bandı ── */}
      <div className="bg-[#ffc837] border-b border-[#f0b800]">
        <div className="max-w-[1280px] mx-auto px-3 h-8 flex items-center justify-between text-[11.5px] font-semibold text-[#2c2a28]">
          <span>Bursa Osmangazi — 1985&apos;ten bu yana 8.500+ ürün</span>
          <span className="hidden sm:block">Aynı gün Bursa içi teslimat · Toptan fiyatlar</span>
        </div>
      </div>

      {/* ── Hero ── */}
      <section className="bg-white border-b border-[#eeeeee]">
        <div className="max-w-[1280px] mx-auto px-3 py-10 md:py-14 grid md:grid-cols-[1fr_340px] gap-8 items-center">
          {/* Metin */}
          <div>
            <h1 className="font-display font-extrabold text-[#2c2a28] leading-tight text-balance"
                style={{ fontSize: 'clamp(28px, 3.5vw, 48px)' }}>
              Profesyonel Hırdavat ve<br className="hidden md:block" />
              Endüstriyel Çözümler
            </h1>
            <p className="mt-4 text-slate-500 text-[14px] leading-relaxed max-w-[500px]">
              Osmangazi&apos;de sanayi, atölye ve profesyonel ustalar için güvenilir ürün tedariği.
            </p>

            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
              {['Aynı gün Bursa içi', 'Orijinal & faturalı', 'Toptan fiyatlar'].map((t) => (
                <span key={t} className="flex items-center gap-1.5 text-[13px] text-slate-600">
                  <span className="w-4 h-4 rounded-sm flex items-center justify-center text-[9px] font-bold text-[#2c2a28]"
                        style={{ background: '#ffc837' }}>✓</span>
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/urunler"
                className="inline-flex items-center gap-2 h-11 px-6 font-bold text-[13px] text-[#2c2a28] rounded transition hover:brightness-105 active:scale-[0.97]"
                style={{ background: '#ffc837' }}
              >
                Ürünleri İncele →
              </Link>
              <a
                href="https://wa.me/902242521347"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 h-11 px-5 text-[13px] font-medium text-[#2c2a28] rounded border border-[#dddddd] hover:bg-slate-50 transition"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-[#25D366]">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                WhatsApp&apos;tan sor
              </a>
            </div>

            {/* Stats */}
            <div className="mt-10 pt-6 grid grid-cols-3 gap-5 border-t border-[#eeeeee] max-w-[360px]">
              {[['1985', 'Kuruluş'], ['40+', 'Marka'], ['8.500+', 'Ürün']].map(([n, l]) => (
                <div key={l}>
                  <div className="font-display font-extrabold text-[#2c2a28] leading-none" style={{ fontSize: 28 }}>{n}</div>
                  <div className="text-[10.5px] text-slate-400 uppercase tracking-wider mt-1">{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero ürün */}
          {heroProduct && <HeroProductCard product={heroProduct} />}
        </div>
      </section>

      {/* ── Trust Strip ── */}
      <section className="bg-white border-b border-[#eeeeee]">
        <div className="max-w-[1280px] mx-auto px-3 py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { Icon: Truck,       title: 'Aynı Gün Bursa İçi',  sub: '16:00&apos;a kadar siparişler.' },
            { Icon: ShieldCheck, title: 'Orijinal & Faturalı',  sub: 'Yetkili distribütör.' },
            { Icon: Tag,         title: 'Toptan & Perakende',   sub: 'Esnafa özel fiyat.' },
            { Icon: Phone,       title: 'Ustaya Danışman',      sub: '0224 252 13 47' },
          ].map(({ Icon, title, sub }) => (
            <div key={title} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded flex items-center justify-center shrink-0"
                   style={{ background: '#ffc837' }}>
                <Icon size={17} className="text-[#2c2a28]" strokeWidth={2} />
              </div>
              <div>
                <div className="font-semibold text-[#2c2a28] text-[12.5px] leading-tight">{title}</div>
                <div className="text-[11px] text-slate-500"
                     dangerouslySetInnerHTML={{ __html: sub }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Marka Logoları ── */}
      <section className="bg-[#f5f5f5] border-b border-[#eeeeee]">
        <div className="max-w-[1280px] mx-auto px-3 py-5">
          <p className="text-center text-[10.5px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">
            Yetkili Distribütör — Orijinal & Faturalı
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {BRANDS.map((b) => (
              <div
                key={b.name}
                className="flex items-center gap-1.5 h-9 px-4 rounded border border-[#e5e5e5] bg-white hover:border-[#cccccc] transition cursor-default"
              >
                <span
                  className="w-5 h-5 rounded-sm flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                  style={{ background: b.color }}
                >
                  {b.letter}
                </span>
                <span className="text-[12px] font-bold text-[#2c2a28]">{b.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Kategoriler ── */}
      {categories.length > 0 && (
        <section className="bg-white border-b border-[#eeeeee]">
          <div className="max-w-[1280px] mx-auto px-3 py-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-bold text-[#2c2a28] text-[20px]">Kategoriler</h2>
              <Link href="/urunler" className="text-[12px] text-[#1da261] font-medium hover:underline">
                Tüm kategoriler →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/urunler?kategori=${cat.slug}`}
                  className="group flex flex-col items-center gap-2 py-4 px-2 bg-[#f8f8f8] hover:bg-[#fff8e1] border border-[#eeeeee] hover:border-[#ffc837] rounded transition text-center"
                >
                  <div className="text-2xl">{CAT_ICONS[cat.slug] || '🔧'}</div>
                  <div className="text-[11.5px] font-semibold text-[#2c2a28] leading-tight">{cat.name}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Öne Çıkan Ürünler ── */}
      <section className="bg-[#f5f5f5]">
        <div className="max-w-[1280px] mx-auto px-3 py-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-bold text-[#2c2a28] text-[20px]">Çok Satan Ürünler</h2>
            <Link href="/urunler" className="text-[12px] text-[#1da261] font-medium hover:underline">
              Tüm ürünler →
            </Link>
          </div>

          {featured.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-14 border border-dashed border-[#dddddd] rounded bg-white">
              <div className="font-bold text-[#2c2a28] text-[16px]">Henüz ürün eklenmemiş.</div>
              <div className="text-[12px] text-slate-500 mt-1">Admin panelinden ürün ekleyebilirsiniz.</div>
            </div>
          )}
        </div>
      </section>

      {/* ── Müşteri Yorumları ── */}
      <section className="bg-white border-t border-[#eeeeee]">
        <div className="max-w-[1280px] mx-auto px-3 py-10">
          <h2 className="font-display font-bold text-[#2c2a28] text-[20px] mb-6">Bursa esnafı bize güveniyor.</h2>
          <div className="grid md:grid-cols-3 gap-3">
            {[
              { name: 'Mehmet K.', role: 'Mobilyacı, Yıldırım', text: '20 yıldır Şen\'den alıyorum. Söz verdikleri saatte teslim ediyorlar, fiyat dürüst. Esnafa esnaf gibi davranan az kaldı.' },
              { name: 'Ayşe T.', role: 'Ev tadilatı', text: 'Telefonla aradım, tam ihtiyacım olanı buldu. Akşam paket kapımdaydı.' },
              { name: 'Hakan D.', role: 'İnşaat firması', text: 'Toptan fiyatları rakiplerden daha makul. Faturalı satış, KDV dahil net fiyat.' },
            ].map((r) => (
              <div key={r.name} className="bg-[#f8f8f8] border border-[#eeeeee] rounded p-5">
                <div className="flex gap-0.5 mb-3">
                  {[1,2,3,4,5].map((i) => (
                    <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill="#ffc837">
                      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                    </svg>
                  ))}
                </div>
                <p className="text-[13px] text-slate-700 leading-relaxed">&ldquo;{r.text}&rdquo;</p>
                <div className="mt-3 pt-3 border-t border-[#eeeeee]">
                  <div className="font-bold text-[#2c2a28] text-[13px]">{r.name}</div>
                  <div className="text-[11px] text-slate-500">{r.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WhatsApp sabit ── */}
      <a
        href="https://wa.me/902242521347"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-30 inline-flex items-center gap-2 h-11 pl-3 pr-4 rounded-full bg-[#25D366] text-white font-medium text-[13px] hover:bg-[#1ea855] transition-all duration-200 hover:-translate-y-0.5"
        style={{ boxShadow: '0 4px 16px rgba(37,211,102,0.35)' }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
        WhatsApp
      </a>
    </div>
  )
}

function HeroProductCard({ product }: { product: Product }) {
  const discount = product.compare_price && product.compare_price > product.price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : null

  const catName = (product as Product & { categories?: { name: string } }).categories?.name

  return (
    <div className="relative">
      <div className="absolute -top-3 left-4 z-10 inline-flex items-center gap-1.5 text-[#2c2a28] text-[10.5px] font-bold uppercase tracking-wide px-3 py-1 rounded"
           style={{ background: '#ffc837' }}>
        <span className="h-1.5 w-1.5 rounded-full bg-[#2c2a28] animate-pulse" />
        Haftanın Ürünü
      </div>
      <div className="bg-white border border-[#e5e5e5] rounded overflow-hidden"
           style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.10)' }}>
        <div className="aspect-[4/3] bg-[#f8f8f8] relative flex items-center justify-center">
          <span className="text-7xl opacity-20">🔩</span>
          {discount && (
            <div className="absolute top-3 right-3 bg-[#e42437] text-white text-[11px] font-bold px-2 py-0.5 rounded">
              %{discount} İNDİRİM
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="text-[10.5px] uppercase tracking-wider text-slate-500 font-bold mb-1">
            {catName || 'Hırdavat'}
          </div>
          <h3 className="font-bold text-[#2c2a28] text-[16px] leading-tight">{product.name}</h3>
          <div className="mt-3 flex items-end justify-between">
            <div>
              {product.compare_price && (
                <div className="text-[12px] text-slate-400 line-through">{formatPrice(product.compare_price)}</div>
              )}
              <div className="font-display font-bold text-[26px] leading-none text-[#2c2a28]">
                {formatPrice(product.price)}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">KDV dahil</div>
            </div>
            <Link
              href={`/urunler/${product.slug}`}
              className="inline-flex items-center h-10 px-4 text-[13px] font-bold text-[#2c2a28] rounded transition hover:brightness-105"
              style={{ background: '#ffc837' }}
            >
              İncele →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
