import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { ProductCard } from '@/components/product-card'
import { Button } from '@/components/ui/button'
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
      <section className="bg-gradient-to-r from-green-700 to-green-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-[family-name:var(--font-barlow)] font-bold tracking-wide mb-4">
            Bursa&apos;nın Güvenilir<br />Hırdavat Mağazası
          </h1>
          <p className="text-green-100 text-lg mb-8">
            El aletleri, tesisat, yapı malzemeleri ve daha fazlası.<br />
            Aynı gün teslimat • Osmangazi, Bursa
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/urunler">
              <Button size="lg" className="bg-white text-green-700 hover:bg-green-50 font-semibold">
                Ürünleri İncele
              </Button>
            </Link>
            <a
              href="https://wa.me/905XXXXXXXXX?text=Merhaba,%20ürünler%20hakkında%20bilgi%20almak%20istiyorum."
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-green-800">
                WhatsApp ile Ulaş
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Avantajlar */}
      <section className="bg-white border-b py-6">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Truck, title: 'Aynı Gün Teslimat', desc: 'Bursa içi siparişlerde' },
            { icon: ShieldCheck, title: 'Kaliteli Ürünler', desc: 'Güvenilir markalar' },
            { icon: Phone, title: '7/2 Destek', desc: '0224 254 10 10' },
            { icon: Star, title: '4.5★ Müşteri Memnuniyeti', desc: '32+ değerlendirme' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-3 py-2">
              <Icon size={28} className="text-green-600 flex-shrink-0" />
              <div>
                <div className="font-semibold text-sm text-gray-800">{title}</div>
                <div className="text-xs text-gray-500">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Kategoriler */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Kategoriler</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/urunler?kategori=${cat.slug}`}
                className="bg-white border rounded-xl p-5 text-center hover:border-green-500 hover:shadow-md transition-all"
              >
                <div className="text-3xl mb-2">🔧</div>
                <div className="font-semibold text-gray-800 text-sm">{cat.name}</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Öne Çıkan Ürünler */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Öne Çıkan Ürünler</h2>
          <Link href="/urunler" className="text-green-700 text-sm hover:underline">
            Tümünü Gör →
          </Link>
        </div>

        {featured.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg mb-2">Henüz ürün eklenmemiş.</p>
            <p className="text-sm">Admin panelinden ürün ekleyebilirsiniz.</p>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-gray-800 text-white py-12 px-4 text-center">
        <h2 className="text-2xl font-bold mb-3">Toplu Sipariş mi veriyorsunuz?</h2>
        <p className="text-gray-400 mb-6">Özel fiyat ve fatura için bizi arayın veya WhatsApp&apos;tan ulaşın.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="tel:02242541010">
            <Button size="lg" className="bg-green-700 hover:bg-green-800">
              0224 254 10 10
            </Button>
          </a>
          <a href="https://wa.me/905XXXXXXXXX" target="_blank" rel="noopener noreferrer">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-gray-700">
              WhatsApp
            </Button>
          </a>
        </div>
      </section>
    </div>
  )
}
