-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Update the handle_new_user function with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  company_id UUID;
BEGIN
  -- Create user profile first without company_id
  INSERT INTO public.users (
    id,
    email,
    full_name,
    role,
    status
  ) VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    COALESCE(NEW.raw_user_meta_data->>'role', 'supplier'),
    'active'
  );

  -- Check if user has company_name in metadata
  IF NEW.raw_user_meta_data->>'company_name' IS NOT NULL THEN
    -- Create a new company
    INSERT INTO public.companies (
      name,
      email,
      subscription_tier,
      subscription_status
    ) VALUES (
      NEW.raw_user_meta_data->>'company_name',
      NEW.email,
      'free',
      'active'
    )
    RETURNING id INTO company_id;
    
    -- Update the user with the company_id
    UPDATE public.users
    SET company_id = company_id
    WHERE id = NEW.id;
  END IF;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error (in a real system, you'd want better error logging)
    RAISE NOTICE 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW; -- Still return NEW to avoid blocking the auth user creation
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add policies for public inserts during signup
-- First check if the policy already exists before creating it
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'users' 
    AND policyname = 'Allow public inserts during signup'
  ) THEN
    EXECUTE 'CREATE POLICY "Allow public inserts during signup" ON public.users FOR INSERT TO public WITH CHECK (true)';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'companies' 
    AND policyname = 'Enable company creation during signup'
  ) THEN
    EXECUTE 'CREATE POLICY "Enable company creation during signup" ON public.companies FOR INSERT TO public WITH CHECK (true)';
  END IF;
END
$$;