import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Truck,
  MapPin,
  Clock,
  Package,
  Phone,
  Mail,
  User,
  Building2,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  Calendar,
  Download,
  RefreshCw,
  ChevronDown,
  MessageSquare,
  Share2,
  ExternalLink,
} from 'lucide-react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Line,
  Marker,
} from "react-simple-maps";

const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

interface Shipment {
  id: string;
  trackingNumber: string;
  status: 'in_transit' | 'delivered' | 'delayed' | 'pending';
  estimatedDelivery: string;
  currentLocation: {
    city: string;
    coordinates: [number, number];
  };
  destination: {
    address: string;
    city: string;
    coordinates: [number, number];
  };
  customer: {
    name: string;
    phone: string;
    email: string;
    type: 'B2B' | 'B2C';
  };
  driver?: {
    name: string;
    phone: string;
    vehicleNumber: string;
  };
  order: {
    number: string;
    items: {
      name: string;
      quantity: number;
    }[];
    total: number;
  };
  timeline: {
    time: string;
    status: string;
    location: string;
    description: string;
  }[];
}

const mockShipments: Shipment[] = [
  {
    id: '1',
    trackingNumber: 'TRK-2024-001',
    status: 'in_transit',
    estimatedDelivery: '2024-03-20 14:30:00',
    currentLocation: {
      city: 'Riyadh',
      coordinates: [46.6753, 24.7136],
    },
    destination: {
      address: '123 Business District, Jeddah',
      city: 'Jeddah',
      coordinates: [39.1925, 21.4858],
    },
    customer: {
      name: 'Acme Industries',
      phone: '+966-123-456-789',
      email: 'shipping@acme.com',
      type: 'B2B',
    },
    driver: {
      name: 'Mohammed Ali',
      phone: '+966-987-654-321',
      vehicleNumber: 'TRK-123',
    },
    order: {
      number: 'ORD-2024-001',
      items: [
        { name: 'Industrial Gas Tank', quantity: 5 },
        { name: 'Safety Valves', quantity: 10 },
      ],
      total: 2499.95,
    },
    timeline: [
      {
        time: '2024-03-19 09:00:00',
        status: 'Order Picked Up',
        location: 'Riyadh Warehouse',
        description: 'Shipment collected from warehouse',
      },
      {
        time: '2024-03-19 10:30:00',
        status: 'In Transit',
        location: 'Riyadh',
        description: 'Vehicle en route to destination',
      },
      {
        time: '2024-03-19 14:15:00',
        status: 'Checkpoint Cleared',
        location: 'Makkah Region Border',
        description: 'Passed security checkpoint',
      },
    ],
  },
  // Add more mock shipments as needed
];

