import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSubscription } from '../../lib/hooks/useSubscription';
import { useCompany } from '../../lib/hooks/useCompany';
import {
  CreditCard,
  Calendar,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Download,
  FileText,
  Users,
  Package,
  Building2,
  DollarSign,
  Globe,
  Star,
  Shield,
  Zap,
  HelpCircle,
  X,
  Check,
  ChevronDown,
  ChevronUp,
  Info,
  ExternalLink,
} from 'lucide-react';

const SubscriptionManagement = () => {
  const { subscription, plan, tier, usage, allPlans, allTiers, loading, error } = useSubscription();
  const { company } = useCompany();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="h-6 w-6 text-red-500 mr-3" />
            <p className="text-red-700">Error loading subscription data: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!subscription || !plan || !tier || !usage) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="h-6 w-6 text-yellow-500 mr-3" />
            <p className="text-yellow-700">No active subscription found. Please contact support.</p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate usage percentages
  const productUsagePercent = Math.min(100, Math.round((usage.products_used / tier.product_limit) * 100));
  const orderUsagePercent = Math.min(100, Math.round((usage.orders_used / tier.order_limit) * 100));
  const gmvUsagePercent = Math.min(100, Math.round((usage.gmv_used / tier.gmv_limit) * 100));
  const branchUsagePercent = Math.min(100, Math.round((usage.branches_used / tier.branch_limit) * 100));
  const userUsagePercent = Math.min(100, Math.round((usage.users_used / tier.user_limit) * 100));

  // Calculate days remaining in subscription
  const endDate = new Date(subscription.end_date || '');
  const today = new Date();
  const daysRemaining = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  // Format dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleUpgrade = (planId: string) => {
    setSelectedPlan(planId);
    setShowUpgradeModal(true);
  };

  const confirmUpgrade = () => {
    setShowUpgradeModal(false);
    setShowPaymentModal(true);
  };

  const completePayment = () => {
    // In a real app, this would process the payment and update the subscription
    setShowPaymentModal(false);
    alert('Subscription upgraded successfully!');
  };

  const getUsageColor = (percent: number) => {
    if (percent < 60) return 'bg-green-500';
    if (percent < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900 mb-2">
              💳 Subscription & Usage
            </h1>
            <p className="text-secondary-600">
              Manage your subscription plan, monitor usage, and view billing history
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors flex items-center space-x-2">
              <Download className="h-5 w-5" />
              <span>Export</span>
            </button>
            <button className="px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Billing History</span>
            </button>
          </div>
        </div>
      </div>

      {/* Current Plan */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-secondary-900">Current Plan</h2>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm flex items-center">
              <CheckCircle className="h-4 w-4 mr-1" />
              Active
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-primary-50 text-primary-600 rounded-lg">
                <CreditCard className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-secondary-900">{plan.name} Plan</h3>
                <p className="text-secondary-600">{plan.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div>
                <p className="text-sm text-secondary-500">Billing Cycle</p>
                <p className="font-medium">{subscription.billing_cycle === 'monthly' ? 'Monthly' : 'Yearly'}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">Next Billing Date</p>
                <p className="font-medium">{formatDate(subscription.end_date || '')}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">Subscription Started</p>
                <p className="font-medium">{formatDate(subscription.start_date)}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">Auto-Renewal</p>
                <p className="font-medium">{subscription.auto_renew ? 'Enabled' : 'Disabled'}</p>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-secondary-500">Subscription Period</p>
                <p className="text-sm text-secondary-600">{daysRemaining} days remaining</p>
              </div>
              <div className="w-full bg-secondary-100 rounded-full h-2.5">
                <div 
                  className="bg-primary-600 h-2.5 rounded-full" 
                  style={{ width: `${100 - Math.min(100, (daysRemaining / 365) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-secondary-50 p-6 rounded-xl border border-secondary-100">
            <h3 className="font-semibold text-secondary-900 mb-4">Plan Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-secondary-600">Base Price</span>
                <span className="font-medium">
                  {subscription.billing_cycle === 'monthly' 
                    ? `${plan.monthly_price} SAR/month` 
                    : `${plan.yearly_price} SAR/year`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-600">Commission Rate</span>
                <span className="font-medium">{tier.commission_rate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-600">Support Level</span>
                <span className="font-medium">{tier.support_level}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-600">API Access</span>
                <span className="font-medium">{tier.api_access}</span>
              </div>
              <div className="pt-3 border-t border-secondary-200">
                <button 
                  onClick={() => setShowUpgradeModal(true)}
                  className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Upgrade Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Limits */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <h2 className="text-lg font-semibold text-secondary-900 mb-6">Usage Limits</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Package className="h-5 w-5 text-primary-600" />
                  <span className="font-medium">Products</span>
                </div>
                <span className="text-sm text-secondary-600">
                  {usage.products_used} of {tier.product_limit} used
                </span>
              </div>
              <div className="w-full bg-secondary-100 rounded-full h-2.5">
                <div 
                  className={`${getUsageColor(productUsagePercent)} h-2.5 rounded-full`} 
                  style={{ width: `${productUsagePercent}%` }}
                ></div>
              </div>
              {productUsagePercent > 80 && (
                <p className="text-sm text-red-600 mt-1">
                  You're approaching your product limit. Consider upgrading your plan.
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-primary-600" />
                  <span className="font-medium">Monthly Orders</span>
                </div>
                <span className="text-sm text-secondary-600">
                  {usage.orders_used} of {tier.order_limit} used
                </span>
              </div>
              <div className="w-full bg-secondary-100 rounded-full h-2.5">
                <div 
                  className={`${getUsageColor(orderUsagePercent)} h-2.5 rounded-full`} 
                  style={{ width: `${orderUsagePercent}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-primary-600" />
                  <span className="font-medium">GMV (Gross Merchandise Value)</span>
                </div>
                <span className="text-sm text-secondary-600">
                  {usage.gmv_used.toLocaleString()} of {tier.gmv_limit.toLocaleString()} SAR
                </span>
              </div>
              <div className="w-full bg-secondary-100 rounded-full h-2.5">
                <div 
                  className={`${getUsageColor(gmvUsagePercent)} h-2.5 rounded-full`} 
                  style={{ width: `${gmvUsagePercent}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5 text-primary-600" />
                  <span className="font-medium">Branches</span>
                </div>
                <span className="text-sm text-secondary-600">
                  {usage.branches_used} of {tier.branch_limit} used
                </span>
              </div>
              <div className="w-full bg-secondary-100 rounded-full h-2.5">
                <div 
                  className={`${getUsageColor(branchUsagePercent)} h-2.5 rounded-full`} 
                  style={{ width: `${branchUsagePercent}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-primary-600" />
                  <span className="font-medium">Users</span>
                </div>
                <span className="text-sm text-secondary-600">
                  {usage.users_used} of {tier.user_limit} used
                </span>
              </div>
              <div className="w-full bg-secondary-100 rounded-full h-2.5">
                <div 
                  className={`${getUsageColor(userUsagePercent)} h-2.5 rounded-full`} 
                  style={{ width: `${userUsagePercent}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Globe className="h-5 w-5 text-primary-600" />
                  <span className="font-medium">Geographic Access</span>
                </div>
                <span className="text-sm text-secondary-600">
                  {tier.countries_access}
                </span>
              </div>
              <div className="mt-2">
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-sm">
                    {tier.customer_types.includes('B2B') ? 'B2B' : ''}
                  </span>
                  <span className="px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-sm">
                    {tier.customer_types.includes('B2C') ? 'B2C' : ''}
                  </span>
                  <span className="px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-sm">
                    {tier.customer_types.includes('B2G') ? 'B2G' : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Available Plans */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-secondary-900">Available Plans</h2>
          <div className="flex items-center p-1 bg-secondary-100 rounded-lg">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-lg ${
                billingCycle === 'monthly'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-secondary-600'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2 rounded-lg ${
                billingCycle === 'yearly'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-secondary-600'
              }`}
            >
              Yearly
              <span className="ml-1 text-xs text-green-600">Save up to 12%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {allPlans.map((planItem) => {
            const planTier = allTiers.find(t => t.plan_id === planItem.id);
            if (!planTier) return null;
            
            const isCurrentPlan = plan.id === planItem.id;
            const price = billingCycle === 'monthly' ? planItem.monthly_price : planItem.yearly_price;
            const isPremium = planItem.name === 'Premium';
            
            return (
              <div 
                key={planItem.id}
                className={`border rounded-xl overflow-hidden ${
                  isCurrentPlan 
                    ? 'border-primary-500 ring-2 ring-primary-500 ring-opacity-50' 
                    : 'border-secondary-200 hover:border-primary-200'
                } transition-all`}
              >
                {planItem.name === 'Advanced' && (
                  <div className="bg-primary-600 text-white text-center py-1 text-sm font-medium">
                    Recommended
                  </div>
                )}
                <div className={`p-6 ${planItem.name === 'Advanced' ? 'pt-4' : ''}`}>
                  <h3 className="text-xl font-bold text-secondary-900 mb-2">{planItem.name}</h3>
                  <div className="mb-4">
                    {isPremium ? (
                      <div className="text-3xl font-bold text-primary-600">Contact Sales</div>
                    ) : (
                      <>
                        <div className="text-3xl font-bold text-primary-600">
                          {price === 0 ? 'Free' : `${price.toLocaleString()} SAR`}
                        </div>
                        <p className="text-sm text-secondary-600 mt-1">
                          {billingCycle === 'monthly' ? 'per month' : 'per year'}
                        </p>
                      </>
                    )}
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-secondary-700">
                        {planTier.customer_types.join(' & ')} customers
                      </span>
                    </div>
                    <div className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-secondary-700">
                        {planTier.product_limit === 2147483647 
                          ? 'Unlimited products' 
                          : `${planTier.product_limit} products`}
                      </span>
                    </div>
                    <div className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-secondary-700">
                        {planTier.order_limit === 2147483647 
                          ? 'Unlimited orders' 
                          : `${planTier.order_limit} orders / ${planTier.gmv_limit.toLocaleString()} SAR GMV`}
                      </span>
                    </div>
                    <div className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-secondary-700">
                        {planTier.branch_limit === 2147483647 
                          ? 'Unlimited branches' 
                          : `${planTier.branch_limit} branches`}
                      </span>
                    </div>
                    <div className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-secondary-700">
                        {planTier.user_limit === 2147483647 
                          ? 'Unlimited users' 
                          : `${planTier.user_limit} users`}
                      </span>
                    </div>
                    <div className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-secondary-700">
                        {planTier.countries_access}
                      </span>
                    </div>
                    <div className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-secondary-700">
                        {planTier.commission_rate}% commission rate
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleUpgrade(planItem.id)}
                    disabled={isCurrentPlan}
                    className={`w-full py-2 px-4 rounded-lg font-medium ${
                      isCurrentPlan
                        ? 'bg-secondary-100 text-secondary-400 cursor-not-allowed'
                        : 'bg-primary-600 text-white hover:bg-primary-700'
                    } transition-colors`}
                  >
                    {isCurrentPlan ? 'Current Plan' : isPremium ? 'Contact Sales' : 'Select Plan'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Plan Features Comparison */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <h2 className="text-lg font-semibold text-secondary-900 mb-6">Plan Features Comparison</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-secondary-200">
                <th className="py-4 px-6 text-left font-medium text-secondary-600">Feature</th>
                {allPlans.map(planItem => (
                  <th key={planItem.id} className="py-4 px-6 text-center font-medium text-secondary-600">
                    {planItem.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-secondary-100">
                <td className="py-4 px-6 font-medium">Customer Types</td>
                {allTiers.map(tierItem => (
                  <td key={tierItem.id} className="py-4 px-6 text-center">
                    {tierItem.customer_types.join(', ')}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-secondary-100">
                <td className="py-4 px-6 font-medium">Product Limit</td>
                {allTiers.map(tierItem => (
                  <td key={tierItem.id} className="py-4 px-6 text-center">
                    {tierItem.product_limit === 2147483647 ? 'Unlimited' : tierItem.product_limit}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-secondary-100">
                <td className="py-4 px-6 font-medium">Order Limit (Monthly)</td>
                {allTiers.map(tierItem => (
                  <td key={tierItem.id} className="py-4 px-6 text-center">
                    {tierItem.order_limit === 2147483647 ? 'Unlimited' : tierItem.order_limit}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-secondary-100">
                <td className="py-4 px-6 font-medium">GMV Limit (Monthly)</td>
                {allTiers.map(tierItem => (
                  <td key={tierItem.id} className="py-4 px-6 text-center">
                    {tierItem.gmv_limit === 2147483647 
                      ? 'Unlimited' 
                      : `${tierItem.gmv_limit.toLocaleString()} SAR`}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-secondary-100">
                <td className="py-4 px-6 font-medium">Branch Limit</td>
                {allTiers.map(tierItem => (
                  <td key={tierItem.id} className="py-4 px-6 text-center">
                    {tierItem.branch_limit === 2147483647 ? 'Unlimited' : tierItem.branch_limit}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-secondary-100">
                <td className="py-4 px-6 font-medium">User Limit</td>
                {allTiers.map(tierItem => (
                  <td key={tierItem.id} className="py-4 px-6 text-center">
                    {tierItem.user_limit === 2147483647 ? 'Unlimited' : tierItem.user_limit}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-secondary-100">
                <td className="py-4 px-6 font-medium">Geographic Access</td>
                {allTiers.map(tierItem => (
                  <td key={tierItem.id} className="py-4 px-6 text-center">
                    {tierItem.countries_access}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-secondary-100">
                <td className="py-4 px-6 font-medium">Commission Rate</td>
                {allTiers.map(tierItem => (
                  <td key={tierItem.id} className="py-4 px-6 text-center">
                    {tierItem.commission_rate}%
                  </td>
                ))}
              </tr>
              <tr className="border-b border-secondary-100">
                <td className="py-4 px-6 font-medium">Support Level</td>
                {allTiers.map(tierItem => (
                  <td key={tierItem.id} className="py-4 px-6 text-center">
                    {tierItem.support_level}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-secondary-100">
                <td className="py-4 px-6 font-medium">API Access</td>
                {allTiers.map(tierItem => (
                  <td key={tierItem.id} className="py-4 px-6 text-center">
                    {tierItem.api_access}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Add-ons */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <h2 className="text-lg font-semibold text-secondary-900 mb-6">Available Add-ons</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-secondary-200 rounded-xl p-6 hover:border-primary-200 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-primary-50 text-primary-600 rounded-lg">
                <Building2 className="h-6 w-6" />
              </div>
              <div className="text-lg font-bold text-primary-600">
                {plan.name === 'Premium' ? '100' : plan.name === 'Advanced' ? '150' : '200'} SAR
                <span className="text-sm font-normal text-secondary-600">/branch/month</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Extra Branch</h3>
            <p className="text-secondary-600 mb-4">Add additional branches beyond your plan's limit</p>
            <button className="w-full py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              Add Branch
            </button>
          </div>
          
          <div className="border border-secondary-200 rounded-xl p-6 hover:border-primary-200 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-primary-50 text-primary-600 rounded-lg">
                <Users className="h-6 w-6" />
              </div>
              <div className="text-lg font-bold text-primary-600">
                100 SAR
                <span className="text-sm font-normal text-secondary-600">/user/month</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Additional Users</h3>
            <p className="text-secondary-600 mb-4">Add more users to your account beyond your plan's limit</p>
            <button className="w-full py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              Add Users
            </button>
          </div>
          
          <div className="border border-secondary-200 rounded-xl p-6 hover:border-primary-200 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-primary-50 text-primary-600 rounded-lg">
                <Globe className="h-6 w-6" />
              </div>
              <div className="text-lg font-bold text-primary-600">
                250 SAR
                <span className="text-sm font-normal text-secondary-600">/country/month</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Extra Countries</h3>
            <p className="text-secondary-600 mb-4">Expand your reach with additional country access</p>
            <button className="w-full py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              Add Country
            </button>
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Confirm Plan Upgrade</h2>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="p-2 hover:bg-secondary-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <p className="text-secondary-700">
                You are about to upgrade to the <span className="font-medium">{
                  allPlans.find(p => p.id === selectedPlan)?.name
                }</span> plan.
              </p>
              
              <div className="bg-secondary-50 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-secondary-600">New Plan Price</span>
                  <span className="font-medium">
                    {billingCycle === 'monthly' 
                      ? `${allPlans.find(p => p.id === selectedPlan)?.monthly_price.toLocaleString()} SAR/month` 
                      : `${allPlans.find(p => p.id === selectedPlan)?.yearly_price.toLocaleString()} SAR/year`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600">Billing Cycle</span>
                  <span className="font-medium">{billingCycle === 'monthly' ? 'Monthly' : 'Yearly'}</span>
                </div>
              </div>
              
              <div className="flex items-start space-x-2 text-secondary-600">
                <Info className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm">
                  Your subscription will be upgraded immediately. You will be charged the prorated amount for the remainder of your current billing cycle.
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="px-4 py-2 text-secondary-700 hover:bg-secondary-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={confirmUpgrade}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Confirm Upgrade
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Payment Information</h2>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="p-2 hover:bg-secondary-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="1234 5678 9012 3456"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="MM/YY"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    CVC
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="123"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="John Smith"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2 text-secondary-700 hover:bg-secondary-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={completePayment}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Complete Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionManagement;