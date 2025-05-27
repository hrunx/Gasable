import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Tag,
  Calendar,
  Clock,
  Plus,
  Percent,
  DollarSign,
  Users,
  Target,
  Package,
  Store,
  ArrowRight,
  Save,
  X,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  AlertCircle,
  XCircle,
} from 'lucide-react';

interface SpecialOffer {
  id: string;
  name: string;
  type: 'bundle' | 'combo' | 'bogo' | 'gift';
  status: 'active' | 'scheduled' | 'ended' | 'draft';
  startDate: string;
  endDate: string;
  description: string;
  terms: string;
  products: string[];
  discount: {
    type: 'percentage' | 'fixed' | 'free_item';
    value: number | string;
  };
  target: {
    type: 'all' | 'b2b' | 'b2c';
    minPurchase?: number;
  };
  redemptions: number;
  revenue: number;
}

const SpecialOffers = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<string | null>(null);

  const offerTypes = [
    {
      id: 'bundle',
      name: 'Bundle Deal',
      icon: <Package className="h-6 w-6" />,
      description: 'Combine multiple products at a special price',
    },
    {
      id: 'combo',
      name: 'Combo Offer',
      icon: <Tag className="h-6 w-6" />,
      description: 'Create product combinations with discounts',
    },
    {
      id: 'bogo',
      name: 'Buy One Get One',
      icon: <DollarSign className="h-6 w-6" />,
      description: 'Buy one product and get another free or discounted',
    },
    {
      id: 'gift',
      name: 'Free Gift',
      icon: <Package className="h-6 w-6" />,
      description: 'Offer free items with qualifying purchases',
    },
  ];

  const mockOffers: SpecialOffer[] = [
    {
      id: '1',
      name: 'Industrial Bundle',
      type: 'bundle',
      status: 'active',
      startDate: '2024-03-15',
      endDate: '2024-04-15',
      description: 'Complete industrial gas setup at a special price',
      terms: 'While stocks last. Cannot be combined with other offers.',
      products: ['Industrial Gas Tank', 'Safety Valve', 'Pressure Gauge'],
      discount: {
        type: 'percentage',
        value: 25,
      },
      target: {
        type: 'b2b',
        minPurchase: 5000,
      },
      redemptions: 45,
      revenue: 225000,
    },
    {
      id: '2',
      name: 'Safety Kit Bundle',
      type: 'combo',
      status: 'scheduled',
      startDate: '2024-04-01',
      endDate: '2024-04-30',
      description: 'Essential safety equipment package',
      terms: 'Limited to 2 per customer. T&C apply.',
      products: ['Safety Gloves', 'Safety Goggles', 'Hard Hat'],
      discount: {
        type: 'fixed',
        value: 100,
      },
      target: {
        type: 'all',
      },
      redemptions: 0,
      revenue: 0,
    },
  ];

  const getStatusColor = (status: SpecialOffer['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-50 text-green-700';
      case 'scheduled':
        return 'bg-blue-50 text-blue-700';
      case 'ended':
        return 'bg-gray-50 text-gray-700';
      case 'draft':
        return 'bg-yellow-50 text-yellow-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const getStatusIcon = (status: SpecialOffer['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4" />;
      case 'scheduled':
        return <Clock className="h-4 w-4" />;
      case 'ended':
        return <XCircle className="h-4 w-4" />;
      case 'draft':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900 mb-2">
              🏷️ Special Offers
            </h1>
            <p className="text-secondary-600">
              Create and manage special product bundles and combo deals
            </p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Create Offer</span>
          </button>
        </div>
      </div>

      {/* Offer Types */}
      <div className="grid grid-cols-4 gap-6">
        {offerTypes.map((type) => (
          <motion.div
            key={type.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100 hover:border-primary-200 transition-all cursor-pointer"
            onClick={() => setIsCreateModalOpen(true)}
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

      {/* Active Offers */}
      <div className="bg-white rounded-xl shadow-sm border border-secondary-100">
        <div className="p-6 border-b border-secondary-100">
          <h2 className="text-lg font-semibold text-secondary-900">Active Special Offers</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-secondary-50">
                <th className="py-4 px-6 text-left font-medium text-secondary-600">Offer</th>
                <th className="py-4 px-6 text-left font-medium text-secondary-600">Type</th>
                <th className="py-4 px-6 text-left font-medium text-secondary-600">Products</th>
                <th className="py-4 px-6 text-left font-medium text-secondary-600">Discount</th>
                <th className="py-4 px-6 text-left font-medium text-secondary-600">Target</th>
                <th className="py-4 px-6 text-left font-medium text-secondary-600">Performance</th>
                <th className="py-4 px-6 text-left font-medium text-secondary-600">Status</th>
                <th className="py-4 px-6 text-left font-medium text-secondary-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockOffers.map((offer) => (
                <tr key={offer.id} className="border-b border-secondary-100">
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-medium">{offer.name}</div>
                      <div className="text-sm text-secondary-600">
                        {offer.startDate} - {offer.endDate}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="capitalize">{offer.type.replace('_', ' ')}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      {offer.products.map((product, index) => (
                        <div key={index} className="text-sm">
                          {product}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {offer.discount.type === 'percentage' ? (
                      <span>{offer.discount.value}% off</span>
                    ) : offer.discount.type === 'fixed' ? (
                      <span>${offer.discount.value} off</span>
                    ) : (
                      <span>Free {offer.discount.value}</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        offer.target.type === 'b2b'
                          ? 'bg-purple-50 text-purple-700'
                          : offer.target.type === 'b2c'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-gray-50 text-gray-700'
                      }`}>
                        {offer.target.type.toUpperCase()}
                      </span>
                      {offer.target.minPurchase && (
                        <div className="text-sm text-secondary-600 mt-1">
                          Min. ${offer.target.minPurchase}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {offer.status === 'active' && (
                      <div>
                        <div className="font-medium">
                          ${offer.revenue.toLocaleString()}
                        </div>
                        <div className="text-sm text-secondary-600">
                          {offer.redemptions} redemptions
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${getStatusColor(offer.status)}`}>
                      {getStatusIcon(offer.status)}
                      <span className="capitalize">{offer.status}</span>
                    </div>
                  </td>
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
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Offer Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Create Special Offer</h2>
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
                    Offer Name
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Enter offer name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Offer Type
                  </label>
                  <select className="input-field">
                    <option value="">Select type</option>
                    {offerTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Products */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Products
                </label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <select className="input-field flex-1">
                      <option value="">Select product</option>
                      <option value="1">Industrial Gas Tank</option>
                      <option value="2">Safety Valve</option>
                      <option value="3">Pressure Gauge</option>
                    </select>
                    <button
                      type="button"
                      className="p-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Discount */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Discount Type
                  </label>
                  <select className="input-field">
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                    <option value="free_item">Free Item</option>
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
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400">
                      %
                    </span>
                  </div>
                </div>
              </div>

              {/* Target */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Target Audience
                  </label>
                  <select className="input-field">
                    <option value="all">All Customers</option>
                    <option value="b2b">B2B Only</option>
                    <option value="b2c">B2C Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Minimum Purchase
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      className="input-field pl-8"
                      placeholder="Enter amount"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400">
                      $
                    </span>
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
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="datetime-local"
                    className="input-field"
                  />
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
                    placeholder="Enter offer description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Terms & Conditions
                  </label>
                  <textarea
                    className="input-field h-24"
                    placeholder="Enter terms and conditions"
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
                  <span>Create Offer</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SpecialOffers;