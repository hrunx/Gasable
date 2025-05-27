-- Fix the bug in handle_new_user function where company_id variable was being set to itself
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_company_id UUID;
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
    RETURNING id INTO new_company_id;
    
    -- Update the user with the company_id
    UPDATE public.users
    SET company_id = new_company_id
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