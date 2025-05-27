import React from 'react';
import { Settings, Link2 } from 'lucide-react';

const IntegrationsSettings = () => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="w-6 h-6" />
          Integrations Settings
        </h1>
        <p className="text-gray-600 mt-2">
          Manage your third-party integrations and API connections
        </p>
      </div>

      <div className="grid gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-4 mb-4">
            <Link2 className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Available Integrations</h2>
          </div>
          
          <div className="grid gap-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Payment Gateways</h3>
              <p className="text-gray-600 text-sm mb-4">
                Connect your preferred payment processing services
              </p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                Configure
              </button>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Shipping Providers</h3>
              <p className="text-gray-600 text-sm mb-4">
                Set up shipping carrier integrations
              </p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                Configure
              </button>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Marketing Tools</h3>
              <p className="text-gray-600 text-sm mb-4">
                Connect your email marketing and analytics platforms
              </p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                Configure
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">API Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Key
              </label>
              <div className="flex gap-2">
                <input
                  type="password"
                  value="••••••••••••••••"
                  readOnly
                  className="flex-1 border rounded-md px-3 py-2 bg-gray-50"
                />
                <button className="bg-gray-100 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors">
                  Regenerate
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Webhook URL
              </label>
              <input
                type="text"
                placeholder="https://your-domain.com/webhook"
                className="w-full border rounded-md px-3 py-2"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationsSettings;