import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Users, Package, Calendar, Clock, DollarSign, CreditCard, FileText, Plus, Trash2, Edit, RefreshCw, Search, Filter, Download, BarChart2, TrendingUp, TrendingDown, Settings, X, Save, CheckCircle, AlertCircle, XCircle, Eye, EyeOff, Bell, BellOff, Upload, ArrowUpRight, ArrowDownRight, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, MoreVertical, MoreHorizontal, Menu, ExternalLink, Copy, Clipboard, ClipboardCheck, ClipboardCopy, Play, Pause, RotateCw, Activity, PieChart, BarChart, LineChart, Repeat, ArrowRight, User, Building2, Mail, Phone, MapPin, Tag, Percent, Wallet, CreditCard as CreditCardIcon, Truck, ShoppingCart, ShoppingBag, Gift, Star, Heart, ThumbsUp, ThumbsDown, MessageSquare, HelpCircle, Info, Lock, Unlock, Shield, Key, Smartphone, Tablet, Laptop, Monitor, Wifi, Bluetooth, Battery, Compass, Map, Navigation, Anchor, Globe, Cloud, Server, Database, HardDrive, Cpu, Layers, Sliders, Gauge, Thermometer, Droplet, Wind, Sun, Moon, CloudRain, CloudSnow, CloudLightning, CloudDrizzle, Sunset, Sunrise, Umbrella, Briefcase, Award, PenTool as Tool, Wrench, Hammer, FileImage, FileText as FileTextIcon, FilePlus, FileMinus, FileCheck, FileX } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  BarChart as ReBarChart,
  Bar,
  LineChart as ReLineChart,
  Line,
} from 'recharts';

interface Subscription {
  id: string;
  name: string;
  customer: {
    id: string;
    name: string;
    type: 'individual' | 'business';
    email: string;
    phone: string;
  };
  plan: {
    id: string;
    name: string;
    price: number;
    billingCycle: 'monthly' | 'quarterly' | 'yearly';
    features: string[];
  };
  status: 'active' | 'pending' | 'cancelled' | 'expired';
  startDate: string;
  endDate: string;
  renewalDate: string;
  paymentMethod: {
    type: 'credit_card' | 'bank_transfer' | 'digital_wallet';
    details: string;
  };
  usage: {
    current: number;
    limit: number;
    unit: string;
  };
  billingHistory: {
    id: string;
    date: string;
    amount: number;
    status: 'paid' | 'pending' | 'failed';
    invoice?: string;
  }[];
}

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  billingCycle: 'monthly' | 'quarterly' | 'yearly';
  features: string[];
  limits: {
    usage: number;
    unit: string;
  };
  isPopular?: boolean;
}

const mockSubscriptions: Subscription[] = [
  {
    id: 'sub-001',
    name: 'Enterprise Energy Plan',
    customer: {
      id: 'cust-001',
      name: 'Acme Industries',
      type: 'business',
      email: 'billing@acme.com',
      phone: '+966-123-456-789',
    },
    plan: {
      id: 'plan-003',
      name: 'Enterprise',
      price: 999,
      billingCycle: 'monthly',
      features: [
        'Unlimited energy monitoring',
        'Advanced analytics',
        'Priority support',
        'Custom reporting',
        'API access',
      ],
    },
    status: 'active',
    startDate: '2023-12-01',
    endDate: '2024-12-01',
    renewalDate: '2024-12-01',
    paymentMethod: {
      type: 'bank_transfer',
      details: 'Saudi National Bank ****1234',
    },
    usage: {
      current: 8500,
      limit: 10000,
      unit: 'kWh',
    },
    billingHistory: [
      {
        id: 'bill-001',
        date: '2024-03-01',
        amount: 999,
        status: 'paid',
        invoice: 'INV-2024-001',
      },
      {
        id: 'bill-002',
        date: '2024-02-01',
        amount: 999,
        status: 'paid',
        invoice: 'INV-2024-002',
      },
      {
        id: 'bill-003',
        date: '2024-01-01',
        amount: 999,
        status: 'paid',
        invoice: 'INV-2024-003',
      },
    ],
  },
  {
    id: 'sub-002',
    name: 'Standard Energy Plan',
    customer: {
      id: 'cust-002',
      name: 'Green Solutions LLC',
      type: 'business',
      email: 'accounts@greensolutions.com',
      phone: '+966-123-456-790',
    },
    plan: {
      id: 'plan-002',
      name: 'Standard',
      price: 499,
      billingCycle: 'monthly',
      features: [
        'Up to 5,000 kWh monitoring',
        'Basic analytics',
        'Email support',
        'Standard reporting',
      ],
    },
    status: 'active',
    startDate: '2024-01-15',
    endDate: '2025-01-15',
    renewalDate: '2025-01-15',
    paymentMethod: {
      type: 'credit_card',
      details: 'Visa ****5678',
    },
    usage: {
      current: 3200,
      limit: 5000,
      unit: 'kWh',
    },
    billingHistory: [
      {
        id: 'bill-004',
        date: '2024-03-15',
        amount: 499,
        status: 'paid',
        invoice: 'INV-2024-004',
      },
      {
        id: 'bill-005',
        date: '2024-02-15',
        amount: 499,
        status: 'paid',
        invoice: 'INV-2024-005',
      },
    ],
  },
  {
    id: 'sub-003',
    name: 'Basic Energy Plan',
    customer: {
      id: 'cust-003',
      name: 'John Smith',
      type: 'individual',
      email: 'john.smith@example.com',
      phone: '+966-123-456-791',
    },
    plan: {
      id: 'plan-001',
      name: 'Basic',
      price: 199,
      billingCycle: 'monthly',
      features: [
        'Up to 1,000 kWh monitoring',
        'Basic reporting',
        'Email support',
      ],
    },
    status: 'pending',
    startDate: '2024-04-01',
    endDate: '2025-04-01',
    renewalDate: '2025-04-01',
    paymentMethod: {
      type: 'digital_wallet',
      details: 'Apple Pay',
    },
    usage: {
      current: 0,
      limit: 1000,
      unit: 'kWh',
    },
    billingHistory: [],
  },
];

