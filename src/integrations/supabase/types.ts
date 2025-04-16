export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      customers: {
        Row: {
          address: string
          contact: string
          created_at: string
          email: string
          id: number
          name: string
          order_count: number
          phone: string
          status: string
        }
        Insert: {
          address: string
          contact: string
          created_at?: string
          email: string
          id?: number
          name: string
          order_count: number
          phone: string
          status: string
        }
        Update: {
          address?: string
          contact?: string
          created_at?: string
          email?: string
          id?: number
          name?: string
          order_count?: number
          phone?: string
          status?: string
        }
        Relationships: []
      }
      defects: {
        Row: {
          created_at: string
          description: string
          id: number
          product: string
          report_date: string
          reported_by: string
          severity: string
          status: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: number
          product: string
          report_date: string
          reported_by: string
          severity: string
          status: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: number
          product?: string
          report_date?: string
          reported_by?: string
          severity?: string
          status?: string
        }
        Relationships: []
      }
      departments: {
        Row: {
          created_at: string
          employee_count: number | null
          id: number
          location: string
          manager: string
          name: string
        }
        Insert: {
          created_at?: string
          employee_count?: number | null
          id?: number
          location: string
          manager: string
          name: string
        }
        Update: {
          created_at?: string
          employee_count?: number | null
          id?: number
          location?: string
          manager?: string
          name?: string
        }
        Relationships: []
      }
      employees: {
        Row: {
          created_at: string
          department: string
          email: string
          id: number
          join_date: string
          name: string
          phone: string
          position: string
        }
        Insert: {
          created_at?: string
          department: string
          email: string
          id?: number
          join_date: string
          name: string
          phone: string
          position: string
        }
        Update: {
          created_at?: string
          department?: string
          email?: string
          id?: number
          join_date?: string
          name?: string
          phone?: string
          position?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string
          created_at: string
          description: string
          id: number
          name: string
          price: string
          sku: string
          stock: number
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          id?: number
          name: string
          price: string
          sku: string
          stock: number
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          id?: number
          name?: string
          price?: string
          sku?: string
          stock?: number
        }
        Relationships: []
      }
      raw_materials: {
        Row: {
          category: string
          code: string
          created_at: string
          description: string
          id: number
          name: string
          stock_quantity: number
          supplier: string
          unit_cost: string
        }
        Insert: {
          category: string
          code: string
          created_at?: string
          description: string
          id?: number
          name: string
          stock_quantity: number
          supplier: string
          unit_cost: string
        }
        Update: {
          category?: string
          code?: string
          created_at?: string
          description?: string
          id?: number
          name?: string
          stock_quantity?: number
          supplier?: string
          unit_cost?: string
        }
        Relationships: []
      }
      suppliers: {
        Row: {
          address: string
          contact: string
          created_at: string
          email: string
          id: number
          materials: string
          name: string
          phone: string
          status: string
        }
        Insert: {
          address: string
          contact: string
          created_at?: string
          email: string
          id?: number
          materials: string
          name: string
          phone: string
          status: string
        }
        Update: {
          address?: string
          contact?: string
          created_at?: string
          email?: string
          id?: number
          materials?: string
          name?: string
          phone?: string
          status?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
