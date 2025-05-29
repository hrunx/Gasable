import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { isDemoMode } from '../supabase';
import { demoProducts, demoProductAttributes, demoProductImages, demoProductPricing } from '../demo-data';
import { useAuth } from '../auth';

export interface Product {
  id: string;
  company_id: string;
  name: string;
  sku: string | null;
  description: string | null;
  type: string | null;
  category: string | null;
  brand: string | null;
  model: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  attributes?: ProductAttribute[];
  images?: ProductImage[];
  pricing?: ProductPricing[];
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

interface ProductData {
  company_id: string;
  store_id: string;
  name: string;
  brand: string;
  type: string;
  model?: string;
  category: string;
  description?: string;
  status: string;
  images?: File[];
  documents?: File[];
  certifications?: string[];
  standards?: string[];
  safety_info?: string;
  mechanical?: ProductAttribute[];
  physical?: ProductAttribute[];
  chemical?: ProductAttribute[];
  electrical?: ProductAttribute[];
  fuel?: ProductAttribute[];
  base_price?: number;
  b2b_price?: number;
  b2c_price?: number;
  min_order_quantity?: number;
  vat_included?: boolean;
}

export function useProducts() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProduct = async (productData: ProductData) => {
    setLoading(true);
    setError(null);

    try {
      // 1. Create main product record
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
          company_id: productData.company_id,
          store_id: productData.store_id,
          name: productData.name,
          brand: productData.brand,
          type: productData.type,
          model: productData.model,
          category: productData.category,
          description: productData.description,
          status: productData.status
        })
        .select()
        .single();

      if (productError) throw productError;

      const productId = product.id;

      // 2. Create product attributes if provided
      const attributePromises = [];
      
      // Handle safety information as an attribute
      if (productData.safety_info) {
        attributePromises.push(
          supabase.from('product_attributes').insert({
            product_id: productId,
            attribute_type: 'safety',
            name: 'Safety Information',
            value: productData.safety_info
          })
        );
      }

      // Handle certifications as attributes
      if (productData.certifications?.length) {
        attributePromises.push(
          supabase.from('product_attributes').insert(
            productData.certifications.map(cert => ({
              product_id: productId,
              attribute_type: 'certification',
              name: 'Certification',
              value: cert
            }))
          )
        );
      }

      // Handle standards as attributes
      if (productData.standards?.length) {
        attributePromises.push(
          supabase.from('product_attributes').insert(
            productData.standards.map(standard => ({
              product_id: productId,
              attribute_type: 'standard',
              name: 'Standard',
              value: standard
            }))
          )
        );
      }
      
      if (productData.mechanical?.length) {
        attributePromises.push(
          supabase.from('product_attributes').insert(
            productData.mechanical.map(attr => ({
              product_id: productId,
              attribute_type: 'mechanical',
              name: attr.name,
              value: attr.value,
              unit: attr.unit
            }))
          )
        );
      }

      if (productData.physical?.length) {
        attributePromises.push(
          supabase.from('product_attributes').insert(
            productData.physical.map(attr => ({
              product_id: productId,
              attribute_type: 'physical',
              name: attr.name,
              value: attr.value,
              unit: attr.unit
            }))
          )
        );
      }

      if (productData.chemical?.length) {
        attributePromises.push(
          supabase.from('product_attributes').insert(
            productData.chemical.map(attr => ({
              product_id: productId,
              attribute_type: 'chemical',
              name: attr.name,
              value: attr.value,
              unit: attr.unit
            }))
          )
        );
      }

      if (productData.electrical?.length) {
        attributePromises.push(
          supabase.from('product_attributes').insert(
            productData.electrical.map(attr => ({
              product_id: productId,
              attribute_type: 'electrical',
              name: attr.name,
              value: attr.value,
              unit: attr.unit
            }))
          )
        );
      }

      if (productData.fuel?.length) {
        attributePromises.push(
          supabase.from('product_attributes').insert(
            productData.fuel.map(attr => ({
              product_id: productId,
              attribute_type: 'fuel',
              name: attr.name,
              value: attr.value,
              unit: attr.unit
            }))
          )
        );
      }

      // 3. Create pricing record if provided
      if (productData.base_price !== undefined) {
        attributePromises.push(
          supabase.from('product_pricing').insert({
            product_id: productId,
            base_price: productData.base_price,
            b2b_price: productData.b2b_price,
            b2c_price: productData.b2c_price,
            min_order_quantity: productData.min_order_quantity,
            vat_included: productData.vat_included
          })
        );
      }

      // Execute all attribute/pricing/certification inserts
      if (attributePromises.length > 0) {
        const results = await Promise.all(attributePromises);
        const errors = results.filter(result => result.error);
        if (errors.length > 0) {
          console.warn('Some product attributes failed to save:', errors);
        }
      }

      // TODO: Handle file uploads for images and documents
      // This would involve uploading to Supabase storage and storing file paths

      return product;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create product';
      setError(errorMessage);
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

  return {
    createProduct,
    getProductsByStore,
    loading,
    error
  };
}