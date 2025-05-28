import React, { useState } from 'react';
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
  RefreshCw,
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
import { useAnalytics } from '../../lib/hooks/useAnalytics';

const SalesAnalytics = () => {
  const [timeframe, setTimeframe] = useState('6m');
  const {
    salesMetrics,
    revenueData,
    productPerformance,
    loading,
    error,
    refresh,
  } = useAnalytics(timeframe);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
          <div className="animate-pulse">
            <div className="h-8 bg-secondary-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-secondary-200 rounded w-2/3"></div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
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
            <h1 className="text-2xl font-bold text-red-600 mb-2">Error Loading Sales Analytics</h1>
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
            <button className="px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filter</span>
            </button>
            <button className="px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors flex items-center space-x-2">
              <Download className="h-5 w-5" />
              <span>Export</span>
            </button>
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

      {/* Sales Overview */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="h-6 w-6 text-green-600" />
            {(salesMetrics?.revenueGrowth || 0) >= 0 ? (
              <TrendingUp className="h-5 w-5 text-green-600" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-600" />
            )}
          </div>
          <h3 className="text-2xl font-bold text-secondary-900">
            ${salesMetrics?.totalRevenue.toLocaleString() || '0'}
          </h3>
          <p className="text-secondary-600">Total Revenue</p>
          <div className={`mt-4 text-sm ${(salesMetrics?.revenueGrowth || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {(salesMetrics?.revenueGrowth || 0) >= 0 ? '+' : ''}{(salesMetrics?.revenueGrowth || 0).toFixed(1)}% vs last period
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
          <div className="flex items-center justify-between mb-2">
            <Package className="h-6 w-6 text-blue-600" />
            {(salesMetrics?.orderGrowth || 0) >= 0 ? (
              <TrendingUp className="h-5 w-5 text-green-600" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-600" />
            )}
          </div>
          <h3 className="text-2xl font-bold text-secondary-900">
            {salesMetrics?.totalOrders.toLocaleString() || '0'}
          </h3>
          <p className="text-secondary-600">Total Orders</p>
          <div className={`mt-4 text-sm ${(salesMetrics?.orderGrowth || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {(salesMetrics?.orderGrowth || 0) >= 0 ? '+' : ''}{(salesMetrics?.orderGrowth || 0).toFixed(1)}% vs last period
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
          <div className="flex items-center justify-between mb-2">
            <Users className="h-6 w-6 text-purple-600" />
            {(salesMetrics?.conversionGrowth || 0) >= 0 ? (
              <TrendingUp className="h-5 w-5 text-green-600" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-600" />
            )}
          </div>
          <h3 className="text-2xl font-bold text-secondary-900">
            {(salesMetrics?.conversionRate || 0).toFixed(1)}%
          </h3>
          <p className="text-secondary-600">Conversion Rate</p>
          <div className={`mt-4 text-sm ${(salesMetrics?.conversionGrowth || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {(salesMetrics?.conversionGrowth || 0) >= 0 ? '+' : ''}{(salesMetrics?.conversionGrowth || 0).toFixed(1)}% vs last period
          </div>
        </div>
      </div>

      {/* Sales Trend Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <h2 className="text-lg font-semibold text-secondary-900 mb-6">Sales Trend</h2>
        <div className="h-80">
          {revenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip 
                  formatter={(value, name) => [
                    `$${Number(value).toLocaleString()}`,
                    name === 'b2b' ? 'B2B Sales' : 'B2C Sales'
                  ]}
                />
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
          ) : (
            <div className="flex items-center justify-center h-full text-secondary-500">
              No sales data available for the selected period
            </div>
          )}
        </div>
      </div>

      {/* Product Performance */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <h2 className="text-lg font-semibold text-secondary-900 mb-6">Product Performance</h2>
        {productPerformance.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-secondary-600 border-b border-secondary-100">
                  <th className="pb-3 font-medium">Product</th>
                  <th className="pb-3 font-medium">Sales</th>
                  <th className="pb-3 font-medium">Revenue</th>
                  <th className="pb-3 font-medium">Growth</th>
                  <th className="pb-3 font-medium">Stock</th>
                </tr>
              </thead>
              <tbody>
                {productPerformance.slice(0, 10).map((product, index) => (
                  <tr key={product.id} className="border-b border-secondary-100">
                    <td className="py-4">
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-secondary-500">{product.category}</div>
                      </div>
                    </td>
                    <td className="py-4">{product.sales}</td>
                    <td className="py-4">${product.revenue.toLocaleString()}</td>
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
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        product.stock > 50 ? 'bg-green-100 text-green-800' :
                        product.stock > 10 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {product.stock} units
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-secondary-500 py-8">
            No product performance data available
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesAnalytics;