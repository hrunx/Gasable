import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export interface LiveOrder {
  id: string;
  order_number: string;
  customer_name: string;
  product_name: string;
  status: 'pending' | 'processing' | 'in_transit' | 'delivered' | 'cancelled';
  amount: number;
  location: {
    name: string;
    coordinates: [number, number];
  };
  timestamp: string;
  eta: string;
  delivery_status: string;
  delivery_tracking: string | null;
}

export interface LiveMetric {
  name: string;
  value: number;
  unit: string;
  trend: number;
  status: 'normal' | 'warning' | 'critical';
}

export interface QuickStats {
  activeOrders: number;
  inTransit: number;
  onTimeDelivery: number;
  activeCustomers: number;
  trends: {
    activeOrders: number;
    inTransit: number;
    onTimeDelivery: number;
    activeCustomers: number;
  };
}

export interface PerformanceData {
  time: string;
  orders: number;
  deliveries: number;
}

export interface DeliveryLocation {
  name: string;
  coordinates: [number, number];
  deliveries: number;
}

export function useRealTimeMetrics(timeframe: string = '1h') {
  const [quickStats, setQuickStats] = useState<QuickStats | null>(null);
  const [liveOrders, setLiveOrders] = useState<LiveOrder[]>([]);
  const [liveMetrics, setLiveMetrics] = useState<LiveMetric[]>([]);
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [deliveryLocations, setDeliveryLocations] = useState<DeliveryLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuickStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get user's company
      const { data: companyMember } = await supabase
        .from('company_members')
        .select('company_id')
        .eq('profile_id', user.id)
        .single();

      if (!companyMember) throw new Error('User not associated with any company');

      const companyId = companyMember.company_id;

      // Calculate date ranges based on timeframe
      const now = new Date();
      const getDateRange = (timeframe: string) => {
        switch (timeframe) {
          case '1h':
            return new Date(now.getTime() - 60 * 60 * 1000);
          case '6h':
            return new Date(now.getTime() - 6 * 60 * 60 * 1000);
          case '24h':
            return new Date(now.getTime() - 24 * 60 * 60 * 1000);
          case '7d':
            return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          default:
            return new Date(now.getTime() - 60 * 60 * 1000);
        }
      };

      const startDate = getDateRange(timeframe);
      const previousStartDate = new Date(startDate.getTime() - (now.getTime() - startDate.getTime()));

      // Fetch current period stats
      const { data: currentOrders } = await supabase
        .from('orders')
        .select('*')
        .eq('company_id', companyId)
        .gte('created_at', startDate.toISOString());

      // Fetch previous period stats for trend calculation
      const { data: previousOrders } = await supabase
        .from('orders')
        .select('*')
        .eq('company_id', companyId)
        .gte('created_at', previousStartDate.toISOString())
        .lt('created_at', startDate.toISOString());

      // Calculate current stats
      const activeOrders = currentOrders?.filter(o => ['pending', 'processing'].includes(o.status)).length || 0;
      const inTransit = currentOrders?.filter(o => o.delivery_status === 'in_transit').length || 0;
      const deliveredOrders = currentOrders?.filter(o => o.delivery_status === 'delivered').length || 0;
      const totalOrders = currentOrders?.length || 0;
      const onTimeDelivery = totalOrders > 0 ? (deliveredOrders / totalOrders) * 100 : 0;

      // Get unique customers
      const uniqueCustomers = new Set(currentOrders?.map(o => o.customer_id)).size;

      // Calculate previous stats for trends
      const prevActiveOrders = previousOrders?.filter(o => ['pending', 'processing'].includes(o.status)).length || 0;
      const prevInTransit = previousOrders?.filter(o => o.delivery_status === 'in_transit').length || 0;
      const prevDeliveredOrders = previousOrders?.filter(o => o.delivery_status === 'delivered').length || 0;
      const prevTotalOrders = previousOrders?.length || 0;
      const prevOnTimeDelivery = prevTotalOrders > 0 ? (prevDeliveredOrders / prevTotalOrders) * 100 : 0;
      const prevUniqueCustomers = new Set(previousOrders?.map(o => o.customer_id)).size;

      // Calculate trends (percentage change)
      const calculateTrend = (current: number, previous: number) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return ((current - previous) / previous) * 100;
      };

      setQuickStats({
        activeOrders,
        inTransit,
        onTimeDelivery,
        activeCustomers: uniqueCustomers,
        trends: {
          activeOrders: calculateTrend(activeOrders, prevActiveOrders),
          inTransit: calculateTrend(inTransit, prevInTransit),
          onTimeDelivery: calculateTrend(onTimeDelivery, prevOnTimeDelivery),
          activeCustomers: calculateTrend(uniqueCustomers, prevUniqueCustomers),
        },
      });

    } catch (err) {
      console.error('Error fetching quick stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch quick stats');
    }
  };

  const fetchLiveOrders = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: companyMember } = await supabase
        .from('company_members')
        .select('company_id')
        .eq('profile_id', user.id)
        .single();

      if (!companyMember) throw new Error('User not associated with any company');

      // Fetch recent orders with customer and product details
      const { data: orders } = await supabase
        .from('orders')
        .select(`
          *,
          customers (name),
          order_items (
            products (name)
          )
        `)
        .eq('company_id', companyMember.company_id)
        .in('status', ['pending', 'processing', 'in_transit'])
        .order('created_at', { ascending: false })
        .limit(10);

      if (orders) {
        const liveOrdersData: LiveOrder[] = orders.map(order => ({
          id: order.id,
          order_number: order.order_number,
          customer_name: order.customers?.name || 'Unknown Customer',
          product_name: order.order_items?.[0]?.products?.name || 'Various Products',
          status: mapOrderStatus(order.status, order.delivery_status),
          amount: parseFloat(order.total_amount),
          location: {
            name: order.delivery_city || 'Unknown Location',
            coordinates: getLocationCoordinates(order.delivery_city),
          },
          timestamp: order.created_at,
          eta: calculateETA(order.delivery_status, order.created_at),
          delivery_status: order.delivery_status,
          delivery_tracking: order.delivery_tracking,
        }));

        setLiveOrders(liveOrdersData);
      }

    } catch (err) {
      console.error('Error fetching live orders:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch live orders');
    }
  };

  const fetchPerformanceData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: companyMember } = await supabase
        .from('company_members')
        .select('company_id')
        .eq('profile_id', user.id)
        .single();

      if (!companyMember) throw new Error('User not associated with any company');

      // Get hourly data for the last 7 hours
      const hours = Array.from({ length: 7 }, (_, i) => {
        const hour = new Date();
        hour.setHours(hour.getHours() - (6 - i));
        return hour;
      });

      const performancePromises = hours.map(async (hour) => {
        const startHour = new Date(hour);
        startHour.setMinutes(0, 0, 0);
        const endHour = new Date(startHour);
        endHour.setHours(endHour.getHours() + 1);

        const { data: orders } = await supabase
          .from('orders')
          .select('*')
          .eq('company_id', companyMember.company_id)
          .gte('created_at', startHour.toISOString())
          .lt('created_at', endHour.toISOString());

        const deliveries = orders?.filter(o => o.delivery_status === 'delivered').length || 0;

        return {
          time: startHour.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          orders: orders?.length || 0,
          deliveries,
        };
      });

      const performanceResults = await Promise.all(performancePromises);
      setPerformanceData(performanceResults);

    } catch (err) {
      console.error('Error fetching performance data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch performance data');
    }
  };

  const fetchDeliveryLocations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: companyMember } = await supabase
        .from('company_members')
        .select('company_id')
        .eq('profile_id', user.id)
        .single();

      if (!companyMember) throw new Error('User not associated with any company');

      // Get delivery locations with counts
      const { data: orders } = await supabase
        .from('orders')
        .select('delivery_city')
        .eq('company_id', companyMember.company_id)
        .not('delivery_city', 'is', null);

      if (orders) {
        const locationCounts = orders.reduce((acc, order) => {
          const city = order.delivery_city;
          acc[city] = (acc[city] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const locations: DeliveryLocation[] = Object.entries(locationCounts)
          .map(([city, count]) => ({
            name: city,
            coordinates: getLocationCoordinates(city),
            deliveries: count,
          }))
          .sort((a, b) => b.deliveries - a.deliveries)
          .slice(0, 5); // Top 5 locations

        setDeliveryLocations(locations);
      }

    } catch (err) {
      console.error('Error fetching delivery locations:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch delivery locations');
    }
  };

  const generateLiveMetrics = () => {
    // Generate realistic IoT-style metrics
    const metrics: LiveMetric[] = [
      {
        name: 'Tank Pressure',
        value: 2.3 + Math.random() * 0.4,
        unit: 'bar',
        trend: (Math.random() - 0.5) * 2,
        status: Math.random() > 0.8 ? 'warning' : 'normal',
      },
      {
        name: 'Temperature',
        value: 22 + Math.random() * 4,
        unit: '°C',
        trend: (Math.random() - 0.5) * 3,
        status: 'normal',
      },
      {
        name: 'Flow Rate',
        value: 10 + Math.random() * 5,
        unit: 'L/min',
        trend: (Math.random() - 0.5) * 2,
        status: Math.random() > 0.9 ? 'warning' : 'normal',
      },
      {
        name: 'Battery Level',
        value: 80 + Math.random() * 15,
        unit: '%',
        trend: -Math.random() * 2,
        status: 'normal',
      },
    ];

    setLiveMetrics(metrics);
  };

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);

    try {
      await Promise.all([
        fetchQuickStats(),
        fetchLiveOrders(),
        fetchPerformanceData(),
        fetchDeliveryLocations(),
      ]);
      generateLiveMetrics();
    } catch (err) {
      console.error('Error fetching metrics data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch metrics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [timeframe]);

  // Helper functions
  const mapOrderStatus = (status: string, deliveryStatus: string): LiveOrder['status'] => {
    if (deliveryStatus === 'delivered') return 'delivered';
    if (deliveryStatus === 'in_transit') return 'in_transit';
    if (status === 'cancelled') return 'cancelled';
    if (status === 'processing') return 'processing';
    return 'pending';
  };

  const getLocationCoordinates = (city: string | null): [number, number] => {
    const coordinates: Record<string, [number, number]> = {
      'Riyadh': [46.6753, 24.7136],
      'Jeddah': [39.1925, 21.4858],
      'Dammam': [50.1033, 26.4207],
      'Mecca': [39.8579, 21.3891],
      'Medina': [39.6142, 24.4539],
      'Khobar': [50.2089, 26.2172],
      'Tabuk': [36.5552, 28.3998],
      'Abha': [42.5058, 18.2164],
    };

    return coordinates[city || ''] || [46.6753, 24.7136]; // Default to Riyadh
  };

  const calculateETA = (deliveryStatus: string, createdAt: string): string => {
    if (deliveryStatus === 'delivered') return 'Delivered';
    if (deliveryStatus === 'pending') return 'TBD';

    const created = new Date(createdAt);
    const now = new Date();
    const hoursElapsed = (now.getTime() - created.getTime()) / (1000 * 60 * 60);
    const estimatedTotalHours = 24; // Assume 24 hour delivery window
    const remainingHours = Math.max(0, estimatedTotalHours - hoursElapsed);

    if (remainingHours < 1) return '< 1 hour';
    if (remainingHours < 24) return `${Math.round(remainingHours)} hours`;
    return `${Math.round(remainingHours / 24)} days`;
  };

  return {
    quickStats,
    liveOrders,
    liveMetrics,
    performanceData,
    deliveryLocations,
    loading,
    error,
    refresh: fetchAllData,
  };
} 