import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  ShoppingCart,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
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
  LineChart,
  Line,
  Legend,
} from 'recharts';
import { useAnalytics } from '../../lib/hooks/useAnalytics';
import { useNotifications } from '../../lib/hooks/useNotifications';

const Overview = () => {
  const [timeframe, setTimeframe] = useState('6m');
  const {
    overviewStats,
    revenueData,
    customerSegments,
    loading: analyticsLoading,
    error: analyticsError,
    refresh,
  } = useAnalytics(timeframe);

  const {
    recentActivity,
    loading: notificationsLoading,
    error: notificationsError,
  } = useNotifications();

  const loading = analyticsLoading || notificationsLoading;
  const error = analyticsError || notificationsError;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
          <div className="animate-pulse">
            <div className="h-8 bg-secondary-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-secondary-200 rounded w-2/3"></div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
              <div className="animate-pulse">
                <div className="h-6 bg-secondary-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-secondary-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-secondary-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-red-200">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-2">Error Loading Analytics</h1>
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={refresh}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 mx-auto"
            >
              <RefreshCw className="h-5 w-5" />
              <span>Retry</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Revenue',
      value: `$${overviewStats?.totalRevenue.toLocaleString() || '0'}`,
      trend: `${(overviewStats?.revenueGrowth || 0) >= 0 ? '+' : ''}${(overviewStats?.revenueGrowth || 0).toFixed(1)}%`,
      icon: <DollarSign className="h-6 w-6 text-blue-600" />,
      isPositive: (overviewStats?.revenueGrowth || 0) >= 0,
    },
    {
      title: 'Active Customers',
      value: overviewStats?.activeCustomers.toLocaleString() || '0',
      trend: `${(overviewStats?.customerGrowth || 0) >= 0 ? '+' : ''}${(overviewStats?.customerGrowth || 0).toFixed(1)}%`,
      icon: <Users className="h-6 w-6 text-purple-600" />,
      isPositive: (overviewStats?.customerGrowth || 0) >= 0,
    },
    {
      title: 'Total Orders',
      value: overviewStats?.totalOrders.toLocaleString() || '0',
      trend: `${(overviewStats?.orderGrowth || 0) >= 0 ? '+' : ''}${(overviewStats?.orderGrowth || 0).toFixed(1)}%`,
      icon: <ShoppingCart className="h-6 w-6 text-green-600" />,
      isPositive: (overviewStats?.orderGrowth || 0) >= 0,
    },
    {
      title: 'Product Views',
      value: overviewStats?.productViews.toLocaleString() || '0',
      trend: `${(overviewStats?.viewsGrowth || 0) >= 0 ? '+' : ''}${(overviewStats?.viewsGrowth || 0).toFixed(1)}%`,
      icon: <Package className="h-6 w-6 text-yellow-600" />,
      isPositive: (overviewStats?.viewsGrowth || 0) >= 0,
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900 mb-2">
              📊 Analytics Overview
            </h1>
            <p className="text-secondary-600">
              Monitor key metrics and performance indicators across your business
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="1m">Last Month</option>
              <option value="3m">Last 3 Months</option>
              <option value="6m">Last 6 Months</option>
              <option value="1y">Last Year</option>
            </select>
            <button
              onClick={refresh}
              className="px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors flex items-center space-x-2"
            >
              <RefreshCw className="h-5 w-5" />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100"
          >
            <div className="flex items-center justify-between mb-2">
              {stat.icon}
              <span className={`text-sm flex items-center ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {stat.isPositive ? (
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                )}
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
          <div className="h-64">
            {revenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="month" stroke="#64748B" />
                  <YAxis stroke="#64748B" />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'revenue' ? formatCurrency(Number(value)) : value,
                      name === 'revenue' ? 'Revenue' : 'Orders'
                    ]}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#0EA5E9"
                    strokeWidth={3}
                    dot={{ fill: '#0EA5E9', strokeWidth: 2, r: 4 }}
                    name="revenue"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-secondary-500">
                No revenue data available
              </div>
            )}
          </div>
        </div>

        {/* Customer Segments */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
          <h2 className="text-lg font-semibold text-secondary-900 mb-6">Customer Segments</h2>
          <div className="h-64">
            {customerSegments.length > 0 ? (
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
                  <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-secondary-500">
                No customer data available
              </div>
            )}
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

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <h2 className="text-lg font-semibold text-secondary-900 mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-secondary-900">{activity.title}</p>
                  <p className="text-sm text-secondary-500">{activity.time}</p>
                </div>
                <span className="font-medium text-primary-600">{activity.value}</span>
              </div>
            ))
          ) : (
            <div className="text-center text-secondary-500 py-8">
              No recent activity to display
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Overview;