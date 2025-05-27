import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Store,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Calendar,
  Download,
  RefreshCw,
  Users,
  Package,
  DollarSign,
  BarChart2,
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown,
} from 'lucide-react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker
} from "react-simple-maps";

// Updated to use a more reliable CDN source
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface Branch {
  id: string;
  name: string;
  type: 'gas_station' | 'lpg_store' | 'energy_retail' | 'warehouse';
  status: 'active' | 'inactive' | 'maintenance';
  location: {
    address: string;
    city: string;
    country: string;
    coordinates: [number, number];
  };
  manager: {
    id: string;
    name: string;
    phone: string;
    email: string;
  };
  metrics: {
    employees: number;
    assets: number;
    revenue: number;
    customers: number;
    growth: number;
  };
  operatingHours: {
    weekdays: string;
    weekends: string;
    is24Hours: boolean;
  };
  services: string[];
  lastUpdated: string;
}

const mockBranches: Branch[] = [
  {
    id: 'b1',
    name: 'Riyadh Central Gas Station',
    type: 'gas_station',
    status: 'active',
    location: {
      address: '123 King Fahd Road',
      city: 'Riyadh',
      country: 'Saudi Arabia',
      coordinates: [46.6753, 24.7136],
    },
    manager: {
      id: 'm1',
      name: 'Ahmed Al-Saud',
      phone: '+966-123-456-789',
      email: 'ahmed@example.com',
    },
    metrics: {
      employees: 12,
      assets: 24,
      revenue: 450000,
      customers: 1250,
      growth: 8.5,
    },
    operatingHours: {
      weekdays: '6:00 AM - 12:00 AM',
      weekends: '8:00 AM - 10:00 PM',
      is24Hours: false,
    },
    services: ['Fuel', 'LPG', 'EV Charging', 'Convenience Store'],
    lastUpdated: '2024-03-15',
  },
  {
    id: 'b2',
    name: 'Jeddah Port LPG Center',
    type: 'lpg_store',
    status: 'active',
    location: {
      address: '456 Port Road',
      city: 'Jeddah',
      country: 'Saudi Arabia',
      coordinates: [39.1925, 21.4858],
    },
    manager: {
      id: 'm2',
      name: 'Fatima Al-Zahrani',
      phone: '+966-123-456-790',
      email: 'fatima@example.com',
    },
    metrics: {
      employees: 8,
      assets: 18,
      revenue: 320000,
      customers: 850,
      growth: 12.3,
    },
    operatingHours: {
      weekdays: '7:00 AM - 10:00 PM',
      weekends: '9:00 AM - 8:00 PM',
      is24Hours: false,
    },
    services: ['LPG Refill', 'Cylinder Exchange', 'Accessories'],
    lastUpdated: '2024-03-14',
  },
  {
    id: 'b3',
    name: 'Dammam Energy Hub',
    type: 'energy_retail',
    status: 'maintenance',
    location: {
      address: '789 Industrial Area',
      city: 'Dammam',
      country: 'Saudi Arabia',
      coordinates: [50.1033, 26.4207],
    },
    manager: {
      id: 'm3',
      name: 'Khalid Al-Omar',
      phone: '+966-123-456-791',
      email: 'khalid@example.com',
    },
    metrics: {
      employees: 15,
      assets: 32,
      revenue: 580000,
      customers: 1800,
      growth: 15.7,
    },
    operatingHours: {
      weekdays: '24 hours',
      weekends: '24 hours',
      is24Hours: true,
    },
    services: ['Fuel', 'LPG', 'EV Charging', 'Hydrogen', 'Service Center'],
    lastUpdated: '2024-03-13',
  },
  {
    id: 'b4',
    name: 'Mecca Distribution Center',
    type: 'warehouse',
    status: 'inactive',
    location: {
      address: '321 Holy District',
      city: 'Mecca',
      country: 'Saudi Arabia',
      coordinates: [39.8579, 21.3891],
    },
    manager: {
      id: 'm4',
      name: 'Ibrahim Al-Farsi',
      phone: '+966-123-456-792',
      email: 'ibrahim@example.com',
    },
    metrics: {
      employees: 20,
      assets: 45,
      revenue: 0,
      customers: 0,
      growth: 0,
    },
    operatingHours: {
      weekdays: '8:00 AM - 5:00 PM',
      weekends: 'Closed',
      is24Hours: false,
    },
    services: ['Storage', 'Distribution', 'Logistics'],
    lastUpdated: '2024-03-12',
  },
];