const mockPlans: Plan[] = [
  {
    id: 'plan-001',
    name: 'Basic',
    description: 'For small residential energy needs',
    price: 199,
    billingCycle: 'monthly',
    features: [
      'Up to 1,000 kWh monitoring',
      'Basic reporting',
      'Email support',
      'Mobile app access',
    ],
    limits: {
      usage: 1000,
      unit: 'kWh',
    },
  },
  {
    id: 'plan-002',
    name: 'Standard',
    description: 'For medium-sized businesses',
    price: 499,
    billingCycle: 'monthly',
    features: [
      'Up to 5,000 kWh monitoring',
      'Basic analytics',
      'Email support',
      'Standard reporting',
      'API access (limited)',
      'Mobile app access',
    ],
    limits: {
      usage: 5000,
      unit: 'kWh',
    },
    isPopular: true,
  },
  {
    id: 'plan-003',
    name: 'Enterprise',
    description: 'For large industrial customers',
    price: 999,
    billingCycle: 'monthly',
    features: [
      'Unlimited energy monitoring',
      'Advanced analytics',
      'Priority support',
      'Custom reporting',
      'Full API access',
      'Mobile app access',
      'Dedicated account manager',
      'Custom integrations',
    ],
    limits: {
      usage: 10000,
      unit: 'kWh',
    },
  },
];

