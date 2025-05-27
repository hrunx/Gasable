import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Store,
  MapPin,
  Phone,
  Mail,
  Building2,
  Clock,
  Calendar,
  Users,
  Package,
  CheckSquare,
  Plus,
  Trash2,
  Upload,
  Save,
  ArrowLeft,
  Info,
} from 'lucide-react';

interface BranchFormData {
  name: string;
  type: string;
  address: string;
  city: string;
  country: string;
  coordinates: {
    latitude: string;
    longitude: string;
  };
  manager: {
    name: string;
    phone: string;
    email: string;
  };
  operatingHours: {
    is24Hours: boolean;
    weekdays: {
      open: string;
      close: string;
    };
    weekends: {
      open: string;
      close: string;
    };
  };
  services: string[];
  documents: File[];
}

const initialFormData: BranchFormData = {
  name: '',
  type: '',
  address: '',
  city: '',
  country: '',
  coordinates: {
    latitude: '',
    longitude: '',
  },
  manager: {
    name: '',
    phone: '',
    email: '',
  },
  operatingHours: {
    is24Hours: false,
    weekdays: {
      open: '09:00',
      close: '17:00',
    },
    weekends: {
      open: '10:00',
      close: '16:00',
    },
  },
  services: [],
  documents: [],
};

const serviceOptions = [
  'Fuel',
  'LPG',
  'EV Charging',
  'Hydrogen',
  'Convenience Store',
  'Service Center',
  'Car Wash',
  'Tire Service',
  'Oil Change',
  'Battery Service',
];

const AddBranch = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<BranchFormData>(initialFormData);
  const [activeStep, setActiveStep] = useState(0);
  const [customService, setCustomService] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof BranchFormData],
          [child]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleCoordinatesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      coordinates: {
        ...prev.coordinates,
        [name]: value,
      },
    }));
  };

  const handleManagerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      manager: {
        ...prev.manager,
        [name]: value,
      },
    }));
  };

  const handleOperatingHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        operatingHours: {
          ...prev.operatingHours,
          [name]: checked,
        },
      }));
    } else {
      const [period, timeType] = name.split('.');
      setFormData(prev => ({
        ...prev,
        operatingHours: {
          ...prev.operatingHours,
          [period]: {
            ...prev.operatingHours[period as 'weekdays' | 'weekends'],
            [timeType]: value,
          },
        },
      }));
    }
  };

  const handleServiceToggle = (service: string) => {
    setFormData(prev => {
      const services = prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service];
      
      return {
        ...prev,
        services,
      };
    });
  };

  const handleAddCustomService = () => {
    if (customService.trim() && !formData.services.includes(customService)) {
      setFormData(prev => ({
        ...prev,
        services: [...prev.services, customService],
      }));
      setCustomService('');
    }
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, ...newFiles],
      }));
    }
  };

  const handleRemoveDocument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }));
  };

  const handleNext = () => {
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // In a real app, you would send this data to your backend
    navigate('/dashboard/stores/branches');
  };

  const steps = [
    { title: 'Basic Information', description: 'Branch details and location' },
    { title: 'Manager & Contact', description: 'Assign manager and contact info' },
    { title: 'Operating Hours', description: 'Set business hours' },
    { title: 'Services & Documents', description: 'Available services and documentation' },
  ];

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Branch Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter branch name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Branch Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  <option value="">Select branch type</option>
                  <option value="gas_station">Gas Station</option>
                  <option value="lpg_store">LPG Store</option>
                  <option value="energy_retail">Energy Retail</option>
                  <option value="warehouse">Warehouse</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Address *
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="input-field h-24"
                placeholder="Enter full address"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  City *
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
                  Country *
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

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Latitude
                </label>
                <input
                  type="text"
                  name="latitude"
                  value={formData.coordinates.latitude}
                  onChange={handleCoordinatesChange}
                  className="input-field"
                  placeholder="Enter latitude"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Longitude
                </label>
                <input
                  type="text"
                  name="longitude"
                  value={formData.coordinates.longitude}
                  onChange={handleCoordinatesChange}
                  className="input-field"
                  placeholder="Enter longitude"
                />
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Manager Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.manager.name}
                onChange={handleManagerChange}
                className="input-field"
                placeholder="Enter manager name"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.manager.phone}
                  onChange={handleManagerChange}
                  className="input-field"
                  placeholder="Enter phone number"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.manager.email}
                  onChange={handleManagerChange}
                  className="input-field"
                  placeholder="Enter email address"
                  required
                />
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-start space-x-3">
                <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-blue-800 font-medium">Manager Responsibilities</p>
                  <ul className="mt-2 text-sm text-blue-700 space-y-1 list-disc pl-5">
                    <li>Oversee daily operations of the branch</li>
                    <li>Manage staff and assign responsibilities</li>
                    <li>Ensure compliance with safety regulations</li>
                    <li>Monitor inventory and equipment maintenance</li>
                    <li>Report performance metrics to headquarters</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="is24Hours"
                  checked={formData.operatingHours.is24Hours}
                  onChange={handleOperatingHoursChange}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-secondary-700">Open 24 Hours</span>
              </label>
            </div>

            {!formData.operatingHours.is24Hours && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-3">
                    Weekday Hours (Monday - Friday)
                  </label>
                  <div className="flex items-center space-x-4">
                    <div>
                      <label className="block text-xs text-secondary-500 mb-1">Open</label>
                      <input
                        type="time"
                        name="weekdays.open"
                        value={formData.operatingHours.weekdays.open}
                        onChange={handleOperatingHoursChange}
                        className="input-field"
                      />
                    </div>
                    <span className="text-secondary-400">to</span>
                    <div>
                      <label className="block text-xs text-secondary-500 mb-1">Close</label>
                      <input
                        type="time"
                        name="weekdays.close"
                        value={formData.operatingHours.weekdays.close}
                        onChange={handleOperatingHoursChange}
                        className="input-field"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-3">
                    Weekend Hours (Saturday - Sunday)
                  </label>
                  <div className="flex items-center space-x-4">
                    <div>
                      <label className="block text-xs text-secondary-500 mb-1">Open</label>
                      <input
                        type="time"
                        name="weekends.open"
                        value={formData.operatingHours.weekends.open}
                        onChange={handleOperatingHoursChange}
                        className="input-field"
                      />
                    </div>
                    <span className="text-secondary-400">to</span>
                    <div>
                      <label className="block text-xs text-secondary-500 mb-1">Close</label>
                      <input
                        type="time"
                        name="weekends.close"
                        value={formData.operatingHours.weekends.close}
                        onChange={handleOperatingHoursChange}
                        className="input-field"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
              <div className="flex items-start space-x-3">
                <Info className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-yellow-800 font-medium">Operating Hours Note</p>
                  <p className="mt-1 text-sm text-yellow-700">
                    Make sure your operating hours comply with local regulations. For gas stations and energy retail locations, 
                    consider peak hours and customer traffic patterns when setting your schedule.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-3">
                Services Offered
              </label>
              <div className="grid grid-cols-3 gap-3">
                {serviceOptions.map((service) => (
                  <label key={service} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.services.includes(service)}
                      onChange={() => handleServiceToggle(service)}
                      className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                    />
                    <span className="text-secondary-700">{service}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Add Custom Service
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={customService}
                  onChange={(e) => setCustomService(e.target.value)}
                  className="input-field flex-1"
                  placeholder="Enter service name"
                />
                <button
                  type="button"
                  onClick={handleAddCustomService}
                  className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-3">
                Selected Services
              </label>
              <div className="flex flex-wrap gap-2">
                {formData.services.map((service, index) => (
                  <div key={index} className="flex items-center space-x-1 px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full">
                    <span>{service}</span>
                    <button
                      type="button"
                      onClick={() => handleServiceToggle(service)}
                      className="text-secondary-500 hover:text-secondary-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {formData.services.length === 0 && (
                  <p className="text-sm text-secondary-500">No services selected</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-3">
                Upload Documents
              </label>
              <div className="border-2 border-dashed border-secondary-200 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto text-secondary-400 mb-2" />
                <p className="text-secondary-600 mb-2">
                  Drag and drop files here or click to browse
                </p>
                <p className="text-xs text-secondary-500 mb-4">
                  Upload permits, licenses, floor plans, or other relevant documents
                </p>
                <input
                  type="file"
                  multiple
                  onChange={handleDocumentUpload}
                  className="hidden"
                  id="document-upload"
                />
                <label
                  htmlFor="document-upload"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 cursor-pointer"
                >
                  Select Files
                </label>
              </div>
            </div>

            {formData.documents.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-3">
                  Uploaded Documents
                </label>
                <div className="space-y-2">
                  {formData.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-secondary-500" />
                        <span className="text-secondary-700">{doc.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveDocument(index)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900 mb-2">
              🏬 Add New Branch
            </h1>
            <p className="text-secondary-600">
              Register a new gas station, LPG store, or energy retail location
            </p>
          </div>
          <button
            onClick={() => navigate('/dashboard/stores/branches')}
            className="flex items-center space-x-2 px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Directory</span>
          </button>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={index} className={`flex-1 ${index < steps.length - 1 ? 'relative' : ''}`}>
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  index < activeStep ? 'bg-primary-600 text-white' :
                  index === activeStep ? 'bg-primary-100 text-primary-600 border-2 border-primary-600' :
                  'bg-secondary-100 text-secondary-500'
                }`}>
                  {index < activeStep ? (
                    <CheckSquare className="h-5 w-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <div className="text-center mt-2">
                  <p className={`font-medium ${
                    index <= activeStep ? 'text-primary-600' : 'text-secondary-500'
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-secondary-500 mt-1">{step.description}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`absolute top-5 left-1/2 w-full h-0.5 ${
                  index < activeStep ? 'bg-primary-600' : 'bg-secondary-200'
                }`}></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        {renderStepContent()}
      </form>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={activeStep === 0 ? () => navigate('/dashboard/stores/branches') : handleBack}
          className="px-6 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors"
        >
          {activeStep === 0 ? 'Cancel' : 'Back'}
        </button>
        <div className="space-x-3">
          <button
            type="button"
            className="px-6 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors"
          >
            Save Draft
          </button>
          {activeStep < steps.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="btn-primary px-6"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="btn-primary px-6 flex items-center space-x-2"
            >
              <Save className="h-5 w-5" />
              <span>Create Branch</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddBranch;