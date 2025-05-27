-- DEBUG MERCHANT PROFILE ISSUES
-- Run this in Supabase SQL Editor to diagnose problems

-- 1. Check if functions exist
SELECT 
  proname as function_name,
  prosecdef as security_definer,
  proacl as permissions
FROM pg_proc 
WHERE proname IN ('get_user_company_data', 'update_company_data');

-- 2. Check companies table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'companies' 
ORDER BY ordinal_position;

-- 3. Check if current user has a company record
SELECT 
  c.id,
  c.legal_name,
  c.user_id,
  u.email as user_email
FROM companies c
LEFT JOIN users u ON c.user_id = u.id
WHERE c.user_id = auth.uid();

-- 4. Check RLS policies on companies table
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
WHERE tablename = 'companies';

-- 5. Test the get_user_company_data function directly
SELECT * FROM get_user_company_data();

-- 6. Check if user exists in users table
SELECT id, email, full_name FROM users WHERE id = auth.uid();

-- 7. Check auth.uid() value
SELECT auth.uid() as current_user_id;

-- 8. If no company exists, create a basic one for testing
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM companies WHERE user_id = auth.uid()) THEN
    INSERT INTO companies (
      legal_name,
      user_id,
      business_type,
      subscription_tier,
      subscription_status
    ) VALUES (
      'Test Company',
      auth.uid(),
      'supplier',
      'free',
      'active'
    );
    RAISE NOTICE 'Created test company for user';
  ELSE
    RAISE NOTICE 'Company already exists for user';
  END IF;
END $$; 