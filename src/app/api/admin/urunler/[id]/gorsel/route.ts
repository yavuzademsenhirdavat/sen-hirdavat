import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
}
const MAX_SIZE = 5 * 1024 * 1024

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'Dosya bulunamadı' }, { status: 400 })

  const ext = ALLOWED_TYPES[file.type]
  if (!ext) {
    return NextResponse.json({ error: 'Sadece JPG, PNG, WebP veya GIF yüklenebilir' }, { status: 400 })
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Dosya 5 MB'dan büyük olamaz" }, { status: 400 })
  }

  // Dosya adını tamamen random yap — orijinal isim kullanılmaz
  const safePath = `products/${id}/${crypto.randomUUID()}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())

  const { error: uploadError } = await supabaseAdmin.storage
    .from('product-images')
    .upload(safePath, buffer, { contentType: file.type, upsert: false })

  if (uploadError) return NextResponse.json({ error: 'Yükleme başarısız' }, { status: 500 })

  const { data: urlData } = supabaseAdmin.storage.from('product-images').getPublicUrl(safePath)
  const publicUrl = urlData.publicUrl

  const { data: product } = await supabaseAdmin
    .from('products').select('images').eq('id', id).single()

  const images = [...(product?.images || []), publicUrl]

  const { error: updateError } = await supabaseAdmin
    .from('products').update({ images }).eq('id', id)

  if (updateError) return NextResponse.json({ error: 'Kayıt başarısız' }, { status: 500 })

  return NextResponse.json({ url: publicUrl, images })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  let url: string
  try {
    const body = await req.json()
    url = body.url
    if (!url || typeof url !== 'string') throw new Error()
  } catch {
    return NextResponse.json({ error: 'Geçersiz istek' }, { status: 400 })
  }

  const { data: product } = await supabaseAdmin
    .from('products').select('images').eq('id', id).single()

  const images = (product?.images || []).filter((img: string) => img !== url)

  const { error } = await supabaseAdmin.from('products').update({ images }).eq('id', id)
  if (error) return NextResponse.json({ error: 'Kayıt başarısız' }, { status: 500 })

  try {
    const urlObj = new URL(url)
    const storagePath = urlObj.pathname.split('/product-images/')[1]
    if (storagePath) {
      await supabaseAdmin.storage.from('product-images').remove([storagePath])
    }
  } catch {
    // Storage silme başarısız olursa DB kaydı zaten güncel, devam et
  }

  return NextResponse.json({ images })
}
