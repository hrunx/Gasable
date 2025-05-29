import { useState } from 'react';
import { supabase } from '../supabase';
import { isDemoMode } from '../supabase';
import { useAuth } from '../auth';
import { Store } from './useStores';

interface StoreCreationData {
  name: string;
  type: string;
  store_category: 'physical' | 'cloud';
  address?: string;
  city?: string;
  country?: string;
  services?: {
    pickup: boolean;
    delivery: boolean;
  };
  working_hours?: {
    weekdays?: {
      open: string;
      close: string;
    };
    weekends?: {
      open: string;
      close: string;
    };
    is24Hours?: boolean;
  };
}

export function useStoreCreation() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createStore = async (storeData: StoreCreationData): Promise<Store | null> => {
    try {
      setLoading(true);
      setError(null);

      if (isDemoMode()) {
        console.log('Demo mode: Store creation simulated', storeData);
        setLoading(false);
        return null;
      }

      if (!user) {
        throw new Error('User not authenticated');
      }

      // Get company ID
      let companyId = user.user_metadata?.company_id;
      if (!companyId) {
        const { data: userData } = await supabase
          .from('users')
          .select('company_id')
          .eq('id', user.id)
          .single();
        companyId = userData?.company_id;
      }

      if (!companyId) {
        throw new Error('Company ID not found');
      }

      // Create the store
      const { data: store, error: storeError } = await supabase
        .from('stores')
        .insert({
          company_id: companyId,
          name: storeData.name,
          type: storeData.type,
          store_category: storeData.store_category,
          address: storeData.address,
          city: storeData.city,
          country: storeData.country,
          services: storeData.services || { pickup: false, delivery: false },
          working_hours: storeData.working_hours,
          status: 'pending'
        })
        .select()
        .single();

      if (storeError) {
        throw new Error(`Error creating store: ${storeError.message}`);
      }

      // Note: The branch will be automatically created by the database trigger
      // for physical stores, so we don't need to manually create it here

      setLoading(false);
      return store;
    } catch (error: any) {
      console.error('Error creating store:', error);
      setError(error.message);
      setLoading(false);
      throw error;
    }
  };

  return {
    createStore,
    loading,
    error
  };
} 