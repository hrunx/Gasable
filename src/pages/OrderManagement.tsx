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
  User,
  CreditCard,
  Tag,
  ShoppingCart,
  Save,
  X,
  Plus,
  ArrowRight,
  ArrowLeft,
  Store,
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
    company?: string;
  };
  products: {
    id: string;
    name: string;
    quantity: number;
    price: number;
    sku: string;
    image: string;
  }[];
  delivery: {
    method: 'pickup' | 'delivery';
    address?: string;
    city?: string;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    date: string;
    tracking?: string;
    notes?: string;
    carrier?: string;
  };
  payment: {
    method: string;
    status: 'paid' | 'pending' | 'failed' | 'refunded';
    amount: number;
    transactionId?: string;
    invoiceNumber?: string;
  };
  createdAt: string;
  updatedAt: string;
  priority: 'low' | 'medium' | 'high';
  notes?: string;
  tags?: string[];
}

const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    customer: {
      name: 'Acme Industries',
      type: 'B2B',
      contact: '+966-123-456-7890',
      email: 'orders@acme.com',
      company: 'Acme Industries Ltd.',
    },
    products: [
      {
        id: 'p1',
        name: 'Industrial Gas Tank',
        quantity: 5,
        price: 499.99,
        sku: 'IGT-001',
        image: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=100',
      },
      {
        id: 'p2',
        name: 'Safety Valve',
        quantity: 10,
        price: 49.99,
        sku: 'SV-002',
        image: 'https://images.unsplash.com/photo-1581092335397-9583eb92d232?w=100',
      }
    ],
    delivery: {
      method: 'delivery',
      address: '123 Industrial Park, Business District',
      city: 'Riyadh',
      status: 'processing',
      date: '2024-03-20',
      tracking: 'TRK-123456',
      notes: 'Delivery to loading dock only',
      carrier: 'Aramex',
    },
    payment: {
      method: 'Bank Transfer',
      status: 'paid',
      amount: 2999.85,
      transactionId: 'TXN-123456',
      invoiceNumber: 'INV-2024-001',
    },
    createdAt: '2024-03-15T09:30:00Z',
    updatedAt: '2024-03-15T14:45:00Z',
    priority: 'high',
    notes: 'Customer requested expedited shipping',
    tags: ['bulk order', 'corporate'],
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    customer: {
      name: 'John Smith',
      type: 'B2C',
      contact: '+966-234-567-8901',
      email: 'john.smith@email.com',
    },
    products: [
      {
        id: 'p3',
        name: 'Premium Gas Cylinder',
        quantity: 2,
        price: 99.99,
        sku: 'PGC-002',
        image: 'https://images.unsplash.com/photo-1597773150796-e5c14ebecbf5?w=100',
      }
    ],
    delivery: {
      method: 'pickup',
      status: 'pending',
      date: '2024-03-21',
      city: 'Jeddah',
    },
    payment: {
      method: 'Credit Card',
      status: 'pending',
      amount: 199.98,
      transactionId: 'TXN-123457',
      invoiceNumber: 'INV-2024-002',
    },
    createdAt: '2024-03-15T10:15:00Z',
    updatedAt: '2024-03-15T10:15:00Z',
    priority: 'medium',
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    customer: {
      name: 'Green Energy Corp',
      type: 'B2B',
      contact: '+966-345-678-9012',
      email: 'orders@greenenergy.com',
      company: 'Green Energy Corporation',
    },
    products: [
      {
        id: 'p4',
        name: 'Solar Panel Kit',
        quantity: 10,
        price: 799.99,
        sku: 'SPK-003',
        image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=100',
      },
      {
        id: 'p5',
        name: 'Battery Storage Unit',
        quantity: 5,
        price: 1299.99,
        sku: 'BSU-004',
        image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=100',
      }
    ],
    delivery: {
      method: 'delivery',
      address: '456 Green Street, Eco District',
      city: 'Dammam',
      status: 'shipped',
      date: '2024-03-19',
      tracking: 'TRK-123457',
      notes: 'Installation team required',
      carrier: 'DHL',
    },
    payment: {
      method: 'Bank Transfer',
      status: 'paid',
      amount: 14499.85,
      transactionId: 'TXN-123458',
      invoiceNumber: 'INV-2024-003',
    },
    createdAt: '2024-03-15T11:00:00Z',
    updatedAt: '2024-03-16T09:30:00Z',
    priority: 'high',
    tags: ['bulk order', 'installation required'],
  },
  {
    id: '4',
    orderNumber: 'ORD-2024-004',
    customer: {
      name: 'Sarah Johnson',
      type: 'B2C',
      contact: '+966-456-789-0123',
      email: 'sarah.j@email.com',
    },
    products: [
      {
        id: 'p6',
        name: 'Residential Gas Cylinder',
        quantity: 1,
        price: 79.99,
        sku: 'RGC-005',
        image: 'https://images.unsplash.com/photo-1597773150796-e5c14ebecbf5?w=100',
      }
    ],
    delivery: {
      method: 'delivery',
      address: '789 Residential Ave, Apt 4B',
      city: 'Riyadh',
      status: 'delivered',
      date: '2024-03-16',
      tracking: 'TRK-123458',
      carrier: 'SMSA',
    },
    payment: {
      method: 'Apple Pay',
      status: 'paid',
      amount: 79.99,
      transactionId: 'TXN-123459',
      invoiceNumber: 'INV-2024-004',
    },
    createdAt: '2024-03-15T13:45:00Z',
    updatedAt: '2024-03-16T15:30:00Z',
    priority: 'low',
  },
  {
    id: '5',
    orderNumber: 'ORD-2024-005',
    customer: {
      name: 'Tech Solutions LLC',
      type: 'B2B',
      contact: '+966-567-890-1234',
      email: 'procurement@techsolutions.com',
      company: 'Tech Solutions LLC',
    },
    products: [
      {
        id: 'p7',
        name: 'Industrial Generator',
        quantity: 1,
        price: 5999.99,
        sku: 'IG-006',
        image: 'https://images.unsplash.com/photo-1581092335397-9583eb92d232?w=100',
      }
    ],
    delivery: {
      method: 'delivery',
      address: '101 Tech Park, Innovation District',
      city: 'Jeddah',
      status: 'cancelled',
      date: '2024-03-22',
      notes: 'Customer cancelled order',
    },
    payment: {
      method: 'Bank Transfer',
      status: 'refunded',
      amount: 5999.99,
      transactionId: 'TXN-123460',
      invoiceNumber: 'INV-2024-005',
    },
    createdAt: '2024-03-15T16:20:00Z',
    updatedAt: '2024-03-16T10:15:00Z',
    priority: 'medium',
    notes: 'Customer requested refund due to project cancellation',
    tags: ['high value', 'refunded'],
  },
];

const OrderManagement = () => {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof Order>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEditOrder, setCurrentEditOrder] = useState<Order | null>(null);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

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

  const handleEditOrder = (order: Order) => {
    setCurrentEditOrder({...order});
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (!currentEditOrder) return;
    
    // In a real app, this would update the order in the database
    console.log('Saving order changes:', currentEditOrder);
    
    // Close the modal
    setIsEditModalOpen(false);
    setCurrentEditOrder(null);
  };

  const getStatusColor = (status: Order['delivery']['status'] | Order['payment']['status']) => {
    switch (status) {
      case 'delivered':
      case 'paid':
        return 'bg-green-50 text-green-700';
      case 'processing':
      case 'shipped':
      case 'pending':
        return 'bg-yellow-50 text-yellow-700';
      case 'cancelled':
      case 'failed':
      case 'refunded':
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
      case 'delivered':
      case 'paid':
        return <CheckCircle className="h-4 w-4" />;
      case 'processing':
      case 'shipped':
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'cancelled':
      case 'failed':
      case 'refunded':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const stats = [
    {
      icon: <Package className="h-6 w-6 text-blue-600" />,
      value: '156',
      label: 'Total Orders',
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
    if (filterPriority !== 'all' && order.priority !== filterPriority) {
      return false;
    }
    if (filterPaymentStatus !== 'all' && order.payment.status !== filterPaymentStatus) {
      return false;
    }
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        order.orderNumber.toLowerCase().includes(searchLower) ||
        order.customer.name.toLowerCase().includes(searchLower) ||
        order.products.some(p => p.name.toLowerCase().includes(searchLower))
      );
    }
    return true;
  });

  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortField === 'createdAt' || sortField === 'updatedAt') {
      const dateA = new Date(a[sortField]).getTime();
      const dateB = new Date(b[sortField]).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    }
    
    // For other fields, convert to string for comparison
    const aValue = String(a[sortField]);
    const bValue = String(b[sortField]);
    
    return sortDirection === 'asc' 
      ? aValue.localeCompare(bValue) 
      : bValue.localeCompare(aValue);
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

  const calculateOrderTotal = (order: Order) => {
    return order.products.reduce((total, product) => total + (product.price * product.quantity), 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900 mb-2">
              🛒 Order Management
            </h1>
            <p className="text-secondary-600">
              View, edit, and manage all customer orders in one place
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
              <option value="all">All Delivery Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={filterPaymentStatus}
              onChange={(e) => setFilterPaymentStatus(e.target.value)}
              className="px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            >
              <option value="all">All Payment Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
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
              <th className="py-4 px-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
              </th>
              <th
                className="py-4 px-3 text-left cursor-pointer"
                onClick={() => {
                  if (sortField === 'orderNumber') {
                    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                  } else {
                    setSortField('orderNumber');
                    setSortDirection('asc');
                  }
                }}
              >
                <div className="flex items-center space-x-2">
                  <span>Order #</span>
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </th>
              <th className="py-4 px-3 text-left">Customer</th>
              <th className="py-4 px-3 text-left">Products</th>
              <th className="py-4 px-3 text-left">Total</th>
              <th className="py-4 px-3 text-left">Delivery</th>
              <th className="py-4 px-3 text-left">Payment</th>
              <th
                className="py-4 px-3 text-left cursor-pointer"
                onClick={() => {
                  if (sortField === 'createdAt') {
                    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                  } else {
                    setSortField('createdAt');
                    setSortDirection('desc');
                  }
                }}
              >
                <div className="flex items-center space-x-2">
                  <span>Date</span>
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </th>
              <th className="py-4 px-3 text-left">Priority</th>
              <th className="py-4 px-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedOrders.map((order) => (
              <React.Fragment key={order.id}>
                <tr className={`border-b border-secondary-100 hover:bg-secondary-50 ${
                  expandedOrder === order.id ? 'bg-secondary-50' : ''
                }`}>
                  <td className="py-4 px-3">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => handleSelectOrder(order.id)}
                      className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                    />
                  </td>
                  <td className="py-4 px-3 font-medium">{order.orderNumber}</td>
                  <td className="py-4 px-3">
                    <div>
                      <div className="font-medium">{order.customer.name}</div>
                      <div className="text-sm text-secondary-600">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          order.customer.type === 'B2B' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'
                        }`}>
                          {order.customer.type}
                        </span>
                        {order.customer.company && (
                          <span className="ml-2">{order.customer.company}</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-3">
                    <div className="flex flex-col space-y-1">
                      {order.products.map((product, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-8 h-8 rounded object-cover"
                          />
                          <span className="text-sm">
                            {product.name} x{product.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-3 font-medium">
                    ${order.payment.amount.toFixed(2)}
                  </td>
                  <td className="py-4 px-3">
                    <div className="flex flex-col space-y-1">
                      <div className={`flex items-center space-x-2 ${getStatusColor(order.delivery.status)}`}>
                        {getStatusIcon(order.delivery.status)}
                        <span className="capitalize">{order.delivery.status}</span>
                      </div>
                      <div className="text-sm text-secondary-600">
                        {order.delivery.method === 'delivery' ? (
                          <span className="flex items-center">
                            <Truck className="h-3 w-3 mr-1" />
                            {order.delivery.carrier || 'Standard Delivery'}
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <Store className="h-3 w-3 mr-1" />
                            Pickup
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-3">
                    <div>
                      <div className={`flex items-center space-x-2 ${getStatusColor(order.payment.status)}`}>
                        {getStatusIcon(order.payment.status)}
                        <span className="capitalize">{order.payment.status}</span>
                      </div>
                      <div className="text-sm text-secondary-600">
                        {order.payment.method}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-3 text-secondary-600">
                    {format(new Date(order.createdAt), 'MMM d, yyyy')}
                  </td>
                  <td className="py-4 px-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(order.priority)}`}>
                      {order.priority.charAt(0).toUpperCase() + order.priority.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-3">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => setExpandedOrder(order.id === expandedOrder ? null : order.id)}
                        className="p-1 hover:bg-secondary-100 rounded text-secondary-600"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleEditOrder(order)}
                        className="p-1 hover:bg-secondary-100 rounded text-secondary-600"
                      >
                        <Edit className="h-4 w-4" />
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
                              onClick={() => {/* Handle view details */}}
                            >
                              <Eye className="h-4 w-4" />
                              <span>View Details</span>
                            </button>
                            <button
                              className="w-full px-4 py-2 text-left hover:bg-secondary-50 flex items-center space-x-2"
                              onClick={() => handleEditOrder(order)}
                            >
                              <Edit className="h-4 w-4" />
                              <span>Edit Order</span>
                            </button>
                            <button
                              className="w-full px-4 py-2 text-left hover:bg-secondary-50 flex items-center space-x-2"
                              onClick={() => {/* Handle print */}}
                            >
                              <Printer className="h-4 w-4" />
                              <span>Print Invoice</span>
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
                    <td colSpan={10} className="py-4 px-6">
                      <div className="grid grid-cols-3 gap-6">
                        <div>
                          <h4 className="font-medium mb-2">Customer Details</h4>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2 text-secondary-600">
                              <User className="h-4 w-4" />
                              <span>{order.customer.name}</span>
                            </div>
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
                          <h4 className="font-medium mb-2">Order Details</h4>
                          <div className="space-y-2">
                            <div className="text-secondary-600">
                              <span className="font-medium">Created:</span> {format(new Date(order.createdAt), 'PPpp')}
                            </div>
                            <div className="text-secondary-600">
                              <span className="font-medium">Updated:</span> {format(new Date(order.updatedAt), 'PPpp')}
                            </div>
                            <div className="text-secondary-600">
                              <span className="font-medium">Invoice:</span> {order.payment.invoiceNumber || 'N/A'}
                            </div>
                            {order.notes && (
                              <div className="text-secondary-600">
                                <span className="font-medium">Notes:</span> {order.notes}
                              </div>
                            )}
                            {order.tags && order.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {order.tags.map((tag, idx) => (
                                  <span key={idx} className="px-2 py-0.5 bg-secondary-100 text-secondary-700 rounded-full text-xs">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Products</h4>
                          <div className="space-y-3">
                            {order.products.map((product, idx) => (
                              <div key={idx} className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <img 
                                    src={product.image} 
                                    alt={product.name} 
                                    className="w-10 h-10 rounded object-cover"
                                  />
                                  <div>
                                    <div className="font-medium">{product.name}</div>
                                    <div className="text-xs text-secondary-500">SKU: {product.sku}</div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div>${product.price.toFixed(2)} x {product.quantity}</div>
                                  <div className="font-medium">${(product.price * product.quantity).toFixed(2)}</div>
                                </div>
                              </div>
                            ))}
                            <div className="pt-2 border-t border-secondary-200 flex justify-between font-medium">
                              <span>Total</span>
                              <span>${order.payment.amount.toFixed(2)}</span>
                            </div>
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
            Showing 1 to {sortedOrders.length} of {sortedOrders.length} entries
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

      {/* Edit Order Modal */}
      {isEditModalOpen && currentEditOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Edit Order {currentEditOrder.orderNumber}</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 hover:bg-secondary-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Customer Information */}
              <div className="bg-secondary-50 p-4 rounded-lg">
                <h3 className="font-medium mb-4">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      value={currentEditOrder.customer.name}
                      onChange={(e) => setCurrentEditOrder({
                        ...currentEditOrder,
                        customer: { ...currentEditOrder.customer, name: e.target.value }
                      })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Customer Type
                    </label>
                    <select
                      value={currentEditOrder.customer.type}
                      onChange={(e) => setCurrentEditOrder({
                        ...currentEditOrder,
                        customer: { ...currentEditOrder.customer, type: e.target.value as 'B2B' | 'B2C' }
                      })}
                      className="input-field"
                    >
                      <option value="B2B">B2B</option>
                      <option value="B2C">B2C</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      value={currentEditOrder.customer.contact}
                      onChange={(e) => setCurrentEditOrder({
                        ...currentEditOrder,
                        customer: { ...currentEditOrder.customer, contact: e.target.value }
                      })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={currentEditOrder.customer.email}
                      onChange={(e) => setCurrentEditOrder({
                        ...currentEditOrder,
                        customer: { ...currentEditOrder.customer, email: e.target.value }
                      })}
                      className="input-field"
                    />
                  </div>
                  {currentEditOrder.customer.type === 'B2B' && (
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-secondary-700 mb-1">
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={currentEditOrder.customer.company || ''}
                        onChange={(e) => setCurrentEditOrder({
                          ...currentEditOrder,
                          customer: { ...currentEditOrder.customer, company: e.target.value }
                        })}
                        className="input-field"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Order Details */}
              <div className="bg-secondary-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Order Details</h3>
                  <button className="text-primary-600 flex items-center space-x-1 text-sm">
                    <Plus className="h-4 w-4" />
                    <span>Add Product</span>
                  </button>
                </div>
                
                <div className="space-y-4">
                  {currentEditOrder.products.map((product, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-12 h-12 rounded object-cover"
                        />
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-xs text-secondary-500">SKU: {product.sku}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div>
                          <label className="block text-xs text-secondary-500 mb-1">
                            Price
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400">$</span>
                            <input
                              type="number"
                              value={product.price}
                              onChange={(e) => {
                                const newProducts = [...currentEditOrder.products];
                                newProducts[idx].price = parseFloat(e.target.value);
                                setCurrentEditOrder({
                                  ...currentEditOrder,
                                  products: newProducts
                                });
                              }}
                              className="input-field pl-8 w-24"
                              step="0.01"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-secondary-500 mb-1">
                            Quantity
                          </label>
                          <input
                            type="number"
                            value={product.quantity}
                            onChange={(e) => {
                              const newProducts = [...currentEditOrder.products];
                              newProducts[idx].quantity = parseInt(e.target.value);
                              setCurrentEditOrder({
                                ...currentEditOrder,
                                products: newProducts
                              });
                            }}
                            className="input-field w-20"
                            min="1"
                          />
                        </div>
                        <button
                          onClick={() => {
                            const newProducts = currentEditOrder.products.filter((_, i) => i !== idx);
                            setCurrentEditOrder({
                              ...currentEditOrder,
                              products: newProducts
                            });
                          }}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Information */}
              <div className="bg-secondary-50 p-4 rounded-lg">
                <h3 className="font-medium mb-4">Delivery Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Delivery Method
                    </label>
                    <select
                      value={currentEditOrder.delivery.method}
                      onChange={(e) => setCurrentEditOrder({
                        ...currentEditOrder,
                        delivery: { ...currentEditOrder.delivery, method: e.target.value as 'pickup' | 'delivery' }
                      })}
                      className="input-field"
                    >
                      <option value="pickup">Pickup</option>
                      <option value="delivery">Delivery</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Status
                    </label>
                    <select
                      value={currentEditOrder.delivery.status}
                      onChange={(e) => setCurrentEditOrder({
                        ...currentEditOrder,
                        delivery: { ...currentEditOrder.delivery, status: e.target.value as Order['delivery']['status'] }
                      })}
                      className="input-field"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  {currentEditOrder.delivery.method === 'delivery' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">
                          Address
                        </label>
                        <input
                          type="text"
                          value={currentEditOrder.delivery.address || ''}
                          onChange={(e) => setCurrentEditOrder({
                            ...currentEditOrder,
                            delivery: { ...currentEditOrder.delivery, address: e.target.value }
                          })}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          value={currentEditOrder.delivery.city || ''}
                          onChange={(e) => setCurrentEditOrder({
                            ...currentEditOrder,
                            delivery: { ...currentEditOrder.delivery, city: e.target.value }
                          })}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">
                          Carrier
                        </label>
                        <input
                          type="text"
                          value={currentEditOrder.delivery.carrier || ''}
                          onChange={(e) => setCurrentEditOrder({
                            ...currentEditOrder,
                            delivery: { ...currentEditOrder.delivery, carrier: e.target.value }
                          })}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">
                          Tracking Number
                        </label>
                        <input
                          type="text"
                          value={currentEditOrder.delivery.tracking || ''}
                          onChange={(e) => setCurrentEditOrder({
                            ...currentEditOrder,
                            delivery: { ...currentEditOrder.delivery, tracking: e.target.value }
                          })}
                          className="input-field"
                        />
                      </div>
                    </>
                  )}
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Delivery Notes
                    </label>
                    <textarea
                      value={currentEditOrder.delivery.notes || ''}
                      onChange={(e) => setCurrentEditOrder({
                        ...currentEditOrder,
                        delivery: { ...currentEditOrder.delivery, notes: e.target.value }
                      })}
                      className="input-field h-24"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-secondary-50 p-4 rounded-lg">
                <h3 className="font-medium mb-4">Payment Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Payment Method
                    </label>
                    <input
                      type="text"
                      value={currentEditOrder.payment.method}
                      onChange={(e) => setCurrentEditOrder({
                        ...currentEditOrder,
                        payment: { ...currentEditOrder.payment, method: e.target.value }
                      })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Status
                    </label>
                    <select
                      value={currentEditOrder.payment.status}
                      onChange={(e) => setCurrentEditOrder({
                        ...currentEditOrder,
                        payment: { ...currentEditOrder.payment, status: e.target.value as Order['payment']['status'] }
                      })}
                      className="input-field"
                    >
                      <option value="paid">Paid</option>
                      <option value="pending">Pending</option>
                      <option value="failed">Failed</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400">$</span>
                      <input
                        type="number"
                        value={currentEditOrder.payment.amount}
                        onChange={(e) => setCurrentEditOrder({
                          ...currentEditOrder,
                          payment: { ...currentEditOrder.payment, amount: parseFloat(e.target.value) }
                        })}
                        className="input-field pl-8"
                        step="0.01"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Transaction ID
                    </label>
                    <input
                      type="text"
                      value={currentEditOrder.payment.transactionId || ''}
                      onChange={(e) => setCurrentEditOrder({
                        ...currentEditOrder,
                        payment: { ...currentEditOrder.payment, transactionId: e.target.value }
                      })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Invoice Number
                    </label>
                    <input
                      type="text"
                      value={currentEditOrder.payment.invoiceNumber || ''}
                      onChange={(e) => setCurrentEditOrder({
                        ...currentEditOrder,
                        payment: { ...currentEditOrder.payment, invoiceNumber: e.target.value }
                      })}
                      className="input-field"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="bg-secondary-50 p-4 rounded-lg">
                <h3 className="font-medium mb-4">Additional Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Priority
                    </label>
                    <select
                      value={currentEditOrder.priority}
                      onChange={(e) => setCurrentEditOrder({
                        ...currentEditOrder,
                        priority: e.target.value as Order['priority']
                      })}
                      className="input-field"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      value={currentEditOrder.notes || ''}
                      onChange={(e) => setCurrentEditOrder({
                        ...currentEditOrder,
                        notes: e.target.value
                      })}
                      className="input-field h-24"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {currentEditOrder.tags?.map((tag, idx) => (
                        <div key={idx} className="flex items-center bg-secondary-100 text-secondary-700 rounded-full px-3 py-1">
                          <span className="text-sm">{tag}</span>
                          <button
                            onClick={() => {
                              const newTags = currentEditOrder.tags?.filter((_, i) => i !== idx);
                              setCurrentEditOrder({
                                ...currentEditOrder,
                                tags: newTags
                              });
                            }}
                            className="ml-2 text-secondary-500 hover:text-secondary-700"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                      <button className="flex items-center space-x-1 text-primary-600 px-3 py-1 bg-primary-50 rounded-full hover:bg-primary-100">
                        <Plus className="h-3 w-3" />
                        <span className="text-sm">Add Tag</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 text-secondary-700 hover:bg-secondary-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="btn-primary px-4 py-2 flex items-center space-x-2"
              >
                <Save className="h-5 w-5" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;