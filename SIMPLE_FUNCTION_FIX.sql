-- SIMPLE FUNCTION FIX - Just fix the get_user_company_data function
-- This script only fixes the data type mismatch issue

-- 1. Drop the existing function completely
DROP FUNCTION IF EXISTS get_user_company_data();

-- 2. Recreate with correct data types
CREATE OR REPLACE FUNCTION get_user_company_data()
RETURNS TABLE (
  id uuid,
  legal_name text,
  trade_name text,
  email text,
  phone text,
  website text,
  address text,
  city text,
  country text,
  description text,
  founded_year text,
  team_size text,
  user_id uuid
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.legal_name,
    c.trade_name,
    c.email,
    c.phone,
    c.website,
    c.address,
    c.city,
    c.country,
    c.description,
    c.founded_year,
    c.team_size,
    c.user_id
  FROM companies c
  WHERE c.user_id = auth.uid();
END;
$$;

-- 3. Grant permissions
GRANT EXECUTE ON FUNCTION get_user_company_data() TO authenticated;

SELECT 'Function get_user_company_data recreated successfully!' as status;

-- ==========================================
-- COMPREHENSIVE DEBUG: Zone Assignment System
-- ==========================================

-- 1. Check if product_zone_assignments table exists and has data
SELECT 
    'Table exists check' as test_name,
    COUNT(*) as total_records
FROM product_zone_assignments;

-- 2. Check RLS status on the table  
SELECT 
    'RLS Status' as test_name,
    relname as table_name,
    relrowsecurity as rls_enabled
FROM pg_class 
WHERE relname = 'product_zone_assignments';

-- 3. Check what policies exist
SELECT 
    'Current Policies' as test_name,
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'product_zone_assignments';

-- 4. Check actual data in the table (bypassing RLS temporarily)
-- First disable RLS to see raw data
ALTER TABLE product_zone_assignments DISABLE ROW LEVEL SECURITY;

SELECT 
    'Raw data check' as test_name,
    pza.id,
    pza.product_id,
    pza.zone_id,
    pza.company_id,
    pza.store_id,
    pza.created_at,
    p.name as product_name,
    dz.name as zone_name
FROM product_zone_assignments pza
LEFT JOIN products p ON pza.product_id = p.id
LEFT JOIN delivery_zones dz ON pza.zone_id = dz.id
ORDER BY pza.created_at DESC
LIMIT 10;

-- 5. Check company IDs in the assignments
SELECT 
    'Company distribution' as test_name,
    company_id,
    COUNT(*) as assignment_count
FROM product_zone_assignments
GROUP BY company_id;

-- 6. Re-enable RLS
ALTER TABLE product_zone_assignments ENABLE ROW LEVEL SECURITY;

-- 7. Test the query with the actual company ID
SELECT 
    'Test company query' as test_name,
    COUNT(*) as accessible_records
FROM product_zone_assignments
WHERE company_id = '67ff6cd7-c09d-49b6-9b53-bab709608691';

-- 8. Check user authentication context
SELECT 
    'Auth context' as test_name,
    auth.uid() as current_user_id,
    (SELECT company_id FROM users WHERE id = auth.uid()) as user_company_id;

-- 9. Check if user exists in users table
SELECT 
    'User lookup' as test_name,
    u.id,
    u.email,
    u.company_id,
    cm.company_id as member_company_id
FROM users u
LEFT JOIN company_members cm ON u.id = cm.profile_id
WHERE u.id = auth.uid();

-- 10. Final working policy test
CREATE OR REPLACE POLICY "Debug - Allow all for company" ON product_zone_assignments
    FOR ALL USING (
        company_id IN (
            SELECT company_id FROM users 
            WHERE id = auth.uid() AND company_id IS NOT NULL
        )
    );

-- Test the new policy
SELECT 
    'Final policy test' as test_name,
    COUNT(*) as accessible_with_new_policy
FROM product_zone_assignments; 