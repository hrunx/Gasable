import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Gift,
  TrendingUp,
  Calendar,
  Tag,
  Users,
  Clock,
  Plus,
  Filter,
  Search,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  AlertCircle,
  XCircle,
  Edit,
  Trash2,
  MoreVertical,
  Eye,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface Campaign {
  id: string;
  name: string;
  type: 'flash_sale' | 'coupon' | 'volume_discount' | 'seasonal';
  status: 'active' | 'scheduled' | 'ended' | 'draft';
  startDate: string;
  endDate: string;
  discount: {
    type: 'percentage' | 'fixed';
    value: number;
  };
  target: {
    type: 'product' | 'store' | 'region';
    value: string;
  };
  performance: {
    views: number;
    redemptions: number;
    revenue: number;
    growth: string;
  };
}

const CampaignsOverview = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const campaignStats = [
    {
      title: 'Active Campaigns',
      value: '12',
      trend: '+3',
      icon: <Gift className="h-6 w-6 text-blue-600" />,
      isPositive: true,
    },
    {
      title: 'Total Revenue',
      value: '$45,678',
      trend: '+15.8%',
      icon: <TrendingUp className="h-6 w-6 text-green-600" />,
      isPositive: true,
    },
    {
      title: 'Redemption Rate',
      value: '24.5%',
      trend: '+5.2%',
      icon: <Tag className="h-6 w-6 text-purple-600" />,
      isPositive: true,
    },
    {
      title: 'Avg. Engagement',
      value: '68.2%',
      trend: '+8.4%',
      icon: <Users className="h-6 w-6 text-yellow-600" />,
      isPositive: true,
    },
  ];

  const mockCampaigns: Campaign[] = [
    {
      id: '1',
      name: 'Summer Flash Sale',
      type: 'flash_sale',
      status: 'active',
      startDate: '2024-03-15',
      endDate: '2024-03-20',
      discount: {
        type: 'percentage',
        value: 25,
      },
      target: {
        type: 'store',
        value: 'All Stores',
      },
      performance: {
        views: 2500,
        redemptions: 450,
        revenue: 45000,
        growth: '+15.8%',
      },
    },
    {
      id: '2',
      name: 'Bulk Purchase Discount',
      type: 'volume_discount',
      status: 'scheduled',
      startDate: '2024-03-25',
      endDate: '2024-04-10',
      discount: {
        type: 'percentage',
        value: 15,
      },
      target: {
        type: 'product',
        value: 'Industrial Gas Tanks',
      },
      performance: {
        views: 0,
        redemptions: 0,
        revenue: 0,
        growth: '0%',
      },
    },
    {
      id: '3',
      name: 'First Order Coupon',
      type: 'coupon',
      status: 'active',
      startDate: '2024-03-01',
      endDate: '2024-03-31',
      discount: {
        type: 'fixed',
        value: 50,
      },
      target: {
        type: 'region',
        value: 'Riyadh Region',
      },
      performance: {
        views: 1800,
        redemptions: 320,
        revenue: 32000,
        growth: '+12.3%',
      },
    },
  ];

  const performanceData = [
    { date: '2024-01', revenue: 35000, redemptions: 380 },
    { date: '2024-02', revenue: 42000, redemptions: 420 },
    { date: '2024-03', revenue: 38000, redemptions: 350 },
    { date: '2024-04', revenue: 45000, redemptions: 480 },
    { date: '2024-05', revenue: 48000, redemptions: 520 },
    { date: '2024-06', revenue: 52000, redemptions: 550 },
  ];

  const campaignTypes = [
    { name: 'Flash Sales', value: 35, color: '#0EA5E9' },
    { name: 'Coupons', value: 25, color: '#6366F1' },
    { name: 'Volume Discounts', value: 20, color: '#8B5CF6' },
    { name: 'Seasonal', value: 20, color: '#EC4899' },
  ];

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-50 text-green-700';
      case 'scheduled':
        return 'bg-blue-50 text-blue-700';
      case 'ended':
        return 'bg-gray-50 text-gray-700';
      case 'draft':
        return 'bg-yellow-50 text-yellow-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const getStatusIcon = (status: Campaign['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4" />;
      case 'scheduled':
        return <Clock className="h-4 w-4" />;
      case 'ended':
        return <XCircle className="h-4 w-4" />;
      case 'draft':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900 mb-2">
              🎯 Campaigns & Promotions
            </h1>
            <p className="text-secondary-600">
              Create and manage promotional campaigns to boost sales and engagement
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="btn-primary flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Create Campaign</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6">
        {campaignStats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100"
          >
            <div className="flex items-center justify-between mb-2">
              {stat.icon}
              <span className={`text-sm ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {stat.trend}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-secondary-900">{stat.value}</h3>
            <p className="text-secondary-600">{stat.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Performance Trend */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
          <h2 className="text-lg font-semibold text-secondary-900 mb-6">Campaign Performance</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="date" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#0EA5E9"
                  fill="#0EA5E9"
                  fillOpacity={0.1}
                  name="Revenue"
                />
                <Area
                  type="monotone"
                  dataKey="redemptions"
                  stroke="#6366F1"
                  fill="#6366F1"
                  fillOpacity={0.1}
                  name="Redemptions"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Campaign Types */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
          <h2 className="text-lg font-semibold text-secondary-900 mb-6">Campaign Distribution</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={campaignTypes}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {campaignTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {campaignTypes.map((type) => (
              <div key={type.name} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: type.color }}
                />
                <span className="text-sm text-secondary-600">
                  {type.name} ({type.value}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="bg-white rounded-xl shadow-sm border border-secondary-100">
        <div className="p-6 border-b border-secondary-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold text-secondary-900">Active Campaigns</h2>
              <div className="flex space-x-2">
                {['all', 'active', 'scheduled', 'ended'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      activeTab === tab
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-secondary-600 hover:bg-secondary-50'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search campaigns..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>
              <button className="p-2 hover:bg-secondary-100 rounded-lg text-secondary-600">
                <Filter className="h-5 w-5" />
              </button>
              <button className="p-2 hover:bg-secondary-100 rounded-lg text-secondary-600">
                <Download className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-secondary-50">
                <th className="py-4 px-6 text-left font-medium text-secondary-600">Campaign</th>
                <th className="py-4 px-6 text-left font-medium text-secondary-600">Type</th>
                <th className="py-4 px-6 text-left font-medium text-secondary-600">Target</th>
                <th className="py-4 px-6 text-left font-medium text-secondary-600">Duration</th>
                <th className="py-4 px-6 text-left font-medium text-secondary-600">Performance</th>
                <th className="py-4 px-6 text-left font-medium text-secondary-600">Status</th>
                <th className="py-4 px-6 text-left font-medium text-secondary-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockCampaigns.map((campaign) => (
                <tr key={campaign.id} className="border-b border-secondary-100">
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-medium">{campaign.name}</div>
                      <div className="text-sm text-secondary-600">
                        {campaign.discount.type === 'percentage' ? (
                          <span>{campaign.discount.value}% off</span>
                        ) : (
                          <span>${campaign.discount.value} off</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="capitalize">{campaign.type.replace('_', ' ')}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <div className="text-sm text-secondary-600">
                        {campaign.target.type.charAt(0).toUpperCase() + campaign.target.type.slice(1)}
                      </div>
                      <div>{campaign.target.value}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm">
                      <div>{campaign.startDate}</div>
                      <div className="text-secondary-600">to {campaign.endDate}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {campaign.status === 'active' && (
                      <div>
                        <div className="font-medium">
                          ${campaign.performance.revenue.toLocaleString()}
                        </div>
                        <div className="flex items-center text-sm text-green-600">
                          <ArrowUpRight className="h-4 w-4 mr-1" />
                          {campaign.performance.growth}
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${getStatusColor(campaign.status)}`}>
                      {getStatusIcon(campaign.status)}
                      <span className="capitalize">{campaign.status}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 hover:bg-secondary-100 rounded text-secondary-600">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-1 hover:bg-secondary-100 rounded text-secondary-600">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-1 hover:bg-secondary-100 rounded text-secondary-600">
                        <Trash2 className="h-4 w-4" />
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

        <div className="p-4 border-t border-secondary-100 flex items-center justify-between">
          <div className="text-sm text-secondary-600">
            Showing 1 to {mockCampaigns.length} of {mockCampaigns.length} entries
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 border border-secondary-200 rounded hover:bg-secondary-50">
              Previous
            </button>
            <button className="px-3 py-1 bg-primary-600 text-white rounded">
              1
            </button>
            <button className="px-3 py-1 border border-secondary-200 rounded hover:bg-secondary-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignsOverview;