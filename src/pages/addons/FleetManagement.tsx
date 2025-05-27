import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Truck, User, MapPin, Calendar, Clock, Fuel, Wrench, AlertCircle, CheckCircle, XCircle, Plus, Trash2, Edit, RefreshCw, Search, Filter, Download, BarChart2, TrendingUp, TrendingDown, DollarSign, Settings, X, Save, Route, Navigation, Compass, Map, Anchor, Zap, Droplet, FileText, ClipboardList, Smartphone, MessageSquare, Phone, Mail, Shield, Lock, Key, Eye, EyeOff, Bell, BellOff, Upload, Download as DownloadIcon, ArrowUpRight, ArrowDownRight, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, MoreVertical, MoreHorizontal, Menu, ExternalLink, Copy, Clipboard, ClipboardCheck, ClipboardCopy, Play, Pause, RotateCw, Activity, PieChart, BarChart, LineChart, Star, Package, Building2 } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  BarChart as ReBarChart,
  Bar,
  LineChart as ReLineChart,
  Line,
} from 'recharts';

interface Vehicle {
  id: string;
  number: string;
  type: 'truck' | 'van' | 'bike';
  status: 'active' | 'maintenance' | 'inactive';
  location: {
    latitude: number;
    longitude: number;
    address: string;
    lastUpdated: string;
  };
  driver?: {
    id: string;
    name: string;
    phone: string;
    status: 'available' | 'on_duty' | 'off_duty';
  };
  specs: {
    capacity: number;
    fuelType: string;
    fuelLevel: number;
    mileage: number;
    lastMaintenance: string;
    nextMaintenance: string;
  };
  analytics: {
    utilization: number;
    fuelEfficiency: number;
    deliveries: number;
    distance: number;
    costs: number;
  };
}

interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  licenseNumber: string;
  licenseExpiry: string;
  status: 'available' | 'on_duty' | 'off_duty';
  vehicle?: string;
  performance: {
    deliveries: number;
    onTimeRate: number;
    customerRating: number;
    distance: number;
  };
  location?: {
    latitude: number;
    longitude: number;
    address: string;
    lastUpdated: string;
  };
}

interface Route {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'cancelled';
  vehicle: string;
  driver: string;
  startTime: string;
  endTime?: string;
  distance: number;
  stops: {
    id: string;
    address: string;
    status: 'pending' | 'completed' | 'cancelled';
    scheduledTime: string;
    completedTime?: string;
    type: 'pickup' | 'delivery';
    customer: string;
    notes?: string;
  }[];
  analytics: {
    fuelUsed: number;
    duration: number;
    efficiency: number;
    cost: number;
  };
}

interface Maintenance {
  id: string;
  vehicle: string;
  type: 'scheduled' | 'repair' | 'inspection';
  status: 'scheduled' | 'in_progress' | 'completed';
  description: string;
  scheduledDate: string;
  completedDate?: string;
  cost?: number;
  provider: string;
  notes?: string;
}

