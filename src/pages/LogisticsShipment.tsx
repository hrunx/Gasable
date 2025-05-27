import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Truck,
  Package,
  MapPin,
  Search,
  Filter,
  Download,
  Upload,
  Edit,
  Trash2,
  Eye,
  Plus,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowUpDown,
  Calendar,
  User,
  Building2,
  DollarSign,
  MoreVertical,
  ChevronDown,
  Tag,
  Gauge,
  Droplets,
  Thermometer,
  Zap,
  Flame,
  Scale,
  Settings,
  Star,
  X,
} from 'lucide-react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Line,
} from "react-simple-maps";

// Updated to use a more reliable CDN source
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface Vehicle {
  id: string;
  name: string;
  type: 'truck' | 'van' | 'bike';
  licensePlate: string;
  capacity: string;
  status: 'active' | 'maintenance' | 'inactive';
  lastMaintenance: string;
  nextMaintenance: string;
  assignedDriver?: string;
  fuelType: string;
  fuelEfficiency: string;
}

interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  licenseNumber: string;
  licenseExpiry: string;
  status: 'available' | 'on_duty' | 'off_duty';
  rating: number;
  totalDeliveries: number;
  joinDate: string;
  assignedVehicle?: string;
}

interface DeliveryZone {
  id: string;
  name: string;
  coverage: string[];
  baseFee: number;
  additionalFee: number;
  minOrderValue: number;
  estimatedTime: string;
  active: boolean;
}

interface ShipmentPartner {
  id: string;
  name: string;
  type: 'logistics' | 'courier' | 'freight';
  contactPerson: string;
  phone: string;
  email: string;
  website: string;
  status: 'active' | 'inactive';
  coverage: string[];
  rating: number;
  contractStart: string;
  contractEnd: string;
}

const mockVehicles: Vehicle[] = [
  {
    id: '1',
    name: 'Delivery Truck 1',
    type: 'truck',
    licensePlate: 'ABC-1234',
    capacity: '2000 kg',
    status: 'active',
    lastMaintenance: '2024-02-15',
    nextMaintenance: '2024-05-15',
    assignedDriver: '1',
    fuelType: 'Diesel',
    fuelEfficiency: '12 km/l',
  },
  {
    id: '2',
    name: 'Delivery Van 1',
    type: 'van',
    licensePlate: 'DEF-5678',
    capacity: '800 kg',
    status: 'active',
    lastMaintenance: '2024-03-01',
    nextMaintenance: '2024-06-01',
    assignedDriver: '2',
    fuelType: 'Gasoline',
    fuelEfficiency: '15 km/l',
  },
  {
    id: '3',
    name: 'Delivery Truck 2',
    type: 'truck',
    licensePlate: 'GHI-9012',
    capacity: '1500 kg',
    status: 'maintenance',
    lastMaintenance: '2024-03-10',
    nextMaintenance: '2024-06-10',
    fuelType: 'Diesel',
    fuelEfficiency: '10 km/l',
  },
];

const mockDrivers: Driver[] = [
  {
    id: '1',
    name: 'Ahmed Al-Saud',
    phone: '+966-123-456-789',
    email: 'ahmed@example.com',
    licenseNumber: 'DL-12345',
    licenseExpiry: '2025-12-31',
    status: 'available',
    rating: 4.8,
    totalDeliveries: 156,
    joinDate: '2023-01-15',
    assignedVehicle: '1',
  },
  {
    id: '2',
    name: 'Mohammed Al-Qahtani',
    phone: '+966-987-654-321',
    email: 'mohammed@example.com',
    licenseNumber: 'DL-67890',
    licenseExpiry: '2026-06-30',
    status: 'on_duty',
    rating: 4.9,
    totalDeliveries: 203,
    joinDate: '2022-11-10',
    assignedVehicle: '2',
  },
  {
    id: '3',
    name: 'Khalid Al-Harbi',
    phone: '+966-555-123-456',
    email: 'khalid@example.com',
    licenseNumber: 'DL-54321',
    licenseExpiry: '2025-08-15',
    status: 'off_duty',
    rating: 4.7,
    totalDeliveries: 142,
    joinDate: '2023-03-22',
  },
];

