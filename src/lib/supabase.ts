
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

// Export the supabase client
export { supabase };

// Type definitions that match our database schema
export type Tables = {
  departments: {
    id: number
    name: string
    location: string
    manager: string
    employee_count: number
    created_at?: string
  }
  employees: {
    id: number
    name: string
    position: string
    department: string
    email: string
    phone: string
    join_date: string
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
    stock_quantity: number
    unit_cost: string
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
    report_date: string
    description: string
    severity: string
    status: string
    reported_by: string
    created_at?: string
  }
  customers: {
    id: number
    name: string
    contact: string
    email: string
    phone: string
    address: string
    order_count: number
    status: string
    created_at?: string
  }
}
