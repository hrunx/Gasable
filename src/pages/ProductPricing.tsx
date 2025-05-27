import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  Search,
  Filter,
  Download,
  Upload,
  Edit,
  Save,
  X,
  Tag,
  Package,
  Globe,
  ArrowUpDown,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2,
  RefreshCw,
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  sku: string;
  zone: string;
  basePrice: number;
  b2bPrice: number;
  b2cPrice: number;
  status: 'active' | 'inactive';
  lastUpdated: string;
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Industrial Gas Tank',
    sku: 'IGT-001',
    zone: 'Riyadh Region',
    basePrice: 450.00,
    b2bPrice: 399.99,
    b2cPrice: 499.99,
    status: 'active',
    lastUpdated: '2024-03-15',
  },
  {
    id: '2',
    name: 'Industrial Gas Tank',
    sku: 'IGT-001',
    zone: 'Jeddah Region',
    basePrice: 460.00,
    b2bPrice: 409.99,
    b2cPrice: 509.99,
    status: 'active',
    lastUpdated: '2024-03-15',
  },
  {
    id: '3',
    name: 'Premium Gas Cylinder',
    sku: 'PGC-002',
    zone: 'Riyadh Region',
    basePrice: 85.00,
    b2bPrice: 79.99,
    b2cPrice: 99.99,
    status: 'active',
    lastUpdated: '2024-03-14',
  },
  {
    id: '4',
    name: 'Premium Gas Cylinder',
    sku: 'PGC-002',
    zone: 'Jeddah Region',
    basePrice: 90.00,
    b2bPrice: 84.99,
    b2cPrice: 104.99,
    status: 'active',
    lastUpdated: '2024-03-14',
  },
  {
    id: '5',
    name: 'Commercial Gas Setup',
    sku: 'CGS-003',
    zone: 'Riyadh Region',
    basePrice: 1200.00,
    b2bPrice: 1099.99,
    b2cPrice: 1299.99,
    status: 'active',
    lastUpdated: '2024-03-13',
  },
  {
    id: '6',
    name: 'Commercial Gas Setup',
    sku: 'CGS-003',
    zone: 'Eastern Province',
    basePrice: 1250.00,
    b2bPrice: 1149.99,
    b2cPrice: 1349.99,
    status: 'active',
    lastUpdated: '2024-03-13',
  },
  {
    id: '7',
    name: 'Safety Valve',
    sku: 'SFV-004',
    zone: 'All Regions',
    basePrice: 45.00,
    b2bPrice: 39.99,
    b2cPrice: 49.99,
    status: 'active',
    lastUpdated: '2024-03-12',
  },
  {
    id: '8',
    name: 'Pressure Gauge',
    sku: 'PRG-005',
    zone: 'All Regions',
    basePrice: 35.00,
    b2bPrice: 29.99,
    b2cPrice: 39.99,
    status: 'inactive',
    lastUpdated: '2024-03-11',
  },
];

const ProductPricing = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterZone, setFilterZone] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortField, setSortField] = useState<keyof Product>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Product>>({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isBulkEditModalOpen, setIsBulkEditModalOpen] = useState(false);
  const [bulkEditData, setBulkEditData] = useState({
    selectedProducts: [] as string[],
    priceAdjustment: 0,
    adjustmentType: 'percentage', // or 'fixed'
    applyTo: 'all', // or 'b2b', 'b2c', 'base'
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const handleSort = (field: keyof Product) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleEditClick = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setEditFormData(product);
      setEditingProduct(productId);
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: name === 'basePrice' || name === 'b2bPrice' || name === 'b2cPrice' 
        ? parseFloat(value) 
        : value
    }));
  };

  const handleSaveEdit = (productId: string) => {
    setProducts(products.map(product => 
      product.id === productId 
        ? { ...product, ...editFormData, lastUpdated: new Date().toISOString().split('T')[0] } 
        : product
    ));
    setEditingProduct(null);
    setEditFormData({});
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setEditFormData({});
  };

  const handleBulkEditSubmit = () => {
    setProducts(products.map(product => {
      if (bulkEditData.selectedProducts.includes(product.id)) {
        const updatedProduct = { ...product };
        
        const applyAdjustment = (price: number) => {
          if (bulkEditData.adjustmentType === 'percentage') {
            return price * (1 + bulkEditData.priceAdjustment / 100);
          } else {
            return price + bulkEditData.priceAdjustment;
          }
        };
        
        if (bulkEditData.applyTo === 'all' || bulkEditData.applyTo === 'base') {
          updatedProduct.basePrice = applyAdjustment(product.basePrice);
        }
        
        if (bulkEditData.applyTo === 'all' || bulkEditData.applyTo === 'b2b') {
          updatedProduct.b2bPrice = applyAdjustment(product.b2bPrice);
        }
        
        if (bulkEditData.applyTo === 'all' || bulkEditData.applyTo === 'b2c') {
          updatedProduct.b2cPrice = applyAdjustment(product.b2cPrice);
        }
        
        updatedProduct.lastUpdated = new Date().toISOString().split('T')[0];
        return updatedProduct;
      }
      return product;
    }));
    
    setIsBulkEditModalOpen(false);
    setBulkEditData({
      selectedProducts: [],
      priceAdjustment: 0,
      adjustmentType: 'percentage',
      applyTo: 'all',
    });
  };

  const filteredProducts = products.filter(product => {
    if (filterZone !== 'all' && product.zone !== filterZone) {
      return false;
    }
    if (filterStatus !== 'all' && product.status !== filterStatus) {
      return false;
    }
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        product.name.toLowerCase().includes(searchLower) ||
        product.sku.toLowerCase().includes(searchLower) ||
        product.zone.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    } else if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' 
        ? aValue - bValue 
        : bValue - aValue;
    }
    
    return 0;
  });

  // Get unique zones for filter
  const uniqueZones = Array.from(new Set(products.map(p => p.zone)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900 mb-2">
              💰 Product Pricing
            </h1>
            <p className="text-secondary-600">
              Manage your product prices across different regions and customer segments
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
            <button 
              onClick={() => setIsBulkEditModalOpen(true)}
              className="px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors flex items-center space-x-2"
            >
              <Edit className="h-5 w-5" />
              <span>Bulk Edit</span>
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
        <div className="grid grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-secondary-50 p-6 rounded-xl border border-secondary-100"
          >
            <div className="flex items-center justify-between mb-2">
              <Package className="h-6 w-6 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">{products.length}</span>
            </div>
            <p className="text-secondary-600">Total Products</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-secondary-50 p-6 rounded-xl border border-secondary-100"
          >
            <div className="flex items-center justify-between mb-2">
              <Globe className="h-6 w-6 text-purple-600" />
              <span className="text-2xl font-bold text-purple-600">{uniqueZones.length}</span>
            </div>
            <p className="text-secondary-600">Pricing Zones</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-secondary-50 p-6 rounded-xl border border-secondary-100"
          >
            <div className="flex items-center justify-between mb-2">
              <Tag className="h-6 w-6 text-green-600" />
              <span className="text-2xl font-bold text-green-600">
                {products.filter(p => p.status === 'active').length}
              </span>
            </div>
            <p className="text-secondary-600">Active Products</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-secondary-50 p-6 rounded-xl border border-secondary-100"
          >
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="h-6 w-6 text-yellow-600" />
              <span className="text-2xl font-bold text-yellow-600">
                {products.reduce((sum, product) => sum + product.basePrice, 0).toFixed(2)}
              </span>
            </div>
            <p className="text-secondary-600">Total Base Value</p>
          </motion.div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search products by name, SKU, or zone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
          <select
            value={filterZone}
            onChange={(e) => setFilterZone(e.target.value)}
            className="px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          >
            <option value="all">All Zones</option>
            {uniqueZones.map((zone) => (
              <option key={zone} value={zone}>{zone}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button className="p-2 hover:bg-secondary-100 rounded-lg text-secondary-600">
            <Filter className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-secondary-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-secondary-50">
                <th className="py-4 px-6 text-left font-medium text-secondary-600">
                  <div 
                    className="flex items-center space-x-2 cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    <span>Product</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th className="py-4 px-6 text-left font-medium text-secondary-600">
                  <div 
                    className="flex items-center space-x-2 cursor-pointer"
                    onClick={() => handleSort('sku')}
                  >
                    <span>SKU</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th className="py-4 px-6 text-left font-medium text-secondary-600">
                  <div 
                    className="flex items-center space-x-2 cursor-pointer"
                    onClick={() => handleSort('zone')}
                  >
                    <span>Zone</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th className="py-4 px-6 text-left font-medium text-secondary-600">
                  <div 
                    className="flex items-center space-x-2 cursor-pointer"
                    onClick={() => handleSort('basePrice')}
                  >
                    <span>Base Price</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th className="py-4 px-6 text-left font-medium text-secondary-600">
                  <div 
                    className="flex items-center space-x-2 cursor-pointer"
                    onClick={() => handleSort('b2bPrice')}
                  >
                    <span>B2B Price</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th className="py-4 px-6 text-left font-medium text-secondary-600">
                  <div 
                    className="flex items-center space-x-2 cursor-pointer"
                    onClick={() => handleSort('b2cPrice')}
                  >
                    <span>B2C Price</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th className="py-4 px-6 text-left font-medium text-secondary-600">Status</th>
                <th className="py-4 px-6 text-left font-medium text-secondary-600">Last Updated</th>
                <th className="py-4 px-6 text-left font-medium text-secondary-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedProducts.map((product) => (
                <tr key={product.id} className="border-b border-secondary-100">
                  <td className="py-4 px-6 font-medium">{product.name}</td>
                  <td className="py-4 px-6">{product.sku}</td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 bg-secondary-50 text-secondary-700 rounded-full">
                      {product.zone}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    {editingProduct === product.id ? (
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400">$</span>
                        <input
                          type="number"
                          name="basePrice"
                          value={editFormData.basePrice}
                          onChange={handleEditChange}
                          className="pl-8 pr-4 py-1 w-24 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                          step="0.01"
                          min="0"
                        />
                      </div>
                    ) : (
                      <span>${product.basePrice.toFixed(2)}</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    {editingProduct === product.id ? (
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400">$</span>
                        <input
                          type="number"
                          name="b2bPrice"
                          value={editFormData.b2bPrice}
                          onChange={handleEditChange}
                          className="pl-8 pr-4 py-1 w-24 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                          step="0.01"
                          min="0"
                        />
                      </div>
                    ) : (
                      <span>${product.b2bPrice.toFixed(2)}</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    {editingProduct === product.id ? (
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400">$</span>
                        <input
                          type="number"
                          name="b2cPrice"
                          value={editFormData.b2cPrice}
                          onChange={handleEditChange}
                          className="pl-8 pr-4 py-1 w-24 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                          step="0.01"
                          min="0"
                        />
                      </div>
                    ) : (
                      <span>${product.b2cPrice.toFixed(2)}</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      product.status === 'active' 
                        ? 'bg-green-50 text-green-700' 
                        : 'bg-red-50 text-red-700'
                    }`}>
                      {product.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-4 px-6">{product.lastUpdated}</td>
                  <td className="py-4 px-6">
                    {editingProduct === product.id ? (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleSaveEdit(product.id)}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                        >
                          <Save className="h-5 w-5" />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEditClick(product.id)}
                        className="p-1 text-primary-600 hover:bg-primary-50 rounded"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-secondary-100 flex items-center justify-between">
          <div className="text-sm text-secondary-600">
            Showing 1 to {sortedProducts.length} of {sortedProducts.length} entries
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

      {/* Bulk Edit Modal */}
      {isBulkEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Bulk Price Update</h2>
              <button
                onClick={() => setIsBulkEditModalOpen(false)}
                className="p-2 hover:bg-secondary-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Select Products
                </label>
                <select
                  multiple
                  className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none h-32"
                  value={bulkEditData.selectedProducts}
                  onChange={(e) => {
                    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                    setBulkEditData({
                      ...bulkEditData,
                      selectedProducts: selectedOptions
                    });
                  }}
                >
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} - {product.zone} (${product.basePrice.toFixed(2)})
                    </option>
                  ))}
                </select>
                <p className="text-sm text-secondary-500 mt-1">
                  Hold Ctrl/Cmd to select multiple products
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Adjustment Type
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      checked={bulkEditData.adjustmentType === 'percentage'}
                      onChange={() => setBulkEditData({
                        ...bulkEditData,
                        adjustmentType: 'percentage'
                      })}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <span>Percentage (%)</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      checked={bulkEditData.adjustmentType === 'fixed'}
                      onChange={() => setBulkEditData({
                        ...bulkEditData,
                        adjustmentType: 'fixed'
                      })}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <span>Fixed Amount ($)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Price Adjustment
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400">
                    {bulkEditData.adjustmentType === 'percentage' ? '%' : '$'}
                  </span>
                  <input
                    type="number"
                    value={bulkEditData.priceAdjustment}
                    onChange={(e) => setBulkEditData({
                      ...bulkEditData,
                      priceAdjustment: parseFloat(e.target.value)
                    })}
                    className="pl-8 pr-4 py-2 w-full border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    step="0.01"
                  />
                </div>
                <p className="text-sm text-secondary-500 mt-1">
                  {bulkEditData.adjustmentType === 'percentage' 
                    ? 'Use negative values for discounts' 
                    : 'Use negative values to decrease prices'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Apply To
                </label>
                <select
                  value={bulkEditData.applyTo}
                  onChange={(e) => setBulkEditData({
                    ...bulkEditData,
                    applyTo: e.target.value as 'all' | 'b2b' | 'b2c' | 'base'
                  })}
                  className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                >
                  <option value="all">All Prices</option>
                  <option value="base">Base Price Only</option>
                  <option value="b2b">B2B Price Only</option>
                  <option value="b2c">B2C Price Only</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsBulkEditModalOpen(false)}
                className="px-4 py-2 text-secondary-700 hover:bg-secondary-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkEditSubmit}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                disabled={bulkEditData.selectedProducts.length === 0}
              >
                Apply Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPricing;