'use client'

import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/admin/cikis', { method: 'POST' })
    router.push('/admin/giris')
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-red-400 hover:bg-gray-800 w-full"
    >
      <LogOut size={16} /> Çıkış Yap
    </button>
  )
}
