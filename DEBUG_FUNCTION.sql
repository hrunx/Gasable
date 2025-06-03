-- ==========================================
-- DEBUG FUNCTION TO BYPASS RLS
-- ==========================================

-- Create a function that can access data without RLS restrictions
CREATE OR REPLACE FUNCTION get_user_assignments_debug(target_company_id uuid)
RETURNS TABLE (
    id uuid,
    product_id uuid,
    zone_id uuid,
    company_id uuid,
    store_id uuid,
    override_base_price numeric,
    override_b2b_price numeric,
    override_b2c_price numeric,
    override_min_order_quantity integer,
    is_active boolean,
    priority integer,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
) 
SECURITY DEFINER
LANGUAGE sql
AS $$
    SELECT 
        pza.id,
        pza.product_id,
        pza.zone_id,
        pza.company_id,
        pza.store_id,
        pza.override_base_price,
        pza.override_b2b_price,
        pza.override_b2c_price,
        pza.override_min_order_quantity,
        pza.is_active,
        pza.priority,
        pza.created_at,
        pza.updated_at
    FROM product_zone_assignments pza
    WHERE pza.company_id = target_company_id
    ORDER BY pza.created_at DESC;
$$;

-- Grant access to authenticated users
GRANT EXECUTE ON FUNCTION get_user_assignments_debug(uuid) TO authenticated;

-- Test the function
SELECT 'Debug function created successfully!' as status; 