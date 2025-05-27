import React from 'react';
import { ArrowLeft, Download, Filter } from 'lucide-react';

const AccountStatement = () => {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-semibold">Account Statement</h1>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Date Range</label>
              <select className="w-full border rounded-lg p-2">
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>This year</option>
                <option>Custom range</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Account</label>
              <select className="w-full border rounded-lg p-2">
                <option>All accounts</option>
                <option>Main account</option>
                <option>Savings account</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Transaction Type</label>
              <select className="w-full border rounded-lg p-2">
                <option>All transactions</option>
                <option>Deposits</option>
                <option>Withdrawals</option>
                <option>Transfers</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Example transactions - in a real app, this would be mapped from actual data */}
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2024-01-15</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Payment from Customer XYZ</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className="px-2 py-1 text-green-700 bg-green-100 rounded-full">Deposit</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+$1,500.00</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$5,200.00</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2024-01-14</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Supplier Payment</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className="px-2 py-1 text-red-700 bg-red-100 rounded-full">Withdrawal</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">-$800.00</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$3,700.00</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing 1 to 2 of 2 entries
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50" disabled>
                Previous
              </button>
              <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50" disabled>
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountStatement;