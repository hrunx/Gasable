import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
  Package,
  Truck,
  DollarSign,
  Clock,
  Filter,
  Search,
  Download,
  ChevronDown,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  MessageSquare,
  MoreVertical,
  Calendar,
  ArrowUpDown,
  Printer,
  FileText,
  Share2,
  Bell,
  RefreshCw,
  Trash2,
  Edit,
  ExternalLink,
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

interface Order {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    type: 'B2B' | 'B2C';
    contact: string;
    email: string;
  };
  product: {
    name: string;
    quantity: number;
    price: number;
    sku: string;
  };
  delivery: {
    method: 'pickup' | 'delivery';
    address?: string;
    status: 'pending' | 'processing' | 'completed' | 'cancelled';
    date: string;
    tracking?: string;
    notes?: string;
  };
  payment: {
    method: string;
    status: 'paid' | 'pending' | 'failed';
    amount: number;
    transactionId?: string;
  };
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
}

const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    customer: {
      name: 'Acme Industries',
      type: 'B2B',
      contact: '+1-234-567-8900',
      email: 'orders@acme.com',
    },
    product: {
      name: 'Industrial Gas Tank',
      quantity: 5,
      price: 499.99,
      sku: 'IGT-001',
    },
    delivery: {
      method: 'delivery',
      address: '123 Industrial Park, Business District',
      status: 'processing',
      date: '2024-03-20',
      tracking: 'TRK-123456',
      notes: 'Delivery to loading dock only',
    },
    payment: {
      method: 'Bank Transfer',
      status: 'paid',
      amount: 2499.95,
      transactionId: 'TXN-123456',
    },
    createdAt: '2024-03-15 09:30:00',
    priority: 'high',
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    customer: {
      name: 'John Smith',
      type: 'B2C',
      contact: '+1-234-567-8901',
      email: 'john.smith@email.com',
    },
    product: {
      name: 'Premium Gas Cylinder',
      quantity: 2,
      price: 99.99,
      sku: 'PGC-002',
    },
    delivery: {
      method: 'pickup',
      status: 'pending',
      date: '2024-03-21',
    },
    payment: {
      method: 'Credit Card',
      status: 'pending',
      amount: 199.98,
      transactionId: 'TXN-123457',
    },
    createdAt: '2024-03-15 10:15:00',
    priority: 'medium',
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    customer: {
      name: 'Green Energy Corp',
      type: 'B2B',
      contact: '+1-234-567-8902',
      email: 'orders@greenenergy.com',
    },
    product: {
      name: 'Solar Panel Kit',
      quantity: 10,
      price: 799.99,
      sku: 'SPK-003',
    },
    delivery: {
      method: 'delivery',
      address: '456 Green Street, Eco District',
      status: 'completed',
      date: '2024-03-19',
      tracking: 'TRK-123457',
      notes: 'Installation team required',
    },
    payment: {
      method: 'Bank Transfer',
      status: 'paid',
      amount: 7999.90,
      transactionId: 'TXN-123458',
    },
    createdAt: '2024-03-15 11:00:00',
    priority: 'low',
  },
];

