-- Debug Performance Metrics
-- Run this to test the performance metrics functions step by step

-- 1. Check if user has a company
SELECT 
    'User Company Check' as test_name,
    u.id as user_id,
    u.email,
    c.id as company_id,
    c.legal_name,
    c.created_by
FROM auth.users u
LEFT JOIN public.companies c ON c.created_by = u.id
WHERE u.email = (SELECT email FROM auth.users WHERE id = auth.uid())
LIMIT 1;

-- 2. Check companies table structure
SELECT 
    'Companies Table Columns' as test_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'companies'
ORDER BY ordinal_position;

-- 3. Check orders table structure
SELECT 
    'Orders Table Columns' as test_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'orders'
ORDER BY ordinal_position;

-- 4. Test the main function with current user
SELECT 
    'Performance Metrics Test' as test_name,
    public.get_company_performance_metrics(auth.uid()) as result;

-- 5. Check if there are any orders for the user's company
SELECT 
    'Orders Count Check' as test_name,
    COUNT(*) as total_orders,
    COUNT(CASE WHEN delivery_status = 'delivered' THEN 1 END) as delivered_orders,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_orders
FROM public.orders o
JOIN public.companies c ON o.company_id = c.id
WHERE c.created_by = auth.uid();

-- 6. Check if there are any products for the user's company
SELECT 
    'Products Count Check' as test_name,
    COUNT(*) as total_products,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active_products
FROM public.products p
JOIN public.companies c ON p.company_id = c.id
WHERE c.created_by = auth.uid(); 