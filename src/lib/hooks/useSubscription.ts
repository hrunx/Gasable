import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { isDemoMode } from '../supabase';
import { demoSupplierSubscription, demoSubscriptionTiers, demoSubscriptionPlans, demoSubscriptionUsage } from '../demo-data';
import { useAuth } from '../auth';

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string | null;
  monthly_price: number;
  yearly_price: number;
  is_active: boolean | null;
}

export interface SubscriptionTier {
  id: string;
  plan_id: string;
  product_limit: number;
  order_limit: number;
  gmv_limit: number;
  branch_limit: number;
  user_limit: number;
  customer_types: string[];
  countries_access: string;
  commission_rate: number;
  support_level: string;
  api_access: string;
  features: string[];
}

export interface SupplierSubscription {
  id: string;
  company_id: string;
  plan_id: string;
  status: string;
  billing_cycle: string;
  start_date: string;
  end_date: string | null;
  auto_renew: boolean | null;
  payment_method: string | null;
  payment_details: any | null;
}

export interface SubscriptionUsage {
  id: string;
  company_id: string;
  products_used: number;
  orders_used: number;
  gmv_used: number;
  branches_used: number;
  users_used: number;
  month: string;
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

export function useSubscription(companyId?: string): SubscriptionData {
  const { user } = useAuth();
  const [data, setData] = useState<SubscriptionData>({
    subscription: null,
    plan: null,
    tier: null,
    usage: null,
    allPlans: [],
    allTiers: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      try {
        if (isDemoMode()) {
          // Use demo data
          const subscription = demoSupplierSubscription;
          const plan = demoSubscriptionPlans.find(p => p.id === subscription.plan_id) || null;
          const tier = demoSubscriptionTiers.find(t => t.plan_id === subscription.plan_id) || null;
          const usage = demoSubscriptionUsage;
          
          setData({
            subscription,
            plan,
            tier,
            usage,
            allPlans: demoSubscriptionPlans,
            allTiers: demoSubscriptionTiers,
            loading: false,
            error: null
          });
          return;
        }

        // If not in demo mode and no company ID, try to get it from the user
        const effectiveCompanyId = companyId || user?.user_metadata?.company_id;
        
        if (!effectiveCompanyId) {
          setData(prev => ({
            ...prev,
            loading: false,
            error: null // Don't set an error, just return empty data
          }));
          return;
        }

        // Fetch all plans and tiers first (these should always work)
        let plansData = [];
        let tiersData = [];
        
        try {
          const { data: plans, error: plansError } = await supabase
            .from('subscription_plans')
            .select('*')
            .eq('is_active', true);

          if (plansError) {
            console.warn(`Error fetching plans: ${plansError.message}`);
          } else {
            plansData = plans || [];
          }
        } catch (e) {
          console.warn("Error fetching subscription plans:", e);
        }
        
        try {
          const { data: tiers, error: tiersError } = await supabase
            .from('subscription_tiers')
            .select('*');

          if (tiersError) {
            console.warn(`Error fetching tiers: ${tiersError.message}`);
          } else {
            tiersData = tiers || [];
          }
        } catch (e) {
          console.warn("Error fetching subscription tiers:", e);
        }
        
        // Fetch subscription data (may not exist for new users)
        let subscriptionData = null;
        try {
          const { data, error } = await supabase
            .from('supplier_subscriptions')
            .select('*')
            .eq('company_id', effectiveCompanyId)
            .eq('status', 'active')
            .maybeSingle(); // Use maybeSingle instead of single to handle no results

          if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
            console.warn(`Error fetching subscription: ${error.message}`);
          } else {
            subscriptionData = data;
          }
        } catch (e) {
          console.warn("Error fetching subscription data:", e);
        }

        // Fetch current plan (if subscription exists)
        const currentPlan = subscriptionData ? 
          plansData.find(p => p.id === subscriptionData.plan_id) || null : null;

        // Fetch current tier (if subscription exists)
        const currentTier = subscriptionData ? 
          tiersData.find(t => t.plan_id === subscriptionData.plan_id) || null : null;

        // Fetch usage data for current month (may not exist for new users)
        let usageData = null;
        try {
          const currentMonth = new Date().toISOString().substring(0, 7) + '-01'; // YYYY-MM-01 format
          const { data, error } = await supabase
            .from('subscription_usage')
            .select('*')
            .eq('company_id', effectiveCompanyId)
            .eq('month', currentMonth)
            .maybeSingle(); // Use maybeSingle instead of single to handle no results

          if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
            console.warn(`Error fetching usage: ${error.message}`);
          } else {
            usageData = data;
          }
        } catch (e) {
          console.warn("Error fetching usage data:", e);
        }

        // Set the data with whatever we were able to fetch
        setData({
          subscription: subscriptionData,
          plan: currentPlan,
          tier: currentTier,
          usage: usageData,
          allPlans: plansData,
          allTiers: tiersData,
          loading: false,
          error: null
        });
      } catch (error: any) {
        console.error('Error in useSubscription:', error);
        setData(prev => ({
          ...prev,
          loading: false,
          error: error.message
        }));
      }
    };

    fetchSubscriptionData();
  }, [companyId, user]);

  return data;
}