const mockVehicles: Vehicle[] = [
  {
    id: 'v1',
    number: 'TRK-001',
    type: 'truck',
    status: 'active',
    location: {
      latitude: 24.7136,
      longitude: 46.6753,
      address: 'Riyadh Central, Saudi Arabia',
      lastUpdated: '2 minutes ago',
    },
    driver: {
      id: 'd1',
      name: 'Mohammed Ali',
      phone: '+966-123-456-789',
      status: 'on_duty',
    },
    specs: {
      capacity: 2000,
      fuelType: 'Diesel',
      fuelLevel: 75,
      mileage: 45000,
      lastMaintenance: '2024-02-15',
      nextMaintenance: '2024-05-15',
    },
    analytics: {
      utilization: 85,
      fuelEfficiency: 12.5,
      deliveries: 156,
      distance: 2500,
      costs: 3500,
    },
  },
  {
    id: 'v2',
    number: 'VAN-002',
    type: 'van',
    status: 'active',
    location: {
      latitude: 21.4858,
      longitude: 39.1925,
      address: 'Jeddah Port, Saudi Arabia',
      lastUpdated: '5 minutes ago',
    },
    driver: {
      id: 'd2',
      name: 'Ahmed Hassan',
      phone: '+966-123-456-790',
      status: 'on_duty',
    },
    specs: {
      capacity: 1000,
      fuelType: 'Gasoline',
      fuelLevel: 60,
      mileage: 32000,
      lastMaintenance: '2024-03-01',
      nextMaintenance: '2024-06-01',
    },
    analytics: {
      utilization: 78,
      fuelEfficiency: 14.2,
      deliveries: 98,
      distance: 1800,
      costs: 2800,
    },
  },
  {
    id: 'v3',
    number: 'TRK-003',
    type: 'truck',
    status: 'maintenance',
    location: {
      latitude: 26.4207,
      longitude: 50.1033,
      address: 'Dammam Service Center, Saudi Arabia',
      lastUpdated: '1 day ago',
    },
    specs: {
      capacity: 2500,
      fuelType: 'Diesel',
      fuelLevel: 30,
      mileage: 78000,
      lastMaintenance: '2024-03-15',
      nextMaintenance: '2024-06-15',
    },
    analytics: {
      utilization: 65,
      fuelEfficiency: 11.8,
      deliveries: 132,
      distance: 2200,
      costs: 4200,
    },
  },
];

const mockDrivers: Driver[] = [
  {
    id: 'd1',
    name: 'Mohammed Ali',
    phone: '+966-123-456-789',
    email: 'mohammed.ali@example.com',
    licenseNumber: 'DL-12345',
    licenseExpiry: '2025-06-30',
    status: 'on_duty',
    vehicle: 'v1',
    performance: {
      deliveries: 156,
      onTimeRate: 98.5,
      customerRating: 4.8,
      distance: 2500,
    },
    location: {
      latitude: 24.7136,
      longitude: 46.6753,
      address: 'Riyadh Central, Saudi Arabia',
      lastUpdated: '2 minutes ago',
    },
  },
  {
    id: 'd2',
    name: 'Ahmed Hassan',
    phone: '+966-123-456-790',
    email: 'ahmed.hassan@example.com',
    licenseNumber: 'DL-67890',
    licenseExpiry: '2025-08-15',
    status: 'on_duty',
    vehicle: 'v2',
    performance: {
      deliveries: 98,
      onTimeRate: 96.2,
      customerRating: 4.7,
      distance: 1800,
    },
    location: {
      latitude: 21.4858,
      longitude: 39.1925,
      address: 'Jeddah Port, Saudi Arabia',
      lastUpdated: '5 minutes ago',
    },
  },
  {
    id: 'd3',
    name: 'Khalid Omar',
    phone: '+966-123-456-791',
    email: 'khalid.omar@example.com',
    licenseNumber: 'DL-24680',
    licenseExpiry: '2025-05-20',
    status: 'available',
    performance: {
      deliveries: 132,
      onTimeRate: 97.8,
      customerRating: 4.9,
      distance: 2200,
    },
  },
];

const mockRoutes: Route[] = [
  {
    id: 'r1',
    name: 'Riyadh Central Delivery Route',
    status: 'active',
    vehicle: 'v1',
    driver: 'd1',
    startTime: '2024-03-19T08:00:00Z',
    distance: 45,
    stops: [
      {
        id: 's1',
        address: 'Warehouse A, Industrial Area, Riyadh',
        status: 'completed',
        scheduledTime: '2024-03-19T08:30:00Z',
        completedTime: '2024-03-19T08:25:00Z',
        type: 'pickup',
        customer: 'Acme Industries',
      },
      {
        id: 's2',
        address: 'Business District, Building 5, Riyadh',
        status: 'completed',
        scheduledTime: '2024-03-19T09:30:00Z',
        completedTime: '2024-03-19T09:35:00Z',
        type: 'delivery',
        customer: 'Global Corp',
      },
      {
        id: 's3',
        address: 'North Suburb Mall, Riyadh',
        status: 'pending',
        scheduledTime: '2024-03-19T10:30:00Z',
        type: 'delivery',
        customer: 'Retail Solutions',
        notes: 'Delivery to loading dock only',
      },
    ],
    analytics: {
      fuelUsed: 12.5,
      duration: 180,
      efficiency: 3.6,
      cost: 450,
    },
  },
  {
    id: 'r2',
    name: 'Jeddah Port Distribution',
    status: 'active',
    vehicle: 'v2',
    driver: 'd2',
    startTime: '2024-03-19T07:30:00Z',
    distance: 38,
    stops: [
      {
        id: 's4',
        address: 'Jeddah Port Terminal 3',
        status: 'completed',
        scheduledTime: '2024-03-19T08:00:00Z',
        completedTime: '2024-03-19T08:10:00Z',
        type: 'pickup',
        customer: 'Maritime Imports',
      },
      {
        id: 's5',
        address: 'Central Market, Jeddah',
        status: 'pending',
        scheduledTime: '2024-03-19T09:15:00Z',
        type: 'delivery',
        customer: 'Market Vendors Association',
      },
    ],
    analytics: {
      fuelUsed: 8.2,
      duration: 120,
      efficiency: 4.6,
      cost: 320,
    },
  },
];

const mockMaintenance: Maintenance[] = [
  {
    id: 'm1',
    vehicle: 'v3',
    type: 'repair',
    status: 'in_progress',
    description: 'Engine overhaul and transmission service',
    scheduledDate: '2024-03-15',
    provider: 'Central Auto Service',
    notes: 'Expected to be completed by March 20',
  },
  {
    id: 'm2',
    vehicle: 'v1',
    type: 'scheduled',
    status: 'scheduled',
    description: 'Regular 50,000 km maintenance',
    scheduledDate: '2024-05-15',
    provider: 'Dealer Service Center',
  },
  {
    id: 'm3',
    vehicle: 'v2',
    type: 'scheduled',
    status: 'scheduled',
    description: 'Regular 35,000 km maintenance',
    scheduledDate: '2024-06-01',
    provider: 'Dealer Service Center',
  },
];

