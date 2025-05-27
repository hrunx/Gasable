import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Ticket,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  Plus,
  Calendar,
  Download,
  RefreshCw,
  MessageSquare,
  User,
  Tag,
  ChevronDown,
  ArrowUpDown,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  XCircle,
  Save,
  PieChart,
  BarChart2,
  TrendingUp,
  TrendingDown,
  HelpCircle,
  FileText,
  Send,
  Paperclip,
  ArrowRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';

interface TicketCategory {
  id: string;
  name: string;
  description: string;
  color: string;
}

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  assignee?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  responseTime?: number; // in minutes
  resolutionTime?: number; // in minutes
  messages: {
    id: string;
    sender: string;
    senderType: 'customer' | 'support' | 'system';
    message: string;
    timestamp: string;
    attachments?: string[];
  }[];
}

const mockCategories: TicketCategory[] = [
  {
    id: '1',
    name: 'Technical Issue',
    description: 'Problems with the platform functionality',
    color: '#0EA5E9', // blue
  },
  {
    id: '2',
    name: 'Billing',
    description: 'Questions about invoices and payments',
    color: '#8B5CF6', // purple
  },
  {
    id: '3',
    name: 'Account',
    description: 'Account setup and access issues',
    color: '#10B981', // green
  },
  {
    id: '4',
    name: 'Product',
    description: 'Questions about product listings and details',
    color: '#F59E0B', // amber
  },
  {
    id: '5',
    name: 'Shipping',
    description: 'Delivery and logistics inquiries',
    color: '#EC4899', // pink
  },
  {
    id: '6',
    name: 'Feature Request',
    description: 'Suggestions for new features',
    color: '#6366F1', // indigo
  },
];

