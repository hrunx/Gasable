-- MANUAL SQL FIX FOR FOREIGN KEY CONSTRAINT VIOLATION
-- Run this in Supabase Dashboard > SQL Editor

-- First, fix the companies table structure
-- The table has 'created_by' but we want 'user_id' to match our schema
ALTER TABLE public.companies DROP CONSTRAINT IF EXISTS companies_user_id_fkey;
ALTER TABLE public.companies RENAME COLUMN created_by TO user_id;

-- Fix the users table - remove redundant user_id column
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_user_id_fkey;
ALTER TABLE public.users DROP COLUMN IF EXISTS user_id;

-- Add missing columns to tables if they don't exist
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS subscription_tier text DEFAULT 'free';
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS subscription_status text DEFAULT 'active';
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS business_type text DEFAULT 'supplier';

-- Add company_id to profiles table if it doesn't exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company_id uuid;

-- Add missing columns to users table if they don't exist
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS last_login_at timestamp with time zone;

-- Fix foreign key constraints
ALTER TABLE public.companies ADD CONSTRAINT companies_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id);

ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_company_id_fkey;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_company_id_fkey 
  FOREIGN KEY (company_id) REFERENCES companies(id);

-- Drop the existing trigger first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Fix the trigger function to create records in the correct order
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_company_id UUID;
  company_name_from_signup TEXT;
  free_plan_id UUID;
BEGIN
  -- Extract company name from user metadata
  company_name_from_signup := NEW.raw_user_meta_data->>'company_name';
  
  -- 1. Create user record in users table (WITHOUT company_id initially to avoid FK violation)
  INSERT INTO public.users (
    id,
    email,
    full_name,
    role,
    status,
    phone
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'supplier'),
    'active',
    NEW.raw_user_meta_data->>'phone'
  );

  -- 2. Create profile record (WITHOUT company_id initially)
  INSERT INTO public.profiles (
    id,
    full_name,
    phone
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'phone'
  );

  -- 3. Create company record if company_name is provided
  IF company_name_from_signup IS NOT NULL AND company_name_from_signup != '' THEN
    INSERT INTO public.companies (
      legal_name,
      trade_name,
      email,
      phone,
      subscription_tier,
      subscription_status,
      user_id,
      business_type,
      onboarding_step,
      onboarding_complete
    ) VALUES (
      company_name_from_signup,
      company_name_from_signup,
      NEW.email,
      NEW.raw_user_meta_data->>'phone',
      'free',
      'active',
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'business_type', 'supplier'),
      0,
      false
    )
    RETURNING id INTO new_company_id;
    
    -- 4. NOW update user record with company_id (after company exists)
    UPDATE public.users
    SET company_id = new_company_id
    WHERE id = NEW.id;
    
    -- 5. NOW update profile record with company_id (after company exists)
    UPDATE public.profiles
    SET company_id = new_company_id
    WHERE id = NEW.id;
    
    -- 6. Add user as company member with owner role
    INSERT INTO public.company_members (
      company_id,
      profile_id,
      role,
      status
    ) VALUES (
      new_company_id,
      NEW.id,
      'owner',
      'active'
    );
    
    -- 7. Get or create free subscription plan
    SELECT id INTO free_plan_id 
    FROM public.subscription_plans 
    WHERE name = 'Free Plan' 
    LIMIT 1;
    
    -- If no free plan exists, create one
    IF free_plan_id IS NULL THEN
      INSERT INTO public.subscription_plans (
        name,
        description,
        monthly_price,
        yearly_price,
        is_active
      ) VALUES (
        'Free Plan',
        'Basic free plan for new suppliers',
        0,
        0,
        true
      )
      RETURNING id INTO free_plan_id;
    END IF;
    
    -- 8. Create supplier subscription (automatically on free plan)
    INSERT INTO public.supplier_subscriptions (
      company_id,
      plan_id,
      status,
      billing_cycle,
      start_date,
      auto_renew
    ) VALUES (
      new_company_id,
      free_plan_id,
      'active',
      'monthly',
      now(),
      true
    );
    
    -- 9. Initialize subscription usage tracking
    INSERT INTO public.subscription_usage (
      company_id,
      products_used,
      orders_used,
      gmv_used,
      branches_used,
      users_used,
      month
    ) VALUES (
      new_company_id,
      0,
      0,
      0,
      0,
      1,
      date_trunc('month', now())::date
    );
    
  END IF;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't block user creation
    RAISE NOTICE 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Fix any existing orphaned users (users with company_id that doesn't exist)
UPDATE public.users 
SET company_id = NULL 
WHERE company_id IS NOT NULL 
AND company_id NOT IN (SELECT id FROM public.companies);

-- Fix any existing orphaned profiles (profiles with company_id that doesn't exist)
-- Only run this if the company_id column exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'profiles' AND column_name = 'company_id') THEN
    UPDATE public.profiles 
    SET company_id = NULL 
    WHERE company_id IS NOT NULL 
    AND company_id NOT IN (SELECT id FROM public.companies);
  END IF;
END $$;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;

-- Test the trigger function by checking if it exists
SELECT proname, prosrc FROM pg_proc WHERE proname = 'handle_new_user';

-- Check if trigger exists
SELECT tgname, tgrelid::regclass FROM pg_trigger WHERE tgname = 'on_auth_user_created';

-- FOLLOW-UP SQL FIX - Run this after the main fix
-- Only run this if you got the "created_by" column error

-- Remove redundant user_id column from users table if it exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'users' AND column_name = 'user_id') THEN
    ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_user_id_fkey;
    ALTER TABLE public.users DROP COLUMN user_id;
  END IF;
END $$;

-- Ensure all permissions are granted
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;

-- Test the trigger function by checking if it exists
SELECT proname, prosrc FROM pg_proc WHERE proname = 'handle_new_user';

-- Check if trigger exists
SELECT tgname, tgrelid::regclass FROM pg_trigger WHERE tgname = 'on_auth_user_created'; 