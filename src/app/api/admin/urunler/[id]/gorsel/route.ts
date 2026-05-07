import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'Dosya bulunamadı' }, { status: 400 })

  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'Sadece JPG, PNG, WebP veya GIF yüklenebilir' }, { status: 400 })
  }

  const MAX_SIZE = 5 * 1024 * 1024 // 5 MB
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'Dosya 5 MB\'dan büyük olamaz' }, { status: 400 })
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const path = `products/${id}/${Date.now()}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())

  const { error: uploadError } = await supabaseAdmin.storage
    .from('product-images')
    .upload(path, buffer, { contentType: file.type, upsert: false })

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 })

  const { data: urlData } = supabaseAdmin.storage.from('product-images').getPublicUrl(path)
  const publicUrl = urlData.publicUrl

  const { data: product } = await supabaseAdmin
    .from('products')
    .select('images')
    .eq('id', id)
    .single()

  const images = [...(product?.images || []), publicUrl]

  const { error: updateError } = await supabaseAdmin
    .from('products')
    .update({ images })
    .eq('id', id)

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 })

  return NextResponse.json({ url: publicUrl, images })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { url } = await req.json()

  const { data: product } = await supabaseAdmin
    .from('products')
    .select('images')
    .eq('id', id)
    .single()

  const images = (product?.images || []).filter((img: string) => img !== url)

  const { error } = await supabaseAdmin.from('products').update({ images }).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Extract storage path and delete from bucket
  const urlObj = new URL(url)
  const storagePath = urlObj.pathname.split('/product-images/')[1]
  if (storagePath) {
    await supabaseAdmin.storage.from('product-images').remove([storagePath])
  }

  return NextResponse.json({ images })
}
