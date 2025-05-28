import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useAuth } from '../auth';

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  target?: number;
  status: 'good' | 'warning' | 'critical';
  trend?: 'up' | 'down' | 'stable';
  icon: string;
}

export interface PerformanceData {
  kpi: PerformanceMetric[];
  operational: PerformanceMetric[];
  pricing: PerformanceMetric[];
  market: PerformanceMetric[];
  flexibility: PerformanceMetric[];
  lastUpdated: string;
}

export const usePerformanceMetrics = () => {
  const [data, setData] = useState<PerformanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchMetrics = async () => {
    if (!user) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data: result, error: dbError } = await supabase.rpc(
        'get_company_performance_metrics',
        { user_id: user.id }
      );

      if (dbError) {
        console.error('Database error:', dbError);
        setError(`Failed to load performance metrics: ${dbError.message}`);
        return;
      }

      if (!result?.success) {
        setError(result?.error || 'Failed to load performance metrics');
        return;
      }

      const metrics = result.data;
      
      // Transform the simple data into the expected format
      const transformedData: PerformanceData = {
        kpi: [
          {
            name: 'Delivery Time',
            value: metrics.delivery_time || 0,
            unit: 'days',
            target: 3,
            status: 'warning',
            trend: 'stable',
            icon: 'Clock'
          },
          {
            name: 'Order Accuracy',
            value: metrics.order_accuracy || 0,
            unit: '%',
            target: 98,
            status: 'warning',
            trend: 'stable',
            icon: 'CheckCircle'
          },
          {
            name: 'Return Rate',
            value: metrics.return_rate || 0,
            unit: '%',
            target: 2,
            status: 'good',
            trend: 'stable',
            icon: 'RotateCcw'
          },
          {
            name: 'Response Time',
            value: metrics.response_time || 0,
            unit: 'hours',
            target: 24,
            status: 'warning',
            trend: 'stable',
            icon: 'MessageSquare'
          },
          {
            name: 'Market Share',
            value: metrics.market_share || 0,
            unit: '%',
            target: 5,
            status: 'warning',
            trend: 'stable',
            icon: 'PieChart'
          },
          {
            name: 'Supply Chain Reliability',
            value: metrics.supply_chain_reliability || 0,
            unit: '%',
            target: 95,
            status: 'warning',
            trend: 'stable',
            icon: 'Truck'
          }
        ],
        operational: [
          {
            name: 'Supply Chain Reliability',
            value: metrics.supply_chain_reliability || 0,
            unit: '%',
            target: 95,
            status: 'warning',
            trend: 'stable',
            icon: 'Truck'
          },
          {
            name: 'Uptime',
            value: metrics.uptime || 100,
            unit: '%',
            target: 99,
            status: 'good',
            trend: 'stable',
            icon: 'Activity'
          },
          {
            name: 'On-time Delivery',
            value: metrics.on_time_delivery || 0,
            unit: '%',
            target: 95,
            status: 'warning',
            trend: 'stable',
            icon: 'Clock'
          }
        ],
        pricing: [
          {
            name: 'Market Average',
            value: metrics.market_average_price || 0,
            unit: '$',
            status: 'warning',
            trend: 'stable',
            icon: 'DollarSign'
          },
          {
            name: 'Your Pricing',
            value: metrics.your_pricing || 0,
            unit: '$',
            status: 'warning',
            trend: 'stable',
            icon: 'Tag'
          },
          {
            name: 'Price Perception',
            value: metrics.price_perception || 0,
            unit: '/10',
            target: 8,
            status: 'warning',
            trend: 'stable',
            icon: 'Star'
          }
        ],
        market: [
          {
            name: 'Current Share',
            value: metrics.current_share || 0,
            unit: '%',
            target: 5,
            status: 'warning',
            trend: 'stable',
            icon: 'PieChart'
          },
          {
            name: 'YoY Growth',
            value: metrics.yoy_growth || 0,
            unit: '%',
            target: 15,
            status: 'warning',
            trend: 'stable',
            icon: 'TrendingUp'
          },
          {
            name: 'Market Position',
            value: metrics.market_position || 0,
            unit: 'rank',
            status: 'warning',
            trend: 'stable',
            icon: 'Award'
          }
        ],
        flexibility: [
          {
            name: 'MOQ Adjustments',
            value: metrics.moq_adjustments || 0,
            unit: '%',
            target: 80,
            status: 'warning',
            trend: 'stable',
            icon: 'Package'
          },
          {
            name: 'Product Customization',
            value: metrics.product_customization || 0,
            unit: '%',
            target: 70,
            status: 'warning',
            trend: 'stable',
            icon: 'Settings'
          },
          {
            name: 'Bundled Offers',
            value: metrics.bundled_offers || 0,
            unit: '%',
            target: 60,
            status: 'warning',
            trend: 'stable',
            icon: 'Package'
          }
        ],
        lastUpdated: metrics.last_updated || new Date().toISOString()
      };

      setData(transformedData);
    } catch (err) {
      console.error('Error fetching performance metrics:', err);
      setError('Failed to load performance metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, [user]);

  const refresh = () => {
    fetchMetrics();
  };

  const getMetricsByCategory = (category: keyof PerformanceData) => {
    if (!data) return [];
    return data[category] || [];
  };

  return {
    performanceData: data,
    loading,
    error,
    refreshMetrics: refresh,
    getMetricsByCategory
  };
}; 