import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Bell,
  Package,
  Truck,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Filter,
  Search,
  Calendar,
  ArrowRight,
  User,
  Settings,
  RefreshCw,
  XCircle,
  ChevronDown,
} from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'delivery' | 'alert' | 'system' | 'payment';
  status: 'unread' | 'read';
  timestamp: string;
  priority: 'high' | 'medium' | 'low';
  actionRequired?: boolean;
  link?: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Order Received',
    message: 'Order #ORD-2024-001 has been placed for Industrial Gas Tank x5',
    type: 'order',
    status: 'unread',
    timestamp: '2024-03-19 10:30:00',
    priority: 'high',
    actionRequired: true,
    link: '/dashboard/orders',
  },
  {
    id: '2',
    title: 'Delivery Update',
    message: 'Shipment TRK-2024-001 has reached Riyadh checkpoint',
    type: 'delivery',
    status: 'unread',
    timestamp: '2024-03-19 09:45:00',
    priority: 'medium',
    link: '/dashboard/orders/tracking',
  },
  {
    id: '3',
    title: 'Payment Received',
    message: 'Payment of $2,499.95 received for Order #ORD-2024-001',
    type: 'payment',
    status: 'read',
    timestamp: '2024-03-19 09:30:00',
    priority: 'medium',
    link: '/dashboard/finance/transactions',
  },
  {
    id: '4',
    title: 'Low Stock Alert',
    message: 'Industrial Gas Tank stock level is below threshold (5 units remaining)',
    type: 'alert',
    status: 'unread',
    timestamp: '2024-03-19 08:15:00',
    priority: 'high',
    actionRequired: true,
    link: '/dashboard/setup/products',
  },
  {
    id: '5',
    title: 'System Maintenance',
    message: 'Scheduled maintenance on March 20, 2024, from 02:00 AM to 04:00 AM GMT',
    type: 'system',
    status: 'read',
    timestamp: '2024-03-18 15:00:00',
    priority: 'low',
  },
];

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filterStatus, setFilterStatus] = useState<'all' | 'unread' | 'read'>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, status: 'read' } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      status: 'read'
    })));
  };

  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'order':
        return <Package className="h-5 w-5" />;
      case 'delivery':
        return <Truck className="h-5 w-5" />;
      case 'alert':
        return <AlertCircle className="h-5 w-5" />;
      case 'system':
        return <Settings className="h-5 w-5" />;
      case 'payment':
        return <DollarSign className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'order':
        return 'text-blue-600 bg-blue-50';
      case 'delivery':
        return 'text-green-600 bg-green-50';
      case 'alert':
        return 'text-red-600 bg-red-50';
      case 'system':
        return 'text-purple-600 bg-purple-50';
      case 'payment':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filterStatus !== 'all' && notification.status !== filterStatus) return false;
    if (filterType !== 'all' && notification.type !== filterType) return false;
    if (filterPriority !== 'all' && notification.priority !== filterPriority) return false;
    return true;
  });

  const unreadCount = notifications.filter(n => n.status === 'unread').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900 mb-2">
              🔔 Notifications
            </h1>
            <p className="text-secondary-600">
              Stay updated with your latest activities and alerts
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
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors flex items-center space-x-2"
            >
              <CheckCircle className="h-5 w-5" />
              <span>Mark All as Read</span>
            </button>
            <button className="px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search notifications..."
              className="pl-10 pr-4 py-2 w-full border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'all' | 'unread' | 'read')}
            className="px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          >
            <option value="all">All Status</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          >
            <option value="all">All Types</option>
            <option value="order">Orders</option>
            <option value="delivery">Deliveries</option>
            <option value="alert">Alerts</option>
            <option value="system">System</option>
            <option value="payment">Payments</option>
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          >
            <option value="all">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <button className="px-4 py-2 border border-secondary-200 rounded-lg hover:bg-secondary-50 flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Date Range</span>
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl shadow-sm border border-secondary-100">
        <div className="p-6 border-b border-secondary-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-secondary-900">Recent Notifications</h2>
            <span className="text-sm text-secondary-600">
              {unreadCount} unread notifications
            </span>
          </div>
        </div>

        <div className="divide-y divide-secondary-100">
          {filteredNotifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 transition-colors ${
                notification.status === 'unread' ? 'bg-blue-50/30' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-lg ${getTypeColor(notification.type)}`}>
                    {getTypeIcon(notification.type)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-secondary-900">{notification.title}</h3>
                      {notification.actionRequired && (
                        <span className="px-2 py-1 text-xs bg-red-50 text-red-600 rounded-full">
                          Action Required
                        </span>
                      )}
                      <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(notification.priority)}`}>
                        {notification.priority.charAt(0).toUpperCase() + notification.priority.slice(1)} Priority
                      </span>
                    </div>
                    <p className="text-secondary-600 mt-1">{notification.message}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-sm text-secondary-500">
                        {new Date(notification.timestamp).toLocaleString()}
                      </span>
                      {notification.link && (
                        <Link
                          to={notification.link}
                          className="text-sm text-primary-600 hover:text-primary-700 flex items-center space-x-1"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <span>View Details</span>
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {notification.status === 'unread' && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="p-2 text-secondary-600 hover:bg-secondary-100 rounded-lg"
                    >
                      <CheckCircle className="h-5 w-5" />
                    </button>
                  )}
                  <button className="p-2 text-secondary-600 hover:bg-secondary-100 rounded-lg">
                    <XCircle className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredNotifications.length === 0 && (
          <div className="p-8 text-center">
            <Bell className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-secondary-900 mb-2">No notifications found</h3>
            <p className="text-secondary-600">
              There are no notifications matching your current filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;