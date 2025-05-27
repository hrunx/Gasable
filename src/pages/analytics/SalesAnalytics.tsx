import React from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Package,
  Users,
  ShoppingCart,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download,
  Calendar,
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

const SalesAnalytics = () => {
  const salesData = [
    { month: 'Jan', b2b: 45000, b2c: 28000 },
    { month: 'Feb', b2b: 52000, b2c: 31000 },
    { month: 'Mar', b2b: 48000, b2c: 29000 },
    { month: 'Apr', b2b: 61000, b2c: 35000 },
    { month: 'May', b2b: 55000, b2c: 32000 },
    { month: 'Jun', b2b: 67000, b2c: 38000 },
  ];

  const productPerformance = [
    { name: 'Industrial Gas Tank', sales: 450, growth: 12.5 },
    { name: 'Premium Gas Cylinder', sales: 380, growth: 8.2 },
    { name: 'Commercial Setup', sales: 290, growth: -5.4 },
    { name: 'Safety Equipment', sales: 210, growth: 15.8 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900 mb-2">
              📈 Sales Analytics
            </h1>
            <p className="text-secondary-600">
              Detailed analysis of your sales performance and trends
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

      {/* Sales Overview */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="h-6 w-6 text-green-600" />
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-secondary-900">$768,432</h3>
          <p className="text-secondary-600">Total Revenue</p>
          <div className="mt-4 text-sm text-green-600">+15.8% vs last month</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
          <div className="flex items-center justify-between mb-2">
            <Package className="h-6 w-6 text-blue-600" />
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-secondary-900">1,567</h3>
          <p className="text-secondary-600">Total Orders</p>
          <div className="mt-4 text-sm text-green-600">+8.5% vs last month</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
          <div className="flex items-center justify-between mb-2">
            <Users className="h-6 w-6 text-purple-600" />
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-secondary-900">89.2%</h3>
          <p className="text-secondary-600">Conversion Rate</p>
          <div className="mt-4 text-sm text-green-600">+2.3% vs last month</div>
        </div>
      </div>

      {/* Sales Trend Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <h2 className="text-lg font-semibold text-secondary-900 mb-6">Sales Trend</h2>
        <div className="h-80">
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
                name="B2B Sales"
              />
              <Area
                type="monotone"
                dataKey="b2c"
                stackId="1"
                stroke="#6366F1"
                fill="#6366F1"
                fillOpacity={0.1}
                name="B2C Sales"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Product Performance */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <h2 className="text-lg font-semibold text-secondary-900 mb-6">Product Performance</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-secondary-600 border-b border-secondary-100">
                <th className="pb-3 font-medium">Product</th>
                <th className="pb-3 font-medium">Sales</th>
                <th className="pb-3 font-medium">Growth</th>
                <th className="pb-3 font-medium">Trend</th>
              </tr>
            </thead>
            <tbody>
              {productPerformance.map((product, index) => (
                <tr key={index} className="border-b border-secondary-100">
                  <td className="py-4 font-medium">{product.name}</td>
                  <td className="py-4">{product.sales}</td>
                  <td className="py-4">
                    <span className={`flex items-center ${
                      product.growth > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {product.growth > 0 ? (
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 mr-1" />
                      )}
                      {Math.abs(product.growth)}%
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="w-32 h-6">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={salesData}>
                          <Bar
                            dataKey="b2b"
                            fill={product.growth > 0 ? '#0EA5E9' : '#F43F5E'}
                          />
                        </BarChart>
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

export default SalesAnalytics;