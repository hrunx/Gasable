import React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  UserPlus,
  UserMinus,
  Star,
  TrendingUp,
  TrendingDown,
  Filter,
  Download,
  Calendar,
  Search,
  MapPin,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  Home,
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

const CustomerInsights = () => {
  const customerStats = [
    {
      title: 'Total Customers',
      value: '2,648',
      trend: '+12.3%',
      icon: <Users className="h-6 w-6 text-blue-600" />,
      isPositive: true,
    },
    {
      title: 'New Customers',
      value: '156',
      trend: '+8.5%',
      icon: <UserPlus className="h-6 w-6 text-green-600" />,
      isPositive: true,
    },
    {
      title: 'Churn Rate',
      value: '2.4%',
      trend: '-0.8%',
      icon: <UserMinus className="h-6 w-6 text-red-600" />,
      isPositive: true,
    },
    {
      title: 'Avg. Satisfaction',
      value: '4.8',
      trend: '+0.2',
      icon: <Star className="h-6 w-6 text-yellow-600" />,
      isPositive: true,
    },
  ];

  const customerSegments = [
    { name: 'Industrial', value: 45, color: '#0EA5E9' },
    { name: 'Commercial', value: 30, color: '#6366F1' },
    { name: 'Residential', value: 25, color: '#8B5CF6' },
  ];

  const customerGrowth = [
    { month: 'Jan', b2b: 120, b2c: 85 },
    { month: 'Feb', b2b: 135, b2c: 92 },
    { month: 'Mar', b2b: 128, b2c: 88 },
    { month: 'Apr', b2b: 145, b2c: 98 },
    { month: 'May', b2b: 152, b2c: 105 },
    { month: 'Jun', b2b: 168, b2c: 112 },
  ];

  const topCustomers = [
    {
      name: 'Acme Industries',
      type: 'B2B',
      location: 'Riyadh',
      orders: 45,
      spending: 125000,
      trend: '+12.5%',
    },
    {
      name: 'Global Energy Corp',
      type: 'B2B',
      location: 'Jeddah',
      orders: 38,
      spending: 98000,
      trend: '+8.2%',
    },
    {
      name: 'Green Solutions',
      type: 'B2B',
      location: 'Dammam',
      orders: 32,
      spending: 85000,
      trend: '+15.4%',
    },
    {
      name: 'Power Systems LLC',
      type: 'B2B',
      location: 'Riyadh',
      orders: 28,
      spending: 72000,
      trend: '+6.8%',
    },
  ];

  const customerBehavior = [
    { name: 'First Purchase', value: 35 },
    { name: 'Repeat Purchase', value: 45 },
    { name: 'Subscription', value: 20 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900 mb-2">
              👥 Customer Insights
            </h1>
            <p className="text-secondary-600">
              Understand your customer base and their behavior patterns
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search customers..."
                className="pl-10 pr-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>
            <button className="px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filter</span>
            </button>
            <button className="px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors flex items-center space-x-2">
              <Download className="h-5 w-5" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6">
        {customerStats.map((stat, index) => (
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
        {/* Customer Growth */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
          <h2 className="text-lg font-semibold text-secondary-900 mb-6">Customer Growth</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={customerGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="b2b"
                  stackId="1"
                  stroke="#0EA5E9"
                  fill="#0EA5E9"
                  fillOpacity={0.1}
                  name="B2B Customers"
                />
                <Area
                  type="monotone"
                  dataKey="b2c"
                  stackId="1"
                  stroke="#6366F1"
                  fill="#6366F1"
                  fillOpacity={0.1}
                  name="B2C Customers"
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

      {/* Top Customers */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <h2 className="text-lg font-semibold text-secondary-900 mb-6">Top Customers</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-secondary-600 border-b border-secondary-100">
                <th className="pb-3 font-medium">Customer</th>
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium">Location</th>
                <th className="pb-3 font-medium">Orders</th>
                <th className="pb-3 font-medium">Total Spending</th>
                <th className="pb-3 font-medium">Growth</th>
              </tr>
            </thead>
            <tbody>
              {topCustomers.map((customer, index) => (
                <tr key={index} className="border-b border-secondary-100">
                  <td className="py-4 font-medium">{customer.name}</td>
                  <td className="py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      customer.type === 'B2B'
                        ? 'bg-purple-50 text-purple-700'
                        : 'bg-blue-50 text-blue-700'
                    }`}>
                      {customer.type}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-secondary-400" />
                      <span>{customer.location}</span>
                    </div>
                  </td>
                  <td className="py-4">{customer.orders}</td>
                  <td className="py-4">${customer.spending.toLocaleString()}</td>
                  <td className="py-4">
                    <span className="flex items-center text-green-600">
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      {customer.trend}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Behavior */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <h2 className="text-lg font-semibold text-secondary-900 mb-6">Purchase Behavior</h2>
        <div className="grid grid-cols-3 gap-6">
          {customerBehavior.map((behavior, index) => (
            <div key={index} className="p-4 bg-secondary-50 rounded-lg">
              <h3 className="font-medium text-secondary-900 mb-2">{behavior.name}</h3>
              <div className="flex items-end space-x-2">
                <span className="text-2xl font-bold text-primary-600">{behavior.value}%</span>
                <span className="text-sm text-secondary-600">of customers</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerInsights;