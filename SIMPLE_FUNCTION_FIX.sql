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