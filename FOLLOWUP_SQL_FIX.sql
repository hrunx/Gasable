-- FOLLOW-UP SQL FIX
-- Run this only if you got the "created_by column does not exist" error
-- This handles the remaining cleanup after the main fix

-- Remove redundant user_id column from users table if it exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'users' AND column_name = 'user_id') THEN
    ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_user_id_fkey;
    ALTER TABLE public.users DROP COLUMN user_id;
    RAISE NOTICE 'Removed redundant user_id column from users table';
  ELSE
    RAISE NOTICE 'user_id column does not exist in users table - no action needed';
  END IF;
END $$;

-- Ensure all permissions are granted
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;

-- DIAGNOSTIC: Check if trigger function exists and is working
SELECT 
  'Trigger function exists' as status,
  proname as function_name,
  prosrc as function_body
FROM pg_proc 
WHERE proname = 'handle_new_user';

-- DIAGNOSTIC: Check if trigger exists
SELECT 
  'Trigger exists' as status,
  tgname as trigger_name,
  tgrelid::regclass as table_name,
  tgenabled as enabled
FROM pg_trigger 
WHERE tgname = 'on_auth_user_created';

-- DIAGNOSTIC: Check auth.users vs public.users mismatch
SELECT 
  'Users in auth.users but not in public.users' as issue,
  COUNT(*) as count
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL;

-- DIAGNOSTIC: Show the missing users
SELECT 
  au.id,
  au.email,
  au.created_at,
  au.raw_user_meta_data
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL
ORDER BY au.created_at DESC
LIMIT 5;

-- FIX: Manually create missing public.users records for existing auth.users
INSERT INTO public.users (
  id,
  email,
  full_name,
  role,
  status,
  phone,
  created_at,
  updated_at
)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', split_part(au.email, '@', 1)),
  COALESCE(au.raw_user_meta_data->>'role', 'supplier'),
  'active',
  au.raw_user_meta_data->>'phone',
  au.created_at,
  au.updated_at
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- FIX: Manually create missing public.profiles records for existing auth.users
INSERT INTO public.profiles (
  id,
  full_name,
  phone,
  created_at,
  updated_at
)
SELECT 
  au.id,
  COALESCE(au.raw_user_meta_data->>'full_name', split_part(au.email, '@', 1)),
  au.raw_user_meta_data->>'phone',
  au.created_at,
  au.updated_at
FROM auth.users au
LEFT JOIN public.profiles pp ON au.id = pp.id
WHERE pp.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- RECREATE THE TRIGGER (in case it's not working)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Test query to verify table structure
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name IN ('users', 'profiles', 'companies') 
  AND column_name IN ('id', 'company_id', 'user_id', 'email', 'phone')
ORDER BY table_name, column_name;

-- Final verification
SELECT 
  'Final count check' as status,
  (SELECT COUNT(*) FROM auth.users) as auth_users_count,
  (SELECT COUNT(*) FROM public.users) as public_users_count,
  (SELECT COUNT(*) FROM public.profiles) as profiles_count; 