const mockDeliveryZones: DeliveryZone[] = [
  {
    id: '1',
    name: 'Riyadh Central',
    coverage: ['Al Olaya', 'Al Malaz', 'Al Murabba'],
    baseFee: 15.00,
    additionalFee: 5.00,
    minOrderValue: 50.00,
    estimatedTime: '1-2 hours',
    active: true,
  },
  {
    id: '2',
    name: 'Riyadh North',
    coverage: ['Al Nakheel', 'Al Sahafah', 'Al Wadi'],
    baseFee: 20.00,
    additionalFee: 7.50,
    minOrderValue: 75.00,
    estimatedTime: '2-3 hours',
    active: true,
  },
  {
    id: '3',
    name: 'Jeddah Central',
    coverage: ['Al Balad', 'Al Hamra', 'Al Andalus'],
    baseFee: 18.00,
    additionalFee: 6.00,
    minOrderValue: 60.00,
    estimatedTime: '1-2 hours',
    active: true,
  },
];

const mockShipmentPartners: ShipmentPartner[] = [
  {
    id: '1',
    name: 'Aramex',
    type: 'logistics',
    contactPerson: 'Samir Al-Faisal',
    phone: '+966-123-789-456',
    email: 'samir@aramex.com',
    website: 'https://www.aramex.com',
    status: 'active',
    coverage: ['Riyadh', 'Jeddah', 'Dammam', 'Mecca'],
    rating: 4.7,
    contractStart: '2023-01-01',
    contractEnd: '2024-12-31',
  },
  {
    id: '2',
    name: 'DHL Express',
    type: 'courier',
    contactPerson: 'Fatima Al-Zahrani',
    phone: '+966-456-123-789',
    email: 'fatima@dhl.com',
    website: 'https://www.dhl.com',
    status: 'active',
    coverage: ['All Saudi Arabia', 'International'],
    rating: 4.9,
    contractStart: '2023-03-15',
    contractEnd: '2025-03-14',
  },
  {
    id: '3',
    name: 'Saudi Post',
    type: 'logistics',
    contactPerson: 'Abdullah Al-Otaibi',
    phone: '+966-789-456-123',
    email: 'abdullah@saudipost.com',
    website: 'https://www.saudipost.com',
    status: 'inactive',
    coverage: ['All Saudi Arabia'],
    rating: 4.2,
    contractStart: '2022-06-01',
    contractEnd: '2023-12-31',
  },
];

