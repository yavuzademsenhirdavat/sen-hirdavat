import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export type Category = {
  id: string
  name: string
  slug: string
  parent_id: string | null
  image_url: string | null
  sort_order: number
  created_at: string
}

export type Product = {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  compare_price: number | null
  stock: number
  category_id: string | null
  images: string[]
  sku: string | null
  barcode: string | null
  unit: string
  is_active: boolean
  is_featured: boolean
  created_at: string
  updated_at: string
  categories?: Category
}

export type Order = {
  id: string
  order_number: string
  customer_name: string
  customer_phone: string
  customer_email: string | null
  shipping_address: Record<string, string> | null
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total: number
  payment_method: 'card' | 'whatsapp'
  payment_id: string | null
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  notes: string | null
  created_at: string
}

export type OrderItem = {
  id: string
  order_id: string
  product_id: string | null
  product_name: string
  product_sku: string | null
  quantity: number
  unit_price: number
  total_price: number
}

export type CartItem = {
  product: Product
  quantity: number
}
