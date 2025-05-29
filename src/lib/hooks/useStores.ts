import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { isDemoMode } from '../supabase';
import { demoStores } from '../demo-data';
import { useAuth } from '../auth';

interface StoreStats {
  totalStores: number;
  activeStores: number;
  pendingStores: number;
  physicalStores: number;
  cloudStores: number;
}

interface Store {
  id: string;
  name: string;
  type: string;
  store_category: 'physical' | 'cloud';
  address: string;
  city: string;
  country: string;
  status: string;
  services: {
    pickup: boolean;
    delivery: boolean;
  };
  working_hours: any;
  created_at: string;
  updated_at: string;
}

export interface Branch {
  id: string;
  store_id: string;
  company_id: string;
  name: string;
  branch_code: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  location: any | null;
  manager_name: string | null;
  manager_phone: string | null;
  manager_email: string | null;
  status: 'active' | 'inactive' | 'maintenance';
  operating_hours: {
    is24Hours: boolean;
    weekdays: {
      open: string;
      close: string;
    };
    weekends: {
      open: string;
      close: string;
    };
  } | null;
  services: string[] | null;
  employee_count: number;
  assets_count: number;
  created_at: string;
  updated_at: string;
}

export function useStores() {
  const { user } = useAuth();
  const [stores, setStores] = useState<Store[]>([]);
  const [stats, setStats] = useState<StoreStats>({
    totalStores: 0,
    activeStores: 0,
    pendingStores: 0,
    physicalStores: 0,
    cloudStores: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStores = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!user) {
        setStores([]);
        setStats({
          totalStores: 0,
          activeStores: 0,
          pendingStores: 0,
          physicalStores: 0,
          cloudStores: 0
        });
        setLoading(false);
        return;
      }

      // Get company ID from user metadata or users table
      let companyId = user.user_metadata?.company_id;
      
      if (!companyId) {
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

      // Fetch stores for the company
      const { data: storesData, error: storesError } = await supabase
        .from('stores')
        .select('*')
        .eq('company_id', companyId);

      if (storesError) {
        throw new Error(`Error fetching stores: ${storesError.message}`);
      }

      setStores(storesData || []);

      // Calculate statistics
      const totalStores = storesData?.length || 0;
      const activeStores = storesData?.filter(store => store.status === 'active').length || 0;
      const pendingStores = storesData?.filter(store => store.status === 'pending').length || 0;
      const physicalStores = storesData?.filter(store => store.store_category === 'physical').length || 0;
      const cloudStores = storesData?.filter(store => store.store_category === 'cloud').length || 0;

      setStats({
        totalStores,
        activeStores,
        pendingStores,
        physicalStores,
        cloudStores
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch stores';
      setError(errorMessage);
      console.error('Error in useStores:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [user]);

  const refreshStores = () => {
    fetchStores();
  };

  return {
    stores,
    stats,
    loading,
    error,
    refreshStores
  };
}