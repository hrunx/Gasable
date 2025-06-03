import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package, Search, Filter, Eye, Edit, Trash2, MoreVertical,
  Plus, Upload, Download, CheckCircle, Clock, Tag, Copy,
  Archive, ExternalLink, ArrowUpDown, AlertCircle, Loader, X,
  MapPin
} from 'lucide-react';
import { useProducts, Product } from '../lib/hooks/useProducts';
import { useZones } from '@/lib/hooks/useZones';

const ProductManagement = () => {
  const navigate = useNavigate();
  
  // Hooks
  const {
    getProductsByCompany,
    getProductStats,
    searchProducts,
    updateProduct,
    deleteProduct,
    loading,
    error
  } = useProducts();
  
  const {
    zones,
    assignments,
    loading: zonesLoading,
    getZonesByCompany,
    getAssignmentsByCompany,
    assignProductsToZone
  } = useZones();

  // State management
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    draftProducts: 0,
    archivedProducts: 0,
    totalCategories: 0
  });
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof Product>('updated_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [viewModalProduct, setViewModalProduct] = useState<Product | null>(null);
  const [moreOptionsDropdown, setMoreOptionsDropdown] = useState<string | null>(null);
  
  // Zone assignment state
  const [zoneAssignmentModal, setZoneAssignmentModal] = useState<{ 
    isOpen: boolean; 
    productId?: string; 
    productName?: string; 
  }>({ isOpen: false });
  const [selectedZoneId, setSelectedZoneId] = useState<string>('');
  const [overridePricing, setOverridePricing] = useState({
    override_base_price: '',
    override_b2b_price: '',
    override_b2c_price: ''
  });

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.all([
        loadProducts(),
        loadStats(),
        getZonesByCompany(),
        getAssignmentsByCompany()
      ]);
      setIsInitialLoading(false);
    };
    loadInitialData();
  }, []);

  // Handle search and filter changes
  useEffect(() => {
    if (searchTerm || filterStatus !== 'all') {
      handleSearch();
    } else {
      loadProducts();
    }
  }, [searchTerm, filterStatus]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreOptionsDropdown) {
        const target = event.target as HTMLElement;
        if (!target.closest('.more-options-dropdown')) {
          setMoreOptionsDropdown(null);
        }
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setViewModalProduct(null);
        setMoreOptionsDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [moreOptionsDropdown]);

  const loadProducts = async () => {
    try {
      const data = await getProductsByCompany();
      setProducts(data || []);
    } catch (err) {
      console.error('Failed to load products:', err);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await getProductStats();
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const handleSearch = async () => {
    try {
      const data = await searchProducts(searchTerm, { status: filterStatus });
      setProducts(data || []);
    } catch (err) {
      console.error('Failed to search products:', err);
    }
  };

  const handleSort = (field: keyof Product) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }

    const sortedProducts = [...products].sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];
      
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    setProducts(sortedProducts);
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

  const handleViewProduct = (product: Product) => {
    setViewModalProduct(product);
  };

  const handleEditProduct = (productId: string) => {
    // Navigate to product pricing page with edit mode for that specific product
    navigate(`/product-pricing?edit=${productId}`);
  };

  const handleDuplicateProduct = async (product: Product) => {
    try {
      // Create a copy with modified name
      const duplicateData = {
        company_id: product.company_id,
        store_id: '', // You might want to handle this differently
        name: `${product.name} (Copy)`,
        brand: product.brand || '',
        type: product.type || '',
        model: product.model || '',
        category: product.category || '',
        description: product.description || '',
        status: 'draft' as const
      };
      
      // You'd need to implement createProduct in a way that accepts this format
      console.log('Duplicate product:', duplicateData);
      alert('Product duplication will be implemented with store selection');
    } catch (err) {
      console.error('Failed to duplicate product:', err);
    }
  };

  const handleArchiveProduct = async (productId: string) => {
    try {
      await updateProduct(productId, { status: 'archived' });
      loadProducts();
      loadStats();
      setMoreOptionsDropdown(null);
    } catch (err) {
      console.error('Failed to archive product:', err);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
        loadProducts();
        loadStats();
      } catch (err) {
        console.error('Failed to delete product:', err);
      }
    }
  };

  const handleStatusChange = async (productId: string, newStatus: string) => {
    try {
      await updateProduct(productId, { status: newStatus });
      loadProducts();
      loadStats();
    } catch (err) {
      console.error('Failed to update product status:', err);
    }
  };

  const getStatusColor = (status: string) => {
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

  const formatPrice = (product: Product) => {
    console.log('Product data:', product); // Debug log
    
    // Show store-based default pricing (new system)
    if (product.base_price !== null && product.base_price !== undefined) {
      const zoneAssignments = (product as any).product_zone_assignments || [];
      const zoneCount = zoneAssignments.filter((assignment: any) => assignment.is_active !== false).length;
      
      if (zoneCount > 0) {
        return `$${product.base_price.toFixed(2)} • ${zoneCount} zone${zoneCount > 1 ? 's' : ''}`;
      } else {
        return `$${product.base_price.toFixed(2)} (default)`;
      }
    }
    
    // Fallback for products without default pricing
    console.log('No default pricing found for product:', product.name);
    return 'No pricing set';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Zone assignment functions
  const handleAssignToZone = (productId: string, productName: string) => {
    setZoneAssignmentModal({ 
      isOpen: true, 
      productId, 
      productName 
    });
    setSelectedZoneId('');
    setOverridePricing({
      override_base_price: '',
      override_b2b_price: '',
      override_b2c_price: ''
    });
  };

  const handleZoneAssignmentSubmit = async () => {
    if (!zoneAssignmentModal.productId || !selectedZoneId) return;

    try {
      const assignmentData = {
        product_ids: [zoneAssignmentModal.productId],
        zone_id: selectedZoneId,
        override_base_price: overridePricing.override_base_price ? parseFloat(overridePricing.override_base_price) : null,
        override_b2b_price: overridePricing.override_b2b_price ? parseFloat(overridePricing.override_b2b_price) : null,
        override_b2c_price: overridePricing.override_b2c_price ? parseFloat(overridePricing.override_b2c_price) : null,
        override_min_order_quantity: null,
        is_active: true,
        priority: 1
      };

      await assignProductsToZone(assignmentData);
      await getAssignmentsByCompany(); // Refresh assignments
      setZoneAssignmentModal({ isOpen: false });
      alert('Product assigned to zone successfully!');
    } catch (err) {
      console.error('Failed to assign product to zone:', err);
      alert('Failed to assign product to zone');
    }
  };

  const getProductZones = (productId: string) => {
    return assignments.filter(assignment => assignment.product_id === productId);
  };

  const formatZones = (productId: string) => {
    const productZones = getProductZones(productId);
    if (productZones.length === 0) {
      return 'No zones';
    } else if (productZones.length === 1) {
      return productZones[0].zone?.name || 'Unknown zone';
    } else {
      return `${productZones.length} zones`;
    }
  };

  if (isInitialLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-secondary-600">Loading products...</p>
        </div>
      </div>
    );
  }

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

        {/* Dynamic Stats */}
        <div className="grid grid-cols-4 gap-6 mt-6">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <Package className="h-6 w-6 text-blue-600" />
              <span className="text-2xl font-bold text-blue-700">{stats.totalProducts}</span>
            </div>
            <p className="text-sm text-blue-600">Total Products</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-100">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <span className="text-2xl font-bold text-green-700">{stats.activeProducts}</span>
            </div>
            <p className="text-sm text-green-600">Active Products</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
            <div className="flex items-center justify-between mb-2">
              <Clock className="h-6 w-6 text-yellow-600" />
              <span className="text-2xl font-bold text-yellow-700">{stats.draftProducts}</span>
            </div>
            <p className="text-sm text-yellow-600">Draft Products</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
            <div className="flex items-center justify-between mb-2">
              <Tag className="h-6 w-6 text-purple-600" />
              <span className="text-2xl font-bold text-purple-700">{stats.totalCategories}</span>
            </div>
            <p className="text-sm text-purple-600">Categories</p>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
        {loading && (
          <div className="p-8 text-center">
            <Loader className="h-6 w-6 animate-spin mx-auto mb-2" />
            <p className="text-secondary-600">Loading products...</p>
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="p-8 text-center">
            <Package className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-secondary-900 mb-2">No products found</h3>
            <p className="text-secondary-600 mb-4">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Get started by adding your first product'}
            </p>
            <button 
              onClick={() => navigate('/setup/add-product')}
              className="btn-primary"
            >
              Add Your First Product
            </button>
          </div>
        )}

        {!loading && products.length > 0 && (
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
                <th className="py-4 px-6 text-left">Brand</th>
                <th className="py-4 px-6 text-left">Price</th>
                <th className="py-4 px-6 text-left">Zones</th>
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
                      <div>
                        <div className="font-medium">{product.name}</div>
                        {product.model && (
                          <div className="text-sm text-secondary-500">Model: {product.model}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">{product.type || '-'}</td>
                  <td className="py-4 px-6">{product.category || '-'}</td>
                  <td className="py-4 px-6">{product.brand || '-'}</td>
                  <td className="py-4 px-6">{formatPrice(product)}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-secondary-600">
                        {formatZones(product.id)}
                      </span>
                      <button
                        onClick={() => handleAssignToZone(product.id, product.name)}
                        className="ml-2 p-1 hover:bg-blue-100 rounded text-blue-600"
                        title="Assign to Zone"
                      >
                        <MapPin className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <select
                      value={product.status}
                      onChange={(e) => handleStatusChange(product.id, e.target.value)}
                      className={`px-2 py-1 text-xs rounded-full border-0 outline-none ${getStatusColor(product.status)}`}
                    >
                      <option value="active">Active</option>
                      <option value="draft">Draft</option>
                      <option value="archived">Archived</option>
                    </select>
                  </td>
                  <td className="py-4 px-6">{formatDate(product.updated_at)}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleViewProduct(product)}
                        className="p-1 hover:bg-secondary-100 rounded text-secondary-600"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleEditProduct(product.id)}
                        className="p-1 hover:bg-secondary-100 rounded text-secondary-600"
                        title="Edit Product"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-1 hover:bg-red-100 rounded text-red-600"
                        title="Delete Product"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <div className="relative more-options-dropdown">
                        <button 
                          onClick={() => setMoreOptionsDropdown(moreOptionsDropdown === product.id ? null : product.id)}
                          className="p-1 hover:bg-secondary-100 rounded text-secondary-600"
                          title="More Options"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        {moreOptionsDropdown === product.id && (
                          <div className="absolute right-0 top-8 w-48 bg-white border border-secondary-200 rounded-lg shadow-lg z-10">
                            <button
                              onClick={() => handleDuplicateProduct(product)}
                              className="w-full text-left px-4 py-2 hover:bg-secondary-50 flex items-center space-x-2"
                            >
                              <Copy className="h-4 w-4" />
                              <span>Duplicate</span>
                            </button>
                            <button
                              onClick={() => handleArchiveProduct(product.id)}
                              className="w-full text-left px-4 py-2 hover:bg-secondary-50 flex items-center space-x-2"
                            >
                              <Archive className="h-4 w-4" />
                              <span>Archive</span>
                            </button>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(product.id);
                                alert('Product ID copied to clipboard');
                                setMoreOptionsDropdown(null);
                              }}
                              className="w-full text-left px-4 py-2 hover:bg-secondary-50 flex items-center space-x-2"
                            >
                              <ExternalLink className="h-4 w-4" />
                              <span>Copy ID</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {!loading && products.length > 0 && (
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
        )}
      </div>

      {/* View Product Modal */}
      {viewModalProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-secondary-900">Product Details</h2>
              <button
                onClick={() => setViewModalProduct(null)}
                className="p-1 hover:bg-secondary-100 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-secondary-600">Name</label>
                    <p className="text-secondary-900">{viewModalProduct.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-secondary-600">Brand</label>
                    <p className="text-secondary-900">{viewModalProduct.brand || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-secondary-600">Type</label>
                    <p className="text-secondary-900">{viewModalProduct.type || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-secondary-600">Category</label>
                    <p className="text-secondary-900">{viewModalProduct.category || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-secondary-600">Model</label>
                    <p className="text-secondary-900">{viewModalProduct.model || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-secondary-600">Status</label>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(viewModalProduct.status)}`}>
                      {viewModalProduct.status.charAt(0).toUpperCase() + viewModalProduct.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              {viewModalProduct.description && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Description</h3>
                  <p className="text-secondary-900">{viewModalProduct.description}</p>
                </div>
              )}

              {/* Store Default Pricing */}
              {(viewModalProduct.base_price !== null || viewModalProduct.b2b_price !== null || viewModalProduct.b2c_price !== null) && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Store Default Pricing</h3>
                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <label className="text-sm font-medium text-secondary-600">Base Price</label>
                      <p className="text-secondary-900 text-lg font-semibold">
                        ${viewModalProduct.base_price?.toFixed(2) || '0.00'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-secondary-600">B2B Price</label>
                      <p className="text-secondary-900">
                        ${viewModalProduct.b2b_price?.toFixed(2) || '0.00'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-secondary-600">B2C Price</label>
                      <p className="text-secondary-900">
                        ${viewModalProduct.b2c_price?.toFixed(2) || '0.00'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-secondary-600">Min Order Quantity</label>
                      <p className="text-secondary-900">
                        {viewModalProduct.min_order_quantity || 1} units
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Zone Assignments */}
              {(viewModalProduct as Product & { product_zone_assignments?: any[] }).product_zone_assignments && 
               (viewModalProduct as Product & { product_zone_assignments?: any[] }).product_zone_assignments!.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Zone Assignments ({(viewModalProduct as Product & { product_zone_assignments?: any[] }).product_zone_assignments!.length})
                  </h3>
                  <div className="space-y-3">
                    {(viewModalProduct as Product & { product_zone_assignments?: any[] }).product_zone_assignments!.map((assignment: any, index: number) => (
                      <div key={index} className="border border-secondary-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-secondary-900">
                            {assignment.delivery_zones?.name || `Zone ${index + 1}`}
                          </h4>
                          <div className="flex items-center space-x-2">
                            {assignment.delivery_zones?.zone_type && (
                              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                                {assignment.delivery_zones.zone_type}
                              </span>
                            )}
                            <span className={`px-2 py-1 text-xs rounded ${
                              assignment.is_active !== false 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {assignment.is_active !== false ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                        
                        {/* Show overridden prices if they exist */}
                        {(assignment.override_base_price !== null || 
                          assignment.override_b2b_price !== null || 
                          assignment.override_b2c_price !== null) && (
                          <div>
                            <p className="text-sm font-medium text-secondary-600 mb-2">Zone-Specific Pricing:</p>
                            <div className="grid grid-cols-3 gap-3 text-sm">
                              {assignment.override_base_price !== null && (
                                <div>
                                  <span className="text-secondary-500">Base: </span>
                                  <span className="font-medium">${assignment.override_base_price.toFixed(2)}</span>
                                </div>
                              )}
                              {assignment.override_b2b_price !== null && (
                                <div>
                                  <span className="text-secondary-500">B2B: </span>
                                  <span className="font-medium">${assignment.override_b2b_price.toFixed(2)}</span>
                                </div>
                              )}
                              {assignment.override_b2c_price !== null && (
                                <div>
                                  <span className="text-secondary-500">B2C: </span>
                                  <span className="font-medium">${assignment.override_b2c_price.toFixed(2)}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {/* Show zone delivery info */}
                        {assignment.delivery_zones && (
                          <div className="mt-3 pt-3 border-t border-secondary-100">
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              {assignment.delivery_zones.delivery_fee !== null && (
                                <div>
                                  <span className="text-secondary-500">Delivery Fee: </span>
                                  <span>${assignment.delivery_zones.delivery_fee.toFixed(2)}</span>
                                </div>
                              )}
                              {assignment.delivery_zones.discount_percentage !== null && (
                                <div>
                                  <span className="text-secondary-500">Zone Discount: </span>
                                  <span>{assignment.delivery_zones.discount_percentage}%</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> If no zone-specific pricing is set, the store default pricing above will be used.
                    </p>
                  </div>
                </div>
              )}

              {/* Attributes */}
              {viewModalProduct.attributes && viewModalProduct.attributes.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Attributes</h3>
                  <div className="space-y-2">
                    {viewModalProduct.attributes.map((attr, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-secondary-100">
                        <span className="font-medium">{attr.name}</span>
                        <span>{attr.value} {attr.unit && `${attr.unit}`}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Timestamps</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-secondary-600">Created</label>
                    <p className="text-secondary-900">{formatDate(viewModalProduct.created_at)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-secondary-600">Last Updated</label>
                    <p className="text-secondary-900">{formatDate(viewModalProduct.updated_at)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Zone Assignment Modal */}
      {zoneAssignmentModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-secondary-900">
                Assign to Zone
              </h2>
              <button
                onClick={() => setZoneAssignmentModal({ isOpen: false })}
                className="p-1 hover:bg-secondary-100 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-secondary-600 mb-2 block">
                  Product
                </label>
                <p className="text-secondary-900 font-medium">
                  {zoneAssignmentModal.productName}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-secondary-600 mb-2 block">
                  Select Zone
                </label>
                <select
                  value={selectedZoneId}
                  onChange={(e) => setSelectedZoneId(e.target.value)}
                  className="w-full p-3 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Choose a zone...</option>
                  {zones.map((zone) => (
                    <option key={zone.id} value={zone.id}>
                      {zone.name} ({zone.zone_type})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-secondary-600 mb-2 block">
                  Override Pricing (Optional)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-secondary-500">Base Price</label>
                    <input
                      type="number"
                      step="0.01"
                      value={overridePricing.override_base_price}
                      onChange={(e) => setOverridePricing(prev => ({
                        ...prev,
                        override_base_price: e.target.value
                      }))}
                      placeholder="$0.00"
                      className="w-full p-2 border border-secondary-200 rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-secondary-500">B2B Price</label>
                    <input
                      type="number"
                      step="0.01"
                      value={overridePricing.override_b2b_price}
                      onChange={(e) => setOverridePricing(prev => ({
                        ...prev,
                        override_b2b_price: e.target.value
                      }))}
                      placeholder="$0.00"
                      className="w-full p-2 border border-secondary-200 rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-secondary-500">B2C Price</label>
                    <input
                      type="number"
                      step="0.01"
                      value={overridePricing.override_b2c_price}
                      onChange={(e) => setOverridePricing(prev => ({
                        ...prev,
                        override_b2c_price: e.target.value
                      }))}
                      placeholder="$0.00"
                      className="w-full p-2 border border-secondary-200 rounded text-sm"
                    />
                  </div>
                </div>
                <p className="text-xs text-secondary-500 mt-2">
                  Leave empty to use default product pricing
                </p>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setZoneAssignmentModal({ isOpen: false })}
                  className="flex-1 px-4 py-2 border border-secondary-200 text-secondary-600 rounded-lg hover:bg-secondary-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleZoneAssignmentSubmit}
                  disabled={!selectedZoneId || zonesLoading}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                >
                  {zonesLoading ? 'Assigning...' : 'Assign to Zone'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;