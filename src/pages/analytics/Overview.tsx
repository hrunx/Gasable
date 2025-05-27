import React from 'react';
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

const Overview = () => {
  const stats = [
    {
      title: 'Total Revenue',
      value: '$768,432',
      trend: '+15.8%',
      icon: <DollarSign className="h-6 w-6 text-blue-600" />,
      isPositive: true,
    },
    {
      title: 'Active Customers',
      value: '2,648',
      trend: '+12.3%',
      icon: <Users className="h-6 w-6 text-purple-600" />,
      isPositive: true,
    },
    {
      title: 'Total Orders',
      value: '1,567',
      trend: '+8.5%',
      icon: <ShoppingCart className="h-6 w-6 text-green-600" />,
      isPositive: true,
    },
    {
      title: 'Product Views',
      value: '45,678',
      trend: '+25.2%',
      icon: <Package className="h-6 w-6 text-yellow-600" />,
      isPositive: true,
    },
  ];

  const revenueData = [
    { month: 'Jan', revenue: 65000, orders: 450 },
    { month: 'Feb', revenue: 72000, orders: 485 },
    { month: 'Mar', revenue: 68000, orders: 460 },
    { month: 'Apr', revenue: 85000, orders: 520 },
    { month: 'May', revenue: 78000, orders: 495 },
    { month: 'Jun', revenue: 92000, orders: 550 },
  ];

  const customerSegments = [
    { name: 'B2B', value: 60, color: '#0EA5E9' },
    { name: 'B2C', value: 30, color: '#6366F1' },
    { name: 'Distributors', value: 10, color: '#8B5CF6' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <h1 className="text-2xl font-bold text-secondary-900 mb-2">
          📊 Analytics Overview
        </h1>
        <p className="text-secondary-600">
          Monitor key metrics and performance indicators across your business
        </p>
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
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#0EA5E9"
                  fill="#0EA5E9"
                  fillOpacity={0.1}
                />
                <Area
                  type="monotone"
                  dataKey="orders"
                  stroke="#6366F1"
                  fill="#6366F1"
                  fillOpacity={0.1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Customer Segments */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
          <h2 className="text-lg font-semibold text-secondary-900 mb-6">Customer Segments</h2>
          <div className="h-64">
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

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <h2 className="text-lg font-semibold text-secondary-900 mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {[
            { title: 'New order received', value: '$1,234.56', time: '2 minutes ago' },
            { title: 'Product stock updated', value: '150 units', time: '15 minutes ago' },
            { title: 'Customer feedback', value: '5 stars', time: '1 hour ago' },
          ].map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg"
            >
              <div>
                <p className="font-medium text-secondary-900">{activity.title}</p>
                <p className="text-sm text-secondary-500">{activity.time}</p>
              </div>
              <span className="font-medium text-primary-600">{activity.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Overview;