const BranchDirectory = () => {
  const [branches] = useState<Branch[]>(mockBranches);
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const getStatusColor = (status: Branch['status']) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-50';
      case 'maintenance':
        return 'text-yellow-600 bg-yellow-50';
      case 'inactive':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: Branch['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4" />;
      case 'maintenance':
        return <AlertCircle className="h-4 w-4" />;
      case 'inactive':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getTypeIcon = (type: Branch['type']) => {
    switch (type) {
      case 'gas_station':
        return <Store className="h-5 w-5" />;
      case 'lpg_store':
        return <Package className="h-5 w-5" />;
      case 'energy_retail':
        return <Store className="h-5 w-5" />;
      case 'warehouse':
        return <Package className="h-5 w-5" />;
      default:
        return <Store className="h-5 w-5" />;
    }
  };

  const filteredBranches = branches.filter(branch => {
    if (filterStatus !== 'all' && branch.status !== filterStatus) {
      return false;
    }
    if (filterType !== 'all' && branch.type !== filterType) {
      return false;
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        branch.name.toLowerCase().includes(query) ||
        branch.location.city.toLowerCase().includes(query) ||
        branch.manager.name.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const selectedBranchData = selectedBranch ? branches.find(b => b.id === selectedBranch) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900 mb-2">
              🏬 Branch Directory
            </h1>
            <p className="text-secondary-600">
              Manage all your gas stations, LPG stores, and energy retail locations
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
            <Link
              to="/dashboard/stores/add-branch"
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add Branch</span>
            </Link>
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
              <Store className="h-6 w-6 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">{branches.length}</span>
            </div>
            <p className="text-secondary-600">Total Branches</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-secondary-50 p-6 rounded-xl border border-secondary-100"
          >
            <div className="flex items-center justify-between mb-2">
              <Users className="h-6 w-6 text-purple-600" />
              <span className="text-2xl font-bold text-purple-600">
                {branches.reduce((sum, branch) => sum + branch.metrics.employees, 0)}
              </span>
            </div>
            <p className="text-secondary-600">Total Employees</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-secondary-50 p-6 rounded-xl border border-secondary-100"
          >
            <div className="flex items-center justify-between mb-2">
              <Package className="h-6 w-6 text-green-600" />
              <span className="text-2xl font-bold text-green-600">
                {branches.reduce((sum, branch) => sum + branch.metrics.assets, 0)}
              </span>
            </div>
            <p className="text-secondary-600">Total Assets</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-secondary-50 p-6 rounded-xl border border-secondary-100"
          >
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="h-6 w-6 text-yellow-600" />
              <span className="text-2xl font-bold text-yellow-600">
                ${branches.reduce((sum, branch) => sum + branch.metrics.revenue, 0).toLocaleString()}
              </span>
            </div>
            <p className="text-secondary-600">Total Revenue</p>
          </motion.div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search branches by name, location, or manager..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="maintenance">Maintenance</option>
            <option value="inactive">Inactive</option>
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          >
            <option value="all">All Types</option>
            <option value="gas_station">Gas Station</option>
            <option value="lpg_store">LPG Store</option>
            <option value="energy_retail">Energy Retail</option>
            <option value="warehouse">Warehouse</option>
          </select>
          <button className="p-2 hover:bg-secondary-100 rounded-lg text-secondary-600">
            <Filter className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Branch Map */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <h2 className="text-lg font-semibold text-secondary-900 mb-6">Branch Locations</h2>
        <div className="h-[400px] bg-secondary-50 rounded-lg overflow-hidden">
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
            {branches.map((branch) => (
              <Marker key={branch.id} coordinates={branch.location.coordinates}>
                <circle
                  r={6}
                  fill={
                    branch.status === 'active' ? '#10B981' : 
                    branch.status === 'maintenance' ? '#F59E0B' : '#EF4444'
                  }
                  stroke="#fff"
                  strokeWidth={2}
                />
                <text
                  textAnchor="middle"
                  y={-10}
                  style={{ fontSize: 10, fill: '#1E293B', fontWeight: 'bold' }}
                >
                  {branch.name.substring(0, 15)}
                </text>
              </Marker>
            ))}
          </ComposableMap>
        </div>
      </div>

      {/* Branches Table */}
      <div className="bg-white rounded-xl shadow-sm border border-secondary-100">
        <div className="p-6 border-b border-secondary-100">
          <h2 className="text-lg font-semibold text-secondary-900">All Branches</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-secondary-50">
                <th className="py-4 px-6 text-left font-medium text-secondary-600">Branch</th>
                <th className="py-4 px-6 text-left font-medium text-secondary-600">Type</th>
                <th className="py-4 px-6 text-left font-medium text-secondary-600">Location</th>
                <th className="py-4 px-6 text-left font-medium text-secondary-600">Manager</th>
                <th className="py-4 px-6 text-left font-medium text-secondary-600">Employees</th>
                <th className="py-4 px-6 text-left font-medium text-secondary-600">Assets</th>
                <th className="py-4 px-6 text-left font-medium text-secondary-600">Status</th>
                <th className="py-4 px-6 text-left font-medium text-secondary-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBranches.map((branch) => (
                <tr key={branch.id} className="border-b border-secondary-100 hover:bg-secondary-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        branch.type === 'gas_station' ? 'bg-blue-50 text-blue-600' :
                        branch.type === 'lpg_store' ? 'bg-purple-50 text-purple-600' :
                        branch.type === 'energy_retail' ? 'bg-green-50 text-green-600' :
                        'bg-yellow-50 text-yellow-600'
                      }`}>
                        {getTypeIcon(branch.type)}
                      </div>
                      <div>
                        <div className="font-medium">{branch.name}</div>
                        <div className="text-sm text-secondary-600">
                          ID: {branch.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="capitalize">{branch.type.replace('_', ' ')}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4 text-secondary-400" />
                      <span>{branch.location.city}, {branch.location.country}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-medium">{branch.manager.name}</div>
                      <div className="text-sm text-secondary-600">
                        <Mail className="h-4 w-4 inline mr-1" />
                        {branch.manager.email}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">{branch.metrics.employees}</td>
                  <td className="py-4 px-6">{branch.metrics.assets}</td>
                  <td className="py-4 px-6">
                    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${getStatusColor(branch.status)}`}>
                      {getStatusIcon(branch.status)}
                      <span className="capitalize">{branch.status}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => setSelectedBranch(selectedBranch === branch.id ? null : branch.id)}
                        className="p-1 hover:bg-secondary-100 rounded text-secondary-600"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-1 hover:bg-secondary-100 rounded text-secondary-600">
                        <Edit className="h-4 w-4" />
                      </button>
                      <div className="relative">
                        <button
                          onClick={() => setShowActionMenu(showActionMenu === branch.id ? null : branch.id)}
                          className="p-1 hover:bg-secondary-100 rounded text-secondary-600"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        {showActionMenu === branch.id && (
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
                              onClick={() => {/* Handle edit */}}
                            >
                              <Edit className="h-4 w-4" />
                              <span>Edit Branch</span>
                            </button>
                            <button
                              className="w-full px-4 py-2 text-left hover:bg-secondary-50 flex items-center space-x-2"
                              onClick={() => {/* Handle deactivate */}}
                            >
                              <AlertCircle className="h-4 w-4" />
                              <span>{branch.status === 'active' ? 'Deactivate' : 'Activate'}</span>
                            </button>
                            <button
                              className="w-full px-4 py-2 text-left hover:bg-secondary-50 flex items-center space-x-2 text-red-600"
                              onClick={() => {/* Handle delete */}}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span>Delete Branch</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-secondary-100 flex items-center justify-between">
          <div className="text-sm text-secondary-600">
            Showing 1 to {filteredBranches.length} of {filteredBranches.length} entries
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

      {/* Branch Details */}
      {selectedBranchData && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-lg ${
                selectedBranchData.type === 'gas_station' ? 'bg-blue-50 text-blue-600' :
                selectedBranchData.type === 'lpg_store' ? 'bg-purple-50 text-purple-600' :
                selectedBranchData.type === 'energy_retail' ? 'bg-green-50 text-green-600' :
                'bg-yellow-50 text-yellow-600'
              }`}>
                {getTypeIcon(selectedBranchData.type)}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{selectedBranchData.name}</h2>
                <div className="flex items-center space-x-2 text-sm text-secondary-600">
                  <MapPin className="h-4 w-4" />
                  <span>{selectedBranchData.location.address}, {selectedBranchData.location.city}</span>
                </div>
              </div>
            </div>
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusColor(selectedBranchData.status)}`}>
              {getStatusIcon(selectedBranchData.status)}
              <span className="capitalize">{selectedBranchData.status}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Branch Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Branch Information</h3>
              
              <div>
                <h4 className="text-sm text-secondary-500">Manager</h4>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700">
                    {selectedBranchData.manager.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{selectedBranchData.manager.name}</p>
                    <p className="text-sm text-secondary-600">{selectedBranchData.manager.email}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm text-secondary-500">Contact</h4>
                <div className="space-y-1 mt-1">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-secondary-400" />
                    <span>{selectedBranchData.manager.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-secondary-400" />
                    <span>{selectedBranchData.manager.email}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm text-secondary-500">Operating Hours</h4>
                <div className="space-y-1 mt-1">
                  {selectedBranchData.operatingHours.is24Hours ? (
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-secondary-400" />
                      <span>Open 24 hours</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-secondary-400" />
                        <span>Weekdays: {selectedBranchData.operatingHours.weekdays}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-secondary-400" />
                        <span>Weekends: {selectedBranchData.operatingHours.weekends}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm text-secondary-500">Services</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedBranchData.services.map((service, index) => (
                    <span key={index} className="px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-sm">
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Branch Metrics */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Performance Metrics</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-secondary-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span className="text-sm text-secondary-600">Employees</span>
                  </div>
                  <p className="text-2xl font-bold mt-2">{selectedBranchData.metrics.employees}</p>
                </div>
                
                <div className="p-4 bg-secondary-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <Package className="h-5 w-5 text-purple-600" />
                    <span className="text-sm text-secondary-600">Assets</span>
                  </div>
                  <p className="text-2xl font-bold mt-2">{selectedBranchData.metrics.assets}</p>
                </div>
                
                <div className="p-4 bg-secondary-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-secondary-600">Revenue</span>
                  </div>
                  <p className="text-2xl font-bold mt-2">${selectedBranchData.metrics.revenue.toLocaleString()}</p>
                </div>
                
                <div className="p-4 bg-secondary-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <Users className="h-5 w-5 text-yellow-600" />
                    <span className="text-sm text-secondary-600">Customers</span>
                  </div>
                  <p className="text-2xl font-bold mt-2">{selectedBranchData.metrics.customers.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="p-4 bg-secondary-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <BarChart2 className="h-5 w-5 text-primary-600" />
                    <span className="font-medium">Growth Rate</span>
                  </div>
                  <div className="flex items-center space-x-1 text-green-600">
                    <ArrowUpRight className="h-4 w-4" />
                    <span>{selectedBranchData.metrics.growth}%</span>
                  </div>
                </div>
                <div className="mt-2 h-4 bg-secondary-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-500 rounded-full"
                    style={{ width: `${selectedBranchData.metrics.growth * 5}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Quick Actions</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <Link to={`/dashboard/stores/employees?branch=${selectedBranchData.id}`} className="p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                  <Users className="h-5 w-5 mb-2" />
                  <p className="font-medium">Manage Employees</p>
                </Link>
                
                <Link to={`/dashboard/stores/assets?branch=${selectedBranchData.id}`} className="p-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
                  <Package className="h-5 w-5 mb-2" />
                  <p className="font-medium">View Assets</p>
                </Link>
                
                <Link to={`/dashboard/analytics?branch=${selectedBranchData.id}`} className="p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                  <BarChart2 className="h-5 w-5 mb-2" />
                  <p className="font-medium">Performance Report</p>
                </Link>
                
                <button className="p-4 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors">
                  <Edit className="h-5 w-5 mb-2" />
                  <p className="font-medium">Edit Branch</p>
                </button>
              </div>
              
              <div className="mt-4">
                <button className="w-full p-4 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center space-x-2">
                  {selectedBranchData.status === 'active' ? (
                    <>
                      <XCircle className="h-5 w-5" />
                      <span>Deactivate Branch</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5" />
                      <span>Activate Branch</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchDirectory;