import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle,
  ArrowRight,
  Globe,
  Users,
  Share2,
  Settings,
  Rocket,
  Bell,
  Zap,
  ShoppingBag,
  BarChart2,
} from 'lucide-react';
import ProductSetupProgress from '../components/ProductSetupProgress';

const GoLive = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      icon: <Globe className="h-6 w-6" />,
      title: 'View Store',
      description: 'See your live store front',
      link: '/store',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Invite Team',
      description: 'Add team members',
      link: '/settings/team',
      color: 'bg-purple-50 text-purple-600',
    },
    {
      icon: <Share2 className="h-6 w-6" />,
      title: 'Share Store',
      description: 'Promote your business',
      link: '/marketing',
      color: 'bg-pink-50 text-pink-600',
    },
    {
      icon: <Settings className="h-6 w-6" />,
      title: 'Settings',
      description: 'Configure preferences',
      link: '/settings',
      color: 'bg-gray-50 text-gray-600',
    },
  ];

  const nextSteps = [
    {
      icon: <Bell className="h-10 w-10 text-primary-600" />,
      title: 'Enable Notifications',
      description: 'Stay updated with order alerts and customer messages',
      action: 'Configure',
      link: '/settings/notifications',
    },
    {
      icon: <Zap className="h-10 w-10 text-amber-600" />,
      title: 'Set Up Analytics',
      description: 'Track your store performance and customer insights',
      action: 'Set Up',
      link: '/analytics/setup',
    },
    {
      icon: <ShoppingBag className="h-10 w-10 text-green-600" />,
      title: 'Create First Promotion',
      description: 'Launch an offer to attract customers',
      action: 'Create',
      link: '/marketing/promotions/new',
    },
  ];

  const stats = [
    { label: 'Products Listed', value: '12' },
    { label: 'Delivery Zones', value: '5' },
    { label: 'Fleet Size', value: '3' },
    { label: 'Store Rating', value: '5.0' },
  ];

  return (
    <div className="space-y-6">
      {/* Setup Progress */}
      <ProductSetupProgress currentStep={4} currentSubStep="" />

      {/* Success Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-xl shadow-sm border border-secondary-100 text-center"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-50 rounded-full mb-6">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-secondary-900 mb-3">
          🎉 Congratulations! Your Store is Now Live
        </h1>
        <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
          Your energy store is now active on the Gasable marketplace. Get ready to serve customers and grow your business!
        </p>
      </motion.div>

      {/* Store Stats */}
      <div className="grid grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100"
          >
            <h3 className="text-3xl font-bold text-secondary-900 mb-1">{stat.value}</h3>
            <p className="text-secondary-600">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <h2 className="text-xl font-semibold text-secondary-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => navigate(action.link)}
              className="p-6 rounded-xl border border-secondary-100 hover:border-primary-200 transition-all text-left group"
            >
              <div className={`inline-flex p-3 rounded-lg ${action.color} mb-4`}>
                {action.icon}
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-1 group-hover:text-primary-600">
                {action.title}
              </h3>
              <p className="text-sm text-secondary-600">{action.description}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <h2 className="text-xl font-semibold text-secondary-900 mb-6">Recommended Next Steps</h2>
        <div className="space-y-4">
          {nextSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-6 rounded-xl bg-secondary-50 border border-secondary-100"
            >
              <div className="flex items-center space-x-6">
                <div className="p-3 bg-white rounded-xl shadow-sm">
                  {step.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900 mb-1">{step.title}</h3>
                  <p className="text-secondary-600">{step.description}</p>
                </div>
              </div>
              <button
                onClick={() => navigate(step.link)}
                className="flex items-center space-x-2 px-4 py-2 bg-white text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
              >
                <span>{step.action}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Performance Preview */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-secondary-900">Performance Dashboard</h2>
            <p className="text-secondary-600">Track your store's performance metrics</p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
          >
            <span>View Full Dashboard</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <div className="aspect-[21/9] bg-secondary-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart2 className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
            <p className="text-secondary-600">Your performance metrics will appear here</p>
          </div>
        </div>
      </div>

      {/* Support Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-8 rounded-xl text-white">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Need Help Getting Started?</h2>
            <p className="text-primary-100">Our support team is here to help you succeed</p>
          </div>
          <div className="space-x-4">
            <button className="px-6 py-3 bg-white text-primary-600 rounded-lg hover:bg-primary-50 transition-colors">
              View Help Center
            </button>
            <button className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-400 transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoLive;