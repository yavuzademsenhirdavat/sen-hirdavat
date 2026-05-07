'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, Download, CheckCircle, XCircle } from 'lucide-react'
import Papa from 'papaparse'
import { toast } from 'sonner'

type Row = {
  name: string
  price: string
  stock: string
  category?: string
  sku?: string
  barcode?: string
  unit?: string
  description?: string
}

type Result = { name: string; success: boolean; error?: string }

export default function CsvYuklePage() {
  const [rows, setRows] = useState<Row[]>([])
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(false)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        setRows(result.data as Row[])
        setResults([])
        toast.success(`${result.data.length} satır yüklendi`)
      },
      error: () => toast.error('Dosya okunamadı'),
    })
  }

  async function handleUpload() {
    if (rows.length === 0) { toast.error('Önce CSV yükleyin'); return }
    setLoading(true)

    const res = await fetch('/api/admin/urunler/toplu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ products: rows }),
    })
    const data = await res.json()
    setResults(data.results || [])
    const success = data.results?.filter((r: Result) => r.success).length || 0
    toast.success(`${success}/${rows.length} ürün eklendi`)
    setLoading(false)
  }

  function downloadTemplate() {
    const csv = 'name,price,stock,category,sku,barcode,unit,description\nTestürün,29.90,100,El Aletleri,SKU001,,adet,Açıklama'
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'urun-sablonu.csv'; a.click()
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">CSV ile Toplu Ürün Yükleme</h1>
      <p className="text-gray-500 text-sm mb-6">Ürünlerinizi Excel'den CSV olarak dışa aktarın ve yükleyin.</p>

      <div className="bg-white border rounded-xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Button variant="outline" size="sm" onClick={downloadTemplate}>
            <Download size={16} className="mr-1" /> Şablon İndir
          </Button>
          <span className="text-xs text-gray-400">Gerekli sütunlar: name, price, stock</span>
        </div>

        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-10 cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-colors">
          <Upload size={32} className="text-gray-400 mb-2" />
          <span className="text-sm text-gray-500">CSV dosyasını seçin</span>
          <input type="file" accept=".csv" onChange={handleFile} className="hidden" />
        </label>

        {rows.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-green-600 font-medium mb-3">{rows.length} ürün hazır</p>
            <div className="overflow-x-auto max-h-48 overflow-y-auto border rounded">
              <table className="text-xs w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>{Object.keys(rows[0]).map((k) => <th key={k} className="px-2 py-1 text-left text-gray-500">{k}</th>)}</tr>
                </thead>
                <tbody className="divide-y">
                  {rows.slice(0, 10).map((row, i) => (
                    <tr key={i}>
                      {Object.values(row).map((v, j) => <td key={j} className="px-2 py-1 truncate max-w-xs">{String(v)}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {rows.length > 10 && <p className="text-xs text-gray-400 mt-1">... ve {rows.length - 10} ürün daha</p>}

            <Button onClick={handleUpload} disabled={loading} className="mt-4 bg-orange-600 hover:bg-orange-700">
              {loading ? 'Yükleniyor...' : `${rows.length} Ürünü Kaydet`}
            </Button>
          </div>
        )}
      </div>

      {results.length > 0 && (
        <div className="bg-white border rounded-xl p-5">
          <h2 className="font-semibold mb-3">Sonuçlar</h2>
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {results.map((r, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                {r.success
                  ? <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
                  : <XCircle size={14} className="text-red-500 flex-shrink-0" />}
                <span className={r.success ? 'text-gray-700' : 'text-red-600'}>
                  {r.name}{r.error ? ` — ${r.error}` : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
