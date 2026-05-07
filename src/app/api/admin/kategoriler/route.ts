import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const { data } = await supabaseAdmin.from('categories').select('id, name').order('name')
  return NextResponse.json(data || [])
}
