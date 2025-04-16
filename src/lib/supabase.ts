
import { createClient } from '@supabase/supabase-js'
import { toast } from '@/components/ui/use-toast'

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
  
  // Show a helpful toast message when running in browser context
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      toast({
        title: "Supabase Configuration Missing",
        description: "Please make sure you've connected to Supabase and set up your environment variables.",
        variant: "destructive",
        duration: 10000,
      })
    }, 1000)
  }
}

// Use placeholder values for development that will cause an obvious error
// rather than just failing silently
const fallbackUrl = supabaseUrl || 'https://example.supabase.co'
const fallbackKey = supabaseAnonKey || 'public-anon-key-placeholder'

export const supabase = createClient(fallbackUrl, fallbackKey)

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