const OrdersShipments = () => {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof Order>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedOrders(filteredOrders.map(order => order.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} for orders:`, selectedOrders);
    // Implement bulk actions here
  };

  const getStatusColor = (status: Order['delivery']['status'] | Order['payment']['status']) => {
    switch (status) {
      case 'completed':
      case 'paid':
        return 'bg-green-50 text-green-700';
      case 'processing':
      case 'pending':
        return 'bg-yellow-50 text-yellow-700';
      case 'cancelled':
      case 'failed':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const getPriorityColor = (priority: Order['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 text-red-700';
      case 'medium':
        return 'bg-yellow-50 text-yellow-700';
      case 'low':
        return 'bg-green-50 text-green-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const getStatusIcon = (status: Order['delivery']['status'] | Order['payment']['status']) => {
    switch (status) {
      case 'completed':
      case 'paid':
        return <CheckCircle className="h-4 w-4" />;
      case 'processing':
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'cancelled':
      case 'failed':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const stats = [
    {
      icon: <Package className="h-6 w-6 text-blue-600" />,
      value: '156',
      label: 'New Orders',
      trend: '+12.5%',
      color: 'bg-blue-50 border-blue-100',
    },
    {
      icon: <Truck className="h-6 w-6 text-green-600" />,
      value: '42',
      label: 'In Transit',
      trend: '+8.2%',
      color: 'bg-green-50 border-green-100',
    },
    {
      icon: <DollarSign className="h-6 w-6 text-purple-600" />,
      value: '$12.5k',
      label: 'Revenue',
      trend: '+15.8%',
      color: 'bg-purple-50 border-purple-100',
    },
    {
      icon: <Clock className="h-6 w-6 text-yellow-600" />,
      value: '98.5%',
      label: 'On-Time Delivery',
      trend: '+2.3%',
      color: 'bg-yellow-50 border-yellow-100',
    },
  ];

  const filteredOrders = mockOrders.filter(order => {
    if (filterStatus !== 'all' && order.delivery.status !== filterStatus) {
      return false;
    }
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        order.orderNumber.toLowerCase().includes(searchLower) ||
        order.customer.name.toLowerCase().includes(searchLower) ||
        order.product.name.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const orderTrendData = [
    { name: 'Mon', orders: 45, deliveries: 38 },
    { name: 'Tue', orders: 52, deliveries: 43 },
    { name: 'Wed', orders: 48, deliveries: 41 },
    { name: 'Thu', orders: 61, deliveries: 52 },
    { name: 'Fri', orders: 55, deliveries: 48 },
    { name: 'Sat', orders: 67, deliveries: 59 },
    { name: 'Sun', orders: 60, deliveries: 51 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900 mb-2">
              📦 Orders & Shipments
            </h1>
            <p className="text-secondary-600">
              Manage your orders, track shipments, and monitor delivery performance.
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
            <button className="p-2 rounded-lg text-secondary-600 hover:bg-secondary-100 relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </button>
            <button className="px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors flex items-center space-x-2">
              <Download className="h-5 w-5" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border ${stat.color}`}
            >
              <div className="flex items-center justify-between mb-2">
                {stat.icon}
                <span className="text-sm text-green-600">
                  {stat.trend}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-secondary-900 mb-1">
                {stat.value}
              </h3>
              <p className="text-sm text-secondary-600">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Order Trend Chart */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-secondary-900 mb-4">Order Trends</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={orderTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="orders"
                  stroke="#0EA5E9"
                  fill="#0EA5E9"
                  fillOpacity={0.1}
                />
                <Area
                  type="monotone"
                  dataKey="deliveries"
                  stroke="#6366F1"
                  fill="#6366F1"
                  fillOpacity={0.1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button className="px-4 py-2 border border-secondary-200 rounded-lg hover:bg-secondary-50 flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Date Range</span>
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center space-x-2">
            {selectedOrders.length > 0 && (
              <>
                <button
                  onClick={() => handleBulkAction('print')}
                  className="p-2 hover:bg-secondary-100 rounded-lg text-secondary-600"
                >
                  <Printer className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleBulkAction('export')}
                  className="p-2 hover:bg-secondary-100 rounded-lg text-secondary-600"
                >
                  <FileText className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleBulkAction('share')}
                  className="p-2 hover:bg-secondary-100 rounded-lg text-secondary-600"
                >
                  <Share2 className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-secondary-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-secondary-50 border-b border-secondary-100">
              <th className="py-4 px-6 text-left">
                <input
                  type="checkbox"
                  checked={selectedOrders.length === filteredOrders.length}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
              </th>
              <th
                className="py-4 px-6 text-left cursor-pointer"
                onClick={() => setSortField('orderNumber')}
              >
                <div className="flex items-center space-x-2">
                  <span>Order #</span>
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </th>
              <th className="py-4 px-6 text-left">Customer</th>
              <th className="py-4 px-6 text-left">Product</th>
              <th className="py-4 px-6 text-left">Delivery</th>
              <th className="py-4 px-6 text-left">Payment</th>
              <th
                className="py-4 px-6 text-left cursor-pointer"
                onClick={() => setSortField('createdAt')}
              >
                <div className="flex items-center space-x-2">
                  <span>Date</span>
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </th>
              <th className="py-4 px-6 text-left">Priority</th>
              <th className="py-4 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <React.Fragment key={order.id}>
                <tr className="border-b border-secondary-100 hover:bg-secondary-50">
                  <td className="py-4 px-6">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => handleSelectOrder(order.id)}
                      className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                    />
                  </td>
                  <td className="py-4 px-6 font-medium">{order.orderNumber}</td>
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-medium">{order.customer.name}</div>
                      <div className="text-sm text-secondary-600">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          order.customer.type === 'B2B' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'
                        }`}>
                          {order.customer.type}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-medium">{order.product.name}</div>
                      <div className="text-sm text-secondary-600">
                        SKU: {order.product.sku} | Qty: {order.product.quantity}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(order.delivery.status)}
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.delivery.status)}`}>
                        {order.delivery.status.charAt(0).toUpperCase() + order.delivery.status.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <div className={`flex items-center space-x-2 ${getStatusColor(order.payment.status)}`}>
                        {getStatusIcon(order.payment.status)}
                        <span>${order.payment.amount.toFixed(2)}</span>
                      </div>
                      <div className="text-sm text-secondary-600">
                        {order.payment.method}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-secondary-600">
                    {format(new Date(order.createdAt), 'MMM d, yyyy')}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(order.priority)}`}>
                      {order.priority.charAt(0).toUpperCase() + order.priority.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setExpandedOrder(order.id === expandedOrder ? null : order.id)}
                        className="p-1 hover:bg-secondary-100 rounded text-secondary-600"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-1 hover:bg-secondary-100 rounded text-secondary-600">
                        <MessageSquare className="h-4 w-4" />
                      </button>
                      <div className="relative">
                        <button
                          onClick={() => setShowActionMenu(showActionMenu === order.id ? null : order.id)}
                          className="p-1 hover:bg-secondary-100 rounded text-secondary-600"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        {showActionMenu === order.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-secondary-100 py-1 z-10">
                            <button
                              className="w-full px-4 py-2 text-left hover:bg-secondary-50 flex items-center space-x-2"
                              onClick={() => {/* Handle edit */}}
                            >
                              <Edit className="h-4 w-4" />
                              <span>Edit Order</span>
                            </button>
                            <button
                              className="w-full px-4 py-2 text-left hover:bg-secondary-50 flex items-center space-x-2"
                              onClick={() => {/* Handle view details */}}
                            >
                              <ExternalLink className="h-4 w-4" />
                              <span>View Details</span>
                            </button>
                            <button
                              className="w-full px-4 py-2 text-left hover:bg-secondary-50 flex items-center space-x-2 text-red-600"
                              onClick={() => {/* Handle delete */}}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span>Delete Order</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
                {expandedOrder === order.id && (
                  <tr className="bg-secondary-50">
                    <td colSpan={9} className="py-4 px-6">
                      <div className="grid grid-cols-3 gap-6">
                        <div>
                          <h4 className="font-medium mb-2">Customer Details</h4>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2 text-secondary-600">
                              <Phone className="h-4 w-4" />
                              <span>{order.customer.contact}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-secondary-600">
                              <Mail className="h-4 w-4" />
                              <span>{order.customer.email}</span>
                            </div>
                            {order.delivery.address && (
                              <div className="flex items-center space-x-2 text-secondary-600">
                                <MapPin className="h-4 w-4" />
                                <span>{order.delivery.address}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Delivery Details</h4>
                          <div className="space-y-2">
                            <div className="text-secondary-600">
                              Method: {order.delivery.method.charAt(0).toUpperCase() + order.delivery.method.slice(1)}
                            </div>
                            <div className="text-secondary-600">
                              Date: {order.delivery.date}
                            </div>
                            {order.delivery.tracking && (
                              <div className="text-secondary-600">
                                Tracking: {order.delivery.tracking}
                              </div>
                            )}
                            {order.delivery.notes && (
                              <div className="text-secondary-600">
                                Notes: {order.delivery.notes}
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Payment Details</h4>
                          <div className="space-y-2">
                            <div className="text-secondary-600">
                              Method: {order.payment.method}
                            </div>
                            <div className="text-secondary-600">
                              Amount: ${order.payment.amount.toFixed(2)}
                            </div>
                            <div className="text-secondary-600">
                              Status: {order.payment.status.charAt(0).toUpperCase() + order.payment.status.slice(1)}
                            </div>
                            {order.payment.transactionId && (
                              <div className="text-secondary-600">
                                Transaction ID: {order.payment.transactionId}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="p-4 border-t border-secondary-100 flex items-center justify-between">
          <div className="text-sm text-secondary-600">
            Showing 1 to {filteredOrders.length} of {filteredOrders.length} entries
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

export default OrdersShipments;