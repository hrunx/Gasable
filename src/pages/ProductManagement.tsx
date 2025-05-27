import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  Search,
  Filter,
  Plus,
  Upload,
  Download,
  Edit,
  Trash2,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  Clock,
  Tag,
  ArrowUpDown,
  Eye,
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  type: string;
  category: string;
  price: number;
  stock: number;
  status: 'active' | 'draft' | 'archived';
  lastUpdated: string;
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Gas Cylinder',
    type: 'Gas',
    category: 'Residential',
    price: 99.99,
    stock: 150,
    status: 'active',
    lastUpdated: '2024-03-15',
  },
  {
    id: '2',
    name: 'Industrial Fuel Tank',
    type: 'Fuel',
    category: 'Industrial',
    price: 499.99,
    stock: 50,
    status: 'active',
    lastUpdated: '2024-03-14',
  },
  {
    id: '3',
    name: 'Commercial Gas Setup',
    type: 'Gas',
    category: 'Commercial',
    price: 299.99,
    stock: 75,
    status: 'draft',
    lastUpdated: '2024-03-13',
  },
];

const ProductManagement = () => {
  const navigate = useNavigate();
  const [products] = useState<Product[]>(mockProducts);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof Product>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: keyof Product) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedProducts(products.map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const getStatusColor = (status: Product['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-50 text-green-700';
      case 'draft':
        return 'bg-yellow-50 text-yellow-700';
      case 'archived':
        return 'bg-gray-50 text-gray-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900 mb-2">
              📦 Product Management
            </h1>
            <p className="text-secondary-600">
              Manage your product catalog, pricing, and inventory all in one place.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => navigate('/setup/add-product')}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add Product</span>
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

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mt-6">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <Package className="h-6 w-6 text-blue-600" />
              <span className="text-2xl font-bold text-blue-700">156</span>
            </div>
            <p className="text-sm text-blue-600">Total Products</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-100">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <span className="text-2xl font-bold text-green-700">124</span>
            </div>
            <p className="text-sm text-green-600">Active Products</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
            <div className="flex items-center justify-between mb-2">
              <Clock className="h-6 w-6 text-yellow-600" />
              <span className="text-2xl font-bold text-yellow-700">18</span>
            </div>
            <p className="text-sm text-yellow-600">Draft Products</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
            <div className="flex items-center justify-between mb-2">
              <Tag className="h-6 w-6 text-purple-600" />
              <span className="text-2xl font-bold text-purple-700">14</span>
            </div>
            <p className="text-sm text-purple-600">Categories</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <button className="p-2 hover:bg-secondary-100 rounded-lg text-secondary-600">
            <Filter className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-secondary-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-secondary-50 border-b border-secondary-100">
              <th className="py-4 px-6 text-left">
                <input
                  type="checkbox"
                  checked={selectedProducts.length === products.length}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
              </th>
              <th
                className="py-4 px-6 text-left cursor-pointer"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center space-x-2">
                  <span>Product</span>
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </th>
              <th className="py-4 px-6 text-left">Type</th>
              <th className="py-4 px-6 text-left">Category</th>
              <th
                className="py-4 px-6 text-left cursor-pointer"
                onClick={() => handleSort('price')}
              >
                <div className="flex items-center space-x-2">
                  <span>Price</span>
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </th>
              <th
                className="py-4 px-6 text-left cursor-pointer"
                onClick={() => handleSort('stock')}
              >
                <div className="flex items-center space-x-2">
                  <span>Stock</span>
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </th>
              <th className="py-4 px-6 text-left">Status</th>
              <th className="py-4 px-6 text-left">Last Updated</th>
              <th className="py-4 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-secondary-100">
                <td className="py-4 px-6">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => handleSelectProduct(product.id)}
                    className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                  />
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center">
                      <Package className="h-6 w-6 text-secondary-600" />
                    </div>
                    <span className="font-medium">{product.name}</span>
                  </div>
                </td>
                <td className="py-4 px-6">{product.type}</td>
                <td className="py-4 px-6">{product.category}</td>
                <td className="py-4 px-6">${product.price.toFixed(2)}</td>
                <td className="py-4 px-6">{product.stock}</td>
                <td className="py-4 px-6">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(product.status)}`}>
                    {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                  </span>
                </td>
                <td className="py-4 px-6">{product.lastUpdated}</td>
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-2">
                    <button className="p-1 hover:bg-secondary-100 rounded text-secondary-600">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-1 hover:bg-secondary-100 rounded text-secondary-600">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-1 hover:bg-secondary-100 rounded text-secondary-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <button className="p-1 hover:bg-secondary-100 rounded text-secondary-600">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="p-4 border-t border-secondary-100 flex items-center justify-between">
          <div className="text-sm text-secondary-600">
            Showing 1 to {products.length} of {products.length} entries
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

export default ProductManagement;