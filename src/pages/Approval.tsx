import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle,
  XCircle,
  Clock,
  Package,
  DollarSign,
  Star,
  Tag,
  Truck,
  User,
  Building2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ArrowRight,
  Eye,
  MessageSquare,
  Download,
  Share2,
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  status: 'approved' | 'rejected' | 'pending';
  submittedDate: string;
  reviewDate?: string;
  type: string;
  price: number;
  rating?: number;
  image: string;
  store: {
    name: string;
    location: string;
  };
  details: {
    description: string;
    specifications: Record<string, string>;
    certifications: string[];
  };
  shipping: {
    method: string;
    zones: string[];
    estimatedTime: string;
  };
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Industrial Gas Tank',
    status: 'pending',
    submittedDate: '2024-03-19',
    type: 'Gas',
    price: 499.99,
    image: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=800',
    store: {
      name: 'Acme Gas Supplies',
      location: 'Riyadh',
    },
    details: {
      description: 'High-capacity industrial gas tank for commercial use',
      specifications: {
        'Capacity': '500L',
        'Material': 'Stainless Steel',
        'Pressure Rating': '200 bar',
        'Safety Features': 'Pressure relief valve, Temperature sensor',
      },
      certifications: ['ISO 9001:2015', 'ASME certification', 'CE Mark'],
    },
    shipping: {
      method: 'Own Fleet',
      zones: ['Riyadh Region', 'Makkah Region', 'Eastern Province'],
      estimatedTime: '2-3 business days',
    },
  },
  {
    id: '2',
    name: 'Premium Gas Cylinder',
    status: 'approved',
    submittedDate: '2024-03-18',
    reviewDate: '2024-03-19',
    type: 'Gas',
    price: 99.99,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1597773150796-e5c14ebecbf5?w=800',
    store: {
      name: 'SafeGas Solutions',
      location: 'Jeddah',
    },
    details: {
      description: 'Premium residential gas cylinder with enhanced safety features',
      specifications: {
        'Capacity': '50L',
        'Material': 'Aluminum',
        'Pressure Rating': '150 bar',
        'Safety Features': 'Auto-shutoff valve',
      },
      certifications: ['ISO 9001:2015', 'Safety Standard Certification'],
    },
    shipping: {
      method: 'Third-party Logistics',
      zones: ['Jeddah City', 'Makkah City'],
      estimatedTime: '1-2 business days',
    },
  },
  {
    id: '3',
    name: 'Commercial Gas Setup',
    status: 'rejected',
    submittedDate: '2024-03-17',
    reviewDate: '2024-03-18',
    type: 'Equipment',
    price: 1299.99,
    image: 'https://images.unsplash.com/photo-1581092335397-9583eb92d232?w=800',
    store: {
      name: 'Pro Gas Equipment',
      location: 'Dammam',
    },
    details: {
      description: 'Complete commercial gas installation setup',
      specifications: {
        'Components': 'Tank, Regulator, Pipes',
        'Installation': 'Professional installation included',
        'Warranty': '2 years',
      },
      certifications: ['ISO 9001:2015'],
    },
    shipping: {
      method: 'Specialized Transport',
      zones: ['Eastern Province'],
      estimatedTime: '3-5 business days',
    },
  },
];

