import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { isDemoMode } from '../supabase';
import { demoProducts, demoProductAttributes, demoProductImages, demoProductPricing } from '../demo-data';
import { useAuth } from '../auth';

export interface Product {
  id: string;
  company_id: string;
  store_id?: string;
  name: string;
  sku: string | null;
  description: string | null;
  type: string | null;
  category: string | null;
  brand: string | null;
  model: string | null;
  status: string;
  
  // Store-based default pricing
  base_price: number | null;
  b2b_price: number | null;
  b2c_price: number | null;
  min_order_quantity: number | null;
  vat_included: boolean | null;
  
  created_at: string;
  updated_at: string;
  attributes?: ProductAttribute[];
  images?: ProductImage[];
  pricing?: ProductPricing[]; // Legacy - keeping for compatibility
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  is_primary: boolean | null;
  created_at: string;
}

export interface ProductPricing {
  id: string;
  product_id: string;
  zone_id: string | null;
  base_price: number;
  b2b_price: number;
  b2c_price: number;
  currency: string | null;
  min_order_quantity: number | null;
  vat_included: boolean | null;
  created_at: string;
  updated_at: string;
}

interface ProductAttribute {
  name: string;
  value: string;
  unit?: string;
}

export interface ProductData {
  company_id: string;
  store_id?: string;
  name: string;
  sku?: string | null;
  description?: string | null;
  type?: string | null;
  category?: string | null;
  brand?: string | null;
  model?: string | null;
  status?: string;
  
  // Store-based default pricing
  base_price?: number | null;
  b2b_price?: number | null;
  b2c_price?: number | null;
  min_order_quantity?: number | null;
  vat_included?: boolean | null;
  
  // Attributes
  attributes?: ProductAttributeData[];
}

export interface ProductAttributeData {
  attribute_name: string;
  attribute_value: string;
  attribute_type?: string;
}

export function useProducts() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProduct = async (productData: ProductData) => {
    setLoading(true);
    setError(null);

    try {
      // First, create the main product record with default pricing
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
          company_id: productData.company_id,
          store_id: productData.store_id,
          name: productData.name,
          sku: productData.sku,
          description: productData.description,
          type: productData.type,
          category: productData.category,
          brand: productData.brand,
          model: productData.model,
          status: productData.status || 'active',
          
          // Store-based default pricing
          base_price: productData.base_price || null,
          b2b_price: productData.b2b_price || null,
          b2c_price: productData.b2c_price || null,
          min_order_quantity: productData.min_order_quantity || 1,
          vat_included: productData.vat_included || false
        })
        .select()
        .single();

      if (productError) {
        console.error('Product creation error:', productError);
        throw productError;
      }

      console.log('Created product:', product);

      // Handle attributes if provided
      if (productData.attributes && productData.attributes.length > 0) {
        const attributeInserts = productData.attributes.map(attr => ({
          product_id: product.id,
          company_id: productData.company_id,
          store_id: productData.store_id,
          attribute_name: attr.attribute_name,
          attribute_value: attr.attribute_value,
          attribute_type: attr.attribute_type || 'text'
        }));

        const { error: attributeError } = await supabase
          .from('product_attributes')
          .insert(attributeInserts);

        if (attributeError) {
          console.error('Attribute creation error:', attributeError);
          // Don't throw here, as the main product was created successfully
        }
      }

      return product;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create product';
      setError(errorMessage);
      console.error('Error in createProduct:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getProductsByStore = async (storeId: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_attributes(*),
          product_pricing(*),
          product_certifications(*),
          product_standards(*)
        `)
        .eq('store_id', storeId);

      if (error) throw error;
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getProductsByCompany = async (companyId?: string) => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          product_attributes(*),
          product_zone_assignments(
            id,
            zone_id,
            override_base_price,
            override_b2b_price,
            override_b2c_price,
            override_min_order_quantity,
            is_active,
            priority,
            delivery_zones(
              id,
              name,
              zone_type,
              delivery_fee,
              discount_percentage
            )
          )
        `);

      // If companyId is provided, filter by it; otherwise rely on RLS
      if (companyId) {
        query = query.eq('company_id', companyId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Database query error:', error);
        throw error;
      }
      
      console.log('Raw product data from database:', data);
      console.log('First product zone assignments:', data?.[0]?.product_zone_assignments);
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products';
      setError(errorMessage);
      console.error('Error in getProductsByCompany:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getProductStats = async (companyId?: string) => {
    setLoading(true);
    setError(null);

    try {
      // Get product counts by status
      let query = supabase
        .from('products')
        .select('status, category');

      if (companyId) {
        query = query.eq('company_id', companyId);
      }

      const { data: products, error } = await query;

      if (error) throw error;

      // Calculate stats
      const totalProducts = products?.length || 0;
      const activeProducts = products?.filter(p => p.status === 'active').length || 0;
      const draftProducts = products?.filter(p => p.status === 'draft').length || 0;
      const archivedProducts = products?.filter(p => p.status === 'archived').length || 0;
      
      // Get unique categories
      const uniqueCategories = new Set(products?.map(p => p.category).filter(Boolean));
      const totalCategories = uniqueCategories.size;

      return {
        totalProducts,
        activeProducts,
        draftProducts,
        archivedProducts,
        totalCategories
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch product stats';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = async (searchTerm: string, filters: { status?: string; category?: string } = {}) => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          product_attributes(*),
          product_pricing(*)
        `);

      // Apply search term
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,type.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%,brand.ilike.%${searchTerm}%`);
      }

      // Apply status filter
      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      // Apply category filter
      if (filters.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search products';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (productId: string, updates: Partial<ProductData>) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('products')
        .update({
          name: updates.name,
          brand: updates.brand,
          type: updates.type,
          model: updates.model,
          category: updates.category,
          description: updates.description,
          status: updates.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', productId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update product';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId: string) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete product';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createProduct,
    getProductsByStore,
    getProductsByCompany,
    getProductStats,
    searchProducts,
    updateProduct,
    deleteProduct,
    loading,
    error
  };
}