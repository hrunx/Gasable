import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { isDemoMode } from '../supabase';
import { useAuth } from '../auth';
import { Branch } from './useStores';

// Demo branches for physical stores
const demoBranches: Branch[] = [
  {
    id: 'demo-branch-1',
    store_id: 'demo-store-1',
    company_id: 'demo-company-id',
    name: 'Riyadh Central Hub - Main Branch',
    branch_code: 'RCH-001',
    address: '123 King Fahd Road',
    city: 'Riyadh',
    country: 'Saudi Arabia',
    location: null,
    manager_name: 'Ahmed Al-Mansouri',
    manager_phone: '+966-123-456-7891',
    manager_email: 'ahmed@demo-energy.com',
    status: 'active',
    operating_hours: {
      is24Hours: false,
      weekdays: { open: '08:00', close: '20:00' },
      weekends: { open: '10:00', close: '18:00' }
    },
    services: ['pickup', 'delivery', 'installation'],
    employee_count: 12,
    assets_count: 8,
    created_at: '2024-11-01T10:00:00Z',
    updated_at: '2024-12-15T14:30:00Z'
  },
  {
    id: 'demo-branch-2',
    store_id: 'demo-store-2',
    company_id: 'demo-company-id',
    name: 'Jeddah Distribution Center - Main Branch',
    branch_code: 'JDC-001',
    address: '456 Port Road',
    city: 'Jeddah',
    country: 'Saudi Arabia',
    location: null,
    manager_name: 'Fatima Al-Zahra',
    manager_phone: '+966-123-456-7892',
    manager_email: 'fatima@demo-energy.com',
    status: 'active',
    operating_hours: {
      is24Hours: false,
      weekdays: { open: '08:00', close: '20:00' },
      weekends: { open: '10:00', close: '18:00' }
    },
    services: ['pickup', 'delivery', 'maintenance'],
    employee_count: 15,
    assets_count: 12,
    created_at: '2024-10-15T10:00:00Z',
    updated_at: '2024-12-20T16:45:00Z'
  }
];

export function useBranches(options: {
  storeId?: string;
  status?: string;
  limit?: number;
} = {}) {
  const { user } = useAuth();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { storeId, status, limit } = options;

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        if (isDemoMode()) {
          // Use demo data
          let branchesData = [...demoBranches];
          
          // Apply store filter if provided
          if (storeId) {
            branchesData = branchesData.filter(b => b.store_id === storeId);
          }
          
          // Apply status filter if provided
          if (status) {
            branchesData = branchesData.filter(b => b.status === status);
          }
          
          // Apply limit if provided
          if (limit && limit > 0) {
            branchesData = branchesData.slice(0, limit);
          }
          
          setBranches(branchesData);
          setLoading(false);
          return;
        }

        if (!user) {
          setBranches([]);
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
              setBranches([]);
              setLoading(false);
              return;
            }

            companyId = userData?.company_id;
          } catch (e) {
            console.warn("Error fetching user company data:", e);
            setBranches([]);
            setLoading(false);
            return;
          }
          
          if (!companyId) {
            setBranches([]);
            setLoading(false);
            return;
          }
        }

        // Build the query
        let query = supabase
          .from('branches')
          .select('*')
          .eq('company_id', companyId);
        
        // Add store filter if provided
        if (storeId) {
          query = query.eq('store_id', storeId);
        }
        
        // Add status filter if provided
        if (status) {
          query = query.eq('status', status);
        }
        
        // Add limit if provided
        if (limit && limit > 0) {
          query = query.limit(limit);
        }
        
        // Execute the query
        const { data: branchesData, error: branchesError } = await query;

        if (branchesError) {
          throw new Error(`Error fetching branches: ${branchesError.message}`);
        }

        setBranches(branchesData || []);
        setLoading(false);
      } catch (error: any) {
        console.error('Error in useBranches:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchBranches();
  }, [user, storeId, status, limit]);

  const createBranch = async (branchData: Partial<Branch>) => {
    try {
      if (isDemoMode()) {
        console.log('Demo mode: Branch creation simulated');
        return;
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

      const { data, error } = await supabase
        .from('branches')
        .insert({
          ...branchData,
          company_id: companyId
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Error creating branch: ${error.message}`);
      }

      // Refresh branches list
      setBranches(prev => [...prev, data]);
      return data;
    } catch (error: any) {
      console.error('Error creating branch:', error);
      throw error;
    }
  };

  const updateBranch = async (branchId: string, updates: Partial<Branch>) => {
    try {
      if (isDemoMode()) {
        console.log('Demo mode: Branch update simulated');
        return;
      }

      const { data, error } = await supabase
        .from('branches')
        .update(updates)
        .eq('id', branchId)
        .select()
        .single();

      if (error) {
        throw new Error(`Error updating branch: ${error.message}`);
      }

      // Update local state
      setBranches(prev => 
        prev.map(branch => 
          branch.id === branchId ? { ...branch, ...data } : branch
        )
      );
      
      return data;
    } catch (error: any) {
      console.error('Error updating branch:', error);
      throw error;
    }
  };

  const deleteBranch = async (branchId: string) => {
    try {
      if (isDemoMode()) {
        console.log('Demo mode: Branch deletion simulated');
        return;
      }

      const { error } = await supabase
        .from('branches')
        .delete()
        .eq('id', branchId);

      if (error) {
        throw new Error(`Error deleting branch: ${error.message}`);
      }

      // Remove from local state
      setBranches(prev => prev.filter(branch => branch.id !== branchId));
    } catch (error: any) {
      console.error('Error deleting branch:', error);
      throw error;
    }
  };

  return { 
    branches, 
    loading, 
    error, 
    createBranch, 
    updateBranch, 
    deleteBranch 
  };
} 