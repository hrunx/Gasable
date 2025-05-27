import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Lock,
  Bell,
  Globe,
  Zap,
  HelpCircle,
  MessageSquare,
  Shield,
  Key,
  Mail,
  Smartphone,
  Database,
  Link,
  Webhook,
  FileText,
  Book,
  Video,
  LifeBuoy,
  Send,
  Eye,
  EyeOff,
  Save,
  Plus,
} from 'lucide-react';

function Settings() {
  const [activeTab, setActiveTab] = useState('preferences');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: 'user@example.com',
    password: '',
    notifications: {
      email: true,
      push: true,
      orders: true,
      marketing: false,
    },
    apiKey: 'sk_test_123456789',
    webhookUrl: 'https://api.example.com/webhook',
  });

  const tabs = [
    { id: 'preferences', label: 'User Preferences', icon: <User className="h-5 w-5" /> },
    { id: 'security', label: 'Security', icon: <Shield className="h-5 w-5" /> },
    { id: 'integrations', label: 'API & Integrations', icon: <Zap className="h-5 w-5" /> },
    { id: 'support', label: 'Help & Support', icon: <HelpCircle className="h-5 w-5" /> },
  ];

  const renderPreferences = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option>English</option>
              <option>Arabic</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time Zone</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option>UTC+03:00 (Riyadh)</option>
              <option>UTC+00:00 (London)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Notification Preferences</h3>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.notifications.email}
              onChange={(e) => setFormData({
                ...formData,
                notifications: { ...formData.notifications, email: e.target.checked }
              })}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-gray-700">Email notifications</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.notifications.push}
              onChange={(e) => setFormData({
                ...formData,
                notifications: { ...formData.notifications, push: e.target.checked }
              })}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-gray-700">Push notifications</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.notifications.orders}
              onChange={(e) => setFormData({
                ...formData,
                notifications: { ...formData.notifications, orders: e.target.checked }
              })}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-gray-700">Order updates</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.notifications.marketing}
              onChange={(e) => setFormData({
                ...formData,
                notifications: { ...formData.notifications, marketing: e.target.checked }
              })}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-gray-700">Marketing communications</span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Password</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Two-Factor Authentication</h3>
        <div className="space-y-4">
          <p className="text-gray-600">Add an extra layer of security to your account by enabling two-factor authentication.</p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Enable 2FA
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Login History</h3>
        <div className="space-y-4">
          <div className="border-b border-gray-200 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Chrome on Windows</p>
                <p className="text-sm text-gray-500">Riyadh, Saudi Arabia</p>
              </div>
              <span className="text-sm text-gray-500">2 hours ago</span>
            </div>
          </div>
          <div className="border-b border-gray-200 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Safari on iPhone</p>
                <p className="text-sm text-gray-500">Jeddah, Saudi Arabia</p>
              </div>
              <span className="text-sm text-gray-500">Yesterday</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderIntegrations = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">API Keys</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Live API Key</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.apiKey}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Generate New Key
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Webhooks</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Webhook URL</label>
            <input
              type="url"
              value={formData.webhookUrl}
              onChange={(e) => setFormData({ ...formData, webhookUrl: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Events</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
                <span className="ml-2 text-gray-700">Order created</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
                <span className="ml-2 text-gray-700">Order status updated</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
                <span className="ml-2 text-gray-700">Payment received</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Connected Services</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Database className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium">ERP System</h4>
                <p className="text-sm text-gray-500">Connected</p>
              </div>
            </div>
            <button className="text-red-600 hover:text-red-700">Disconnect</button>
          </div>
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-purple-50 rounded-lg">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium">Accounting Software</h4>
                <p className="text-sm text-gray-500">Not connected</p>
              </div>
            </div>
            <button className="text-blue-600 hover:text-blue-700">Connect</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSupport = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Help Center</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <Book className="h-6 w-6 text-blue-600 mb-2" />
            <h4 className="font-medium mb-1">Documentation</h4>
            <p className="text-sm text-gray-500 mb-3">Browse our comprehensive guides and documentation</p>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View Docs →</button>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <Video className="h-6 w-6 text-green-600 mb-2" />
            <h4 className="font-medium mb-1">Video Tutorials</h4>
            <p className="text-sm text-gray-500 mb-3">Watch step-by-step tutorial videos</p>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Watch Now →</button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Support</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter subject"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32"
              placeholder="Describe your issue"
            ></textarea>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Send Message
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Support Tickets</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium">#1234 - Payment Integration Issue</h4>
              <p className="text-sm text-gray-500">Created 2 days ago</p>
            </div>
            <span className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-sm">In Progress</span>
          </div>
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium">#1233 - API Documentation Question</h4>
              <p className="text-sm text-gray-500">Created 5 days ago</p>
            </div>
            <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">Resolved</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <SettingsIcon className="w-8 h-8 text-gray-700" />
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        </div>

        <div className="flex space-x-8">
          {/* Sidebar */}
          <div className="w-64">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'preferences' && renderPreferences()}
            {activeTab === 'security' && renderSecurity()}
            {activeTab === 'integrations' && renderIntegrations()}
            {activeTab === 'support' && renderSupport()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;