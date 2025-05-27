import { useState, useEffect } from 'react';
import { useAuth } from '../auth';

export interface OrderSummary {
  id: string;
  order_number: string;
  company_id: string;
  customer_id: string;
  status: string;
  total_amount: number;
  payment_status: string;
  payment_method: string | null;
  payment_transaction_id: string | null;
  delivery_method: string;
  delivery_status: string;
  delivery_address: string | null;
  delivery_city: string | null;
  delivery_country: string | null;
  delivery_notes: string | null;
  delivery_tracking: string | null;
  delivery_carrier: string | null;
  priority: string | null;
  notes: string | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
  customer_name: string | null;
  customer_type: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  items: OrderItem[] | null;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  sku: string | null;
  name: string;
  description: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}

export function useOrdersEmpty(options: {
  status?: string;
  limit?: number;
} = {}) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Immediately set an empty orders array and loading to false
    setOrders([]);
    setLoading(false);
  }, [user]);

  return { orders, loading, error };
} 