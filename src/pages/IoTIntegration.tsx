import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Cpu,
  Wifi,
  Settings,
  Plus,
  Trash2,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Battery,
  Signal,
  Upload,
  Download,
  Link,
  Unlink,
  BarChart2,
  Gauge,
  Thermometer,
  Droplets,
  Timer,
} from 'lucide-react';

interface Device {
  id: string;
  name: string;
  type: string;
  status: 'online' | 'offline' | 'error';
  lastSync: string;
  battery: number;
  signal: number;
  location: string;
  readings: {
    type: string;
    value: number;
    unit: string;
  }[];
}

interface Integration {
  id: string;
  name: string;
  status: 'connected' | 'disconnected' | 'pending';
  lastSync: string;
  type: 'api' | 'webhook' | 'custom';
}

const mockDevices: Device[] = [
  {
    id: '1',
    name: 'Gas Level Sensor #1',
    type: 'level_sensor',
    status: 'online',
    lastSync: '2 minutes ago',
    battery: 85,
    signal: 92,
    location: 'Tank Farm A',
    readings: [
      { type: 'level', value: 75.5, unit: '%' },
      { type: 'pressure', value: 2.4, unit: 'bar' },
      { type: 'temperature', value: 23, unit: '°C' },
    ],
  },
  {
    id: '2',
    name: 'Flow Meter #2',
    type: 'flow_meter',
    status: 'online',
    lastSync: '5 minutes ago',
    battery: 92,
    signal: 88,
    location: 'Distribution Line B',
    readings: [
      { type: 'flow_rate', value: 12.3, unit: 'L/min' },
      { type: 'total_flow', value: 1250, unit: 'L' },
      { type: 'pressure', value: 3.1, unit: 'bar' },
    ],
  },
  {
    id: '3',
    name: 'Smart Valve #3',
    type: 'valve',
    status: 'error',
    lastSync: '15 minutes ago',
    battery: 45,
    signal: 65,
    location: 'Emergency Shutoff',
    readings: [
      { type: 'position', value: 100, unit: '%' },
      { type: 'temperature', value: 28, unit: '°C' },
    ],
  },
];

const mockIntegrations: Integration[] = [
  {
    id: '1',
    name: 'ERP System',
    status: 'connected',
    lastSync: '1 minute ago',
    type: 'api',
  },
  {
    id: '2',
    name: 'Fleet Management',
    status: 'connected',
    lastSync: '5 minutes ago',
    type: 'webhook',
  },
  {
    id: '3',
    name: 'SCADA System',
    status: 'disconnected',
    lastSync: 'Never',
    type: 'custom',
  },
];

