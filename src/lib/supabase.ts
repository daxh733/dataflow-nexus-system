
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
)

export type Tables = {
  departments: {
    id: number
    name: string
    location: string
    manager: string
    employeeCount: number
    created_at?: string
  }
  employees: {
    id: number
    name: string
    position: string
    department: string
    email: string
    phone: string
    joinDate: string
    created_at?: string
  }
  products: {
    id: number
    name: string
    sku: string
    category: string
    price: string
    stock: number
    description: string
    created_at?: string
  }
  raw_materials: {
    id: number
    name: string
    code: string
    category: string
    supplier: string
    stockQuantity: number
    unitCost: string
    description: string
    created_at?: string
  }
  suppliers: {
    id: number
    name: string
    contact: string
    email: string
    phone: string
    address: string
    materials: string
    status: string
    created_at?: string
  }
  defects: {
    id: number
    product: string
    reportDate: string
    description: string
    severity: string
    status: string
    reportedBy: string
    created_at?: string
  }
  customers: {
    id: number
    name: string
    contact: string
    email: string
    phone: string
    address: string
    orderCount: number
    status: string
    created_at?: string
  }
}
