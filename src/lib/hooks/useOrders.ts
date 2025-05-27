import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { isDemoMode } from '../supabase';
import { demoOrderSummary } from '../demo-data';
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
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export function useOrders(options: {
  status?: string;
  limit?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
} = {}) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { 
    status,
    limit,
    sortBy = 'created_at',
    sortDirection = 'desc'
  } = options;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (isDemoMode()) {
          // Use demo data
          let ordersData = [...demoOrderSummary];
          
          // Apply status filter if provided
          if (status) {
            ordersData = ordersData.filter(o => o.status === status);
          }
          
          // Apply sorting
          ordersData.sort((a, b) => {
            const aValue = a[sortBy as keyof OrderSummary];
            const bValue = b[sortBy as keyof OrderSummary];
            
            if (typeof aValue === 'string' && typeof bValue === 'string') {
              return sortDirection === 'asc' 
                ? aValue.localeCompare(bValue) 
                : bValue.localeCompare(aValue);
            } else if (typeof aValue === 'number' && typeof bValue === 'number') {
              return sortDirection === 'asc' 
                ? aValue - bValue 
                : bValue - aValue;
            }
            
            return 0;
          });
          
          // Apply limit if provided
          if (limit && limit > 0) {
            ordersData = ordersData.slice(0, limit);
          }
          
          setOrders(ordersData);
          setLoading(false);
          return;
        }

        if (!user) {
          setOrders([]);
          setLoading(false);
          return;
        }

        // Get company ID from user metadata or users table
        let companyId = user.user_metadata?.company_id;
        
        if (!companyId) {
          // Try to get company ID from users table
          try {
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('company_id')
              .eq('id', user.id)
              .single();

            if (userError) {
              console.warn(`Error fetching user data: ${userError.message}`);
              setOrders([]);
              setLoading(false);
              return;
            }

            companyId = userData?.company_id;
          } catch (e) {
            console.warn("Error fetching user company data:", e);
            setOrders([]);
            setLoading(false);
            return;
          }
          
          if (!companyId) {
            setOrders([]);
            setLoading(false);
            return;
          }
        }

        // Build the query
        let query = supabase
          .from('order_summary')
          .select('*')
          .eq('company_id', companyId);
        
        // Add status filter if provided
        if (status) {
          query = query.eq('status', status);
        }
        
        // Add sorting
        query = query.order(sortBy, { ascending: sortDirection === 'asc' });
        
        // Add limit if provided
        if (limit && limit > 0) {
          query = query.limit(limit);
        }
        
        // Execute the query
        const { data: ordersData, error: ordersError } = await query;

        if (ordersError) {
          throw new Error(`Error fetching orders: ${ordersError.message}`);
        }

        setOrders(ordersData || []);
        setLoading(false);
      } catch (error: any) {
        console.error('Error in useOrders:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, status, limit, sortBy, sortDirection]);

  return { orders, loading, error };
}