const mockTickets: Ticket[] = [
  {
    id: 'TKT-001',
    title: 'Cannot update product price',
    description: 'When trying to update the price of my product, I get an error message saying "Operation failed".',
    status: 'open',
    priority: 'high',
    category: '1',
    assignee: 'Sarah Johnson',
    createdBy: 'Ahmed Al-Saud',
    createdAt: '2024-03-19T10:30:00Z',
    updatedAt: '2024-03-19T10:30:00Z',
    responseTime: 0,
    messages: [
      {
        id: 'm1',
        sender: 'Ahmed Al-Saud',
        senderType: 'customer',
        message: 'When trying to update the price of my product, I get an error message saying "Operation failed". This is urgent as we need to update prices for a promotion.',
        timestamp: '2024-03-19T10:30:00Z',
      },
    ],
  },
  {
    id: 'TKT-002',
    title: 'Invoice discrepancy',
    description: 'The invoice #INV-2024-005 shows incorrect amount. It should be $1,250 but shows $1,500.',
    status: 'in_progress',
    priority: 'medium',
    category: '2',
    assignee: 'Mohammed Khalid',
    createdBy: 'Sarah Al-Omar',
    createdAt: '2024-03-18T14:15:00Z',
    updatedAt: '2024-03-19T09:20:00Z',
    responseTime: 45,
    messages: [
      {
        id: 'm1',
        sender: 'Sarah Al-Omar',
        senderType: 'customer',
        message: 'The invoice #INV-2024-005 shows incorrect amount. It should be $1,250 but shows $1,500.',
        timestamp: '2024-03-18T14:15:00Z',
      },
      {
        id: 'm2',
        sender: 'Mohammed Khalid',
        senderType: 'support',
        message: 'Thank you for reporting this issue. I am checking the invoice details and will get back to you shortly.',
        timestamp: '2024-03-18T15:00:00Z',
      },
      {
        id: 'm3',
        sender: 'Sarah Al-Omar',
        senderType: 'customer',
        message: 'Thank you. Please let me know when this is resolved.',
        timestamp: '2024-03-18T15:10:00Z',
      },
    ],
  },
  {
    id: 'TKT-003',
    title: 'Need help with IoT integration',
    description: 'I am trying to connect my IoT devices but facing connectivity issues.',
    status: 'resolved',
    priority: 'medium',
    category: '1',
    assignee: 'Ali Hassan',
    createdBy: 'Khalid Al-Fahad',
    createdAt: '2024-03-17T09:45:00Z',
    updatedAt: '2024-03-18T11:30:00Z',
    resolvedAt: '2024-03-18T11:30:00Z',
    responseTime: 30,
    resolutionTime: 1545, // 25 hours and 45 minutes
    messages: [
      {
        id: 'm1',
        sender: 'Khalid Al-Fahad',
        senderType: 'customer',
        message: 'I am trying to connect my IoT devices but facing connectivity issues. The devices are showing offline in the dashboard.',
        timestamp: '2024-03-17T09:45:00Z',
      },
      {
        id: 'm2',
        sender: 'Ali Hassan',
        senderType: 'support',
        message: 'I will help you with this. Could you please provide the device IDs and the error messages you are seeing?',
        timestamp: '2024-03-17T10:15:00Z',
      },
      {
        id: 'm3',
        sender: 'Khalid Al-Fahad',
        senderType: 'customer',
        message: 'Device IDs: IOT-123, IOT-124. Error: "Connection timeout"',
        timestamp: '2024-03-17T10:30:00Z',
      },
      {
        id: 'm4',
        sender: 'Ali Hassan',
        senderType: 'support',
        message: 'Thank you. I checked the devices and found that there was a configuration issue. I have fixed it from our end. Please try reconnecting now.',
        timestamp: '2024-03-18T11:00:00Z',
      },
      {
        id: 'm5',
        sender: 'Khalid Al-Fahad',
        senderType: 'customer',
        message: 'It works now! Thank you for your help.',
        timestamp: '2024-03-18T11:20:00Z',
      },
      {
        id: 'm6',
        sender: 'Ali Hassan',
        senderType: 'support',
        message: 'Great! I am closing this ticket now. Please feel free to reach out if you need any further assistance.',
        timestamp: '2024-03-18T11:30:00Z',
      },
    ],
  },
  {
    id: 'TKT-004',
    title: 'Request for new delivery zone',
    description: 'We would like to add a new delivery zone for the Eastern Province.',
    status: 'closed',
    priority: 'low',
    category: '5',
    assignee: 'Fatima Al-Zahrani',
    createdBy: 'Omar Al-Rashid',
    createdAt: '2024-03-15T13:20:00Z',
    updatedAt: '2024-03-16T15:45:00Z',
    resolvedAt: '2024-03-16T15:45:00Z',
    responseTime: 60,
    resolutionTime: 1585, // 26 hours and 25 minutes
    messages: [
      {
        id: 'm1',
        sender: 'Omar Al-Rashid',
        senderType: 'customer',
        message: 'We would like to add a new delivery zone for the Eastern Province. Our business is expanding there.',
        timestamp: '2024-03-15T13:20:00Z',
      },
      {
        id: 'm2',
        sender: 'Fatima Al-Zahrani',
        senderType: 'support',
        message: 'Thank you for your request. I will check the requirements and get back to you.',
        timestamp: '2024-03-15T14:20:00Z',
      },
      {
        id: 'm3',
        sender: 'Fatima Al-Zahrani',
        senderType: 'support',
        message: 'I have added the Eastern Province as a delivery zone to your account. You can now set up delivery options for this zone.',
        timestamp: '2024-03-16T15:30:00Z',
      },
      {
        id: 'm4',
        sender: 'Omar Al-Rashid',
        senderType: 'customer',
        message: 'Thank you! This is exactly what we needed.',
        timestamp: '2024-03-16T15:40:00Z',
      },
      {
        id: 'm5',
        sender: 'System',
        senderType: 'system',
        message: 'This ticket has been closed.',
        timestamp: '2024-03-16T15:45:00Z',
      },
    ],
  },
];

const TicketingSystem = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [isCreateTicketModalOpen, setIsCreateTicketModalOpen] = useState(false);
  const [newTicketData, setNewTicketData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: '',
  });
  const [newMessage, setNewMessage] = useState('');

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const handleCreateTicket = () => {
    // In a real app, this would create a new ticket
    console.log('Creating ticket:', newTicketData);
    setIsCreateTicketModalOpen(false);
    setNewTicketData({
      title: '',
      description: '',
      priority: 'medium',
      category: '',
    });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedTicket) return;
    
    // In a real app, this would send a new message
    console.log('Sending message:', newMessage, 'for ticket:', selectedTicket);
    setNewMessage('');
  };

  const getStatusColor = (status: Ticket['status']) => {
    switch (status) {
      case 'open':
        return 'bg-blue-50 text-blue-700';
      case 'in_progress':
        return 'bg-yellow-50 text-yellow-700';
      case 'resolved':
        return 'bg-green-50 text-green-700';
      case 'closed':
        return 'bg-gray-50 text-gray-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const getStatusIcon = (status: Ticket['status']) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="h-4 w-4" />;
      case 'in_progress':
        return <Clock className="h-4 w-4" />;
      case 'resolved':
      case 'closed':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <HelpCircle className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: Ticket['priority']) => {
    switch (priority) {
      case 'low':
        return 'bg-green-50 text-green-700';
      case 'medium':
        return 'bg-blue-50 text-blue-700';
      case 'high':
        return 'bg-yellow-50 text-yellow-700';
      case 'urgent':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const getCategoryColor = (categoryId: string) => {
    const category = mockCategories.find(c => c.id === categoryId);
    return category ? { color: category.color } : { color: '#64748B' };
  };

  const getCategoryName = (categoryId: string) => {
    const category = mockCategories.find(c => c.id === categoryId);
    return category ? category.name : 'Uncategorized';
  };

  // Filter tickets based on search and filters
  const filteredTickets = mockTickets.filter(ticket => {
    if (activeTab !== 'all' && ticket.status !== activeTab) {
      return false;
    }
    if (filterPriority !== 'all' && ticket.priority !== filterPriority) {
      return false;
    }
    if (filterCategory !== 'all' && ticket.category !== filterCategory) {
      return false;
    }
    if (filterStatus !== 'all' && ticket.status !== filterStatus) {
      return false;
    }
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        ticket.title.toLowerCase().includes(searchLower) ||
        ticket.description.toLowerCase().includes(searchLower) ||
        ticket.id.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  // Get the selected ticket details
  const ticketDetails = selectedTicket 
    ? mockTickets.find(t => t.id === selectedTicket) 
    : null;

  // Stats for the dashboard
  const ticketStats = {
    total: mockTickets.length,
    open: mockTickets.filter(t => t.status === 'open').length,
    inProgress: mockTickets.filter(t => t.status === 'in_progress').length,
    resolved: mockTickets.filter(t => t.status === 'resolved').length,
    closed: mockTickets.filter(t => t.status === 'closed').length,
    avgResponseTime: 45, // in minutes
    avgResolutionTime: 1565, // in minutes (about 26 hours)
  };

  // Data for charts
  const statusData = [
    { name: 'Open', value: ticketStats.open, color: '#0EA5E9' },
    { name: 'In Progress', value: ticketStats.inProgress, color: '#F59E0B' },
    { name: 'Resolved', value: ticketStats.resolved, color: '#10B981' },
    { name: 'Closed', value: ticketStats.closed, color: '#64748B' },
  ];

  const priorityData = [
    { name: 'Low', value: mockTickets.filter(t => t.priority === 'low').length, color: '#10B981' },
    { name: 'Medium', value: mockTickets.filter(t => t.priority === 'medium').length, color: '#0EA5E9' },
    { name: 'High', value: mockTickets.filter(t => t.priority === 'high').length, color: '#F59E0B' },
    { name: 'Urgent', value: mockTickets.filter(t => t.priority === 'urgent').length, color: '#EF4444' },
  ];

  const categoryData = mockCategories.map(category => ({
    name: category.name,
    value: mockTickets.filter(t => t.category === category.id).length,
    color: category.color,
  }));

  const timelineData = [
    { date: '2024-03-15', tickets: 2, resolved: 0 },
    { date: '2024-03-16', tickets: 0, resolved: 1 },
    { date: '2024-03-17', tickets: 1, resolved: 0 },
    { date: '2024-03-18', tickets: 0, resolved: 1 },
    { date: '2024-03-19', tickets: 1, resolved: 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900 mb-2">
              🎫 Ticketing System
            </h1>
            <p className="text-secondary-600">
              Manage support tickets, track issues, and provide timely assistance to your customers
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleRefresh}
              className={`p-2 rounded-lg text-secondary-600 hover:bg-secondary-100 ${
                isRefreshing ? 'animate-spin' : ''
              }`}
            >
              <RefreshCw className="h-5 w-5" />
            </button>
            <button className="px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors flex items-center space-x-2">
              <Download className="h-5 w-5" />
              <span>Export</span>
            </button>
            <button
              onClick={() => setIsCreateTicketModalOpen(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Create Ticket</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-secondary-50 p-6 rounded-xl border border-secondary-100"
          >
            <div className="flex items-center justify-between mb-2">
              <Ticket className="h-6 w-6 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">{ticketStats.total}</span>
            </div>
            <p className="text-secondary-600">Total Tickets</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-secondary-50 p-6 rounded-xl border border-secondary-100"
          >
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
              <span className="text-2xl font-bold text-yellow-600">
                {ticketStats.open + ticketStats.inProgress}
              </span>
            </div>
            <p className="text-secondary-600">Open Issues</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-secondary-50 p-6 rounded-xl border border-secondary-100"
          >
            <div className="flex items-center justify-between mb-2">
              <Clock className="h-6 w-6 text-purple-600" />
              <div className="flex items-center">
                <span className="text-2xl font-bold text-purple-600">{ticketStats.avgResponseTime}</span>
                <span className="text-sm text-purple-600 ml-1">min</span>
              </div>
            </div>
            <p className="text-secondary-600">Avg. Response Time</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-secondary-50 p-6 rounded-xl border border-secondary-100"
          >
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div className="flex items-center">
                <span className="text-2xl font-bold text-green-600">
                  {Math.floor(ticketStats.avgResolutionTime / 60)}
                </span>
                <span className="text-sm text-green-600 ml-1">hrs</span>
              </div>
            </div>
            <p className="text-secondary-600">Avg. Resolution Time</p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Charts */}
        <div className="col-span-1 space-y-6">
          {/* Status Distribution */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
            <h2 className="text-lg font-semibold text-secondary-900 mb-6">Ticket Status</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RePieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              {statusData.map((status) => (
                <div key={status.name} className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: status.color }}
                  />
                  <span className="text-sm text-secondary-600">
                    {status.name} ({status.value})
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Priority Distribution */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
            <h2 className="text-lg font-semibold text-secondary-900 mb-6">Ticket Priority</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="name" stroke="#64748B" />
                  <YAxis stroke="#64748B" />
                  <Tooltip />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Distribution */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
            <h2 className="text-lg font-semibold text-secondary-900 mb-6">Ticket Categories</h2>
            <div className="space-y-4">
              {categoryData.map((category) => (
                <div key={category.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-secondary-700">{category.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-secondary-100 rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${(category.value / ticketStats.total) * 100}%`,
                          backgroundColor: category.color,
                        }}
                      />
                    </div>
                    <span className="text-sm text-secondary-600">{category.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Middle and Right Columns - Tickets List and Details */}
        <div className="col-span-2 space-y-6">
          {/* Filters and Search */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search tickets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                <option value="all">All Categories</option>
                {mockCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <button className="p-2 hover:bg-secondary-100 rounded-lg text-secondary-600">
                <Filter className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Tickets List */}
          <div className="bg-white rounded-xl shadow-sm border border-secondary-100">
            <div className="p-6 border-b border-secondary-100">
              <div className="flex items-center space-x-4">
                <h2 className="text-lg font-semibold text-secondary-900">Support Tickets</h2>
                <div className="flex space-x-1">
                  {['all', 'open', 'in_progress', 'resolved', 'closed'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1 rounded-lg text-sm ${
                        activeTab === tab
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-secondary-600 hover:bg-secondary-50'
                      }`}
                    >
                      {tab === 'all' ? 'All' : tab.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-secondary-50">
                    <th className="py-4 px-6 text-left font-medium text-secondary-600">ID</th>
                    <th className="py-4 px-6 text-left font-medium text-secondary-600">Title</th>
                    <th className="py-4 px-6 text-left font-medium text-secondary-600">Category</th>
                    <th className="py-4 px-6 text-left font-medium text-secondary-600">Priority</th>
                    <th className="py-4 px-6 text-left font-medium text-secondary-600">Status</th>
                    <th className="py-4 px-6 text-left font-medium text-secondary-600">Created</th>
                    <th className="py-4 px-6 text-left font-medium text-secondary-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.map((ticket) => (
                    <tr 
                      key={ticket.id} 
                      className={`border-b border-secondary-100 hover:bg-secondary-50 cursor-pointer ${
                        selectedTicket === ticket.id ? 'bg-primary-50' : ''
                      }`}
                      onClick={() => setSelectedTicket(ticket.id)}
                    >
                      <td className="py-4 px-6 font-medium">{ticket.id}</td>
                      <td className="py-4 px-6">
                        <div className="max-w-xs truncate">{ticket.title}</div>
                      </td>
                      <td className="py-4 px-6">
                        <span 
                          className="px-3 py-1 rounded-full text-xs font-medium text-white"
                          style={{ backgroundColor: getCategoryColor(ticket.category).color }}
                        >
                          {getCategoryName(ticket.category)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className={`flex items-center space-x-2 ${getStatusColor(ticket.status)}`}>
                          {getStatusIcon(ticket.status)}
                          <span className="capitalize">{ticket.status.replace('_', ' ')}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-secondary-600">
                        {new Date(ticket.createdAt).toLocaleDateString()}
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
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredTickets.length === 0 && (
              <div className="p-8 text-center">
                <Ticket className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-secondary-900 mb-2">No tickets found</h3>
                <p className="text-secondary-600">
                  There are no tickets matching your current filters
                </p>
              </div>
            )}

            <div className="p-4 border-t border-secondary-100 flex items-center justify-between">
              <div className="text-sm text-secondary-600">
                Showing 1 to {filteredTickets.length} of {filteredTickets.length} entries
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

          {/* Ticket Details */}
          {ticketDetails && (
            <div className="bg-white rounded-xl shadow-sm border border-secondary-100">
              <div className="p-6 border-b border-secondary-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <h2 className="text-lg font-semibold text-secondary-900">{ticketDetails.title}</h2>
                    <span className="text-secondary-500">{ticketDetails.id}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-secondary-100 rounded-lg text-secondary-600">
                      <FileText className="h-5 w-5" />
                    </button>
                    <button className="p-2 hover:bg-secondary-100 rounded-lg text-secondary-600">
                      <Download className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => setSelectedTicket(null)}
                      className="p-2 hover:bg-secondary-100 rounded-lg text-secondary-600"
                    >
                      <XCircle className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6 grid grid-cols-3 gap-6 border-b border-secondary-100">
                <div>
                  <label className="text-sm text-secondary-500">Status</label>
                  <div className={`mt-1 flex items-center space-x-2 ${getStatusColor(ticketDetails.status)}`}>
                    {getStatusIcon(ticketDetails.status)}
                    <span className="capitalize">{ticketDetails.status.replace('_', ' ')}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-secondary-500">Priority</label>
                  <div className="mt-1">
                    <span className={`px-3 py-1 rounded-full text-xs ${getPriorityColor(ticketDetails.priority)}`}>
                      {ticketDetails.priority.charAt(0).toUpperCase() + ticketDetails.priority.slice(1)}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-secondary-500">Category</label>
                  <div className="mt-1">
                    <span 
                      className="px-3 py-1 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: getCategoryColor(ticketDetails.category).color }}
                    >
                      {getCategoryName(ticketDetails.category)}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-secondary-500">Created By</label>
                  <p className="mt-1 font-medium">{ticketDetails.createdBy}</p>
                </div>
                <div>
                  <label className="text-sm text-secondary-500">Created At</label>
                  <p className="mt-1 font-medium">
                    {new Date(ticketDetails.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-secondary-500">Assignee</label>
                  <p className="mt-1 font-medium">{ticketDetails.assignee || 'Unassigned'}</p>
                </div>
              </div>

              <div className="p-6 border-b border-secondary-100">
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-secondary-600">{ticketDetails.description}</p>
              </div>

              {/* Conversation */}
              <div className="p-6 max-h-96 overflow-y-auto">
                <h3 className="font-medium mb-4">Conversation</h3>
                <div className="space-y-6">
                  {ticketDetails.messages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`flex ${
                        message.senderType === 'customer' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div 
                        className={`max-w-md rounded-lg p-4 ${
                          message.senderType === 'customer' 
                            ? 'bg-primary-50 text-secondary-800' 
                            : message.senderType === 'support'
                            ? 'bg-secondary-100 text-secondary-800'
                            : 'bg-secondary-50 text-secondary-600 italic text-sm'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{message.sender}</span>
                          <span className="text-xs text-secondary-500">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p>{message.message}</p>
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {message.attachments.map((attachment, index) => (
                              <div key={index} className="flex items-center space-x-2 text-primary-600 text-sm">
                                <Paperclip className="h-4 w-4" />
                                <span>{attachment}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reply Box */}
              <div className="p-6 border-t border-secondary-100">
                <div className="flex items-end space-x-4">
                  <div className="flex-1">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your reply..."
                      className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none h-24"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-secondary-100 rounded-lg text-secondary-600">
                      <Paperclip className="h-5 w-5" />
                    </button>
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className={`btn-primary p-2 ${
                        !newMessage.trim() ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Ticket Modal */}
      {isCreateTicketModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Create New Ticket</h2>
              <button
                onClick={() => setIsCreateTicketModalOpen(false)}
                className="p-2 hover:bg-secondary-100 rounded-lg"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={newTicketData.title}
                  onChange={(e) => setNewTicketData({ ...newTicketData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="Enter ticket title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newTicketData.description}
                  onChange={(e) => setNewTicketData({ ...newTicketData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none h-32"
                  placeholder="Describe your issue in detail"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newTicketData.category}
                    onChange={(e) => setNewTicketData({ ...newTicketData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  >
                    <option value="">Select category</option>
                    {mockCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={newTicketData.priority}
                    onChange={(e) => setNewTicketData({ ...newTicketData, priority: e.target.value as Ticket['priority'] })}
                    className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Attachments
                </label>
                <div className="border-2 border-dashed border-secondary-200 rounded-lg p-4 text-center">
                  <Paperclip className="h-8 w-8 mx-auto mb-2 text-secondary-400" />
                  <p className="text-sm text-secondary-600">
                    Drag and drop files here or click to browse
                  </p>
                  <input type="file" className="hidden" />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsCreateTicketModalOpen(false)}
                className="px-4 py-2 text-secondary-700 hover:bg-secondary-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTicket}
                className="btn-primary px-4 py-2"
              >
                Create Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketingSystem;