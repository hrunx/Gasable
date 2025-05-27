import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Package,
  Truck,
  DollarSign,
  Clock,
  Users,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Filter,
  Calendar,
  Search,
  MapPin,
  ArrowUpRight,
  ArrowDownRight,
  Bell,
  Download,
  Zap,
  Battery,
  Gauge,
  Thermometer,
  Droplets,
  Wind,
} from 'lucide-react';
import {
  AreaChart,
  Area,
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
  BarChart,
  Bar,
} from 'recharts';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Line as MapLine,
} from "react-simple-maps";

// Updated to use a more reliable CDN source
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface LiveOrder {
  id: string;
  customer: string;
  product: string;
  status: 'pending' | 'processing' | 'in_transit' | 'delivered' | 'cancelled';
  amount: number;
  location: {
    name: string;
    coordinates: [number, number];
  };
  timestamp: string;
  eta: string;
}

interface LiveMetric {
  name: string;
  value: number;
  unit: string;
  trend: number;
  status: 'normal' | 'warning' | 'critical';
}

const RealTimeMetrics = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1h');
  const [activeTab, setActiveTab] = useState('overview');

  // Mock live orders
  const [liveOrders] = useState<LiveOrder[]>([
    {
      id: 'ORD-001',
      customer: 'Acme Industries',
      product: 'Industrial Gas Tank',
      status: 'in_transit',
      amount: 2499.95,
      location: {
        name: 'Riyadh',
        coordinates: [46.6753, 24.7136],
      },
      timestamp: new Date().toISOString(),
      eta: '2 hours',
    },
    // Add more mock orders...
  ]);

  // Mock live metrics
  const [liveMetrics] = useState<LiveMetric[]>([
    {
      name: 'Tank Pressure',
      value: 2.4,
      unit: 'bar',
      trend: 0.2,
      status: 'normal',
    },
    {
      name: 'Temperature',
      value: 23,
      unit: '°C',
      trend: -1.5,
      status: 'normal',
    },
    {
      name: 'Flow Rate',
      value: 12.3,
      unit: 'L/min',
      trend: 0.5,
      status: 'warning',
    },
    {
      name: 'Battery Level',
      value: 85,
      unit: '%',
      trend: -0.3,
      status: 'normal',
    },
  ]);

  const performanceData = [
    { time: '09:00', orders: 45, deliveries: 38 },
    { time: '10:00', orders: 52, deliveries: 43 },
    { time: '11:00', orders: 48, deliveries: 41 },
    { time: '12:00', orders: 61, deliveries: 52 },
    { time: '13:00', orders: 55, deliveries: 48 },
    { time: '14:00', orders: 67, deliveries: 59 },
    { time: '15:00', orders: 60, deliveries: 51 },
  ];

  const deliveryLocations = [
    { name: "Riyadh Hub", coordinates: [46.6753, 24.7136], deliveries: 45 },
    { name: "Jeddah Port", coordinates: [39.1925, 21.4858], deliveries: 32 },
    { name: "Dammam Center", coordinates: [50.1033, 26.4207], deliveries: 28 },
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const getStatusColor = (status: LiveOrder['status'] | LiveMetric['status']) => {
    switch (status) {
      case 'delivered':
      case 'normal':
        return 'bg-green-50 text-green-700';
      case 'in_transit':
      case 'processing':
      case 'warning':
        return 'bg-yellow-50 text-yellow-700';
      case 'cancelled':
      case 'critical':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const getMetricIcon = (name: string) => {
    switch (name) {
      case 'Tank Pressure':
        return <Gauge className="h-6 w-6" />;
      case 'Temperature':
        return <Thermometer className="h-6 w-6" />;
      case 'Flow Rate':
        return <Droplets className="h-6 w-6" />;
      case 'Battery Level':
        return <Battery className="h-6 w-6" />;
      default:
        return <Gauge className="h-6 w-6" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900 mb-2">
              ⚡ Real-Time Metrics
            </h1>
            <p className="text-secondary-600">
              Monitor your operations, orders, and IoT devices in real-time
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
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            >
              <option value="1h">Last Hour</option>
              <option value="6h">Last 6 Hours</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
            </select>
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

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-secondary-50 p-6 rounded-xl border border-secondary-100"
          >
            <div className="flex items-center justify-between mb-2">
              <Package className="h-6 w-6 text-blue-600" />
              <span className="text-sm text-green-600">+12.5%</span>
            </div>
            <h3 className="text-2xl font-bold text-secondary-900">156</h3>
            <p className="text-secondary-600">Active Orders</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-secondary-50 p-6 rounded-xl border border-secondary-100"
          >
            <div className="flex items-center justify-between mb-2">
              <Truck className="h-6 w-6 text-green-600" />
              <span className="text-sm text-green-600">+8.2%</span>
            </div>
            <h3 className="text-2xl font-bold text-secondary-900">42</h3>
            <p className="text-secondary-600">In Transit</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-secondary-50 p-6 rounded-xl border border-secondary-100"
          >
            <div className="flex items-center justify-between mb-2">
              <Clock className="h-6 w-6 text-yellow-600" />
              <span className="text-sm text-yellow-600">95.8%</span>
            </div>
            <h3 className="text-2xl font-bold text-secondary-900">98.5%</h3>
            <p className="text-secondary-600">On-Time Delivery</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-secondary-50 p-6 rounded-xl border border-secondary-100"
          >
            <div className="flex items-center justify-between mb-2">
              <Users className="h-6 w-6 text-purple-600" />
              <span className="text-sm text-green-600">+15.8%</span>
            </div>
            <h3 className="text-2xl font-bold text-secondary-900">2,648</h3>
            <p className="text-secondary-600">Active Customers</p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Live Map */}
        <div className="col-span-2 bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Live Delivery Map</h2>
            <div className="flex items-center space-x-2">
              <span className="flex items-center text-sm text-secondary-600">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                Active
              </span>
              <span className="flex items-center text-sm text-secondary-600">
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
                In Transit
              </span>
              <span className="flex items-center text-sm text-secondary-600">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                Delayed
              </span>
            </div>
          </div>
          <div className="h-[400px] bg-secondary-50 rounded-lg overflow-hidden">
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{
                scale: 1000,
                center: [45, 25]
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
              {deliveryLocations.map(({ name, coordinates, deliveries }) => (
                <Marker key={name} coordinates={coordinates}>
                  <circle
                    r={Math.sqrt(deliveries) * 2}
                    fill="#0EA5E9"
                    stroke="#fff"
                    strokeWidth={2}
                    opacity={0.8}
                  />
                  <text
                    textAnchor="middle"
                    y={Math.sqrt(deliveries) * 2 + 14}
                    style={{ fontSize: 12, fill: '#1E293B' }}
                  >
                    {name}
                  </text>
                </Marker>
              ))}
            </ComposableMap>
          </div>
        </div>

        {/* Live Orders */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
          <h2 className="text-lg font-semibold mb-6">Live Orders</h2>
          <div className="space-y-4">
            {liveOrders.map((order) => (
              <div
                key={order.id}
                className="p-4 bg-secondary-50 rounded-lg border border-secondary-100"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{order.id}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                    {order.status.replace('_', ' ').charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-secondary-600 mb-2">{order.product}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center text-secondary-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    {order.location.name}
                  </span>
                  <span className="flex items-center text-secondary-600">
                    <Clock className="h-4 w-4 mr-1" />
                    ETA: {order.eta}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* IoT Metrics */}
      <div className="grid grid-cols-4 gap-6">
        {liveMetrics.map((metric, index) => (
          <motion.div
            key={metric.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${getStatusColor(metric.status)}`}>
                {getMetricIcon(metric.name)}
              </div>
              <span className={`flex items-center ${
                metric.trend > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.trend > 0 ? (
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                )}
                {Math.abs(metric.trend)}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-secondary-900 mb-1">
              {metric.value}{metric.unit}
            </h3>
            <p className="text-secondary-600">{metric.name}</p>
          </motion.div>
        ))}
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
          <h2 className="text-lg font-semibold mb-6">Order Performance</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="time" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="orders"
                  stroke="#0EA5E9"
                  fill="#0EA5E9"
                  fillOpacity={0.1}
                  name="Orders"
                />
                <Area
                  type="monotone"
                  dataKey="deliveries"
                  stroke="#6366F1"
                  fill="#6366F1"
                  fillOpacity={0.1}
                  name="Deliveries"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
          <h2 className="text-lg font-semibold mb-6">Delivery Success Rate</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="time" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="deliveries"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeMetrics;