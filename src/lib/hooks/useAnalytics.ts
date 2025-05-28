import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export interface OverviewStats {
  totalRevenue: number;
  revenueGrowth: number;
  activeCustomers: number;
  customerGrowth: number;
  totalOrders: number;
  orderGrowth: number;
  productViews: number;
  viewsGrowth: number;
}

export interface RevenueData {
  month: string;
  revenue: number;
  orders: number;
  b2b: number;
  b2c: number;
}

export interface CustomerSegment {
  name: string;
  value: number;
  color: string;
  count: number;
}

export interface ProductPerformance {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  growth: number;
  category: string;
  stock: number;
}

export interface SalesMetrics {
  totalRevenue: number;
  totalOrders: number;
  conversionRate: number;
  averageOrderValue: number;
  revenueGrowth: number;
  orderGrowth: number;
  conversionGrowth: number;
}

export interface CustomerInsight {
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  customerLifetimeValue: number;
  churnRate: number;
  acquisitionCost: number;
  satisfactionScore: number;
}

export interface MarketData {
  marketShare: number;
  competitorAnalysis: Array<{
    name: string;
    share: number;
    growth: number;
  }>;
  regionPerformance: Array<{
    region: string;
    revenue: number;
    growth: number;
    customers: number;
  }>;
}

