import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  Truck,
  Clock,
  Users,
  AlertCircle,
  RefreshCw,
  Filter,
  MapPin,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Battery,
  Gauge,
  Thermometer,
  Droplets,
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
} from 'recharts';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { useRealTimeMetrics, LiveOrder, LiveMetric } from '../lib/hooks/useRealTimeMetrics';

// Updated to use a more reliable CDN source
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const RealTimeMetrics = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1h');

  const {
    quickStats,
    liveOrders,
    liveMetrics,
    performanceData,
    deliveryLocations,
    loading,
    error,
    refresh,
  } = useRealTimeMetrics(selectedTimeframe);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refresh();
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

  const formatTrend = (trend: number) => {
    const isPositive = trend >= 0;
    return {
      value: Math.abs(trend).toFixed(1),
      isPositive,
      color: isPositive ? 'text-green-600' : 'text-red-600',
      icon: isPositive ? ArrowUpRight : ArrowDownRight,
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span className="ml-2 text-secondary-600">Loading metrics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
          <span className="text-red-800">Error loading metrics: {error}</span>
        </div>
      </div>
    );
  }

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
              <span className={`text-sm ${formatTrend(quickStats?.trends.activeOrders || 0).color}`}>
                {formatTrend(quickStats?.trends.activeOrders || 0).isPositive ? '+' : ''}
                {formatTrend(quickStats?.trends.activeOrders || 0).value}%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-secondary-900">{quickStats?.activeOrders || 0}</h3>
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
              <span className={`text-sm ${formatTrend(quickStats?.trends.inTransit || 0).color}`}>
                {formatTrend(quickStats?.trends.inTransit || 0).isPositive ? '+' : ''}
                {formatTrend(quickStats?.trends.inTransit || 0).value}%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-secondary-900">{quickStats?.inTransit || 0}</h3>
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
              <span className={`text-sm ${formatTrend(quickStats?.trends.onTimeDelivery || 0).color}`}>
                {formatTrend(quickStats?.trends.onTimeDelivery || 0).isPositive ? '+' : ''}
                {formatTrend(quickStats?.trends.onTimeDelivery || 0).value}%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-secondary-900">
              {quickStats?.onTimeDelivery ? `${quickStats.onTimeDelivery.toFixed(1)}%` : '0%'}
            </h3>
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
              <span className={`text-sm ${formatTrend(quickStats?.trends.activeCustomers || 0).color}`}>
                {formatTrend(quickStats?.trends.activeCustomers || 0).isPositive ? '+' : ''}
                {formatTrend(quickStats?.trends.activeCustomers || 0).value}%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-secondary-900">{quickStats?.activeCustomers || 0}</h3>
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
            {liveOrders.length === 0 ? (
              <div className="text-center py-8 text-secondary-500">
                <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No active orders</p>
              </div>
            ) : (
              liveOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 bg-secondary-50 rounded-lg border border-secondary-100"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{order.order_number}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                      {order.status.replace('_', ' ').charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-secondary-600 mb-2">{order.product_name}</p>
                  <p className="text-sm text-secondary-600 mb-2">{order.customer_name}</p>
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
              ))
            )}
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
                {Math.abs(metric.trend).toFixed(1)}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-secondary-900 mb-1">
              {metric.value.toFixed(1)}{metric.unit}
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