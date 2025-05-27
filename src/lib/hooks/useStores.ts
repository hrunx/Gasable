import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { isDemoMode } from '../supabase';
import { demoStores } from '../demo-data';
import { useAuth } from '../auth';

export interface Store {
  id: string;
  company_id: string;
  name: string;
  type: string;
  address: string | null;
  city: string | null;
  country: string | null;
  location: any | null;
  status: string;
  services: {
    pickup: boolean;
    delivery: boolean;
  } | null;
  working_hours: {
    weekdays?: {
      open: string;
      close: string;
    };
    weekends?: {
      open: string;
      close: string;
    };
    is24Hours?: boolean;
  } | null;
  created_at: string;
  updated_at: string;
}

export function useStores(options: {
  status?: string;
  limit?: number;
} = {}) {
  const { user } = useAuth();
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { status, limit } = options;

  useEffect(() => {
    const fetchStores = async () => {
      try {
        if (isDemoMode()) {
          // Use demo data
          let storesData = [...demoStores];
          
          // Apply status filter if provided
          if (status) {
            storesData = storesData.filter(s => s.status === status);
          }
          
          // Apply limit if provided
          if (limit && limit > 0) {
            storesData = storesData.slice(0, limit);
          }
          
          setStores(storesData);
          setLoading(false);
          return;
        }

        if (!user) {
          setStores([]);
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
              setStores([]);
              setLoading(false);
              return;
            }

            companyId = userData?.company_id;
          } catch (e) {
            console.warn("Error fetching user company data:", e);
            setStores([]);
            setLoading(false);
            return;
          }
          
          if (!companyId) {
            setStores([]);
            setLoading(false);
            return;
          }
        }

        // Build the query
        let query = supabase
          .from('stores')
          .select('*')
          .eq('company_id', companyId);
        
        // Add status filter if provided
        if (status) {
          query = query.eq('status', status);
        }
        
        // Add limit if provided
        if (limit && limit > 0) {
          query = query.limit(limit);
        }
        
        // Execute the query
        const { data: storesData, error: storesError } = await query;

        if (storesError) {
          throw new Error(`Error fetching stores: ${storesError.message}`);
        }

        setStores(storesData || []);
        setLoading(false);
      } catch (error: any) {
        console.error('Error in useStores:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchStores();
  }, [user, status, limit]);

  return { stores, loading, error };
}