const FleetManagement = () => {
  const [activeTab, setActiveTab] = useState<'vehicles' | 'drivers' | 'routes' | 'maintenance' | 'analytics'>('vehicles');
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [selectedMaintenance, setSelectedMaintenance] = useState<string | null>(null);
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);
  const [isAddingDriver, setIsAddingDriver] = useState(false);
  const [isAddingRoute, setIsAddingRoute] = useState(false);
  const [isAddingMaintenance, setIsAddingMaintenance] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [drivers, setDrivers] = useState<Driver[]>(mockDrivers);
  const [routes, setRoutes] = useState<Route[]>(mockRoutes);
  const [maintenance, setMaintenance] = useState<Maintenance[]>(mockMaintenance);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'available':
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'maintenance':
      case 'on_duty':
      case 'in_progress':
        return 'text-yellow-600 bg-yellow-50';
      case 'inactive':
      case 'off_duty':
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'available':
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'maintenance':
      case 'on_duty':
      case 'in_progress':
        return <Clock className="h-4 w-4" />;
      case 'inactive':
      case 'off_duty':
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getVehicleTypeIcon = (type: Vehicle['type']) => {
    switch (type) {
      case 'truck':
        return <Truck className="h-6 w-6" />;
      case 'van':
        return <Truck className="h-6 w-6" />;
      case 'bike':
        return <Truck className="h-6 w-6" />;
      default:
        return <Truck className="h-6 w-6" />;
    }
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    if (filterStatus !== 'all' && vehicle.status !== filterStatus) {
      return false;
    }
    if (filterType !== 'all' && vehicle.type !== filterType) {
      return false;
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        vehicle.number.toLowerCase().includes(query) ||
        vehicle.location.address.toLowerCase().includes(query) ||
        (vehicle.driver?.name.toLowerCase().includes(query) || false)
      );
    }
    return true;
  });

  const filteredDrivers = drivers.filter(driver => {
    if (filterStatus !== 'all' && driver.status !== filterStatus) {
      return false;
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        driver.name.toLowerCase().includes(query) ||
        driver.phone.toLowerCase().includes(query) ||
        driver.email.toLowerCase().includes(query) ||
        driver.licenseNumber.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const filteredRoutes = routes.filter(route => {
    if (filterStatus !== 'all' && route.status !== filterStatus) {
      return false;
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        route.name.toLowerCase().includes(query) ||
        route.stops.some(stop => stop.address.toLowerCase().includes(query) || stop.customer.toLowerCase().includes(query))
      );
    }
    return true;
  });

  const filteredMaintenance = maintenance.filter(item => {
    if (filterStatus !== 'all' && item.status !== filterStatus) {
      return false;
    }
    if (filterType !== 'all' && item.type !== filterType) {
      return false;
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        item.description.toLowerCase().includes(query) ||
        item.provider.toLowerCase().includes(query) ||
        (item.notes?.toLowerCase().includes(query) || false)
      );
    }
    return true;
  });

  const selectedVehicleData = selectedVehicle ? vehicles.find(v => v.id === selectedVehicle) : null;
  const selectedDriverData = selectedDriver ? drivers.find(d => d.id === selectedDriver) : null;
  const selectedRouteData = selectedRoute ? routes.find(r => r.id === selectedRoute) : null;
  const selectedMaintenanceData = selectedMaintenance ? maintenance.find(m => m.id === selectedMaintenance) : null;

  return (
    <div className="space-y-6">
      {/* Vehicle Details */}
      {selectedVehicleData && (
        <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-lg ${
                selectedVehicleData.status === 'active' ? 'bg-green-50 text-green-600' :
                selectedVehicleData.status === 'maintenance' ? 'bg-yellow-50 text-yellow-600' :
                'bg-red-50 text-red-600'
              }`}>
                {getVehicleTypeIcon(selectedVehicleData.type)}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{selectedVehicleData.number}</h2>
                <div className="flex items-center space-x-4 text-sm text-secondary-600">
                  <span className="capitalize">{selectedVehicleData.type}</span>
                  <span>•</span>
                  <span>Capacity: {selectedVehicleData.specs.capacity} kg</span>
                  <span>•</span>
                  <span>Fuel: {selectedVehicleData.specs.fuelType}</span>
                </div>
              </div>
            </div>
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusColor(selectedVehicleData.status)}`}>
              {getStatusIcon(selectedVehicleData.status)}
              <span className="capitalize">{selectedVehicleData.status}</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-secondary-100 mb-6">
            <div className="flex space-x-6">
              <button className="px-4 py-2 border-b-2 border-primary-500 text-primary-600 font-medium">
                Overview
              </button>
              <button className="px-4 py-2 text-secondary-600 hover:text-secondary-900">
                Maintenance
              </button>
              <button className="px-4 py-2 text-secondary-600 hover:text-secondary-900">
                Routes
              </button>
              <button className="px-4 py-2 text-secondary-600 hover:text-secondary-900">
                Analytics
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="grid grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="col-span-1 space-y-6">
              {/* Location */}
              <div className="p-6 bg-secondary-50 rounded-xl border border-secondary-200">
                <h3 className="font-semibold mb-4">Current Location</h3>
                <div className="aspect-video bg-gray-200 rounded-lg mb-4">
                  {/* Map placeholder */}
                </div>
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-5 w-5 text-secondary-600 mt-1" />
                    <div>
                      <p className="font-medium">{selectedVehicleData.location.address}</p>
                      <p className="text-sm text-secondary-600">
                        Last updated: {selectedVehicleData.location.lastUpdated}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FleetManagement;