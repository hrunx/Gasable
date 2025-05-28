-- Debug User Company Association
-- This script helps diagnose and fix user-company association issues

-- 1. Check current user
SELECT 
  'Current authenticated user:' as info,
  auth.uid() as user_id,
  CASE 
    WHEN auth.uid() IS NULL THEN 'No authenticated user'
    ELSE 'User authenticated'
  END as status;

-- 2. Check if user exists in users table
SELECT 
  'User in users table:' as info,
  u.id,
  u.email,
  u.full_name,
  u.company_id,
  CASE 
    WHEN u.company_id IS NULL THEN 'No company_id in users table'
    ELSE 'Has company_id in users table'
  END as status
FROM users u 
WHERE u.id = auth.uid();

-- 3. Check if user exists in profiles table
SELECT 
  'User in profiles table:' as info,
  p.id,
  p.full_name,
  p.email,
  p.company_id,
  CASE 
    WHEN p.company_id IS NULL THEN 'No company_id in profiles table'
    ELSE 'Has company_id in profiles table'
  END as status
FROM profiles p 
WHERE p.id = auth.uid();

-- 4. Check if user has a company (as owner)
SELECT 
  'Companies owned by user:' as info,
  c.id as company_id,
  c.legal_name,
  c.user_id,
  CASE 
    WHEN c.user_id = auth.uid() THEN 'User is company owner'
    ELSE 'User is not owner'
  END as status
FROM companies c 
WHERE c.user_id = auth.uid();

-- 5. Check company_members association
SELECT 
  'Company members association:' as info,
  cm.company_id,
  cm.profile_id,
  cm.role,
  cm.status,
  c.legal_name as company_name
FROM company_members cm
JOIN companies c ON cm.company_id = c.id
WHERE cm.profile_id = auth.uid();

-- 6. Check all possible company associations
WITH user_companies AS (
  -- From companies table (as owner)
  SELECT c.id as company_id, 'owner' as source, c.legal_name
  FROM companies c 
  WHERE c.user_id = auth.uid()
  
  UNION
  
  -- From users table company_id
  SELECT u.company_id, 'users_table' as source, c.legal_name
  FROM users u
  JOIN companies c ON u.company_id = c.id
  WHERE u.id = auth.uid() AND u.company_id IS NOT NULL
  
  UNION
  
  -- From profiles table company_id
  SELECT p.company_id, 'profiles_table' as source, c.legal_name
  FROM profiles p
  JOIN companies c ON p.company_id = c.id
  WHERE p.id = auth.uid() AND p.company_id IS NOT NULL
  
  UNION
  
  -- From company_members table
  SELECT cm.company_id, 'company_members' as source, c.legal_name
  FROM company_members cm
  JOIN companies c ON cm.company_id = c.id
  WHERE cm.profile_id = auth.uid()
)
SELECT 
  'All company associations:' as info,
  company_id,
  source,
  legal_name
FROM user_companies;

-- 7. Fix missing company association if user owns a company but isn't in company_members
DO $$
DECLARE
  user_company_id UUID;
  member_exists BOOLEAN;
BEGIN
  -- Check if user owns a company
  SELECT id INTO user_company_id 
  FROM companies 
  WHERE user_id = auth.uid() 
  LIMIT 1;
  
  IF user_company_id IS NOT NULL THEN
    -- Check if user is in company_members
    SELECT EXISTS(
      SELECT 1 FROM company_members 
      WHERE company_id = user_company_id AND profile_id = auth.uid()
    ) INTO member_exists;
    
    IF NOT member_exists THEN
      -- Add user to company_members as owner
      INSERT INTO company_members (company_id, profile_id, role, status)
      VALUES (user_company_id, auth.uid(), 'owner', 'active');
      
      RAISE NOTICE 'Added user to company_members as owner for company %', user_company_id;
    ELSE
      RAISE NOTICE 'User already exists in company_members for company %', user_company_id;
    END IF;
    
    -- Update users table with company_id if missing
    UPDATE users 
    SET company_id = user_company_id 
    WHERE id = auth.uid() AND company_id IS NULL;
    
    -- Update profiles table with company_id if missing
    UPDATE profiles 
    SET company_id = user_company_id 
    WHERE id = auth.uid() AND company_id IS NULL;
    
  ELSE
    RAISE NOTICE 'User does not own any company';
  END IF;
END
$$;

-- 8. Final verification - show all associations after fix
SELECT 
  'Final verification:' as info,
  'Users table' as source,
  u.company_id,
  c.legal_name
FROM users u
LEFT JOIN companies c ON u.company_id = c.id
WHERE u.id = auth.uid()

UNION ALL

SELECT 
  'Final verification:' as info,
  'Profiles table' as source,
  p.company_id,
  c.legal_name
FROM profiles p
LEFT JOIN companies c ON p.company_id = c.id
WHERE p.id = auth.uid()

UNION ALL

SELECT 
  'Final verification:' as info,
  'Company members' as source,
  cm.company_id,
  c.legal_name
FROM company_members cm
JOIN companies c ON cm.company_id = c.id
WHERE cm.profile_id = auth.uid()

UNION ALL

SELECT 
  'Final verification:' as info,
  'Company owner' as source,
  c.id as company_id,
  c.legal_name
FROM companies c
WHERE c.user_id = auth.uid();

SELECT 'User company association debug completed' as status; 