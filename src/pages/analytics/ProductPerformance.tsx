import React from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  TrendingUp,
  TrendingDown,
  Eye,
  ShoppingCart,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download,
  Search,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

const ProductPerformance = () => {
  const productStats = [
    {
      title: 'Total Products',
      value: '156',
      trend: '+12.5%',
      icon: <Package className="h-6 w-6 text-blue-600" />,
      isPositive: true,
    },
    {
      title: 'Product Views',
      value: '45.6K',
      trend: '+25.2%',
      icon: <Eye className="h-6 w-6 text-purple-600" />,
      isPositive: true,
    },
    {
      title: 'Conversion Rate',
      value: '3.2%',
      trend: '-0.8%',
      icon: <ShoppingCart className="h-6 w-6 text-green-600" />,
      isPositive: false,
    },
    {
      title: 'Avg. Rating',
      value: '4.8',
      trend: '+0.2',
      icon: <Star className="h-6 w-6 text-yellow-600" />,
      isPositive: true,
    },
  ];

  const productPerformance = [
    {
      name: 'Industrial Gas Tank',
      views: 12500,
      sales: 450,
      revenue: 225000,
      rating: 4.8,
      trend: '+12.5%',
    },
    {
      name: 'Premium Gas Cylinder',
      views: 8900,
      sales: 380,
      revenue: 152000,
      rating: 4.6,
      trend: '+8.2%',
    },
    {
      name: 'Commercial Setup',
      views: 6700,
      sales: 290,
      revenue: 145000,
      rating: 4.7,
      trend: '-5.4%',
    },
    {
      name: 'Safety Equipment',
      views: 5400,
      sales: 210,
      revenue: 84000,
      rating: 4.9,
      trend: '+15.8%',
    },
  ];

  const viewsData = [
    { date: '2024-01', views: 35000 },
    { date: '2024-02', views: 42000 },
    { date: '2024-03', views: 38000 },
    { date: '2024-04', views: 45000 },
    { date: '2024-05', views: 48000 },
    { date: '2024-06', views: 52000 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900 mb-2">
              📦 Product Performance
            </h1>
            <p className="text-secondary-600">
              Track product metrics, views, and customer engagement
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search products..."
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
        {productStats.map((stat, index) => (
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

      {/* Product Views Trend */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <h2 className="text-lg font-semibold text-secondary-900 mb-6">Product Views Trend</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={viewsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="date" stroke="#64748B" />
              <YAxis stroke="#64748B" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="views"
                stroke="#0EA5E9"
                fill="#0EA5E9"
                fillOpacity={0.1}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Product Performance Table */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <h2 className="text-lg font-semibold text-secondary-900 mb-6">Product Performance</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-secondary-600 border-b border-secondary-100">
                <th className="pb-3 font-medium">Product</th>
                <th className="pb-3 font-medium">Views</th>
                <th className="pb-3 font-medium">Sales</th>
                <th className="pb-3 font-medium">Revenue</th>
                <th className="pb-3 font-medium">Rating</th>
                <th className="pb-3 font-medium">Trend</th>
              </tr>
            </thead>
            <tbody>
              {productPerformance.map((product, index) => (
                <tr key={index} className="border-b border-secondary-100">
                  <td className="py-4 font-medium">{product.name}</td>
                  <td className="py-4">{product.views.toLocaleString()}</td>
                  <td className="py-4">{product.sales}</td>
                  <td className="py-4">${product.revenue.toLocaleString()}</td>
                  <td className="py-4">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1">{product.rating}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className={`flex items-center ${
                      product.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {product.trend.startsWith('+') ? (
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 mr-1" />
                      )}
                      {product.trend}
                    </span>
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

export default ProductPerformance;