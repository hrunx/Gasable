import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart2,
  Users,
  TruckIcon,
  DollarSign,
  MapPin,
  Star,
  TrendingUp,
  TrendingDown,
  Globe,
  Search,
  Bell,
  Filter,
  Share2,
  UserPlus,
  CircleDollarSign,
  ShoppingCart,
  Percent,
  Package
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker
} from "react-simple-maps";
import { useCompanyEmpty } from '../lib/hooks/useCompanyEmpty';
import { useProductsEmpty } from '../lib/hooks/useProductsEmpty';
import { useOrdersEmpty } from '../lib/hooks/useOrdersEmpty';
import { useStoresEmpty } from '../lib/hooks/useStoresEmpty';
import { useSubscriptionEmpty } from '../lib/hooks/useSubscriptionEmpty';

// Updated to use a more reliable CDN source
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const Dashboard = () => {
  const { company, loading: companyLoading } = useCompanyEmpty();
  const { products, loading: productsLoading } = useProductsEmpty({ status: 'active' });
  const { orders, loading: ordersLoading } = useOrdersEmpty({ limit: 5 });
  const { stores, loading: storesLoading } = useStoresEmpty({ status: 'active' });
  const { tier, loading: subscriptionLoading } = useSubscriptionEmpty();

  // Calculate total revenue from orders
  const totalRevenue = orders ? orders.reduce((sum, order) => sum + order.total_amount, 0) : 0;
  
  // Calculate total customers (unique customer IDs from orders)
  const uniqueCustomers = orders ? new Set(orders.map(order => order.customer_id)).size : 0;

  const statsData = [
    {
      title: 'Total Products',
      value: products ? products.length.toString() : '0',
      trend: '0%',
      isPositive: true,
      icon: <Package className="h-6 w-6" />,
    },
    {
      title: 'Total Orders',
      value: orders ? orders.length.toString() : '0',
      trend: '0%',
      isPositive: true,
      icon: <ShoppingCart className="h-6 w-6" />,
    },
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toFixed(0)}`,
      trend: '0%',
      isPositive: true,
      icon: <CircleDollarSign className="h-6 w-6" />,
    },
    {
      title: 'Active Customers',
      value: uniqueCustomers.toString(),
      trend: '0%',
      isPositive: true,
      icon: <Users className="h-6 w-6" />,
    },
  ];

  // Generate sales data based on orders
  const salesData = [
    { name: 'Jan', sales: 0, orders: 0 },
    { name: 'Feb', sales: 0, orders: 0 },
    { name: 'Mar', sales: 0, orders: 0 },
    { name: 'Apr', sales: 0, orders: 0 },
    { name: 'May', sales: 0, orders: 0 },
    { name: 'Jun', sales: 0, orders: 0 },
  ];

  // Generate geographical data based on stores
  const geographicalData = stores && stores.length > 0 ? stores.map(store => ({
    country: store.country || 'SA',
    coordinates: [45.0792, 23.8859] as [number, number], // Default to Saudi Arabia if no specific coordinates
    value: 0,
    trend: '0%',
  })) : [
    {
      country: 'SA',
      coordinates: [45.0792, 23.8859] as [number, number],
      value: 0,
      trend: '0%',
    }
  ];

  // Stock data for pie chart
  const stockData = [
    { name: 'Category 1', value: 0, color: '#0EA5E9' },
    { name: 'Category 2', value: 0, color: '#6366F1' },
    { name: 'Category 3', value: 0, color: '#8B5CF6' },
  ];

  const isLoading = companyLoading || productsLoading || ordersLoading || storesLoading || subscriptionLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Actions */}
      <div className="flex items-center justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          />
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-secondary-100 rounded-lg text-secondary-600">
            <Filter className="h-5 w-5" />
          </button>
          <button className="p-2 hover:bg-secondary-100 rounded-lg text-secondary-600">
            <Share2 className="h-5 w-5" />
          </button>
          <button className="btn-primary flex items-center space-x-2">
            <UserPlus className="h-5 w-5" />
            <span>Invite Team</span>
          </button>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <h1 className="text-2xl font-bold text-secondary-900 mb-2">
          Welcome back{company ? `, ${company.legal_name || company.name || 'Supplier'}` : ''}!
        </h1>
        <p className="text-secondary-600">
          Here's what's happening with your business today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 bg-primary-50 rounded-lg text-primary-600">
                {stat.icon}
              </div>
              <span className={`flex items-center text-sm font-medium ${
                stat.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.isPositive ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                {stat.trend}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-secondary-900 mt-4">{stat.value}</h3>
            <p className="text-sm text-secondary-600">{stat.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-secondary-900">Sales Overview</h3>
            <select className="input-field w-auto text-sm">
              <option>Last 6 months</option>
              <option>Last year</option>
              <option>All time</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#0EA5E9"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#6366F1"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Geographical Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-secondary-900">
              Sales Per Geographical Location
            </h3>
            <div className="flex items-center text-secondary-600">
              <Globe className="h-5 w-5 mr-2" />
              <span className="text-sm">Global View</span>
            </div>
          </div>
          
          {/* World Map */}
          <div className="h-[300px] mb-6">
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{
                scale: 150,
                center: [20, 30]
              }}
            >
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="#E2E8F0"
                      stroke="#CBD5E1"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: 'none' },
                        hover: { fill: '#CBD5E1', outline: 'none' },
                        pressed: { outline: 'none' },
                      }}
                    />
                  ))
                }
              </Geographies>
              {geographicalData.map(({ country, coordinates, value }) => (
                <Marker key={country} coordinates={coordinates}>
                  <circle
                    r={1}
                    fill="#0EA5E9"
                    stroke="#fff"
                    strokeWidth={2}
                    opacity={0.8}
                  />
                </Marker>
              ))}
            </ComposableMap>
          </div>

          {/* Country List */}
          <div className="space-y-4">
            {geographicalData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-primary-600 mr-2" />
                  <span className="font-medium">{item.country}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="font-medium">${item.value.toLocaleString()}</span>
                  <span className={`text-sm ${
                    item.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {item.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
          <h3 className="text-lg font-semibold text-secondary-900 mb-6">Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-secondary-600 border-b border-secondary-100">
                  <th className="pb-3 font-medium">Order #</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {orders && orders.length > 0 ? (
                  orders.slice(0, 5).map((order) => (
                    <tr key={order.id} className="border-b border-secondary-100">
                      <td className="py-4">{order.order_number}</td>
                      <td className="py-4">{order.customer_name}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          order.status === 'completed'
                            ? 'bg-green-50 text-green-700'
                            : order.status === 'processing'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-yellow-50 text-yellow-700'
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4">{new Date(order.created_at).toLocaleDateString()}</td>
                      <td className="py-4 text-right font-medium">${order.total_amount.toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr className="border-b border-secondary-100">
                    <td colSpan={5} className="py-4 text-center text-secondary-500">
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stock Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
          <h3 className="text-lg font-semibold text-secondary-900 mb-6">Stock Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stockData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stockData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 space-y-2">
            {stockData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-secondary-600">{item.name}</span>
                </div>
                <span className="font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;