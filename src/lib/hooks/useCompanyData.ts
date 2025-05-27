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

      console.log('🔍 Fetching company data for user:', user.id);

      // Try the new function first
      let { data, error: fetchError } = await supabase
        .rpc('get_user_company_data');

      console.log('📊 RPC Response:', { data, error: fetchError });

      // If function doesn't exist, fallback to direct table query
      if (fetchError && fetchError.message?.includes('function get_user_company_data() does not exist')) {
        console.log('⚠️ Using fallback method - please run the database migration');
        
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .select('*')
          .eq('user_id', user.id)
          .single();

        console.log('🏢 Company data:', { companyData, error: companyError });

        if (companyError) {
          throw companyError;
        }

        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('email, full_name, phone')
          .eq('id', user.id)
          .single();

        console.log('👤 User data:', { userData, error: userError });

        if (userError) {
          throw userError;
        }

        // Map to expected format
        data = [{
          company_id: companyData.id,
          legal_name: companyData.legal_name,
          trade_name: companyData.trade_name,
          email: companyData.email || userData.email,
          phone: companyData.phone || userData.phone,
          website: companyData.website,
          address: companyData.address,
          city: companyData.city,
          country: companyData.country,
          description: companyData.description,
          founded_year: companyData.founded_year,
          team_size: companyData.team_size,
          logo_url: companyData.logo_url,
          business_type: companyData.business_type || 'supplier',
          subscription_tier: companyData.subscription_tier || 'free',
          subscription_status: companyData.subscription_status || 'active',
          user_email: userData.email,
          user_full_name: userData.full_name,
          user_phone: userData.phone,
        }];
      } else if (fetchError) {
        console.error('❌ Function error:', fetchError);
        throw fetchError;
      }

      console.log('✅ Final data:', data);

      if (data && data.length > 0) {
        setCompanyData(data[0]);
      } else {
        setError('No company data found');
      }
    } catch (err) {
      console.error('💥 Error fetching company data:', err);
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

      console.log('🔄 Updating company data:', updates);
      console.log('👤 Current user:', user.id);

      // Try the new function first
      let { data, error: updateError } = await supabase
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

      console.log('📊 Update RPC Response:', { data, error: updateError });

      // If function doesn't exist, fallback to direct table update
      if (updateError && updateError.message?.includes('function update_company_data') && updateError.message?.includes('does not exist')) {
        console.log('⚠️ Using fallback update method - please run the database migration');
        
        // Update company table
        const companyUpdates: any = {};
        if (updates.legal_name) companyUpdates.legal_name = updates.legal_name;
        if (updates.trade_name !== undefined) companyUpdates.trade_name = updates.trade_name;
        if (updates.email) companyUpdates.email = updates.email;
        if (updates.phone) companyUpdates.phone = updates.phone;
        if (updates.website !== undefined) companyUpdates.website = updates.website;
        if (updates.address !== undefined) companyUpdates.address = updates.address;
        if (updates.city !== undefined) companyUpdates.city = updates.city;
        if (updates.country !== undefined) companyUpdates.country = updates.country;
        if (updates.description !== undefined) companyUpdates.description = updates.description;
        if (updates.founded_year !== undefined) companyUpdates.founded_year = updates.founded_year;
        if (updates.team_size !== undefined) companyUpdates.team_size = updates.team_size;
        if (updates.logo_url !== undefined) companyUpdates.logo_url = updates.logo_url;
        
        console.log('🏢 Company updates to apply:', companyUpdates);
        
        if (Object.keys(companyUpdates).length > 0) {
          companyUpdates.updated_at = new Date().toISOString();
          
          const { error: companyError } = await supabase
            .from('companies')
            .update(companyUpdates)
            .eq('user_id', user.id);

          console.log('🏢 Company update result:', { error: companyError });

          if (companyError) {
            throw companyError;
          }
        }

        // Update user email if provided
        if (updates.email) {
          const { error: userError } = await supabase
            .from('users')
            .update({ 
              email: updates.email,
              updated_at: new Date().toISOString()
            })
            .eq('id', user.id);

          console.log('👤 User update result:', { error: userError });

          if (userError) {
            throw userError;
          }
        }

        data = { success: true, message: 'Company data updated successfully' };
      } else if (updateError) {
        console.error('❌ Update function error:', updateError);
        throw updateError;
      }

      if (data && data.error) {
        throw new Error(data.error);
      }

      console.log('✅ Update successful, refreshing data...');

      // Refresh company data after update
      await fetchCompanyData();
      
      return { success: true, message: 'Company data updated successfully' };
    } catch (err) {
      console.error('💥 Error updating company data:', err);
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