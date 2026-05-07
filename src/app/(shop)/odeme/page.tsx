'use client'

import { useState } from 'react'
import { useCart } from '@/lib/cart'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { CreditCard, MessageCircle, Lock } from 'lucide-react'

export default function OdemePage() {
  const { items, total, clearCart } = useCart()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '', surname: '', email: '', phone: '',
    address: '', city: 'Bursa', district: '',
    cardHolder: '', cardNumber: '', expiry: '', cvv: '',
  })

  const totalAmount = total()

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function formatCardNumber(v: string) {
    return v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
  }

  function formatExpiry(v: string) {
    const digits = v.replace(/\D/g, '').slice(0, 4)
    if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2)
    return digits
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (items.length === 0) { toast.error('Sepetiniz boş'); return }

    setLoading(true)
    try {
      const res = await fetch('/api/odeme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: { name: form.name, surname: form.surname, email: form.email, phone: form.phone },
          address: { address: form.address, city: form.city, district: form.district },
          card: { holder: form.cardHolder, number: form.cardNumber.replace(/\s/g, ''), expiry: form.expiry, cvv: form.cvv },
          items: items.map((i) => ({
            id: i.product.id, name: i.product.name, price: i.product.price, quantity: i.quantity,
          })),
          total: totalAmount,
        }),
      })
      const data = await res.json()
      if (data.success) {
        clearCart()
        router.push(`/odeme/basarili?siparis=${data.orderNumber}`)
      } else {
        toast.error(data.message || 'Ödeme başarısız oldu')
      }
    } catch {
      toast.error('Bir hata oluştu, lütfen tekrar deneyin')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    router.push('/sepet')
    return null
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Lock size={22} className="text-orange-600" /> Güvenli Ödeme
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            {/* Kişisel bilgiler */}
            <div className="bg-white border rounded-xl p-5">
              <h2 className="font-semibold text-gray-800 mb-4">Teslimat Bilgileri</h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Ad</Label>
                  <Input required value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Adınız" className="mt-1" />
                </div>
                <div>
                  <Label>Soyad</Label>
                  <Input required value={form.surname} onChange={(e) => update('surname', e.target.value)} placeholder="Soyadınız" className="mt-1" />
                </div>
                <div>
                  <Label>Telefon</Label>
                  <Input required type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="05XX XXX XX XX" className="mt-1" />
                </div>
                <div>
                  <Label>E-posta</Label>
                  <Input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="ornek@mail.com" className="mt-1" />
                </div>
                <div className="col-span-2">
                  <Label>Adres</Label>
                  <Input required value={form.address} onChange={(e) => update('address', e.target.value)} placeholder="Mahalle, sokak, no" className="mt-1" />
                </div>
                <div>
                  <Label>İlçe</Label>
                  <Input required value={form.district} onChange={(e) => update('district', e.target.value)} placeholder="Osmangazi" className="mt-1" />
                </div>
                <div>
                  <Label>Şehir</Label>
                  <Input required value={form.city} onChange={(e) => update('city', e.target.value)} className="mt-1" />
                </div>
              </div>
            </div>

            {/* Kart bilgileri */}
            <div className="bg-white border rounded-xl p-5">
              <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <CreditCard size={18} /> Kart Bilgileri
              </h2>
              <div className="space-y-3">
                <div>
                  <Label>Kart Üzerindeki İsim</Label>
                  <Input required value={form.cardHolder} onChange={(e) => update('cardHolder', e.target.value.toUpperCase())} placeholder="JOHN DOE" className="mt-1 uppercase" />
                </div>
                <div>
                  <Label>Kart Numarası</Label>
                  <Input required value={form.cardNumber} onChange={(e) => update('cardNumber', formatCardNumber(e.target.value))} placeholder="1234 5678 9012 3456" maxLength={19} className="mt-1 font-mono" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Son Kullanma</Label>
                    <Input required value={form.expiry} onChange={(e) => update('expiry', formatExpiry(e.target.value))} placeholder="MM/YY" maxLength={5} className="mt-1 font-mono" />
                  </div>
                  <div>
                    <Label>CVV</Label>
                    <Input required value={form.cvv} onChange={(e) => update('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="123" maxLength={4} className="mt-1 font-mono" type="password" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sipariş özeti */}
          <div className="bg-white border rounded-xl p-5 h-fit sticky top-20">
            <h2 className="font-semibold text-gray-800 mb-3">Sipariş Özeti</h2>
            <div className="space-y-2 text-sm mb-4">
              {items.map((i) => (
                <div key={i.product.id} className="flex justify-between text-gray-600">
                  <span className="truncate max-w-[60%]">{i.product.name} x{i.quantity}</span>
                  <span>{formatPrice(i.product.price * i.quantity)}</span>
                </div>
              ))}
              <div className="border-t pt-2 flex justify-between font-bold">
                <span>Toplam</span>
                <span className="text-orange-600">{formatPrice(totalAmount)}</span>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-orange-600 hover:bg-orange-700 mb-3" size="lg">
              {loading ? 'İşleniyor...' : `${formatPrice(totalAmount)} Öde`}
            </Button>

            <div className="text-center">
              <a
                href="#whatsapp"
                onClick={(e) => { e.preventDefault(); window.location.href = '/sepet' }}
                className="flex items-center justify-center gap-2 text-sm text-green-600 hover:underline"
              >
                <MessageCircle size={16} /> WhatsApp ile sipariş ver
              </a>
            </div>

            <p className="text-xs text-gray-400 text-center mt-3 flex items-center justify-center gap-1">
              <Lock size={12} /> iyzico ile güvenli ödeme
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}
