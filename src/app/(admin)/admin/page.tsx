import { supabaseAdmin } from '@/lib/supabase'
import { Package, ShoppingBag, Tag, TrendingUp } from 'lucide-react'

async function getStats() {
  const [{ count: products }, { count: orders }, { count: categories }, { data: revenue }] = await Promise.all([
    supabaseAdmin.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabaseAdmin.from('orders').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('categories').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('orders').select('total').eq('payment_status', 'paid'),
  ])
  const totalRevenue = revenue?.reduce((s, o) => s + o.total, 0) || 0
  return { products: products || 0, orders: orders || 0, categories: categories || 0, totalRevenue }
}

async function getRecentOrders() {
  const { data } = await supabaseAdmin
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)
  return data || []
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Bekliyor', processing: 'Hazırlanıyor',
  shipped: 'Kargoda', delivered: 'Teslim Edildi', cancelled: 'İptal',
}
const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700', processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700', delivered: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700',
}

export default async function AdminDashboard() {
  const [stats, recentOrders] = await Promise.all([getStats(), getRecentOrders()])

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Package, label: 'Aktif Ürün', value: stats.products, color: 'text-blue-600', bg: 'bg-blue-50' },
          { icon: ShoppingBag, label: 'Toplam Sipariş', value: stats.orders, color: 'text-green-700', bg: 'bg-green-50' },
          { icon: Tag, label: 'Kategori', value: stats.categories, color: 'text-purple-600', bg: 'bg-purple-50' },
          { icon: TrendingUp, label: 'Toplam Ciro', value: `₺${stats.totalRevenue.toLocaleString('tr-TR')}`, color: 'text-green-600', bg: 'bg-green-50' },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className="bg-white rounded-xl p-5 border">
            <div className={`inline-flex p-2 rounded-lg ${bg} mb-3`}>
              <Icon size={20} className={color} />
            </div>
            <div className="text-2xl font-bold text-gray-800">{value}</div>
            <div className="text-sm text-gray-500">{label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border p-5">
        <h2 className="font-semibold text-gray-800 mb-4">Son Siparişler</h2>
        {recentOrders.length === 0 ? (
          <p className="text-gray-400 text-sm">Henüz sipariş yok.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-2">Sipariş No</th>
                  <th className="pb-2">Müşteri</th>
                  <th className="pb-2">Toplam</th>
                  <th className="pb-2">Durum</th>
                  <th className="pb-2">Tarih</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="py-2 font-mono text-xs">{order.order_number}</td>
                    <td className="py-2">{order.customer_name}</td>
                    <td className="py-2 font-semibold">₺{order.total}</td>
                    <td className="py-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[order.status]}`}>
                        {STATUS_LABELS[order.status]}
                      </span>
                    </td>
                    <td className="py-2 text-gray-400">
                      {new Date(order.created_at).toLocaleDateString('tr-TR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
