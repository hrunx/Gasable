import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Tag,
  Filter,
  Download,
  Calendar,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  ShoppingCart,
  Target,
  Percent,
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
  BarChart,
  Bar,
} from 'recharts';

const CampaignAnalytics = () => {
  const campaignStats = [
    {
      title: 'Total Revenue',
      value: '$45,678',
      trend: '+15.8%',
      icon: <DollarSign className="h-6 w-6 text-blue-600" />,
      isPositive: true,
    },
    {
      title: 'Conversion Rate',
      value: '24.5%',
      trend: '+5.2%',
      icon: <Target className="h-6 w-6 text-green-600" />,
      isPositive: true,
    },
    {
      title: 'Avg. Order Value',
      value: '$285',
      trend: '+8.4%',
      icon: <ShoppingCart className="h-6 w-6 text-purple-600" />,
      isPositive: true,
    },
    {
      title: 'ROI',
      value: '312%',
      trend: '+12.3%',
      icon: <Percent className="h-6 w-6 text-yellow-600" />,
      isPositive: true,
    },
  ];

  const performanceData = [
    { date: '2024-01', revenue: 35000, orders: 380 },
    { date: '2024-02', revenue: 42000, orders: 420 },
    { date: '2024-03', revenue: 38000, orders: 350 },
    { date: '2024-04', revenue: 45000, orders: 480 },
    { date: '2024-05', revenue: 48000, orders: 520 },
    { date: '2024-06', revenue: 52000, orders: 550 },
  ];

  const conversionData = [
    { stage: 'Views', value: 10000 },
    { stage: 'Clicks', value: 5000 },
    { stage: 'Cart Adds', value: 2000 },
    { stage: 'Purchases', value: 1000 },
  ];

  const campaignComparison = [
    {
      name: 'Summer Flash Sale',
      revenue: 25000,
      orders: 450,
      conversion: 24.5,
      roi: 312,
    },
    {
      name: 'Bulk Purchase Discount',
      revenue: 18000,
      orders: 280,
      conversion: 18.2,
      roi: 245,
    },
    {
      name: 'First Order Coupon',
      revenue: 12000,
      orders: 320,
      conversion: 22.1,
      roi: 198,
    },
    {
      name: 'Holiday Special',
      revenue: 32000,
      orders: 580,
      conversion: 28.4,
      roi: 356,
    },
  ];

  const customerSegments = [
    { name: 'New Customers', value: 45, color: '#0EA5E9' },
    { name: 'Returning', value: 35, color: '#6366F1' },
    { name: 'VIP', value: 20, color: '#8B5CF6' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900 mb-2">
              📊 Campaign Analytics
            </h1>
            <p className="text-secondary-600">
              Track and analyze your campaign performance metrics
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filter</span>
            </button>
            <button className="px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors flex items-center space-x-2">
              <Download className="h-5 w-5" />
              <span>Export</span>
            </button>
            <button className="px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Date Range</span>
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
        {/* Revenue Trend */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
          <h2 className="text-lg font-semibold text-secondary-900 mb-6">Revenue Trend</h2>
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
                  dataKey="orders"
                  stroke="#6366F1"
                  fill="#6366F1"
                  fillOpacity={0.1}
                  name="Orders"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Customer Segments */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
          <h2 className="text-lg font-semibold text-secondary-900 mb-6">Customer Segments</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={customerSegments}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {customerSegments.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            {customerSegments.map((segment) => (
              <div key={segment.name} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: segment.color }}
                />
                <span className="text-sm text-secondary-600">
                  {segment.name} ({segment.value}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <h2 className="text-lg font-semibold text-secondary-900 mb-6">Conversion Funnel</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={conversionData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis type="number" stroke="#64748B" />
              <YAxis dataKey="stage" type="category" stroke="#64748B" />
              <Tooltip />
              <Bar dataKey="value" fill="#0EA5E9" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Campaign Comparison */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <h2 className="text-lg font-semibold text-secondary-900 mb-6">Campaign Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-secondary-600 border-b border-secondary-100">
                <th className="pb-3 font-medium">Campaign</th>
                <th className="pb-3 font-medium">Revenue</th>
                <th className="pb-3 font-medium">Orders</th>
                <th className="pb-3 font-medium">Conversion Rate</th>
                <th className="pb-3 font-medium">ROI</th>
                <th className="pb-3 font-medium">Trend</th>
              </tr>
            </thead>
            <tbody>
              {campaignComparison.map((campaign, index) => (
                <tr key={index} className="border-b border-secondary-100">
                  <td className="py-4 font-medium">{campaign.name}</td>
                  <td className="py-4">${campaign.revenue.toLocaleString()}</td>
                  <td className="py-4">{campaign.orders}</td>
                  <td className="py-4">{campaign.conversion}%</td>
                  <td className="py-4">{campaign.roi}%</td>
                  <td className="py-4">
                    <div className="w-32 h-6">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={performanceData}>
                          <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#0EA5E9"
                            fill="#0EA5E9"
                            fillOpacity={0.1}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CampaignAnalytics;