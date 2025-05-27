import React from 'react';
import { Shield, Key, Smartphone, History, Bell } from 'lucide-react';

const SecuritySettings = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Security Settings</h1>
        <p className="mt-2 text-gray-600">Manage your account security preferences and settings</p>
      </div>

      <div className="space-y-6">
        {/* Password Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-4 mb-4">
            <Key className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Password</h2>
          </div>
          <p className="text-gray-600 mb-4">Last changed 30 days ago</p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Change Password
          </button>
        </div>

        {/* Two-Factor Authentication */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-4 mb-4">
            <Smartphone className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Two-Factor Authentication</h2>
          </div>
          <p className="text-gray-600 mb-4">Add an extra layer of security to your account</p>
          <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
            Enable 2FA
          </button>
        </div>

        {/* Login History */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-4 mb-4">
            <History className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Login History</h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <div>
                <p className="font-medium">Chrome on Windows</p>
                <p className="text-sm text-gray-500">Los Angeles, USA</p>
              </div>
              <p className="text-sm text-gray-500">Just now</p>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <div>
                <p className="font-medium">Safari on iPhone</p>
                <p className="text-sm text-gray-500">San Francisco, USA</p>
              </div>
              <p className="text-sm text-gray-500">Yesterday</p>
            </div>
          </div>
        </div>

        {/* Security Notifications */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-4 mb-4">
            <Bell className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Security Notifications</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email notifications for new login</p>
                <p className="text-sm text-gray-500">Get notified when a new device logs into your account</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">SMS notifications for suspicious activity</p>
                <p className="text-sm text-gray-500">Receive SMS alerts for unusual account activity</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Active Sessions */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-4 mb-4">
            <Shield className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Active Sessions</h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <div>
                <p className="font-medium">Current Session</p>
                <p className="text-sm text-gray-500">Chrome on Windows • Los Angeles, USA</p>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-800">This Device</button>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <div>
                <p className="font-medium">Active Session</p>
                <p className="text-sm text-gray-500">Safari on iPhone • San Francisco, USA</p>
              </div>
              <button className="text-sm text-red-600 hover:text-red-800">Revoke Access</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;