import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  Search,
  Edit,
  Save,
  X,
  Package,
  RefreshCw,
  MapPin,
  Plus,
  Settings,
  Trash2
} from 'lucide-react';
import { useProducts, Product } from '@/lib/hooks/useProducts';
import { useZones, ProductZoneAssignment, DeliveryZone, ZoneFormData } from '@/lib/hooks/useZones';
import { Card } from '@/components/ui/card';

interface ZoneProductView {
  zone: DeliveryZone;
  products: {
    id: string;
    assignment_id?: string;
    product_id: string;
    name: string;
    sku: string;
    base_price: number;
    b2b_price: number;
    b2c_price: number;
    override_base_price: number | null;
    override_b2b_price: number | null;
    override_b2c_price: number | null;
    effective_base_price: number;
    effective_b2b_price: number;
    effective_b2c_price: number;
    is_active: boolean;
    status: 'active' | 'inactive';
    last_updated: string;
  }[];
}

const ProductPricing = () => {
  const { getProductsByCompany, loading: productsLoading } = useProducts();
  
  // Safe destructuring with error handling
  const zonesHook = useZones();
  const { 
    zones = [], 
    assignments = [], 
    loading: zonesLoading = false,
    error: zonesError,
    createZone,
    updateZone,
    deleteZone,
    assignProductsToZone, 
    updateAssignment, 
    removeProductFromZone
  } = zonesHook || {};

  // State management
  const [products, setProducts] = useState<Product[]>([]);
  const [zoneProductViews, setZoneProductViews] = useState<ZoneProductView[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [componentError, setComponentError] = useState<string | null>(null);

  // Zone management states
  const [showZoneModal, setShowZoneModal] = useState(false);
  const [editingZone, setEditingZone] = useState<DeliveryZone | null>(null);
  const [zoneForm, setZoneForm] = useState<ZoneFormData>({
    name: '',
    zone_type: 'urban',
    delivery_fee: 0,
    default_b2b_price: null,
    default_b2c_price: null,
    discount_percentage: 0,
    is_active: true,
    coverage_areas: [''],
    description: ''
  });

  // Product assignment states
  const [selectedZone, setSelectedZone] = useState<DeliveryZone | null>(null);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [selectedProductsForAdd, setSelectedProductsForAdd] = useState<string[]>([]);
  
  // Inline editing states
  const [editingAssignment, setEditingAssignment] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<{
    effective_base_price?: number;
    effective_b2b_price?: number;
    effective_b2c_price?: number;
    is_active?: boolean;
  }>({});

  // Load data on component mount with error handling
  useEffect(() => {
    const safeLoadData = async () => {
      try {
        await loadData();
      } catch (error) {
        console.error('Error initializing ProductPricing component:', error);
        setComponentError('Failed to load pricing data. Please refresh the page.');
      }
    };
    safeLoadData();
  }, []);

  // Transform data when zones, assignments, or products change - with safe checks
  useEffect(() => {
    try {
      if (Array.isArray(zones) && Array.isArray(assignments) && Array.isArray(products)) {
        if (zones.length > 0 || assignments.length > 0 || products.length > 0) {
          const transformedData = transformToZoneProductViews(zones, assignments, products);
          setZoneProductViews(transformedData);
        }
      }
    } catch (error) {
      console.error('Error transforming data:', error);
      setComponentError('Error processing pricing data.');
    }
  }, [zones, assignments, products]);

  const loadData = async () => {
    setLoading(true);
    try {
      const productsData = await getProductsByCompany();
      setProducts(productsData || []);
    } catch (error) {
      console.error('Error loading pricing data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Transform data to zone-centric view
  const transformToZoneProductViews = (
    zones: DeliveryZone[], 
    assignments: ProductZoneAssignment[], 
    products: Product[]
  ): ZoneProductView[] => {
    try {
      // Safeguard: ensure all parameters are arrays
      const safeZones = Array.isArray(zones) ? zones : [];
      const safeAssignments = Array.isArray(assignments) ? assignments : [];
      const safeProducts = Array.isArray(products) ? products : [];
      
      return safeZones.map(zone => {
        // Get all assignments for this zone
        const zoneAssignments = safeAssignments.filter(a => a && a.zone_id === zone.id);
        
        // Transform assignments to product view
        const zoneProducts = zoneAssignments.map(assignment => {
          if (!assignment || !assignment.product_id) return null;
          
          const product = safeProducts.find(p => p && p.id === assignment.product_id);
          if (!product) return null;

          return {
            id: `${assignment.id}`,
            assignment_id: assignment.id,
            product_id: product.id,
            name: product.name || 'Unknown Product',
            sku: product.sku || '',
            base_price: product.base_price || 0,
            b2b_price: product.b2b_price || 0,
            b2c_price: product.b2c_price || 0,
            override_base_price: assignment.override_base_price,
            override_b2b_price: assignment.override_b2b_price,
            override_b2c_price: assignment.override_b2c_price,
            effective_base_price: assignment.override_base_price || product.base_price || 0,
            effective_b2b_price: assignment.override_b2b_price || product.b2b_price || 0,
            effective_b2c_price: assignment.override_b2c_price || product.b2c_price || 0,
            is_active: assignment.is_active !== false && product.status === 'active',
            status: (assignment.is_active !== false && product.status === 'active') ? 'active' : 'inactive',
            last_updated: assignment.updated_at || new Date().toISOString().split('T')[0]
          };
        }).filter(Boolean) as ZoneProductView['products'];

        return {
          zone,
          products: zoneProducts
        };
      });
    } catch (error) {
      console.error('Error in transformToZoneProductViews:', error);
      return [];
    }
  };

  // Zone management handlers
  const handleCreateZone = () => {
    setEditingZone(null);
    setZoneForm({
      name: '',
      zone_type: 'urban',
      delivery_fee: 0,
      default_b2b_price: null,
      default_b2c_price: null,
      discount_percentage: 0,
      is_active: true,
      coverage_areas: [''],
      description: ''
    });
    setShowZoneModal(true);
  };

  const handleEditZone = (zone: DeliveryZone) => {
    setEditingZone(zone);
    setZoneForm({
      name: zone.name,
      zone_type: zone.zone_type,
      delivery_fee: zone.delivery_fee,
      default_b2b_price: zone.default_b2b_price,
      default_b2c_price: zone.default_b2c_price,
      discount_percentage: zone.discount_percentage,
      is_active: zone.is_active,
      coverage_areas: Array.isArray(zone.coverage_areas) ? zone.coverage_areas : [''],
      description: zone.description || ''
    });
    setShowZoneModal(true);
  };

  const handleSaveZone = async () => {
    try {
      if (!createZone || !updateZone) {
        throw new Error('Zone management functions not available');
      }
      
      if (editingZone) {
        await updateZone(editingZone.id, zoneForm);
      } else {
        await createZone(zoneForm);
      }
      setShowZoneModal(false);
      await loadData();
    } catch (error) {
      console.error('Error saving zone:', error);
      setComponentError('Failed to save zone. Please try again.');
    }
  };

  const handleDeleteZone = async (zoneId: string) => {
    if (window.confirm('Are you sure you want to delete this zone? All product assignments will be removed.')) {
      try {
        if (!deleteZone) {
          throw new Error('Delete zone function not available');
        }
        
        await deleteZone(zoneId);
        await loadData();
      } catch (error) {
        console.error('Error deleting zone:', error);
        setComponentError('Failed to delete zone. Please try again.');
      }
    }
  };

  // Product assignment handlers
  const handleAddProductsToZone = (zone: DeliveryZone) => {
    try {
      setSelectedZone(zone);
      setSelectedProductsForAdd([]);
      setShowAddProductModal(true);
    } catch (error) {
      console.error('Error opening add products modal:', error);
      setComponentError('Failed to open product assignment dialog.');
    }
  };

  const handleSaveProductAssignments = async () => {
    if (!selectedZone || selectedProductsForAdd.length === 0) return;

    try {
      if (!assignProductsToZone) {
        throw new Error('Product assignment function not available');
      }
      
      const assignmentData = {
        product_ids: selectedProductsForAdd,
        zone_id: selectedZone.id,
        override_base_price: null,
        override_b2b_price: null,
        override_b2c_price: null,
        override_min_order_quantity: null,
        is_active: true,
        priority: 1
      };

      const success = await assignProductsToZone(assignmentData);
      if (success) {
        setShowAddProductModal(false);
        setSelectedProductsForAdd([]);
        setSelectedZone(null);
        await loadData();
      } else {
        throw new Error('Failed to assign products to zone');
      }
    } catch (error) {
      console.error('Error saving product assignments:', error);
      setComponentError('Failed to assign products to zone. Please try again.');
    }
  };

  // Pricing edit handlers
  const handleEditPrice = (assignmentId: string, currentData: ZoneProductView['products'][0]) => {
    try {
      setEditingAssignment(assignmentId);
      setEditFormData({
        effective_base_price: currentData.effective_base_price,
        effective_b2b_price: currentData.effective_b2b_price,
        effective_b2c_price: currentData.effective_b2c_price,
        is_active: currentData.is_active
      });
    } catch (error) {
      console.error('Error starting price edit:', error);
      setComponentError('Failed to start price editing.');
    }
  };

  const handleSavePriceEdit = async () => {
    if (!editingAssignment) return;

    try {
      if (!updateAssignment) {
        throw new Error('Update assignment function not available');
      }
      
      const success = await updateAssignment(editingAssignment, {
        override_base_price: editFormData.effective_base_price || null,
        override_b2b_price: editFormData.effective_b2b_price || null,
        override_b2c_price: editFormData.effective_b2c_price || null,
        override_min_order_quantity: null,
        is_active: editFormData.is_active ?? true,
        priority: 1
      });

      if (success) {
        setEditingAssignment(null);
        setEditFormData({});
        await loadData();
      } else {
        throw new Error('Failed to update price assignment');
      }
    } catch (error) {
      console.error('Error saving price edit:', error);
      setComponentError('Failed to update pricing. Please try again.');
    }
  };

  const handleRemoveProduct = async (assignmentId: string) => {
    if (window.confirm('Are you sure you want to remove this product from the zone?')) {
      try {
        if (!removeProductFromZone) {
          throw new Error('Remove product function not available');
        }
        
        const success = await removeProductFromZone(assignmentId);
        if (success) {
          await loadData();
        } else {
          throw new Error('Failed to remove product from zone');
        }
      } catch (error) {
        console.error('Error removing product from zone:', error);
        setComponentError('Failed to remove product from zone. Please try again.');
      }
    }
  };

  // Refresh data
  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await loadData();
    } catch (error) {
      console.error('Error refreshing data:', error);
      setComponentError('Failed to refresh data. Please try again.');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Get unassigned products for a zone - with safe checks
  const getUnassignedProducts = (zoneId: string) => {
    try {
      if (!Array.isArray(assignments) || !Array.isArray(products)) {
        return [];
      }
      
      const assignedProductIds = assignments
        .filter(a => a.zone_id === zoneId)
        .map(a => a.product_id);
      
      return products.filter(p => !assignedProductIds.includes(p.id));
    } catch (error) {
      console.error('Error getting unassigned products:', error);
      return [];
    }
  };

  // Filter zones based on search
  const filteredZones = zoneProductViews.filter(zoneView => {
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const matchesZone = zoneView.zone.name.toLowerCase().includes(searchLower);
      const matchesProduct = zoneView.products.some(p => 
        p.name.toLowerCase().includes(searchLower) || 
        p.sku.toLowerCase().includes(searchLower)
      );
      return matchesZone || matchesProduct;
    }
    return true;
  });

  // Error handling UI
  if (componentError || zonesError) {
    return (
      <div className="min-h-screen bg-secondary-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <Card className="p-8 bg-red-50 border-red-200">
              <div className="text-center">
                <X className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Product Pricing</h3>
                <p className="text-red-600 mb-4">
                  {componentError || zonesError || 'Unable to load pricing data. Please try again.'}
                </p>
                <button
                  onClick={() => {
                    setComponentError(null);
                    window.location.reload();
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Reload Page
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (loading || productsLoading || zonesLoading) {
    return (
      <div className="min-h-screen bg-secondary-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-6 w-6 animate-spin text-primary-600" />
              <span className="text-lg text-secondary-600">Loading zone pricing data...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold text-secondary-900">Zone-Based Product Pricing</h1>
              <p className="text-secondary-600 mt-2">
                Manage geographical zones and set zone-specific product pricing
              </p>
            </div>
            
            <button
              onClick={handleCreateZone}
              className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Add Zone</span>
            </button>
          </motion.div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <MapPin className="h-6 w-6 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">{zones.length}</span>
            </div>
            <p className="text-secondary-600">Total Zones</p>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Package className="h-6 w-6 text-green-600" />
              <span className="text-2xl font-bold text-green-600">{assignments.length}</span>
            </div>
            <p className="text-secondary-600">Product Assignments</p>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="h-6 w-6 text-yellow-600" />
              <span className="text-2xl font-bold text-yellow-600">
                ${zoneProductViews.reduce((sum, zoneView) => 
                  sum + zoneView.products.reduce((sum, product) => sum + product.effective_b2c_price, 0), 0
                ).toFixed(2)}
              </span>
            </div>
            <p className="text-secondary-600">Total Revenue Value</p>
          </Card>
        </div>

        {/* Controls */}
        <Card className="p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-400" />
                <input
                  type="text"
                  placeholder="Search zones or products..."
                  className="pl-10 pr-4 py-2 w-80 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center space-x-2 px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </Card>

        {/* Zone-Based Product Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary-50">
                <tr>
                  <th className="py-4 px-6 text-left font-medium text-secondary-600">
                    <div className="flex items-center space-x-2">
                      <span>Zone / Product</span>
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left font-medium text-secondary-600">
                    <div className="flex items-center space-x-2">
                      <span>SKU</span>
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left font-medium text-secondary-600">
                    <div className="flex items-center space-x-2">
                      <span>Base Price</span>
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left font-medium text-secondary-600">
                    <div className="flex items-center space-x-2">
                      <span>B2B Price</span>
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left font-medium text-secondary-600">
                    <div className="flex items-center space-x-2">
                      <span>B2C Price</span>
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left font-medium text-secondary-600">Status</th>
                  <th className="py-4 px-6 text-left font-medium text-secondary-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredZones.map((zoneView) => (
                  <React.Fragment key={zoneView.zone.id}>
                    {/* Zone Header Row */}
                    <tr className="bg-primary-50 border-b-2 border-primary-200">
                      <td className="py-4 px-6 font-bold text-primary-800" colSpan={5}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <MapPin className="h-5 w-5 text-primary-600" />
                            <span>{zoneView.zone.name}</span>
                            <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs">
                              {zoneView.zone.zone_type}
                            </span>
                            <span className="text-sm text-primary-600">
                              {zoneView.products.length} products
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleAddProductsToZone(zoneView.zone)}
                              className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                            >
                              <Plus className="h-4 w-4" />
                              <span>Add Products</span>
                            </button>
                            <button
                              onClick={() => handleEditZone(zoneView.zone)}
                              className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                            >
                              <Settings className="h-4 w-4" />
                              <span>Edit Zone</span>
                            </button>
                            <button
                              onClick={() => handleDeleteZone(zoneView.zone.id)}
                              className="flex items-center space-x-1 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6"></td>
                      <td className="py-4 px-6"></td>
                    </tr>
                    
                    {/* Product Rows */}
                    {zoneView.products.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 px-6 text-center text-secondary-500">
                          No products assigned to this zone.{' '}
                          <button
                            onClick={() => handleAddProductsToZone(zoneView.zone)}
                            className="text-primary-600 hover:text-primary-700 underline"
                          >
                            Add some products
                          </button>
                        </td>
                      </tr>
                    ) : (
                      zoneView.products.map((product) => (
                        <tr key={product.assignment_id} className="border-b border-secondary-100">
                          <td className="py-4 px-6 pl-12">
                            <div className="flex items-center space-x-2">
                              <Package className="h-4 w-4 text-secondary-400" />
                              <span className="font-medium">{product.name}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6">{product.sku}</td>
                          <td className="py-4 px-6">
                            {editingAssignment === product.assignment_id ? (
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400">$</span>
                                <input
                                  type="number"
                                  name="base_price"
                                  value={editFormData.effective_base_price || ''}
                                  onChange={(e) => setEditFormData({
                                    ...editFormData,
                                    effective_base_price: parseFloat(e.target.value) || 0
                                  })}
                                  className="pl-8 pr-4 py-1 w-24 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                  step="0.01"
                                />
                              </div>
                            ) : (
                              <span className="font-mono">${product.effective_base_price.toFixed(2)}</span>
                            )}
                          </td>
                          <td className="py-4 px-6">
                            {editingAssignment === product.assignment_id ? (
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400">$</span>
                                <input
                                  type="number"
                                  name="b2b_price"
                                  value={editFormData.effective_b2b_price || ''}
                                  onChange={(e) => setEditFormData({
                                    ...editFormData,
                                    effective_b2b_price: parseFloat(e.target.value) || 0
                                  })}
                                  className="pl-8 pr-4 py-1 w-24 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                  step="0.01"
                                />
                              </div>
                            ) : (
                              <span className="font-mono">${product.effective_b2b_price.toFixed(2)}</span>
                            )}
                          </td>
                          <td className="py-4 px-6">
                            {editingAssignment === product.assignment_id ? (
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400">$</span>
                                <input
                                  type="number"
                                  name="b2c_price"
                                  value={editFormData.effective_b2c_price || ''}
                                  onChange={(e) => setEditFormData({
                                    ...editFormData,
                                    effective_b2c_price: parseFloat(e.target.value) || 0
                                  })}
                                  className="pl-8 pr-4 py-1 w-24 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                  step="0.01"
                                />
                              </div>
                            ) : (
                              <span className="font-mono">${product.effective_b2c_price.toFixed(2)}</span>
                            )}
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-3 py-1 rounded-full text-xs ${
                              product.is_active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                            }`}>
                              {product.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            {editingAssignment === product.assignment_id ? (
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={handleSavePriceEdit}
                                  className="p-1 text-green-600 hover:bg-green-50 rounded"
                                >
                                  <Save className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => setEditingAssignment(null)}
                                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                                >
                                  <X className="h-5 w-5" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleEditPrice(product.assignment_id || '', product)}
                                  className="p-1 text-primary-600 hover:bg-primary-50 rounded"
                                >
                                  <Edit className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => handleRemoveProduct(product.assignment_id || '')}
                                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Zone Management Modal */}
        {showZoneModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">
                  {editingZone ? 'Edit Zone' : 'Create New Zone'}
                </h2>
                <button
                  onClick={() => setShowZoneModal(false)}
                  className="p-2 hover:bg-secondary-100 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={zoneForm.name}
                    onChange={(e) => setZoneForm({
                      ...zoneForm,
                      name: e.target.value
                    })}
                    className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Zone Type
                  </label>
                  <select
                    value={zoneForm.zone_type}
                    onChange={(e) => setZoneForm({
                      ...zoneForm,
                      zone_type: e.target.value as 'urban' | 'rural' | 'express'
                    })}
                    className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  >
                    <option value="urban">Urban</option>
                    <option value="rural">Rural</option>
                    <option value="express">Express</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Delivery Fee
                  </label>
                  <input
                    type="number"
                    value={zoneForm.delivery_fee || ''}
                    onChange={(e) => setZoneForm({
                      ...zoneForm,
                      delivery_fee: parseFloat(e.target.value) || 0
                    })}
                    className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Default B2B Price
                  </label>
                  <input
                    type="number"
                    value={zoneForm.default_b2b_price || ''}
                    onChange={(e) => setZoneForm({
                      ...zoneForm,
                      default_b2b_price: parseFloat(e.target.value) || null
                    })}
                    className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Default B2C Price
                  </label>
                  <input
                    type="number"
                    value={zoneForm.default_b2c_price || ''}
                    onChange={(e) => setZoneForm({
                      ...zoneForm,
                      default_b2c_price: parseFloat(e.target.value) || null
                    })}
                    className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Discount Percentage
                  </label>
                  <input
                    type="number"
                    value={zoneForm.discount_percentage || ''}
                    onChange={(e) => setZoneForm({
                      ...zoneForm,
                      discount_percentage: parseFloat(e.target.value) || 0
                    })}
                    className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Coverage Areas
                  </label>
                  <textarea
                    value={Array.isArray(zoneForm.coverage_areas) ? zoneForm.coverage_areas.join('\n') : ''}
                    onChange={(e) => setZoneForm({
                      ...zoneForm,
                      coverage_areas: e.target.value.split('\n').map(area => area.trim())
                    })}
                    className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={zoneForm.description || ''}
                    onChange={(e) => setZoneForm({
                      ...zoneForm,
                      description: e.target.value
                    })}
                    className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    rows={3}
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowZoneModal(false)}
                  className="px-4 py-2 text-secondary-700 hover:bg-secondary-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveZone}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Product Modal */}
        {showAddProductModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">
                  Add Products to Zone: {selectedZone?.name}
                </h2>
                <button
                  onClick={() => setShowAddProductModal(false)}
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
                    size={8}
                    value={selectedProductsForAdd}
                    onChange={(e) => {
                      const selected = Array.from(e.target.selectedOptions, option => option.value);
                      setSelectedProductsForAdd(selected);
                    }}
                    className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  >
                    {getUnassignedProducts(selectedZone?.id || '').map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} - {product.sku} (${(product.base_price || 0).toFixed(2)})
                      </option>
                    ))}
                  </select>
                  <p className="text-sm text-secondary-500 mt-1">
                    Hold Ctrl/Cmd to select multiple products
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 text-secondary-700 hover:bg-secondary-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProductAssignments}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  disabled={selectedProductsForAdd.length === 0}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPricing;