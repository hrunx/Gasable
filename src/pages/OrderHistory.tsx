import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  BarChart2,
  Filter,
  Download,
  Calendar,
  MapPin,
  Package,
  User,
  Clock,
  Search,
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowUpDown,
  Eye,
  FileText,
  Printer,
  Share2,
  MoreVertical,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface OrderHistoryItem {
  id: string;
  orderNumber: string;
  date: string;
  customer: {
    name: string;
    type: 'B2B' | 'B2C';
  };
  product: {
    name: string;
    quantity: number;
    amount: number;
  };
  status: 'completed' | 'cancelled' | 'returned';
  rating: number;
  feedback?: string;
  satisfaction: 'satisfied' | 'neutral' | 'dissatisfied';
}

const mockOrderHistory: OrderHistoryItem[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    date: '2024-03-15',
    customer: {
      name: 'Acme Industries',
      type: 'B2B',
    },
    product: {
      name: 'Industrial Gas Tank',
      quantity: 5,
      amount: 2499.95,
    },
    status: 'completed',
    rating: 5,
    feedback: 'Excellent service and product quality',
    satisfaction: 'satisfied',
  },
  // Add more mock data...
];

const OrderHistory = () => {
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [filterStatus, setFilterStatus] = useState('all');

  const stats = {
    totalOrders: 156,
    completionRate: 98.5,
    averageRating: 4.8,
    satisfactionRate: 96,
  };

  const ratingDistribution = [
    { rating: 5, count: 85 },
    { rating: 4, count: 45 },
    { rating: 3, count: 15 },
    { rating: 2, count: 8 },
    { rating: 1, count: 3 },
  ];

  const satisfactionData = [
    { name: 'Satisfied', value: 75, color: '#34D399' },
    { name: 'Neutral', value: 15, color: '#FCD34D' },
    { name: 'Dissatisfied', value: 10, color: '#F87171' },
  ];

  const trendData = [
    { month: 'Jan', orders: 120, rating: 4.7 },
    { month: 'Feb', orders: 135, rating: 4.8 },
    { month: 'Mar', orders: 156, rating: 4.9 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <h1 className="text-2xl font-bold text-secondary-900 mb-2">
          📊 Order History & Analytics
        </h1>
        <p className="text-secondary-600">
          Track your order history, analyze customer feedback, and monitor satisfaction trends.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100"
        >
          <div className="flex items-center justify-between mb-2">
            <Package className="h-6 w-6 text-blue-600" />
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-secondary-900">{stats.totalOrders}</h3>
          <p className="text-secondary-600">Total Orders</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100"
        >
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <span className="text-sm text-green-600">+2.5%</span>
          </div>
          <h3 className="text-2xl font-bold text-secondary-900">{stats.completionRate}%</h3>
          <p className="text-secondary-600">Completion Rate</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100"
        >
          <div className="flex items-center justify-between mb-2">
            <Star className="h-6 w-6 text-yellow-600" />
            <span className="text-sm text-green-600">+0.3</span>
          </div>
          <h3 className="text-2xl font-bold text-secondary-900">{stats.averageRating}</h3>
          <p className="text-secondary-600">Average Rating</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100"
        >
          <div className="flex items-center justify-between mb-2">
            <ThumbsUp className="h-6 w-6 text-purple-600" />
            <span className="text-sm text-green-600">+1.2%</span>
          </div>
          <h3 className="text-2xl font-bold text-secondary-900">{stats.satisfactionRate}%</h3>
          <p className="text-secondary-600">Satisfaction Rate</p>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Rating Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
          <h2 className="text-lg font-semibold text-secondary-900 mb-6">Rating Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ratingDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="rating" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip />
                <Bar dataKey="count" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Satisfaction Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
          <h2 className="text-lg font-semibold text-secondary-900 mb-6">Customer Satisfaction</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={satisfactionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {satisfactionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            {satisfactionData.map((item) => (
              <div key={item.name} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-secondary-600">
                  {item.name} ({item.value}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-secondary-900">Recent Orders</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search orders..."
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

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-secondary-600 border-b border-secondary-100">
                <th className="pb-3 font-medium">Order #</th>
                <th className="pb-3 font-medium">Customer</th>
                <th className="pb-3 font-medium">Product</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Rating</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockOrderHistory.map((order) => (
                <tr key={order.id} className="border-b border-secondary-100">
                  <td className="py-4 font-medium">{order.orderNumber}</td>
                  <td className="py-4">
                    <div>
                      <div className="font-medium">{order.customer.name}</div>
                      <div className="text-sm text-secondary-600">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          order.customer.type === 'B2B'
                            ? 'bg-purple-50 text-purple-700'
                            : 'bg-blue-50 text-blue-700'
                        }`}>
                          {order.customer.type}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <div>
                      <div className="font-medium">{order.product.name}</div>
                      <div className="text-sm text-secondary-600">
                        Qty: {order.product.quantity}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 font-medium">
                    ${order.product.amount.toFixed(2)}
                  </td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      order.status === 'completed'
                        ? 'bg-green-50 text-green-700'
                        : order.status === 'cancelled'
                        ? 'bg-red-50 text-red-700'
                        : 'bg-yellow-50 text-yellow-700'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < order.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-secondary-300'
                          }`}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="py-4 text-secondary-600">
                    {order.date}
                  </td>
                  <td className="py-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 hover:bg-secondary-100 rounded text-secondary-600">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-1 hover:bg-secondary-100 rounded text-secondary-600">
                        <FileText className="h-4 w-4" />
                      </button>
                      <button className="p-1 hover:bg-secondary-100 rounded text-secondary-600">
                        <Printer className="h-4 w-4" />
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

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-secondary-600">
            Showing 1 to {mockOrderHistory.length} of {mockOrderHistory.length} entries
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

export default OrderHistory;