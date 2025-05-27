import React from 'react';
import { motion } from 'framer-motion';
import {
  Truck,
  Clock,
  Package,
  MapPin,
  TrendingUp,
  TrendingDown,
  Filter,
  Download,
  Calendar,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';

const LogisticsReports = () => {
  const logisticsStats = [
    {
      title: 'On-Time Delivery',
      value: '95.8%',
      trend: '+2.3%',
      icon: <Clock className="h-6 w-6 text-blue-600" />,
      isPositive: true,
    },
    {
      title: 'Avg Delivery Time',
      value: '2.3 days',
      trend: '-0.5 days',
      icon: <Truck className="h-6 w-6 text-green-600" />,
      isPositive: true,
    },
    {
      title: 'Return Rate',
      value: '1.2%',
      trend: '-0.3%',
      icon: <Package className="h-6 w-6 text-purple-600" />,
      isPositive: true,
    },
    {
      title: 'Coverage Area',
      value: '85.5%',
      trend: '+5.2%',
      icon: <MapPin className="h-6 w-6 text-yellow-600" />,
      isPositive: true,
    },
  ];

  const deliveryTrends = [
    { month: 'Jan', onTime: 94.2, delayed: 5.8 },
    { month: 'Feb', onTime: 94.8, delayed: 5.2 },
    { month: 'Mar', onTime: 95.1, delayed: 4.9 },
    { month: 'Apr', onTime: 95.5, delayed: 4.5 },
    { month: 'May', onTime: 95.7, delayed: 4.3 },
    { month: 'Jun', onTime: 95.8, delayed: 4.2 },
  ];

  const deliveryRoutes = [
    {
      route: 'Riyadh Central',
      deliveries: 450,
      onTime: 96.5,
      avgTime: '1.8 days',
      efficiency: '+12.5%',
    },
    {
      route: 'Jeddah Port',
      deliveries: 380,
      onTime: 95.2,
      avgTime: '2.1 days',
      efficiency: '+8.2%',
    },
    {
      route: 'Dammam Industrial',
      deliveries: 320,
      onTime: 94.8,
      avgTime: '2.4 days',
      efficiency: '+15.4%',
    },
    {
      route: 'Mecca Region',
      deliveries: 280,
      onTime: 95.5,
      avgTime: '2.2 days',
      efficiency: '+6.8%',
    },
  ];

  const deliveryStatus = [
    { status: 'Completed', value: 85, color: '#34D399' },
    { status: 'In Transit', value: 10, color: '#60A5FA' },
    { status: 'Delayed', value: 5, color: '#F87171' },
  ];

  const vehicleUtilization = [
    { vehicle: 'Truck A', utilization: 85, maintenance: 5, idle: 10 },
    { vehicle: 'Truck B', utilization: 78, maintenance: 12, idle: 10 },
    { vehicle: 'Truck C', utilization: 92, maintenance: 3, idle: 5 },
    { vehicle: 'Truck D', utilization: 88, maintenance: 7, idle: 5 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900 mb-2">
              🚚 Logistics Reports
            </h1>
            <p className="text-secondary-600">
              Monitor delivery performance and logistics efficiency
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

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6">
        {logisticsStats.map((stat, index) => (
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

      {/* Delivery Performance */}
      <div className="grid grid-cols-2 gap-6">
        {/* Delivery Trend */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
          <h2 className="text-lg font-semibold text-secondary-900 mb-6">Delivery Performance Trend</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={deliveryTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="onTime"
                  stackId="1"
                  stroke="#0EA5E9"
                  fill="#0EA5E9"
                  fillOpacity={0.1}
                  name="On Time"
                />
                <Area
                  type="monotone"
                  dataKey="delayed"
                  stackId="1"
                  stroke="#F43F5E"
                  fill="#F43F5E"
                  fillOpacity={0.1}
                  name="Delayed"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Delivery Status */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
          <h2 className="text-lg font-semibold text-secondary-900 mb-6">Current Delivery Status</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deliveryStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {deliveryStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            {deliveryStatus.map((status) => (
              <div key={status.status} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: status.color }}
                />
                <span className="text-sm text-secondary-600">
                  {status.status} ({status.value}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Route Performance */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <h2 className="text-lg font-semibold text-secondary-900 mb-6">Route Performance</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-secondary-600 border-b border-secondary-100">
                <th className="pb-3 font-medium">Route</th>
                <th className="pb-3 font-medium">Deliveries</th>
                <th className="pb-3 font-medium">On-Time Rate</th>
                <th className="pb-3 font-medium">Avg Time</th>
                <th className="pb-3 font-medium">Efficiency</th>
              </tr>
            </thead>
            <tbody>
              {deliveryRoutes.map((route, index) => (
                <tr key={index} className="border-b border-secondary-100">
                  <td className="py-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-5 w-5 text-secondary-400" />
                      <span className="font-medium">{route.route}</span>
                    </div>
                  </td>
                  <td className="py-4">{route.deliveries}</td>
                  <td className="py-4">{route.onTime}%</td>
                  <td className="py-4">{route.avgTime}</td>
                  <td className="py-4">
                    <span className="flex items-center text-green-600">
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      {route.efficiency}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vehicle Utilization */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <h2 className="text-lg font-semibold text-secondary-900 mb-6">Vehicle Utilization</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={vehicleUtilization}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="vehicle" stroke="#64748B" />
              <YAxis stroke="#64748B" />
              <Tooltip />
              <Bar dataKey="utilization" stackId="a" fill="#0EA5E9" name="Active" />
              <Bar dataKey="maintenance" stackId="a" fill="#F59E0B" name="Maintenance" />
              <Bar dataKey="idle" stackId="a" fill="#E2E8F0" name="Idle" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default LogisticsReports;