const LogisticsShipment = () => {
  const [activeTab, setActiveTab] = useState('vehicles');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  
  // Vehicles state
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [isAddVehicleModalOpen, setIsAddVehicleModalOpen] = useState(false);
  const [vehicleFormData, setVehicleFormData] = useState<Partial<Vehicle>>({
    type: 'truck',
    status: 'active',
  });
  
  // Drivers state
  const [drivers, setDrivers] = useState<Driver[]>(mockDrivers);
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const [isAddDriverModalOpen, setIsAddDriverModalOpen] = useState(false);
  const [driverFormData, setDriverFormData] = useState<Partial<Driver>>({
    status: 'available',
  });
  
  // Delivery Zones state
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>(mockDeliveryZones);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [isAddZoneModalOpen, setIsAddZoneModalOpen] = useState(false);
  const [zoneFormData, setZoneFormData] = useState<Partial<DeliveryZone>>({
    active: true,
  });
  
  // Shipment Partners state
  const [shipmentPartners, setShipmentPartners] = useState<ShipmentPartner[]>(mockShipmentPartners);
  const [selectedPartner, setSelectedPartner] = useState<string | null>(null);
  const [isAddPartnerModalOpen, setIsAddPartnerModalOpen] = useState(false);
  const [partnerFormData, setPartnerFormData] = useState<Partial<ShipmentPartner>>({
    type: 'logistics',
    status: 'active',
  });

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
        return 'bg-green-50 text-green-700';
      case 'maintenance':
      case 'on_duty':
        return 'bg-yellow-50 text-yellow-700';
      case 'inactive':
      case 'off_duty':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'available':
        return <CheckCircle className="h-4 w-4" />;
      case 'maintenance':
      case 'on_duty':
        return <Clock className="h-4 w-4" />;
      case 'inactive':
      case 'off_duty':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const handleVehicleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setVehicleFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDriverInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDriverFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleZoneInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setZoneFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handlePartnerInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPartnerFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    const newVehicle: Vehicle = {
      id: Date.now().toString(),
      name: vehicleFormData.name || '',
      type: vehicleFormData.type as 'truck' | 'van' | 'bike',
      licensePlate: vehicleFormData.licensePlate || '',
      capacity: vehicleFormData.capacity || '',
      status: vehicleFormData.status as 'active' | 'maintenance' | 'inactive',
      lastMaintenance: vehicleFormData.lastMaintenance || new Date().toISOString().split('T')[0],
      nextMaintenance: vehicleFormData.nextMaintenance || '',
      fuelType: vehicleFormData.fuelType || '',
      fuelEfficiency: vehicleFormData.fuelEfficiency || '',
      assignedDriver: vehicleFormData.assignedDriver,
    };
    setVehicles([...vehicles, newVehicle]);
    setIsAddVehicleModalOpen(false);
    setVehicleFormData({
      type: 'truck',
      status: 'active',
    });
  };

  const handleAddDriver = (e: React.FormEvent) => {
    e.preventDefault();
    const newDriver: Driver = {
      id: Date.now().toString(),
      name: driverFormData.name || '',
      phone: driverFormData.phone || '',
      email: driverFormData.email || '',
      licenseNumber: driverFormData.licenseNumber || '',
      licenseExpiry: driverFormData.licenseExpiry || '',
      status: driverFormData.status as 'available' | 'on_duty' | 'off_duty',
      rating: driverFormData.rating || 5,
      totalDeliveries: driverFormData.totalDeliveries || 0,
      joinDate: driverFormData.joinDate || new Date().toISOString().split('T')[0],
      assignedVehicle: driverFormData.assignedVehicle,
    };
    setDrivers([...drivers, newDriver]);
    setIsAddDriverModalOpen(false);
    setDriverFormData({
      status: 'available',
    });
  };

  const handleAddZone = (e: React.FormEvent) => {
    e.preventDefault();
    const newZone: DeliveryZone = {
      id: Date.now().toString(),
      name: zoneFormData.name || '',
      coverage: zoneFormData.coverage ? (zoneFormData.coverage as string).split(',').map(item => item.trim()) : [],
      baseFee: zoneFormData.baseFee || 0,
      additionalFee: zoneFormData.additionalFee || 0,
      minOrderValue: zoneFormData.minOrderValue || 0,
      estimatedTime: zoneFormData.estimatedTime || '',
      active: zoneFormData.active !== undefined ? zoneFormData.active as boolean : true,
    };
    setDeliveryZones([...deliveryZones, newZone]);
    setIsAddZoneModalOpen(false);
    setZoneFormData({
      active: true,
    });
  };

  const handleAddPartner = (e: React.FormEvent) => {
    e.preventDefault();
    const newPartner: ShipmentPartner = {
      id: Date.now().toString(),
      name: partnerFormData.name || '',
      type: partnerFormData.type as 'logistics' | 'courier' | 'freight',
      contactPerson: partnerFormData.contactPerson || '',
      phone: partnerFormData.phone || '',
      email: partnerFormData.email || '',
      website: partnerFormData.website || '',
      status: partnerFormData.status as 'active' | 'inactive',
      coverage: partnerFormData.coverage ? (partnerFormData.coverage as string).split(',').map(item => item.trim()) : [],
      rating: partnerFormData.rating || 5,
      contractStart: partnerFormData.contractStart || new Date().toISOString().split('T')[0],
      contractEnd: partnerFormData.contractEnd || '',
    };
    setShipmentPartners([...shipmentPartners, newPartner]);
    setIsAddPartnerModalOpen(false);
    setPartnerFormData({
      type: 'logistics',
      status: 'active',
    });
  };

  const renderVehiclesTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Fleet Management</h2>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsAddVehicleModalOpen(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Vehicle</span>
          </button>
          <button className="px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Import</span>
          </button>
          <button className="px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors flex items-center space-x-2">
            <Download className="h-5 w-5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-secondary-50">
              <th className="py-4 px-6 text-left font-medium text-secondary-600">Vehicle</th>
              <th className="py-4 px-6 text-left font-medium text-secondary-600">Type</th>
              <th className="py-4 px-6 text-left font-medium text-secondary-600">License Plate</th>
              <th className="py-4 px-6 text-left font-medium text-secondary-600">Capacity</th>
              <th className="py-4 px-6 text-left font-medium text-secondary-600">Assigned Driver</th>
              <th className="py-4 px-6 text-left font-medium text-secondary-600">Status</th>
              <th className="py-4 px-6 text-left font-medium text-secondary-600">Maintenance</th>
              <th className="py-4 px-6 text-left font-medium text-secondary-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id} className="border-b border-secondary-100">
                <td className="py-4 px-6 font-medium">{vehicle.name}</td>
                <td className="py-4 px-6 capitalize">{vehicle.type}</td>
                <td className="py-4 px-6">{vehicle.licensePlate}</td>
                <td className="py-4 px-6">{vehicle.capacity}</td>
                <td className="py-4 px-6">
                  {vehicle.assignedDriver ? (
                    drivers.find(d => d.id === vehicle.assignedDriver)?.name || 'Unassigned'
                  ) : (
                    'Unassigned'
                  )}
                </td>
                <td className="py-4 px-6">
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${getStatusColor(vehicle.status)}`}>
                    {getStatusIcon(vehicle.status)}
                    <span className="capitalize">{vehicle.status}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div>
                    <div className="text-sm text-secondary-600">Last: {vehicle.lastMaintenance}</div>
                    <div className="text-sm text-secondary-600">Next: {vehicle.nextMaintenance}</div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedVehicle(selectedVehicle === vehicle.id ? null : vehicle.id)}
                      className="p-1 hover:bg-secondary-100 rounded text-secondary-600"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-1 hover:bg-secondary-100 rounded text-secondary-600">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-1 hover:bg-secondary-100 rounded text-secondary-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Vehicle Modal */}
      {isAddVehicleModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Add New Vehicle</h2>
              <button
                onClick={() => setIsAddVehicleModalOpen(false)}
                className="p-2 hover:bg-secondary-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddVehicle} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Vehicle Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={vehicleFormData.name || ''}
                    onChange={handleVehicleInputChange}
                    className="input-field"
                    placeholder="Enter vehicle name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Vehicle Type
                  </label>
                  <select
                    name="type"
                    value={vehicleFormData.type || 'truck'}
                    onChange={handleVehicleInputChange}
                    className="input-field"
                    required
                  >
                    <option value="truck">Truck</option>
                    <option value="van">Van</option>
                    <option value="bike">Bike</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    License Plate
                  </label>
                  <input
                    type="text"
                    name="licensePlate"
                    value={vehicleFormData.licensePlate || ''}
                    onChange={handleVehicleInputChange}
                    className="input-field"
                    placeholder="Enter license plate"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Capacity
                  </label>
                  <input
                    type="text"
                    name="capacity"
                    value={vehicleFormData.capacity || ''}
                    onChange={handleVehicleInputChange}
                    className="input-field"
                    placeholder="e.g., 2000 kg"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Fuel Type
                  </label>
                  <input
                    type="text"
                    name="fuelType"
                    value={vehicleFormData.fuelType || ''}
                    onChange={handleVehicleInputChange}
                    className="input-field"
                    placeholder="e.g., Diesel, Gasoline"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Fuel Efficiency
                  </label>
                  <input
                    type="text"
                    name="fuelEfficiency"
                    value={vehicleFormData.fuelEfficiency || ''}
                    onChange={handleVehicleInputChange}
                    className="input-field"
                    placeholder="e.g., 12 km/l"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Last Maintenance
                  </label>
                  <input
                    type="date"
                    name="lastMaintenance"
                    value={vehicleFormData.lastMaintenance || ''}
                    onChange={handleVehicleInputChange}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Next Maintenance
                  </label>
                  <input
                    type="date"
                    name="nextMaintenance"
                    value={vehicleFormData.nextMaintenance || ''}
                    onChange={handleVehicleInputChange}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={vehicleFormData.status || 'active'}
                    onChange={handleVehicleInputChange}
                    className="input-field"
                    required
                  >
                    <option value="active">Active</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Assigned Driver
                  </label>
                  <select
                    name="assignedDriver"
                    value={vehicleFormData.assignedDriver || ''}
                    onChange={handleVehicleInputChange}
                    className="input-field"
                  >
                    <option value="">Unassigned</option>
                    {drivers.map((driver) => (
                      <option key={driver.id} value={driver.id}>
                        {driver.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddVehicleModalOpen(false)}
                  className="px-4 py-2 text-secondary-700 hover:bg-secondary-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary px-4 py-2"
                >
                  Add Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderDriversTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Driver Management</h2>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsAddDriverModalOpen(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Driver</span>
          </button>
          <button className="px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Import</span>
          </button>
          <button className="px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors flex items-center space-x-2">
            <Download className="h-5 w-5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-secondary-50">
              <th className="py-4 px-6 text-left font-medium text-secondary-600">Driver</th>
              <th className="py-4 px-6 text-left font-medium text-secondary-600">Contact</th>
              <th className="py-4 px-6 text-left font-medium text-secondary-600">License</th>
              <th className="py-4 px-6 text-left font-medium text-secondary-600">Assigned Vehicle</th>
              <th className="py-4 px-6 text-left font-medium text-secondary-600">Status</th>
              <th className="py-4 px-6 text-left font-medium text-secondary-600">Rating</th>
              <th className="py-4 px-6 text-left font-medium text-secondary-600">Deliveries</th>
              <th className="py-4 px-6 text-left font-medium text-secondary-600">Join Date</th>
              <th className="py-4 px-6 text-left font-medium text-secondary-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver) => (
              <tr key={driver.id} className="border-b border-secondary-100">
                <td className="py-4 px-6 font-medium">{driver.name}</td>
                <td className="py-4 px-6">
                  <div>
                    <div className="text-sm">{driver.phone}</div>
                    <div className="text-sm text-secondary-600">{driver.email}</div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div>
                    <div className="text-sm">{driver.licenseNumber}</div>
                    <div className="text-sm text-secondary-600">Expires: {driver.licenseExpiry}</div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  {driver.assignedVehicle ? (
                    vehicles.find(v => v.id === driver.assignedVehicle)?.name || 'Unassigned'
                  ) : (
                    'Unassigned'
                  )}
                </td>
                <td className="py-4 px-6">
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${getStatusColor(driver.status)}`}>
                    {getStatusIcon(driver.status)}
                    <span className="capitalize">{driver.status.replace('_', ' ')}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1">{driver.rating}</span>
                  </div>
                </td>
                <td className="py-4 px-6">{driver.totalDeliveries}</td>
                <td className="py-4 px-6">{driver.joinDate}</td>
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedDriver(selectedDriver === driver.id ? null : driver.id)}
                      className="p-1 hover:bg-secondary-100 rounded text-secondary-600"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-1 hover:bg-secondary-100 rounded text-secondary-600">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-1 hover:bg-secondary-100 rounded text-secondary-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Driver Modal */}
      {isAddDriverModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Add New Driver</h2>
              <button
                onClick={() => setIsAddDriverModalOpen(false)}
                className="p-2 hover:bg-secondary-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddDriver} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Driver Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={driverFormData.name || ''}
                    onChange={handleDriverInputChange}
                    className="input-field"
                    placeholder="Enter driver name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={driverFormData.phone || ''}
                    onChange={handleDriverInputChange}
                    className="input-field"
                    placeholder="Enter phone number"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={driverFormData.email || ''}
                    onChange={handleDriverInputChange}
                    className="input-field"
                    placeholder="Enter email address"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    License Number
                  </label>
                  <input
                    type="text"
                    name="licenseNumber"
                    value={driverFormData.licenseNumber || ''}
                    onChange={handleDriverInputChange}
                    className="input-field"
                    placeholder="Enter license number"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    License Expiry
                  </label>
                  <input
                    type="date"
                    name="licenseExpiry"
                    value={driverFormData.licenseExpiry || ''}
                    onChange={handleDriverInputChange}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Join Date
                  </label>
                  <input
                    type="date"
                    name="joinDate"
                    value={driverFormData.joinDate || ''}
                    onChange={handleDriverInputChange}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={driverFormData.status || 'available'}
                    onChange={handleDriverInputChange}
                    className="input-field"
                    required
                  >
                    <option value="available">Available</option>
                    <option value="on_duty">On Duty</option>
                    <option value="off_duty">Off Duty</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Assigned Vehicle
                  </label>
                  <select
                    name="assignedVehicle"
                    value={driverFormData.assignedVehicle || ''}
                    onChange={handleDriverInputChange}
                    className="input-field"
                  >
                    <option value="">Unassigned</option>
                    {vehicles.map((vehicle) => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.name} ({vehicle.licensePlate})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddDriverModalOpen(false)}
                  className="px-4 py-2 text-secondary-700 hover:bg-secondary-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary px-4 py-2"
                >
                  Add Driver
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderDeliveryZonesTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Delivery Zones</h2>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsAddZoneModalOpen(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Zone</span>
          </button>
          <button className="px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Import</span>
          </button>
          <button className="px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors flex items-center space-x-2">
            <Download className="h-5 w-5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {deliveryZones.map((zone) => (
          <div
            key={zone.id}
            className={`p-6 rounded-xl border-2 transition-all ${
              selectedZone === zone.id
                ? 'border-primary-500 bg-primary-50'
                : 'border-secondary-200 hover:border-primary-200'
            }`}
            onClick={() => setSelectedZone(selectedZone === zone.id ? null : zone.id)}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{zone.name}</h3>
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                zone.active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {zone.active ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                <span>{zone.active ? 'Active' : 'Inactive'}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-secondary-600">Base Fee:</span>
                <span className="font-medium">${zone.baseFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-600">Additional Fee:</span>
                <span className="font-medium">${zone.additionalFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-600">Min. Order:</span>
                <span className="font-medium">${zone.minOrderValue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-600">Est. Time:</span>
                <span className="font-medium">{zone.estimatedTime}</span>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-medium text-secondary-700 mb-2">Coverage Areas:</h4>
              <div className="flex flex-wrap gap-2">
                {zone.coverage.map((area, index) => (
                  <span key={index} className="px-2 py-1 bg-secondary-100 text-secondary-700 rounded-full text-xs">
                    {area}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-secondary-200 flex justify-end space-x-2">
              <button className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg">
                <Edit className="h-5 w-5" />
              </button>
              <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Zone Modal */}
      {isAddZoneModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Add New Delivery Zone</h2>
              <button
                onClick={() => setIsAddZoneModalOpen(false)}
                className="p-2 hover:bg-secondary-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddZone} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Zone Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={zoneFormData.name || ''}
                  onChange={handleZoneInputChange}
                  className="input-field"
                  placeholder="Enter zone name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Coverage Areas
                </label>
                <textarea
                  name="coverage"
                  value={zoneFormData.coverage || ''}
                  onChange={handleZoneInputChange}
                  className="input-field h-24"
                  placeholder="Enter coverage areas (comma separated)"
                  required
                />
                <p className="text-sm text-secondary-500 mt-1">
                  Enter areas separated by commas (e.g., Al Olaya, Al Malaz, Al Murabba)
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Base Fee ($)
                  </label>
                  <input
                    type="number"
                    name="baseFee"
                    value={zoneFormData.baseFee || ''}
                    onChange={handleZoneInputChange}
                    className="input-field"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Additional Fee ($)
                  </label>
                  <input
                    type="number"
                    name="additionalFee"
                    value={zoneFormData.additionalFee || ''}
                    onChange={handleZoneInputChange}
                    className="input-field"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Min. Order Value ($)
                  </label>
                  <input
                    type="number"
                    name="minOrderValue"
                    value={zoneFormData.minOrderValue || ''}
                    onChange={handleZoneInputChange}
                    className="input-field"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Estimated Delivery Time
                  </label>
                  <input
                    type="text"
                    name="estimatedTime"
                    value={zoneFormData.estimatedTime || ''}
                    onChange={handleZoneInputChange}
                    className="input-field"
                    placeholder="e.g., 1-2 hours, 2-3 days"
                    required
                  />
                </div>
                <div className="flex items-center">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="active"
                      checked={zoneFormData.active === true}
                      onChange={(e) => setZoneFormData(prev => ({ ...prev, active: e.target.checked }))}
                      className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                    />
                    <span>Active Zone</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddZoneModalOpen(false)}
                  className="px-4 py-2 text-secondary-700 hover:bg-secondary-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary px-4 py-2"
                >
                  Add Zone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderPartnersTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Shipment Partners</h2>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsAddPartnerModalOpen(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Partner</span>
          </button>
          <button className="px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Import</span>
          </button>
          <button className="px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors flex items-center space-x-2">
            <Download className="h-5 w-5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-secondary-50">
              <th className="py-4 px-6 text-left font-medium text-secondary-600">Partner</th>
              <th className="py-4 px-6 text-left font-medium text-secondary-600">Type</th>
              <th className="py-4 px-6 text-left font-medium text-secondary-600">Contact</th>
              <th className="py-4 px-6 text-left font-medium text-secondary-600">Coverage</th>
              <th className="py-4 px-6 text-left font-medium text-secondary-600">Rating</th>
              <th className="py-4 px-6 text-left font-medium text-secondary-600">Contract</th>
              <th className="py-4 px-6 text-left font-medium text-secondary-600">Status</th>
              <th className="py-4 px-6 text-left font-medium text-secondary-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {shipmentPartners.map((partner) => (
              <tr key={partner.id} className="border-b border-secondary-100">
                <td className="py-4 px-6">
                  <div className="font-medium">{partner.name}</div>
                  <div className="text-sm text-secondary-600">
                    <a href={partner.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                      {partner.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                </td>
                <td className="py-4 px-6 capitalize">{partner.type}</td>
                <td className="py-4 px-6">
                  <div>
                    <div className="text-sm">{partner.contactPerson}</div>
                    <div className="text-sm text-secondary-600">{partner.phone}</div>
                    <div className="text-sm text-secondary-600">{partner.email}</div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex flex-wrap gap-1">
                    {partner.coverage.map((area, index) => (
                      <span key={index} className="px-2 py-1 bg-secondary-100 text-secondary-700 rounded-full text-xs">
                        {area}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1">{partner.rating}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div>
                    <div className="text-sm">Start: {partner.contractStart}</div>
                    <div className="text-sm text-secondary-600">End: {partner.contractEnd}</div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${getStatusColor(partner.status)}`}>
                    {getStatusIcon(partner.status)}
                    <span className="capitalize">{partner.status}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedPartner(selectedPartner === partner.id ? null : partner.id)}
                      className="p-1 hover:bg-secondary-100 rounded text-secondary-600"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-1 hover:bg-secondary-100 rounded text-secondary-600">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-1 hover:bg-secondary-100 rounded text-secondary-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Partner Modal */}
      {isAddPartnerModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Add New Shipment Partner</h2>
              <button
                onClick={() => setIsAddPartnerModalOpen(false)}
                className="p-2 hover:bg-secondary-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddPartner} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Partner Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={partnerFormData.name || ''}
                    onChange={handlePartnerInputChange}
                    className="input-field"
                    placeholder="Enter partner name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Partner Type
                  </label>
                  <select
                    name="type"
                    value={partnerFormData.type || 'logistics'}
                    onChange={handlePartnerInputChange}
                    className="input-field"
                    required
                  >
                    <option value="logistics">Logistics</option>
                    <option value="courier">Courier</option>
                    <option value="freight">Freight</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    name="contactPerson"
                    value={partnerFormData.contactPerson || ''}
                    onChange={handlePartnerInputChange}
                    className="input-field"
                    placeholder="Enter contact person name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={partnerFormData.phone || ''}
                    onChange={handlePartnerInputChange}
                    className="input-field"
                    placeholder="Enter phone number"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={partnerFormData.email || ''}
                    onChange={handlePartnerInputChange}
                    className="input-field"
                    placeholder="Enter email address"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={partnerFormData.website || ''}
                    onChange={handlePartnerInputChange}
                    className="input-field"
                    placeholder="Enter website URL"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Coverage Areas
                </label>
                <textarea
                  name="coverage"
                  value={partnerFormData.coverage || ''}
                  onChange={handlePartnerInputChange}
                  className="input-field h-24"
                  placeholder="Enter coverage areas (comma separated)"
                  required
                />
                <p className="text-sm text-secondary-500 mt-1">
                  Enter areas separated by commas (e.g., Riyadh, Jeddah, Dammam)
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Rating
                  </label>
                  <input
                    type="number"
                    name="rating"
                    value={partnerFormData.rating || ''}
                    onChange={handlePartnerInputChange}
                    className="input-field"
                    placeholder="0.0"
                    step="0.1"
                    min="0"
                    max="5"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Contract Start
                  </label>
                  <input
                    type="date"
                    name="contractStart"
                    value={partnerFormData.contractStart || ''}
                    onChange={handlePartnerInputChange}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Contract End
                  </label>
                  <input
                    type="date"
                    name="contractEnd"
                    value={partnerFormData.contractEnd || ''}
                    onChange={handlePartnerInputChange}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={partnerFormData.status || 'active'}
                  onChange={handlePartnerInputChange}
                  className="input-field"
                  required
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddPartnerModalOpen(false)}
                  className="px-4 py-2 text-secondary-700 hover:bg-secondary-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary px-4 py-2"
                >
                  Add Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900 mb-2">
              🚚 Logistics & Shipment
            </h1>
            <p className="text-secondary-600">
              Manage your fleet, drivers, delivery zones, and shipment partners
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
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </button>
            <button className="px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors flex items-center space-x-2">
              <Download className="h-5 w-5" />
              <span>Export</span>
            </button>
            <button className="btn-primary flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-secondary-50 p-6 rounded-xl border border-secondary-100"
          >
            <div className="flex items-center justify-between mb-2">
              <Truck className="h-6 w-6 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">{vehicles.length}</span>
            </div>
            <p className="text-secondary-600">Total Vehicles</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-secondary-50 p-6 rounded-xl border border-secondary-100"
          >
            <div className="flex items-center justify-between mb-2">
              <User className="h-6 w-6 text-purple-600" />
              <span className="text-2xl font-bold text-purple-600">{drivers.length}</span>
            </div>
            <p className="text-secondary-600">Total Drivers</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-secondary-50 p-6 rounded-xl border border-secondary-100"
          >
            <div className="flex items-center justify-between mb-2">
              <MapPin className="h-6 w-6 text-green-600" />
              <span className="text-2xl font-bold text-green-600">{deliveryZones.length}</span>
            </div>
            <p className="text-secondary-600">Delivery Zones</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-secondary-50 p-6 rounded-xl border border-secondary-100"
          >
            <div className="flex items-center justify-between mb-2">
              <Building2 className="h-6 w-6 text-yellow-600" />
              <span className="text-2xl font-bold text-yellow-600">{shipmentPartners.length}</span>
            </div>
            <p className="text-secondary-600">Shipment Partners</p>
          </motion.div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <div className="flex space-x-8 border-b border-secondary-100">
          <button
            onClick={() => setActiveTab('vehicles')}
            className={`flex items-center space-x-2 pb-4 border-b-2 transition-colors ${
              activeTab === 'vehicles'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-secondary-500 hover:text-secondary-700'
            }`}
          >
            <Truck className="h-5 w-5" />
            <span>Vehicles</span>
          </button>
          <button
            onClick={() => setActiveTab('drivers')}
            className={`flex items-center space-x-2 pb-4 border-b-2 transition-colors ${
              activeTab === 'drivers'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-secondary-500 hover:text-secondary-700'
            }`}
          >
            <User className="h-5 w-5" />
            <span>Drivers</span>
          </button>
          <button
            onClick={() => setActiveTab('zones')}
            className={`flex items-center space-x-2 pb-4 border-b-2 transition-colors ${
              activeTab === 'zones'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-secondary-500 hover:text-secondary-700'
            }`}
          >
            <MapPin className="h-5 w-5" />
            <span>Delivery Zones</span>
          </button>
          <button
            onClick={() => setActiveTab('partners')}
            className={`flex items-center space-x-2 pb-4 border-b-2 transition-colors ${
              activeTab === 'partners'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-secondary-500 hover:text-secondary-700'
            }`}
          >
            <Building2 className="h-5 w-5" />
            <span>Shipment Partners</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        {activeTab === 'vehicles' && renderVehiclesTab()}
        {activeTab === 'drivers' && renderDriversTab()}
        {activeTab === 'zones' && renderDeliveryZonesTab()}
        {activeTab === 'partners' && renderPartnersTab()}
      </div>
    </div>
  );
};

export default LogisticsShipment;