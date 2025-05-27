import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useAuth } from '../auth';

export interface CompanyData {
  company_id: string;
  legal_name: string;
  trade_name: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  description: string | null;
  founded_year: string | null;
  team_size: string | null;
  logo_url: string | null;
  business_type: string;
  subscription_tier: string;
  subscription_status: string;
  user_email: string;
  user_full_name: string;
  user_phone: string | null;
}

export interface UpdateCompanyDataParams {
  legal_name?: string;
  trade_name?: string | undefined;
  email?: string;
  phone?: string;
  website?: string | undefined;
  address?: string | undefined;
  city?: string | undefined;
  country?: string | undefined;
  description?: string | undefined;
  founded_year?: string | undefined;
  team_size?: string | undefined;
  logo_url?: string | undefined;
}

export const useCompanyData = () => {
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchCompanyData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .rpc('get_user_company_data');

      if (fetchError) {
        throw fetchError;
      }

      if (data && data.length > 0) {
        setCompanyData(data[0]);
      } else {
        setError('No company data found');
      }
    } catch (err) {
      console.error('Error fetching company data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch company data');
    } finally {
      setLoading(false);
    }
  };

  const updateCompanyData = async (updates: UpdateCompanyDataParams) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      setError(null);

      const { data, error: updateError } = await supabase
        .rpc('update_company_data', {
          p_legal_name: updates.legal_name || null,
          p_trade_name: updates.trade_name || null,
          p_email: updates.email || null,
          p_phone: updates.phone || null,
          p_website: updates.website || null,
          p_address: updates.address || null,
          p_city: updates.city || null,
          p_country: updates.country || null,
          p_description: updates.description || null,
          p_founded_year: updates.founded_year || null,
          p_team_size: updates.team_size || null,
          p_logo_url: updates.logo_url || null,
        });

      if (updateError) {
        throw updateError;
      }

      if (data && data.error) {
        throw new Error(data.error);
      }

      // Refresh company data after update
      await fetchCompanyData();
      
      return { success: true, message: 'Company data updated successfully' };
    } catch (err) {
      console.error('Error updating company data:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update company data';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    fetchCompanyData();
  }, [user]);

  return {
    companyData,
    loading,
    error,
    updateCompanyData,
    refetch: fetchCompanyData,
  };
}; 