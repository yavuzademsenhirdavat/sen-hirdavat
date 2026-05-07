import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

const PATCH_WHITELIST = [
  'name', 'slug', 'description', 'price', 'compare_price',
  'stock', 'category_id', 'sku', 'barcode', 'unit',
  'is_active', 'is_featured',
]

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data, error } = await supabaseAdmin.from('products').select('*').eq('id', id).single()
  if (error) return NextResponse.json({ error: 'Ürün bulunamadı' }, { status: 404 })
  return NextResponse.json(data)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { error } = await supabaseAdmin.from('products').delete().eq('id', id)
  if (error) return NextResponse.json({ error: 'Silme başarısız' }, { status: 500 })
  return NextResponse.json({ success: true })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Geçersiz istek' }, { status: 400 })
  }

  // Sadece whitelist'teki alanları güncelle
  const updates: Record<string, unknown> = {}
  for (const field of PATCH_WHITELIST) {
    if (field in body) updates[field] = body[field]
  }
  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'Güncellenecek alan yok' }, { status: 400 })
  }

  // Sayısal alanları doğrula
  if ('price' in updates) {
    const price = Number(updates.price)
    if (isNaN(price) || price < 0) return NextResponse.json({ error: 'Geçersiz fiyat' }, { status: 400 })
    updates.price = price
  }
  if ('stock' in updates) {
    const stock = Number(updates.stock)
    if (isNaN(stock) || stock < 0) return NextResponse.json({ error: 'Geçersiz stok' }, { status: 400 })
    updates.stock = stock
  }
  if ('compare_price' in updates && updates.compare_price != null) {
    const cp = Number(updates.compare_price)
    if (isNaN(cp) || cp < 0) return NextResponse.json({ error: 'Geçersiz fiyat' }, { status: 400 })
    updates.compare_price = cp
  }

  const { error, data } = await supabaseAdmin
    .from('products').update(updates).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: 'Güncelleme başarısız' }, { status: 500 })
  return NextResponse.json(data)
}
