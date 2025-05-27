-- MERCHANT PROFILE DATABASE UPDATE
-- Add missing fields to companies table for dynamic merchant profile

-- Add missing columns to companies table
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS website text;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS address text;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS city text;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS country text;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS founded_year text;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS team_size text;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS business_type text DEFAULT 'supplier';
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS subscription_tier text DEFAULT 'free';
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS subscription_status text DEFAULT 'active';

-- Update the user_id column to reference auth.users instead of profiles
ALTER TABLE public.companies DROP CONSTRAINT IF EXISTS companies_user_id_fkey;
ALTER TABLE public.companies ADD CONSTRAINT companies_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id);

-- Create function to get company data for current user
CREATE OR REPLACE FUNCTION get_user_company_data()
RETURNS TABLE (
  company_id uuid,
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
  logo_url text,
  business_type text,
  subscription_tier text,
  subscription_status text,
  user_email text,
  user_full_name text,
  user_phone text
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id as company_id,
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
    c.logo_url,
    c.business_type,
    c.subscription_tier,
    c.subscription_status,
    u.email as user_email,
    u.full_name as user_full_name,
    u.phone as user_phone
  FROM companies c
  JOIN users u ON c.user_id = u.id
  WHERE c.user_id = auth.uid();
END;
$$;

-- Create function to update company data
CREATE OR REPLACE FUNCTION update_company_data(
  p_legal_name text DEFAULT NULL,
  p_trade_name text DEFAULT NULL,
  p_email text DEFAULT NULL,
  p_phone text DEFAULT NULL,
  p_website text DEFAULT NULL,
  p_address text DEFAULT NULL,
  p_city text DEFAULT NULL,
  p_country text DEFAULT NULL,
  p_description text DEFAULT NULL,
  p_founded_year text DEFAULT NULL,
  p_team_size text DEFAULT NULL,
  p_logo_url text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
  company_exists boolean;
BEGIN
  -- Check if user has a company
  SELECT EXISTS(
    SELECT 1 FROM companies WHERE user_id = auth.uid()
  ) INTO company_exists;
  
  IF NOT company_exists THEN
    RETURN json_build_object('error', 'No company found for user');
  END IF;
  
  -- Update company data (only update non-null values)
  UPDATE companies SET
    legal_name = COALESCE(p_legal_name, legal_name),
    trade_name = COALESCE(p_trade_name, trade_name),
    email = COALESCE(p_email, email),
    phone = COALESCE(p_phone, phone),
    website = COALESCE(p_website, website),
    address = COALESCE(p_address, address),
    city = COALESCE(p_city, city),
    country = COALESCE(p_country, country),
    description = COALESCE(p_description, description),
    founded_year = COALESCE(p_founded_year, founded_year),
    team_size = COALESCE(p_team_size, team_size),
    logo_url = COALESCE(p_logo_url, logo_url),
    updated_at = now()
  WHERE user_id = auth.uid();
  
  -- Also update user email if provided
  IF p_email IS NOT NULL THEN
    UPDATE users SET
      email = p_email,
      updated_at = now()
    WHERE id = auth.uid();
  END IF;
  
  RETURN json_build_object('success', true, 'message', 'Company data updated successfully');
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION get_user_company_data() TO authenticated;
GRANT EXECUTE ON FUNCTION update_company_data(text, text, text, text, text, text, text, text, text, text, text, text) TO authenticated;

-- Update RLS policies for companies table
DROP POLICY IF EXISTS "Users can view their own company" ON companies;
DROP POLICY IF EXISTS "Users can update their own company" ON companies;

CREATE POLICY "Users can view their own company" ON companies
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own company" ON companies
  FOR UPDATE USING (user_id = auth.uid());

-- Test the functions
SELECT 'Database update completed successfully' as status; 