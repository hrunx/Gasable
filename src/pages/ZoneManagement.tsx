import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Package,
  DollarSign,
  CheckCircle,
  X
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useProducts, Product } from '@/lib/hooks/useProducts';
import { useStores } from '@/lib/hooks/useStores';
import { 
  useZones, 
  DeliveryZone, 
  ProductZoneAssignment, 
  ZoneFormData, 
  AssignmentFormData 
} from '@/lib/hooks/useZones';

export default function ZoneManagement() {
  const { getProductsByCompany } = useProducts();
  const { stores } = useStores();
  const {
    zones,
    assignments,
    loading: zonesLoading,
    createZone,
    updateZone,
    deleteZone,
    assignProductsToZone,
    updateAssignment,
    removeProductFromZone,
    getZoneStats
  } = useZones();
  
  // State management
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedZone, setSelectedZone] = useState<DeliveryZone | null>(null);
  const [selectedStore, setSelectedStore] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'zones' | 'assignments'>('zones');
  const [loading, setLoading] = useState(false);
  
  // Modal states
  const [showZoneModal, setShowZoneModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showEditAssignmentModal, setShowEditAssignmentModal] = useState(false);
  const [editingZone, setEditingZone] = useState<DeliveryZone | null>(null);
  const [editingAssignment, setEditingAssignment] = useState<ProductZoneAssignment | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  // Zone form data
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

  // Assignment form data
  const [assignmentForm, setAssignmentForm] = useState<AssignmentFormData>({
    product_ids: [],
    zone_id: '',
    override_base_price: null,
    override_b2b_price: null,
    override_b2c_price: null,
    override_min_order_quantity: null,
    is_active: true,
    priority: 1
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const productsData = await getProductsByCompany();
      setProducts(productsData || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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
      coverage_areas: zone.coverage_areas || [''],
      description: zone.description || ''
    });
    setShowZoneModal(true);
  };

  const handleSaveZone = async () => {
    try {
      if (editingZone) {
        const result = await updateZone(editingZone.id, zoneForm);
        if (result) {
          console.log('Zone updated successfully');
        }
      } else {
        const result = await createZone(zoneForm);
        if (result) {
          console.log('Zone created successfully');
        }
      }
      setShowZoneModal(false);
    } catch (error) {
      console.error('Error saving zone:', error);
    }
  };

  const handleDeleteZone = async (zoneId: string) => {
    if (window.confirm('Are you sure you want to delete this zone? All product assignments will be removed.')) {
      try {
        const success = await deleteZone(zoneId);
        if (success) {
          console.log('Zone deleted successfully');
          if (selectedZone?.id === zoneId) {
            setSelectedZone(null);
          }
        }
      } catch (error) {
        console.error('Error deleting zone:', error);
      }
    }
  };

  const handleAssignProducts = () => {
    if (!selectedZone) return;
    
    setAssignmentForm({
      product_ids: [],
      zone_id: selectedZone.id,
      override_base_price: null,
      override_b2b_price: null,
      override_b2c_price: null,
      override_min_order_quantity: null,
      is_active: true,
      priority: 1
    });
    setSelectedProducts([]);
    setShowAssignmentModal(true);
  };

  const handleSaveAssignments = async () => {
    try {
      const formData = {
        ...assignmentForm,
        product_ids: selectedProducts
      };
      
      const success = await assignProductsToZone(formData);
      if (success) {
        console.log('Products assigned successfully');
        setShowAssignmentModal(false);
        setSelectedProducts([]);
      }
    } catch (error) {
      console.error('Error assigning products:', error);
    }
  };

  const handleEditAssignment = (assignment: ProductZoneAssignment) => {
    setEditingAssignment(assignment);
    setAssignmentForm({
      product_ids: [assignment.product_id],
      zone_id: assignment.zone_id,
      override_base_price: assignment.override_base_price,
      override_b2b_price: assignment.override_b2b_price,
      override_b2c_price: assignment.override_b2c_price,
      override_min_order_quantity: assignment.override_min_order_quantity,
      is_active: assignment.is_active,
      priority: assignment.priority
    });
    setShowEditAssignmentModal(true);
  };

  const handleUpdateAssignment = async () => {
    if (!editingAssignment) return;
    
    try {
      const success = await updateAssignment(editingAssignment.id, assignmentForm);
      if (success) {
        console.log('Assignment updated successfully');
        setShowEditAssignmentModal(false);
        setEditingAssignment(null);
      }
    } catch (error) {
      console.error('Error updating assignment:', error);
    }
  };

  const handleRemoveAssignment = async (assignmentId: string) => {
    if (window.confirm('Are you sure you want to remove this product from the zone?')) {
      try {
        const success = await removeProductFromZone(assignmentId);
        if (success) {
          console.log('Product removed from zone successfully');
        }
      } catch (error) {
        console.error('Error removing product from zone:', error);
      }
    }
  };

  // Calculate filtered products for assignment modal
  const filteredProducts = products.filter(product => {
    const matchesSearch = searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (product.category?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    // Check if product is already assigned to selected zone
    const isAssigned = selectedZone ? 
      assignments.some(a => a.product_id === product.id && a.zone_id === selectedZone.id) : 
      false;
    
    return matchesSearch && !isAssigned;
  });

  // Get zone statistics
  const stats = getZoneStats();

  const getZoneTypeColor = (type: string) => {
    switch (type) {
      case 'urban': return 'bg-blue-100 text-blue-700';
      case 'suburban': return 'bg-green-100 text-green-700';
      case 'rural': return 'bg-yellow-100 text-yellow-700';
      case 'express': return 'bg-red-100 text-red-700';
      case 'economy': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-100 text-green-700' 
      : 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Zone Management</h1>
          <p className="text-secondary-600 mt-1">
            Manage delivery zones and assign products with custom pricing
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            onClick={handleCreateZone}
            className="bg-primary-600 hover:bg-primary-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Zone
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <MapPin className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-600">Total Zones</p>
                <p className="text-2xl font-bold text-secondary-900">{stats.totalZones}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-600">Active Zones</p>
                <p className="text-2xl font-bold text-secondary-900">{stats.activeZones}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-600">Product Assignments</p>
                <p className="text-2xl font-bold text-secondary-900">{stats.totalAssignments}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-600">Avg Delivery Fee</p>
                <p className="text-2xl font-bold text-secondary-900">${stats.avgDeliveryFee.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-secondary-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('zones')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'zones'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
            }`}
          >
            <MapPin className="w-4 h-4 inline mr-2" />
            Delivery Zones
          </button>
          <button
            onClick={() => setActiveTab('assignments')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'assignments'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
            }`}
          >
            <Package className="w-4 h-4 inline mr-2" />
            Product Assignments
          </button>
        </nav>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-4 h-4" />
            <input
              type="text"
              placeholder={activeTab === 'zones' ? 'Search zones...' : 'Search products...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          {stores && stores.length > 1 && (
            <select
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value)}
              className="px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Stores</option>
              {stores.map(store => (
                <option key={store.id} value={store.id}>{store.name}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'zones' ? (
        /* Zones Tab Content */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Zones List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Delivery Zones</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  </div>
                ) : zones.length === 0 ? (
                  <div className="text-center py-8">
                    <MapPin className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-secondary-900 mb-2">No zones created</h3>
                    <p className="text-secondary-600 mb-4">Create your first delivery zone to start assigning products.</p>
                    <Button onClick={handleCreateZone}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Zone
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {zones.map((zone) => (
                      <div
                        key={zone.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          selectedZone?.id === zone.id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-secondary-200 hover:border-secondary-300'
                        }`}
                        onClick={() => setSelectedZone(zone)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <MapPin className="w-5 h-5 text-secondary-400" />
                            <div>
                              <h3 className="font-medium text-secondary-900">{zone.name}</h3>
                              <p className="text-sm text-secondary-600">{zone.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded ${getZoneTypeColor(zone.zone_type)}`}>
                              {zone.zone_type}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(zone.is_active)}`}>
                              {zone.is_active ? 'Active' : 'Inactive'}
                            </span>
                            <div className="flex items-center space-x-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditZone(zone);
                                }}
                              >
                                <Edit3 className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteZone(zone.id);
                                }}
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-secondary-500">Delivery Fee:</span>
                            <span className="font-medium ml-1">${zone.delivery_fee.toFixed(2)}</span>
                          </div>
                          <div>
                            <span className="text-secondary-500">Coverage:</span>
                            <span className="font-medium ml-1">{zone.coverage_areas?.length || 0} areas</span>
                          </div>
                          <div>
                            <span className="text-secondary-500">Discount:</span>
                            <span className="font-medium ml-1">{zone.discount_percentage}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Zone Details */}
          {selectedZone && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Zone Details
                    <Button
                      onClick={handleAssignProducts}
                      size="sm"
                      className="bg-primary-600 hover:bg-primary-700"
                    >
                      <Package className="w-4 h-4 mr-2" />
                      Assign Products
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-secondary-600">Zone Name</label>
                    <p className="text-secondary-900">{selectedZone.name}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-secondary-600">Type</label>
                      <p className="text-secondary-900 capitalize">{selectedZone.zone_type}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-secondary-600">Status</label>
                      <p className={`capitalize ${selectedZone.is_active ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedZone.is_active ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-secondary-600">Delivery Fee</label>
                    <p className="text-secondary-900">${selectedZone.delivery_fee.toFixed(2)}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-secondary-600">Default B2B Price</label>
                      <p className="text-secondary-900">
                        {selectedZone.default_b2b_price ? `$${selectedZone.default_b2b_price.toFixed(2)}` : 'Not set'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-secondary-600">Default B2C Price</label>
                      <p className="text-secondary-900">
                        {selectedZone.default_b2c_price ? `$${selectedZone.default_b2c_price.toFixed(2)}` : 'Not set'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-secondary-600">Discount Percentage</label>
                    <p className="text-secondary-900">{selectedZone.discount_percentage}%</p>
                  </div>

                  {selectedZone.coverage_areas && selectedZone.coverage_areas.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-secondary-600">Coverage Areas</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedZone.coverage_areas.map((area, index) => (
                          <span key={index} className="px-2 py-1 bg-secondary-100 text-secondary-700 text-sm rounded">
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium text-secondary-600">Description</label>
                    <p className="text-secondary-900">{selectedZone.description || 'No description'}</p>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="text-sm text-secondary-600">
                      <p>Created: {new Date(selectedZone.created_at).toLocaleDateString()}</p>
                      <p>Updated: {new Date(selectedZone.updated_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Products assigned to this zone */}
              <Card>
                <CardHeader>
                  <CardTitle>Assigned Products</CardTitle>
                </CardHeader>
                <CardContent>
                  {assignments.filter(a => a.zone_id === selectedZone.id).length === 0 ? (
                    <div className="text-center py-6">
                      <Package className="w-8 h-8 text-secondary-400 mx-auto mb-2" />
                      <p className="text-secondary-600">No products assigned to this zone</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {assignments
                        .filter(a => a.zone_id === selectedZone.id)
                        .map((assignment) => (
                          <div key={assignment.id} className="border border-secondary-200 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium text-secondary-900">
                                  {assignment.product?.name || 'Unknown Product'}
                                </h4>
                                <p className="text-sm text-secondary-600">
                                  SKU: {assignment.product?.sku || 'N/A'} • {assignment.product?.category || 'N/A'}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-secondary-600">Effective Price</p>
                                <p className="font-medium text-secondary-900">
                                  ${(assignment.override_base_price || assignment.product?.base_price || 0).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      ) : (
        /* Product Assignments Tab Content */
        <Card>
          <CardHeader>
            <CardTitle>Product Zone Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : assignments.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-secondary-900 mb-2">No product assignments</h3>
                <p className="text-secondary-600 mb-4">Start by creating zones and assigning products to them.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {assignments.map((assignment) => (
                  <div key={assignment.id} className="border border-secondary-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Package className="w-5 h-5 text-secondary-400" />
                        <div>
                          <h3 className="font-medium text-secondary-900">
                            {assignment.product?.name || 'Unknown Product'}
                          </h3>
                          <p className="text-sm text-secondary-600">
                            SKU: {assignment.product?.sku || 'N/A'} • {assignment.product?.category || 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm text-secondary-600">Zone</p>
                          <p className="font-medium text-secondary-900">{assignment.zone?.name || 'Unknown Zone'}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-secondary-600">Effective Price</p>
                          <p className="font-medium text-secondary-900">
                            ${(assignment.override_base_price || assignment.product?.base_price || 0).toFixed(2)}
                          </p>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleEditAssignment(assignment)}
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleRemoveAssignment(assignment.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Zone Creation/Edit Modal */}
      {showZoneModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-secondary-900">
                {editingZone ? 'Edit Zone' : 'Create New Zone'}
              </h2>
              <Button
                variant="ghost"
                onClick={() => setShowZoneModal(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Zone Name *
                  </label>
                  <input
                    type="text"
                    value={zoneForm.name}
                    onChange={(e) => setZoneForm({ ...zoneForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Downtown Delivery Zone"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Zone Type *
                  </label>
                  <select
                    value={zoneForm.zone_type}
                    onChange={(e) => setZoneForm({ ...zoneForm, zone_type: e.target.value as DeliveryZone['zone_type'] })}
                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="urban">Urban</option>
                    <option value="suburban">Suburban</option>
                    <option value="rural">Rural</option>
                    <option value="express">Express</option>
                    <option value="economy">Economy</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Description
                </label>
                <textarea
                  value={zoneForm.description}
                  onChange={(e) => setZoneForm({ ...zoneForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Describe the zone coverage and special requirements..."
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Delivery Fee ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={zoneForm.delivery_fee}
                    onChange={(e) => setZoneForm({ ...zoneForm, delivery_fee: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Default B2B Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={zoneForm.default_b2b_price || ''}
                    onChange={(e) => setZoneForm({ ...zoneForm, default_b2b_price: e.target.value ? parseFloat(e.target.value) : null })}
                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Default B2C Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={zoneForm.default_b2c_price || ''}
                    onChange={(e) => setZoneForm({ ...zoneForm, default_b2c_price: e.target.value ? parseFloat(e.target.value) : null })}
                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Discount Percentage (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={zoneForm.discount_percentage}
                  onChange={(e) => setZoneForm({ ...zoneForm, discount_percentage: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Coverage Areas
                </label>
                <div className="space-y-2">
                  {zoneForm.coverage_areas.map((area, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={area}
                        onChange={(e) => {
                          const newAreas = [...zoneForm.coverage_areas];
                          newAreas[index] = e.target.value;
                          setZoneForm({ ...zoneForm, coverage_areas: newAreas });
                        }}
                        className="flex-1 px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                        placeholder="Area name or postal code"
                      />
                      {zoneForm.coverage_areas.length > 1 && (
                        <Button
                          variant="ghost"
                          onClick={() => {
                            const newAreas = zoneForm.coverage_areas.filter((_, i) => i !== index);
                            setZoneForm({ ...zoneForm, coverage_areas: newAreas });
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    variant="ghost"
                    onClick={() => setZoneForm({ ...zoneForm, coverage_areas: [...zoneForm.coverage_areas, ''] })}
                    className="text-primary-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Area
                  </Button>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={zoneForm.is_active}
                  onChange={(e) => setZoneForm({ ...zoneForm, is_active: e.target.checked })}
                  className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                />
                <label className="ml-2 text-sm text-secondary-700">Zone is active</label>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-8">
              <Button
                variant="ghost"
                onClick={() => setShowZoneModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveZone}
                className="bg-primary-600 hover:bg-primary-700"
              >
                {editingZone ? 'Update Zone' : 'Create Zone'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Product Assignment Modal */}
      {showAssignmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-secondary-900">
                Assign Products to Zone
              </h2>
              <Button
                variant="ghost"
                onClick={() => setShowAssignmentModal(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Product Selection */}
              <div>
                <h3 className="text-lg font-medium text-secondary-900 mb-4">Select Products</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredProducts.map((product: Product) => (
                    <div
                      key={product.id}
                      className={`border rounded-lg p-3 cursor-pointer ${
                        selectedProducts.includes(product.id)
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-secondary-200 hover:border-secondary-300'
                      }`}
                      onClick={() => {
                        if (selectedProducts.includes(product.id)) {
                          setSelectedProducts(selectedProducts.filter(id => id !== product.id));
                        } else {
                          setSelectedProducts([...selectedProducts, product.id]);
                        }
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-secondary-900">{product.name}</h4>
                          <p className="text-sm text-secondary-600">
                            SKU: {product.sku} • {product.category}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-secondary-600">Default Price</p>
                          <p className="font-medium text-secondary-900">
                            ${product.base_price?.toFixed(2) || '0.00'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing Overrides */}
              <div>
                <h3 className="text-lg font-medium text-secondary-900 mb-4">Pricing Overrides</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Override Base Price ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={assignmentForm.override_base_price || ''}
                      onChange={(e) => setAssignmentForm({ 
                        ...assignmentForm, 
                        override_base_price: e.target.value ? parseFloat(e.target.value) : null 
                      })}
                      className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="Leave empty to use product default"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Override B2B Price ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={assignmentForm.override_b2b_price || ''}
                      onChange={(e) => setAssignmentForm({ 
                        ...assignmentForm, 
                        override_b2b_price: e.target.value ? parseFloat(e.target.value) : null 
                      })}
                      className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="Leave empty to use product default"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Override B2C Price ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={assignmentForm.override_b2c_price || ''}
                      onChange={(e) => setAssignmentForm({ 
                        ...assignmentForm, 
                        override_b2c_price: e.target.value ? parseFloat(e.target.value) : null 
                      })}
                      className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="Leave empty to use product default"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Override Min Order Quantity
                    </label>
                    <input
                      type="number"
                      value={assignmentForm.override_min_order_quantity || ''}
                      onChange={(e) => setAssignmentForm({ 
                        ...assignmentForm, 
                        override_min_order_quantity: e.target.value ? parseInt(e.target.value) : null 
                      })}
                      className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="Leave empty to use product default"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Priority (1-10)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={assignmentForm.priority}
                      onChange={(e) => setAssignmentForm({ 
                        ...assignmentForm, 
                        priority: parseInt(e.target.value) || 1 
                      })}
                      className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={assignmentForm.is_active}
                      onChange={(e) => setAssignmentForm({ ...assignmentForm, is_active: e.target.checked })}
                      className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                    />
                    <label className="ml-2 text-sm text-secondary-700">Assignment is active</label>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Selected Products</h4>
                  <p className="text-sm text-blue-800">
                    {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''} selected
                  </p>
                  {selectedProducts.length > 0 && (
                    <p className="text-xs text-blue-700 mt-1">
                      The pricing overrides above will be applied to all selected products.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-8">
              <Button
                variant="ghost"
                onClick={() => setShowAssignmentModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveAssignments}
                disabled={selectedProducts.length === 0}
                className="bg-primary-600 hover:bg-primary-700"
              >
                Assign {selectedProducts.length} Product{selectedProducts.length !== 1 ? 's' : ''}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 