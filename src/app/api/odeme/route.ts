import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
// @ts-expect-error - iyzipay has no types
import Iyzipay from 'iyzipay'

const iyzipay = new Iyzipay({
  apiKey: process.env.IYZICO_API_KEY,
  secretKey: process.env.IYZICO_SECRET_KEY,
  uri: process.env.IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com',
})

export async function POST(req: NextRequest) {
  try {
    const { customer, address, card, items, total } = await req.json()

    const conversationId = `SH-${Date.now()}`
    const [expireMonth, expireYear] = card.expiry.split('/')

    const paymentRequest = {
      locale: 'tr',
      conversationId,
      price: String(total.toFixed(2)),
      paidPrice: String(total.toFixed(2)),
      currency: 'TRY',
      installment: '1',
      basketId: conversationId,
      paymentChannel: 'WEB',
      paymentGroup: 'PRODUCT',
      paymentCard: {
        cardHolderName: card.holder,
        cardNumber: card.number,
        expireMonth,
        expireYear: `20${expireYear}`,
        cvc: card.cvv,
        registerCard: '0',
      },
      buyer: {
        id: `BUYER-${Date.now()}`,
        name: customer.name,
        surname: customer.surname,
        gsmNumber: customer.phone,
        email: customer.email || 'musteri@senhirdavat.com',
        identityNumber: '11111111111',
        registrationAddress: address.address,
        ip: req.headers.get('x-forwarded-for') || '127.0.0.1',
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
      basketItems: items.map((item: { id: string; name: string; price: number; quantity: number }) => ({
        id: item.id,
        name: item.name.slice(0, 100),
        category1: 'Hırdavat',
        itemType: 'PHYSICAL',
        price: String((item.price * item.quantity).toFixed(2)),
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

    // Siparişi kaydet
    const { data: order } = await supabaseAdmin
      .from('orders')
      .insert({
        customer_name: `${customer.name} ${customer.surname}`,
        customer_phone: customer.phone,
        customer_email: customer.email,
        shipping_address: address,
        total,
        payment_method: 'card',
        payment_id: paymentResult.paymentId,
        payment_status: 'paid',
        status: 'processing',
      })
      .select('id, order_number')
      .single()

    if (order) {
      await supabaseAdmin.from('order_items').insert(
        items.map((item: { id: string; name: string; price: number; quantity: number }) => ({
          order_id: order.id,
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity,
          unit_price: item.price,
          total_price: item.price * item.quantity,
        }))
      )

      // Stok güncelle
      for (const item of items) {
        await supabaseAdmin.rpc('decrement_stock', { product_id: item.id, qty: item.quantity }).maybeSingle()
      }
    }

    return NextResponse.json({ success: true, orderNumber: order?.order_number })
  } catch (error) {
    console.error('Ödeme hatası:', error)
    return NextResponse.json({ success: false, message: 'Sunucu hatası oluştu' }, { status: 500 })
  }
}
