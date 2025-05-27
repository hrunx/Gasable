/*
  # User Roles and Permissions

  1. New Functions
    - `handle_new_user` - Function to create a user profile in public.users when a new user is created in auth.users
    - `check_user_role` - Function to check if a user has a specific role

  2. New Triggers
    - `on_auth_user_created` - Trigger to call handle_new_user when a new user is created in auth.users

  3. Updated RLS Policies
    - Update RLS policies to use user roles for access control
*/

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  company_id uuid;
BEGIN
  -- Check if user has company_name in metadata
  IF raw_user_meta_data->>'company_name' IS NOT NULL THEN
    -- Create a new company
    INSERT INTO public.companies (
      name,
      email,
      subscription_tier,
      subscription_status
    ) VALUES (
      raw_user_meta_data->>'company_name',
      NEW.email,
      'free',
      'active'
    )
    RETURNING id INTO company_id;
    
    -- Create user profile with company_id
    INSERT INTO public.users (
      id,
      email,
      full_name,
      role,
      company_id
    ) VALUES (
      NEW.id,
      NEW.email,
      raw_user_meta_data->>'full_name',
      COALESCE(raw_user_meta_data->>'role', 'supplier'),
      company_id
    );
  ELSE
    -- Create user profile without company_id
    INSERT INTO public.users (
      id,
      email,
      full_name,
      role
    ) VALUES (
      NEW.id,
      NEW.email,
      raw_user_meta_data->>'full_name',
      COALESCE(raw_user_meta_data->>'role', 'supplier')
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call handle_new_user when a new user is created
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to check if a user has a specific role
CREATE OR REPLACE FUNCTION public.check_auth_role(required_role text)
RETURNS BOOLEAN AS $$
DECLARE
  current_role text;
BEGIN
  -- Get the current user's role from the public.users table
  SELECT role INTO current_role
  FROM public.users
  WHERE id = auth.uid();
  
  -- Check if the user has the required role
  RETURN current_role = required_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update RLS policies for users table
DROP POLICY IF EXISTS "Admins can read all user data" ON public.users;
CREATE POLICY "Admins can read all user data" ON public.users
  FOR SELECT USING (check_auth_role('admin'));

DROP POLICY IF EXISTS "Admins can update all user data" ON public.users;
CREATE POLICY "Admins can update all user data" ON public.users
  FOR UPDATE USING (check_auth_role('admin'));

-- Update RLS policies for companies table
DROP POLICY IF EXISTS "Admins can read all company data" ON public.companies;
CREATE POLICY "Admins can read all company data" ON public.companies
  FOR SELECT USING (check_auth_role('admin'));

DROP POLICY IF EXISTS "Admins can update all company data" ON public.companies;
CREATE POLICY "Admins can update all company data" ON public.companies
  FOR UPDATE USING (check_auth_role('admin'));

-- Update RLS policies for products table
DROP POLICY IF EXISTS "Admins can read all products" ON public.products;
CREATE POLICY "Admins can read all products" ON public.products
  FOR SELECT USING (check_auth_role('admin'));

-- Update RLS policies for stores table
DROP POLICY IF EXISTS "Admins can read all stores" ON public.stores;
CREATE POLICY "Admins can read all stores" ON public.stores
  FOR SELECT USING (check_auth_role('admin'));

-- Update RLS policies for subscription plans
DROP POLICY IF EXISTS "Admins can manage subscription plans" ON public.subscription_plans;
CREATE POLICY "Admins can manage subscription plans" ON public.subscription_plans
  FOR ALL USING (check_auth_role('admin'));

-- Update RLS policies for subscription tiers
DROP POLICY IF EXISTS "Admins can manage subscription tiers" ON public.subscription_tiers;
CREATE POLICY "Admins can manage subscription tiers" ON public.subscription_tiers
  FOR ALL USING (check_auth_role('admin'));

-- Update RLS policies for supplier subscriptions
DROP POLICY IF EXISTS "Admins can manage all subscriptions" ON public.supplier_subscriptions;
CREATE POLICY "Admins can manage all subscriptions" ON public.supplier_subscriptions
  FOR ALL USING (check_auth_role('admin'));

-- Update RLS policies for subscription addons
DROP POLICY IF EXISTS "Admins can manage all addons" ON public.subscription_addons;
CREATE POLICY "Admins can manage all addons" ON public.subscription_addons
  FOR ALL USING (check_auth_role('admin'));

-- Update RLS policies for subscription invoices
DROP POLICY IF EXISTS "Admins can manage all invoices" ON public.subscription_invoices;
CREATE POLICY "Admins can manage all invoices" ON public.subscription_invoices
  FOR ALL USING (check_auth_role('admin'));

-- Update RLS policies for subscription usage
DROP POLICY IF EXISTS "Admins can manage all usage data" ON public.subscription_usage;
CREATE POLICY "Admins can manage all usage data" ON public.subscription_usage
  FOR ALL USING (check_auth_role('admin'));