const ShipmentTracking = () => {
  const [selectedShipment, setSelectedShipment] = useState<string>(mockShipments[0].id);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const getStatusColor = (status: Shipment['status']) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-50 text-green-700';
      case 'in_transit':
        return 'bg-blue-50 text-blue-700';
      case 'delayed':
        return 'bg-red-50 text-red-700';
      case 'pending':
        return 'bg-yellow-50 text-yellow-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const getStatusIcon = (status: Shipment['status']) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-5 w-5" />;
      case 'in_transit':
        return <Truck className="h-5 w-5" />;
      case 'delayed':
        return <AlertCircle className="h-5 w-5" />;
      case 'pending':
        return <Clock className="h-5 w-5" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const currentShipment = mockShipments.find(s => s.id === selectedShipment);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900 mb-2">
              🚚 Shipment Tracking
            </h1>
            <p className="text-secondary-600">
              Track and manage your shipments in real-time
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
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by tracking number or order ID..."
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
            <option value="in_transit">In Transit</option>
            <option value="delivered">Delivered</option>
            <option value="delayed">Delayed</option>
            <option value="pending">Pending</option>
          </select>
          <button className="px-4 py-2 border border-secondary-200 rounded-lg hover:bg-secondary-50 flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Date Range</span>
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </div>

      {currentShipment && (
        <div className="grid grid-cols-3 gap-6">
          {/* Shipment Details */}
          <div className="col-span-1 space-y-6">
            {/* Status Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Shipment Status</h2>
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusColor(currentShipment.status)}`}>
                  {getStatusIcon(currentShipment.status)}
                  <span className="capitalize">{currentShipment.status.replace('_', ' ')}</span>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-secondary-600">Tracking Number</label>
                  <p className="font-medium">{currentShipment.trackingNumber}</p>
                </div>
                <div>
                  <label className="text-sm text-secondary-600">Estimated Delivery</label>
                  <p className="font-medium">{new Date(currentShipment.estimatedDelivery).toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm text-secondary-600">Current Location</label>
                  <p className="font-medium">{currentShipment.currentLocation.city}</p>
                </div>
              </div>
            </div>

            {/* Customer Details */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
              <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-secondary-400" />
                  <div>
                    <p className="font-medium">{currentShipment.customer.name}</p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      currentShipment.customer.type === 'B2B'
                        ? 'bg-purple-50 text-purple-700'
                        : 'bg-blue-50 text-blue-700'
                    }`}>
                      {currentShipment.customer.type}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-secondary-400" />
                  <p>{currentShipment.customer.phone}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-secondary-400" />
                  <p>{currentShipment.customer.email}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Building2 className="h-5 w-5 text-secondary-400" />
                  <p>{currentShipment.destination.address}</p>
                </div>
              </div>
            </div>

            {/* Driver Details */}
            {currentShipment.driver && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
                <h2 className="text-lg font-semibold mb-4">Driver Information</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-secondary-400" />
                    <p className="font-medium">{currentShipment.driver.name}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-secondary-400" />
                    <p>{currentShipment.driver.phone}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Truck className="h-5 w-5 text-secondary-400" />
                    <p>Vehicle: {currentShipment.driver.vehicleNumber}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Map and Timeline */}
          <div className="col-span-2 space-y-6">
            {/* Map */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Live Tracking</h2>
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-secondary-100 rounded-lg text-secondary-600">
                    <Share2 className="h-5 w-5" />
                  </button>
                  <button className="p-2 hover:bg-secondary-100 rounded-lg text-secondary-600">
                    <ExternalLink className="h-5 w-5" />
                  </button>
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
                  {/* Origin Marker */}
                  <Marker coordinates={currentShipment.currentLocation.coordinates}>
                    <circle r={8} fill="#0EA5E9" stroke="#fff" strokeWidth={2} />
                  </Marker>
                  {/* Destination Marker */}
                  <Marker coordinates={currentShipment.destination.coordinates}>
                    <circle r={8} fill="#EC4899" stroke="#fff" strokeWidth={2} />
                  </Marker>
                  {/* Route Line */}
                  <Line
                    from={currentShipment.currentLocation.coordinates}
                    to={currentShipment.destination.coordinates}
                    stroke="#0EA5E9"
                    strokeWidth={2}
                    strokeDasharray="6,6"
                  />
                </ComposableMap>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
              <h2 className="text-lg font-semibold mb-6">Shipment Timeline</h2>
              <div className="space-y-6">
                {currentShipment.timeline.map((event, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-12">
                      <div className="h-12 flex items-center justify-center">
                        <div className="h-4 w-4 rounded-full bg-primary-500" />
                      </div>
                      {index < currentShipment.timeline.length - 1 && (
                        <div className="h-full w-px bg-primary-200 mx-auto" />
                      )}
                    </div>
                    <div className="flex-1 ml-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">{event.status}</h3>
                        <time className="text-sm text-secondary-500">
                          {new Date(event.time).toLocaleString()}
                        </time>
                      </div>
                      <p className="text-secondary-600 mt-1">{event.description}</p>
                      <p className="text-sm text-secondary-500 mt-1">
                        <MapPin className="h-4 w-4 inline mr-1" />
                        {event.location}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Details */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
              <h2 className="text-lg font-semibold mb-4">Order Details</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-secondary-600">Order Number</span>
                  <span className="font-medium">{currentShipment.order.number}</span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-secondary-600 mb-2">Items</h3>
                  <div className="space-y-2">
                    {currentShipment.order.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span>{item.name}</span>
                        <span>x{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-secondary-100">
                  <span className="font-medium">Total Amount</span>
                  <span className="font-bold text-lg">${currentShipment.order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShipmentTracking;