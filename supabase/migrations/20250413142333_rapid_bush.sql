/*
  # Add Demo User

  1. New User
    - Add a user with email ali@gasable.com and password 123123123
    - This migration adds the user to the auth.users table and creates a corresponding entry in public.users
    - Creates a company for the user and associates it with the user
*/

-- Create a company for the user if it doesn't exist
DO $$
DECLARE
  new_company_id UUID;
  new_user_id UUID;
  user_exists BOOLEAN;
BEGIN
  -- Check if user already exists
  SELECT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'ali@gasable.com'
  ) INTO user_exists;

  -- Only proceed if user doesn't exist
  IF NOT user_exists THEN
    -- Insert company and get its ID
    INSERT INTO public.companies (
      name,
      cr_number,
      vat_number,
      phone,
      email,
      subscription_tier,
      subscription_status,
      created_at,
      updated_at
    )
    VALUES (
      'Ali Energy Solutions',
      'CR987654321',
      'VAT123456789',
      '+966-555-123-4567',
      'info@alienergy.com',
      'basic',
      'active',
      now(),
      now()
    )
    RETURNING id INTO new_company_id;

    -- Generate a new UUID for the user
    SELECT gen_random_uuid() INTO new_user_id;

    -- Insert user into auth.users
    -- Note: In a real migration, we would use a secure password hash, but for demo purposes we're using a simple hash
    INSERT INTO auth.users (
      id,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_app_meta_data,
      raw_user_meta_data,
      is_super_admin
    )
    VALUES (
      new_user_id,
      'ali@gasable.com',
      crypt('123123123', gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"provider": "email", "providers": ["email"]}',
      '{"full_name": "Ali Gasable", "role": "supplier"}',
      false
    );

    -- Create corresponding entry in public.users
    INSERT INTO public.users (
      id,
      email,
      full_name,
      role,
      status,
      company_id,
      created_at,
      updated_at
    )
    VALUES (
      new_user_id,
      'ali@gasable.com',
      'Ali Gasable',
      'supplier',
      'active',
      new_company_id,
      now(),
      now()
    );
  END IF;
END $$;