const Approval = () => {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const stats = {
    total: mockProducts.length,
    approved: mockProducts.filter(p => p.status === 'approved').length,
    pending: mockProducts.filter(p => p.status === 'pending').length,
    rejected: mockProducts.filter(p => p.status === 'rejected').length,
  };

  const getStatusColor = (status: Product['status']) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-50';
      case 'rejected':
        return 'text-red-600 bg-red-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: Product['status']) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5" />;
      case 'rejected':
        return <XCircle className="h-5 w-5" />;
      case 'pending':
        return <Clock className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900 mb-2">
              ✅ Product Approval
            </h1>
            <p className="text-secondary-600">
              Review your product listings and approval status
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors flex items-center space-x-2">
              <Download className="h-5 w-5" />
              <span>Export List</span>
            </button>
            <button
              onClick={() => navigate('/setup/go-live')}
              className="btn-primary flex items-center space-x-2"
            >
              <ArrowRight className="h-5 w-5" />
              <span>Go Live</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6">
          <div className="p-4 bg-white rounded-lg border border-secondary-100">
            <div className="flex items-center justify-between mb-2">
              <Package className="h-6 w-6 text-secondary-600" />
              <span className="text-2xl font-bold text-secondary-900">{stats.total}</span>
            </div>
            <p className="text-secondary-600">Total Products</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-100">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <span className="text-2xl font-bold text-green-600">{stats.approved}</span>
            </div>
            <p className="text-green-600">Approved</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
            <div className="flex items-center justify-between mb-2">
              <Clock className="h-6 w-6 text-yellow-600" />
              <span className="text-2xl font-bold text-yellow-600">{stats.pending}</span>
            </div>
            <p className="text-yellow-600">Pending Review</p>
          </div>
          <div className="p-4 bg-red-50 rounded-lg border border-red-100">
            <div className="flex items-center justify-between mb-2">
              <XCircle className="h-6 w-6 text-red-600" />
              <span className="text-2xl font-bold text-red-600">{stats.rejected}</span>
            </div>
            <p className="text-red-600">Rejected</p>
          </div>
        </div>
      </div>

      {/* Product Preview */}
      {selectedProduct && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Product Preview</h2>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-secondary-100 rounded-lg text-secondary-600">
                <Share2 className="h-5 w-5" />
              </button>
              <button className="p-2 hover:bg-secondary-100 rounded-lg text-secondary-600">
                <Eye className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Product Details */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <img
                src={mockProducts.find(p => p.id === selectedProduct)?.image}
                alt={mockProducts.find(p => p.id === selectedProduct)?.name}
                className="w-full aspect-square object-cover rounded-lg"
              />
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-secondary-900">
                  {mockProducts.find(p => p.id === selectedProduct)?.name}
                </h3>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-2xl font-bold text-primary-600">
                    ${mockProducts.find(p => p.id === selectedProduct)?.price.toFixed(2)}
                  </span>
                  {mockProducts.find(p => p.id === selectedProduct)?.rating && (
                    <div className="flex items-center text-yellow-400">
                      <Star className="h-5 w-5 fill-current" />
                      <span className="ml-1 text-secondary-900">
                        {mockProducts.find(p => p.id === selectedProduct)?.rating}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-secondary-900">Description</h4>
                  <p className="text-secondary-600 mt-1">
                    {mockProducts.find(p => p.id === selectedProduct)?.details.description}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-secondary-900">Specifications</h4>
                  <div className="mt-2 space-y-2">
                    {Object.entries(mockProducts.find(p => p.id === selectedProduct)?.details.specifications || {}).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-secondary-600">{key}</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-secondary-900">Certifications</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {mockProducts.find(p => p.id === selectedProduct)?.details.certifications.map((cert) => (
                      <span key={cert} className="px-3 py-1 bg-secondary-50 text-secondary-700 rounded-full text-sm">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-secondary-900">Shipping Information</h4>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-secondary-600">Method</span>
                      <span className="font-medium">{mockProducts.find(p => p.id === selectedProduct)?.shipping.method}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-600">Estimated Time</span>
                      <span className="font-medium">{mockProducts.find(p => p.id === selectedProduct)?.shipping.estimatedTime}</span>
                    </div>
                    <div>
                      <span className="text-secondary-600">Delivery Zones</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {mockProducts.find(p => p.id === selectedProduct)?.shipping.zones.map((zone) => (
                          <span key={zone} className="px-3 py-1 bg-secondary-50 text-secondary-700 rounded-full text-sm">
                            {zone}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-secondary-100">
        <div className="p-6 border-b border-secondary-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Product Submissions</h2>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-secondary-50">
                <th className="py-4 px-6 text-left font-medium text-secondary-600">Product</th>
                <th className="py-4 px-6 text-left font-medium text-secondary-600">Store</th>
                <th className="py-4 px-6 text-left font-medium text-secondary-600">Type</th>
                <th className="py-4 px-6 text-left font-medium text-secondary-600">Price</th>
                <th className="py-4 px-6 text-left font-medium text-secondary-600">Submitted</th>
                <th className="py-4 px-6 text-left font-medium text-secondary-600">Status</th>
                <th className="py-4 px-6 text-left font-medium text-secondary-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockProducts
                .filter(product => filterStatus === 'all' || product.status === filterStatus)
                .map((product) => (
                <tr key={product.id} className="border-b border-secondary-100">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <span className="font-medium">{product.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-medium">{product.store.name}</div>
                      <div className="text-sm text-secondary-600">
                        <MapPin className="h-4 w-4 inline mr-1" />
                        {product.store.location}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 bg-secondary-50 text-secondary-700 rounded-full">
                      {product.type}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-medium">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <div>{product.submittedDate}</div>
                      {product.reviewDate && (
                        <div className="text-sm text-secondary-600">
                          Reviewed: {product.reviewDate}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${getStatusColor(product.status)}`}>
                      {getStatusIcon(product.status)}
                      <span className="capitalize">{product.status}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedProduct(selectedProduct === product.id ? null : product.id)}
                        className="p-2 hover:bg-secondary-100 rounded-lg text-secondary-600"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button className="p-2 hover:bg-secondary-100 rounded-lg text-secondary-600">
                        <MessageSquare className="h-5 w-5" />
                      </button>
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
            Showing 1 to {mockProducts.length} of {mockProducts.length} entries
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
    </div>
  );
};

export default Approval;