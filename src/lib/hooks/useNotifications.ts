import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'delivery' | 'alert' | 'system' | 'payment' | 'product' | 'customer' | 'support';
  status: 'unread' | 'read' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionRequired: boolean;
  link?: string;
  metadata?: Record<string, any>;
  timestamp: string;
  readAt?: string;
}

export interface ActivityLogEntry {
  id: string;
  entityType: string;
  entityId: string;
  action: string;
  description: string;
  timestamp: string;
  userId?: string;
  userName?: string;
}

export interface RecentActivity {
  id: string;
  title: string;
  value: string;
  time: string;
  type: 'order' | 'customer' | 'product' | 'feedback' | 'payment' | 'delivery';
  link?: string;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const getCompanyId = async (): Promise<string | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.warn('No authenticated user found');
        return null;
      }

      // First try to get company_id from company_members table
      const { data: companyMember, error: memberError } = await supabase
        .from('company_members')
        .select('company_id')
        .eq('profile_id', user.id)
        .single();

      if (companyMember?.company_id) {
        return companyMember.company_id;
      }

      // If not found in company_members, try to get from users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('company_id')
        .eq('id', user.id)
        .single();

      if (userData?.company_id) {
        return userData.company_id;
      }

      // If still not found, try to get from companies table where user is owner
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (companyData?.id) {
        return companyData.id;
      }

      console.warn('User not associated with any company', {
        userId: user.id,
        memberError,
        userError,
        companyError
      });
      return null;

    } catch (err) {
      console.error('Error getting company ID:', err);
      return null;
    }
  };

  const fetchNotifications = async () => {
    try {
      const companyId = await getCompanyId();
      if (!companyId) {
        console.warn('No company ID found, using empty notifications');
        setNotifications([]);
        setUnreadCount(0);
        return;
      }

      const { data: notificationsData, error: notificationsError } = await supabase
        .from('notifications')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (notificationsError) {
        console.warn('Notifications table may not exist yet:', notificationsError);
        setNotifications([]);
        setUnreadCount(0);
        return;
      }

      const formattedNotifications: Notification[] = notificationsData?.map(notification => ({
        id: notification.id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        status: notification.status,
        priority: notification.priority,
        actionRequired: notification.action_required,
        link: notification.link,
        metadata: notification.metadata,
        timestamp: notification.created_at,
        readAt: notification.read_at,
      })) || [];

      setNotifications(formattedNotifications);
      setUnreadCount(formattedNotifications.filter(n => n.status === 'unread').length);

    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
      // Set empty state instead of keeping loading
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  const fetchActivityLog = async () => {
    try {
      const companyId = await getCompanyId();
      if (!companyId) {
        console.warn('No company ID found, using empty activity log');
        setActivityLog([]);
        return;
      }

      const { data: activityData, error: activityError } = await supabase
        .from('activity_log')
        .select(`
          *,
          users (full_name)
        `)
        .eq('company_id', companyId)
        .order('created_at', { ascending: false })
        .limit(100);

      if (activityError) {
        console.warn('Activity log table may not exist yet:', activityError);
        setActivityLog([]);
        return;
      }

      const formattedActivity: ActivityLogEntry[] = activityData?.map(activity => ({
        id: activity.id,
        entityType: activity.entity_type,
        entityId: activity.entity_id,
        action: activity.action,
        description: activity.description,
        timestamp: activity.created_at,
        userId: activity.user_id,
        userName: (activity.users as any)?.full_name || 'System',
      })) || [];

      setActivityLog(formattedActivity);

    } catch (err) {
      console.error('Error fetching activity log:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch activity log');
      setActivityLog([]);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const companyId = await getCompanyId();
      if (!companyId) {
        console.warn('No company ID found, using empty recent activity');
        setRecentActivity([]);
        return;
      }

      const activities: RecentActivity[] = [];

      // Get recent orders
      const { data: recentOrders, error: ordersError } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          total_amount,
          status,
          created_at,
          customers!inner (name)
        `)
        .eq('company_id', companyId)
        .order('created_at', { ascending: false })
        .limit(3);

      if (!ordersError && recentOrders) {
        recentOrders.forEach(order => {
          activities.push({
            id: `order-${order.id}`,
            title: `Order ${order.order_number}`,
            value: `$${parseFloat(order.total_amount).toFixed(2)}`,
            time: getTimeAgo(order.created_at),
            type: 'order',
            link: `/dashboard/orders/${order.id}`,
          });
        });
      }

      // Get recent product updates (products with recent stock changes)
      const { data: recentProducts, error: productsError } = await supabase
        .from('products')
        .select('id, name, stock_quantity, updated_at')
        .eq('company_id', companyId)
        .order('updated_at', { ascending: false })
        .limit(2);

      if (!productsError && recentProducts) {
        recentProducts.forEach(product => {
          activities.push({
            id: `product-${product.id}`,
            title: `Product "${product.name}" updated`,
            value: `${product.stock_quantity} units`,
            time: getTimeAgo(product.updated_at),
            type: 'product',
            link: `/dashboard/setup/products/${product.id}`,
          });
        });
      }

      // Get recent customers (through recent orders)
      const { data: recentCustomers, error: customersError } = await supabase
        .from('customers')
        .select(`
          id,
          name,
          created_at,
          orders!inner (company_id)
        `)
        .eq('orders.company_id', companyId)
        .order('created_at', { ascending: false })
        .limit(2);

      if (!customersError && recentCustomers) {
        recentCustomers.forEach(customer => {
          activities.push({
            id: `customer-${customer.id}`,
            title: `New customer "${customer.name}"`,
            value: 'Registered',
            time: getTimeAgo(customer.created_at),
            type: 'customer',
            link: `/dashboard/customers/${customer.id}`,
          });
        });
      }

      // Sort all activities by time and take the most recent 5
      activities.sort((a, b) => {
        // Convert time ago to comparable values (this is a simplified approach)
        const timeToMinutes = (timeStr: string): number => {
          if (timeStr.includes('minute')) return parseInt(timeStr);
          if (timeStr.includes('hour')) return parseInt(timeStr) * 60;
          if (timeStr.includes('day')) return parseInt(timeStr) * 1440;
          return 0;
        };
        return timeToMinutes(a.time) - timeToMinutes(b.time);
      });

      setRecentActivity(activities.slice(0, 5));

    } catch (err) {
      console.error('Error fetching recent activity:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch recent activity');
      setRecentActivity([]);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase.rpc('mark_notification_read', {
        notification_id: notificationId
      });

      if (error) {
        console.warn('Mark as read function may not exist yet:', error);
        return;
      }

      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, status: 'read' as const, readAt: new Date().toISOString() }
            : notification
        )
      );

      setUnreadCount(prev => Math.max(0, prev - 1));

    } catch (err) {
      console.error('Error marking notification as read:', err);
      setError(err instanceof Error ? err.message : 'Failed to mark notification as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      const companyId = await getCompanyId();
      if (!companyId) {
        console.warn('No company ID found for mark all as read');
        return;
      }

      const { error } = await supabase.rpc('mark_all_notifications_read', {
        p_company_id: companyId
      });

      if (error) {
        console.warn('Mark all as read function may not exist yet:', error);
        return;
      }

      // Update local state
      setNotifications(prev => 
        prev.map(notification => ({
          ...notification,
          status: 'read' as const,
          readAt: new Date().toISOString()
        }))
      );

      setUnreadCount(0);

    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      setError(err instanceof Error ? err.message : 'Failed to mark all notifications as read');
    }
  };

  const createNotification = async (
    title: string,
    message: string,
    type: Notification['type'],
    priority: Notification['priority'] = 'medium',
    actionRequired: boolean = false,
    link?: string,
    metadata?: Record<string, any>
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const companyId = await getCompanyId();
      if (!companyId) {
        console.warn('No company ID found for creating notification');
        return;
      }

      const { error } = await supabase.rpc('create_notification', {
        p_company_id: companyId,
        p_title: title,
        p_message: message,
        p_type: type,
        p_user_id: user.id,
        p_priority: priority,
        p_action_required: actionRequired,
        p_link: link,
        p_metadata: metadata || {}
      });

      if (error) {
        console.warn('Create notification function may not exist yet:', error);
        return;
      }

      // Refresh notifications
      await fetchNotifications();

    } catch (err) {
      console.error('Error creating notification:', err);
      setError(err instanceof Error ? err.message : 'Failed to create notification');
    }
  };

  const getTimeAgo = (dateString: string): string => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  const refresh = async () => {
    setLoading(true);
    setError(null);

    try {
      await Promise.all([
        fetchNotifications(),
        fetchActivityLog(),
        fetchRecentActivity(),
      ]);
    } catch (err) {
      console.error('Error refreshing notifications:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return {
    notifications,
    activityLog,
    recentActivity,
    loading,
    error,
    unreadCount,
    markAsRead,
    markAllAsRead,
    createNotification,
    refresh,
  };
} 