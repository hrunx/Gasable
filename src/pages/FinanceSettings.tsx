import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  CreditCard,
  DollarSign,
  Save,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  FileText,
  Clock,
  Bell,
  Settings,
  Lock,
  Shield,
  RefreshCw,
  Download,
  Upload,
  HelpCircle,
  Info,
  Eye,
  EyeOff,
} from 'lucide-react';

interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountType: string;
  swiftCode: string;
  iban: string;
  isDefault: boolean;
  status: 'verified' | 'pending' | 'failed';
  lastVerified?: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  type: 'bank' | 'card' | 'wallet';
  isEnabled: boolean;
  processingFee: number;
  minAmount?: number;
  maxAmount?: number;
  supportedCurrencies: string[];
}

const FinanceSettings = () => {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([
    {
      id: '1',
      bankName: 'Saudi National Bank',
      accountNumber: '•••• •••• •••• 1234',
      accountType: 'Business',
      swiftCode: 'SNBKSAJE',
      iban: 'SA44 2000 0001 2345 6789 1234',
      isDefault: true,
      status: 'verified',
      lastVerified: '2024-03-15',
    },
    {
      id: '2',
      bankName: 'Al Rajhi Bank',
      accountNumber: '•••• •••• •••• 5678',
      accountType: 'Savings',
      swiftCode: 'RJHISARI',
      iban: 'SA03 8000 0000 6080 1016 7519',
      isDefault: false,
      status: 'pending',
    },
  ]);

  const [paymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      name: 'Bank Transfer',
      type: 'bank',
      isEnabled: true,
      processingFee: 0,
      supportedCurrencies: ['SAR', 'USD', 'EUR'],
    },
    {
      id: '2',
      name: 'Credit Card',
      type: 'card',
      isEnabled: true,
      processingFee: 2.5,
      minAmount: 10,
      maxAmount: 50000,
      supportedCurrencies: ['SAR', 'USD', 'EUR', 'GBP'],
    },
    {
      id: '3',
      name: 'Digital Wallet',
      type: 'wallet',
      isEnabled: false,
      processingFee: 1.5,
      supportedCurrencies: ['SAR', 'USD'],
    },
  ]);

  const [activeSection, setActiveSection] = useState('company');
  const [showSensitiveData, setShowSensitiveData] = useState(false);
  const [isAddingBank, setIsAddingBank] = useState(false);

  const [formData, setFormData] = useState({
    companyName: 'Acme Industries',
    taxId: 'TAX123456789',
    currency: 'SAR',
    paymentTerms: '30',
    invoicePrefix: 'INV',
    defaultTaxRate: '15',
    autoInvoice: true,
    notifyOnPayment: true,
    requirePO: true,
    allowPartialPayments: false,
    minimumPayment: '500',
    paymentWindow: '48',
    reminderDays: '7',
    lateFeePercentage: '2',
    twoFactorEnabled: true,
    securityAlerts: true,
    highValueThreshold: '10000',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSetDefaultAccount = (accountId: string) => {
    setBankAccounts(prev =>
      prev.map(account => ({
        ...account,
        isDefault: account.id === accountId,
      }))
    );
  };

  const handleRemoveAccount = (accountId: string) => {
    setBankAccounts(prev => prev.filter(account => account.id !== accountId));
  };

  const getStatusColor = (status: BankAccount['status']) => {
    switch (status) {
      case 'verified':
        return 'text-green-600 bg-green-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: BankAccount['status']) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Tabs */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900 mb-2">
              ⚙️ Finance Settings
            </h1>
            <p className="text-secondary-600">
              Configure your financial preferences and security settings
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="p-2 hover:bg-secondary-100 rounded-lg text-secondary-600">
              <HelpCircle className="h-5 w-5" />
            </button>
            <button className="btn-primary flex items-center space-x-2">
              <Save className="h-5 w-5" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 border-b border-secondary-100">
          {[
            { id: 'company', label: 'Company', icon: <Building2 className="h-4 w-4" /> },
            { id: 'banking', label: 'Banking', icon: <CreditCard className="h-4 w-4" /> },
            { id: 'billing', label: 'Billing', icon: <FileText className="h-4 w-4" /> },
            { id: 'security', label: 'Security', icon: <Shield className="h-4 w-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-t-lg transition-colors ${
                activeSection === tab.id
                  ? 'bg-primary-50 text-primary-600 border-b-2 border-primary-500'
                  : 'text-secondary-600 hover:text-secondary-900'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-4 rounded-xl shadow-sm border border-secondary-100"
        >
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="h-6 w-6 text-primary-600" />
            <span className="text-sm text-green-600">+2.5%</span>
          </div>
          <h3 className="text-2xl font-bold text-secondary-900">$45,678</h3>
          <p className="text-sm text-secondary-600">Monthly Revenue</p>
        </motion.div>
      </div>

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100"
        >
          {/* Render different sections based on activeSection */}
          {activeSection === 'banking' && (
            <div className="space-y-6">
              {/* Bank Accounts Section */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Bank Accounts</h2>
                <button
                  onClick={() => setIsAddingBank(true)}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Plus className="h-5 w-5" />
                  <span>Add Account</span>
                </button>
              </div>

              {/* Bank Account List */}
              <div className="space-y-4">
                {bankAccounts.map((account) => (
                  <motion.div
                    key={account.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl border border-secondary-200 hover:border-primary-200 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-secondary-600" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium">{account.bankName}</h3>
                            <span className={`px-2 py-0.5 rounded-full text-xs flex items-center space-x-1 ${getStatusColor(account.status)}`}>
                              {getStatusIcon(account.status)}
                              <span className="capitalize">{account.status}</span>
                            </span>
                          </div>
                          <p className="text-sm text-secondary-600">{account.accountNumber}</p>
                          <div className="flex items-center space-x-4 mt-1 text-xs text-secondary-500">
                            <span>SWIFT: {account.swiftCode}</span>
                            <span>IBAN: {account.iban}</span>
                            <span>{account.accountType}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        {account.isDefault ? (
                          <span className="flex items-center text-sm text-green-600">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Default
                          </span>
                        ) : (
                          <button
                            onClick={() => handleSetDefaultAccount(account.id)}
                            className="text-sm text-primary-600 hover:text-primary-700"
                          >
                            Set as Default
                          </button>
                        )}
                        <button
                          onClick={() => handleRemoveAccount(account.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Add Bank Modal */}
              <AnimatePresence>
                {isAddingBank && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                  >
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                      <h3 className="text-lg font-semibold mb-4">Add New Bank Account</h3>
                      {/* Add bank form would go here */}
                      <div className="flex justify-end space-x-3 mt-6">
                        <button
                          onClick={() => setIsAddingBank(false)}
                          className="px-4 py-2 text-secondary-700 hover:bg-secondary-100 rounded-lg"
                        >
                          Cancel
                        </button>
                        <button className="btn-primary">Add Account</button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default FinanceSettings;