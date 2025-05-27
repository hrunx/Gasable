import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Download,
  Printer,
  Search,
  Filter,
  Calendar,
  Plus,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Share2,
} from 'lucide-react';

interface Invoice {
  id: string;
  number: string;
  date: string;
  dueDate: string;
  customer: {
    name: string;
    type: 'B2B' | 'B2C';
  };
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
}

const mockInvoices: Invoice[] = [
  {
    id: '1',
    number: 'INV-2024-001',
    date: '2024-03-15',
    dueDate: '2024-04-14',
    customer: {
      name: 'Acme Industries',
      type: 'B2B',
    },
    amount: 2499.95,
    status: 'paid',
    items: [
      {
        description: 'Industrial Gas Tank',
        quantity: 5,
        unitPrice: 499.99,
        total: 2499.95,
      },
    ],
  },
  {
    id: '2',
    number: 'INV-2024-002',
    date: '2024-03-16',
    dueDate: '2024-04-15',
    customer: {
      name: 'John Smith',
      type: 'B2C',
    },
    amount: 199.98,
    status: 'pending',
    items: [
      {
        description: 'Premium Gas Cylinder',
        quantity: 2,
        unitPrice: 99.99,
        total: 199.98,
      },
    ],
  },
];

const Invoices = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);

  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return 'bg-green-50 text-green-700';
      case 'pending':
        return 'bg-yellow-50 text-yellow-700';
      case 'overdue':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const getStatusIcon = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'overdue':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900 mb-2">
              📄 Invoices
            </h1>
            <p className="text-secondary-600">
              Manage your invoices and billing documents
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="btn-primary flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Create Invoice</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-secondary-50 p-6 rounded-xl border border-secondary-100"
          >
            <div className="flex items-center justify-between mb-2">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-secondary-900">156</h3>
            <p className="text-secondary-600">Total Invoices</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-secondary-50 p-6 rounded-xl border border-secondary-100"
          >
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-secondary-900">124</h3>
            <p className="text-secondary-600">Paid Invoices</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-secondary-50 p-6 rounded-xl border border-secondary-100"
          >
            <div className="flex items-center justify-between mb-2">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <h3 className="text-2xl font-bold text-secondary-900">18</h3>
            <p className="text-secondary-600">Pending Invoices</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-secondary-50 p-6 rounded-xl border border-secondary-100"
          >
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-secondary-900">14</h3>
            <p className="text-secondary-600">Overdue Invoices</p>
          </motion.div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search invoices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>
            <button className="px-4 py-2 border border-secondary-200 rounded-lg hover:bg-secondary-50 flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Date Range</span>
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-secondary-100 rounded-lg text-secondary-600">
              <Filter className="h-5 w-5" />
            </button>
            <button className="p-2 hover:bg-secondary-100 rounded-lg text-secondary-600">
              <Download className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-xl shadow-sm border border-secondary-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-secondary-50">
                <th className="py-4 px-6 text-left font-medium text-secondary-600">Invoice #</th>
                <th className="py-4 px-6 text-left font-medium text-secondary-600">Customer</th>
                <th className="py-4 px-6 text-left font-medium text-secondary-600">Date</th>
                <th className="py-4 px-6 text-left font-medium text-secondary-600">Due Date</th>
                <th className="py-4 px-6 text-left font-medium text-secondary-600">Amount</th>
                <th className="py-4 px-6 text-left font-medium text-secondary-600">Status</th>
                <th className="py-4 px-6 text-left font-medium text-secondary-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockInvoices.map((invoice) => (
                <tr key={invoice.id} className="border-b border-secondary-100">
                  <td className="py-4 px-6 font-medium">{invoice.number}</td>
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-medium">{invoice.customer.name}</div>
                      <div className="text-sm text-secondary-600">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          invoice.customer.type === 'B2B'
                            ? 'bg-purple-50 text-purple-700'
                            : 'bg-blue-50 text-blue-700'
                        }`}>
                          {invoice.customer.type}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">{invoice.date}</td>
                  <td className="py-4 px-6">{invoice.dueDate}</td>
                  <td className="py-4 px-6 font-medium">
                    ${invoice.amount.toFixed(2)}
                  </td>
                  <td className="py-4 px-6">
                    <div className={`flex items-center space-x-2 ${getStatusColor(invoice.status)}`}>
                      {getStatusIcon(invoice.status)}
                      <span className="capitalize">{invoice.status}</span>
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
                        <Printer className="h-4 w-4" />
                      </button>
                      <button className="p-1 hover:bg-secondary-100 rounded text-secondary-600">
                        <Share2 className="h-4 w-4" />
                      </button>
                      <button className="p-1 hover:bg-secondary-100 rounded text-secondary-600">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-secondary-100 flex items-center justify-between">
          <div className="text-sm text-secondary-600">
            Showing 1 to {mockInvoices.length} of {mockInvoices.length} entries
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 border border-secondary-200 rounded hover:bg-secondary-50">
              Previous
            </button>
            <button className="px-3 py-1 bg-primary-600 text-white rounded">
              1
            </button>
            <button className="px-3 py-1 border border-secondary-200 rounded hover:bg-secondary-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoices;