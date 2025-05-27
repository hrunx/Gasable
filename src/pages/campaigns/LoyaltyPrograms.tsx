import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Award,
  Gift,
  Users,
  Star,
  Crown,
  TrendingUp,
  UserPlus,
  Settings,
  Plus,
  Edit,
  Trash2,
  ArrowRight,
  Save,
  X,
} from 'lucide-react';

const LoyaltyPrograms = () => {
  const [isCreateTierModal, setIsCreateTierModal] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  const loyaltyStats = [
    {
      title: 'Total Members',
      value: '2,648',
      trend: '+12.3%',
      icon: <Users className="h-6 w-6 text-blue-600" />,
    },
    {
      title: 'Points Issued',
      value: '156,789',
      trend: '+8.5%',
      icon: <Star className="h-6 w-6 text-yellow-600" />,
    },
    {
      title: 'Rewards Claimed',
      value: '1,234',
      trend: '+15.2%',
      icon: <Gift className="h-6 w-6 text-green-600" />,
    },
    {
      title: 'Referrals',
      value: '342',
      trend: '+5.8%',
      icon: <UserPlus className="h-6 w-6 text-purple-600" />,
    },
  ];

  const membershipTiers = [
    {
      name: 'Silver',
      icon: '🥈',
      minSpend: 1000,
      benefits: [
        'Basic support',
        '1% cashback',
        'Standard delivery',
      ],
      members: 1500,
    },
    {
      name: 'Gold',
      icon: '🥇',
      minSpend: 5000,
      benefits: [
        'Priority support',
        '2% cashback',
        'Free delivery',
        'Early access to deals',
      ],
      members: 850,
    },
    {
      name: 'Platinum',
      icon: '👑',
      minSpend: 10000,
      benefits: [
        'Dedicated account manager',
        '3% cashback',
        'Express delivery',
        'Exclusive deals',
        'Special events access',
      ],
      members: 298,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900 mb-2">
              👑 Loyalty & Rewards
            </h1>
            <p className="text-secondary-600">
              Manage your loyalty program tiers and rewards
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsCreateTierModal(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Create Tier</span>
            </button>
            <button className="px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6">
        {loyaltyStats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100"
          >
            <div className="flex items-center justify-between mb-2">
              {stat.icon}
              <span className="text-sm text-green-600">{stat.trend}</span>
            </div>
            <h3 className="text-2xl font-bold text-secondary-900">{stat.value}</h3>
            <p className="text-secondary-600">{stat.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Membership Tiers */}
      <div className="grid grid-cols-3 gap-6">
        {membershipTiers.map((tier, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-4xl">{tier.icon}</span>
                <div>
                  <h3 className="text-xl font-semibold">{tier.name}</h3>
                  <p className="text-sm text-secondary-600">
                    {tier.members.toLocaleString()} members
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-secondary-100 rounded-lg text-secondary-600">
                  <Edit className="h-5 w-5" />
                </button>
                <button className="p-2 hover:bg-secondary-100 rounded-lg text-secondary-600">
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="mb-4">
              <div className="text-sm text-secondary-600 mb-1">Minimum Spend</div>
              <div className="text-lg font-semibold">${tier.minSpend.toLocaleString()}</div>
            </div>

            <div>
              <div className="text-sm text-secondary-600 mb-2">Benefits</div>
              <ul className="space-y-2">
                {tier.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <Star className="h-4 w-4 text-yellow-400 mr-2" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Create Tier Modal */}
      {isCreateTierModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Create New Tier</h2>
              <button
                onClick={() => setIsCreateTierModal(false)}
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
                    Tier Name
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Enter tier name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Minimum Spend
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      className="input-field pl-8"
                      placeholder="Enter minimum spend"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400">
                      $
                    </span>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Benefits
                </label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      className="input-field flex-1"
                      placeholder="Add benefit"
                    />
                    <button
                      type="button"
                      className="p-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsCreateTierModal(false)}
                  className="px-4 py-2 text-secondary-700 hover:bg-secondary-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary px-4 py-2 flex items-center space-x-2"
                >
                  <Save className="h-5 w-5" />
                  <span>Create Tier</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default LoyaltyPrograms;