import Link from 'next/link'
import { MapPin, Phone, Clock } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="mb-3">
            <span className="text-2xl font-[family-name:var(--font-barlow)] font-bold tracking-wide text-green-500">ŞEN</span>
            <span className="text-2xl font-[family-name:var(--font-barlow)] font-semibold text-white"> Hırdavat</span>
          </div>
          <p className="text-sm text-gray-400">
            Bursa'nın güvenilir hırdavat ve nalbur mağazası.
            El aletleri, tesisat, yapı malzemeleri ve daha fazlası.
          </p>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3">İletişim</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
              <span>Gülbahçe mh. Gürgen sk. No:29/A, Osmangazi, Bursa</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="text-green-600" />
              <a href="tel:02242541010" className="hover:text-white">0224 254 10 10</a>
            </li>
            <li className="flex items-center gap-2">
              <Clock size={16} className="text-green-600" />
              <span>Pzt-Cmt: 08:00 — 19:00</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3">Hızlı Linkler</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/urunler" className="hover:text-white">Tüm Ürünler</Link></li>
            <li><Link href="/sepet" className="hover:text-white">Sepetim</Link></li>
            <li>
              <a
                href="https://wa.me/905XXXXXXXXX?text=Merhaba,%20sipariş%20vermek%20istiyorum."
                className="hover:text-white text-green-400"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp ile Sipariş
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Şen Hırdavat. Tüm hakları saklıdır.
      </div>
    </footer>
  )
}
