import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin,
  Phone,
  Mail,
  Building2,
  FileText,
  CreditCard,
  Globe,
  CheckSquare,
  AlertCircle,
  Cloud,
  Store as StoreIcon,
  Package,
  CheckCircle,
  Upload,
  Camera,
  Plus,
  Trash2,
  Gauge,
  Droplets,
  Zap,
  Flame,
  Scale,
  Truck,
  User,
  ArrowRight
} from 'lucide-react';
import SetupProgress from '../components/SetupProgress';
import CompanyProfileDialog from '../components/CompanyProfileDialog';
import { useStoreCreation } from '../lib/hooks/useStoreCreation';
import { useProducts } from '../lib/hooks/useProducts';
import { useLogistics } from '../lib/hooks/useLogistics';

interface WorkingHours {
  open: string;
  close: string;
  is24Hours: boolean;
  isOffDay: boolean;
}

interface StoreFormData {
  storeType: string;
  storeName: string;
  storeCategory: 'physical' | 'cloud';
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
  invoicingMethod: 'merchant' | 'gasable';
}

interface ProductAttribute {
  name: string;
  value: string;
  unit?: string;
}

interface ProductFormData {
  name: string;
  brand: string;
  type: string;
  model: string;
  category: string;
  tags: string[];
  description: string;
  images: File[];
  documents: File[];
  certifications: string[];
  standards: string[];
  safetyInfo: string;
  mechanical: ProductAttribute[];
  physical: ProductAttribute[];
  chemical: ProductAttribute[];
  electrical: ProductAttribute[];
  fuel: ProductAttribute[];
  basePrice: number;
  b2bPrice: number;
  b2cPrice: number;
  minOrderQuantity: number;
  vatIncluded: boolean;
}

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
  const { createStore } = useStoreCreation();
  const { createProduct } = useProducts();
  const { createLogistics } = useLogistics();
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [hasCompanyProfile, setHasCompanyProfile] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [createdStore, setCreatedStore] = useState<Record<string, any> | null>(null);
  
  // Product form state
  const [currentProductStep, setCurrentProductStep] = useState(0); // 0: General, 1: Advanced, 2: Attributes, 3: Pricing
  const [productValidationErrors, setProductValidationErrors] = useState<string[]>([]);
  const [formErrors, setFormErrors] = useState<string | null>(null);
  const [productFormData, setProductFormData] = useState<ProductFormData>({
    name: '',
    brand: '',
    type: '',
    model: '',
    category: '',
    tags: [],
    description: '',
    images: [],
    documents: [],
    certifications: [],
    standards: [],
    safetyInfo: '',
    mechanical: [],
    physical: [],
    chemical: [],
    electrical: [],
    fuel: [],
    basePrice: 0,
    b2bPrice: 0,
    b2cPrice: 0,
    minOrderQuantity: 1,
    vatIncluded: true,
  });
  
  // Logistics form state
  const [activeLogisticsTab, setActiveLogisticsTab] = useState('delivery-zones');
  const [selectedShipmentType, setSelectedShipmentType] = useState<string>('');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>([]);

  const [formData, setFormData] = useState<StoreFormData>({
    storeType: '',
    storeName: '',
    storeCategory: 'physical',
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
    invoicingMethod: 'merchant',
  });

  const steps = [
    { id: 'store', title: 'Store Information', description: 'Basic store details and configuration' },
    { id: 'products', title: 'Add Products', description: 'List your energy products and services' },
    { id: 'shipment', title: 'Shipment Setup', description: 'Configure delivery and logistics' },
    { id: 'approval', title: 'Approval Process', description: 'Submit for Gasable verification' },
    { id: 'go-live', title: 'Go Live', description: 'Activate your store on the marketplace' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };
      
      // If switching to cloud store, disable pickup service
      if (name === 'storeCategory' && value === 'cloud') {
        newData.services = {
          ...prev.services,
          pickup: false
        };
      }
      
      return newData;
    });
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

  const handleCompanyProfileSubmit = () => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      setFormErrors(null); // Clear previous errors
      
      if (currentStep === 0) {
        // Store creation step
        const workingHours = {
          weekdays: {
            open: formData.workingHours.Monday.open,
            close: formData.workingHours.Monday.close
          },
          weekends: {
            open: formData.workingHours.Saturday.open,
            close: formData.workingHours.Saturday.close
          },
          is24Hours: formData.workingHours.Monday.is24Hours
        };

        const storeData = {
          name: formData.storeName,
          type: formData.storeType,
          store_category: formData.storeCategory,
          address: formData.address,
          city: formData.city,
          country: formData.country,
          services: formData.services,
          working_hours: workingHours
        };

        const store = await createStore(storeData);
        
        if (store) {
          console.log('Store created successfully:', store);
          setCreatedStore(store);
          
          if (formData.storeCategory === 'physical') {
            console.log('Physical store created - main branch will be auto-created');
          } else {
            console.log('Cloud store created - ready for product setup');
          }
          
          setCurrentStep(1);
        }
      } else if (currentStep === 1) {
        // Product creation step
        if (!createdStore?.id) {
          throw new Error('Store not found. Please go back and create store first.');
        }

        // Validate product data
        if (!productFormData.name || !productFormData.brand || !productFormData.type || 
            !productFormData.category || productFormData.basePrice <= 0) {
          throw new Error('Please fill in all required product fields (name, brand, type, category, and base price).');
        }

        // Create product linked to the store using the actual API
        const productData = {
          company_id: createdStore.company_id,
          store_id: createdStore.id,
          name: productFormData.name,
          brand: productFormData.brand,
          type: productFormData.type,
          model: productFormData.model,
          category: productFormData.category,
          description: productFormData.description,
          status: 'active',
          certifications: productFormData.certifications,
          standards: productFormData.standards,
          safety_info: productFormData.safetyInfo,
          mechanical: productFormData.mechanical,
          physical: productFormData.physical,
          chemical: productFormData.chemical,
          electrical: productFormData.electrical,
          fuel: productFormData.fuel,
          base_price: productFormData.basePrice,
          b2b_price: productFormData.b2bPrice,
          b2c_price: productFormData.b2cPrice,
          min_order_quantity: productFormData.minOrderQuantity,
          vat_included: productFormData.vatIncluded
        };

        const product = await createProduct(productData);
        console.log('Product created successfully:', product);

        setCurrentStep(2);
      } else if (currentStep === 2) {
        // Logistics setup step
        if (!createdStore?.id) {
          throw new Error('Store not found. Please go back and create store first.');
        }

        // Validate logistics data
        if (deliveryZones.length === 0) {
          throw new Error('Please add at least one delivery zone.');
        }

        if (!selectedShipmentType) {
          throw new Error('Please select a shipment method.');
        }

        // Create logistics configuration linked to the store using the actual API
        const logisticsData = {
          store_id: createdStore.id,
          company_id: createdStore.company_id,  // Add company_id
          shipment_type: selectedShipmentType,
          delivery_zones: deliveryZones,
          vehicles: selectedShipmentType === 'own-fleet' ? vehicles : [],
          drivers: selectedShipmentType === 'own-fleet' ? drivers : []
        };

        const logistics = await createLogistics(logisticsData);
        console.log('Logistics created successfully:', logistics);

        setCurrentStep(3);
      } else if (currentStep === 3) {
        // Approval submission step
        console.log('Submitting store for approval...');
        console.log('Complete store setup:', {
          store: createdStore,
          products: productFormData,
          logistics: {
            shipmentType: selectedShipmentType,
            deliveryZones,
            vehicles,
            drivers
          }
        });

        setCurrentStep(4);
      } else {
        // Final step - handle completion
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error in step submission:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setFormErrors(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderStoreSetup();
      case 1:
        return renderProductSetup();
      case 2:
        return renderShipmentSetup();
      case 3:
        return renderApprovalStep();
      case 4:
        return renderGoLiveStep();
      default:
        return renderStoreSetup();
    }
  };

  const renderStoreSetup = () => (
    <div className="space-y-6">
      {/* Store Category Selection */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <h2 className="text-lg font-semibold text-secondary-900 mb-4">Store Category</h2>
        <p className="text-secondary-600 mb-6">Choose the type of store you want to register:</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className={`cursor-pointer border-2 rounded-xl p-6 transition-all ${
            formData.storeCategory === 'physical' 
              ? 'border-primary-500 bg-primary-50' 
              : 'border-secondary-200 hover:border-secondary-300'
          }`}>
            <input
              type="radio"
              name="storeCategory"
              value="physical"
              checked={formData.storeCategory === 'physical'}
              onChange={handleInputChange}
              className="sr-only"
            />
            <div className="flex items-center space-x-4">
              <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                formData.storeCategory === 'physical' 
                  ? 'bg-primary-100' 
                  : 'bg-secondary-100'
              }`}>
                <StoreIcon className={`h-6 w-6 ${
                  formData.storeCategory === 'physical' 
                    ? 'text-primary-600' 
                    : 'text-secondary-500'
                }`} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-secondary-900 mb-1">Physical Store</h3>
                <p className="text-sm text-secondary-600">
                  For stores with physical locations requiring branch management, assets tracking, and on-site operations.
                </p>
              </div>
              <div className={`w-4 h-4 rounded-full border-2 ${
                formData.storeCategory === 'physical' 
                  ? 'border-primary-500 bg-primary-500' 
                  : 'border-secondary-300'
              }`}>
                {formData.storeCategory === 'physical' && (
                  <div className="w-full h-full rounded-full bg-primary-500 scale-50 transform"></div>
                )}
              </div>
            </div>
          </label>

          <label className={`cursor-pointer border-2 rounded-xl p-6 transition-all ${
            formData.storeCategory === 'cloud' 
              ? 'border-primary-500 bg-primary-50' 
              : 'border-secondary-200 hover:border-secondary-300'
          }`}>
            <input
              type="radio"
              name="storeCategory"
              value="cloud"
              checked={formData.storeCategory === 'cloud'}
              onChange={handleInputChange}
              className="sr-only"
            />
            <div className="flex items-center space-x-4">
              <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                formData.storeCategory === 'cloud' 
                  ? 'bg-primary-100' 
                  : 'bg-secondary-100'
              }`}>
                <Cloud className={`h-6 w-6 ${
                  formData.storeCategory === 'cloud' 
                    ? 'text-primary-600' 
                    : 'text-secondary-500'
                }`} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-secondary-900 mb-1">Cloud Store</h3>
                <p className="text-sm text-secondary-600">
                  For online-only stores focusing on product sales without physical branch requirements.
                </p>
              </div>
              <div className={`w-4 h-4 rounded-full border-2 ${
                formData.storeCategory === 'cloud' 
                  ? 'border-primary-500 bg-primary-500' 
                  : 'border-secondary-300'
              }`}>
                {formData.storeCategory === 'cloud' && (
                  <div className="w-full h-full rounded-full bg-primary-500 scale-50 transform"></div>
                )}
              </div>
            </div>
          </label>
        </div>

        {formData.storeCategory === 'physical' && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
              </div>
              <div>
                <p className="text-sm text-blue-700">
                  <strong>Physical Store Features:</strong> This will automatically create a main branch for your store. 
                  You can later manage branch details, employees, assets, and operations through the Branch Management system.
                </p>
              </div>
            </div>
          </div>
        )}

        {formData.storeCategory === 'cloud' && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <CheckSquare className="h-5 w-5 text-green-500 mt-0.5" />
              </div>
              <div>
                <p className="text-sm text-green-700">
                  <strong>Cloud Store Features:</strong> Perfect for online sales with streamlined product management, 
                  working hours, and invoicing without the complexity of physical branch operations.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

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
        <h2 className="text-lg font-semibold text-secondary-900 mb-2">
          {formData.storeCategory === 'physical' ? 'Branch Location Information' : 'Store Origin Information'}
        </h2>
        <p className="text-secondary-600 mb-6">
          {formData.storeCategory === 'physical' 
            ? 'Specify the physical location details for your main branch.'
            : 'Provide the origin location details for your cloud store operations.'
          }
        </p>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                {formData.storeCategory === 'physical' ? 'Branch Country' : 'Origin Country'}
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-400" />
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="input-field pl-10"
                  placeholder={formData.storeCategory === 'physical' ? 'Enter branch country' : 'Enter origin country'}
                  required
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                {formData.storeCategory === 'physical' ? 'Branch City' : 'Origin City'}
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-400" />
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="input-field pl-10"
                  placeholder={formData.storeCategory === 'physical' ? 'Enter branch city' : 'Enter origin city'}
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              {formData.storeCategory === 'physical' ? 'Branch Address' : 'Origin Address'}
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              className="input-field h-24"
              placeholder={formData.storeCategory === 'physical' ? 'Enter full branch address' : 'Enter origin address for your cloud store operations'}
              required
            />
          </div>
        </div>
      </div>

      {/* Services & Status */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <h2 className="text-lg font-semibold text-secondary-900 mb-2">Services & Status</h2>
        <p className="text-secondary-600 mb-6">
          {formData.storeCategory === 'physical' 
            ? 'Configure the services available at your physical location.'
            : 'Configure the digital services for your cloud store.'
          }
        </p>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-6">
            {formData.storeCategory === 'physical' && (
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.services.pickup}
                  onChange={() => handleServiceToggle('pickup')}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-secondary-700">Pickup Available</span>
              </label>
            )}
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
          
          {formData.storeCategory === 'cloud' && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                </div>
                <div>
                  <p className="text-sm text-blue-700">
                    <strong>Note:</strong> Pickup service is not available for cloud stores since there's no physical location. 
                    Focus on delivery and digital services for your customers.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Invoicing Method */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <h2 className="text-lg font-semibold text-secondary-900 mb-2">Invoicing Method</h2>
        <p className="text-secondary-600 mb-6">
          Choose how invoices will be generated and managed for your store.
        </p>
        
        <div className="space-y-3">
          <label className="flex items-start space-x-3 cursor-pointer p-4 border-2 rounded-lg transition-all hover:border-secondary-300">
            <input
              type="radio"
              name="invoicingMethod"
              value="merchant"
              checked={formData.invoicingMethod === 'merchant'}
              onChange={(e) => setFormData(prev => ({ ...prev, invoicingMethod: e.target.value as 'merchant' | 'gasable' }))}
              className="w-4 h-4 text-primary-600 focus:ring-primary-500 mt-1"
            />
            <div className="flex-1">
              <h3 className="font-medium text-secondary-900 mb-1">Merchant Generated</h3>
              <p className="text-sm text-secondary-600">
                You will generate and manage your own invoices using your existing systems.
              </p>
            </div>
          </label>
          
          <label className="flex items-start space-x-3 cursor-pointer p-4 border-2 rounded-lg transition-all hover:border-secondary-300">
            <input
              type="radio"
              name="invoicingMethod"
              value="gasable"
              checked={formData.invoicingMethod === 'gasable'}
              onChange={(e) => setFormData(prev => ({ ...prev, invoicingMethod: e.target.value as 'merchant' | 'gasable' }))}
              className="w-4 h-4 text-primary-600 focus:ring-primary-500 mt-1"
            />
            <div className="flex-1">
              <h3 className="font-medium text-secondary-900 mb-1">Gasable Generated</h3>
              <p className="text-sm text-secondary-600">
                Gasable will automatically generate and manage invoices for your orders.
              </p>
            </div>
          </label>
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
    </div>
  );

  const renderProductSetup = () => {
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const files = Array.from(e.target.files);
        setProductFormData(prev => ({
          ...prev,
          images: [...prev.images, ...files],
        }));
      }
    };

    const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const files = Array.from(e.target.files);
        setProductFormData(prev => ({
          ...prev,
          documents: [...prev.documents, ...files],
        }));
      }
    };

    const handleProductInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setProductFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    };

    const handleAddAttribute = (category: keyof ProductFormData) => {
      setProductFormData(prev => ({
        ...prev,
        [category]: [...(prev[category] as ProductAttribute[]), { name: '', value: '', unit: '' }],
      }));
    };

    const handleRemoveAttribute = (category: keyof ProductFormData, index: number) => {
      setProductFormData(prev => ({
        ...prev,
        [category]: (prev[category] as ProductAttribute[]).filter((_, i) => i !== index),
      }));
    };

    const handleAttributeChange = (
      category: keyof ProductFormData,
      index: number,
      field: keyof ProductAttribute,
      value: string
    ) => {
      setProductFormData(prev => {
        const attributes = [...(prev[category] as ProductAttribute[])];
        attributes[index] = { ...attributes[index], [field]: value };
        return { ...prev, [category]: attributes };
      });
    };

    // Validation functions for each step
    const validateGeneralInfo = (): string[] => {
      const errors: string[] = [];
      if (!productFormData.name.trim()) errors.push('Product name is required');
      if (!productFormData.brand.trim()) errors.push('Brand is required');
      if (!productFormData.type.trim()) errors.push('Product type is required');
      if (!productFormData.category.trim()) errors.push('Category is required');
      return errors;
    };

    const validatePricingInfo = (): string[] => {
      const errors: string[] = [];
      if (productFormData.basePrice <= 0) errors.push('Base price must be greater than 0');
      if (productFormData.b2bPrice <= 0) errors.push('B2B price must be greater than 0');
      if (productFormData.b2cPrice <= 0) errors.push('B2C price must be greater than 0');
      if (productFormData.minOrderQuantity <= 0) errors.push('Minimum order quantity must be greater than 0');
      return errors;
    };

    const handleProductStepContinue = () => {
      let errors: string[] = [];
      
      switch (currentProductStep) {
        case 0:
          errors = validateGeneralInfo();
          break;
        case 3:
          errors = validatePricingInfo();
          break;
        default:
          errors = []; // Advanced and Attributes steps are optional
      }

      setProductValidationErrors(errors);
      
      if (errors.length === 0) {
        if (currentProductStep < 3) {
          setCurrentProductStep(prev => prev + 1);
        }
      }
    };

    const handleProductStepBack = () => {
      if (currentProductStep > 0) {
        setCurrentProductStep(prev => prev - 1);
        setProductValidationErrors([]);
      }
    };

    const renderGeneralTab = () => (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              value={productFormData.name}
              onChange={handleProductInputChange}
              className="input-field"
              placeholder="Enter product name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Brand
            </label>
            <input
              type="text"
              name="brand"
              value={productFormData.brand}
              onChange={handleProductInputChange}
              className="input-field"
              placeholder="Enter brand"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Product Type
            </label>
            <select
              name="type"
              value={productFormData.type}
              onChange={handleProductInputChange}
              className="input-field"
              required
            >
              <option value="">Select type</option>
              <option value="gas_cylinder">Gas Cylinder</option>
              <option value="gas_tank">Gas Tank</option>
              <option value="safety_equipment">Safety Equipment</option>
              <option value="accessories">Accessories</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Model
            </label>
            <input
              type="text"
              name="model"
              value={productFormData.model}
              onChange={handleProductInputChange}
              className="input-field"
              placeholder="Enter model"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={productFormData.category}
              onChange={handleProductInputChange}
              className="input-field"
              required
            >
              <option value="">Select category</option>
              <option value="industrial">Industrial</option>
              <option value="domestic">Domestic</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={productFormData.description}
            onChange={handleProductInputChange}
            className="input-field h-24"
            placeholder="Enter product description"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            Product Images
          </label>
          <div className="border-2 border-dashed border-secondary-200 rounded-lg p-6 text-center">
            <Camera className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
            <div className="space-y-2">
              <p className="text-secondary-600">Upload product images</p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="images"
              />
              <label
                htmlFor="images"
                className="btn-secondary cursor-pointer inline-flex items-center space-x-2"
              >
                <Upload className="h-4 w-4" />
                <span>Choose Images</span>
              </label>
            </div>
            {productFormData.images.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-secondary-600">
                  {productFormData.images.length} image(s) uploaded
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );

    const renderAdvancedTab = () => (
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            Certifications
          </label>
          <textarea
            name="certifications"
            value={productFormData.certifications.join(', ')}
            onChange={(e) => setProductFormData(prev => ({ 
              ...prev, 
              certifications: e.target.value.split(', ').filter(Boolean) 
            }))}
            className="input-field h-20"
            placeholder="Enter certifications (comma separated)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            Standards
          </label>
          <textarea
            name="standards"
            value={productFormData.standards.join(', ')}
            onChange={(e) => setProductFormData(prev => ({ 
              ...prev, 
              standards: e.target.value.split(', ').filter(Boolean) 
            }))}
            className="input-field h-20"
            placeholder="Enter standards (comma separated)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            Safety Information
          </label>
          <textarea
            name="safetyInfo"
            value={productFormData.safetyInfo}
            onChange={handleProductInputChange}
            className="input-field h-24"
            placeholder="Enter safety information and warnings"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            Product Documents
          </label>
          <div className="border-2 border-dashed border-secondary-200 rounded-lg p-6 text-center">
            <FileText className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
            <div className="space-y-2">
              <p className="text-secondary-600">Upload product documents</p>
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx"
                onChange={handleDocumentUpload}
                className="hidden"
                id="documents"
              />
              <label
                htmlFor="documents"
                className="btn-secondary cursor-pointer inline-flex items-center space-x-2"
              >
                <Upload className="h-4 w-4" />
                <span>Choose Documents</span>
              </label>
            </div>
            {productFormData.documents.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-secondary-600">
                  {productFormData.documents.length} document(s) uploaded
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );

    const renderAttributesTab = () => {
      const attributeCategories = [
        { key: 'mechanical', label: 'Mechanical Properties', icon: Gauge },
        { key: 'physical', label: 'Physical Properties', icon: Scale },
        { key: 'chemical', label: 'Chemical Properties', icon: Droplets },
        { key: 'electrical', label: 'Electrical Properties', icon: Zap },
        { key: 'fuel', label: 'Fuel Properties', icon: Flame },
      ];

      return (
        <div className="space-y-6">
          {attributeCategories.map(({ key, label, icon: Icon }) => (
            <div key={key} className="bg-secondary-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Icon className="h-5 w-5 text-primary-600" />
                  <h3 className="font-medium text-secondary-900">{label}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => handleAddAttribute(key as keyof ProductFormData)}
                  className="btn-secondary-sm flex items-center space-x-1"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add</span>
                </button>
              </div>
              
              <div className="space-y-3">
                {(productFormData[key as keyof ProductFormData] as ProductAttribute[]).map((attr, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2">
                    <div className="col-span-4">
                      <input
                        type="text"
                        placeholder="Property name"
                        value={attr.name}
                        onChange={(e) => handleAttributeChange(key as keyof ProductFormData, index, 'name', e.target.value)}
                        className="input-field-sm"
                      />
                    </div>
                    <div className="col-span-4">
                      <input
                        type="text"
                        placeholder="Value"
                        value={attr.value}
                        onChange={(e) => handleAttributeChange(key as keyof ProductFormData, index, 'value', e.target.value)}
                        className="input-field-sm"
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        type="text"
                        placeholder="Unit"
                        value={attr.unit || ''}
                        onChange={(e) => handleAttributeChange(key as keyof ProductFormData, index, 'unit', e.target.value)}
                        className="input-field-sm"
                      />
                    </div>
                    <div className="col-span-1">
                      <button
                        type="button"
                        onClick={() => handleRemoveAttribute(key as keyof ProductFormData, index)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    };

    const renderPricingTab = () => (
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Base Price (SAR)
            </label>
            <input
              type="number"
              name="basePrice"
              value={productFormData.basePrice}
              onChange={handleProductInputChange}
              className="input-field"
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              B2B Price (SAR)
            </label>
            <input
              type="number"
              name="b2bPrice"
              value={productFormData.b2bPrice}
              onChange={handleProductInputChange}
              className="input-field"
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              B2C Price (SAR)
            </label>
            <input
              type="number"
              name="b2cPrice"
              value={productFormData.b2cPrice}
              onChange={handleProductInputChange}
              className="input-field"
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Minimum Order Quantity
            </label>
            <input
              type="number"
              name="minOrderQuantity"
              value={productFormData.minOrderQuantity}
              onChange={handleProductInputChange}
              className="input-field"
              placeholder="1"
              min="1"
              required
            />
          </div>
          <div className="flex items-center space-x-2 pt-6">
            <input
              type="checkbox"
              name="vatIncluded"
              checked={productFormData.vatIncluded}
              onChange={(e) => setProductFormData(prev => ({ ...prev, vatIncluded: e.target.checked }))}
              className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
            />
            <label className="text-secondary-700">VAT Included</label>
          </div>
        </div>
      </div>
    );

    return (
      <div className="space-y-6">
        {/* Product Tabs */}
        <div className="border-b border-secondary-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'general', label: 'General Info' },
              { id: 'advanced', label: 'Advanced' },
              { id: 'attributes', label: 'Attributes' },
              { id: 'pricing', label: 'Pricing' },
            ].map((tab, index) => (
              <button
                key={tab.id}
                onClick={() => setCurrentProductStep(index)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  currentProductStep === index
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Error Display */}
        {productValidationErrors.length > 0 && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-red-800 mb-1">Please fix the following errors:</h3>
                <ul className="text-sm text-red-600 space-y-1">
                  {productValidationErrors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
          {currentProductStep === 0 && renderGeneralTab()}
          {currentProductStep === 1 && renderAdvancedTab()}
          {currentProductStep === 2 && renderAttributesTab()}
          {currentProductStep === 3 && renderPricingTab()}
          
          {/* Step Navigation Buttons */}
          <div className="flex justify-between mt-6 pt-6 border-t border-secondary-100">
            <button
              type="button"
              onClick={handleProductStepBack}
              disabled={currentProductStep === 0}
              className="px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <button
              type="button"
              onClick={currentProductStep === 3 ? () => handleSubmit(new Event('submit') as any) : handleProductStepContinue}
              className="btn-primary px-6 flex items-center space-x-2"
            >
              <span>
                {currentProductStep === 0 ? 'Continue to Advanced' :
                 currentProductStep === 1 ? 'Continue to Attributes' :
                 currentProductStep === 2 ? 'Continue to Pricing' :
                 'Save Products & Continue'}
              </span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderShipmentSetup = () => {
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

    const renderDeliveryZones = () => (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-secondary-900">Delivery Zones</h3>
          <button
            type="button"
            onClick={handleAddDeliveryZone}
            className="btn-secondary flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Zone</span>
          </button>
        </div>

        {deliveryZones.length === 0 ? (
          <div className="text-center py-8 bg-secondary-50 rounded-lg">
            <MapPin className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
            <p className="text-secondary-600">No delivery zones configured</p>
            <p className="text-secondary-500 text-sm">Add your first delivery zone to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {deliveryZones.map((zone, index) => (
              <div key={zone.id} className="bg-white border border-secondary-200 rounded-lg p-4">
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Zone Name
                    </label>
                    <input
                      type="text"
                      value={zone.name}
                      onChange={(e) => {
                        const newZones = [...deliveryZones];
                        newZones[index] = { ...zone, name: e.target.value };
                        setDeliveryZones(newZones);
                      }}
                      className="input-field"
                      placeholder="e.g., Local Area"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Base Fee (SAR)
                    </label>
                    <input
                      type="number"
                      value={zone.baseFee}
                      onChange={(e) => {
                        const newZones = [...deliveryZones];
                        newZones[index] = { ...zone, baseFee: Number(e.target.value) };
                        setDeliveryZones(newZones);
                      }}
                      className="input-field"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Min Order Value (SAR)
                    </label>
                    <input
                      type="number"
                      value={zone.minOrderValue}
                      onChange={(e) => {
                        const newZones = [...deliveryZones];
                        newZones[index] = { ...zone, minOrderValue: Number(e.target.value) };
                        setDeliveryZones(newZones);
                      }}
                      className="input-field"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Estimated Time
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={zone.estimatedTime}
                        onChange={(e) => {
                          const newZones = [...deliveryZones];
                          newZones[index] = { ...zone, estimatedTime: e.target.value };
                          setDeliveryZones(newZones);
                        }}
                        className="input-field"
                        placeholder="1-2 days"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newZones = deliveryZones.filter((_, i) => i !== index);
                          setDeliveryZones(newZones);
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );

    const renderShipmentTypeSelection = () => (
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-secondary-900">Shipment Method</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            type="button"
            onClick={() => setSelectedShipmentType('third-party')}
            className={`p-6 rounded-xl border-2 transition-all text-left ${
              selectedShipmentType === 'third-party'
                ? 'border-primary-500 bg-primary-50'
                : 'border-secondary-200 hover:border-primary-200'
            }`}
          >
            <Building2 className="h-8 w-8 text-primary-600 mb-4" />
            <h4 className="text-lg font-semibold mb-2">Third-Party Fleet</h4>
            <p className="text-sm text-secondary-600">
              Partner with registered shipping companies for your deliveries
            </p>
          </button>

          <button
            type="button"
            onClick={() => setSelectedShipmentType('logistics')}
            className={`p-6 rounded-xl border-2 transition-all text-left ${
              selectedShipmentType === 'logistics'
                ? 'border-primary-500 bg-primary-50'
                : 'border-secondary-200 hover:border-primary-200'
            }`}
          >
            <Package className="h-8 w-8 text-primary-600 mb-4" />
            <h4 className="text-lg font-semibold mb-2">Logistics Company</h4>
            <p className="text-sm text-secondary-600">
              Use established logistics providers with global networks
            </p>
          </button>

          <button
            type="button"
            onClick={() => setSelectedShipmentType('own-fleet')}
            className={`p-6 rounded-xl border-2 transition-all text-left ${
              selectedShipmentType === 'own-fleet'
                ? 'border-primary-500 bg-primary-50'
                : 'border-secondary-200 hover:border-primary-200'
            }`}
          >
            <Truck className="h-8 w-8 text-primary-600 mb-4" />
            <h4 className="text-lg font-semibold mb-2">Own Fleet</h4>
            <p className="text-sm text-secondary-600">
              Manage your own vehicles and drivers for direct control
            </p>
          </button>
        </div>

        {selectedShipmentType === 'own-fleet' && (
          <div className="mt-6 space-y-6">
            {/* Vehicles Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-secondary-900">Vehicles</h4>
                <button
                  type="button"
                  onClick={handleAddVehicle}
                  className="btn-secondary-sm flex items-center space-x-1"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Vehicle</span>
                </button>
              </div>
              
              {vehicles.length === 0 ? (
                <div className="text-center py-4 bg-secondary-50 rounded-lg">
                  <Truck className="h-8 w-8 text-secondary-400 mx-auto mb-2" />
                  <p className="text-secondary-600 text-sm">No vehicles added</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {vehicles.map((vehicle, index) => (
                    <div key={vehicle.id} className="grid grid-cols-5 gap-3 p-3 bg-secondary-50 rounded-lg">
                      <input
                        type="text"
                        placeholder="Vehicle Number"
                        value={vehicle.number}
                        onChange={(e) => {
                          const newVehicles = [...vehicles];
                          newVehicles[index] = { ...vehicle, number: e.target.value };
                          setVehicles(newVehicles);
                        }}
                        className="input-field-sm"
                      />
                      <select
                        value={vehicle.type}
                        onChange={(e) => {
                          const newVehicles = [...vehicles];
                          newVehicles[index] = { ...vehicle, type: e.target.value as 'truck' | 'van' | 'bike' };
                          setVehicles(newVehicles);
                        }}
                        className="input-field-sm"
                      >
                        <option value="truck">Truck</option>
                        <option value="van">Van</option>
                        <option value="bike">Bike</option>
                      </select>
                      <input
                        type="number"
                        placeholder="Capacity (kg)"
                        value={vehicle.capacity}
                        onChange={(e) => {
                          const newVehicles = [...vehicles];
                          newVehicles[index] = { ...vehicle, capacity: Number(e.target.value) };
                          setVehicles(newVehicles);
                        }}
                        className="input-field-sm"
                        min="0"
                      />
                      <input
                        type="text"
                        placeholder="Fuel Type"
                        value={vehicle.fuelType}
                        onChange={(e) => {
                          const newVehicles = [...vehicles];
                          newVehicles[index] = { ...vehicle, fuelType: e.target.value };
                          setVehicles(newVehicles);
                        }}
                        className="input-field-sm"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newVehicles = vehicles.filter((_, i) => i !== index);
                          setVehicles(newVehicles);
                        }}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Drivers Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-secondary-900">Drivers</h4>
                <button
                  type="button"
                  onClick={handleAddDriver}
                  className="btn-secondary-sm flex items-center space-x-1"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Driver</span>
                </button>
              </div>
              
              {drivers.length === 0 ? (
                <div className="text-center py-4 bg-secondary-50 rounded-lg">
                  <User className="h-8 w-8 text-secondary-400 mx-auto mb-2" />
                  <p className="text-secondary-600 text-sm">No drivers added</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {drivers.map((driver, index) => (
                    <div key={driver.id} className="grid grid-cols-5 gap-3 p-3 bg-secondary-50 rounded-lg">
                      <input
                        type="text"
                        placeholder="Driver Name"
                        value={driver.name}
                        onChange={(e) => {
                          const newDrivers = [...drivers];
                          newDrivers[index] = { ...driver, name: e.target.value };
                          setDrivers(newDrivers);
                        }}
                        className="input-field-sm"
                      />
                      <input
                        type="text"
                        placeholder="License Number"
                        value={driver.licenseNumber}
                        onChange={(e) => {
                          const newDrivers = [...drivers];
                          newDrivers[index] = { ...driver, licenseNumber: e.target.value };
                          setDrivers(newDrivers);
                        }}
                        className="input-field-sm"
                      />
                      <input
                        type="tel"
                        placeholder="Phone"
                        value={driver.phone}
                        onChange={(e) => {
                          const newDrivers = [...drivers];
                          newDrivers[index] = { ...driver, phone: e.target.value };
                          setDrivers(newDrivers);
                        }}
                        className="input-field-sm"
                      />
                      <select
                        value={driver.status}
                        onChange={(e) => {
                          const newDrivers = [...drivers];
                          newDrivers[index] = { ...driver, status: e.target.value as 'available' | 'busy' | 'offline' };
                          setDrivers(newDrivers);
                        }}
                        className="input-field-sm"
                      >
                        <option value="available">Available</option>
                        <option value="busy">Busy</option>
                        <option value="offline">Offline</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => {
                          const newDrivers = drivers.filter((_, i) => i !== index);
                          setDrivers(newDrivers);
                        }}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );

    return (
      <div className="space-y-6">
        {/* Logistics Tabs */}
        <div className="border-b border-secondary-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'delivery-zones', label: 'Delivery Zones' },
              { id: 'shipment-type', label: 'Shipment Method' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveLogisticsTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeLogisticsTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
          {activeLogisticsTab === 'delivery-zones' && renderDeliveryZones()}
          {activeLogisticsTab === 'shipment-type' && renderShipmentTypeSelection()}
        </div>
      </div>
    );
  };

  const renderApprovalStep = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <h2 className="text-lg font-semibold text-secondary-900 mb-2">Submit for Approval</h2>
        <p className="text-secondary-600 mb-6">
          Review your setup and submit to Gasable for verification. This usually takes 1-2 business days.
        </p>
        
        <div className="space-y-4">
          {/* Setup Summary */}
          <div className="bg-secondary-50 p-4 rounded-lg">
            <h3 className="font-medium text-secondary-900 mb-3">Setup Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-secondary-600">Store Name:</p>
                <p className="font-medium">{formData.storeName || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-secondary-600">Store Type:</p>
                <p className="font-medium">{formData.storeCategory === 'physical' ? 'Physical Store' : 'Cloud Store'}</p>
              </div>
              <div>
                <p className="text-secondary-600">Location:</p>
                <p className="font-medium">{formData.city}, {formData.country}</p>
              </div>
              <div>
                <p className="text-secondary-600">Services:</p>
                <p className="font-medium">
                  {formData.services.delivery ? 'Delivery' : ''} 
                  {formData.services.pickup && formData.services.delivery ? ', ' : ''}
                  {formData.services.pickup ? 'Pickup' : ''}
                </p>
              </div>
            </div>
          </div>
          
          {/* Verification Checklist */}
          <div>
            <h3 className="font-medium text-secondary-900 mb-3">Verification Requirements</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm">Store information completed</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm">Product information provided</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm">Delivery setup configured</span>
              </div>
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <span className="text-sm">Gasable team verification (pending)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGoLiveStep = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100 text-center">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-secondary-900 mb-2">🎉 Congratulations!</h2>
        <p className="text-secondary-600 mb-6">
          Your store setup is complete and has been submitted for approval.
        </p>
        
        <div className="bg-blue-50 p-6 rounded-lg mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Gasable team will review your store within 1-2 business days</li>
            <li>• You'll receive email notifications about the approval status</li>
            <li>• Once approved, your store will be live on the marketplace</li>
            {formData.storeCategory === 'physical' && <li>• Your main branch has been automatically created</li>}
          </ul>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-primary px-6 py-3"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => navigate('/dashboard/setup/products')}
            className="px-6 py-3 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors"
          >
            Manage Products
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Setup Progress */}
      <SetupProgress currentStep={currentStep} />

      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900 mb-2">🏬 {steps[currentStep].title}</h1>
            <p className="text-secondary-600">
              {steps[currentStep].description}
            </p>
          </div>
          {currentStep === 0 && (
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.useCompanyProfile}
                onChange={handleUseCompanyProfile}
                className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
              />
              <span className="text-secondary-700">Use Company Profile</span>
            </label>
          )}
        </div>
        {currentStep === 0 && !hasCompanyProfile && (
          <div className="flex items-center space-x-2 text-yellow-600 bg-yellow-50 p-3 rounded-lg">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm">Complete your company profile to use this feature</span>
          </div>
        )}
      </div>

      {/* Step Content */}
      <form onSubmit={handleSubmit}>
        {renderStepContent()}
        
        {/* Form Actions */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={currentStep === 0 ? () => navigate('/setup') : handleBackStep}
            className="px-6 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors"
            disabled={submitting}
          >
            {currentStep === 0 ? 'Back to Setup' : 'Previous Step'}
          </button>
          <div className="space-x-3">
            {currentStep < steps.length - 1 && (
              <>
                <button
                  type="button"
                  className="px-6 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors"
                  disabled={submitting}
                >
                  Save Draft
                </button>
                <button
                  type="submit"
                  className="btn-primary px-6 flex items-center space-x-2"
                  disabled={submitting}
                >
                  {submitting && currentStep === 0 ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Creating Store...</span>
                    </>
                  ) : (
                    <span>
                      {currentStep === 0 ? 'Create Store & Continue' :
                       currentStep === 1 ? 'Save Products & Continue' :
                       currentStep === 2 ? 'Save Logistics & Continue' :
                       currentStep === 3 ? 'Submit for Approval' :
                       'Complete Setup'}
                    </span>
                  )}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Error Display */}
        {formErrors && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span className="text-red-700">{formErrors}</span>
            </div>
          </div>
        )}
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