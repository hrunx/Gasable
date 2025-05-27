import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { isDemoMode } from '../supabase';
import { demoCompany } from '../demo-data';
import { useAuth } from '../auth';

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

export function useCompany() {
  const { user } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        if (isDemoMode()) {
          // Use demo data
          setCompany(demoCompany);
          setLoading(false);
          return;
        }

        if (!user) {
          setCompany(null);
          setLoading(false);
          return;
        }

        // Get company ID from user metadata
        const companyId = user.user_metadata?.company_id;
        
        if (!companyId) {
          // Try to get company ID from users table
          try {
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('company_id')
              .eq('id', user.id)
              .limit(1);

            if (userError) {
              console.warn(`Error fetching user data: ${userError.message}`);
              setCompany(null);
              setLoading(false);
              return;
            }

            if (!userData || userData.length === 0) {
              setCompany(null);
              setLoading(false);
              return;
            }

            // Use the first row's company_id
            const userCompanyId = userData[0].company_id;
            
            if (!userCompanyId) {
              setCompany(null);
              setLoading(false);
              return;
            }

            // Fetch company data
            try {
              const { data: companyData, error: companyError } = await supabase
                .from('companies')
                .select('*')
                .eq('id', userCompanyId)
                .maybeSingle(); // Use maybeSingle instead of single to handle no results

              if (companyError && companyError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
                console.warn(`Error fetching company data: ${companyError.message}`);
              }

              setCompany(companyData);
            } catch (e) {
              console.warn("Error fetching company:", e);
              setCompany(null);
            }
          } catch (e) {
            console.warn("Error in company fetch workflow:", e);
            setCompany(null);
          }
        } else {
          // Fetch company data using the ID from user metadata
          try {
            const { data: companyData, error: companyError } = await supabase
              .from('companies')
              .select('*')
              .eq('id', companyId)
              .maybeSingle(); // Use maybeSingle instead of single to handle no results

            if (companyError && companyError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
              console.warn(`Error fetching company data: ${companyError.message}`);
            }

            setCompany(companyData);
          } catch (e) {
            console.warn("Error fetching company from metadata ID:", e);
            setCompany(null);
          }
        }

        setLoading(false);
      } catch (error: any) {
        console.error('Error in useCompany:', error);
        setCompany(null);
        setLoading(false);
      }
    };

    fetchCompany();
  }, [user]);

  return { company, loading, error };
}