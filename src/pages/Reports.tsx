import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart2,
  TrendingUp,
  TrendingDown,
  Download,
  FileText,
  Calendar,
  Filter,
  RefreshCw,
  Search,
  Package,
  Users,
  DollarSign,
  Truck,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  ShoppingCart,
  Map,
  Clock,
  Zap,
  AlertCircle,
  ChevronDown,
  Plus,
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
  LineChart,
  Line,
} from 'recharts';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";

const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

const Reports = () => {
  const [activeTab, setActiveTab] = useState('sales');
  const [dateRange, setDateRange] = useState('month');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  // Mock data for various charts
  const salesData = [
    { month: 'Jan', b2b: 45000, b2c: 28000 },
    { month: 'Feb', b2b: 52000, b2c: 31000 },
    { month: 'Mar', b2b: 48000, b2c: 29000 },
    { month: 'Apr', b2b: 61000, b2c: 35000 },
    { month: 'May', b2b: 55000, b2c: 32000 },
    { month: 'Jun', b2b: 67000, b2c: 38000 },
  ];

  const productPerformance = [
    { name: 'Industrial Gas Tank', sales: 450, growth: 12.5, views: 1200 },
    { name: 'Premium Gas Cylinder', sales: 380, growth: 8.2, views: 950 },
    { name: 'Commercial Setup', sales: 290, growth: -5.4, views: 800 },
    { name: 'Safety Equipment', sales: 210, growth: 15.8, views: 600 },
  ];

  const customerSegments = [
    { name: 'Industrial', value: 45, color: '#0EA5E9' },
    { name: 'Commercial', value: 30, color: '#6366F1' },
    { name: 'Residential', value: 25, color: '#8B5CF6' },
  ];

  const marketInsights = [
    { name: 'Market Share', value: 28, trend: '+2.5%', color: '#34D399' },
    { name: 'Category Rank', value: '#2', trend: '+1', color: '#F59E0B' },
    { name: 'Avg. Rating', value: 4.8, trend: '+0.2', color: '#EC4899' },
  ];

  const searchTerms = [
    { term: 'industrial gas', volume: 1250, trend: '+15%' },
    { term: 'gas cylinder', volume: 980, trend: '+8%' },
    { term: 'bulk gas supply', volume: 750, trend: '+12%' },
    { term: 'safety equipment', volume: 620, trend: '+5%' },
  ];

  const deliveryMetrics = [
    { metric: 'On-Time Delivery', value: '95.8%', trend: '+2.3%' },
    { metric: 'Avg. Delivery Time', value: '2.3 days', trend: '-0.5 days' },
    { metric: 'Return Rate', value: '1.2%', trend: '-0.3%' },
    { metric: 'Customer Satisfaction', value: '4.8/5', trend: '+0.2' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900 mb-2">
              📊 Analytics & Reports
            </h1>
            <p className="text-secondary-600">
              Track performance metrics and gain actionable insights
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleRefresh}
              className={`p-2 rounded-lg text-secondary-600 hover:bg-secondary-100 ${
                isRefreshing ? 'animate-spin' : ''
              }`}
            >
              <RefreshCw className="h-5 w-5" />
            </button>
            <button className="px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </button>
            <button className="px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors flex items-center space-x-2">
              <Download className="h-5 w-5" />
              <span>Export</span>
            </button>
            <button className="btn-primary flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Generate Report</span>
            </button>
          </div>
        </div>

        {/* Report Types */}
        <div className="flex space-x-4 border-b border-secondary-100">
          {[
            { id: 'sales', label: 'Sales & Growth', icon: <BarChart2 className="h-5 w-5" /> },
            { id: 'products', label: 'Product Performance', icon: <Package className="h-5 w-5" /> },
            { id: 'customers', label: 'Customer Insights', icon: <Users className="h-5 w-5" /> },
            { id: 'market', label: 'Market Analysis', icon: <TrendingUp className="h-5 w-5" /> },
            { id: 'logistics', label: 'Logistics', icon: <Truck className="h-5 w-5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-secondary-600 hover:text-secondary-900'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100"
          >
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="h-6 w-6 text-blue-600" />
              <span className="text-sm text-green-600">+15.8%</span>
            </div>
            <h3 className="text-2xl font-bold text-secondary-900">$768,432</h3>
            <p className="text-secondary-600">Total Revenue</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100"
          >
            <div className="flex items-center justify-between mb-2">
              <ShoppingCart className="h-6 w-6 text-purple-600" />
              <span className="text-sm text-green-600">+12.3%</span>
            </div>
            <h3 className="text-2xl font-bold text-secondary-900">2,648</h3>
            <p className="text-secondary-600">Total Orders</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100"
          >
            <div className="flex items-center justify-between mb-2">
              <Users className="h-6 w-6 text-green-600" />
              <span className="text-sm text-green-600">+8.5%</span>
            </div>
            <h3 className="text-2xl font-bold text-secondary-900">156</h3>
            <p className="text-secondary-600">New Customers</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100"
          >
            <div className="flex items-center justify-between mb-2">
              <Truck className="h-6 w-6 text-yellow-600" />
              <span className="text-sm text-green-600">+5.2%</span>
            </div>
            <h3 className="text-2xl font-bold text-secondary-900">95.8%</h3>
            <p className="text-secondary-600">Delivery Success</p>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-2 gap-6">
          {/* Sales Trend */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-secondary-900">Sales Trend</h2>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-1.5 border border-secondary-200 rounded-lg text-sm"
              >
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="quarter">Last Quarter</option>
                <option value="year">Last Year</option>
              </select>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData}>
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
                  />
                  <Area
                    type="monotone"
                    dataKey="b2c"
                    stackId="1"
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

        {/* Product Performance Table */}
        <div className="bg-white rounded-xl shadow-sm border border-secondary-100">
          <div className="p-6 border-b border-secondary-100">
            <h2 className="text-lg font-semibold text-secondary-900">Product Performance</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-secondary-50">
                  <th className="py-4 px-6 text-left font-medium text-secondary-600">Product</th>
                  <th className="py-4 px-6 text-left font-medium text-secondary-600">Sales</th>
                  <th className="py-4 px-6 text-left font-medium text-secondary-600">Views</th>
                  <th className="py-4 px-6 text-left font-medium text-secondary-600">Growth</th>
                  <th className="py-4 px-6 text-left font-medium text-secondary-600">Trend</th>
                </tr>
              </thead>
              <tbody>
                {productPerformance.map((product) => (
                  <tr key={product.name} className="border-b border-secondary-100">
                    <td className="py-4 px-6 font-medium">{product.name}</td>
                    <td className="py-4 px-6">${product.sales.toLocaleString()}</td>
                    <td className="py-4 px-6">{product.views.toLocaleString()}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm ${
                        product.growth > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {product.growth > 0 ? (
                          <ArrowUpRight className="h-4 w-4 mr-1" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 mr-1" />
                        )}
                        {Math.abs(product.growth)}%
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="w-32 h-6">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={salesData}>
                            <Line
                              type="monotone"
                              dataKey="b2b"
                              stroke="#0EA5E9"
                              strokeWidth={2}
                              dot={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Market Insights Grid */}
        <div className="grid grid-cols-3 gap-6">
          {marketInsights.map((insight) => (
            <div
              key={insight.name}
              className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-secondary-600">{insight.name}</h3>
                <span className="text-sm text-green-600">{insight.trend}</span>
              </div>
              <p className="text-2xl font-bold" style={{ color: insight.color }}>
                {insight.value}
              </p>
            </div>
          ))}
        </div>

        {/* Popular Search Terms */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
          <h2 className="text-lg font-semibold text-secondary-900 mb-6">Popular Search Terms</h2>
          <div className="grid grid-cols-2 gap-6">
            {searchTerms.map((term) => (
              <div
                key={term.term}
                className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg"
              >
                <div>
                  <div className="font-medium">{term.term}</div>
                  <div className="text-sm text-secondary-600">{term.volume} searches</div>
                </div>
                <span className="text-green-600">{term.trend}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Metrics */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
          <h2 className="text-lg font-semibold text-secondary-900 mb-6">Delivery Performance</h2>
          <div className="grid grid-cols-4 gap-6">
            {deliveryMetrics.map((metric) => (
              <div key={metric.metric} className="space-y-2">
                <p className="text-secondary-600">{metric.metric}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-secondary-900">{metric.value}</span>
                  <span className="text-sm text-green-600">{metric.trend}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;