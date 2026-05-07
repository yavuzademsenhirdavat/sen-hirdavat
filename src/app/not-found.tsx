import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Wrench } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-slate-50">
      <Wrench size={64} className="text-slate-300 mb-4" />
      <h1 className="text-6xl font-bold text-slate-800 mb-2">404</h1>
      <p className="text-xl text-slate-600 mb-2">Sayfa bulunamadı</p>
      <p className="text-slate-400 mb-8">Aradığınız sayfa mevcut değil veya taşınmış olabilir.</p>
      <Link href="/">
        <Button className="bg-green-700 hover:bg-green-800">Ana Sayfaya Dön</Button>
      </Link>
    </div>
  )
}
