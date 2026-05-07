import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
// @ts-expect-error - iyzipay has no types
import Iyzipay from 'iyzipay'

const iyzipay = new Iyzipay({
  apiKey: process.env.IYZICO_API_KEY,
  secretKey: process.env.IYZICO_SECRET_KEY,
  uri: process.env.IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com',
})

type CartItem = { id: string; name: string; quantity: number }

export async function POST(req: NextRequest) {
  try {
    let body: { customer: unknown; address: unknown; card: unknown; items: unknown }
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ success: false, message: 'Geçersiz istek' }, { status: 400 })
    }

    const { customer, address, card, items: rawItems } = body as {
      customer: { name: string; surname: string; phone: string; email?: string }
      address: { address: string; city: string }
      card: { holder: string; number: string; expiry: string; cvv: string }
      items: CartItem[]
    }

    // Temel alan kontrolü
    if (!customer?.name || !customer?.phone || !card?.number || !Array.isArray(rawItems) || rawItems.length === 0) {
      return NextResponse.json({ success: false, message: 'Eksik bilgi' }, { status: 400 })
    }

    // Kart son kullanma tarihi formatı
    if (!card.expiry || !/^\d{2}\/\d{2,4}$/.test(card.expiry.trim())) {
      return NextResponse.json({ success: false, message: 'Geçersiz son kullanma tarihi' }, { status: 400 })
    }

    // Adres uzunluk limitleri
    if (!address?.address || address.address.length > 256 || !address?.city || address.city.length > 100) {
      return NextResponse.json({ success: false, message: 'Geçersiz adres bilgisi' }, { status: 400 })
    }

    // Müşteri adı uzunluk limitleri
    if (customer.name.length > 100 || (customer.surname?.length ?? 0) > 100) {
      return NextResponse.json({ success: false, message: 'Geçersiz isim' }, { status: 400 })
    }

    const itemIds = rawItems.map((i) => i.id)

    // --- Sunucu tarafında fiyat + stok doğrula ---
    const { data: dbProducts, error: dbErr } = await supabaseAdmin
      .from('products')
      .select('id, name, price, stock, is_active')
      .in('id', itemIds)

    if (dbErr || !dbProducts) {
      return NextResponse.json({ success: false, message: 'Ürün bilgisi alınamadı' }, { status: 500 })
    }

    const productMap = new Map(dbProducts.map((p) => [p.id, p]))

    for (const item of rawItems) {
      const product = productMap.get(item.id)
      if (!product || !product.is_active) {
        return NextResponse.json({ success: false, message: `"${item.name}" ürünü bulunamadı` }, { status: 400 })
      }
      if (product.stock < item.quantity) {
        return NextResponse.json({ success: false, message: `"${product.name}" stokta yok (kalan: ${product.stock})` }, { status: 400 })
      }
      if (item.quantity < 1 || !Number.isInteger(item.quantity)) {
        return NextResponse.json({ success: false, message: 'Geçersiz miktar' }, { status: 400 })
      }
    }

    // Tutarı sunucuda hesapla — client'tan gelen `total` kullanılmaz
    const calculatedTotal = rawItems.reduce((sum, item) => {
      const price = productMap.get(item.id)!.price
      return sum + price * item.quantity
    }, 0)

    const conversationId = `SH-${crypto.randomUUID()}`
    const [expireMonth, expireYear] = card.expiry.split('/')

    const paymentRequest = {
      locale: 'tr',
      conversationId,
      price: calculatedTotal.toFixed(2),
      paidPrice: calculatedTotal.toFixed(2),
      currency: 'TRY',
      installment: '1',
      basketId: conversationId,
      paymentChannel: 'WEB',
      paymentGroup: 'PRODUCT',
      paymentCard: {
        cardHolderName: card.holder,
        cardNumber: card.number.replace(/\s/g, ''),
        expireMonth,
        expireYear: expireYear.length === 2 ? `20${expireYear}` : expireYear,
        cvc: card.cvv,
        registerCard: '0',
      },
      buyer: {
        id: `BUYER-${crypto.randomUUID()}`,
        name: customer.name,
        surname: customer.surname,
        gsmNumber: customer.phone,
        email: customer.email || 'musteri@senhirdavat.com',
        identityNumber: '11111111111',
        registrationAddress: address.address,
        ip: (req.headers.get('x-forwarded-for') || '127.0.0.1').split(',')[0].trim(),
        city: address.city,
        country: 'Turkey',
      },
      shippingAddress: {
        contactName: `${customer.name} ${customer.surname}`,
        city: address.city,
        country: 'Turkey',
        address: address.address,
      },
      billingAddress: {
        contactName: `${customer.name} ${customer.surname}`,
        city: address.city,
        country: 'Turkey',
        address: address.address,
      },
      basketItems: rawItems.map((item) => ({
        id: item.id,
        name: productMap.get(item.id)!.name.slice(0, 100),
        category1: 'Hırdavat',
        itemType: 'PHYSICAL',
        price: (productMap.get(item.id)!.price * item.quantity).toFixed(2),
      })),
    }

    const paymentResult = await new Promise<{ status: string; paymentId?: string; errorMessage?: string }>((resolve, reject) => {
      iyzipay.payment.create(paymentRequest, (err: Error, result: unknown) => {
        if (err) reject(err)
        else resolve(result as { status: string; paymentId?: string; errorMessage?: string })
      })
    })

    if (paymentResult.status !== 'success') {
      return NextResponse.json({ success: false, message: paymentResult.errorMessage || 'Ödeme reddedildi' })
    }

    // Sipariş kaydet
    const { data: order } = await supabaseAdmin
      .from('orders')
      .insert({
        customer_name: `${customer.name} ${customer.surname}`,
        customer_phone: customer.phone,
        customer_email: customer.email,
        shipping_address: address,
        total: calculatedTotal,
        payment_method: 'card',
        payment_id: paymentResult.paymentId,
        payment_status: 'paid',
        status: 'processing',
      })
      .select('id, order_number')
      .single()

    if (order) {
      await supabaseAdmin.from('order_items').insert(
        rawItems.map((item) => ({
          order_id: order.id,
          product_id: item.id,
          product_name: productMap.get(item.id)!.name,
          quantity: item.quantity,
          unit_price: productMap.get(item.id)!.price,
          total_price: productMap.get(item.id)!.price * item.quantity,
        }))
      )

      for (const item of rawItems) {
        const { error: stockErr } = await supabaseAdmin
          .rpc('decrement_stock', { product_id: item.id, qty: item.quantity })
          .maybeSingle()
        if (stockErr) console.error('Stok güncelleme hatası:', item.id, stockErr.message)
      }
    }

    return NextResponse.json({ success: true, orderNumber: order?.order_number })
  } catch (error) {
    console.error('Ödeme hatası:', error)
    return NextResponse.json({ success: false, message: 'Sunucu hatası oluştu' }, { status: 500 })
  }
}
