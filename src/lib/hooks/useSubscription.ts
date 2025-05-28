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
  is_active: boolean;
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

export interface PaymentHistory {
  id: string;
  date: string;
  amount: number;
  plan: string;
  status: 'completed' | 'pending' | 'failed';
  invoiceUrl: string;
}

export interface SubscriptionData {
  currentPlan: string;
  subscriptionTier: string;
  subscriptionStatus: string;
  nextBillingDate?: string;
  isActive: boolean;
}

export interface FormattedSubscriptionTier {
  name: string;
  price: string;
  yearlyDiscount: string;
  features: {
    customerType: string;
    productsAllowed: string;
    ordersLimit: string;
    coverage: string;
    branches: string;
    drivers: string;
    inventory: string;
    compliance: string;
    marketing: string;
    trial: string;
    integration: string;
    analytics: string;
    support: string;
    training: string;
    commission: string;
  };
  recommended?: boolean;
  monthlyPrice?: number;
}

export function useSubscription() {
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [subscriptionTiers, setSubscriptionTiers] = useState<SubscriptionTier[]>([]);
  const [formattedTiers, setFormattedTiers] = useState<FormattedSubscriptionTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch subscription plans from database
  const fetchSubscriptionPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('monthly_price', { ascending: true });

      if (error) {
        console.error('Error fetching subscription plans:', error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error('Error fetching subscription plans:', err);
      return [];
    }
  };

  // Fetch subscription tiers from database
  const fetchSubscriptionTiers = async () => {
    try {
      const { data, error } = await supabase
        .from('subscription_tiers')
        .select('*')
        .order('plan_id');

      if (error) {
        console.error('Error fetching subscription tiers:', error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error('Error fetching subscription tiers:', err);
      return [];
    }
  };

  // Format database data into component-friendly format
  const formatSubscriptionTiers = (plans: SubscriptionPlan[], tiers: SubscriptionTier[]): FormattedSubscriptionTier[] => {
    return plans.map((plan, index) => {
      const tier = tiers.find(t => t.plan_id === plan.id);
      
      if (!tier) {
        return {
          name: plan.name,
          price: plan.monthly_price === 0 ? 'Free' : `${plan.monthly_price} SAR/month`,
          yearlyDiscount: plan.yearly_price > 0 ? `${Math.round((1 - plan.yearly_price / (plan.monthly_price * 12)) * 100)}%` : '–',
          monthlyPrice: plan.monthly_price,
          recommended: index === 2, // Make Advanced plan recommended
          features: {
            customerType: 'B2C',
            productsAllowed: 'Limited',
            ordersLimit: 'Limited',
            coverage: 'Domestic Only',
            branches: '1 branch',
            drivers: 'Limited',
            inventory: 'Basic',
            compliance: 'Basic',
            marketing: '–',
            trial: '14 days',
            integration: 'N/A',
            analytics: '–',
            support: '24/7',
            training: 'Basic',
            commission: 'Tax + Transaction Fees Only',
          }
        };
      }

      return {
        name: plan.name,
        price: plan.monthly_price === 0 ? 'Free' : `${plan.monthly_price} SAR/month`,
        yearlyDiscount: plan.yearly_price > 0 ? `${Math.round((1 - plan.yearly_price / (plan.monthly_price * 12)) * 100)}%` : '–',
        monthlyPrice: plan.monthly_price,
        recommended: plan.name === 'Advanced', // Make Advanced plan recommended
        features: {
          customerType: tier.customer_types.join(' & ') || 'B2C',
          productsAllowed: tier.product_limit === -1 ? 'Unlimited' : `Up to ${tier.product_limit}`,
          ordersLimit: tier.order_limit === -1 ? 'Unlimited orders & GMV' : `${tier.order_limit} orders/month\nMax ${tier.gmv_limit} SAR GMV`,
          coverage: tier.countries_access || 'Domestic Only',
          branches: tier.branch_limit === -1 ? 'Unlimited' : `Up to ${tier.branch_limit}`,
          drivers: tier.user_limit === -1 ? 'Unlimited' : `${tier.user_limit}`,
          inventory: tier.features.includes('advanced_inventory') ? 'Advanced' : 'Basic',
          compliance: tier.features.includes('advanced_compliance') ? 'Advanced' : 'Basic',
          marketing: tier.features.includes('marketing') ? 'Promotions & Campaigns' : tier.features.includes('directory') ? 'Directory Listing' : '–',
          trial: tier.features.includes('extended_trial') ? '3 months' : tier.features.includes('trial') ? '1 month' : '14 days',
          integration: tier.api_access === 'full' ? 'Custom API Setup' : tier.api_access === 'standard' ? 'API Access' : 'N/A',
          analytics: tier.features.includes('full_analytics') ? 'Full Performance Reports' : tier.features.includes('basic_analytics') ? 'Advanced' : tier.features.includes('analytics') ? 'Basic' : '–',
          support: tier.support_level === 'dedicated' ? '24/7 + Dedicated KAM' : tier.support_level === 'priority' ? '24/7 + KAM' : '24/7',
          training: tier.features.includes('full_training') ? 'Full Training Suite' : tier.features.includes('enhanced_training') ? 'Enhanced' : 'Basic',
          commission: tier.commission_rate > 0 ? `${tier.commission_rate}% (UPC-based)` : 'Tax + Transaction Fees Only',
        }
      };
    });
  };

  // Fetch subscription data from company
  const fetchSubscriptionData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch plans and tiers
      const [plans, tiers] = await Promise.all([
        fetchSubscriptionPlans(),
        fetchSubscriptionTiers()
      ]);

      setSubscriptionPlans(plans);
      setSubscriptionTiers(tiers);
      setFormattedTiers(formatSubscriptionTiers(plans, tiers));

      // Get company data which includes subscription info
      const { data, error } = await supabase.rpc('get_user_company_data');

      if (error) {
        console.error('Error fetching subscription data:', error);
        // Provide fallback data for free plan
        setSubscriptionData({
          currentPlan: 'Free',
          subscriptionTier: 'free',
          subscriptionStatus: 'active',
          isActive: true
        });
        return;
      }

      if (data && data.length > 0) {
        const company = data[0];
        const currentPlan = plans.find(p => p.name.toLowerCase() === (company.subscription_tier || 'free'));
        
        setSubscriptionData({
          currentPlan: currentPlan?.name || 'Free',
          subscriptionTier: company.subscription_tier || 'free',
          subscriptionStatus: company.subscription_status || 'active',
          nextBillingDate: company.subscription_tier !== 'free' ? '2024-04-15' : undefined,
          isActive: company.subscription_status === 'active'
        });
      } else {
        // Default to free plan if no data
        setSubscriptionData({
          currentPlan: 'Free',
          subscriptionTier: 'free',
          subscriptionStatus: 'active',
          isActive: true
        });
      }
    } catch (err) {
      console.error('Error fetching subscription data:', err);
      // Fallback to free plan
      setSubscriptionData({
        currentPlan: 'Free',
        subscriptionTier: 'free',
        subscriptionStatus: 'active',
        isActive: true
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch payment history (for now, return empty for free plan)
  const fetchPaymentHistory = async () => {
    try {
      // For now, we'll return empty array for free plans
      // In the future, this would fetch from a payments table
      if (subscriptionData?.subscriptionTier === 'free') {
        setPaymentHistory([]);
        return;
      }

      // TODO: Implement actual payment history fetching from database
      // For now, return empty array to remove hardcoded data
      setPaymentHistory([]);
    } catch (err) {
      console.error('Error fetching payment history:', err);
      setPaymentHistory([]);
    }
  };

  // Update subscription plan
  const updateSubscriptionPlan = async (newPlan: string) => {
    try {
      setError(null);

      // Find the plan in our database
      const plan = subscriptionPlans.find(p => p.name === newPlan);
      if (!plan) {
        throw new Error('Plan not found');
      }

      // Map plan names to tier values
      const newTier = plan.name.toLowerCase();

      // Update company subscription tier
      const { error } = await supabase
        .from('companies')
        .update({ 
          subscription_tier: newTier,
          subscription_status: 'active'
        })
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;

      // Refresh subscription data
      await fetchSubscriptionData();
      
      return { success: true, message: 'Subscription updated successfully' };
    } catch (err) {
      console.error('Error updating subscription:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update subscription';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Cancel subscription (downgrade to free)
  const cancelSubscription = async () => {
    try {
      setError(null);

      const { error } = await supabase
        .from('companies')
        .update({ 
          subscription_tier: 'free',
          subscription_status: 'cancelled'
        })
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;

      // Refresh subscription data
      await fetchSubscriptionData();
      
      return { success: true, message: 'Subscription cancelled successfully' };
    } catch (err) {
      console.error('Error cancelling subscription:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to cancel subscription';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Check if user is on free plan
  const isFreePlan = () => {
    return subscriptionData?.subscriptionTier === 'free';
  };

  // Check if user can upgrade
  const canUpgrade = () => {
    return subscriptionData?.subscriptionTier !== 'premium';
  };

  // Check if user can cancel
  const canCancel = () => {
    return subscriptionData?.subscriptionTier !== 'free' && subscriptionData?.isActive;
  };

  // Initialize data on mount
  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  // Fetch payment history when subscription data changes
  useEffect(() => {
    if (subscriptionData) {
      fetchPaymentHistory();
    }
  }, [subscriptionData]);

  return {
    // Data
    subscriptionData,
    paymentHistory,
    subscriptionPlans,
    subscriptionTiers,
    formattedTiers,
    
    // State
    loading,
    error,
    
    // Actions
    updateSubscriptionPlan,
    cancelSubscription,
    fetchSubscriptionData,
    
    // Utilities
    isFreePlan,
    canUpgrade,
    canCancel,
    
    // Refresh function
    refresh: fetchSubscriptionData
  };
}