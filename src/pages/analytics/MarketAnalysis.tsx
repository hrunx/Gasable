import React from 'react';
import { motion } from 'framer-motion';
import {
  Globe,
  TrendingUp,
  TrendingDown,
  BarChart2,
  Search,
  Filter,
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  MapPin,
  Target,
  Percent,
  Activity,
} from 'lucide-react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
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

// Updated to use a more reliable CDN source
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const MarketAnalysis = () => {
  const marketStats = [
    {
      title: 'Market Share',
      value: '28.5%',
      trend: '+2.5%',
      icon: <Target className="h-6 w-6 text-blue-600" />,
      isPositive: true,
    },
    {
      title: 'Growth Rate',
      value: '15.8%',
      trend: '+3.2%',
      icon: <TrendingUp className="h-6 w-6 text-green-600" />,
      isPositive: true,
    },
    {
      title: 'Market Position',
      value: '#2',
      trend: '+1',
      icon: <Activity className="h-6 w-6 text-purple-600" />,
      isPositive: true,
    },
    {
      title: 'Market Penetration',
      value: '42.3%',
      trend: '+5.4%',
      icon: <Percent className="h-6 w-6 text-yellow-600" />,
      isPositive: true,
    },
  ];

  const marketTrends = [
    { month: 'Jan', share: 25.8, competitors: 74.2 },
    { month: 'Feb', share: 26.5, competitors: 73.5 },
    { month: 'Mar', share: 27.2, competitors: 72.8 },
    { month: 'Apr', share: 27.8, competitors: 72.2 },
    { month: 'May', share: 28.2, competitors: 71.8 },
    { month: 'Jun', share: 28.5, competitors: 71.5 },
  ];

  const competitorAnalysis = [
    {
      name: 'Your Company',
      marketShare: 28.5,
      growth: '+15.8%',
      satisfaction: 4.8,
      color: '#0EA5E9',
    },
    {
      name: 'Competitor A',
      marketShare: 32.1,
      growth: '+12.3%',
      satisfaction: 4.5,
      color: '#6366F1',
    },
    {
      name: 'Competitor B',
      marketShare: 18.4,
      growth: '+8.7%',
      satisfaction: 4.2,
      color: '#8B5CF6',
    },
    {
      name: 'Competitor C',
      marketShare: 21.0,
      growth: '+10.5%',
      satisfaction: 4.4,
      color: '#EC4899',
    },
  ];

  const regionalData = [
    { name: 'Riyadh', share: 35, growth: '+12.5%', coordinates: [46.6753, 24.7136] },
    { name: 'Jeddah', share: 28, growth: '+8.2%', coordinates: [39.1925, 21.4858] },
    { name: 'Dammam', share: 22, growth: '+15.4%', coordinates: [50.1033, 26.4207] },
    { name: 'Mecca', share: 15, growth: '+6.8%', coordinates: [39.8579, 21.3891] },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900 mb-2">
              🌍 Market Analysis
            </h1>
            <p className="text-secondary-600">
              Analyze market trends, competition, and opportunities
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
        {marketStats.map((stat, index) => (
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

      {/* Market Share Trend */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <h2 className="text-lg font-semibold text-secondary-900 mb-6">Market Share Trend</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={marketTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="month" stroke="#64748B" />
              <YAxis stroke="#64748B" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="share"
                stackId="1"
                stroke="#0EA5E9"
                fill="#0EA5E9"
                fillOpacity={0.1}
                name="Your Market Share"
              />
              <Area
                type="monotone"
                dataKey="competitors"
                stackId="1"
                stroke="#6366F1"
                fill="#6366F1"
                fillOpacity={0.1}
                name="Competitors"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Competitor Analysis */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <h2 className="text-lg font-semibold text-secondary-900 mb-6">Competitor Analysis</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-secondary-600 border-b border-secondary-100">
                <th className="pb-3 font-medium">Company</th>
                <th className="pb-3 font-medium">Market Share</th>
                <th className="pb-3 font-medium">Growth</th>
                <th className="pb-3 font-medium">Satisfaction</th>
                <th className="pb-3 font-medium">Trend</th>
              </tr>
            </thead>
            <tbody>
              {competitorAnalysis.map((competitor, index) => (
                <tr key={index} className="border-b border-secondary-100">
                  <td className="py-4">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: competitor.color }}
                      />
                      <span className="font-medium">{competitor.name}</span>
                    </div>
                  </td>
                  <td className="py-4">{competitor.marketShare}%</td>
                  <td className="py-4">
                    <span className="flex items-center text-green-600">
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      {competitor.growth}
                    </span>
                  </td>
                  <td className="py-4">{competitor.satisfaction}</td>
                  <td className="py-4">
                    <div className="w-32 h-6">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={marketTrends}>
                          <Bar dataKey="share" fill={competitor.color} />
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

      {/* Regional Analysis */}
      <div className="grid grid-cols-2 gap-6">
        {/* Map */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
          <h2 className="text-lg font-semibold text-secondary-900 mb-6">Regional Distribution</h2>
          <div className="h-[400px]">
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{
                scale: 800,
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
              {regionalData.map(({ name, coordinates, share }) => (
                <Marker key={name} coordinates={coordinates}>
                  <circle
                    r={Math.sqrt(share) * 2}
                    fill="#0EA5E9"
                    stroke="#fff"
                    strokeWidth={2}
                    opacity={0.8}
                  />
                </Marker>
              ))}
            </ComposableMap>
          </div>
        </div>

        {/* Regional Stats */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
          <h2 className="text-lg font-semibold text-secondary-900 mb-6">Regional Performance</h2>
          <div className="space-y-4">
            {regionalData.map((region, index) => (
              <div
                key={index}
                className="p-4 bg-secondary-50 rounded-lg flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-primary-600" />
                    <span className="font-medium">{region.name}</span>
                  </div>
                  <p className="text-sm text-secondary-600 mt-1">Market Share: {region.share}%</p>
                </div>
                <span className="flex items-center text-green-600">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  {region.growth}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketAnalysis;