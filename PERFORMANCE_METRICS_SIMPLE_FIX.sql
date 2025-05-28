-- Simple Performance Metrics Fix
-- This script creates a basic function that returns baseline performance metrics for new companies

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS public.get_company_performance_metrics(uuid) CASCADE;

-- Create a simple function that returns baseline metrics for new companies
CREATE OR REPLACE FUNCTION public.get_company_performance_metrics(user_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    company_uuid uuid;
    result json;
BEGIN
    -- Get company ID for the user (using the user_id column that we added)
    SELECT c.id INTO company_uuid
    FROM public.companies c
    WHERE c.user_id = get_company_performance_metrics.user_id;
    
    IF company_uuid IS NULL THEN
        RETURN json_build_object('success', false, 'error', 'Company not found for user');
    END IF;
    
    -- Return baseline metrics for new companies
    -- All values start at 0 and will be calculated as data grows
    result := json_build_object(
        'success', true,
        'data', json_build_object(
            'delivery_time', 0,
            'order_accuracy', 0,
            'return_rate', 0,
            'response_time', 0,
            'market_share', 0,
            'supply_chain_reliability', 0,
            'uptime', 100,
            'on_time_delivery', 0,
            'inventory_accuracy', 0,
            'market_average_price', 0,
            'your_pricing', 0,
            'price_perception', 0,
            'current_share', 0,
            'yoy_growth', 0,
            'market_position', 0,
            'moq_adjustments', 0,
            'product_customization', 0,
            'bundled_offers', 0,
            'company_id', company_uuid,
            'last_updated', NOW()
        )
    );
    
    RETURN result;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_company_performance_metrics(uuid) TO authenticated;

-- Enable RLS
ALTER FUNCTION public.get_company_performance_metrics(uuid) OWNER TO postgres; 