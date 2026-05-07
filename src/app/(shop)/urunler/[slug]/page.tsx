import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { formatPrice, buildWhatsAppUrl } from '@/lib/utils'
import { AddToCartButton } from '@/components/add-to-cart-button'
import { Badge } from '@/components/ui/badge'
import { MessageCircle, Package, Tag, BarChart2 } from 'lucide-react'
import type { Metadata } from 'next'

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '905XXXXXXXXX'

interface Props {
  params: Promise<{ slug: string }>
}

async function getProduct(slug: string) {
  const { data } = await supabase
    .from('products')
    .select('*, categories(name, slug)')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()
  return data
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) return {}
  return {
    title: `${product.name} | Şen Hırdavat`,
    description: product.description || `${product.name} — Şen Hırdavat Bursa`,
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) notFound()

  const images = product.images?.length > 0 ? product.images : []
  const discount = product.compare_price && product.compare_price > product.price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : null

  const waMessage = `Merhaba! "${product.name}" ürününü sipariş etmek istiyorum. Stok durumu nedir?`

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Görseller */}
        <div>
          <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden border">
            {images[0] ? (
              <Image src={images[0]} alt={product.name} fill className="object-contain p-4" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-8xl">🔩</div>
            )}
            {discount && (
              <Badge className="absolute top-3 left-3 bg-red-500 text-base px-3 py-1">-%{discount}</Badge>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto">
              {images.slice(1).map((img: string, i: number) => (
                <div key={i} className="relative w-20 h-20 flex-shrink-0 border rounded-lg overflow-hidden">
                  <Image src={img} alt={`${product.name} ${i + 2}`} fill className="object-contain p-1" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bilgiler */}
        <div>
          {product.categories && (
            <a href={`/urunler?kategori=${product.categories.slug}`} className="text-sm text-green-700 hover:underline">
              {product.categories.name}
            </a>
          )}

          <h1 className="text-2xl font-bold text-gray-900 mt-1 mb-3">{product.name}</h1>

          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-3xl font-bold text-green-700">{formatPrice(product.price)}</span>
            {product.compare_price && (
              <span className="text-lg text-gray-400 line-through">{formatPrice(product.compare_price)}</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6 text-sm text-gray-600">
            {product.sku && (
              <div className="flex items-center gap-2">
                <Tag size={14} className="text-gray-400" />
                <span>SKU: <strong>{product.sku}</strong></span>
              </div>
            )}
            {product.barcode && (
              <div className="flex items-center gap-2">
                <BarChart2 size={14} className="text-gray-400" />
                <span>Barkod: <strong>{product.barcode}</strong></span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Package size={14} className="text-gray-400" />
              <span>Birim: <strong>{product.unit}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              {product.stock > 0 ? (
                <Badge className="bg-green-100 text-green-700 font-normal">Stokta var ({product.stock})</Badge>
              ) : (
                <Badge className="bg-red-100 text-red-700 font-normal">Stokta yok</Badge>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <AddToCartButton product={product} />

            <a
              href={buildWhatsAppUrl(WHATSAPP, waMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-lg border-2 border-green-500 text-green-600 font-semibold hover:bg-green-50 transition-colors"
            >
              <MessageCircle size={20} />
              WhatsApp ile Sipariş Ver
            </a>
          </div>

          {product.description && (
            <div className="mt-6 pt-6 border-t">
              <h2 className="font-semibold text-gray-800 mb-2">Ürün Açıklaması</h2>
              <p className="text-sm text-gray-600 whitespace-pre-line">{product.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