const IoTIntegration = () => {
  const [activeTab, setActiveTab] = useState('devices');
  const [devices] = useState<Device[]>(mockDevices);
  const [integrations] = useState<Integration[]>(mockIntegrations);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);

  const getStatusColor = (status: Device['status'] | Integration['status']) => {
    switch (status) {
      case 'online':
      case 'connected':
        return 'text-green-600 bg-green-50';
      case 'offline':
      case 'disconnected':
        return 'text-gray-600 bg-gray-50';
      case 'error':
        return 'text-red-600 bg-red-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: Device['status'] | Integration['status']) => {
    switch (status) {
      case 'online':
      case 'connected':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'offline':
      case 'disconnected':
        return <XCircle className="h-4 w-4" />;
      case 'error':
        return <AlertCircle className="h-4 w-4" />;
      case 'pending':
        return <RefreshCw className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getReadingIcon = (type: string) => {
    switch (type) {
      case 'level':
        return <Gauge className="h-5 w-5" />;
      case 'temperature':
        return <Thermometer className="h-5 w-5" />;
      case 'pressure':
        return <Gauge className="h-5 w-5" />;
      case 'flow_rate':
        return <Droplets className="h-5 w-5" />;
      default:
        return <Timer className="h-5 w-5" />;
    }
  };

  const renderDevices = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold">Connected Devices</h2>
          <span className="px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-sm">
            {devices.length} Devices
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <button className="btn-primary flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Add Device</span>
          </button>
          <button className="px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Import</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {devices.map((device) => (
          <motion.div
            key={device.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-xl border-2 transition-all cursor-pointer ${
              selectedDevice === device.id
                ? 'border-primary-500 bg-primary-50'
                : 'border-secondary-200 hover:border-primary-200'
            }`}
            onClick={() => setSelectedDevice(device.id === selectedDevice ? null : device.id)}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold mb-1">{device.name}</h3>
                <p className="text-secondary-600">{device.location}</p>
              </div>
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusColor(device.status)}`}>
                {getStatusIcon(device.status)}
                <span className="capitalize">{device.status}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center space-x-2 text-secondary-600">
                <Battery className="h-5 w-5" />
                <span>{device.battery}%</span>
              </div>
              <div className="flex items-center space-x-2 text-secondary-600">
                <Signal className="h-5 w-5" />
                <span>{device.signal}%</span>
              </div>
            </div>

            <div className="space-y-3">
              {device.readings.map((reading, index) => (
                <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getReadingIcon(reading.type)}
                    <span className="capitalize">{reading.type.replace('_', ' ')}</span>
                  </div>
                  <span className="font-medium">
                    {reading.value} {reading.unit}
                  </span>
                </div>
              ))}
            </div>

            {selectedDevice === device.id && (
              <div className="mt-6 pt-6 border-t border-secondary-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-secondary-600">Last sync: {device.lastSync}</span>
                  <div className="space-x-2">
                    <button className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg">
                      <Settings className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg">
                      <RefreshCw className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderIntegrations = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold">System Integrations</h2>
          <span className="px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-sm">
            {integrations.length} Connected
          </span>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>New Integration</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {integrations.map((integration) => (
          <motion.div
            key={integration.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-xl border border-secondary-200 bg-white"
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold">{integration.name}</h3>
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusColor(integration.status)}`}>
                {getStatusIcon(integration.status)}
                <span className="capitalize">{integration.status}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-secondary-600">Integration Type</span>
                <span className="font-medium capitalize">{integration.type}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-secondary-600">Last Sync</span>
                <span className="font-medium">{integration.lastSync}</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-secondary-100 flex justify-end space-x-2">
              <button className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg">
                <Settings className="h-5 w-5" />
              </button>
              {integration.status === 'connected' ? (
                <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                  <Unlink className="h-5 w-5" />
                </button>
              ) : (
                <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                  <Link className="h-5 w-5" />
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900 mb-2">
              🔌 IoT & Integration Hub
            </h1>
            <p className="text-secondary-600">
              Manage your connected devices and system integrations in one place.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors flex items-center space-x-2">
              <Download className="h-5 w-5" />
              <span>Export Data</span>
            </button>
            <button className="btn-primary flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mt-6">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <Cpu className="h-6 w-6 text-blue-600" />
              <span className="text-2xl font-bold text-blue-700">{devices.length}</span>
            </div>
            <p className="text-sm text-blue-600">Active Devices</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-100">
            <div className="flex items-center justify-between mb-2">
              <Wifi className="h-6 w-6 text-green-600" />
              <span className="text-2xl font-bold text-green-700">
                {devices.filter(d => d.status === 'online').length}
              </span>
            </div>
            <p className="text-sm text-green-600">Online Devices</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
              <span className="text-2xl font-bold text-yellow-700">
                {devices.filter(d => d.status === 'error').length}
              </span>
            </div>
            <p className="text-sm text-yellow-600">Alerts</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
            <div className="flex items-center justify-between mb-2">
              <Link className="h-6 w-6 text-purple-600" />
              <span className="text-2xl font-bold text-purple-700">
                {integrations.filter(i => i.status === 'connected').length}
              </span>
            </div>
            <p className="text-sm text-purple-600">Active Integrations</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <div className="flex space-x-8 border-b border-secondary-100">
          <button
            onClick={() => setActiveTab('devices')}
            className={`flex items-center space-x-2 pb-4 border-b-2 transition-colors ${
              activeTab === 'devices'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-secondary-500 hover:text-secondary-700'
            }`}
          >
            <Cpu className="h-5 w-5" />
            <span>Devices</span>
          </button>
          <button
            onClick={() => setActiveTab('integrations')}
            className={`flex items-center space-x-2 pb-4 border-b-2 transition-colors ${
              activeTab === 'integrations'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-secondary-500 hover:text-secondary-700'
            }`}
          >
            <Link className="h-5 w-5" />
            <span>Integrations</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        {activeTab === 'devices' && renderDevices()}
        {activeTab === 'integrations' && renderIntegrations()}
      </div>
    </div>
  );
};

export default IoTIntegration;