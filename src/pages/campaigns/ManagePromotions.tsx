import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Gift,
  Calendar,
  Clock,
  Plus,
  Tag,
  Percent,
  DollarSign,
  Users,
  Target,
  Globe,
  Package,
  Store,
  ArrowRight,
  Save,
  X,
} from 'lucide-react';

const ManagePromotions = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    discountType: 'percentage',
    discountValue: '',
    startDate: '',
    endDate: '',
    targetType: '',
    targetValue: '',
    description: '',
    terms: '',
  });

  const promotionTypes = [
    {
      id: 'flash_sale',
      name: 'Flash Sale',
      icon: <Clock className="h-6 w-6" />,
      description: 'Time-limited deep discounts to drive urgency',
    },
    {
      id: 'volume_discount',
      name: 'Volume Discount',
      icon: <Package className="h-6 w-6" />,
      description: 'Bulk purchase incentives for B2B customers',
    },
    {
      id: 'seasonal',
      name: 'Seasonal Promotion',
      icon: <Calendar className="h-6 w-6" />,
      description: 'Holiday and seasonal special offers',
    },
    {
      id: 'new_customer',
      name: 'New Customer',
      icon: <Users className="h-6 w-6" />,
      description: 'Welcome discounts for first-time buyers',
    },
  ];

  const targetTypes = [
    { id: 'all', name: 'All Products', icon: <Globe /> },
    { id: 'product', name: 'Specific Product', icon: <Package /> },
    { id: 'category', name: 'Product Category', icon: <Tag /> },
    { id: 'store', name: 'Store-Wide', icon: <Store /> },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900 mb-2">
              🎯 Manage Promotions
            </h1>
            <p className="text-secondary-600">
              Create and manage promotional campaigns to boost sales
            </p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Create Promotion</span>
          </button>
        </div>
      </div>

      {/* Promotion Types */}
      <div className="grid grid-cols-4 gap-6">
        {promotionTypes.map((type) => (
          <motion.div
            key={type.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100 hover:border-primary-200 transition-all cursor-pointer"
            onClick={() => {
              setFormData(prev => ({ ...prev, type: type.id }));
              setIsCreateModalOpen(true);
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-primary-50 text-primary-600 rounded-lg">
                {type.icon}
              </div>
              <ArrowRight className="h-5 w-5 text-secondary-400" />
            </div>
            <h3 className="font-semibold text-secondary-900 mb-2">{type.name}</h3>
            <p className="text-sm text-secondary-600">{type.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Create Promotion Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Create New Promotion</h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 hover:bg-secondary-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form className="space-y-6">
              {/* Basic Details */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Promotion Name
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Enter promotion name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Promotion Type
                  </label>
                  <select
                    className="input-field"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="">Select type</option>
                    {promotionTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Discount Details */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Discount Type
                    </label>
                    <select
                      className="input-field"
                      value={formData.discountType}
                      onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Discount Value
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        className="input-field pl-8"
                        placeholder="Enter value"
                        value={formData.discountValue}
                        onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400">
                        {formData.discountType === 'percentage' ? '%' : '$'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="datetime-local"
                    className="input-field"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="datetime-local"
                    className="input-field"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>

              {/* Target Selection */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Target Type
                </label>
                <div className="grid grid-cols-4 gap-4">
                  {targetTypes.map((target) => (
                    <button
                      key={target.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, targetType: target.id })}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.targetType === target.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-secondary-200 hover:border-primary-200'
                      }`}
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className={`mb-2 ${
                          formData.targetType === target.id
                            ? 'text-primary-600'
                            : 'text-secondary-600'
                        }`}>
                          {target.icon}
                        </div>
                        <span className="text-sm font-medium">{target.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Description and Terms */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Description
                  </label>
                  <textarea
                    className="input-field h-24"
                    placeholder="Enter promotion description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Terms & Conditions
                  </label>
                  <textarea
                    className="input-field h-24"
                    placeholder="Enter terms and conditions"
                    value={formData.terms}
                    onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-secondary-700 hover:bg-secondary-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary px-4 py-2 flex items-center space-x-2"
                >
                  <Save className="h-5 w-5" />
                  <span>Create Promotion</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ManagePromotions;