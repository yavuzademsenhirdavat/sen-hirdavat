import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const { data } = await supabaseAdmin.from('categories').select('id, name').order('name')
  return NextResponse.json(data || [])
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Geçersiz istek' }, { status: 400 })
  }

  if (!body.name || typeof body.name !== 'string' || body.name.trim().length === 0) {
    return NextResponse.json({ error: 'Kategori adı zorunlu' }, { status: 400 })
  }

  const { error, data } = await supabaseAdmin.from('categories').insert(body).select().single()
  if (error) return NextResponse.json({ error: 'Kayıt başarısız' }, { status: 400 })
  return NextResponse.json(data, { status: 201 })
}
