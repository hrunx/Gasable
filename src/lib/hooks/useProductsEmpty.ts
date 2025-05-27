import { useState, useEffect } from 'react';
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
  sort_order: number;
  is_primary: boolean;
  created_at: string;
}

export interface ProductPricing {
  id: string;
  product_id: string;
  pricing_type: string;
  currency: string;
  base_price: number;
  sale_price: number | null;
  is_on_sale: boolean;
  discount_percent: number | null;
  discount_amount: number | null;
  valid_from: string | null;
  valid_until: string | null;
  min_quantity: number | null;
  region: string | null;
  created_at: string;
  updated_at: string;
}

export function useProductsEmpty(options: {
  includeAttributes?: boolean;
  includeImages?: boolean;
  includePricing?: boolean;
  status?: string;
  limit?: number;
} = {}) {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Immediately set an empty products array and loading to false
    setProducts([]);
    setLoading(false);
  }, [user]);

  return { products, loading, error };
} 