import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Geçersiz istek' }, { status: 400 })
  }

  const price = Number(body.price)
  const stock = Number(body.stock)

  if (!body.name || typeof body.name !== 'string' || body.name.trim().length === 0) {
    return NextResponse.json({ error: 'Ürün adı zorunlu' }, { status: 400 })
  }
  if (isNaN(price) || price < 0) {
    return NextResponse.json({ error: 'Geçersiz fiyat' }, { status: 400 })
  }
  if (isNaN(stock) || stock < 0) {
    return NextResponse.json({ error: 'Geçersiz stok' }, { status: 400 })
  }

  const { error, data } = await supabaseAdmin.from('products').insert({
    ...body,
    price,
    stock,
    compare_price: body.compare_price != null ? Number(body.compare_price) : null,
  }).select().single()

  if (error) return NextResponse.json({ error: 'Kayıt başarısız' }, { status: 400 })
  return NextResponse.json(data, { status: 201 })
}
