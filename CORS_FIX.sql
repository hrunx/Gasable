-- CORS AND RLS DIAGNOSTIC AND FIX SCRIPT
-- This script diagnoses and fixes potential RLS policy issues causing CORS errors

-- 1. Check current RLS policies on key tables
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename IN ('users', 'profiles', 'companies', 'company_members', 'roles')
ORDER BY tablename, policyname;

-- 2. Check if tables have RLS enabled
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename IN ('users', 'profiles', 'companies', 'company_members', 'roles')
ORDER BY tablename;

-- 3. Drop existing functions first to avoid return type conflicts
DROP FUNCTION IF EXISTS test_connection();
DROP FUNCTION IF EXISTS get_user_company_data();

-- 4. Temporarily disable RLS on problematic tables to test
-- (We'll re-enable with proper policies)

-- Disable RLS on roles table (it should be publicly readable)
ALTER TABLE public.roles DISABLE ROW LEVEL SECURITY;

-- Create a simple policy for roles table
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view roles" ON public.roles;
CREATE POLICY "Anyone can view roles" ON public.roles
  FOR SELECT USING (true);

-- 5. Check if profiles table has proper RLS policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (id = auth.uid() OR company_id IN (
    SELECT id FROM companies WHERE user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (id = auth.uid() OR company_id IN (
    SELECT id FROM companies WHERE user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (id = auth.uid() OR company_id IN (
    SELECT id FROM companies WHERE user_id = auth.uid()
  ));

-- 6. Ensure companies table has proper policies
DROP POLICY IF EXISTS "Users can view their own company" ON public.companies;
CREATE POLICY "Users can view their own company" ON public.companies
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own company" ON public.companies;
CREATE POLICY "Users can update their own company" ON public.companies
  FOR UPDATE USING (user_id = auth.uid());

-- 7. Create a simple test function to verify connectivity
CREATE OR REPLACE FUNCTION test_connection()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN json_build_object(
    'status', 'success',
    'message', 'Connection working',
    'user_id', auth.uid(),
    'timestamp', now()
  );
END;
$$;

GRANT EXECUTE ON FUNCTION test_connection() TO authenticated;
GRANT EXECUTE ON FUNCTION test_connection() TO anon;

-- 8. Create a simplified get_user_company_data function that returns TABLE instead of json
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

GRANT EXECUTE ON FUNCTION get_user_company_data() TO authenticated;

-- 9. Test the functions
SELECT 'Testing connection...' as test;
SELECT test_connection() as connection_test;

SELECT 'Testing company data function...' as test;
-- This will only work if run by an authenticated user

-- 10. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;

SELECT 'CORS and RLS fixes applied successfully!' as status; 