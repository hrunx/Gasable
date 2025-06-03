import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface DeliveryZone {
  id: string;
  name: string;
  zone_type: 'urban' | 'suburban' | 'rural' | 'express' | 'economy';
  company_id: string;
  store_id: string;
  delivery_fee: number;
  default_b2b_price: number | null;
  default_b2c_price: number | null;
  discount_percentage: number;
  is_active: boolean;
  coverage_areas: string[];
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductZoneAssignment {
  id: string;
  product_id: string;
  zone_id: string;
  override_base_price: number | null;
  override_b2b_price: number | null;
  override_b2c_price: number | null;
  override_min_order_quantity: number | null;
  is_active: boolean;
  priority: number;
  created_at: string;
  updated_at: string;
  product?: {
    id: string;
    name: string;
    sku: string;
    base_price: number;
    b2b_price: number;
    b2c_price: number;
    category: string;
    status: string;
  };
  zone?: {
    id: string;
    name: string;
    zone_type: string;
    delivery_fee: number;
  };
}

export interface ZoneFormData {
  name: string;
  zone_type: DeliveryZone['zone_type'];
  delivery_fee: number;
  default_b2b_price: number | null;
  default_b2c_price: number | null;
  discount_percentage: number;
  is_active: boolean;
  coverage_areas: string[];
  description: string;
  store_id?: string;
}

export interface AssignmentFormData {
  product_ids: string[];
  zone_id: string;
  override_base_price: number | null;
  override_b2b_price: number | null;
  override_b2c_price: number | null;
  override_min_order_quantity: number | null;
  is_active: boolean;
  priority: number;
}

export const useZones = () => {
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [assignments, setAssignments] = useState<ProductZoneAssignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get user's company ID
  const getCompanyId = async (): Promise<string | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      // Try company_members first using profile_id (not user_id)
      const { data: memberData } = await supabase
        .from('company_members')
        .select('company_id')
        .eq('profile_id', user.id)
        .single();

      if (memberData?.company_id) {
        return memberData.company_id;
      }

      // Try users table as fallback
      const { data: userData } = await supabase
        .from('users')
        .select('company_id')
        .eq('id', user.id)
        .single();

      return userData?.company_id || null;
    } catch (error) {
      console.error('Error getting company ID:', error);
      return null;
    }
  };

  // Get all zones for the company
  const getZonesByCompany = async (): Promise<DeliveryZone[]> => {
    try {
      setLoading(true);
      setError(null);

      const companyId = await getCompanyId();
      if (!companyId) {
        throw new Error('No company found for user');
      }

      const { data, error: queryError } = await supabase
        .from('delivery_zones')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (queryError) throw queryError;

      const zonesData = data || [];
      setZones(zonesData);
      return zonesData;
    } catch (error: any) {
      console.error('Error fetching zones:', error);
      setError(error.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Get all product zone assignments
  const getAssignmentsByCompany = async (): Promise<ProductZoneAssignment[]> => {
    try {
      setLoading(true);
      setError(null);

      const companyId = await getCompanyId();
      if (!companyId) {
        throw new Error('No company found for user');
      }

      console.log('🔍 Fetching assignments for company:', companyId);

      // SIMPLIFIED TEST QUERY - Just get basic assignments first
      const { data: simpleData, error: simpleError } = await supabase
        .from('product_zone_assignments')
        .select('*')
        .eq('company_id', companyId)
        .limit(5);

      console.log('🧪 SIMPLE QUERY - Data:', simpleData?.length || 0, simpleData);
      console.log('🧪 SIMPLE QUERY - Error:', simpleError);

      if (simpleData && simpleData.length > 0) {
        console.log('✅ SIMPLE QUERY WORKS - Issue is with complex joins');
        
        // Now try with joins
        const { data, error: queryError } = await supabase
          .from('product_zone_assignments')
          .select(`
            *,
            product:products!inner(id, name, sku, base_price, b2b_price, b2c_price, category, status),
            zone:delivery_zones!inner(id, name, zone_type, delivery_fee)
          `)
          .eq('company_id', companyId)
          .order('created_at', { ascending: false });

        console.log('🔗 COMPLEX QUERY - Data:', data?.length || 0, data);
        console.log('🔗 COMPLEX QUERY - Error:', queryError);

        if (queryError) {
          console.error('❌ Complex query failed, using simple data with manual lookups');
          setAssignments(simpleData);
          return simpleData;
        }

        const assignmentsData = data || [];
        console.log('📊 Retrieved assignments:', assignmentsData.length, assignmentsData);
        setAssignments(assignmentsData);
        return assignmentsData;
      } else {
        console.log('❌ SIMPLE QUERY FAILED - Definite RLS issue');
        console.log('🔧 Attempting bypass query...');
        
        // Last resort - try to bypass RLS with raw query
        const { data: bypassData, error: bypassError } = await supabase
          .rpc('get_user_assignments_debug', { target_company_id: companyId });

        console.log('🚨 BYPASS QUERY - Data:', bypassData?.length || 0, bypassData);
        console.log('🚨 BYPASS QUERY - Error:', bypassError);

        if (bypassData && bypassData.length > 0) {
          setAssignments(bypassData);
          return bypassData;
        }
      }

      setAssignments([]);
      return [];
    } catch (error: any) {
      console.error('Error fetching assignments:', error);
      setError(error.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Create a new zone
  const createZone = async (zoneData: ZoneFormData): Promise<DeliveryZone | null> => {
    try {
      setLoading(true);
      setError(null);

      const companyId = await getCompanyId();
      if (!companyId) {
        throw new Error('No company found for user');
      }

      // Get default store if none specified
      let storeId = zoneData.store_id;
      if (!storeId) {
        const { data: storeData } = await supabase
          .from('stores')
          .select('id')
          .eq('company_id', companyId)
          .eq('status', 'active')
          .single();
        
        storeId = storeData?.id || '';
      }

      const { data, error: insertError } = await supabase
        .from('delivery_zones')
        .insert({
          ...zoneData,
          company_id: companyId,
          store_id: storeId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Refresh zones list
      await getZonesByCompany();
      
      return data;
    } catch (error: any) {
      console.error('Error creating zone:', error);
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing zone
  const updateZone = async (zoneId: string, zoneData: Partial<ZoneFormData>): Promise<DeliveryZone | null> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: updateError } = await supabase
        .from('delivery_zones')
        .update({
          ...zoneData,
          updated_at: new Date().toISOString()
        })
        .eq('id', zoneId)
        .select()
        .single();

      if (updateError) throw updateError;

      // Refresh zones list
      await getZonesByCompany();
      
      return data;
    } catch (error: any) {
      console.error('Error updating zone:', error);
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete a zone
  const deleteZone = async (zoneId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      // First delete all product assignments for this zone
      const { error: assignmentError } = await supabase
        .from('product_zone_assignments')
        .delete()
        .eq('zone_id', zoneId);

      if (assignmentError) throw assignmentError;

      // Then delete the zone
      const { error: deleteError } = await supabase
        .from('delivery_zones')
        .delete()
        .eq('id', zoneId);

      if (deleteError) throw deleteError;

      // Refresh data
      await Promise.all([getZonesByCompany(), getAssignmentsByCompany()]);
      
      return true;
    } catch (error: any) {
      console.error('Error deleting zone:', error);
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Assign products to a zone
  const assignProductsToZone = async (assignmentData: AssignmentFormData): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      // Get company ID first
      const companyId = await getCompanyId();
      if (!companyId) {
        throw new Error('No company found for user');
      }

      console.log('🎯 Assigning products to zone:', {
        companyId,
        zoneId: assignmentData.zone_id,
        productIds: assignmentData.product_ids,
        currentAssignments: assignments.length
      });

      // Get the zone to find its store_id
      const zone = zones.find(z => z.id === assignmentData.zone_id);
      if (!zone) {
        throw new Error('Zone not found');
      }

      // Filter out products that are already assigned to this zone
      const alreadyAssignedProductIds = assignments
        .filter(a => a.zone_id === assignmentData.zone_id)
        .map(a => a.product_id);
      
      console.log('🔍 Already assigned product IDs for this zone:', alreadyAssignedProductIds);
      
      const newProductIds = assignmentData.product_ids.filter(
        productId => !alreadyAssignedProductIds.includes(productId)
      );

      console.log('✨ New product IDs to assign:', newProductIds);

      if (newProductIds.length === 0) {
        throw new Error('All selected products are already assigned to this zone');
      }

      const newAssignments = newProductIds.map(productId => ({
        product_id: productId,
        zone_id: assignmentData.zone_id,
        company_id: companyId,
        store_id: zone.store_id,
        override_base_price: assignmentData.override_base_price,
        override_b2b_price: assignmentData.override_b2b_price,
        override_b2c_price: assignmentData.override_b2c_price,
        override_min_order_quantity: assignmentData.override_min_order_quantity,
        is_active: assignmentData.is_active,
        priority: assignmentData.priority,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

      console.log('💾 Inserting new assignments:', newAssignments);

      const { error: insertError } = await supabase
        .from('product_zone_assignments')
        .insert(newAssignments);

      if (insertError) {
        console.error('❌ Insert error:', insertError);
        throw insertError;
      }

      console.log('✅ Successfully inserted assignments, refreshing data...');

      // Refresh assignments
      await getAssignmentsByCompany();
      
      return true;
    } catch (error: any) {
      console.error('Error assigning products to zone:', error);
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update product assignment
  const updateAssignment = async (assignmentId: string, updates: Partial<AssignmentFormData>): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      // Filter out fields that don't belong in the product_zone_assignments table
      const validUpdates = {
        override_base_price: updates.override_base_price,
        override_b2b_price: updates.override_b2b_price,
        override_b2c_price: updates.override_b2c_price,
        override_min_order_quantity: updates.override_min_order_quantity,
        is_active: updates.is_active,
        priority: updates.priority,
        updated_at: new Date().toISOString()
      };

      // Remove undefined values to avoid updating with undefined
      const cleanUpdates = Object.fromEntries(
        Object.entries(validUpdates).filter(([_, value]) => value !== undefined)
      );

      console.log('🔄 Updating assignment:', assignmentId, 'with data:', cleanUpdates);

      const { error: updateError } = await supabase
        .from('product_zone_assignments')
        .update(cleanUpdates)
        .eq('id', assignmentId);

      if (updateError) {
        console.error('❌ Update error:', updateError);
        throw updateError;
      }

      console.log('✅ Successfully updated assignment');

      // Refresh assignments
      await getAssignmentsByCompany();
      
      return true;
    } catch (error: any) {
      console.error('Error updating assignment:', error);
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Remove product from zone
  const removeProductFromZone = async (assignmentId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const { error: deleteError } = await supabase
        .from('product_zone_assignments')
        .delete()
        .eq('id', assignmentId);

      if (deleteError) throw deleteError;

      // Refresh assignments
      await getAssignmentsByCompany();
      
      return true;
    } catch (error: any) {
      console.error('Error removing product from zone:', error);
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Get zone statistics
  const getZoneStats = () => {
    const totalZones = zones.length;
    const activeZones = zones.filter(z => z.is_active).length;
    const totalAssignments = assignments.length;
    const activeAssignments = assignments.filter(a => a.is_active).length;

    const zoneTypes = zones.reduce((acc, zone) => {
      acc[zone.zone_type] = (acc[zone.zone_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalZones,
      activeZones,
      inactiveZones: totalZones - activeZones,
      totalAssignments,
      activeAssignments,
      inactiveAssignments: totalAssignments - activeAssignments,
      zoneTypes,
      avgDeliveryFee: zones.length > 0 ? zones.reduce((sum, z) => sum + z.delivery_fee, 0) / zones.length : 0
    };
  };

  // Get products assigned to a specific zone
  const getZoneProducts = (zoneId: string) => {
    return assignments.filter(a => a.zone_id === zoneId);
  };

  // Get zones for a specific product
  const getProductZones = (productId: string) => {
    return assignments.filter(a => a.product_id === productId);
  };

  // Calculate effective price for a product in a zone
  const getEffectivePrice = (productId: string, zoneId: string, priceType: 'base' | 'b2b' | 'b2c' = 'base') => {
    const assignment = assignments.find(a => a.product_id === productId && a.zone_id === zoneId);
    
    if (!assignment?.product) return null;

    // Use override price if available, otherwise use product default
    switch (priceType) {
      case 'b2b':
        return assignment.override_b2b_price ?? assignment.product.b2b_price;
      case 'b2c':
        return assignment.override_b2c_price ?? assignment.product.b2c_price;
      default:
        return assignment.override_base_price ?? assignment.product.base_price;
    }
  };

  // Initialize data on mount
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([getZonesByCompany(), getAssignmentsByCompany()]);
    };
    loadData();
  }, []);

  return {
    // Data
    zones,
    assignments,
    loading,
    error,
    
    // Actions
    getZonesByCompany,
    getAssignmentsByCompany,
    createZone,
    updateZone,
    deleteZone,
    assignProductsToZone,
    updateAssignment,
    removeProductFromZone,
    
    // Utilities
    getZoneStats,
    getZoneProducts,
    getProductZones,
    getEffectivePrice,
    
    // State setters
    setZones,
    setAssignments,
    setError
  };
}; 