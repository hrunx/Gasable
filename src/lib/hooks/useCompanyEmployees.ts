import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export interface Role {
  id: string;
  name: string;
  display_name: string;
  description: string;
  permissions: {
    company: { read: boolean; write: boolean; delete: boolean };
    employees: { read: boolean; write: boolean; delete: boolean };
    products: { read: boolean; write: boolean; delete: boolean };
    orders: { read: boolean; write: boolean; delete: boolean };
    analytics: { read: boolean; write: boolean; delete: boolean };
    settings: { read: boolean; write: boolean; delete: boolean };
    billing: { read: boolean; write: boolean; delete: boolean };
  };
}

export interface CompanyMember {
  member_id: string; // Composite key
  profile_id: string;
  company_id: string;
  full_name: string;
  job_position: string;
  email: string;
  phone: string;
  profile_image_url: string;
  years_experience: number;
  expertise: string[];
  role_id: string;
  role_name: string;
  role_display_name: string;
  role_permissions: Role['permissions'];
  member_status: 'active' | 'pending';
  employee_status: 'active' | 'inactive' | 'pending';
  hire_date: string;
  created_at: string;
}

export interface NewMember {
  full_name: string;
  job_position: string;
  email?: string;
  phone?: string;
  profile_image_url?: string;
  years_experience?: number;
  expertise?: string[];
  role_name?: string;
}

export interface UpdateMember {
  full_name?: string;
  job_position?: string;
  email?: string;
  phone?: string;
  profile_image_url?: string;
  years_experience?: number;
  expertise?: string[];
  role_name?: string;
  employee_status?: 'active' | 'inactive' | 'pending';
}

export interface UserPermissions {
  company: { read: boolean; write: boolean; delete: boolean };
  employees: { read: boolean; write: boolean; delete: boolean };
  products: { read: boolean; write: boolean; delete: boolean };
  orders: { read: boolean; write: boolean; delete: boolean };
  analytics: { read: boolean; write: boolean; delete: boolean };
  settings: { read: boolean; write: boolean; delete: boolean };
  billing: { read: boolean; write: boolean; delete: boolean };
}

export function useCompanyEmployees() {
  const [members, setMembers] = useState<CompanyMember[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [userPermissions, setUserPermissions] = useState<UserPermissions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all available roles
  const fetchRoles = async () => {
    try {
      // First try to test connection
      const { data: testData, error: testError } = await supabase.rpc('test_connection');
      
      if (testError) {
        console.error('Connection test failed:', testError);
        // Provide fallback roles if connection fails
        setRoles([
          {
            id: '1',
            name: 'admin',
            display_name: 'Administrator',
            description: 'Administrative access',
            permissions: {
              company: { read: true, write: true, delete: false },
              employees: { read: true, write: true, delete: false },
              products: { read: true, write: true, delete: true },
              orders: { read: true, write: true, delete: true },
              analytics: { read: true, write: false, delete: false },
              settings: { read: true, write: true, delete: false },
              billing: { read: false, write: false, delete: false }
            }
          },
          {
            id: '2',
            name: 'employee',
            display_name: 'Employee',
            description: 'Basic employee access',
            permissions: {
              company: { read: true, write: false, delete: false },
              employees: { read: true, write: false, delete: false },
              products: { read: true, write: false, delete: false },
              orders: { read: true, write: false, delete: false },
              analytics: { read: false, write: false, delete: false },
              settings: { read: false, write: false, delete: false },
              billing: { read: false, write: false, delete: false }
            }
          }
        ]);
        return;
      }

      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .order('name');

      if (error) throw error;
      setRoles(data || []);
    } catch (err) {
      console.error('Error fetching roles:', err);
      // Provide fallback roles
      setRoles([
        {
          id: '1',
          name: 'admin',
          display_name: 'Administrator',
          description: 'Administrative access',
          permissions: {
            company: { read: true, write: true, delete: false },
            employees: { read: true, write: true, delete: false },
            products: { read: true, write: true, delete: true },
            orders: { read: true, write: true, delete: true },
            analytics: { read: true, write: false, delete: false },
            settings: { read: true, write: true, delete: false },
            billing: { read: false, write: false, delete: false }
          }
        },
        {
          id: '2',
          name: 'employee',
          display_name: 'Employee',
          description: 'Basic employee access',
          permissions: {
            company: { read: true, write: false, delete: false },
            employees: { read: true, write: false, delete: false },
            products: { read: true, write: false, delete: false },
            orders: { read: true, write: false, delete: false },
            analytics: { read: false, write: false, delete: false },
            settings: { read: false, write: false, delete: false },
            billing: { read: false, write: false, delete: false }
          }
        }
      ]);
    }
  };

  // Fetch company members with detailed information
  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.rpc('get_company_members_with_details');

      if (error) {
        console.error('Error fetching company members:', error);
        // Provide empty array as fallback
        setMembers([]);
        return;
      }
      
      console.log('Fetched company members:', data);
      setMembers(data || []);
    } catch (err) {
      console.error('Error fetching company members:', err);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user permissions
  const fetchUserPermissions = async () => {
    try {
      const { data, error } = await supabase.rpc('get_user_permissions');

      if (error) {
        console.error('Error fetching user permissions:', error);
        // Provide owner permissions as fallback
        setUserPermissions({
          company: { read: true, write: true, delete: true },
          employees: { read: true, write: true, delete: true },
          products: { read: true, write: true, delete: true },
          orders: { read: true, write: true, delete: true },
          analytics: { read: true, write: true, delete: true },
          settings: { read: true, write: true, delete: true },
          billing: { read: true, write: true, delete: true }
        });
        return;
      }
      
      console.log('User permissions:', data);
      setUserPermissions(data || null);
    } catch (err) {
      console.error('Error fetching user permissions:', err);
      // Provide owner permissions as fallback
      setUserPermissions({
        company: { read: true, write: true, delete: true },
        employees: { read: true, write: true, delete: true },
        products: { read: true, write: true, delete: true },
        orders: { read: true, write: true, delete: true },
        analytics: { read: true, write: true, delete: true },
        settings: { read: true, write: true, delete: true },
        billing: { read: true, write: true, delete: true }
      });
    }
  };

  // Add new company member
  const addMember = async (memberData: NewMember) => {
    try {
      setError(null);

      const { data, error } = await supabase.rpc('add_company_member', {
        p_full_name: memberData.full_name,
        p_job_position: memberData.job_position,
        p_email: memberData.email || null,
        p_phone: memberData.phone || null,
        p_profile_image_url: memberData.profile_image_url || null,
        p_years_experience: memberData.years_experience || 0,
        p_expertise: memberData.expertise || [],
        p_role_name: memberData.role_name || 'employee'
      });

      if (error) throw error;

      if (data?.error) {
        throw new Error(data.error);
      }

      console.log('Member added successfully:', data);
      
      // Refresh the members list
      await fetchMembers();
      
      return { success: true, message: data?.message || 'Member added successfully' };
    } catch (err) {
      console.error('Error adding member:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to add member';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Update existing company member
  const updateMember = async (profileId: string, updates: UpdateMember) => {
    try {
      setError(null);

      const { data, error } = await supabase.rpc('update_company_member', {
        p_profile_id: profileId,
        p_full_name: updates.full_name || null,
        p_job_position: updates.job_position || null,
        p_email: updates.email || null,
        p_phone: updates.phone || null,
        p_profile_image_url: updates.profile_image_url || null,
        p_years_experience: updates.years_experience || null,
        p_expertise: updates.expertise || null,
        p_role_name: updates.role_name || null,
        p_employee_status: updates.employee_status || null
      });

      if (error) throw error;

      if (data?.error) {
        throw new Error(data.error);
      }

      console.log('Member updated successfully:', data);
      
      // Refresh the members list
      await fetchMembers();
      
      return { success: true, message: data?.message || 'Member updated successfully' };
    } catch (err) {
      console.error('Error updating member:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update member';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Delete company member
  const deleteMember = async (profileId: string) => {
    try {
      setError(null);

      const { data, error } = await supabase.rpc('delete_company_member', {
        p_profile_id: profileId
      });

      if (error) throw error;

      if (data?.error) {
        throw new Error(data.error);
      }

      console.log('Member deleted successfully:', data);
      
      // Refresh the members list
      await fetchMembers();
      
      return { success: true, message: data?.message || 'Member removed successfully' };
    } catch (err) {
      console.error('Error deleting member:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove member';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Check if user has specific permission
  const hasPermission = (module: keyof UserPermissions, action: 'read' | 'write' | 'delete'): boolean => {
    if (!userPermissions) return false;
    return userPermissions[module]?.[action] || false;
  };

  // Get role by name
  const getRoleByName = (roleName: string): Role | undefined => {
    return roles.find(role => role.name === roleName);
  };

  // Get role by ID
  const getRoleById = (roleId: string): Role | undefined => {
    return roles.find(role => role.id === roleId);
  };

  // Initialize data on mount
  useEffect(() => {
    const initializeData = async () => {
      await Promise.all([
        fetchRoles(),
        fetchMembers(),
        fetchUserPermissions()
      ]);
    };

    initializeData();
  }, []);

  return {
    // Data
    members,
    roles,
    userPermissions,
    
    // State
    loading,
    error,
    
    // Actions
    addMember,
    updateMember,
    deleteMember,
    fetchMembers,
    fetchUserPermissions,
    
    // Utilities
    hasPermission,
    getRoleByName,
    getRoleById,
    
    // Refresh functions
    refresh: fetchMembers,
    refreshPermissions: fetchUserPermissions
  };
} 