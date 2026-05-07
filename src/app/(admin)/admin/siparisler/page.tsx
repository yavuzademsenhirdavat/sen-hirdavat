import { supabaseAdmin } from '@/lib/supabase'
import { formatPrice } from '@/lib/utils'
import { OrderStatusSelect } from '@/components/admin/order-status-select'

interface Props {
  searchParams: Promise<{ durum?: string; sayfa?: string }>
}

const PAGE = 20
const STATUS_LABELS: Record<string, string> = {
  pending: 'Bekliyor', processing: 'Hazırlanıyor',
  shipped: 'Kargoda', delivered: 'Teslim', cancelled: 'İptal',
}
const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700', processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700', delivered: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700',
}

export default async function AdminOrdersPage({ searchParams }: Props) {
  const { durum, sayfa } = await searchParams
  const page = parseInt(sayfa || '1')

  let query = supabaseAdmin
    .from('orders')
    .select('*', { count: 'exact' })
    .range((page - 1) * PAGE, page * PAGE - 1)
    .order('created_at', { ascending: false })

  if (durum) query = query.eq('status', durum)

  const { data: orders, count } = await query
  const totalPages = Math.ceil((count || 0) / PAGE)

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Siparişler ({count})</h1>

      {/* Filtre */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {[null, 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
          <a
            key={s || 'all'}
            href={s ? `/admin/siparisler?durum=${s}` : '/admin/siparisler'}
            className={`px-3 py-1 rounded-full text-sm border transition-colors ${durum === s || (!durum && !s) ? 'bg-green-700 text-white border-green-700' : 'bg-white text-gray-600 hover:border-green-500'}`}
          >
            {s ? STATUS_LABELS[s] : 'Tümü'}
          </a>
        ))}
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr className="text-left text-gray-500">
              <th className="px-4 py-3">Sipariş No</th>
              <th className="px-4 py-3">Müşteri</th>
              <th className="px-4 py-3">Telefon</th>
              <th className="px-4 py-3">Tutar</th>
              <th className="px-4 py-3">Ödeme</th>
              <th className="px-4 py-3">Durum</th>
              <th className="px-4 py-3">Tarih</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders?.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs">{order.order_number}</td>
                <td className="px-4 py-3 font-medium">{order.customer_name}</td>
                <td className="px-4 py-3">
                  <a href={`tel:${order.customer_phone}`} className="text-green-700 hover:underline">{order.customer_phone}</a>
                </td>
                <td className="px-4 py-3 font-semibold">{formatPrice(order.total)}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded ${order.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {order.payment_method === 'whatsapp' ? 'WhatsApp' : 'Kart'} — {order.payment_status === 'paid' ? 'Ödendi' : 'Bekliyor'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <OrderStatusSelect orderId={order.id} currentStatus={order.status} labels={STATUS_LABELS} colors={STATUS_COLORS} />
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs">
                  {new Date(order.created_at).toLocaleDateString('tr-TR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!orders || orders.length === 0) && (
          <div className="text-center py-12 text-gray-400">Sipariş bulunamadı.</div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex gap-2 mt-4 justify-center">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <a key={p} href={`/admin/siparisler?sayfa=${p}${durum ? `&durum=${durum}` : ''}`}
              className={`px-3 py-1 rounded border text-sm ${p === page ? 'bg-green-700 text-white' : 'bg-white text-gray-700'}`}>
              {p}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
