import Link from 'next/link'
import { LayoutDashboard, Package, ShoppingBag, Tag, LogOut } from 'lucide-react'
import { LogoutButton } from '@/components/admin/logout-button'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-56 bg-gray-900 text-gray-300 flex flex-col">
        <div className="p-5 border-b border-gray-800">
          <div className="text-green-600 font-bold text-lg">ŞEN Admin</div>
          <div className="text-xs text-gray-500 mt-0.5">Yönetim Paneli</div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {[
            { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
            { href: '/admin/urunler', icon: Package, label: 'Ürünler' },
            { href: '/admin/kategoriler', icon: Tag, label: 'Kategoriler' },
            { href: '/admin/siparisler', icon: ShoppingBag, label: 'Siparişler' },
          ].map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-gray-800 hover:text-white transition-colors"
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-800 space-y-1">
          <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800">
            <LogOut size={16} /> Siteye Dön
          </Link>
          <LogoutButton />
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  )
}
