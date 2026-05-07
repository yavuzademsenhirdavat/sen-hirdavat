'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { slugify } from '@/lib/utils'

type Category = { id: string; name: string }

export default function UrunEklePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm] = useState({
    name: '', slug: '', price: '', compare_price: '', stock: '0',
    category_id: '', sku: '', barcode: '', unit: 'adet',
    description: '', is_active: true, is_featured: false,
  })

  useEffect(() => {
    fetch('/api/admin/kategoriler').then((r) => r.json()).then(setCategories)
  }, [])

  function update(field: string, value: string | boolean) {
    setForm((f) => {
      const updated = { ...f, [field]: value }
      if (field === 'name' && typeof value === 'string') {
        updated.slug = slugify(value)
      }
      return updated
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/admin/urunler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          compare_price: form.compare_price ? parseFloat(form.compare_price) : null,
          stock: parseInt(form.stock),
          category_id: form.category_id || null,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success('Ürün eklendi')
        router.push('/admin/urunler')
      } else {
        toast.error(data.error || 'Hata oluştu')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Yeni Ürün Ekle</h1>

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
              className="mt-1 w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300">
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
              rows={3} className="mt-1 w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
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
          <Button type="submit" disabled={loading} className="bg-orange-600 hover:bg-orange-700">
            {loading ? 'Kaydediliyor...' : 'Ürünü Kaydet'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>İptal</Button>
        </div>
      </form>
    </div>
  )
}
