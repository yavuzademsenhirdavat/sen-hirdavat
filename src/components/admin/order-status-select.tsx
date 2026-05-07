'use client'

import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

type Props = {
  orderId: string
  currentStatus: string
  labels: Record<string, string>
  colors: Record<string, string>
}

export function OrderStatusSelect({ orderId, currentStatus, labels }: Props) {
  const router = useRouter()

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const status = e.target.value
    const res = await fetch(`/api/admin/siparisler/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) { toast.success('Durum güncellendi'); router.refresh() }
    else toast.error('Güncelleme başarısız')
  }

  return (
    <select
      defaultValue={currentStatus}
      onChange={handleChange}
      className="text-xs border rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-green-500"
    >
      {Object.entries(labels).map(([value, label]) => (
        <option key={value} value={value}>{label}</option>
      ))}
    </select>
  )
}
