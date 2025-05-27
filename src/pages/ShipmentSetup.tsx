import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Truck,
  Building2,
  Package,
  MapPin,
  Clock,
  DollarSign,
  Plus,
  Trash2,
  User,
  FileText,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import ProductSetupProgress from '../components/ProductSetupProgress';

interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  phone: string;
  status: 'available' | 'busy' | 'offline';
}

interface Vehicle {
  id: string;
  number: string;
  type: 'truck' | 'van' | 'bike';
  capacity: number;
  fuelType: string;
  assignedDriver?: string;
}

interface DeliveryZone {
  id: string;
  name: string;
  baseFee: number;
  minOrderValue: number;
  estimatedTime: string;
}

const ShipmentSetup = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('select-product');
  const [selectedShipmentType, setSelectedShipmentType] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>([]);

  const mockProducts = [
    { id: '1', name: 'Premium Gas Cylinder', image: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=800' },
    { id: '2', name: 'Industrial Gas Tank', image: 'https://images.unsplash.com/photo-1597773150796-e5c14ebecbf5?w=800' },
    { id: '3', name: 'Solar Panels', image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800' },
    { id: '4', name: 'Water Dispenser', image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=800' },
  ];

  const logisticsPartners = [
    { id: '1', name: 'Aramex', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Aramex_logo.svg/2560px-Aramex_logo.svg.png' },
    { id: '2', name: 'DHL', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/DHL_Logo.svg/2560px-DHL_Logo.svg.png' },
    { id: '3', name: 'SMSA', logo: 'https://smsa.com/wp-content/uploads/2022/06/smsa-express-logo.png' },
  ];

  const handleAddVehicle = () => {
    const newVehicle: Vehicle = {
      id: Date.now().toString(),
      number: '',
      type: 'truck',
      capacity: 0,
      fuelType: '',
    };
    setVehicles([...vehicles, newVehicle]);
  };

  const handleAddDriver = () => {
    const newDriver: Driver = {
      id: Date.now().toString(),
      name: '',
      licenseNumber: '',
      phone: '',
      status: 'available',
    };
    setDrivers([...drivers, newDriver]);
  };

  const handleAddDeliveryZone = () => {
    const newZone: DeliveryZone = {
      id: Date.now().toString(),
      name: '',
      baseFee: 0,
      minOrderValue: 0,
      estimatedTime: '',
    };
    setDeliveryZones([...deliveryZones, newZone]);
  };

  const handleNext = () => {
    const tabs = ['select-product', 'shipment-type', 'delivery-zones'];
    const currentIndex = tabs.indexOf(activeTab);
    
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    } else {
      // Submit and navigate to approval page
      navigate('/setup/approval');
    }
  };

  const handleBack = () => {
    const tabs = ['select-product', 'shipment-type', 'delivery-zones'];
    const currentIndex = tabs.indexOf(activeTab);
    
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    } else {
      navigate('/setup/add-product');
    }
  };

  const isNextDisabled = () => {
    if (activeTab === 'select-product' && !selectedProduct) return true;
    if (activeTab === 'shipment-type' && !selectedShipmentType) return true;
    if (activeTab === 'delivery-zones' && deliveryZones.length === 0) return true;
    return false;
  };

  const renderProductSelection = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {mockProducts.map((product) => (
        <button
          key={product.id}
          onClick={() => setSelectedProduct(product.id)}
          className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
            selectedProduct === product.id
              ? 'border-primary-500 shadow-lg'
              : 'border-secondary-200 hover:border-primary-200'
          }`}
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
            <span className="text-white font-medium">{product.name}</span>
          </div>
          {selectedProduct === product.id && (
            <div className="absolute top-2 right-2 bg-primary-500 text-white p-1 rounded-full">
              <CheckCircle className="h-4 w-4" />
            </div>
          )}
        </button>
      ))}
    </div>
  );

  const renderShipmentTypeSelection = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <button
        onClick={() => setSelectedShipmentType('third-party')}
        className={`p-6 rounded-xl border-2 transition-all ${
          selectedShipmentType === 'third-party'
            ? 'border-primary-500 bg-primary-50'
            : 'border-secondary-200 hover:border-primary-200'
        }`}
      >
        <Building2 className="h-8 w-8 text-primary-600 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Third-Party Fleet</h3>
        <p className="text-sm text-secondary-600">
          Partner with registered shipping companies for your deliveries
        </p>
      </button>

      <button
        onClick={() => setSelectedShipmentType('logistics')}
        className={`p-6 rounded-xl border-2 transition-all ${
          selectedShipmentType === 'logistics'
            ? 'border-primary-500 bg-primary-50'
            : 'border-secondary-200 hover:border-primary-200'
        }`}
      >
        <Truck className="h-8 w-8 text-primary-600 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Logistics Company</h3>
        <p className="text-sm text-secondary-600">
          Use established logistics providers with global networks
        </p>
      </button>

      <button
        onClick={() => setSelectedShipmentType('own-fleet')}
        className={`p-6 rounded-xl border-2 transition-all ${
          selectedShipmentType === 'own-fleet'
            ? 'border-primary-500 bg-primary-50'
            : 'border-secondary-200 hover:border-primary-200'
        }`}
      >
        <Package className="h-8 w-8 text-primary-600 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Own Fleet</h3>
        <p className="text-sm text-secondary-600">
          Manage your own vehicles and drivers for deliveries
        </p>
      </button>
    </div>
  );

  const renderLogisticsPartners = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {logisticsPartners.map((partner) => (
          <button
            key={partner.id}
            className="p-6 rounded-xl border-2 border-secondary-200 hover:border-primary-200 transition-all"
          >
            <img
              src={partner.logo}
              alt={partner.name}
              className="h-12 object-contain mb-4"
            />
            <div className="flex items-center justify-between">
              <span className="font-medium">{partner.name}</span>
              <span className="text-sm text-primary-600">View Rates →</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderOwnFleet = () => (
    <div className="space-y-8">
      {/* Vehicles */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Vehicles</h3>
          <button
            onClick={handleAddVehicle}
            className="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
          >
            <Plus className="h-5 w-5" />
            <span>Add Vehicle</span>
          </button>
        </div>
        <div className="space-y-4">
          {vehicles.map((vehicle, index) => (
            <div key={vehicle.id} className="p-4 bg-secondary-50 rounded-lg">
              <div className="grid grid-cols-4 gap-4">
                <input
                  type="text"
                  placeholder="Vehicle Number"
                  className="input-field"
                  value={vehicle.number}
                  onChange={(e) => {
                    const newVehicles = [...vehicles];
                    newVehicles[index].number = e.target.value;
                    setVehicles(newVehicles);
                  }}
                />
                <select
                  className="input-field"
                  value={vehicle.type}
                  onChange={(e) => {
                    const newVehicles = [...vehicles];
                    newVehicles[index].type = e.target.value as Vehicle['type'];
                    setVehicles(newVehicles);
                  }}
                >
                  <option value="truck">Truck</option>
                  <option value="van">Van</option>
                  <option value="bike">Bike</option>
                </select>
                <input
                  type="number"
                  placeholder="Capacity (kg)"
                  className="input-field"
                  value={vehicle.capacity}
                  onChange={(e) => {
                    const newVehicles = [...vehicles];
                    newVehicles[index].capacity = Number(e.target.value);
                    setVehicles(newVehicles);
                  }}
                />
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Fuel Type"
                    className="input-field"
                    value={vehicle.fuelType}
                    onChange={(e) => {
                      const newVehicles = [...vehicles];
                      newVehicles[index].fuelType = e.target.value;
                      setVehicles(newVehicles);
                    }}
                  />
                  <button
                    onClick={() => setVehicles(vehicles.filter((_, i) => i !== index))}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Drivers */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Drivers</h3>
          <button
            onClick={handleAddDriver}
            className="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
          >
            <Plus className="h-5 w-5" />
            <span>Add Driver</span>
          </button>
        </div>
        <div className="space-y-4">
          {drivers.map((driver, index) => (
            <div key={driver.id} className="p-4 bg-secondary-50 rounded-lg">
              <div className="grid grid-cols-4 gap-4">
                <input
                  type="text"
                  placeholder="Driver Name"
                  className="input-field"
                  value={driver.name}
                  onChange={(e) => {
                    const newDrivers = [...drivers];
                    newDrivers[index].name = e.target.value;
                    setDrivers(newDrivers);
                  }}
                />
                <input
                  type="text"
                  placeholder="License Number"
                  className="input-field"
                  value={driver.licenseNumber}
                  onChange={(e) => {
                    const newDrivers = [...drivers];
                    newDrivers[index].licenseNumber = e.target.value;
                    setDrivers(newDrivers);
                  }}
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="input-field"
                  value={driver.phone}
                  onChange={(e) => {
                    const newDrivers = [...drivers];
                    newDrivers[index].phone = e.target.value;
                    setDrivers(newDrivers);
                  }}
                />
                <div className="flex items-center space-x-2">
                  <select
                    className="input-field"
                    value={driver.status}
                    onChange={(e) => {
                      const newDrivers = [...drivers];
                      newDrivers[index].status = e.target.value as Driver['status'];
                      setDrivers(newDrivers);
                    }}
                  >
                    <option value="available">Available</option>
                    <option value="busy">Busy</option>
                    <option value="offline">Offline</option>
                  </select>
                  <button
                    onClick={() => setDrivers(drivers.filter((_, i) => i !== index))}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDeliveryZones = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Delivery Zones</h3>
        <button
          onClick={handleAddDeliveryZone}
          className="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
        >
          <Plus className="h-5 w-5" />
          <span>Add Zone</span>
        </button>
      </div>

      <div className="space-y-4">
        {deliveryZones.map((zone, index) => (
          <div key={zone.id} className="p-4 bg-secondary-50 rounded-lg">
            <div className="grid grid-cols-5 gap-4">
              <input
                type="text"
                placeholder="Zone Name"
                className="input-field"
                value={zone.name}
                onChange={(e) => {
                  const newZones = [...deliveryZones];
                  newZones[index].name = e.target.value;
                  setDeliveryZones(newZones);
                }}
              />
              <div className="relative">
                <input
                  type="number"
                  placeholder="Base Fee"
                  className="input-field pl-8"
                  value={zone.baseFee}
                  onChange={(e) => {
                    const newZones = [...deliveryZones];
                    newZones[index].baseFee = Number(e.target.value);
                    setDeliveryZones(newZones);
                  }}
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400">$</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  placeholder="Min. Order"
                  className="input-field pl-8"
                  value={zone.minOrderValue}
                  onChange={(e) => {
                    const newZones = [...deliveryZones];
                    newZones[index].minOrderValue = Number(e.target.value);
                    setDeliveryZones(newZones);
                  }}
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400">$</span>
              </div>
              <input
                type="text"
                placeholder="Est. Time (e.g., 2-3 days)"
                className="input-field"
                value={zone.estimatedTime}
                onChange={(e) => {
                  const newZones = [...deliveryZones];
                  newZones[index].estimatedTime = e.target.value;
                  setDeliveryZones(newZones);
                }}
              />
              <div className="flex items-center justify-end">
                <button
                  onClick={() => setDeliveryZones(deliveryZones.filter((_, i) => i !== index))}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Setup Progress */}
      <ProductSetupProgress currentStep={2} currentSubStep={activeTab} />

      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <h1 className="text-2xl font-bold text-secondary-900 mb-2">🚚 Shipment Setup</h1>
        <p className="text-secondary-600">
          Configure your delivery options and logistics preferences to ensure smooth order fulfillment.
        </p>
      </div>

      {/* Sub Progress */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <div className="flex space-x-8">
          {[
            { id: 'select-product', label: 'Select Product', icon: <Package className="h-5 w-5" /> },
            { id: 'shipment-type', label: 'Shipment Method', icon: <Truck className="h-5 w-5" /> },
            { id: 'delivery-zones', label: 'Delivery Zones', icon: <MapPin className="h-5 w-5" /> },
          ].map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center space-x-2 pb-4 border-b-2 ${
                activeTab === id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-secondary-500 hover:text-secondary-700'
              }`}
            >
              {icon}
              <span>{label}</span>
              {activeTab === id && (
                <div className="w-2 h-2 rounded-full bg-primary-600" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        {activeTab === 'select-product' && renderProductSelection()}
        {activeTab === 'shipment-type' && (
          <div className="space-y-8">
            {renderShipmentTypeSelection()}
            {selectedShipmentType === 'logistics' && renderLogisticsPartners()}
            {selectedShipmentType === 'own-fleet' && renderOwnFleet()}
          </div>
        )}
        {activeTab === 'delivery-zones' && renderDeliveryZones()}
      </div>

      {/* Actions */}
      <div className="flex justify-between">
        <button
          onClick={handleBack}
          className="px-6 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors"
        >
          Back
        </button>
        <div className="space-x-3">
          <button
            type="button"
            className="px-6 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors"
          >
            Save Draft
          </button>
          <button
            onClick={handleNext}
            className="btn-primary px-6"
            disabled={isNextDisabled()}
          >
            {activeTab === 'delivery-zones' ? 'Next: Submit for Approval' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShipmentSetup;