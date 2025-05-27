export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: string
          status: string
          company_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: string
          status?: string
          company_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: string
          status?: string
          company_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      companies: {
        Row: {
          id: string
          name: string
          cr_number: string | null
          vat_number: string | null
          phone: string | null
          email: string | null
          website: string | null
          address: string | null
          city: string | null
          country: string | null
          logo_url: string | null
          subscription_tier: string | null
          subscription_status: string | null
          subscription_start_date: string | null
          subscription_end_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          cr_number?: string | null
          vat_number?: string | null
          phone?: string | null
          email?: string | null
          website?: string | null
          address?: string | null
          city?: string | null
          country?: string | null
          logo_url?: string | null
          subscription_tier?: string | null
          subscription_status?: string | null
          subscription_start_date?: string | null
          subscription_end_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          cr_number?: string | null
          vat_number?: string | null
          phone?: string | null
          email?: string | null
          website?: string | null
          address?: string | null
          city?: string | null
          country?: string | null
          logo_url?: string | null
          subscription_tier?: string | null
          subscription_status?: string | null
          subscription_start_date?: string | null
          subscription_end_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      stores: {
        Row: {
          id: string
          company_id: string
          name: string
          type: string
          address: string | null
          city: string | null
          country: string | null
          location: unknown | null
          status: string
          services: Json | null
          working_hours: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          name: string
          type: string
          address?: string | null
          city?: string | null
          country?: string | null
          location?: unknown | null
          status?: string
          services?: Json | null
          working_hours?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          name?: string
          type?: string
          address?: string | null
          city?: string | null
          country?: string | null
          location?: unknown | null
          status?: string
          services?: Json | null
          working_hours?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          company_id: string
          name: string
          sku: string | null
          description: string | null
          type: string | null
          category: string | null
          brand: string | null
          model: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          name: string
          sku?: string | null
          description?: string | null
          type?: string | null
          category?: string | null
          brand?: string | null
          model?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          name?: string
          sku?: string | null
          description?: string | null
          type?: string | null
          category?: string | null
          brand?: string | null
          model?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      product_attributes: {
        Row: {
          id: string
          product_id: string
          attribute_type: string
          name: string
          value: string
          unit: string | null
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          attribute_type: string
          name: string
          value: string
          unit?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          attribute_type?: string
          name?: string
          value?: string
          unit?: string | null
          created_at?: string
        }
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          url: string
          is_primary: boolean | null
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          url: string
          is_primary?: boolean | null
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          url?: string
          is_primary?: boolean | null
          created_at?: string
        }
      }
      product_pricing: {
        Row: {
          id: string
          product_id: string
          zone_id: string | null
          base_price: number
          b2b_price: number
          b2c_price: number
          currency: string | null
          min_order_quantity: number | null
          vat_included: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          zone_id?: string | null
          base_price: number
          b2b_price: number
          b2c_price: number
          currency?: string | null
          min_order_quantity?: number | null
          vat_included?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          zone_id?: string | null
          base_price?: number
          b2b_price?: number
          b2c_price?: number
          currency?: string | null
          min_order_quantity?: number | null
          vat_included?: boolean | null
          created_at?: string
          updated_at?: string
        }
      }
      delivery_zones: {
        Row: {
          id: string
          company_id: string
          name: string
          base_fee: number
          min_order_value: number
          estimated_time: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          name: string
          base_fee?: number
          min_order_value?: number
          estimated_time?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          name?: string
          base_fee?: number
          min_order_value?: number
          estimated_time?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      delivery_vehicles: {
        Row: {
          id: string
          company_id: string
          number: string
          type: string
          capacity: number | null
          fuel_type: string | null
          status: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          number: string
          type: string
          capacity?: number | null
          fuel_type?: string | null
          status?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          number?: string
          type?: string
          capacity?: number | null
          fuel_type?: string | null
          status?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      delivery_drivers: {
        Row: {
          id: string
          company_id: string
          name: string
          license_number: string | null
          phone: string | null
          status: string | null
          vehicle_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          name: string
          license_number?: string | null
          phone?: string | null
          status?: string | null
          vehicle_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          name?: string
          license_number?: string | null
          phone?: string | null
          status?: string | null
          vehicle_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          name: string
          type: string
          email: string | null
          phone: string | null
          company: string | null
          address: string | null
          city: string | null
          country: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: string
          email?: string | null
          phone?: string | null
          company?: string | null
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: string
          email?: string | null
          phone?: string | null
          company?: string | null
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          company_id: string
          customer_id: string
          status: string
          total_amount: number
          payment_status: string
          payment_method: string | null
          payment_transaction_id: string | null
          delivery_method: string
          delivery_status: string
          delivery_address: string | null
          delivery_city: string | null
          delivery_country: string | null
          delivery_notes: string | null
          delivery_tracking: string | null
          delivery_carrier: string | null
          priority: string | null
          notes: string | null
          tags: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number: string
          company_id: string
          customer_id: string
          status?: string
          total_amount: number
          payment_status?: string
          payment_method?: string | null
          payment_transaction_id?: string | null
          delivery_method: string
          delivery_status?: string
          delivery_address?: string | null
          delivery_city?: string | null
          delivery_country?: string | null
          delivery_notes?: string | null
          delivery_tracking?: string | null
          delivery_carrier?: string | null
          priority?: string | null
          notes?: string | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_number?: string
          company_id?: string
          customer_id?: string
          status?: string
          total_amount?: number
          payment_status?: string
          payment_method?: string | null
          payment_transaction_id?: string | null
          delivery_method?: string
          delivery_status?: string
          delivery_address?: string | null
          delivery_city?: string | null
          delivery_country?: string | null
          delivery_notes?: string | null
          delivery_tracking?: string | null
          delivery_carrier?: string | null
          priority?: string | null
          notes?: string | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          unit_price: number
          total_price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          unit_price: number
          total_price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          unit_price?: number
          total_price?: number
          created_at?: string
        }
      }
      support_tickets: {
        Row: {
          id: string
          ticket_number: string
          company_id: string
          customer_id: string | null
          title: string
          description: string
          status: string
          priority: string
          category: string
          assignee_id: string | null
          response_time: number | null
          resolution_time: number | null
          created_at: string
          updated_at: string
          resolved_at: string | null
        }
        Insert: {
          id?: string
          ticket_number: string
          company_id: string
          customer_id?: string | null
          title: string
          description: string
          status?: string
          priority?: string
          category: string
          assignee_id?: string | null
          response_time?: number | null
          resolution_time?: number | null
          created_at?: string
          updated_at?: string
          resolved_at?: string | null
        }
        Update: {
          id?: string
          ticket_number?: string
          company_id?: string
          customer_id?: string | null
          title?: string
          description?: string
          status?: string
          priority?: string
          category?: string
          assignee_id?: string | null
          response_time?: number | null
          resolution_time?: number | null
          created_at?: string
          updated_at?: string
          resolved_at?: string | null
        }
      }
      ticket_messages: {
        Row: {
          id: string
          ticket_id: string
          sender_id: string | null
          sender_type: string
          message: string
          attachments: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          ticket_id: string
          sender_id?: string | null
          sender_type: string
          message: string
          attachments?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          ticket_id?: string
          sender_id?: string | null
          sender_type?: string
          message?: string
          attachments?: string[] | null
          created_at?: string
        }
      }
      campaigns: {
        Row: {
          id: string
          company_id: string
          name: string
          type: string
          status: string
          start_date: string | null
          end_date: string | null
          discount_type: string
          discount_value: number
          target_type: string
          target_value: string | null
          description: string | null
          terms: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          name: string
          type: string
          status?: string
          start_date?: string | null
          end_date?: string | null
          discount_type: string
          discount_value: number
          target_type: string
          target_value?: string | null
          description?: string | null
          terms?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          name?: string
          type?: string
          status?: string
          start_date?: string | null
          end_date?: string | null
          discount_type?: string
          discount_value?: number
          target_type?: string
          target_value?: string | null
          description?: string | null
          terms?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      invoices: {
        Row: {
          id: string
          invoice_number: string
          company_id: string
          customer_id: string
          order_id: string | null
          amount: number
          status: string
          due_date: string
          issued_date: string
          paid_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          invoice_number: string
          company_id: string
          customer_id: string
          order_id?: string | null
          amount: number
          status?: string
          due_date: string
          issued_date?: string
          paid_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          invoice_number?: string
          company_id?: string
          customer_id?: string
          order_id?: string | null
          amount?: number
          status?: string
          due_date?: string
          issued_date?: string
          paid_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      subscription_plans: {
        Row: {
          id: string
          name: string
          description: string | null
          monthly_price: number
          yearly_price: number
          is_active: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          monthly_price: number
          yearly_price: number
          is_active?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          monthly_price?: number
          yearly_price?: number
          is_active?: boolean | null
          created_at?: string
          updated_at?: string
        }
      }
      subscription_tiers: {
        Row: {
          id: string
          plan_id: string
          product_limit: number
          order_limit: number
          gmv_limit: number
          branch_limit: number
          user_limit: number
          customer_types: string[]
          countries_access: string
          commission_rate: number
          support_level: string
          api_access: string
          features: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          plan_id: string
          product_limit: number
          order_limit: number
          gmv_limit: number
          branch_limit: number
          user_limit: number
          customer_types: string[]
          countries_access: string
          commission_rate: number
          support_level: string
          api_access: string
          features: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          plan_id?: string
          product_limit?: number
          order_limit?: number
          gmv_limit?: number
          branch_limit?: number
          user_limit?: number
          customer_types?: string[]
          countries_access?: string
          commission_rate?: number
          support_level?: string
          api_access?: string
          features?: Json
          created_at?: string
          updated_at?: string
        }
      }
      supplier_subscriptions: {
        Row: {
          id: string
          company_id: string
          plan_id: string
          status: string
          billing_cycle: string
          start_date: string
          end_date: string | null
          auto_renew: boolean | null
          payment_method: string | null
          payment_details: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          plan_id: string
          status?: string
          billing_cycle?: string
          start_date?: string
          end_date?: string | null
          auto_renew?: boolean | null
          payment_method?: string | null
          payment_details?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          plan_id?: string
          status?: string
          billing_cycle?: string
          start_date?: string
          end_date?: string | null
          auto_renew?: boolean | null
          payment_method?: string | null
          payment_details?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      subscription_usage: {
        Row: {
          id: string
          company_id: string
          products_used: number
          orders_used: number
          gmv_used: number
          branches_used: number
          users_used: number
          month: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          products_used?: number
          orders_used?: number
          gmv_used?: number
          branches_used?: number
          users_used?: number
          month: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          products_used?: number
          orders_used?: number
          gmv_used?: number
          branches_used?: number
          users_used?: number
          month?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      active_products: {
        Row: {
          id: string | null
          company_id: string | null
          name: string | null
          sku: string | null
          description: string | null
          type: string | null
          category: string | null
          brand: string | null
          model: string | null
          status: string | null
          created_at: string | null
          updated_at: string | null
          company_name: string | null
          images: Json | null
          attributes: Json | null
        }
        Insert: {
          id?: string | null
          company_id?: string | null
          name?: string | null
          sku?: string | null
          description?: string | null
          type?: string | null
          category?: string | null
          brand?: string | null
          model?: string | null
          status?: string | null
          created_at?: string | null
          updated_at?: string | null
          company_name?: string | null
          images?: Json | null
          attributes?: Json | null
        }
        Update: {
          id?: string | null
          company_id?: string | null
          name?: string | null
          sku?: string | null
          description?: string | null
          type?: string | null
          category?: string | null
          brand?: string | null
          model?: string | null
          status?: string | null
          created_at?: string | null
          updated_at?: string | null
          company_name?: string | null
          images?: Json | null
          attributes?: Json | null
        }
      }
      order_summary: {
        Row: {
          id: string | null
          order_number: string | null
          company_id: string | null
          customer_id: string | null
          status: string | null
          total_amount: number | null
          payment_status: string | null
          payment_method: string | null
          payment_transaction_id: string | null
          delivery_method: string | null
          delivery_status: string | null
          delivery_address: string | null
          delivery_city: string | null
          delivery_country: string | null
          delivery_notes: string | null
          delivery_tracking: string | null
          delivery_carrier: string | null
          priority: string | null
          notes: string | null
          tags: string[] | null
          created_at: string | null
          updated_at: string | null
          customer_name: string | null
          customer_type: string | null
          customer_email: string | null
          customer_phone: string | null
          items: Json | null
        }
        Insert: {
          id?: string | null
          order_number?: string | null
          company_id?: string | null
          customer_id?: string | null
          status?: string | null
          total_amount?: number | null
          payment_status?: string | null
          payment_method?: string | null
          payment_transaction_id?: string | null
          delivery_method?: string | null
          delivery_status?: string | null
          delivery_address?: string | null
          delivery_city?: string | null
          delivery_country?: string | null
          delivery_notes?: string | null
          delivery_tracking?: string | null
          delivery_carrier?: string | null
          priority?: string | null
          notes?: string | null
          tags?: string[] | null
          created_at?: string | null
          updated_at?: string | null
          customer_name?: string | null
          customer_type?: string | null
          customer_email?: string | null
          customer_phone?: string | null
          items?: Json | null
        }
        Update: {
          id?: string | null
          order_number?: string | null
          company_id?: string | null
          customer_id?: string | null
          status?: string | null
          total_amount?: number | null
          payment_status?: string | null
          payment_method?: string | null
          payment_transaction_id?: string | null
          delivery_method?: string | null
          delivery_status?: string | null
          delivery_address?: string | null
          delivery_city?: string | null
          delivery_country?: string | null
          delivery_notes?: string | null
          delivery_tracking?: string | null
          delivery_carrier?: string | null
          priority?: string | null
          notes?: string | null
          tags?: string[] | null
          created_at?: string | null
          updated_at?: string | null
          customer_name?: string | null
          customer_type?: string | null
          customer_email?: string | null
          customer_phone?: string | null
          items?: Json | null
        }
      }
      ticket_summary: {
        Row: {
          id: string | null
          ticket_number: string | null
          company_id: string | null
          customer_id: string | null
          title: string | null
          description: string | null
          status: string | null
          priority: string | null
          category: string | null
          assignee_id: string | null
          response_time: number | null
          resolution_time: number | null
          created_at: string | null
          updated_at: string | null
          resolved_at: string | null
          assignee_name: string | null
          company_name: string | null
          message_count: number | null
          last_message_at: string | null
        }
        Insert: {
          id?: string | null
          ticket_number?: string | null
          company_id?: string | null
          customer_id?: string | null
          title?: string | null
          description?: string | null
          status?: string | null
          priority?: string | null
          category?: string | null
          assignee_id?: string | null
          response_time?: number | null
          resolution_time?: number | null
          created_at?: string | null
          updated_at?: string | null
          resolved_at?: string | null
          assignee_name?: string | null
          company_name?: string | null
          message_count?: number | null
          last_message_at?: string | null
        }
        Update: {
          id?: string | null
          ticket_number?: string | null
          company_id?: string | null
          customer_id?: string | null
          title?: string | null
          description?: string | null
          status?: string | null
          priority?: string | null
          category?: string | null
          assignee_id?: string | null
          response_time?: number | null
          resolution_time?: number | null
          created_at?: string | null
          updated_at?: string | null
          resolved_at?: string | null
          assignee_name?: string | null
          company_name?: string | null
          message_count?: number | null
          last_message_at?: string | null
        }
      }
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