export function useAnalytics(timeframe: string = '6m') {
  const [overviewStats, setOverviewStats] = useState<OverviewStats | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [customerSegments, setCustomerSegments] = useState<CustomerSegment[]>([]);
  const [productPerformance, setProductPerformance] = useState<ProductPerformance[]>([]);
  const [salesMetrics, setSalesMetrics] = useState<SalesMetrics | null>(null);
  const [customerInsights, setCustomerInsights] = useState<CustomerInsight | null>(null);
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getDateRange = (timeframe: string) => {
    const now = new Date();
    switch (timeframe) {
      case '1m':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      case '3m':
        return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      case '6m':
        return new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
      case '1y':
        return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      default:
        return new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
    }
  };

  const fetchOverviewStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: companyMember } = await supabase
        .from('company_members')
        .select('company_id')
        .eq('profile_id', user.id)
        .single();

      if (!companyMember) throw new Error('User not associated with any company');

      const startDate = getDateRange(timeframe);
      const previousStartDate = new Date(startDate.getTime() - (Date.now() - startDate.getTime()));

      // Fetch current period data
      const { data: currentOrders } = await supabase
        .from('orders')
        .select('total_amount, customer_id, created_at')
        .eq('company_id', companyMember.company_id)
        .gte('created_at', startDate.toISOString());

      // Fetch previous period data for comparison
      const { data: previousOrders } = await supabase
        .from('orders')
        .select('total_amount, customer_id, created_at')
        .eq('company_id', companyMember.company_id)
        .gte('created_at', previousStartDate.toISOString())
        .lt('created_at', startDate.toISOString());

      // Calculate current metrics
      const totalRevenue = currentOrders?.reduce((sum, order) => sum + parseFloat(order.total_amount), 0) || 0;
      const totalOrders = currentOrders?.length || 0;
      const activeCustomers = new Set(currentOrders?.map(o => o.customer_id)).size;

      // Calculate previous metrics
      const prevRevenue = previousOrders?.reduce((sum, order) => sum + parseFloat(order.total_amount), 0) || 0;
      const prevOrders = previousOrders?.length || 0;
      const prevCustomers = new Set(previousOrders?.map(o => o.customer_id)).size;

      // Calculate growth percentages
      const revenueGrowth = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0;
      const orderGrowth = prevOrders > 0 ? ((totalOrders - prevOrders) / prevOrders) * 100 : 0;
      const customerGrowth = prevCustomers > 0 ? ((activeCustomers - prevCustomers) / prevCustomers) * 100 : 0;

      // Simulate product views (would come from analytics tracking in real app)
      const productViews = Math.floor(totalOrders * 15 + Math.random() * 5000);
      const viewsGrowth = Math.random() * 30 + 10; // 10-40% growth

      setOverviewStats({
        totalRevenue,
        revenueGrowth,
        activeCustomers,
        customerGrowth,
        totalOrders,
        orderGrowth,
        productViews,
        viewsGrowth,
      });

    } catch (err) {
      console.error('Error fetching overview stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch overview stats');
    }
  };

  const fetchRevenueData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: companyMember } = await supabase
        .from('company_members')
        .select('company_id')
        .eq('profile_id', user.id)
        .single();

      if (!companyMember) throw new Error('User not associated with any company');

      // Get monthly data for the last 6 months
      const months = Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (5 - i));
        return date;
      });

      const revenuePromises = months.map(async (month) => {
        const startMonth = new Date(month.getFullYear(), month.getMonth(), 1);
        const endMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);

        // Query orders with customer data
        const { data: orders } = await supabase
          .from('orders')
          .select(`
            total_amount,
            customers!inner (type)
          `)
          .eq('company_id', companyMember.company_id)
          .gte('created_at', startMonth.toISOString())
          .lte('created_at', endMonth.toISOString());

        const totalRevenue = orders?.reduce((sum, order) => sum + parseFloat(order.total_amount), 0) || 0;
        const totalOrders = orders?.length || 0;

        // Separate B2B and B2C revenue based on customer type
        const b2bRevenue = orders?.filter(o => (o.customers as any)?.type === 'business')
          .reduce((sum, order) => sum + parseFloat(order.total_amount), 0) || 0;
        const b2cRevenue = totalRevenue - b2bRevenue;

        return {
          month: month.toLocaleDateString('en-US', { month: 'short' }),
          revenue: totalRevenue,
          orders: totalOrders,
          b2b: b2bRevenue,
          b2c: b2cRevenue,
        };
      });

      const revenueResults = await Promise.all(revenuePromises);
      setRevenueData(revenueResults);

    } catch (err) {
      console.error('Error fetching revenue data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch revenue data');
    }
  };

  const fetchCustomerSegments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: companyMember } = await supabase
        .from('company_members')
        .select('company_id')
        .eq('profile_id', user.id)
        .single();

      if (!companyMember) throw new Error('User not associated with any company');

      // Get customer segments by querying orders and joining customers
      const { data: orderCustomers } = await supabase
        .from('orders')
        .select(`
          customer_id,
          customers!inner (type)
        `)
        .eq('company_id', companyMember.company_id);

      if (orderCustomers) {
        // Get unique customers and their types
        const uniqueCustomers = new Map();
        orderCustomers.forEach(order => {
          const customerId = order.customer_id;
          const customerType = (order.customers as any)?.type || 'individual';
          if (!uniqueCustomers.has(customerId)) {
            uniqueCustomers.set(customerId, customerType);
          }
        });

        const segments = Array.from(uniqueCustomers.values()).reduce((acc: Record<string, number>, type: string) => {
          const segmentName = type === 'business' ? 'B2B' : 
                             type === 'distributor' ? 'Distributors' : 'B2C';
          
          acc[segmentName] = (acc[segmentName] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const total = (Object.values(segments) as number[]).reduce((sum: number, count: number) => sum + count, 0);
        
        const segmentData: CustomerSegment[] = [
          {
            name: 'B2B',
            value: total > 0 ? Math.round(((segments['B2B'] || 0) as number) / total * 100) : 0,
            color: '#0EA5E9',
            count: (segments['B2B'] || 0) as number,
          },
          {
            name: 'B2C',
            value: total > 0 ? Math.round(((segments['B2C'] || 0) as number) / total * 100) : 0,
            color: '#6366F1',
            count: (segments['B2C'] || 0) as number,
          },
          {
            name: 'Distributors',
            value: total > 0 ? Math.round(((segments['Distributors'] || 0) as number) / total * 100) : 0,
            color: '#8B5CF6',
            count: (segments['Distributors'] || 0) as number,
          },
        ];

        setCustomerSegments(segmentData);
      }

    } catch (err) {
      console.error('Error fetching customer segments:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch customer segments');
    }
  };

  const fetchProductPerformance = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: companyMember } = await supabase
        .from('company_members')
        .select('company_id')
        .eq('profile_id', user.id)
        .single();

      if (!companyMember) throw new Error('User not associated with any company');

      const startDate = getDateRange(timeframe);
      const previousStartDate = new Date(startDate.getTime() - (Date.now() - startDate.getTime()));

      // Get product performance data
      const { data: productSales } = await supabase
        .from('order_items')
        .select(`
          quantity,
          unit_price,
          products!inner (id, name, category, stock_quantity),
          orders!inner (created_at, company_id)
        `)
        .eq('orders.company_id', companyMember.company_id)
        .gte('orders.created_at', startDate.toISOString());

      // Get previous period data for growth calculation
      const { data: previousProductSales } = await supabase
        .from('order_items')
        .select(`
          quantity,
          products!inner (id),
          orders!inner (created_at, company_id)
        `)
        .eq('orders.company_id', companyMember.company_id)
        .gte('orders.created_at', previousStartDate.toISOString())
        .lt('orders.created_at', startDate.toISOString());

      if (productSales) {
        // Aggregate sales by product
        const productMap = new Map();
        const previousProductMap = new Map();

        productSales.forEach(item => {
          const product = item.products as any;
          const productId = product.id;
          const revenue = item.quantity * parseFloat(item.unit_price);
          
          if (productMap.has(productId)) {
            const existing = productMap.get(productId);
            existing.sales += item.quantity;
            existing.revenue += revenue;
          } else {
            productMap.set(productId, {
              id: productId,
              name: product.name,
              category: product.category || 'General',
              stock: product.stock_quantity || 0,
              sales: item.quantity,
              revenue: revenue,
            });
          }
        });

        // Calculate previous period sales for growth
        previousProductSales?.forEach(item => {
          const product = item.products as any;
          const productId = product.id;
          const sales = item.quantity;
          
          if (previousProductMap.has(productId)) {
            previousProductMap.set(productId, previousProductMap.get(productId) + sales);
          } else {
            previousProductMap.set(productId, sales);
          }
        });

        // Calculate growth and create final array
        const performanceData: ProductPerformance[] = Array.from(productMap.values())
          .map(product => {
            const previousSales = previousProductMap.get(product.id) || 0;
            const growth = previousSales > 0 ? 
              ((product.sales - previousSales) / previousSales) * 100 : 
              product.sales > 0 ? 100 : 0;

            return {
              ...product,
              growth: Math.round(growth * 10) / 10, // Round to 1 decimal
            };
          })
          .sort((a, b) => b.sales - a.sales) // Sort by sales volume
          .slice(0, 10); // Top 10 products

        setProductPerformance(performanceData);
      }

    } catch (err) {
      console.error('Error fetching product performance:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch product performance');
    }
  };

  const fetchSalesMetrics = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: companyMember } = await supabase
        .from('company_members')
        .select('company_id')
        .eq('profile_id', user.id)
        .single();

      if (!companyMember) throw new Error('User not associated with any company');

      const startDate = getDateRange(timeframe);
      const previousStartDate = new Date(startDate.getTime() - (Date.now() - startDate.getTime()));

      // Current period metrics
      const { data: currentOrders } = await supabase
        .from('orders')
        .select('total_amount, status')
        .eq('company_id', companyMember.company_id)
        .gte('created_at', startDate.toISOString());

      // Previous period metrics
      const { data: previousOrders } = await supabase
        .from('orders')
        .select('total_amount, status')
        .eq('company_id', companyMember.company_id)
        .gte('created_at', previousStartDate.toISOString())
        .lt('created_at', startDate.toISOString());

      // Calculate current metrics
      const totalRevenue = currentOrders?.reduce((sum, order) => sum + parseFloat(order.total_amount), 0) || 0;
      const totalOrders = currentOrders?.length || 0;
      const completedOrders = currentOrders?.filter(o => o.status === 'completed').length || 0;
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
      const conversionRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;

      // Calculate previous metrics for growth
      const prevRevenue = previousOrders?.reduce((sum, order) => sum + parseFloat(order.total_amount), 0) || 0;
      const prevOrders = previousOrders?.length || 0;
      const prevCompleted = previousOrders?.filter(o => o.status === 'completed').length || 0;
      const prevConversion = prevOrders > 0 ? (prevCompleted / prevOrders) * 100 : 0;

      const revenueGrowth = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0;
      const orderGrowth = prevOrders > 0 ? ((totalOrders - prevOrders) / prevOrders) * 100 : 0;
      const conversionGrowth = prevConversion > 0 ? ((conversionRate - prevConversion) / prevConversion) * 100 : 0;

      setSalesMetrics({
        totalRevenue,
        totalOrders,
        conversionRate,
        averageOrderValue,
        revenueGrowth,
        orderGrowth,
        conversionGrowth,
      });

    } catch (err) {
      console.error('Error fetching sales metrics:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch sales metrics');
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);

    try {
      await Promise.all([
        fetchOverviewStats(),
        fetchRevenueData(),
        fetchCustomerSegments(),
        fetchProductPerformance(),
        fetchSalesMetrics(),
      ]);
    } catch (err) {
      console.error('Error fetching analytics data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [timeframe]);

  return {
    overviewStats,
    revenueData,
    customerSegments,
    productPerformance,
    salesMetrics,
    customerInsights,
    marketData,
    loading,
    error,
    refresh: fetchAllData,
  };
} 