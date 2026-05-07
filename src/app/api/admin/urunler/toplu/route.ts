import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { slugify } from '@/lib/utils'

type CsvRow = {
  name: string
  price: string
  stock: string
  category?: string
  sku?: string
  barcode?: string
  unit?: string
  description?: string
  compare_price?: string
}

export async function POST(req: NextRequest) {
  const { products } = await req.json() as { products: CsvRow[] }

  // Mevcut kategorileri al
  const { data: cats } = await supabaseAdmin.from('categories').select('id, name')
  const catMap = new Map(cats?.map((c) => [c.name.toLowerCase(), c.id]) || [])

  const results = []
  for (const row of products) {
    if (!row.name || !row.price) {
      results.push({ name: row.name || '?', success: false, error: 'name ve price zorunlu' })
      continue
    }

    try {
      let categoryId: string | null = null
      if (row.category) {
        categoryId = catMap.get(row.category.toLowerCase()) || null
        if (!categoryId) {
          const slug = slugify(row.category)
          const { data: newCat } = await supabaseAdmin
            .from('categories')
            .upsert({ name: row.category, slug }, { onConflict: 'slug' })
            .select('id')
            .single()
          if (newCat) { categoryId = newCat.id; catMap.set(row.category.toLowerCase(), newCat.id) }
        }
      }

      const baseSlug = slugify(row.name)
      let slug = baseSlug
      let attempt = 0
      while (true) {
        const { data: existing } = await supabaseAdmin.from('products').select('id').eq('slug', slug).maybeSingle()
        if (!existing) break
        attempt++; slug = `${baseSlug}-${attempt}`
      }

      const price = parseFloat(row.price)
      const stock = parseInt(row.stock || '0')
      const comparePrice = row.compare_price ? parseFloat(row.compare_price) : null

      if (isNaN(price) || price < 0) {
        results.push({ name: row.name, success: false, error: 'Geçersiz fiyat' })
        continue
      }

      await supabaseAdmin.from('products').insert({
        name: row.name,
        slug,
        price,
        compare_price: comparePrice != null && !isNaN(comparePrice) ? comparePrice : null,
        stock: isNaN(stock) || stock < 0 ? 0 : stock,
        category_id: categoryId,
        sku: row.sku || null,
        barcode: row.barcode || null,
        unit: row.unit || 'adet',
        description: row.description || null,
      })

      results.push({ name: row.name, success: true })
    } catch {
      results.push({ name: row.name, success: false, error: 'Eklenemedi' })
    }
  }

  return NextResponse.json({ results })
}
