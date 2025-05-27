import React, { useState } from 'react';
import {
  HelpCircle,
  Book,
  MessageSquare,
  FileText,
  Search,
  ChevronRight,
  ExternalLink,
  Send,
} from 'lucide-react';

const SupportCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const helpCategories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      description: 'Learn the basics of using the platform',
      articles: [
        'Platform Overview',
        'Account Setup Guide',
        'First Order Walkthrough',
      ],
    },
    {
      id: 'orders',
      title: 'Orders & Shipping',
      description: 'Managing orders and delivery',
      articles: [
        'Order Processing Guide',
        'Shipping Methods',
        'Tracking Orders',
      ],
    },
    {
      id: 'payments',
      title: 'Payments & Billing',
      description: 'Understanding payments and invoices',
      articles: [
        'Payment Methods',
        'Invoice Generation',
        'Refund Policy',
      ],
    },
    {
      id: 'technical',
      title: 'Technical Support',
      description: 'Technical issues and troubleshooting',
      articles: [
        'API Documentation',
        'Integration Guide',
        'Error Resolution',
      ],
    },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Support Center</h1>
        <p className="mt-2 text-gray-600">Find help and support for using the platform</p>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search for help articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
          <MessageSquare className="h-8 w-8 text-blue-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Contact Support</h3>
          <p className="text-gray-600 mb-4">Get help from our support team</p>
          <button className="flex items-center text-blue-600 hover:text-blue-700">
            Start Chat <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
        
        <div className="bg-purple-50 p-6 rounded-lg border border-purple-100">
          <Book className="h-8 w-8 text-purple-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Documentation</h3>
          <p className="text-gray-600 mb-4">Browse our technical documentation</p>
          <button className="flex items-center text-purple-600 hover:text-purple-700">
            View Docs <ExternalLink className="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>

      {/* Help Categories */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Help Categories</h2>
        <div className="grid grid-cols-2 gap-6">
          {helpCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className="text-left p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-semibold mb-2">{category.title}</h3>
              <p className="text-gray-600 mb-4">{category.description}</p>
              <ul className="space-y-2">
                {category.articles.map((article, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-500">
                    <FileText className="h-4 w-4 mr-2" />
                    {article}
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>
      </div>

      {/* Contact Form */}
      <div className="mt-12 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-6">Contact Support</h2>
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="What can we help you with?"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32"
              placeholder="Describe your issue..."
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Urgent</option>
            </select>
          </div>

          <button
            type="submit"
            className="flex items-center justify-center w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Send className="h-5 w-5 mr-2" />
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default SupportCenter;