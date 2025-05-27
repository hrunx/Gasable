import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload,
  Clock,
  Plus,
  MapPin,
  Phone,
  Mail,
  Building2,
  FileText,
  CreditCard,
  Flag,
  Globe,
  CheckSquare,
  AlertCircle
} from 'lucide-react';
import SetupProgress from '../components/SetupProgress';
import CompanyProfileDialog from '../components/CompanyProfileDialog';

interface WorkingHours {
  open: string;
  close: string;
  is24Hours: boolean;
  isOffDay: boolean;
}

interface StoreFormData {
  storeType: string;
  storeName: string;
  crNumber: string;
  vatNumber: string;
  phone: string;
  email: string;
  nationality: string;
  country: string;
  city: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  services: {
    pickup: boolean;
    delivery: boolean;
  };
  isActive: boolean;
  workingHours: {
    [key: string]: WorkingHours;
  };
  useCompanyProfile: boolean;
}

const initialWorkingHours: WorkingHours = {
  open: '09:00',
  close: '17:00',
  is24Hours: false,
  isOffDay: false,
};

const daysOfWeek = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const AddStore = () => {
  const navigate = useNavigate();
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [hasCompanyProfile, setHasCompanyProfile] = useState(false);
  const [formData, setFormData] = useState<StoreFormData>({
    storeType: '',
    storeName: '',
    crNumber: '',
    vatNumber: '',
    phone: '',
    email: '',
    nationality: '',
    country: '',
    city: '',
    address: '',
    location: {
      lat: 0,
      lng: 0,
    },
    services: {
      pickup: false,
      delivery: false,
    },
    isActive: true,
    workingHours: daysOfWeek.reduce((acc, day) => ({
      ...acc,
      [day]: { ...initialWorkingHours }
    }), {}),
    useCompanyProfile: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleServiceToggle = (service: 'pickup' | 'delivery') => {
    setFormData(prev => ({
      ...prev,
      services: {
        ...prev.services,
        [service]: !prev.services[service]
      }
    }));
  };

  const handleWorkingHoursChange = (day: string, field: keyof WorkingHours, value: string | boolean) => {
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

  const handleCompanyProfileSubmit = (profileData: any) => {
    setHasCompanyProfile(true);
    // TODO: Implement profile data handling
  };

  const handleUseCompanyProfile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    if (checked && !hasCompanyProfile) {
      setIsProfileDialogOpen(true);
      e.preventDefault();
      return;
    }
    setFormData(prev => ({ ...prev, useCompanyProfile: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement store creation logic
    navigate('/setup/products');
  };

  return (
    <div className="space-y-6">
      {/* Setup Progress */}
      <SetupProgress currentStep={0} />

      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900 mb-2">🏬 Add Store</h1>
            <p className="text-secondary-600">
              Fill in your store details to begin your journey on the Gasable marketplace.
            </p>
          </div>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.useCompanyProfile}
              onChange={handleUseCompanyProfile}
              className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
            />
            <span className="text-secondary-700">Use Company Profile</span>
          </label>
        </div>
        {!hasCompanyProfile && (
          <div className="flex items-center space-x-2 text-yellow-600 bg-yellow-50 p-3 rounded-lg">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm">Complete your company profile to use this feature</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
          <h2 className="text-lg font-semibold text-secondary-900 mb-6">Basic Information</h2>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
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
                  <option value="gas_distributor">Gas Distributor</option>
                  <option value="fuel_depot">Fuel Depot</option>
                  <option value="warehouse">Warehouse</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Store Name
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-400" />
                  <input
                    type="text"
                    name="storeName"
                    value={formData.storeName}
                    onChange={handleInputChange}
                    className="input-field pl-10"
                    placeholder="Enter store name"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  C.R. Number
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-400" />
                  <input
                    type="text"
                    name="crNumber"
                    value={formData.crNumber}
                    onChange={handleInputChange}
                    className="input-field pl-10"
                    placeholder="Enter C.R. number"
                    required
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  VAT Number
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-400" />
                  <input
                    type="text"
                    name="vatNumber"
                    value={formData.vatNumber}
                    onChange={handleInputChange}
                    className="input-field pl-10"
                    placeholder="Enter VAT number"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="input-field pl-10"
                    placeholder="Enter phone number"
                    required
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input-field pl-10"
                    placeholder="Enter email address"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Location Information */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
          <h2 className="text-lg font-semibold text-secondary-900 mb-6">Location Information</h2>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Nationality
                </label>
                <div className="relative">
                  <Flag className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-400" />
                  <input
                    type="text"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleInputChange}
                    className="input-field pl-10"
                    placeholder="Enter nationality"
                    required
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Operating Country
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-400" />
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="input-field pl-10"
                    placeholder="Enter country"
                    required
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Operating City
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-400" />
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="input-field pl-10"
                    placeholder="Enter city"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Full Address
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
          </div>
        </div>

        {/* Services & Status */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
          <h2 className="text-lg font-semibold text-secondary-900 mb-6">Services & Status</h2>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.services.pickup}
                  onChange={() => handleServiceToggle('pickup')}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-secondary-700">Pickup Available</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.services.delivery}
                  onChange={() => handleServiceToggle('delivery')}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-secondary-700">Delivery Available</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-secondary-700">Store Active</span>
              </label>
            </div>
          </div>
        </div>

        {/* Working Hours */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
          <h2 className="text-lg font-semibold text-secondary-900 mb-6">Working Hours</h2>
          
          <div className="space-y-4">
            {daysOfWeek.map((day) => (
              <div key={day} className="flex items-center space-x-4">
                <div className="w-24">
                  <span className="text-secondary-700">{day}</span>
                </div>
                <div className="flex-1 flex items-center space-x-4">
                  <input
                    type="time"
                    value={formData.workingHours[day].open}
                    onChange={(e) => handleWorkingHoursChange(day, 'open', e.target.value)}
                    className="input-field"
                    disabled={formData.workingHours[day].is24Hours || formData.workingHours[day].isOffDay}
                  />
                  <span className="text-secondary-400">to</span>
                  <input
                    type="time"
                    value={formData.workingHours[day].close}
                    onChange={(e) => handleWorkingHoursChange(day, 'close', e.target.value)}
                    className="input-field"
                    disabled={formData.workingHours[day].is24Hours || formData.workingHours[day].isOffDay}
                  />
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.workingHours[day].is24Hours}
                      onChange={(e) => handleWorkingHoursChange(day, 'is24Hours', e.target.checked)}
                      className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                      disabled={formData.workingHours[day].isOffDay}
                    />
                    <span className="text-secondary-700">24 Hours</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.workingHours[day].isOffDay}
                      onChange={(e) => handleWorkingHoursChange(day, 'isOffDay', e.target.checked)}
                      className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                    />
                    <span className="text-secondary-700">Off Day</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => navigate('/setup')}
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
              type="submit"
              className="btn-primary px-6"
            >
              Next: Add Products
            </button>
          </div>
        </div>
      </form>

      {/* Company Profile Dialog */}
      <CompanyProfileDialog
        isOpen={isProfileDialogOpen}
        onClose={() => setIsProfileDialogOpen(false)}
        onSubmit={handleCompanyProfileSubmit}
      />
    </div>
  );
};

export default AddStore;