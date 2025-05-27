import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Store,
  Package,
  Truck,
  CheckCircle,
  Globe,
  Upload,
  PlusCircle,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  MapPin,
  Building2,
  DollarSign,
  FileText,
  Calendar,
  Phone,
  Mail,
  User,
  Plus,
  Trash2,
  ArrowRight,
  Edit,
  Eye,
  MoreVertical,
  Search,
  Filter,
  Download,
} from 'lucide-react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker
} from "react-simple-maps";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';

const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

interface Store {
  id: string;
  name: string;
  type: string;
  location: string;
  status: 'active' | 'pending' | 'rejected';
  products: number;
  orders: number;
  revenue: number;
  coordinates: [number, number];
  createdAt: string;
  offDays: string;
}

const mockStores: Store[] = [
  {
    id: '1',
    name: 'Riyadh Central Hub',
    type: 'Warehouse',
    location: 'Riyadh',
    status: 'active',
    products: 12,
    orders: 156,
    revenue: 45000,
    coordinates: [46.6753, 24.7136],
    createdAt: '2024-03-15',
    offDays: 'Friday',
  },
  {
    id: '2',
    name: 'Jeddah Port Station',
    type: 'Distribution Center',
    location: 'Jeddah',
    status: 'active',
    products: 8,
    orders: 98,
    revenue: 32000,
    coordinates: [39.1925, 21.4858],
    createdAt: '2024-03-14',
    offDays: 'Friday, Saturday',
  },
  {
    id: '3',
    name: 'Dammam Industrial',
    type: 'Warehouse',
    location: 'Dammam',
    status: 'pending',
    products: 15,
    orders: 0,
    revenue: 0,
    coordinates: [50.1033, 26.4207],
    createdAt: '2024-03-13',
    offDays: 'Friday',
  },
  {
    id: '4',
    name: 'Mecca Retail Store',
    type: 'Retail Store',
    location: 'Mecca',
    status: 'rejected',
    products: 5,
    orders: 0,
    revenue: 0,
    coordinates: [39.8579, 21.3891],
    createdAt: '2024-03-12',
    offDays: 'Friday',
  },
];

interface StoreFormData {
  useCompanyProfile: boolean;
  storeType: string;
  storeName: string;
  crNumber: string;
  vatNumber: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  city: string;
  country: string;
  location: {
    lat: number;
    lng: number;
  };
  serviceTypes: {
    pickup: boolean;
    onlineStore: boolean;
  };
  invoicingMethod: 'merchant' | 'gasable';
  workingHours: {
    [key: string]: {
      isOpen: boolean;
      openTime: string;
      closeTime: string;
      is24Hours: boolean;
    };
  };
}

const daysOfWeek = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const steps = [
  { icon: <Store className="h-6 w-6" />, label: 'Add Store', description: 'Register store information' },
  { icon: <Package className="h-6 w-6" />, label: 'Add Product', description: 'List your energy products' },
  { icon: <Truck className="h-6 w-6" />, label: 'Shipment', description: 'Define logistics & delivery' },
  { icon: <AlertCircle className="h-6 w-6" />, label: 'Approval', description: 'Verification by Gasable' },
  { icon: <CheckCircle className="h-6 w-6" />, label: 'Go Live', description: 'Active on marketplace' },
];

const storeStatusData = [
  { name: 'Active', value: mockStores.filter(s => s.status === 'active').length, color: '#34D399' },
  { name: 'Pending', value: mockStores.filter(s => s.status === 'pending').length, color: '#FCD34D' },
  { name: 'Rejected', value: mockStores.filter(s => s.status === 'rejected').length, color: '#F87171' },
];

const Setup = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isAddStoreModalOpen, setIsAddStoreModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<StoreFormData>({
    useCompanyProfile: false,
    storeType: '',
    storeName: '',
    crNumber: '',
    vatNumber: '',
    phone: '',
    email: '',
    website: '',
    address: '',
    city: '',
    country: '',
    location: {
      lat: 0,
      lng: 0,
    },
    serviceTypes: {
      pickup: false,
      onlineStore: false,
    },
    invoicingMethod: 'merchant',
    workingHours: daysOfWeek.reduce((acc, day) => ({
      ...acc,
      [day]: {
        isOpen: true,
        openTime: '09:00',
        closeTime: '17:00',
        is24Hours: false,
      }
    }), {}),
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleServiceTypeChange = (service: keyof StoreFormData['serviceTypes']) => {
    setFormData(prev => ({
      ...prev,
      serviceTypes: {
        ...prev.serviceTypes,
        [service]: !prev.serviceTypes[service]
      }
    }));
  };

  const handleWorkingHoursChange = (
    day: string,
    field: keyof StoreFormData['workingHours'][string],
    value: string | boolean
  ) => {
    setFormData(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [day]: {
          ...prev.workingHours[day],
          [field]: value
        }
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save store data
    console.log('Saving store data:', formData);
    setIsAddStoreModalOpen(false);
    navigate('/setup/add-product');
  };

  const getStatusColor = (status: Store['status']) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'rejected':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: Store['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle2 className="h-5 w-5" />;
      case 'pending':
        return <Clock className="h-5 w-5" />;
      case 'rejected':
        return <XCircle className="h-5 w-5" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const filteredStores = mockStores.filter(store => {
    if (filterStatus !== 'all' && store.status !== filterStatus) {
      return false;
    }
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        store.name.toLowerCase().includes(searchLower) ||
        store.location.toLowerCase().includes(searchLower) ||
        store.type.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const renderAddStoreModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Add New Store</h2>
          <button
            onClick={() => setIsAddStoreModalOpen(false)}
            className="p-2 hover:bg-secondary-100 rounded-lg"
          >
            <XCircle className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Profile Toggle */}
          <div className="flex items-center space-x-2 p-4 bg-secondary-50 rounded-lg">
            <input
              type="checkbox"
              id="useCompanyProfile"
              checked={formData.useCompanyProfile}
              onChange={(e) => setFormData(prev => ({ ...prev, useCompanyProfile: e.target.checked }))}
              className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
            />
            <label htmlFor="useCompanyProfile" className="text-secondary-700">
              Use Company Profile
            </label>
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Store Type
                </label>
                <select
                  name="storeType"
                  value={formData.storeType}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  <option value="">Select store type</option>
                  <option value="retail">Retail Store</option>
                  <option value="warehouse">Warehouse</option>
                  <option value="distribution">Distribution Center</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Store Name
                </label>
                <input
                  type="text"
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter store name"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  CR Number
                </label>
                <input
                  type="text"
                  name="crNumber"
                  value={formData.crNumber}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter CR number"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  VAT Number
                </label>
                <input
                  type="text"
                  name="vatNumber"
                  value={formData.vatNumber}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter VAT number"
                  required
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter phone number"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter email address"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Website (Optional)
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Enter website URL"
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Location</h3>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                className="input-field h-24"
                placeholder="Enter full address"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter city"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter country"
                  required
                />
              </div>
            </div>
          </div>

          {/* Service Types */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Service Types</h3>
            
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.serviceTypes.pickup}
                  onChange={() => handleServiceTypeChange('pickup')}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span>Pickup Service</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.serviceTypes.onlineStore}
                  onChange={() => handleServiceTypeChange('onlineStore')}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span>Online Store</span>
              </label>
            </div>
          </div>

          {/* Invoicing Method */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Invoicing Method</h3>
            
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="invoicingMethod"
                  value="merchant"
                  checked={formData.invoicingMethod === 'merchant'}
                  onChange={(e) => setFormData(prev => ({ ...prev, invoicingMethod: e.target.value as 'merchant' | 'gasable' }))}
                  className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                />
                <span>Merchant Generated</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="invoicingMethod"
                  value="gasable"
                  checked={formData.invoicingMethod === 'gasable'}
                  onChange={(e) => setFormData(prev => ({ ...prev, invoicingMethod: e.target.value as 'merchant' | 'gasable' }))}
                  className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                />
                <span>Gasable Generated</span>
              </label>
            </div>
          </div>

          {/* Working Hours */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Working Hours</h3>
            
            <div className="space-y-4">
              {daysOfWeek.map((day) => (
                <div key={day} className="flex items-center space-x-4">
                  <div className="w-24">
                    <span className="text-secondary-700">{day}</span>
                  </div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.workingHours[day].isOpen}
                      onChange={(e) => handleWorkingHoursChange(day, 'isOpen', e.target.checked)}
                      className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                    />
                    <span>Open</span>
                  </label>
                  {formData.workingHours[day].isOpen && (
                    <>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.workingHours[day].is24Hours}
                          onChange={(e) => handleWorkingHoursChange(day, 'is24Hours', e.target.checked)}
                          className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                        />
                        <span>24 Hours</span>
                      </label>
                      {!formData.workingHours[day].is24Hours && (
                        <>
                          <input
                            type="time"
                            value={formData.workingHours[day].openTime}
                            onChange={(e) => handleWorkingHoursChange(day, 'openTime', e.target.value)}
                            className="input-field"
                          />
                          <span>to</span>
                          <input
                            type="time"
                            value={formData.workingHours[day].closeTime}
                            onChange={(e) => handleWorkingHoursChange(day, 'closeTime', e.target.value)}
                            className="input-field"
                          />
                        </>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={() => setIsAddStoreModalOpen(false)}
              className="px-4 py-2 text-secondary-700 hover:bg-secondary-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary px-4 py-2"
            >
              Add Store & Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <h1 className="text-2xl font-bold text-secondary-900 mb-2">🛠️ Store Setup</h1>
        <p className="text-secondary-600">
          Welcome to your supplier setup dashboard. Follow these steps to activate your presence on the Gasable Energy Marketplace.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-6">
        <button
          onClick={() => setIsAddStoreModalOpen(true)}
          className="p-6 bg-white rounded-xl shadow-sm border border-secondary-100 hover:border-primary-200 transition-all text-left group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-primary-50 text-primary-600 rounded-lg group-hover:bg-primary-100">
              <Plus className="h-6 w-6" />
            </div>
            <ArrowRight className="h-5 w-5 text-secondary-400 group-hover:text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-2">Add New Store</h3>
          <p className="text-secondary-600">Create a new store location with complete details</p>
        </button>

        <button className="p-6 bg-white rounded-xl shadow-sm border border-secondary-100 hover:border-primary-200 transition-all text-left group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-secondary-50 text-secondary-600 rounded-lg group-hover:bg-secondary-100">
              <Upload className="h-6 w-6" />
            </div>
            <ArrowRight className="h-5 w-5 text-secondary-400 group-hover:text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-2">Bulk Upload</h3>
          <p className="text-secondary-600">Import multiple stores using our template</p>
        </button>
      </div>

      {/* Store Stats */}
      <div className="grid grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100"
        >
          <div className="flex items-center justify-between mb-2">
            <Store className="h-6 w-6 text-blue-600" />
            <span className="text-2xl font-bold text-blue-600">{mockStores.length}</span>
          </div>
          <p className="text-secondary-600">Total Stores</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100"
        >
          <div className="flex items-center justify-between mb-2">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
            <span className="text-2xl font-bold text-green-600">
              {mockStores.filter(s => s.status === 'active').length}
            </span>
          </div>
          <p className="text-secondary-600">Active Stores</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100"
        >
          <div className="flex items-center justify-between mb-2">
            <Clock className="h-6 w-6 text-yellow-600" />
            <span className="text-2xl font-bold text-yellow-600">
              {mockStores.filter(s => s.status === 'pending').length}
            </span>
          </div>
          <p className="text-secondary-600">Pending Stores</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100"
        >
          <div className="flex items-center justify-between mb-2">
            <XCircle className="h-6 w-6 text-red-600" />
            <span className="text-2xl font-bold text-red-600">
              {mockStores.filter(s => s.status === 'rejected').length}
            </span>
          </div>
          <p className="text-secondary-600">Rejected Stores</p>
        </motion.div>
      </div>

      {/* Store Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Store Map */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
          <h2 className="text-lg font-semibold text-secondary-900 mb-6">Store Locations</h2>
          <div className="h-[300px]">
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
              {mockStores.map((store) => (
                <Marker key={store.id} coordinates={store.coordinates}>
                  <circle
                    r={6}
                    fill={
                      store.status === 'active' ? '#34D399' : 
                      store.status === 'pending' ? '#FCD34D' : '#F87171'
                    }
                    stroke="#fff"
                    strokeWidth={2}
                  />
                </Marker>
              ))}
            </ComposableMap>
          </div>
        </div>

        {/* Store Status Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
          <h2 className="text-lg font-semibold text-secondary-900 mb-6">Store Status</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={storeStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {storeStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 space-y-2">
            {storeStatusData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-secondary-600">{item.name}</span>
                </div>
                <span className="font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stores Table */}
      <div className="bg-white rounded-xl shadow-sm border border-secondary-100">
        <div className="p-6 border-b border-secondary-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-secondary-900">All Stores</h2>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search stores..."
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
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
              <button className="p-2 hover:bg-secondary-100 rounded-lg text-secondary-600">
                <Filter className="h-5 w-5" />
              </button>
              <button className="p-2 hover:bg-secondary-100 rounded-lg text-secondary-600">
                <Download className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-secondary-50">
                <th className="py-4 px-6 text-left font-medium text-secondary-600">Store</th>
                <th className="py-4 px-6 text-left font-medium text-secondary-600">Type</th>
                <th className="py-4 px-6 text-left font-medium text-secondary-600">Location</th>
                <th className="py-4 px-6 text-left font-medium text-secondary-600">Products</th>
                <th className="py-4 px-6 text-left font-medium text-secondary-600">Orders</th>
                <th className="py-4 px-6 text-left font-medium text-secondary-600">Revenue</th>
                <th className="py-4 px-6 text-left font-medium text-secondary-600">Status</th>
                <th className="py-4 px-6 text-left font-medium text-secondary-600">Created</th>
                <th className="py-4 px-6 text-left font-medium text-secondary-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStores.map((store) => (
                <tr key={store.id} className="border-b border-secondary-100 hover:bg-secondary-50">
                  <td className="py-4 px-6 font-medium">{store.name}</td>
                  <td className="py-4 px-6">{store.type}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4 text-secondary-400" />
                      <span>{store.location}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">{store.products}</td>
                  <td className="py-4 px-6">{store.orders}</td>
                  <td className="py-4 px-6">${store.revenue.toLocaleString()}</td>
                  <td className="py-4 px-6">
                    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${getStatusColor(store.status)}`}>
                      {getStatusIcon(store.status)}
                      <span className="capitalize">{store.status}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">{store.createdAt}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 hover:bg-secondary-100 rounded text-secondary-600">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-1 hover:bg-secondary-100 rounded text-secondary-600">
                        <Edit className="h-4 w-4" />
                      </button>
                      <div className="relative">
                        <button
                          onClick={() => setShowActionMenu(showActionMenu === store.id ? null : store.id)}
                          className="p-1 hover:bg-secondary-100 rounded text-secondary-600"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        {showActionMenu === store.id && (
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
                              <span>Edit Store</span>
                            </button>
                            <button
                              className="w-full px-4 py-2 text-left hover:bg-secondary-50 flex items-center space-x-2"
                              onClick={() => {/* Handle hide */}}
                            >
                              <Eye className="h-4 w-4" />
                              <span>{store.status === 'active' ? 'Hide Store' : 'Show Store'}</span>
                            </button>
                            <button
                              className="w-full px-4 py-2 text-left hover:bg-secondary-50 flex items-center space-x-2 text-red-600"
                              onClick={() => {/* Handle delete */}}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span>Delete Store</span>
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
            Showing 1 to {filteredStores.length} of {filteredStores.length} entries
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

      {/* Bottom Controls */}
      <div className="flex justify-between">
        <button
          className="px-6 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors"
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
        >
          Previous
        </button>
        <div className="space-x-3">
          <button className="px-6 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors">
            Save Progress
          </button>
          <button
            className="btn-primary px-6"
            onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
            disabled={currentStep === steps.length - 1}
          >
            Next Step
          </button>
        </div>
      </div>

      {/* Add Store Modal */}
      {isAddStoreModalOpen && renderAddStoreModal()}
    </div>
  );
};

export default Setup;