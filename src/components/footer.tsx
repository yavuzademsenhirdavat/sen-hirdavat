import Link from 'next/link'

const CATEGORIES = [
  'El Aletleri', 'Elektrikli Aletler', 'Vida & Cıvata',
  'Tesisat Malzemeleri', 'Boya & Kimyasal', 'İş Güvenliği',
]

const KURUMSAL = [
  { label: 'Hakkımızda', href: '/hakkimizda' },
  { label: 'Toptan Satış', href: '/urunler?q=Toptan' },
  { label: 'Bayilik', href: '/bayilik' },
  { label: 'İletişim', href: '/iletisim' },
  { label: 'KVKK', href: '/kvkk' },
  { label: 'Kullanım Koşulları', href: '/kullanim-kosullari' },
]

const MUSTERI = [
  { label: 'Sipariş Takibi', href: '/siparislerim' },
  { label: 'Kargo & Teslimat', href: '/kargo' },
  { label: 'İade & Değişim', href: '/iade' },
  { label: 'Sıkça Sorulanlar', href: '/sss' },
  { label: 'Ustaya Danış', href: '/iletisim' },
]

export function Footer() {
  return (
    <footer className="text-slate-400 mt-auto" style={{ background: '#0b1220' }}>
      <div className="max-w-[1280px] mx-auto px-4 pt-14 pb-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Şirket Bilgisi */}
        <div>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="font-display font-extrabold text-2xl leading-none" style={{ color: '#22c55e' }}>ŞEN</span>
            <span className="font-display font-extrabold text-2xl leading-none text-slate-100">HIRDAVAT</span>
          </div>
          <p className="text-[13px] leading-relaxed mb-5">
            Bursa Osmangazi&apos;de 1985&apos;ten bu yana hırdavat,
            nalbur, el aletleri ve yapı malzemeleri. 8.500+ ürün.
          </p>
          <ul className="space-y-2 text-[13px]">
            <li>
              <a href="tel:02242521347" className="hover:text-white transition flex items-center gap-2">
                <span className="text-slate-500">📞</span>
                <span className="text-slate-200 font-medium">0224 252 13 47</span>
              </a>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-slate-500 mt-0.5">📍</span>
              <span>Ulu Cami Mh. Demirci Sk. No:14, Osmangazi / Bursa</span>
            </li>
            <li>
              <a href="mailto:satis@senhirdavat.com.tr" className="hover:text-white transition flex items-center gap-2">
                <span className="text-slate-500">✉️</span> satis@senhirdavat.com.tr
              </a>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-slate-500">🕐</span> Hafta içi 08:00 — 19:00
            </li>
          </ul>
        </div>

        {/* Kategoriler */}
        <div>
          <h3 className="font-display font-bold text-slate-100 uppercase tracking-wider text-[12px] mb-4">
            Kategoriler
          </h3>
          <ul className="space-y-2">
            {CATEGORIES.map((c) => (
              <li key={c}>
                <Link
                  href={`/urunler?q=${encodeURIComponent(c)}`}
                  className="text-[13px] hover:text-white transition"
                >
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Kurumsal */}
        <div>
          <h3 className="font-display font-bold text-slate-100 uppercase tracking-wider text-[12px] mb-4">
            Kurumsal
          </h3>
          <ul className="space-y-2">
            {KURUMSAL.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="text-[13px] hover:text-white transition">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Müşteri */}
        <div>
          <h3 className="font-display font-bold text-slate-100 uppercase tracking-wider text-[12px] mb-4">
            Müşteri
          </h3>
          <ul className="space-y-2">
            {MUSTERI.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="text-[13px] hover:text-white transition">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-6">
            <a
              href="https://wa.me/902242521347?text=Merhaba,%20bilgi%20almak%20istiyorum."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 h-9 px-4 rounded text-white text-[12.5px] font-medium transition hover:opacity-90"
              style={{ background: '#25D366' }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              WhatsApp ile Sor
            </a>
          </div>
        </div>
      </div>

      {/* Alt bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-[1280px] mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11.5px] text-slate-500">
          <span>© {new Date().getFullYear()} Şen Hırdavat — Adem Şen. Tüm hakları saklıdır.</span>
          <div className="flex items-center gap-3">
            <span>MERSİS: 0840-0123-4567-8901</span>
            <span className="text-slate-700">•</span>
            <span>Vergi No: Osmangazi V.D. 8400 1234 56</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
