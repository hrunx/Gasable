import { useState } from 'react';

export interface Company {
  id: string;
  name: string;
  legal_name?: string | null;
  cr_number: string | null;
  vat_number: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  logo_url: string | null;
  subscription_tier: string | null;
  subscription_status: string | null;
  subscription_start_date: string | null;
  subscription_end_date: string | null;
  created_at: string;
  updated_at: string;
}

export function useCompanyEmpty() {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // No useEffect needed - we just return the empty data
  
  return { company, loading, error };
} 