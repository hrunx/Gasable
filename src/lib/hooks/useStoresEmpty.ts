import { useState, useEffect } from 'react';
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

export function useStoresEmpty(options: {
  status?: string;
} = {}) {
  const { user } = useAuth();
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Immediately set an empty stores array and loading to false
    setStores([]);
    setLoading(false);
  }, [user]);

  return { stores, loading, error };
} 