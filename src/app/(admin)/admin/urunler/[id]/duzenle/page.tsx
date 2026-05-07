'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { slugify } from '@/lib/utils'
import Image from 'next/image'
import { X, Upload, Loader2 } from 'lucide-react'

type Category = { id: string; name: string }

type Form = {
  name: string; slug: string; price: string; compare_price: string; stock: string
  category_id: string; sku: string; barcode: string; unit: string
  description: string; is_active: boolean; is_featured: boolean
}

export default function UrunDuzenlePage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [images, setImages] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState<Form>({
    name: '', slug: '', price: '', compare_price: '', stock: '0',
    category_id: '', sku: '', barcode: '', unit: 'adet',
    description: '', is_active: true, is_featured: false,
  })

  useEffect(() => {
    fetch('/api/admin/kategoriler').then((r) => r.json()).then(setCategories)
    fetch(`/api/admin/urunler/${id}`).then((r) => r.json()).then((p) => {
      if (!p || p.error) { toast.error('Ürün bulunamadı'); router.push('/admin/urunler'); return }
      setForm({
        name: p.name || '', slug: p.slug || '',
        price: p.price?.toString() || '', compare_price: p.compare_price?.toString() || '',
        stock: p.stock?.toString() || '0', category_id: p.category_id || '',
        sku: p.sku || '', barcode: p.barcode || '', unit: p.unit || 'adet',
        description: p.description || '', is_active: p.is_active ?? true, is_featured: p.is_featured ?? false,
      })
      setImages(p.images || [])
      setFetching(false)
    })
  }, [id, router])

  function update(field: string, value: string | boolean) {
    setForm((f) => {
      const updated = { ...f, [field]: value }
      if (field === 'name' && typeof value === 'string') updated.slug = slugify(value)
      return updated
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/urunler/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          compare_price: form.compare_price ? parseFloat(form.compare_price) : null,
          stock: parseInt(form.stock),
          category_id: form.category_id || null,
        }),
      })
      if (res.ok) { toast.success('Ürün güncellendi'); router.push('/admin/urunler') }
      else { const d = await res.json(); toast.error(d.error || 'Hata oluştu') }
    } finally {
      setLoading(false)
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch(`/api/admin/urunler/${id}/gorsel`, { method: 'POST', body: fd })
      const data = await res.json()
      if (res.ok) { setImages(data.images); toast.success('Görsel yüklendi') }
      else toast.error(data.error || 'Görsel yüklenemedi')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  async function handleDeleteImage(url: string) {
    const res = await fetch(`/api/admin/urunler/${id}/gorsel`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    })
    const data = await res.json()
    if (res.ok) { setImages(data.images); toast.success('Görsel silindi') }
    else toast.error(data.error || 'Görsel silinemedi')
  }

  if (fetching) return <div className="p-6 text-gray-500">Yükleniyor...</div>

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Ürün Düzenle</h1>

      {/* Görseller */}
      <div className="bg-white border rounded-xl p-6 mb-6">
        <Label className="text-base font-semibold mb-3 block">Görseller</Label>
        <div className="flex flex-wrap gap-3 mb-3">
          {images.map((url, i) => (
            <div key={i} className="relative group w-24 h-24 rounded-lg overflow-hidden border">
              <Image src={url} alt={`Görsel ${i + 1}`} fill className="object-cover" />
              <button
                onClick={() => handleDeleteImage(url)}
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-green-500 hover:text-green-600 transition-colors"
          >
            {uploading ? <Loader2 size={20} className="animate-spin" /> : <><Upload size={20} /><span className="text-xs mt-1">Ekle</span></>}
          </button>
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
        <p className="text-xs text-gray-400">JPG, PNG, WebP desteklenir. İlk görsel kapak olarak kullanılır.</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white border rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Label>Ürün Adı *</Label>
            <Input required value={form.name} onChange={(e) => update('name', e.target.value)} className="mt-1" />
          </div>
          <div className="col-span-2">
            <Label>Slug (URL)</Label>
            <Input value={form.slug} onChange={(e) => update('slug', e.target.value)} className="mt-1 font-mono text-sm" />
          </div>
          <div>
            <Label>Fiyat (₺) *</Label>
            <Input required type="number" step="0.01" value={form.price} onChange={(e) => update('price', e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label>Karşılaştırma Fiyatı (₺)</Label>
            <Input type="number" step="0.01" value={form.compare_price} onChange={(e) => update('compare_price', e.target.value)} className="mt-1" placeholder="İndirim için eski fiyat" />
          </div>
          <div>
            <Label>Stok *</Label>
            <Input required type="number" value={form.stock} onChange={(e) => update('stock', e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label>Birim</Label>
            <Input value={form.unit} onChange={(e) => update('unit', e.target.value)} className="mt-1" placeholder="adet, kg, m..." />
          </div>
          <div>
            <Label>Kategori</Label>
            <select value={form.category_id} onChange={(e) => update('category_id', e.target.value)}
              className="mt-1 w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400">
              <option value="">Seçin</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <Label>SKU</Label>
            <Input value={form.sku} onChange={(e) => update('sku', e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label>Barkod</Label>
            <Input value={form.barcode} onChange={(e) => update('barcode', e.target.value)} className="mt-1" />
          </div>
          <div className="col-span-2">
            <Label>Açıklama</Label>
            <textarea value={form.description} onChange={(e) => update('description', e.target.value)}
              rows={3} className="mt-1 w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.is_active} onChange={(e) => update('is_active', e.target.checked)} />
              Aktif
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.is_featured} onChange={(e) => update('is_featured', e.target.checked)} />
              Öne Çıkar
            </label>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={loading} className="bg-green-700 hover:bg-green-800">
            {loading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>İptal</Button>
        </div>
      </form>
    </div>
  )
}
