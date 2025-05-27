import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { isDemoMode } from '../supabase';
import { demoInvoices } from '../demo-data';
import { useAuth } from '../auth';

export interface Invoice {
  id: string;
  invoice_number: string;
  company_id: string;
  customer_id: string;
  order_id: string | null;
  amount: number;
  status: string;
  due_date: string;
  issued_date: string;
  paid_date: string | null;
  created_at: string;
  updated_at: string;
}

export function useInvoices(options: {
  status?: string;
  limit?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
} = {}) {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { 
    status,
    limit,
    sortBy = 'issued_date',
    sortDirection = 'desc'
  } = options;

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        if (isDemoMode()) {
          // Use demo data
          let invoicesData = [...demoInvoices];
          
          // Apply status filter if provided
          if (status) {
            invoicesData = invoicesData.filter(i => i.status === status);
          }
          
          // Apply sorting
          invoicesData.sort((a, b) => {
            const aValue = a[sortBy as keyof Invoice];
            const bValue = b[sortBy as keyof Invoice];
            
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
            invoicesData = invoicesData.slice(0, limit);
          }
          
          setInvoices(invoicesData);
          setLoading(false);
          return;
        }

        if (!user) {
          setInvoices([]);
          setLoading(false);
          return;
        }

        // Get company ID from user metadata or users table
        let companyId = user.user_metadata?.company_id;
        
        if (!companyId) {
          // Try to get company ID from users table
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('company_id')
            .eq('id', user.id)
            .single();

          if (userError) {
            throw new Error(`Error fetching user data: ${userError.message}`);
          }

          companyId = userData?.company_id;
          
          if (!companyId) {
            setInvoices([]);
            setLoading(false);
            setError('No company associated with this user');
            return;
          }
        }

        // Build the query
        let query = supabase
          .from('invoices')
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
        const { data: invoicesData, error: invoicesError } = await query;

        if (invoicesError) {
          throw new Error(`Error fetching invoices: ${invoicesError.message}`);
        }

        setInvoices(invoicesData || []);
        setLoading(false);
      } catch (error: any) {
        console.error('Error in useInvoices:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [user, status, limit, sortBy, sortDirection]);

  return { invoices, loading, error };
}