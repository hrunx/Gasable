import { useState, useEffect } from 'react';
import { useAuth } from '../auth';

export interface SupplierSubscription {
  id: string;
  company_id: string;
  plan_id: string;
  status: string;
  start_date: string;
  end_date: string | null;
  renewal_date: string | null;
  auto_renew: boolean;
  payment_method: string | null;
  payment_status: string | null;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  price: number;
  billing_cycle: string;
  features: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionTier {
  id: string;
  plan_id: string;
  name: string;
  level: number;
  product_limit: number | null;
  order_limit: number | null;
  store_limit: number | null;
  staff_limit: number | null;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionUsage {
  id: string;
  company_id: string;
  month: string;
  product_count: number;
  order_count: number;
  store_count: number;
  staff_count: number;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionData {
  subscription: SupplierSubscription | null;
  plan: SubscriptionPlan | null;
  tier: SubscriptionTier | null;
  usage: SubscriptionUsage | null;
  allPlans: SubscriptionPlan[];
  allTiers: SubscriptionTier[];
  loading: boolean;
  error: string | null;
}

export function useSubscriptionEmpty(companyId?: string): SubscriptionData {
  const { user } = useAuth();
  const [data, setData] = useState<SubscriptionData>({
    subscription: null,
    plan: null,
    tier: null,
    usage: null,
    allPlans: [],
    allTiers: [],
    loading: false,
    error: null
  });

  // No useEffect needed - we just return the empty data

  return data;
} 