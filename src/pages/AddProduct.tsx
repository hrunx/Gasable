import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  Camera,
  FileText,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle,
  Package,
  Gauge,
  Droplets,
  Zap,
  Flame,
  Scale,
} from 'lucide-react';
import ProductSetupProgress from '../components/ProductSetupProgress';

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

const initialFormData: ProductFormData = {
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
};

const AddProduct = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [subProgress, setSubProgress] = useState({
    general: false,
    advanced: false,
    attributes: false,
    pricing: false,
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...files],
      }));
      updateSubProgress('general');
    }
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, ...files],
      }));
      updateSubProgress('advanced');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    updateSubProgress(activeTab);
  };

  const updateSubProgress = (tab: string) => {
    setSubProgress(prev => ({
      ...prev,
      [tab]: true,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all sections are complete
    const isGeneralComplete = formData.name && formData.brand && formData.type;
    const isAdvancedComplete = formData.certifications.length > 0 || formData.documents.length > 0;
    const isAttributesComplete = 
      formData.mechanical.length > 0 ||
      formData.physical.length > 0 ||
      formData.chemical.length > 0 ||
      formData.electrical.length > 0 ||
      formData.fuel.length > 0;
    const isPricingComplete = formData.basePrice > 0 && formData.b2bPrice > 0 && formData.b2cPrice > 0;

    if (isGeneralComplete && isAdvancedComplete && isAttributesComplete && isPricingComplete) {
      // Save product data and navigate
      navigate('/setup/shipment');
    } else {
      alert('Please complete all sections before proceeding.');
    }
  };

  const handleNext = () => {
    const tabs = ['general', 'advanced', 'attributes', 'pricing'];
    const currentIndex = tabs.indexOf(activeTab);
    
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    } else {
      handleSubmit(new Event('submit') as any);
    }
  };

  const handleBack = () => {
    const tabs = ['general', 'advanced', 'attributes', 'pricing'];
    const currentIndex = tabs.indexOf(activeTab);
    
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    } else {
      navigate('/setup/add-store');
    }
  };

  const handleAddAttribute = (category: keyof ProductFormData) => {
    setFormData(prev => ({
      ...prev,
      [category]: [...(prev[category] as ProductAttribute[]), { name: '', value: '', unit: '' }],
    }));
    updateSubProgress('attributes');
  };

  const handleRemoveAttribute = (category: keyof ProductFormData, index: number) => {
    setFormData(prev => ({
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
    setFormData(prev => {
      const attributes = [...(prev[category] as ProductAttribute[])];
      attributes[index] = { ...attributes[index], [field]: value };
      return { ...prev, [category]: attributes };
    });
    updateSubProgress('attributes');
  };

  const renderGeneralTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            Product Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="input-field"
            placeholder="Enter product name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            Brand *
          </label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleInputChange}
            className="input-field"
            placeholder="Enter brand name"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            Product Type *
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className="input-field"
            required
          >
            <option value="">Select product type</option>
            <option value="gas">Gas</option>
            <option value="fuel">Fuel</option>
            <option value="equipment">Equipment</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            Model Number
          </label>
          <input
            type="text"
            name="model"
            value={formData.model}
            onChange={handleInputChange}
            className="input-field"
            placeholder="Enter model number"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-1">
          Description *
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className="input-field h-32"
          placeholder="Enter product description"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-4">
          Product Images *
        </label>
        <div className="grid grid-cols-4 gap-4">
          {formData.images.map((image, index) => (
            <div key={index} className="relative aspect-square bg-secondary-50 rounded-lg overflow-hidden">
              <img
                src={URL.createObjectURL(image)}
                alt={`Product ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    images: prev.images.filter((_, i) => i !== index),
                  }));
                }}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <label className="aspect-square bg-secondary-50 rounded-lg border-2 border-dashed border-secondary-200 flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 transition-colors">
            <Camera className="h-8 w-8 text-secondary-400" />
            <span className="mt-2 text-sm text-secondary-600">Add Image</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
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
        <div className="space-y-2">
          {formData.certifications.map((cert, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={cert}
                onChange={(e) => {
                  const newCerts = [...formData.certifications];
                  newCerts[index] = e.target.value;
                  setFormData(prev => ({ ...prev, certifications: newCerts }));
                  updateSubProgress('advanced');
                }}
                className="input-field"
                placeholder="Enter certification"
              />
              <button
                type="button"
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    certifications: prev.certifications.filter((_, i) => i !== index),
                  }));
                }}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              setFormData(prev => ({
                ...prev,
                certifications: [...prev.certifications, ''],
              }));
            }}
            className="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
          >
            <Plus className="h-5 w-5" />
            <span>Add Certification</span>
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-1">
          Safety Information
        </label>
        <textarea
          name="safetyInfo"
          value={formData.safetyInfo}
          onChange={handleInputChange}
          className="input-field h-32"
          placeholder="Enter safety information"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-4">
          Documents
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
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    documents: prev.documents.filter((_, i) => i !== index),
                  }));
                }}
                className="text-red-500 hover:text-red-600"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
          <label className="block w-full p-4 bg-secondary-50 rounded-lg border-2 border-dashed border-secondary-200 cursor-pointer hover:border-primary-500 transition-colors">
            <div className="flex flex-col items-center">
              <Upload className="h-8 w-8 text-secondary-400" />
              <span className="mt-2 text-sm text-secondary-600">
                Upload documents (MSDS, Certificates, etc.)
              </span>
            </div>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              multiple
              onChange={handleDocumentUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );

  const renderAttributesTab = () => (
    <div className="space-y-8">
      {[
        {
          title: 'Mechanical Attributes',
          icon: <Gauge className="h-5 w-5" />,
          category: 'mechanical' as keyof ProductFormData,
        },
        {
          title: 'Physical Attributes',
          icon: <Scale className="h-5 w-5" />,
          category: 'physical' as keyof ProductFormData,
        },
        {
          title: 'Chemical Attributes',
          icon: <Droplets className="h-5 w-5" />,
          category: 'chemical' as keyof ProductFormData,
        },
        {
          title: 'Electrical Attributes',
          icon: <Zap className="h-5 w-5" />,
          category: 'electrical' as keyof ProductFormData,
        },
        {
          title: 'Fuel & Oil Attributes',
          icon: <Flame className="h-5 w-5" />,
          category: 'fuel' as keyof ProductFormData,
        },
      ].map(({ title, icon, category }) => (
        <div key={category}>
          <div className="flex items-center space-x-2 mb-4">
            {icon}
            <h3 className="text-lg font-semibold text-secondary-900">{title}</h3>
          </div>
          <div className="space-y-2">
            {(formData[category] as ProductAttribute[]).map((attr, index) => (
              <div key={index} className="grid grid-cols-3 gap-4">
                <input
                  type="text"
                  value={attr.name}
                  onChange={(e) => handleAttributeChange(category, index, 'name', e.target.value)}
                  className="input-field"
                  placeholder="Attribute name"
                />
                <input
                  type="text"
                  value={attr.value}
                  onChange={(e) => handleAttributeChange(category, index, 'value', e.target.value)}
                  className="input-field"
                  placeholder="Value"
                />
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={attr.unit}
                    onChange={(e) => handleAttributeChange(category, index, 'unit', e.target.value)}
                    className="input-field"
                    placeholder="Unit"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveAttribute(category, index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddAttribute(category)}
              className="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
            >
              <Plus className="h-5 w-5" />
              <span>Add Attribute</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderPricingTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            Base Price *
          </label>
          <div className="relative">
            <input
              type="number"
              name="basePrice"
              value={formData.basePrice}
              onChange={handleInputChange}
              className="input-field pl-8"
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400">$</span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            Minimum Order Quantity *
          </label>
          <input
            type="number"
            name="minOrderQuantity"
            value={formData.minOrderQuantity}
            onChange={handleInputChange}
            className="input-field"
            placeholder="1"
            min="1"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            B2B Price *
          </label>
          <div className="relative">
            <input
              type="number"
              name="b2bPrice"
              value={formData.b2bPrice}
              onChange={handleInputChange}
              className="input-field pl-8"
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400">$</span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            B2C Price *
          </label>
          <div className="relative">
            <input
              type="number"
              name="b2cPrice"
              value={formData.b2cPrice}
              onChange={handleInputChange}
              className="input-field pl-8"
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400">$</span>
          </div>
        </div>
      </div>

      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={formData.vatIncluded}
          onChange={(e) => {
            setFormData(prev => ({ ...prev, vatIncluded: e.target.checked }));
            updateSubProgress('pricing');
          }}
          className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
        />
        <span className="text-secondary-700">Prices include VAT</span>
      </label>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Setup Progress */}
      <ProductSetupProgress currentStep={1} currentSubStep={activeTab} />

      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <h1 className="text-2xl font-bold text-secondary-900 mb-2">📦 Add Product</h1>
        <p className="text-secondary-600">
          Add your product details and specifications to make it available on the marketplace.
        </p>
      </div>

      {/* Sub Progress */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <div className="flex space-x-8">
          {[
            { id: 'general', label: 'General', icon: <Package className="h-5 w-5" /> },
            { id: 'advanced', label: 'Advanced', icon: <FileText className="h-5 w-5" /> },
            { id: 'attributes', label: 'Attributes', icon: <Scale className="h-5 w-5" /> },
            { id: 'pricing', label: 'Pricing', icon: <AlertCircle className="h-5 w-5" /> },
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
              {subProgress[id as keyof typeof subProgress] && (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
          {activeTab === 'general' && renderGeneralTab()}
          {activeTab === 'advanced' && renderAdvancedTab()}
          {activeTab === 'attributes' && renderAttributesTab()}
          {activeTab === 'pricing' && renderPricingTab()}
        </div>

        {/* Form Actions */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleBack}
            className="px-6 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors"
          >
            Back
          </button>
          <div className="space-x-3">
            <button
              type="button"
              className="px-6 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors"
              onClick={() => {
                // Save current progress
                console.log('Saving draft...', formData);
              }}
            >
              Save Draft
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="btn-primary px-6"
            >
              {activeTab === 'pricing' ? 'Next: Shipment Setup' : 'Next'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;