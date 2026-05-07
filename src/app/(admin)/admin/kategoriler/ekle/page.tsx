'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { slugify } from '@/lib/utils'

type Category = { id: string; name: string }

export default function KategoriEklePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm] = useState({ name: '', slug: '', parent_id: '', sort_order: '0' })

  useEffect(() => {
    fetch('/api/admin/kategoriler').then((r) => r.json()).then(setCategories)
  }, [])

  function update(field: string, value: string) {
    setForm((f) => {
      const updated = { ...f, [field]: value }
      if (field === 'name') updated.slug = slugify(value)
      return updated
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/admin/kategoriler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          slug: form.slug,
          parent_id: form.parent_id || null,
          sort_order: parseInt(form.sort_order),
        }),
      })
      if (res.ok) { toast.success('Kategori eklendi'); router.push('/admin/kategoriler') }
      else { const d = await res.json(); toast.error(d.error || 'Hata') }
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Yeni Kategori</h1>
      <form onSubmit={handleSubmit} className="bg-white border rounded-xl p-6 space-y-4">
        <div>
          <Label>Kategori Adı *</Label>
          <Input required value={form.name} onChange={(e) => update('name', e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label>Slug (URL)</Label>
          <Input required value={form.slug} onChange={(e) => update('slug', e.target.value)} className="mt-1 font-mono text-sm" />
        </div>
        <div>
          <Label>Üst Kategori</Label>
          <select value={form.parent_id} onChange={(e) => update('parent_id', e.target.value)}
            className="mt-1 w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300">
            <option value="">Ana Kategori (üst yok)</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <Label>Sıra</Label>
          <Input type="number" value={form.sort_order} onChange={(e) => update('sort_order', e.target.value)} className="mt-1" />
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={loading} className="bg-green-700 hover:bg-green-800">
            {loading ? 'Kaydediliyor...' : 'Kategoriyi Kaydet'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>İptal</Button>
        </div>
      </form>
    </div>
  )
}
