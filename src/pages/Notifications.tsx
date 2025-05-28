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
import { useNotifications, Notification } from '../lib/hooks/useNotifications';

const Notifications = () => {
  const {
    notifications,
    loading,
    error,
    unreadCount,
    markAsRead,
    markAllAsRead,
    refresh,
  } = useNotifications();

  const [filterStatus, setFilterStatus] = useState<'all' | 'unread' | 'read'>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refresh();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
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
      case 'product':
        return <Package className="h-5 w-5" />;
      case 'customer':
        return <User className="h-5 w-5" />;
      case 'support':
        return <Bell className="h-5 w-5" />;
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
      case 'product':
        return 'text-indigo-600 bg-indigo-50';
      case 'customer':
        return 'text-teal-600 bg-teal-50';
      case 'support':
        return 'text-orange-600 bg-orange-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-700 bg-red-100';
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-secondary-200 rounded w-1/4 mb-4"></div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-secondary-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-secondary-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-secondary-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Notifications</h3>
        <p className="text-red-600">{error}</p>
        <button
          onClick={handleRefresh}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

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
            <option value="product">Products</option>
            <option value="customer">Customers</option>
            <option value="support">Support</option>
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          >
            <option value="all">All Priority</option>
            <option value="urgent">Urgent</option>
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
              {notifications.length === 0 
                ? "You don't have any notifications yet. When you receive orders, updates, or alerts, they'll appear here."
                : "There are no notifications matching your current filters"
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;