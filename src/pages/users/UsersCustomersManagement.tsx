import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  User,
  UserCog,
  Building2,
  Truck,
  Store,
  ShieldCheck,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Calendar,
  Download,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown,
  Star,
  Award,
  Briefcase,
  FileText,
  Lock,
  Key,
  UserPlus,
  Settings,
  Shield,
  Zap,
  MessageSquare,
  BarChart2,
  PieChart,
  Activity,
  Layers,
  Tag,
  Clipboard,
  ClipboardCheck,
  Upload,
  Save,
  X,
} from 'lucide-react';

// Define types for different user categories
interface BaseUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  createdAt: string;
  lastLogin?: string;
  avatar?: string;
}

interface InternalUser extends BaseUser {
  role: 'admin' | 'storekeeper' | 'driver' | 'employee';
  department?: string;
  position?: string;
  branch?: {
    id: string;
    name: string;
  };
  permissions: string[];
  documents?: {
    id: string;
    name: string;
    type: string;
    url: string;
    verified: boolean;
  }[];
  metrics?: {
    performance: number;
    attendance: number;
    tasks: {
      completed: number;
      pending: number;
    };
  };
}

interface DriverSpecific {
  license?: {
    number: string;
    expiry: string;
    type: string;
    verified: boolean;
  };
  vehicle?: {
    id: string;
    number: string;
    type: string;
  };
  deliveryMetrics?: {
    completed: number;
    onTime: number;
    rating: number;
  };
}

interface Customer extends BaseUser {
  type: 'corporate' | 'individual';
  company?: string;
  industry?: string;
  size?: 'small' | 'medium' | 'large' | 'enterprise';
  accountManager?: string;
  billingAddress?: string;
  shippingAddress?: string;
  creditLimit?: number;
  paymentTerms?: string;
  orders?: {
    total: number;
    lastOrder?: string;
    value: number;
  };
  contracts?: {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    status: 'active' | 'expired' | 'pending';
  }[];
  tags?: string[];
  loyaltyPoints?: number;
  satisfaction?: number;
}

// Mock data for internal users
const mockInternalUsers: (InternalUser & Partial<DriverSpecific>)[] = [
  {
    id: 'u1',
    name: 'Ahmed Al-Saud',
    email: 'ahmed@gasable.com',
    phone: '+966-123-456-789',
    role: 'admin',
    department: 'Operations',
    position: 'Operations Manager',
    status: 'active',
    permissions: ['dashboard', 'products', 'orders', 'users', 'reports', 'settings'],
    createdAt: '2023-05-15',
    lastLogin: '2024-04-07 09:30:00',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    metrics: {
      performance: 95,
      attendance: 98,
      tasks: {
        completed: 45,
        pending: 3,
      },
    },
  },
  {
    id: 'u2',
    name: 'Fatima Al-Zahrani',
    email: 'fatima@gasable.com',
    phone: '+966-123-456-790',
    role: 'admin',
    department: 'Finance',
    position: 'Finance Director',
    status: 'active',
    permissions: ['dashboard', 'finance', 'reports', 'settings'],
    createdAt: '2023-06-10',
    lastLogin: '2024-04-06 14:45:00',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    metrics: {
      performance: 97,
      attendance: 100,
      tasks: {
        completed: 38,
        pending: 2,
      },
    },
  },
  {
    id: 'u3',
    name: 'Mohammed Al-Harbi',
    email: 'mohammed@gasable.com',
    phone: '+966-123-456-791',
    role: 'storekeeper',
    department: 'Retail',
    position: 'Store Manager',
    branch: {
      id: 'b1',
      name: 'Riyadh Central Gas Station',
    },
    status: 'active',
    permissions: ['inventory', 'sales', 'customers'],
    createdAt: '2023-07-20',
    lastLogin: '2024-04-07 08:15:00',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    documents: [
      {
        id: 'd1',
        name: 'ID Card',
        type: 'identification',
        url: '#',
        verified: true,
      },
      {
        id: 'd2',
        name: 'Employment Contract',
        type: 'contract',
        url: '#',
        verified: true,
      },
    ],
    metrics: {
      performance: 92,
      attendance: 95,
      tasks: {
        completed: 120,
        pending: 5,
      },
    },
  },
  {
    id: 'u4',
    name: 'Khalid Al-Omar',
    email: 'khalid@gasable.com',
    phone: '+966-123-456-792',
    role: 'driver',
    department: 'Logistics',
    position: 'Senior Driver',
    status: 'active',
    permissions: ['deliveries'],
    createdAt: '2023-08-05',
    lastLogin: '2024-04-07 07:30:00',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    license: {
      number: 'DL-123456',
      expiry: '2025-08-05',
      type: 'Commercial',
      verified: true,
    },
    vehicle: {
      id: 'v1',
      number: 'TRK-001',
      type: 'Delivery Truck',
    },
    deliveryMetrics: {
      completed: 342,
      onTime: 330,
      rating: 4.8,
    },
    metrics: {
      performance: 96,
      attendance: 98,
      tasks: {
        completed: 342,
        pending: 0,
      },
    },
    documents: [
      {
        id: 'd3',
        name: 'Driver License',
        type: 'license',
        url: '#',
        verified: true,
      },
      {
        id: 'd4',
        name: 'Vehicle Insurance',
        type: 'insurance',
        url: '#',
        verified: true,
      },
    ],
  },
  {
    id: 'u5',
    name: 'Noura Al-Qahtani',
    email: 'noura@gasable.com',
    phone: '+966-123-456-793',
    role: 'employee',
    department: 'Customer Support',
    position: 'Support Specialist',
    status: 'active',
    permissions: ['tickets', 'customers'],
    createdAt: '2023-09-15',
    lastLogin: '2024-04-06 16:20:00',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    metrics: {
      performance: 94,
      attendance: 97,
      tasks: {
        completed: 215,
        pending: 8,
      },
    },
  },
  {
    id: 'u6',
    name: 'Ibrahim Al-Farsi',
    email: 'ibrahim@gasable.com',
    phone: '+966-123-456-794',
    role: 'storekeeper',
    department: 'Retail',
    position: 'Assistant Store Manager',
    branch: {
      id: 'b2',
      name: 'Jeddah Port LPG Center',
    },
    status: 'suspended',
    permissions: ['inventory', 'sales'],
    createdAt: '2023-10-01',
    lastLogin: '2024-03-25 10:15:00',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
    metrics: {
      performance: 75,
      attendance: 80,
      tasks: {
        completed: 95,
        pending: 12,
      },
    },
  },
];

// Mock data for customers
const mockCustomers: Customer[] = [
  {
    id: 'c1',
    name: 'Acme Industries',
    email: 'contact@acme.com',
    phone: '+966-123-456-795',
    type: 'corporate',
    company: 'Acme Industries Ltd.',
    industry: 'Manufacturing',
    size: 'large',
    accountManager: 'Ahmed Al-Saud',
    status: 'active',
    billingAddress: '123 Industrial Park, Riyadh',
    shippingAddress: '123 Industrial Park, Riyadh',
    creditLimit: 50000,
    paymentTerms: 'Net 30',
    createdAt: '2023-06-01',
    lastLogin: '2024-04-05 11:30:00',
    orders: {
      total: 45,
      lastOrder: '2024-04-02',
      value: 125000,
    },
    contracts: [
      {
        id: 'ct1',
        name: 'Annual Supply Agreement',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        status: 'active',
      },
    ],
    tags: ['VIP', 'Manufacturing', 'High Volume'],
    satisfaction: 4.8,
  },
  {
    id: 'c2',
    name: 'Green Energy Corp',
    email: 'info@greenenergy.com',
    phone: '+966-123-456-796',
    type: 'corporate',
    company: 'Green Energy Corporation',
    industry: 'Energy',
    size: 'enterprise',
    accountManager: 'Fatima Al-Zahrani',
    status: 'active',
    billingAddress: '456 Green Street, Jeddah',
    shippingAddress: '456 Green Street, Jeddah',
    creditLimit: 100000,
    paymentTerms: 'Net 45',
    createdAt: '2023-07-15',
    lastLogin: '2024-04-06 09:45:00',
    orders: {
      total: 38,
      lastOrder: '2024-04-05',
      value: 215000,
    },
    contracts: [
      {
        id: 'ct2',
        name: 'Strategic Partnership Agreement',
        startDate: '2024-01-01',
        endDate: '2026-12-31',
        status: 'active',
      },
    ],
    tags: ['VIP', 'Energy', 'Long-term'],
    satisfaction: 4.9,
  },
  {
    id: 'c3',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+966-123-456-797',
    type: 'individual',
    status: 'active',
    billingAddress: '789 Residential St, Riyadh',
    shippingAddress: '789 Residential St, Riyadh',
    createdAt: '2023-08-10',
    lastLogin: '2024-04-01 15:20:00',
    orders: {
      total: 5,
      lastOrder: '2024-03-28',
      value: 1250,
    },
    tags: ['Residential', 'Regular'],
    loyaltyPoints: 250,
    satisfaction: 4.5,
  },
  {
    id: 'c4',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+966-123-456-798',
    type: 'individual',
    status: 'active',
    billingAddress: '101 Apartment Complex, Dammam',
    shippingAddress: '101 Apartment Complex, Dammam',
    createdAt: '2023-09-05',
    lastLogin: '2024-04-04 18:10:00',
    orders: {
      total: 8,
      lastOrder: '2024-04-03',
      value: 1800,
    },
    tags: ['Residential', 'Frequent'],
    loyaltyPoints: 450,
    satisfaction: 4.7,
  },
  {
    id: 'c5',
    name: 'Tech Solutions LLC',
    email: 'contact@techsolutions.com',
    phone: '+966-123-456-799',
    type: 'corporate',
    company: 'Tech Solutions LLC',
    industry: 'Technology',
    size: 'medium',
    accountManager: 'Ahmed Al-Saud',
    status: 'inactive',
    billingAddress: '202 Tech Park, Riyadh',
    shippingAddress: '202 Tech Park, Riyadh',
    creditLimit: 25000,
    paymentTerms: 'Net 30',
    createdAt: '2023-10-20',
    lastLogin: '2024-02-15 10:30:00',
    orders: {
      total: 12,
      lastOrder: '2024-02-10',
      value: 18500,
    },
    tags: ['Technology', 'Seasonal'],
    satisfaction: 4.2,
  },
];

const UsersCustomersManagement = () => {
  // State for active tab and filters
  const [activeTab, setActiveTab] = useState<string>('internal-users');
  const [activeSubTab, setActiveSubTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState<boolean>(false);
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    position: '',
    branch: '',
  });

  // Handle refresh action
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  // Filter users based on active tab, subtab, and filters
  const getFilteredUsers = () => {
    let users: (InternalUser & Partial<DriverSpecific>)[] | Customer[] = [];
    
    if (activeTab === 'internal-users') {
      users = mockInternalUsers.filter(user => {
        // Filter by role if a specific subtab is selected
        if (activeSubTab !== 'all' && user.role !== activeSubTab) {
          return false;
        }
        
        // Filter by status
        if (filterStatus !== 'all' && user.status !== filterStatus) {
          return false;
        }
        
        // Filter by search query
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return (
            user.name.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query) ||
            user.phone.toLowerCase().includes(query) ||
            (user.position && user.position.toLowerCase().includes(query)) ||
            (user.department && user.department.toLowerCase().includes(query))
          );
        }
        
        return true;
      });
    } else if (activeTab === 'customers') {
      users = mockCustomers.filter(customer => {
        // Filter by customer type
        if (activeSubTab !== 'all' && customer.type !== activeSubTab) {
          return false;
        }
        
        // Filter by status
        if (filterStatus !== 'all' && customer.status !== filterStatus) {
          return false;
        }
        
        // Filter by search query
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return (
            customer.name.toLowerCase().includes(query) ||
            customer.email.toLowerCase().includes(query) ||
            customer.phone.toLowerCase().includes(query) ||
            (customer.company && customer.company.toLowerCase().includes(query))
          );
        }
        
        return true;
      });
    }
    
    return users;
  };

  const filteredUsers = getFilteredUsers();
  
  // Get the selected user details
  const getSelectedUserDetails = () => {
    if (!selectedUser) return null;
    
    if (activeTab === 'internal-users') {
      return mockInternalUsers.find(user => user.id === selectedUser);
    } else {
      return mockCustomers.find(customer => customer.id === selectedUser);
    }
  };
  
  const selectedUserDetails = getSelectedUserDetails();

  // Get status color based on status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-50';
      case 'inactive':
        return 'text-red-600 bg-red-50';
      case 'suspended':
        return 'text-yellow-600 bg-yellow-50';
      case 'pending':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  // Get status icon based on status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4" />;
      case 'inactive':
        return <XCircle className="h-4 w-4" />;
      case 'suspended':
        return <AlertCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  // Get role icon based on role
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <ShieldCheck className="h-5 w-5" />;
      case 'storekeeper':
        return <Store className="h-5 w-5" />;
      case 'driver':
        return <Truck className="h-5 w-5" />;
      case 'employee':
        return <Briefcase className="h-5 w-5" />;
      default:
        return <User className="h-5 w-5" />;
    }
  };

  // Get customer type icon
  const getCustomerTypeIcon = (type: string) => {
    switch (type) {
      case 'corporate':
        return <Building2 className="h-5 w-5" />;
      case 'individual':
        return <User className="h-5 w-5" />;
      default:
        return <User className="h-5 w-5" />;
    }
  };

  // Handle add user form submission
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Adding new user:', newUserData);
    setIsAddUserModalOpen(false);
    // Reset form
    setNewUserData({
      name: '',
      email: '',
      phone: '',
      role: '',
      department: '',
      position: '',
      branch: '',
    });
  };

  // Render internal users table
  const renderInternalUsersTable = () => {
    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-secondary-50">
              <th className="py-4 px-6 text-left font-medium text-secondary-600">User</th>
              <th className="py-4 px-6 text-left font-medium text-secondary-600">Role</th>
              <th className="py-4 px-6 text-left font-medium text-secondary-600">Department</th>
              <th className="py-4 px-6 text-left font-medium text-secondary-600">Contact</th>
              {activeSubTab === 'driver' && (
                <th className="py-4 px-6 text-left font-medium text-secondary-600">Vehicle</th>
              )}
              {activeSubTab === 'storekeeper' && (
                <th className="py-4 px-6 text-left font-medium text-secondary-600">Branch</th>
              )}
              <th className="py-4 px-6 text-left font-medium text-secondary-600">Performance</th>
              <th className="py-4 px-6 text-left font-medium text-secondary-600">Status</th>
              <th className="py-4 px-6 text-left font-medium text-secondary-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(filteredUsers as (InternalUser & Partial<DriverSpecific>)[]).map((user) => (
              <tr key={user.id} className="border-b border-secondary-100 hover:bg-secondary-50">
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                          {user.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-secondary-600">
                        Since {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-2">
                    {getRoleIcon(user.role)}
                    <span className="capitalize">{user.role}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div>
                    <div>{user.department || '-'}</div>
                    <div className="text-sm text-secondary-600">{user.position || '-'}</div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1">
                      <Mail className="h-4 w-4 text-secondary-400" />
                      <span className="text-sm">{user.email}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Phone className="h-4 w-4 text-secondary-400" />
                      <span className="text-sm">{user.phone}</span>
                    </div>
                  </div>
                </td>
                {activeSubTab === 'driver' && (
                  <td className="py-4 px-6">
                    {user.vehicle ? (
                      <div>
                        <div className="font-medium">{user.vehicle.number}</div>
                        <div className="text-sm text-secondary-600">{user.vehicle.type}</div>
                      </div>
                    ) : (
                      <span className="text-secondary-500">Not assigned</span>
                    )}
                  </td>
                )}
                {activeSubTab === 'storekeeper' && (
                  <td className="py-4 px-6">
                    {user.branch ? (
                      <div className="flex items-center space-x-1">
                        <Store className="h-4 w-4 text-secondary-400" />
                        <span>{user.branch.name}</span>
                      </div>
                    ) : (
                      <span className="text-secondary-500">Not assigned</span>
                    )}
                  </td>
                )}
                <td className="py-4 px-6">
                  {user.metrics ? (
                    <div className="flex items-center space-x-1">
                      <div className="w-16 bg-secondary-100 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-primary-500"
                          style={{ width: `${user.metrics.performance}%` }}
                        ></div>
                      </div>
                      <span>{user.metrics.performance}%</span>
                    </div>
                  ) : (
                    <span className="text-secondary-500">N/A</span>
                  )}
                </td>
                <td className="py-4 px-6">
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${getStatusColor(user.status)}`}>
                    {getStatusIcon(user.status)}
                    <span className="capitalize">{user.status}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => setSelectedUser(selectedUser === user.id ? null : user.id)}
                      className="p-1 hover:bg-secondary-100 rounded text-secondary-600"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-1 hover:bg-secondary-100 rounded text-secondary-600">
                      <Edit className="h-4 w-4" />
                    </button>
                    <div className="relative">
                      <button
                        onClick={() => setShowActionMenu(showActionMenu === user.id ? null : user.id)}
                        className="p-1 hover:bg-secondary-100 rounded text-secondary-600"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                      {showActionMenu === user.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-secondary-100 py-1 z-10">
                          <button
                            className="w-full px-4 py-2 text-left hover:bg-secondary-50 flex items-center space-x-2"
                            onClick={() => {/* Handle view details */}}
                          >
                            <Eye className="h-4 w-4" />
                            <span>View Details</span>
                          </button>
                          <button
                            className="w-full px-4 py-2 text-left hover:bg-secondary-50 flex items-center space-x-2"
                            onClick={() => {/* Handle edit */}}
                          >
                            <Edit className="h-4 w-4" />
                            <span>Edit User</span>
                          </button>
                          <button
                            className="w-full px-4 py-2 text-left hover:bg-secondary-50 flex items-center space-x-2"
                            onClick={() => {/* Handle reset password */}}
                          >
                            <Key className="h-4 w-4" />
                            <span>Reset Password</span>
                          </button>
                          <button
                            className="w-full px-4 py-2 text-left hover:bg-secondary-50 flex items-center space-x-2"
                            onClick={() => {/* Handle permissions */}}
                          >
                            <Shield className="h-4 w-4" />
                            <span>Manage Permissions</span>
                          </button>
                          <button
                            className="w-full px-4 py-2 text-left hover:bg-secondary-50 flex items-center space-x-2 text-red-600"
                            onClick={() => {/* Handle suspend/activate */}}
                          >
                            {user.status === 'active' ? (
                              <>
                                <XCircle className="h-4 w-4" />
                                <span>Suspend User</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle className="h-4 w-4" />
                                <span>Activate User</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Render customers table
  const renderCustomersTable = () => {
    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-secondary-50">
              <th className="py-4 px-6 text-left font-medium text-secondary-600">Customer</th>
              <th className="py-4 px-6 text-left font-medium text-secondary-600">Type</th>
              <th className="py-4 px-6 text-left font-medium text-secondary-600">Contact</th>
              <th className="py-4 px-6 text-left font-medium text-secondary-600">Orders</th>
              <th className="py-4 px-6 text-left font-medium text-secondary-600">Value</th>
              <th className="py-4 px-6 text-left font-medium text-secondary-600">Satisfaction</th>
              <th className="py-4 px-6 text-left font-medium text-secondary-600">Status</th>
              <th className="py-4 px-6 text-left font-medium text-secondary-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(filteredUsers as Customer[]).map((customer) => (
              <tr key={customer.id} className="border-b border-secondary-100 hover:bg-secondary-50">
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-sm text-secondary-600">
                        {customer.company || 'Individual Customer'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-2">
                    {getCustomerTypeIcon(customer.type)}
                    <span className="capitalize">{customer.type}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1">
                      <Mail className="h-4 w-4 text-secondary-400" />
                      <span className="text-sm">{customer.email}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Phone className="h-4 w-4 text-secondary-400" />
                      <span className="text-sm">{customer.phone}</span>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  {customer.orders ? (
                    <div>
                      <div className="font-medium">{customer.orders.total} orders</div>
                      <div className="text-sm text-secondary-600">
                        Last: {new Date(customer.orders.lastOrder || '').toLocaleDateString()}
                      </div>
                    </div>
                  ) : (
                    <span className="text-secondary-500">No orders</span>
                  )}
                </td>
                <td className="py-4 px-6">
                  {customer.orders ? (
                    <div className="font-medium">
                      SAR {customer.orders.value.toLocaleString()}
                    </div>
                  ) : (
                    <span className="text-secondary-500">N/A</span>
                  )}
                </td>
                <td className="py-4 px-6">
                  {customer.satisfaction ? (
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span>{customer.satisfaction.toFixed(1)}</span>
                    </div>
                  ) : (
                    <span className="text-secondary-500">N/A</span>
                  )}
                </td>
                <td className="py-4 px-6">
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${getStatusColor(customer.status)}`}>
                    {getStatusIcon(customer.status)}
                    <span className="capitalize">{customer.status}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedUser(selectedUser === customer.id ? null : customer.id)}
                      className="p-1 hover:bg-secondary-100 rounded text-secondary-600"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-1 hover:bg-secondary-100 rounded text-secondary-600">
                      <Edit className="h-4 w-4" />
                    </button>
                    <div className="relative">
                      <button
                        onClick={() => setShowActionMenu(showActionMenu === customer.id ? null : customer.id)}
                        className="p-1 hover:bg-secondary-100 rounded text-secondary-600"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                      {showActionMenu === customer.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-secondary-100 py-1 z-10">
                          <button
                            className="w-full px-4 py-2 text-left hover:bg-secondary-50 flex items-center space-x-2"
                            onClick={() => {/* Handle view details */}}
                          >
                            <Eye className="h-4 w-4" />
                            <span>View Details</span>
                          </button>
                          <button
                            className="w-full px-4 py-2 text-left hover:bg-secondary-50 flex items-center space-x-2"
                            onClick={() => {/* Handle edit */}}
                          >
                            <Edit className="h-4 w-4" />
                            <span>Edit Customer</span>
                          </button>
                          <button
                            className="w-full px-4 py-2 text-left hover:bg-secondary-50 flex items-center space-x-2"
                            onClick={() => {/* Handle orders */}}
                          >
                            <FileText className="h-4 w-4" />
                            <span>View Orders</span>
                          </button>
                          {customer.type === 'corporate' && (
                            <button
                              className="w-full px-4 py-2 text-left hover:bg-secondary-50 flex items-center space-x-2"
                              onClick={() => {/* Handle contracts */}}
                            >
                              <FileText className="h-4 w-4" />
                              <span>Manage Contracts</span>
                            </button>
                          )}
                          <button
                            className="w-full px-4 py-2 text-left hover:bg-secondary-50 flex items-center space-x-2 text-red-600"
                            onClick={() => {/* Handle status change */}}
                          >
                            {customer.status === 'active' ? (
                              <>
                                <XCircle className="h-4 w-4" />
                                <span>Deactivate</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle className="h-4 w-4" />
                                <span>Activate</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Users & Customers</h1>
          <p className="text-sm text-gray-500">Manage your organization's users and customers</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleRefresh}
            className={`p-2 text-gray-400 hover:text-gray-600 rounded-full ${
              isRefreshing ? 'animate-spin' : ''
            }`}
          >
            <RefreshCw className="h-5 w-5" />
          </button>
          <button
            onClick={() => setIsAddUserModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <Plus className="h-5 w-5" />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => {
                setActiveTab('internal-users');
                setActiveSubTab('all');
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'internal-users'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Internal Users</span>
              </div>
            </button>
            <button
              onClick={() => {
                setActiveTab('customers');
                setActiveSubTab('all');
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'customers'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Building2 className="h-5 w-5" />
                <span>Customers</span>
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Subtabs */}
      <div className="mb-6">
        <div className="flex space-x-4">
          {activeTab === 'internal-users' ? (
            <>
              <button
                onClick={() => setActiveSubTab('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeSubTab === 'all'
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                All Users
              </button>
              <button
                onClick={() => setActiveSubTab('admin')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeSubTab === 'admin'
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Admins
              </button>
              <button
                onClick={() => setActiveSubTab('storekeeper')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeSubTab === 'storekeeper'
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Storekeepers
              </button>
              <button
                onClick={() => setActiveSubTab('driver')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeSubTab === 'driver'
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Drivers
              </button>
              <button
                onClick={() => setActiveSubTab('employee')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeSubTab === 'employee'
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Employees
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveSubTab('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeSubTab === 'all'
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                All Customers
              </button>
              <button
                onClick={() => setActiveSubTab('corporate')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeSubTab === 'corporate'
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Corporate
              </button>
              <button
                onClick={() => setActiveSubTab('individual')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeSubTab === 'individual'
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Individual
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
            <option value="pending">Pending</option>
          </select>
          <ChevronDown className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
        {activeTab === 'internal-users' && (
          <div className="relative">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="storekeeper">Storekeeper</option>
              <option value="driver">Driver</option>
              <option value="employee">Employee</option>
            </select>
            <ChevronDown className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        )}
        {activeTab === 'customers' && (
          <div className="relative">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="corporate">Corporate</option>
              <option value="individual">Individual</option>
            </select>
            <ChevronDown className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow">
        {activeTab === 'internal-users' ? renderInternalUsersTable() : renderCustomersTable()}
      </div>

      {/* Add User Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add New User</h2>
              <button
                onClick={() => setIsAddUserModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddUser}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={newUserData.name}
                    onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newUserData.email}
                    onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={newUserData.phone}
                    onChange={(e) => setNewUserData({ ...newUserData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    value={newUserData.role}
                    onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Role</option>
                    <option value="admin">Admin</option>
                    <option value="storekeeper">Storekeeper</option>
                    <option value="driver">Driver</option>
                    <option value="employee">Employee</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={newUserData.department}
                    onChange={(e) => setNewUserData({ ...newUserData, department: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Position
                  </label>
                  <input
                    type="text"
                    value={newUserData.position}
                    onChange={(e) => setNewUserData({ ...newUserData, position: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                {newUserData.role === 'storekeeper' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Branch
                    </label>
                    <input
                      type="text"
                      value={newUserData.branch}
                      onChange={(e) => setNewUserData({ ...newUserData, branch: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                )}
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Details Sidebar */}
      {selectedUser && selectedUserDetails && (
        <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-lg border-l border-gray-200 overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">User Details</h2>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-6">
              {/* Profile Section */}
              <div>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden">
                    {'avatar' in selectedUserDetails && selectedUserDetails.avatar ? (
                      <img
                        src={selectedUserDetails.avatar}
                        alt={selectedUserDetails.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary-100 flex items-center justify-center text-primary-700 text-2xl font-bold">
                        {selectedUserDetails.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">{selectedUserDetails.name}</h3>
                    <p className="text-sm text-gray-500">
                      {'role' in selectedUserDetails ? (
                        <span className="capitalize">{selectedUserDetails.role}</span>
                      ) : (
                        <span className="capitalize">{selectedUserDetails.type} Customer</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div>
                <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${getStatusColor(selectedUserDetails.status)}`}>
                  {getStatusIcon(selectedUserDetails.status)}
                  <span className="capitalize">{selectedUserDetails.status}</span>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Contact Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>{selectedUserDetails.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{selectedUserDetails.phone}</span>
                  </div>
                </div>
              </div>

              {/* Role-specific Information */}
              {'role' in selectedUserDetails ? (
                <>
                  {/* Department & Position */}
                  {selectedUserDetails.department && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Department & Position</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Briefcase className="h-4 w-4 text-gray-400" />
                          <span>{selectedUserDetails.department}</span>
                        </div>
                        {selectedUserDetails.position && (
                          <div className="flex items-center space-x-2">
                            <UserCog className="h-4 w-4 text-gray-400" />
                            <span>{selectedUserDetails.position}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Performance Metrics */}
                  {selectedUserDetails.metrics && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Performance Metrics</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-sm text-gray-500">Performance</div>
                          <div className="text-lg font-medium">
                            {selectedUserDetails.metrics.performance}%
                          </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-sm text-gray-500">Attendance</div>
                          <div className="text-lg font-medium">
                            {selectedUserDetails.metrics.attendance}%
                          </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-sm text-gray-500">Completed Tasks</div>
                          <div className="text-lg font-medium">
                            {selectedUserDetails.metrics.tasks.completed}
                          </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-sm text-gray-500">Pending Tasks</div>
                          <div className="text-lg font-medium">
                            {selectedUserDetails.metrics.tasks.pending}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Driver-specific Information */}
                  {'license' in selectedUserDetails && selectedUserDetails.license && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Driver Information</h4>
                      <div className="space-y-4">
                        <div>
                          <div className="text-sm text-gray-500">License Details</div>
                          <div className="space-y-2 mt-1">
                            <div className="flex items-center space-x-2">
                              <FileText className="h-4 w-4 text-gray-400" />
                              <span>{selectedUserDetails.license.number}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span>Expires: {selectedUserDetails.license.expiry}</span>
                            </div>
                          </div>
                        </div>
                        {selectedUserDetails.vehicle && (
                          <div>
                            <div className="text-sm text-gray-500">Vehicle Information</div>
                            <div className="space-y-2 mt-1">
                              <div className="flex items-center space-x-2">
                                <Truck className="h-4 w-4 text-gray-400" />
                                <span>{selectedUserDetails.vehicle.number}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Tag className="h-4 w-4 text-gray-400" />
                                <span>{selectedUserDetails.vehicle.type}</span>
                              </div>
                            </div>
                          </div>
                        )}
                        {selectedUserDetails.deliveryMetrics && (
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <div className="text-sm text-gray-500">Completed Deliveries</div>
                              <div className="text-lg font-medium">
                                {selectedUserDetails.deliveryMetrics.completed}
                              </div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <div className="text-sm text-gray-500">On-time Rate</div>
                              <div className="text-lg font-medium">
                                {((selectedUserDetails.deliveryMetrics.onTime / selectedUserDetails.deliveryMetrics.completed) * 100).toFixed(1)}%
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Storekeeper-specific Information */}
                  {selectedUserDetails.role === 'storekeeper' && selectedUserDetails.branch && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Branch Information</h4>
                      <div className="flex items-center space-x-2">
                        <Store className="h-4 w-4 text-gray-400" />
                        <span>{selectedUserDetails.branch.name}</span>
                      </div>
                    </div>
                  )}

                  {/* Permissions */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Permissions</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedUserDetails.permissions.map((permission) => (
                        <span
                          key={permission}
                          className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm"
                        >
                          {permission}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Customer-specific Information */}
                  {selectedUserDetails.company && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Company Information</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Building2 className="h-4 w-4 text-gray-400" />
                          <span>{selectedUserDetails.company}</span>
                        </div>
                        {selectedUserDetails.industry && (
                          <div className="flex items-center space-x-2">
                            <Briefcase className="h-4 w-4 text-gray-400" />
                            <span>{selectedUserDetails.industry}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Order Information */}
                  {selectedUserDetails.orders && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Order Information</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-sm text-gray-500">Total Orders</div>
                          <div className="text-lg font-medium">
                            {selectedUserDetails.orders.total}
                          </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-sm text-gray-500">Total Value</div>
                          <div className="text-lg font-medium">
                            SAR {selectedUserDetails.orders.value.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Customer Satisfaction */}
                  {selectedUserDetails.satisfaction && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Customer Satisfaction</h4>
                      <div className="flex items-center space-x-2">
                        <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        <span className="text-lg font-medium">
                          {selectedUserDetails.satisfaction.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {selectedUserDetails.tags && selectedUserDetails.tags.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedUserDetails.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Account Information */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Account Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>Created: {new Date(selectedUserDetails.createdAt).toLocaleDateString()}</span>
                  </div>
                  {selectedUserDetails.lastLogin && (
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>Last Login: {new Date(selectedUserDetails.lastLogin).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col space-y-2">
                <button className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center justify-center space-x-2">
                  <Edit className="h-4 w-4" />
                  <span>Edit Details</span>
                </button>
                {'role' in selectedUserDetails ? (
                  <>
                    <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center space-x-2">
                      <Key className="h-4 w-4" />
                      <span>Reset Password</span>
                    </button>
                    <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center space-x-2">
                      <Shield className="h-4 w-4" />
                      <span>Manage Permissions</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <span>View Orders</span>
                    </button>
                    {selectedUserDetails.type === 'corporate' && (
                      <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center space-x-2">
                        <FileText className="h-4 w-4" />
                        <span>Manage Contracts</span>
                      </button>
                    )}
                  </>
                )}
                <button className="w-full px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 flex items-center justify-center space-x-2">
                  {selectedUserDetails.status === 'active' ? (
                    <>
                      <XCircle className="h-4 w-4" />
                      <span>{'role' in selectedUserDetails ? 'Suspend User' : 'Deactivate Customer'}</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      <span>{'role' in selectedUserDetails ? 'Activate User' : 'Activate Customer'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersCustomersManagement;