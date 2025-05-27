import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  FileText,
  Download,
  Filter,
  Calendar,
  Search,
  CreditCard,
  Wallet,
  Receipt,
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowUpDown,
  MoreVertical,
  Printer,
  ExternalLink,
  RefreshCw,
  ChevronDown,
  Building2,
  Package,
  Tag,
  Percent,
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

interface Transaction {
  id: string;
  type: 'sale' | 'refund' | 'commission' | 'payout';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  reference: string;
  customer?: {
    name: string;
    type: 'B2B' | 'B2C';
  };
  product?: {
    name: string;
    quantity: number;
  };
  paymentMethod?: string;
}

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'sale',
    amount: 2499.95,
    status: 'completed',
    date: '2024-03-15',
    reference: 'INV-2024-001',
    customer: {
      name: 'Acme Industries',
      type: 'B2B',
    },
    product: {
      name: 'Industrial Gas Tank',
      quantity: 5,
    },
    paymentMethod: 'Bank Transfer',
  },
  {
    id: '2',
    type: 'commission',
    amount: -124.99,
    status: 'completed',
    date: '2024-03-15',
    reference: 'COM-2024-001',
  },
  {
    id: '3',
    type: 'refund',
    amount: -199.99,
    status: 'pending',
    date: '2024-03-14',
    reference: 'REF-2024-001',
    customer: {
      name: 'John Smith',
      type: 'B2C',
    },
    product: {
      name: 'Premium Gas Cylinder',
      quantity: 1,
    },
  },
];

const Finance = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Analytics Data
  const stats = {
    revenue: {
      current: 768432.50,
      previous: 698245.75,
      trend: 10.05,
    },
    pendingPayments: {
      amount: 45678.90,
      count: 23,
    },
    commissions: {
      amount: 38421.63,
      rate: 5,
    },
    netIncome: {
      current: 730010.87,
      previous: 663333.46,
      trend: 10.05,
    },
  };

  const revenueData = [
    { date: '2024-01', revenue: 698245.75, expenses: 34912.29 },
    { date: '2024-02', revenue: 725678.90, expenses: 36283.95 },
    { date: '2024-03', revenue: 768432.50, expenses: 38421.63 },
  ];

  const paymentMethodsData = [
    { name: 'Bank Transfer', value: 45, color: '#0EA5E9' },
    { name: 'Credit Card', value: 30, color: '#6366F1' },
    { name: 'Digital Wallet', value: 15, color: '#8B5CF6' },
    { name: 'Cash', value: 10, color: '#34D399' },
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 text-green-700';
      case 'pending':
        return 'bg-yellow-50 text-yellow-700';
      case 'failed':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const getStatusIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'failed':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'sale':
        return <DollarSign className="h-5 w-5 text-green-600" />;
      case 'refund':
        return <Receipt className="h-5 w-5 text-red-600" />;
      case 'commission':
        return <Percent className="h-5 w-5 text-blue-600" />;
      case 'payout':
        return <CreditCard className="h-5 w-5 text-purple-600" />;
      default:
        return <DollarSign className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900 mb-2">
              💰 Finance & Revenue
            </h1>
            <p className="text-secondary-600">
              Track your earnings, manage payments, and monitor financial performance.
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
              <Download className="h-5 w-5" />
              <span>Export</span>
            </button>
            <button className="btn-primary flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Generate Report</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-6 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-secondary-50 p-6 rounded-xl border border-secondary-100"
          >
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="h-6 w-6 text-green-600" />
              <div className={`flex items-center text-sm ${
                stats.revenue.trend >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {stats.revenue.trend >= 0 ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                {Math.abs(stats.revenue.trend)}%
              </div>
            </div>
            <h3 className="text-2xl font-bold text-secondary-900">
              ${stats.revenue.current.toLocaleString()}
            </h3>
            <p className="text-secondary-600">Gross Revenue</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-secondary-50 p-6 rounded-xl border border-secondary-100"
          >
            <div className="flex items-center justify-between mb-2">
              <Clock className="h-6 w-6 text-yellow-600" />
              <span className="text-sm text-yellow-600">
                {stats.pendingPayments.count} pending
              </span>
            </div>
            <h3 className="text-2xl font-bold text-secondary-900">
              ${stats.pendingPayments.amount.toLocaleString()}
            </h3>
            <p className="text-secondary-600">Pending Payments</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-secondary-50 p-6 rounded-xl border border-secondary-100"
          >
            <div className="flex items-center justify-between mb-2">
              <Percent className="h-6 w-6 text-blue-600" />
              <span className="text-sm text-blue-600">{stats.commissions.rate}%</span>
            </div>
            <h3 className="text-2xl font-bold text-secondary-900">
              ${stats.commissions.amount.toLocaleString()}
            </h3>
            <p className="text-secondary-600">Platform Commissions</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-secondary-50 p-6 rounded-xl border border-secondary-100"
          >
            <div className="flex items-center justify-between mb-2">
              <Wallet className="h-6 w-6 text-purple-600" />
              <div className={`flex items-center text-sm ${
                stats.netIncome.trend >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {stats.netIncome.trend >= 0 ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                {Math.abs(stats.netIncome.trend)}%
              </div>
            </div>
            <h3 className="text-2xl font-bold text-secondary-900">
              ${stats.netIncome.current.toLocaleString()}
            </h3>
            <p className="text-secondary-600">Net Income</p>
          </motion.div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-secondary-900">Revenue Trend</h2>
            <select className="px-3 py-1.5 border border-secondary-200 rounded-lg text-sm">
              <option value="3m">Last 3 months</option>
              <option value="6m">Last 6 months</option>
              <option value="1y">Last year</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
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
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stroke="#F43F5E"
                  fill="#F43F5E"
                  fillOpacity={0.1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
          <h2 className="text-lg font-semibold text-secondary-900 mb-6">Payment Methods</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentMethodsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {paymentMethodsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {paymentMethodsData.map((method) => (
              <div key={method.name} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: method.color }}
                />
                <span className="text-sm text-secondary-600">
                  {method.name} ({method.value}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-sm border border-secondary-100">
        <div className="p-6 border-b border-secondary-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-secondary-900">Recent Transactions</h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>
              <button className="p-2 hover:bg-secondary-100 rounded-lg text-secondary-600">
                <Filter className="h-5 w-5" />
              </button>
              <button className="p-2 hover:bg-secondary-100 rounded-lg text-secondary-600">
                <Calendar className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-secondary-50">
                <th className="py-4 px-6 text-left font-medium text-secondary-600">Type</th>
                <th className="py-4 px-6 text-left font-medium text-secondary-600">Reference</th>
                <th className="py-4 px-6 text-left font-medium text-secondary-600">Customer</th>
                <th className="py-4 px-6 text-left font-medium text-secondary-600">Amount</th>
                <th className="py-4 px-6 text-left font-medium text-secondary-600">Status</th>
                <th className="py-4 px-6 text-left font-medium text-secondary-600">Date</th>
                <th className="py-4 px-6 text-left font-medium text-secondary-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockTransactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-secondary-100">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      {getTransactionIcon(transaction.type)}
                      <span className="capitalize">{transaction.type}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-medium">{transaction.reference}</td>
                  <td className="py-4 px-6">
                    {transaction.customer ? (
                      <div>
                        <div className="font-medium">{transaction.customer.name}</div>
                        <div className="text-sm text-secondary-600">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            transaction.customer.type === 'B2B'
                              ? 'bg-purple-50 text-purple-700'
                              : 'bg-blue-50 text-blue-700'
                          }`}>
                            {transaction.customer.type}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-secondary-500">-</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span className={transaction.amount < 0 ? 'text-red-600' : 'text-green-600'}>
                      {transaction.amount < 0 ? '-' : ''}${Math.abs(transaction.amount).toFixed(2)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className={`flex items-center space-x-2 ${getStatusColor(transaction.status)}`}>
                      {getStatusIcon(transaction.status)}
                      <span className="capitalize">{transaction.status}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-secondary-600">{transaction.date}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
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

        <div className="p-4 border-t border-secondary-100 flex items-center justify-between">
          <div className="text-sm text-secondary-600">
            Showing 1 to {mockTransactions.length} of {mockTransactions.length} entries
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

export default Finance;