const EaaSSubscription = () => {
  const [activeTab, setActiveTab] = useState<'subscriptions' | 'plans' | 'analytics' | 'settings'>('subscriptions');
  const [selectedSubscription, setSelectedSubscription] = useState<string | null>(null);
  const [isAddingSubscription, setIsAddingSubscription] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPlan, setFilterPlan] = useState<string>('all');
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(mockSubscriptions);
  const [plans, setPlans] = useState<Plan[]>(mockPlans);
  const [activeSubscriptionTab, setActiveSubscriptionTab] = useState<'overview' | 'billing' | 'usage' | 'settings'>('overview');
  const [newSubscriptionData, setNewSubscriptionData] = useState({
    name: '',
    customerId: '',
    planId: '',
    paymentMethod: 'credit_card',
    startDate: new Date().toISOString().split('T')[0],
  });
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const getStatusColor = (status: Subscription['status'] | Subscription['billingHistory'][0]['status']) => {
    switch (status) {
      case 'active':
      case 'paid':
        return 'text-green-600 bg-green-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'cancelled':
      case 'failed':
        return 'text-red-600 bg-red-50';
      case 'expired':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: Subscription['status'] | Subscription['billingHistory'][0]['status']) => {
    switch (status) {
      case 'active':
      case 'paid':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'cancelled':
      case 'failed':
        return <XCircle className="h-4 w-4" />;
      case 'expired':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getPaymentMethodIcon = (type: Subscription['paymentMethod']['type']) => {
    switch (type) {
      case 'credit_card':
        return <CreditCard className="h-5 w-5" />;
      case 'bank_transfer':
        return <Building2 className="h-5 w-5" />;
      case 'digital_wallet':
        return <Smartphone className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  const filteredSubscriptions = subscriptions.filter(subscription => {
    if (filterStatus !== 'all' && subscription.status !== filterStatus) {
      return false;
    }
    if (filterPlan !== 'all' && subscription.plan.id !== filterPlan) {
      return false;
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        subscription.name.toLowerCase().includes(query) ||
        subscription.customer.name.toLowerCase().includes(query) ||
        subscription.customer.email.toLowerCase().includes(query) ||
        subscription.plan.name.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const selectedSubscriptionData = selectedSubscription ? subscriptions.find(s => s.id === selectedSubscription) : null;

  const handleAddSubscription = () => {
    // Validate form
    if (!newSubscriptionData.name || !newSubscriptionData.customerId || !newSubscriptionData.planId) {
      alert('Please fill in all required fields');
      return;
    }

    // Get customer and plan data
    const customer = {
      id: newSubscriptionData.customerId,
      name: 'New Customer',
      type: 'business' as const,
      email: 'customer@example.com',
      phone: '+966-123-456-000',
    };

    const plan = plans.find(p => p.id === newSubscriptionData.planId);
    if (!plan) {
      alert('Invalid plan selected');
      return;
    }

    // Create new subscription
    const newSubscription: Subscription = {
      id: `sub-${Date.now()}`,
      name: newSubscriptionData.name,
      customer,
      plan: {
        id: plan.id,
        name: plan.name,
        price: plan.price,
        billingCycle: plan.billingCycle,
        features: plan.features,
      },
      status: 'pending',
      startDate: newSubscriptionData.startDate,
      endDate: new Date(new Date(newSubscriptionData.startDate).setFullYear(new Date(newSubscriptionData.startDate).getFullYear() + 1)).toISOString().split('T')[0],
      renewalDate: new Date(new Date(newSubscriptionData.startDate).setFullYear(new Date(newSubscriptionData.startDate).getFullYear() + 1)).toISOString().split('T')[0],
      paymentMethod: {
        type: newSubscriptionData.paymentMethod as Subscription['paymentMethod']['type'],
        details: 'New payment method',
      },
      usage: {
        current: 0,
        limit: plan.limits.usage,
        unit: plan.limits.unit,
      },
      billingHistory: [],
    };

    // Add subscription to list
    setSubscriptions([...subscriptions, newSubscription]);
    
    // Reset form and close modal
    setNewSubscriptionData({
      name: '',
      customerId: '',
      planId: '',
      paymentMethod: 'credit_card',
      startDate: new Date().toISOString().split('T')[0],
    });
    setIsAddingSubscription(false);
  };

  const renderSubscriptions = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold">Energy Subscriptions</h2>
          <span className="px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-sm">
            {subscriptions.length} Subscriptions
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsAddingSubscription(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Subscription</span>
          </button>
          <button
            onClick={handleRefresh}
            className={`p-2 rounded-lg text-secondary-600 hover:bg-secondary-100 ${
              isRefreshing ? 'animate-spin' : ''
            }`}
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search subscriptions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
          <option value="expired">Expired</option>
        </select>
        <select
          value={filterPlan}
          onChange={(e) => setFilterPlan(e.target.value)}
          className="px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
        >
          <option value="all">All Plans</option>
          {plans.map((plan) => (
            <option key={plan.id} value={plan.id}>{plan.name}</option>
          ))}
        </select>
        <button className="p-2 hover:bg-secondary-100 rounded-lg text-secondary-600">
          <Filter className="h-5 w-5" />
        </button>
      </div>

      {/* Subscriptions List */}
      <div className="space-y-4">
        {filteredSubscriptions.map((subscription) => (
          <motion.div
            key={subscription.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-xl border-2 transition-all cursor-pointer ${
              selectedSubscription === subscription.id
                ? 'border-primary-500 bg-primary-50'
                : 'border-secondary-200 hover:border-primary-200'
            }`}
            onClick={() => setSelectedSubscription(subscription.id === selectedSubscription ? null : subscription.id)}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">{subscription.name}</h3>
                <div className="flex items-center space-x-4 text-sm text-secondary-600">
                  <div className="flex items-center space-x-1">
                    <Building2 className="h-4 w-4" />
                    <span>{subscription.customer.name}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Tag className="h-4 w-4" />
                    <span>{subscription.plan.name} Plan</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Renewal: {subscription.renewalDate}</span>
                  </div>
                </div>
              </div>
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusColor(subscription.status)}`}>
                {getStatusIcon(subscription.status)}
                <span className="capitalize">{subscription.status}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-secondary-200">
                <span className="text-secondary-600">Monthly Price</span>
                <span className="font-medium">${subscription.plan.price}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-secondary-200">
                <span className="text-secondary-600">Billing Cycle</span>
                <span className="font-medium capitalize">{subscription.plan.billingCycle}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-secondary-200">
                <span className="text-secondary-600">Payment Method</span>
                <div className="flex items-center space-x-2">
                  {getPaymentMethodIcon(subscription.paymentMethod.type)}
                  <span className="capitalize">{subscription.paymentMethod.type.replace('_', ' ')}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white rounded-lg border border-secondary-200 mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-secondary-600" />
                  <span className="font-medium">Energy Usage</span>
                </div>
                <span className="text-sm text-secondary-600">
                  {subscription.usage.current} / {subscription.usage.limit} {subscription.usage.unit}
                </span>
              </div>
              <div className="w-full bg-secondary-200 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full ${
                    (subscription.usage.current / subscription.usage.limit) > 0.9 ? 'bg-red-500' :
                    (subscription.usage.current / subscription.usage.limit) > 0.7 ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}
                  style={{ width: `${(subscription.usage.current / subscription.usage.limit) * 100}%` }}
                />
              </div>
            </div>

            {selectedSubscription === subscription.id && (
              <div className="mt-4 pt-4 border-t border-secondary-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Mail className="h-4 w-4 text-secondary-600" />
                      <span className="text-sm text-secondary-600">{subscription.customer.email}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Phone className="h-4 w-4 text-secondary-600" />
                      <span className="text-sm text-secondary-600">{subscription.customer.phone}</span>
                    </div>
                  </div>
                  <div className="space-x-2">
                    <button className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg">
                      <Settings className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg">
                      <Edit className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Add Subscription Modal */}
      {isAddingSubscription && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Add New Subscription</h3>
              <button
                onClick={() => setIsAddingSubscription(false)}
                className="p-2 hover:bg-secondary-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Subscription Name *
                </label>
                <input
                  type="text"
                  value={newSubscriptionData.name}
                  onChange={(e) => setNewSubscriptionData({ ...newSubscriptionData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter subscription name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Customer *
                </label>
                <select
                  value={newSubscriptionData.customerId}
                  onChange={(e) => setNewSubscriptionData({ ...newSubscriptionData, customerId: e.target.value })}
                  className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                >
                  <option value="">Select customer</option>
                  <option value="cust-001">Acme Industries</option>
                  <option value="cust-002">Green Solutions LLC</option>
                  <option value="cust-003">John Smith</option>
                  <option value="cust-004">Add New Customer...</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Plan *
                </label>
                <select
                  value={newSubscriptionData.planId}
                  onChange={(e) => setNewSubscriptionData({ ...newSubscriptionData, planId: e.target.value })}
                  className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                >
                  <option value="">Select plan</option>
                  {plans.map((plan) => (
                    <option key={plan.id} value={plan.id}>{plan.name} (${plan.price}/{plan.billingCycle.charAt(0)})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Payment Method *
                </label>
                <select
                  value={newSubscriptionData.paymentMethod}
                  onChange={(e) => setNewSubscriptionData({ ...newSubscriptionData, paymentMethod: e.target.value })}
                  className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                >
                  <option value="credit_card">Credit Card</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="digital_wallet">Digital Wallet</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={newSubscriptionData.startDate}
                  onChange={(e) => setNewSubscriptionData({ ...newSubscriptionData, startDate: e.target.value })}
                  className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsAddingSubscription(false)}
                className="px-4 py-2 text-secondary-700 hover:bg-secondary-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSubscription}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Add Subscription
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subscription Details */}
      {selectedSubscriptionData && (
        <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">{selectedSubscriptionData.name}</h2>
              <div className="flex items-center space-x-4 text-sm text-secondary-600">
                <div className="flex items-center space-x-1">
                  <Building2 className="h-4 w-4" />
                  <span>{selectedSubscriptionData.customer.name}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Tag className="h-4 w-4" />
                  <span>{selectedSubscriptionData.plan.name} Plan</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Started: {selectedSubscriptionData.startDate}</span>
                </div>
              </div>
            </div>
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusColor(selectedSubscriptionData.status)}`}>
              {getStatusIcon(selectedSubscriptionData.status)}
              <span className="capitalize">{selectedSubscriptionData.status}</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-secondary-100 mb-6">
            <div className="flex space-x-6">
              <button
                onClick={() => setActiveSubscriptionTab('overview')}
                className={`px-4 py-2 ${
                  activeSubscriptionTab === 'overview'
                    ? 'border-b-2 border-primary-500 text-primary-600 font-medium'
                    : 'text-secondary-600 hover:text-secondary-900'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveSubscriptionTab('billing')}
                className={`px-4 py-2 ${
                  activeSubscriptionTab === 'billing'
                    ? 'border-b-2 border-primary-500 text-primary-600 font-medium'
                    : 'text-secondary-600 hover:text-secondary-900'
                }`}
              >
                Billing History
              </button>
              <button
                onClick={() => setActiveSubscriptionTab('usage')}
                className={`px-4 py-2 ${
                  activeSubscriptionTab === 'usage'
                    ? 'border-b-2 border-primary-500 text-primary-600 font-medium'
                    : 'text-secondary-600 hover:text-secondary-900'
                }`}
              >
                Usage Analytics
              </button>
              <button
                onClick={() => setActiveSubscriptionTab('settings')}
                className={`px-4 py-2 ${
                  activeSubscriptionTab === 'settings'
                    ? 'border-b-2 border-primary-500 text-primary-600 font-medium'
                    : 'text-secondary-600 hover:text-secondary-900'
                }`}
              >
                Settings
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeSubscriptionTab === 'overview' && (
            <div className="grid grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="col-span-1 space-y-6">
                {/* Customer Info */}
                <div className="p-6 bg-secondary-50 rounded-xl border border-secondary-200">
                  <h3 className="font-semibold mb-4">Customer Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                        {selectedSubscriptionData.customer.type === 'business' ? (
                          <Building2 className="h-6 w-6 text-primary-600" />
                        ) : (
                          <User className="h-6 w-6 text-primary-600" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium">{selectedSubscriptionData.customer.name}</h4>
                        <div className="text-sm text-secondary-600 capitalize">
                          {selectedSubscriptionData.customer.type}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-5 w-5 text-secondary-600" />
                      <span>{selectedSubscriptionData.customer.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-5 w-5 text-secondary-600" />
                      <span>{selectedSubscriptionData.customer.phone}</span>
                    </div>
                    <button className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                      Contact Customer
                    </button>
                  </div>
                </div>

                {/* Plan Details */}
                <div className="p-6 bg-secondary-50 rounded-xl border border-secondary-200">
                  <h3 className="font-semibold mb-4">Plan Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-secondary-600">Plan</span>
                      <span className="font-medium">{selectedSubscriptionData.plan.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-600">Price</span>
                      <span className="font-medium">${selectedSubscriptionData.plan.price}/{selectedSubscriptionData.plan.billingCycle.charAt(0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-600">Billing Cycle</span>
                      <span className="font-medium capitalize">{selectedSubscriptionData.plan.billingCycle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-600">Start Date</span>
                      <span className="font-medium">{selectedSubscriptionData.startDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-600">End Date</span>
                      <span className="font-medium">{selectedSubscriptionData.endDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-600">Renewal Date</span>
                      <span className="font-medium">{selectedSubscriptionData.renewalDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-600">Payment Method</span>
                      <div className="flex items-center space-x-1">
                        {getPaymentMethodIcon(selectedSubscriptionData.paymentMethod.type)}
                        <span className="capitalize">{selectedSubscriptionData.paymentMethod.type.replace('_', ' ')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="p-6 bg-secondary-50 rounded-xl border border-secondary-200">
                  <h3 className="font-semibold mb-4">Plan Features</h3>
                  <ul className="space-y-2">
                    {selectedSubscriptionData.plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right Column */}
              <div className="col-span-2 space-y-6">
                {/* Usage Overview */}
                <div className="p-6 bg-secondary-50 rounded-xl border border-secondary-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Energy Usage</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-secondary-600">
                        {selectedSubscriptionData.usage.current} / {selectedSubscriptionData.usage.limit} {selectedSubscriptionData.usage.unit}
                      </span>
                      <span className="text-sm text-green-600">
                        {Math.round((selectedSubscriptionData.usage.current / selectedSubscriptionData.usage.limit) * 100)}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-secondary-200 rounded-full h-2.5 mb-6">
                    <div
                      className={`h-2.5 rounded-full ${
                        (selectedSubscriptionData.usage.current / selectedSubscriptionData.usage.limit) > 0.9 ? 'bg-red-500' :
                        (selectedSubscriptionData.usage.current / selectedSubscriptionData.usage.limit) > 0.7 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${(selectedSubscriptionData.usage.current / selectedSubscriptionData.usage.limit) * 100}%` }}
                    />
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={[
                          { date: '2024-03-01', usage: 2200 },
                          { date: '2024-03-05', usage: 3500 },
                          { date: '2024-03-10', usage: 5000 },
                          { date: '2024-03-15', usage: 6800 },
                          { date: '2024-03-20', usage: 8500 },
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                        <XAxis dataKey="date" stroke="#64748B" />
                        <YAxis stroke="#64748B" />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="usage"
                          stroke="#0EA5E9"
                          fill="#0EA5E9"
                          fillOpacity={0.1}
                          name={`Usage (${selectedSubscriptionData.usage.unit})`}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Recent Billing */}
                <div className="p-6 bg-secondary-50 rounded-xl border border-secondary-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Recent Billing</h3>
                    <button
                      onClick={() => setActiveSubscriptionTab('billing')}
                      className="text-primary-600 hover:text-primary-700 text-sm"
                    >
                      View All
                    </button>
                  </div>
                  <div className="space-y-4">
                    {selectedSubscriptionData.billingHistory.slice(0, 3).map((bill) => (
                      <div key={bill.id} className="p-4 bg-white rounded-lg border border-secondary-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-5 w-5 text-secondary-600" />
                            <span className="font-medium">{bill.invoice}</span>
                          </div>
                          <div className={`flex items-center space-x-2 px-2 py-1 rounded-full text-xs ${getStatusColor(bill.status)}`}>
                            {getStatusIcon(bill.status)}
                            <span className="capitalize">{bill.status}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-secondary-600">{bill.date}</span>
                          <span className="font-medium">${bill.amount}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="p-6 bg-secondary-50 rounded-xl border border-secondary-200">
                  <h3 className="font-semibold mb-4">Subscription Management</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button className="p-4 bg-white rounded-lg border border-secondary-200 text-left hover:border-primary-200 transition-all">
                      <div className="flex items-center space-x-2 mb-2">
                        <Edit className="h-5 w-5 text-primary-600" />
                        <span className="font-medium">Change Plan</span>
                      </div>
                      <p className="text-sm text-secondary-600">Upgrade or downgrade the subscription plan</p>
                    </button>
                    <button className="p-4 bg-white rounded-lg border border-secondary-200 text-left hover:border-primary-200 transition-all">
                      <div className="flex items-center space-x-2 mb-2">
                        <CreditCard className="h-5 w-5 text-primary-600" />
                        <span className="font-medium">Update Payment</span>
                      </div>
                      <p className="text-sm text-secondary-600">Change payment method or details</p>
                    </button>
                    <button className="p-4 bg-white rounded-lg border border-secondary-200 text-left hover:border-primary-200 transition-all">
                      <div className="flex items-center space-x-2 mb-2">
                        <Calendar className="h-5 w-5 text-primary-600" />
                        <span className="font-medium">Renew Subscription</span>
                      </div>
                      <p className="text-sm text-secondary-600">Extend the subscription period</p>
                    </button>
                    <button className="p-4 bg-white rounded-lg border border-red-200 text-left hover:bg-red-50 transition-all">
                      <div className="flex items-center space-x-2 mb-2">
                        <XCircle className="h-5 w-5 text-red-600" />
                        <span className="font-medium text-red-600">Cancel Subscription</span>
                      </div>
                      <p className="text-sm text-red-600">End the subscription</p>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSubscriptionTab === 'billing' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Billing History</h3>
                <button className="px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors flex items-center space-x-2">
                  <Download className="h-5 w-5" />
                  <span>Export</span>
                </button>
              </div>

              {selectedSubscriptionData.billingHistory.length === 0 ? (
                <div className="p-8 bg-secondary-50 rounded-xl border border-secondary-200 text-center">
                  <FileText className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-secondary-900 mb-2">No Billing History</h4>
                  <p className="text-secondary-600">
                    This subscription has no billing history yet
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-sm text-secondary-600 border-b border-secondary-100">
                        <th className="pb-3 font-medium">Invoice</th>
                        <th className="pb-3 font-medium">Date</th>
                        <th className="pb-3 font-medium">Amount</th>
                        <th className="pb-3 font-medium">Status</th>
                        <th className="pb-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedSubscriptionData.billingHistory.map((bill) => (
                        <tr key={bill.id} className="border-b border-secondary-100">
                          <td className="py-4 font-medium">{bill.invoice}</td>
                          <td className="py-4">{bill.date}</td>
                          <td className="py-4">${bill.amount}</td>
                          <td className="py-4">
                            <div className={`inline-flex items-center space-x-2 px-2 py-1 rounded-full text-xs ${getStatusColor(bill.status)}`}>
                              {getStatusIcon(bill.status)}
                              <span className="capitalize">{bill.status}</span>
                            </div>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center space-x-2">
                              <button className="p-1 hover:bg-secondary-100 rounded text-secondary-600">
                                <Eye className="h-4 w-4" />
                              </button>
                              <button className="p-1 hover:bg-secondary-100 rounded text-secondary-600">
                                <Download className="h-4 w-4" />
                              </button>
                              <button className="p-1 hover:bg-secondary-100 rounded text-secondary-600">
                                <MoreVertical className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeSubscriptionTab === 'usage' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Usage Analytics</h3>
                <div className="flex items-center space-x-3">
                  <select className="px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none">
                    <option value="7">Last 7 Days</option>
                    <option value="30">Last 30 Days</option>
                    <option value="90">Last 90 Days</option>
                    <option value="365">Last Year</option>
                  </select>
                  <button className="px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors flex items-center space-x-2">
                    <Download className="h-5 w-5" />
                    <span>Export</span>
                  </button>
                </div>
              </div>

              {/* Usage Chart */}
              <div className="p-6 bg-white rounded-xl shadow-sm border border-secondary-100">
                <h4 className="font-semibold mb-4">Energy Consumption</h4>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={[
                        { date: '2024-03-01', usage: 2200 },
                        { date: '2024-03-05', usage: 3500 },
                        { date: '2024-03-10', usage: 5000 },
                        { date: '2024-03-15', usage: 6800 },
                        { date: '2024-03-20', usage: 8500 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis dataKey="date" stroke="#64748B" />
                      <YAxis stroke="#64748B" />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="usage"
                        stroke="#0EA5E9"
                        fill="#0EA5E9"
                        fillOpacity={0.1}
                        name={`Usage (${selectedSubscriptionData.usage.unit})`}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Usage Breakdown */}
              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 bg-white rounded-xl shadow-sm border border-secondary-100">
                  <h4 className="font-semibold mb-4">Usage by Time of Day</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { time: '00:00', usage: 120 },
                          { time: '04:00', usage: 80 },
                          { time: '08:00', usage: 200 },
                          { time: '12:00', usage: 350 },
                          { time: '16:00', usage: 290 },
                          { time: '20:00', usage: 220 },
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                        <XAxis dataKey="time" stroke="#64748B" />
                        <YAxis stroke="#64748B" />
                        <Tooltip />
                        <Bar dataKey="usage" fill="#0EA5E9" name={`Usage (${selectedSubscriptionData.usage.unit})`} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="p-6 bg-white rounded-xl shadow-sm border border-secondary-100">
                  <h4 className="font-semibold mb-4">Usage by Day of Week</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { day: 'Mon', usage: 1200 },
                          { day: 'Tue', usage: 1350 },
                          { day: 'Wed', usage: 1400 },
                          { day: 'Thu', usage: 1250 },
                          { day: 'Fri', usage: 900 },
                          { day: 'Sat', usage: 800 },
                          { day: 'Sun', usage: 750 },
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                        <XAxis dataKey="day" stroke="#64748B" />
                        <YAxis stroke="#64748B" />
                        <Tooltip />
                        <Bar dataKey="usage" fill="#6366F1" name={`Usage (${selectedSubscriptionData.usage.unit})`} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Usage Metrics */}
              <div className="grid grid-cols-3 gap-6">
                <div className="p-6 bg-white rounded-xl shadow-sm border border-secondary-100">
                  <div className="flex items-center justify-between mb-2">
                    <Zap className="h-6 w-6 text-blue-600" />
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-secondary-900">8,500</h3>
                  <p className="text-secondary-600">Total Usage (kWh)</p>
                </div>
                <div className="p-6 bg-white rounded-xl shadow-sm border border-secondary-100">
                  <div className="flex items-center justify-between mb-2">
                    <Activity className="h-6 w-6 text-purple-600" />
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-secondary-900">283</h3>
                  <p className="text-secondary-600">Daily Average (kWh)</p>
                </div>
                <div className="p-6 bg-white rounded-xl shadow-sm border border-secondary-100">
                  <div className="flex items-center justify-between mb-2">
                    <Percent className="h-6 w-6 text-green-600" />
                    <TrendingDown className="h-5 w-5 text-red-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-secondary-900">85%</h3>
                  <p className="text-secondary-600">Usage of Limit</p>
                </div>
              </div>
            </div>
          )}

          {activeSubscriptionTab === 'settings' && (
            <div className="space-y-6">
              <div className="p-6 bg-white rounded-xl shadow-sm border border-secondary-100">
                <h3 className="font-semibold mb-6">Subscription Settings</h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-1">
                        Subscription Name
                      </label>
                      <input
                        type="text"
                        defaultValue={selectedSubscriptionData.name}
                        className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-1">
                        Status
                      </label>
                      <select
                        defaultValue={selectedSubscriptionData.status}
                        className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="expired">Expired</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Renewal Date
                    </label>
                    <input
                      type="date"
                      defaultValue={selectedSubscriptionData.renewalDate}
                      className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Auto-Renewal
                    </label>
                    <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg border border-secondary-200">
                      <div>
                        <h4 className="font-medium">Enable Auto-Renewal</h4>
                        <p className="text-sm text-secondary-600">Automatically renew subscription when it expires</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Usage Alerts
                    </label>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg border border-secondary-200">
                        <div>
                          <h4 className="font-medium">Usage Threshold Alerts</h4>
                          <p className="text-sm text-secondary-600">Get notified when usage reaches 80% of limit</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg border border-secondary-200">
                        <div>
                          <h4 className="font-medium">Unusual Usage Alerts</h4>
                          <p className="text-sm text-secondary-600">Get notified of unusual usage patterns</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white rounded-xl shadow-sm border border-secondary-100">
                <h3 className="font-semibold mb-6">Payment Settings</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Payment Method
                    </label>
                    <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg border border-secondary-200">
                      <div className="flex items-center space-x-3">
                        {getPaymentMethodIcon(selectedSubscriptionData.paymentMethod.type)}
                        <div>
                          <h4 className="font-medium capitalize">{selectedSubscriptionData.paymentMethod.type.replace('_', ' ')}</h4>
                          <p className="text-sm text-secondary-600">{selectedSubscriptionData.paymentMethod.details}</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                        Update
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Billing Address
                    </label>
                    <div className="p-4 bg-secondary-50 rounded-lg border border-secondary-200">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Company Headquarters</h4>
                        <button className="text-primary-600 hover:text-primary-700">
                          Edit
                        </button>
                      </div>
                      <p className="text-secondary-600">
                        123 Business District, Building 5<br />
                        Riyadh, Saudi Arabia
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white rounded-xl shadow-sm border border-secondary-100">
                <h3 className="font-semibold mb-6">Danger Zone</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-red-700">Cancel Subscription</h4>
                        <p className="text-sm text-red-600">This will cancel the subscription immediately</p>
                      </div>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderPlans = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Subscription Plans</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-secondary-100 rounded-lg p-1">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-lg ${
                billingCycle === 'monthly'
                  ? 'bg-white shadow-sm'
                  : 'text-secondary-600'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2 rounded-lg ${
                billingCycle === 'yearly'
                  ? 'bg-white shadow-sm'
                  : 'text-secondary-600'
              }`}
            >
              Yearly
              <span className="ml-1 text-xs text-green-600">Save 20%</span>
            </button>
          </div>
          <button className="btn-primary flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Create Plan</span>
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-3 gap-6">
        {plans.map((plan) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative rounded-xl border ${
              plan.isPopular ? 'border-primary-500 shadow-lg' : 'border-secondary-200'
            }`}
          >
            {plan.isPopular && (
              <div className="absolute top-0 left-0 right-0 bg-primary-500 text-white text-center py-1 text-sm font-medium rounded-t-xl">
                Most Popular
              </div>
            )}
            <div className={`p-6 ${plan.isPopular ? 'pt-10' : ''}`}>
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <p className="text-secondary-600 mb-4">{plan.description}</p>
              <div className="mb-6">
                <div className="text-3xl font-bold text-primary-600">
                  ${billingCycle === 'yearly' ? Math.round(plan.price * 12 * 0.8) / 12 : plan.price}
                  <span className="text-base font-normal text-secondary-600">/{plan.billingCycle.charAt(0)}</span>
                </div>
                {billingCycle === 'yearly' && (
                  <div className="text-sm text-green-600 mt-1">
                    ${Math.round(plan.price * 12 * 0.8)} billed yearly
                  </div>
                )}
              </div>
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-secondary-600">Usage Limit</span>
                  <span className="font-medium">
                    {plan.limits.usage === 10000 && plan.id === 'plan-003' ? 'Unlimited' : plan.limits.usage} {plan.limits.unit}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-secondary-600">Billing Cycle</span>
                  <span className="font-medium capitalize">{plan.billingCycle}</span>
                </div>
              </div>
              <div className="space-y-2 mb-6">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <div className="flex space-x-2">
                <button className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                  Select Plan
                </button>
                <button className="px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors">
                  <Edit className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Custom Plan */}
      <div className="p-6 bg-secondary-50 rounded-xl border border-secondary-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold">Need a Custom Plan?</h3>
            <p className="text-secondary-600">We can create a tailored solution for your specific energy needs</p>
          </div>
          <button className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            Contact Sales
          </button>
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div className="p-4 bg-white rounded-lg border border-secondary-200">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="h-5 w-5 text-primary-600" />
              <span className="font-medium">Custom Usage Limits</span>
            </div>
            <p className="text-sm text-secondary-600">
              Set specific energy consumption limits based on your needs
            </p>
          </div>
          <div className="p-4 bg-white rounded-lg border border-secondary-200">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="h-5 w-5 text-primary-600" />
              <span className="font-medium">Multi-location Support</span>
            </div>
            <p className="text-sm text-secondary-600">
              Monitor and manage energy across multiple facilities
            </p>
          </div>
          <div className="p-4 bg-white rounded-lg border border-secondary-200">
            <div className="flex items-center space-x-2 mb-2">
              <Settings className="h-5 w-5 text-primary-600" />
              <span className="font-medium">Custom Integrations</span>
            </div>
            <p className="text-sm text-secondary-600">
              Connect with your existing systems and workflows
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Subscription Analytics</h2>
        <div className="flex items-center space-x-3">
          <select className="px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none">
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
            <option value="180">Last 6 Months</option>
            <option value="365">Last Year</option>
          </select>
          <button className="px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors flex items-center space-x-2">
            <Download className="h-5 w-5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-4 gap-6">
        <div className="p-6 bg-white rounded-xl shadow-sm border border-secondary-100">
          <div className="flex items-center justify-between mb-2">
            <Users className="h-6 w-6 text-blue-600" />
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-secondary-900">3</h3>
          <p className="text-secondary-600">Active Subscriptions</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-sm border border-secondary-100">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="h-6 w-6 text-green-600" />
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-secondary-900">$1,697</h3>
          <p className="text-secondary-600">Monthly Recurring Revenue</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-sm border border-secondary-100">
          <div className="flex items-center justify-between mb-2">
            <Zap className="h-6 w-6 text-purple-600" />
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-secondary-900">11,700</h3>
          <p className="text-secondary-600">Total Energy Usage (kWh)</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-sm border border-secondary-100">
          <div className="flex items-center justify-between mb-2">
            <Repeat className="h-6 w-6 text-yellow-600" />
            <span className="text-2xl font-bold text-yellow-600">100%</span>
          </div>
          <h3 className="text-2xl font-bold text-secondary-900">100%</h3>
          <p className="text-secondary-600">Renewal Rate</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        {/* MRR Chart */}
        <div className="p-6 bg-white rounded-xl shadow-sm border border-secondary-100">
          <h3 className="text-lg font-semibold mb-6">Monthly Recurring Revenue</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={[
                  { month: 'Oct', mrr: 199 },
                  { month: 'Nov', mrr: 199 },
                  { month: 'Dec', mrr: 1198 },
                  { month: 'Jan', mrr: 1198 },
                  { month: 'Feb', mrr: 1697 },
                  { month: 'Mar', mrr: 1697 },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="mrr"
                  stroke="#0EA5E9"
                  fill="#0EA5E9"
                  fillOpacity={0.1}
                  name="MRR ($)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subscriptions by Plan */}
        <div className="p-6 bg-white rounded-xl shadow-sm border border-secondary-100">
          <h3 className="text-lg font-semibold mb-6">Subscriptions by Plan</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={[
                    { name: 'Basic', value: 1, color: '#0EA5E9' },
                    { name: 'Standard', value: 1, color: '#6366F1' },
                    { name: 'Enterprise', value: 1, color: '#8B5CF6' },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {[
                    { name: 'Basic', value: 1, color: '#0EA5E9' },
                    { name: 'Standard', value: 1, color: '#6366F1' },
                    { name: 'Enterprise', value: 1, color: '#8B5CF6' },
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            {[
              { name: 'Basic', value: 1, color: '#0EA5E9' },
              { name: 'Standard', value: 1, color: '#6366F1' },
              { name: 'Enterprise', value: 1, color: '#8B5CF6' },
            ].map((item) => (
              <div key={item.name} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-secondary-600">
                  {item.name} ({item.value})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* More Charts */}
      <div className="grid grid-cols-2 gap-6">
        {/* Energy Usage */}
        <div className="p-6 bg-white rounded-xl shadow-sm border border-secondary-100">
          <h3 className="text-lg font-semibold mb-6">Total Energy Usage</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={[
                  { month: 'Oct', usage: 1200 },
                  { month: 'Nov', usage: 1500 },
                  { month: 'Dec', usage: 2200 },
                  { month: 'Jan', usage: 3500 },
                  { month: 'Feb', usage: 5000 },
                  { month: 'Mar', usage: 8500 },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="usage"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.1}
                  name="Usage (kWh)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Customer Growth */}
        <div className="p-6 bg-white rounded-xl shadow-sm border border-secondary-100">
          <h3 className="text-lg font-semibold mb-6">Subscription Growth</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={[
                  { month: 'Oct', subscriptions: 1 },
                  { month: 'Nov', subscriptions: 1 },
                  { month: 'Dec', subscriptions: 2 },
                  { month: 'Jan', subscriptions: 2 },
                  { month: 'Feb', subscriptions: 3 },
                  { month: 'Mar', subscriptions: 3 },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="subscriptions"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Subscription Performance */}
      <div className="p-6 bg-white rounded-xl shadow-sm border border-secondary-100">
        <h3 className="text-lg font-semibold mb-6">Subscription Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-secondary-600 border-b border-secondary-100">
                <th className="pb-3 font-medium">Subscription</th>
                <th className="pb-3 font-medium">Customer</th>
                <th className="pb-3 font-medium">Plan</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">MRR</th>
                <th className="pb-3 font-medium">Usage</th>
                <th className="pb-3 font-medium">Renewal</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((subscription) => (
                <tr key={subscription.id} className="border-b border-secondary-100">
                  <td className="py-4 font-medium">{subscription.name}</td>
                  <td className="py-4">{subscription.customer.name}</td>
                  <td className="py-4">{subscription.plan.name}</td>
                  <td className="py-4">
                    <div className={`inline-flex items-center space-x-2 px-2 py-1 rounded-full text-xs ${getStatusColor(subscription.status)}`}>
                      {getStatusIcon(subscription.status)}
                      <span className="capitalize">{subscription.status}</span>
                    </div>
                  </td>
                  <td className="py-4">${subscription.plan.price}</td>
                  <td className="py-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-secondary-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            (subscription.usage.current / subscription.usage.limit) > 0.9 ? 'bg-red-500' :
                            (subscription.usage.current / subscription.usage.limit) > 0.7 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${(subscription.usage.current / subscription.usage.limit) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm">
                        {Math.round((subscription.usage.current / subscription.usage.limit) * 100)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-4">{subscription.renewalDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">EaaS Settings</h2>
      
      <div className="p-6 bg-white rounded-xl shadow-sm border border-secondary-100">
        <h3 className="text-lg font-semibold mb-6">General Settings</h3>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Default Billing Cycle
              </label>
              <select
                defaultValue="monthly"
                className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Default Currency
              </label>
              <select
                defaultValue="usd"
                className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="usd">USD ($)</option>
                <option value="sar">SAR (﷼)</option>
                <option value="eur">EUR (€)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Grace Period
            </label>
            <select
              defaultValue="7"
              className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="0">No grace period</option>
              <option value="3">3 days</option>
              <option value="7">7 days</option>
              <option value="14">14 days</option>
              <option value="30">30 days</option>
            </select>
            <p className="text-xs text-secondary-500 mt-1">
              Period after subscription expiration before it's cancelled
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 bg-white rounded-xl shadow-sm border border-secondary-100">
        <h3 className="text-lg font-semibold mb-6">Notification Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg border border-secondary-200">
            <div>
              <h4 className="font-medium">Renewal Reminders</h4>
              <p className="text-sm text-secondary-600">Send reminders before subscription renewal</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg border border-secondary-200">
            <div>
              <h4 className="font-medium">Payment Notifications</h4>
              <p className="text-sm text-secondary-600">Send notifications for successful/failed payments</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg border border-secondary-200">
            <div>
              <h4 className="font-medium">Usage Alerts</h4>
              <p className="text-sm text-secondary-600">Send alerts when usage reaches thresholds</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="p-6 bg-white rounded-xl shadow-sm border border-secondary-100">
        <h3 className="text-lg font-semibold mb-6">Payment Gateway</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg border border-secondary-200">
            <div className="flex items-center space-x-3">
              <CreditCard className="h-6 w-6 text-secondary-600" />
              <div>
                <h4 className="font-medium">Credit Card Processor</h4>
                <p className="text-sm text-secondary-600">Accept credit card payments</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg border border-secondary-200">
            <div className="flex items-center space-x-3">
              <Building2 className="h-6 w-6 text-secondary-600" />
              <div>
                <h4 className="font-medium">Bank Transfer</h4>
                <p className="text-sm text-secondary-600">Accept bank transfer payments</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg border border-secondary-200">
            <div className="flex items-center space-x-3">
              <Smartphone className="h-6 w-6 text-secondary-600" />
              <div>
                <h4 className="font-medium">Digital Wallets</h4>
                <p className="text-sm text-secondary-600">Accept Apple Pay, Google Pay, etc.</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
          Save Settings
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900 mb-2">
              ⚡ Energy-as-a-Service (EaaS)
            </h1>
            <p className="text-secondary-600">
              Manage subscription-based energy services for your customers
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors flex items-center space-x-2">
              <Download className="h-5 w-5" />
              <span>Export Data</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className="px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors flex items-center space-x-2"
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mt-6">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <Users className="h-6 w-6 text-blue-600" />
              <span className="text-2xl font-bold text-blue-700">{subscriptions.length}</span>
            </div>
            <p className="text-sm text-blue-600">Total Subscriptions</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-100">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="h-6 w-6 text-green-600" />
              <span className="text-2xl font-bold text-green-700">$1,697</span>
            </div>
            <p className="text-sm text-green-600">Monthly Revenue</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
            <div className="flex items-center justify-between mb-2">
              <Zap className="h-6 w-6 text-purple-600" />
              <span className="text-2xl font-bold text-purple-700">11,700</span>
            </div>
            <p className="text-sm text-purple-600">Total Energy (kWh)</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="h-6 w-6 text-yellow-600" />
              <span className="text-2xl font-bold text-yellow-700">
                {subscriptions.filter(s => s.status === 'active').length}
              </span>
            </div>
            <p className="text-sm text-yellow-600">Active Subscriptions</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <div className="flex space-x-8 border-b border-secondary-100">
          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`flex items-center space-x-2 pb-4 border-b-2 transition-colors ${
              activeTab === 'subscriptions'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-secondary-500 hover:text-secondary-700'
            }`}
          >
            <Repeat className="h-5 w-5" />
            <span>Subscriptions</span>
          </button>
          <button
            onClick={() => setActiveTab('plans')}
            className={`flex items-center space-x-2 pb-4 border-b-2 transition-colors ${
              activeTab === 'plans'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-secondary-500 hover:text-secondary-700'
            }`}
          >
            <Tag className="h-5 w-5" />
            <span>Plans</span>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center space-x-2 pb-4 border-b-2 transition-colors ${
              activeTab === 'analytics'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-secondary-500 hover:text-secondary-700'
            }`}
          >
            <BarChart2 className="h-5 w-5" />
            <span>Analytics</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center space-x-2 pb-4 border-b-2 transition-colors ${
              activeTab === 'settings'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-secondary-500 hover:text-secondary-700'
            }`}
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        {activeTab === 'subscriptions' && renderSubscriptions()}
        {activeTab === 'plans' && renderPlans()}
        {activeTab === 'analytics' && renderAnalytics()}
        {activeTab === 'settings' && renderSettings()}
      </div>
    </div>
  );
};

export default EaaSSubscription;