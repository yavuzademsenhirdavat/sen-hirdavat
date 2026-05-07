import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  searchParams: Promise<{ siparis?: string }>
}

export default async function OdemeBasariliPage({ searchParams }: Props) {
  const { siparis } = await searchParams

  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <CheckCircle size={72} className="mx-auto text-green-500 mb-4" />
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Siparişiniz Alındı!</h1>
      {siparis && (
        <p className="text-gray-500 mb-1">
          Sipariş No: <strong className="text-orange-600">{siparis}</strong>
        </p>
      )}
      <p className="text-gray-500 mb-8">
        Siparişiniz hazırlanıyor. Kısa süre içinde sizi arayacağız.
      </p>
      <Link href="/urunler">
        <Button className="bg-orange-600 hover:bg-orange-700">Alışverişe Devam Et</Button>
      </Link>
    </div>
  )
}
