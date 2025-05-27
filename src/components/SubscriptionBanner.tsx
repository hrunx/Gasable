import React from 'react';
import { useSubscription } from '../lib/hooks/useSubscription';
import { useCompany } from '../lib/hooks/useCompany';
import { ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const SubscriptionBanner: React.FC = () => {
  const { subscription, plan, tier, usage } = useSubscription();
  const { company } = useCompany();
  
  if (!subscription || !plan || !tier || !usage) {
    return null;
  }
  
  // Calculate usage percentages
  const productUsagePercent = Math.min(100, Math.round((usage.products_used / tier.product_limit) * 100));
  const orderUsagePercent = Math.min(100, Math.round((usage.orders_used / tier.order_limit) * 100));
  const gmvUsagePercent = Math.min(100, Math.round((usage.gmv_used / tier.gmv_limit) * 100));
  const branchUsagePercent = Math.min(100, Math.round((usage.branches_used / tier.branch_limit) * 100));
  const userUsagePercent = Math.min(100, Math.round((usage.users_used / tier.user_limit) * 100));
  
  // Determine if any limits are close to being reached (>80%)
  const hasHighUsage = productUsagePercent > 80 || orderUsagePercent > 80 || 
                       gmvUsagePercent > 80 || branchUsagePercent > 80 || 
                       userUsagePercent > 80;
  
  if (!hasHighUsage) {
    return null;
  }
  
  return (
    <div className="bg-gradient-to-r from-amber-50 to-amber-100 border-l-4 border-amber-500 p-4 mb-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-6 w-6 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-amber-800">Subscription Limit Alert</h3>
            <p className="text-amber-700 mt-1">
              {productUsagePercent > 80 && (
                <span className="block">
                  You're using {usage.products_used} of {tier.product_limit} products ({productUsagePercent}%).
                </span>
              )}
              {orderUsagePercent > 80 && (
                <span className="block">
                  You've used {usage.orders_used} of {tier.order_limit} orders this month ({orderUsagePercent}%).
                </span>
              )}
              {gmvUsagePercent > 80 && (
                <span className="block">
                  You've reached {usage.gmv_used.toLocaleString()} of {tier.gmv_limit.toLocaleString()} SAR GMV limit ({gmvUsagePercent}%).
                </span>
              )}
              {branchUsagePercent > 80 && (
                <span className="block">
                  You're using {usage.branches_used} of {tier.branch_limit} branches ({branchUsagePercent}%).
                </span>
              )}
              {userUsagePercent > 80 && (
                <span className="block">
                  You're using {usage.users_used} of {tier.user_limit} users ({userUsagePercent}%).
                </span>
              )}
            </p>
          </div>
        </div>
        <Link 
          to="/dashboard/settings/subscription" 
          className="flex items-center space-x-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <span>Upgrade Plan</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

export default SubscriptionBanner;