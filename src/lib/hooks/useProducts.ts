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

export interface ProductAttribute {
  id: string;
  product_id: string;
  attribute_type: string;
  name: string;
  value: string;
  unit: string | null;
  created_at: string;
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

export function useProducts(options: {
  includeAttributes?: boolean;
  includeImages?: boolean;
  includePricing?: boolean;
  status?: string;
  limit?: number;
} = {}) {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { 
    includeAttributes = false, 
    includeImages = false, 
    includePricing = false,
    status,
    limit
  } = options;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (isDemoMode()) {
          // Use demo data
          let productsData = [...demoProducts];
          
          // Apply status filter if provided
          if (status) {
            productsData = productsData.filter(p => p.status === status);
          }
          
          // Apply limit if provided
          if (limit && limit > 0) {
            productsData = productsData.slice(0, limit);
          }
          
          // Add related data if requested
          if (includeAttributes || includeImages || includePricing) {
            productsData = productsData.map(product => {
              const enrichedProduct: Product = { ...product };
              
              if (includeAttributes) {
                enrichedProduct.attributes = demoProductAttributes.filter(
                  attr => attr.product_id === product.id
                );
              }
              
              if (includeImages) {
                enrichedProduct.images = demoProductImages.filter(
                  img => img.product_id === product.id
                );
              }
              
              if (includePricing) {
                enrichedProduct.pricing = demoProductPricing.filter(
                  price => price.product_id === product.id
                );
              }
              
              return enrichedProduct;
            });
          }
          
          setProducts(productsData);
          setLoading(false);
          return;
        }

        if (!user) {
          setProducts([]);
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
              setProducts([]);
              setLoading(false);
              return;
            }

            companyId = userData?.company_id;
          } catch (e) {
            console.warn("Error fetching user company data:", e);
            setProducts([]);
            setLoading(false);
            return;
          }
          
          if (!companyId) {
            setProducts([]);
            setLoading(false);
            return;
          }
        }

        // Build the query
        let query = supabase
          .from('products')
          .select('*')
          .eq('company_id', companyId);
        
        // Add status filter if provided
        if (status) {
          query = query.eq('status', status);
        }
        
        // Add limit if provided
        if (limit && limit > 0) {
          query = query.limit(limit);
        }
        
        // Execute the query
        const { data: productsData, error: productsError } = await query;

        if (productsError) {
          throw new Error(`Error fetching products: ${productsError.message}`);
        }

        // Fetch related data if requested
        let enrichedProducts = [...productsData];
        
        if (includeAttributes || includeImages || includePricing) {
          const productIds = productsData.map(p => p.id);
          
          // Fetch attributes if requested
          let attributes: ProductAttribute[] = [];
          if (includeAttributes && productIds.length > 0) {
            const { data: attributesData, error: attributesError } = await supabase
              .from('product_attributes')
              .select('*')
              .in('product_id', productIds);
            
            if (attributesError) {
              throw new Error(`Error fetching product attributes: ${attributesError.message}`);
            }
            
            attributes = attributesData || [];
          }
          
          // Fetch images if requested
          let images: ProductImage[] = [];
          if (includeImages && productIds.length > 0) {
            const { data: imagesData, error: imagesError } = await supabase
              .from('product_images')
              .select('*')
              .in('product_id', productIds);
            
            if (imagesError) {
              throw new Error(`Error fetching product images: ${imagesError.message}`);
            }
            
            images = imagesData || [];
          }
          
          // Fetch pricing if requested
          let pricing: ProductPricing[] = [];
          if (includePricing && productIds.length > 0) {
            const { data: pricingData, error: pricingError } = await supabase
              .from('product_pricing')
              .select('*')
              .in('product_id', productIds);
            
            if (pricingError) {
              throw new Error(`Error fetching product pricing: ${pricingError.message}`);
            }
            
            pricing = pricingData || [];
          }
          
          // Enrich products with related data
          enrichedProducts = productsData.map(product => {
            const enrichedProduct: Product = { ...product };
            
            if (includeAttributes) {
              enrichedProduct.attributes = attributes.filter(
                attr => attr.product_id === product.id
              );
            }
            
            if (includeImages) {
              enrichedProduct.images = images.filter(
                img => img.product_id === product.id
              );
            }
            
            if (includePricing) {
              enrichedProduct.pricing = pricing.filter(
                price => price.product_id === product.id
              );
            }
            
            return enrichedProduct;
          });
        }

        setProducts(enrichedProducts);
        setLoading(false);
      } catch (error: any) {
        console.error('Error in useProducts:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [user, includeAttributes, includeImages, includePricing, status, limit]);

  return { products, loading, error };
}