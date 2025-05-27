-- DEBUG SCRIPT FOR COMPANY_MEMBERS TABLE ISSUES
-- Run this in Supabase SQL Editor to diagnose the problem

-- 1. Check company_members table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'company_members' 
ORDER BY ordinal_position;

-- 2. Check constraints on company_members table
SELECT 
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
LEFT JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.table_name = 'company_members';

-- 3. Check current records in company_members
SELECT 
    cm.*,
    c.legal_name as company_name,
    p.full_name as profile_name
FROM company_members cm
LEFT JOIN companies c ON cm.company_id = c.id
LEFT JOIN profiles p ON cm.profile_id = p.id
ORDER BY cm.created_at DESC;

-- 4. Check if there are any triggers on company_members
SELECT 
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'company_members';

-- 5. Test the add_company_member function with debug output
CREATE OR REPLACE FUNCTION debug_add_company_member(
  p_full_name text,
  p_job_position text,
  p_email text DEFAULT NULL,
  p_phone text DEFAULT NULL,
  p_profile_image_url text DEFAULT NULL,
  p_years_experience integer DEFAULT 0,
  p_expertise text[] DEFAULT ARRAY[]::text[],
  p_role_name text DEFAULT 'employee'
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  company_record companies%ROWTYPE;
  role_record roles%ROWTYPE;
  new_profile_id uuid;
  debug_info json;
BEGIN
  -- Get user's company
  SELECT * INTO company_record
  FROM companies 
  WHERE user_id = auth.uid();
  
  IF NOT FOUND THEN
    RETURN json_build_object('error', 'No company found for user', 'user_id', auth.uid());
  END IF;
  
  -- Get role by name (prevent adding owner role)
  SELECT * INTO role_record
  FROM roles 
  WHERE name = p_role_name AND name != 'owner';
  
  IF NOT FOUND THEN
    RETURN json_build_object('error', 'Invalid role specified or owner role not allowed', 'role_name', p_role_name);
  END IF;
  
  -- Generate a new UUID for the profile
  new_profile_id := gen_random_uuid();
  
  -- Create debug info
  debug_info := json_build_object(
    'company_id', company_record.id,
    'role_id', role_record.id,
    'new_profile_id', new_profile_id,
    'user_id', auth.uid()
  );
  
  -- Create new profile for the employee
  INSERT INTO profiles (
    id,
    full_name,
    job_position,
    email,
    phone,
    profile_image_url,
    years_experience,
    expertise,
    employee_status,
    company_id,
    hire_date,
    created_at,
    updated_at
  ) VALUES (
    new_profile_id,
    p_full_name,
    p_job_position,
    p_email,
    p_phone,
    p_profile_image_url,
    p_years_experience,
    p_expertise,
    'active',
    company_record.id,
    CURRENT_DATE,
    now(),
    now()
  );
  
  -- Add to company_members with explicit error handling
  BEGIN
    INSERT INTO company_members (
      company_id,
      profile_id,
      role,
      role_id,
      status,
      created_by,
      created_at,
      updated_at
    ) VALUES (
      company_record.id,
      new_profile_id,
      p_role_name,
      role_record.id,
      'active',
      auth.uid(),
      now(),
      now()
    );
  EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object(
      'error', 'Failed to insert into company_members',
      'sql_error', SQLERRM,
      'sql_state', SQLSTATE,
      'debug_info', debug_info
    );
  END;
  
  RETURN json_build_object(
    'success', true, 
    'message', 'Employee added successfully',
    'profile_id', new_profile_id,
    'debug_info', debug_info
  );
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION debug_add_company_member(text, text, text, text, text, integer, text[], text) TO authenticated; 

-- 1. Check current constraint on company_members table
SELECT 
    tc.constraint_name,
    tc.constraint_type,
    cc.check_clause
FROM information_schema.table_constraints AS tc 
JOIN information_schema.check_constraints AS cc
    ON tc.constraint_name = cc.constraint_name
WHERE tc.table_name = 'company_members' 
    AND tc.constraint_type = 'CHECK';

-- 2. Check if roles table exists and what roles are available
SELECT 
    'Roles table exists' as status,
    COUNT(*) as role_count
FROM roles;

SELECT name, display_name FROM roles ORDER BY name;

-- 3. Check if functions exist
SELECT 
    routine_name,
    routine_type
FROM information_schema.routines 
WHERE routine_name LIKE '%company_member%'
    AND routine_schema = 'public';

-- 4. Test inserting a role directly to see what constraint allows
-- This will show us exactly what the constraint is checking
SELECT 
    'Testing constraint with employee role' as test,
    CASE 
        WHEN 'employee' = ANY (ARRAY['owner'::text, 'admin'::text, 'staff'::text, 'storekeeper'::text, 'driver'::text, 'employee'::text])
        THEN 'SHOULD PASS'
        ELSE 'WILL FAIL'
    END as result;

-- 5. Check current company_members records
SELECT 
    cm.role,
    cm.status,
    r.name as role_name,
    r.display_name
FROM company_members cm
LEFT JOIN roles r ON cm.role_id = r.id
ORDER BY cm.created_at DESC;

-- 6. Try to recreate the add_company_member function with a simpler version
CREATE OR REPLACE FUNCTION add_company_member(
  p_full_name text,
  p_job_position text,
  p_email text DEFAULT NULL,
  p_phone text DEFAULT NULL,
  p_profile_image_url text DEFAULT NULL,
  p_years_experience integer DEFAULT 0,
  p_expertise text[] DEFAULT ARRAY[]::text[],
  p_role_name text DEFAULT 'employee'
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  company_record companies%ROWTYPE;
  role_record roles%ROWTYPE;
  new_profile_id uuid;
BEGIN
  -- Get user's company
  SELECT * INTO company_record
  FROM companies 
  WHERE user_id = auth.uid();
  
  IF NOT FOUND THEN
    RETURN json_build_object('error', 'No company found for user');
  END IF;
  
  -- Get role by name (prevent adding owner role)
  SELECT * INTO role_record
  FROM roles 
  WHERE name = p_role_name AND name != 'owner';
  
  IF NOT FOUND THEN
    RETURN json_build_object('error', 'Invalid role specified or owner role not allowed');
  END IF;
  
  -- Generate a new UUID for the profile
  new_profile_id := gen_random_uuid();
  
  -- Create new profile for the employee
  INSERT INTO profiles (
    id,
    full_name,
    job_position,
    email,
    phone,
    profile_image_url,
    years_experience,
    expertise,
    employee_status,
    company_id,
    hire_date,
    created_at,
    updated_at
  ) VALUES (
    new_profile_id,
    p_full_name,
    p_job_position,
    p_email,
    p_phone,
    p_profile_image_url,
    p_years_experience,
    p_expertise,
    'active',
    company_record.id,
    CURRENT_DATE,
    now(),
    now()
  );
  
  -- Add to company_members with explicit role mapping
  INSERT INTO company_members (
    company_id,
    profile_id,
    role,
    role_id,
    status,
    created_by,
    created_at,
    updated_at
  ) VALUES (
    company_record.id,
    new_profile_id,
    CASE 
      WHEN p_role_name = 'storekeeper' THEN 'staff'  -- Map to allowed constraint value
      WHEN p_role_name = 'driver' THEN 'staff'       -- Map to allowed constraint value  
      WHEN p_role_name = 'employee' THEN 'staff'     -- Map to allowed constraint value
      ELSE p_role_name 
    END,
    role_record.id,
    'active',
    auth.uid(),
    now(),
    now()
  );
  
  RETURN json_build_object(
    'success', true, 
    'message', 'Employee added successfully',
    'profile_id', new_profile_id
  );
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION add_company_member(text, text, text, text, text, integer, text[], text) TO authenticated;

SELECT 'Debug script completed - check results above' as status; 

-- COMPLETE COMPANY MEMBERS FUNCTIONS SETUP
-- This script creates all missing functions needed for the employee management system

-- 1. Create the get_company_members_with_details function
CREATE OR REPLACE FUNCTION get_company_members_with_details()
RETURNS TABLE (
  member_id uuid,
  profile_id uuid,
  company_id uuid,
  full_name text,
  job_position text,
  email text,
  phone text,
  profile_image_url text,
  years_experience integer,
  expertise text[],
  role_id uuid,
  role_name text,
  role_display_name text,
  role_permissions jsonb,
  member_status text,
  employee_status text,
  hire_date date,
  created_at timestamp with time zone
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    gen_random_uuid() as member_id,
    p.id as profile_id,
    cm.company_id,
    p.full_name,
    p.job_position,
    p.email,
    p.phone,
    p.profile_image_url,
    p.years_experience,
    p.expertise,
    cm.role_id,
    r.name as role_name,
    r.display_name as role_display_name,
    r.permissions as role_permissions,
    cm.status as member_status,
    p.employee_status,
    p.hire_date,
    cm.created_at
  FROM company_members cm
  JOIN profiles p ON cm.profile_id = p.id
  LEFT JOIN roles r ON cm.role_id = r.id
  JOIN companies c ON cm.company_id = c.id
  WHERE c.user_id = auth.uid()
    AND p.id != auth.uid() -- Exclude the company owner
    AND COALESCE(r.name, 'staff') != 'owner' -- Also exclude anyone with owner role
  ORDER BY cm.created_at DESC;
END;
$$;

-- 2. Create the get_user_permissions function
CREATE OR REPLACE FUNCTION get_user_permissions()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_permissions jsonb;
  company_record companies%ROWTYPE;
BEGIN
  -- Get user's company
  SELECT * INTO company_record
  FROM companies 
  WHERE user_id = auth.uid();
  
  IF NOT FOUND THEN
    RETURN '{}'::jsonb;
  END IF;
  
  -- Check if user is company owner
  IF company_record.user_id = auth.uid() THEN
    -- Return owner permissions
    SELECT permissions INTO user_permissions
    FROM roles 
    WHERE name = 'owner';
    
    -- If no owner role exists, return full permissions
    IF user_permissions IS NULL THEN
      user_permissions := '{
        "company": {"read": true, "write": true, "delete": true},
        "employees": {"read": true, "write": true, "delete": true},
        "products": {"read": true, "write": true, "delete": true},
        "orders": {"read": true, "write": true, "delete": true},
        "analytics": {"read": true, "write": true, "delete": true},
        "settings": {"read": true, "write": true, "delete": true},
        "billing": {"read": true, "write": true, "delete": true}
      }'::jsonb;
    END IF;
  ELSE
    -- Get permissions from company_members record
    SELECT r.permissions INTO user_permissions
    FROM company_members cm
    JOIN roles r ON cm.role_id = r.id
    WHERE cm.company_id = company_record.id 
    AND cm.profile_id = auth.uid()
    AND cm.status = 'active';
  END IF;
  
  RETURN COALESCE(user_permissions, '{}'::jsonb);
END;
$$;

-- 3. Create the add_company_member function with role mapping
CREATE OR REPLACE FUNCTION add_company_member(
  p_full_name text,
  p_job_position text,
  p_email text DEFAULT NULL,
  p_phone text DEFAULT NULL,
  p_profile_image_url text DEFAULT NULL,
  p_years_experience integer DEFAULT 0,
  p_expertise text[] DEFAULT ARRAY[]::text[],
  p_role_name text DEFAULT 'employee'
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  company_record companies%ROWTYPE;
  role_record roles%ROWTYPE;
  new_profile_id uuid;
  mapped_role text;
BEGIN
  -- Get user's company
  SELECT * INTO company_record
  FROM companies 
  WHERE user_id = auth.uid();
  
  IF NOT FOUND THEN
    RETURN json_build_object('error', 'No company found for user');
  END IF;
  
  -- Get role by name (prevent adding owner role)
  SELECT * INTO role_record
  FROM roles 
  WHERE name = p_role_name AND name != 'owner';
  
  IF NOT FOUND THEN
    RETURN json_build_object('error', 'Invalid role specified or owner role not allowed');
  END IF;
  
  -- Map role names to constraint-allowed values
  mapped_role := CASE 
    WHEN p_role_name IN ('employee', 'storekeeper', 'driver') THEN 'staff'
    WHEN p_role_name = 'admin' THEN 'admin'
    WHEN p_role_name = 'owner' THEN 'owner'
    ELSE 'staff'
  END;
  
  -- Generate a new UUID for the profile
  new_profile_id := gen_random_uuid();
  
  -- Create new profile for the employee
  INSERT INTO profiles (
    id,
    full_name,
    job_position,
    email,
    phone,
    profile_image_url,
    years_experience,
    expertise,
    employee_status,
    company_id,
    hire_date,
    created_at,
    updated_at
  ) VALUES (
    new_profile_id,
    p_full_name,
    p_job_position,
    p_email,
    p_phone,
    p_profile_image_url,
    p_years_experience,
    p_expertise,
    'active',
    company_record.id,
    CURRENT_DATE,
    now(),
    now()
  );
  
  -- Add to company_members with mapped role
  INSERT INTO company_members (
    company_id,
    profile_id,
    role,
    role_id,
    status,
    created_by,
    created_at,
    updated_at
  ) VALUES (
    company_record.id,
    new_profile_id,
    mapped_role,  -- Use mapped role for constraint
    role_record.id,
    'active',
    auth.uid(),
    now(),
    now()
  );
  
  RETURN json_build_object(
    'success', true, 
    'message', 'Employee added successfully',
    'profile_id', new_profile_id
  );
END;
$$;

-- 4. Create the update_company_member function
CREATE OR REPLACE FUNCTION update_company_member(
  p_profile_id uuid,
  p_full_name text DEFAULT NULL,
  p_job_position text DEFAULT NULL,
  p_email text DEFAULT NULL,
  p_phone text DEFAULT NULL,
  p_profile_image_url text DEFAULT NULL,
  p_years_experience integer DEFAULT NULL,
  p_expertise text[] DEFAULT NULL,
  p_role_name text DEFAULT NULL,
  p_employee_status text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  role_record roles%ROWTYPE;
  member_exists boolean;
  mapped_role text;
BEGIN
  -- Check if member exists and belongs to user's company
  SELECT EXISTS(
    SELECT 1 FROM company_members cm
    JOIN companies c ON cm.company_id = c.id
    WHERE cm.profile_id = p_profile_id AND c.user_id = auth.uid()
  ) INTO member_exists;
  
  IF NOT member_exists THEN
    RETURN json_build_object('error', 'Employee not found or access denied');
  END IF;
  
  -- Get role if specified
  IF p_role_name IS NOT NULL THEN
    SELECT * INTO role_record
    FROM roles 
    WHERE name = p_role_name;
    
    IF NOT FOUND THEN
      RETURN json_build_object('error', 'Invalid role specified');
    END IF;
    
    -- Map role names to constraint-allowed values
    mapped_role := CASE 
      WHEN p_role_name IN ('employee', 'storekeeper', 'driver') THEN 'staff'
      WHEN p_role_name = 'admin' THEN 'admin'
      WHEN p_role_name = 'owner' THEN 'owner'
      ELSE 'staff'
    END;
  END IF;
  
  -- Update profile
  UPDATE profiles SET
    full_name = COALESCE(p_full_name, full_name),
    job_position = COALESCE(p_job_position, job_position),
    email = COALESCE(p_email, email),
    phone = COALESCE(p_phone, phone),
    profile_image_url = COALESCE(p_profile_image_url, profile_image_url),
    years_experience = COALESCE(p_years_experience, years_experience),
    expertise = COALESCE(p_expertise, expertise),
    employee_status = COALESCE(p_employee_status, employee_status),
    updated_at = now()
  WHERE id = p_profile_id;
  
  -- Update company_members if role changed
  IF p_role_name IS NOT NULL THEN
    UPDATE company_members SET
      role = mapped_role,
      role_id = role_record.id,
      updated_at = now()
    WHERE profile_id = p_profile_id;
  END IF;
  
  RETURN json_build_object('success', true, 'message', 'Employee updated successfully');
END;
$$;

-- 5. Create the delete_company_member function
CREATE OR REPLACE FUNCTION delete_company_member(p_profile_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  member_exists boolean;
BEGIN
  -- Check if member exists and belongs to user's company
  SELECT EXISTS(
    SELECT 1 FROM company_members cm
    JOIN companies c ON cm.company_id = c.id
    WHERE cm.profile_id = p_profile_id AND c.user_id = auth.uid()
  ) INTO member_exists;
  
  IF NOT FOUND THEN
    RETURN json_build_object('error', 'Employee not found or access denied');
  END IF;
  
  -- Delete from company_members
  DELETE FROM company_members WHERE profile_id = p_profile_id;
  
  -- Mark profile as inactive
  UPDATE profiles SET 
    employee_status = 'inactive',
    updated_at = now()
  WHERE id = p_profile_id;
  
  RETURN json_build_object('success', true, 'message', 'Employee removed successfully');
END;
$$;

-- 6. Grant all necessary permissions
GRANT EXECUTE ON FUNCTION get_company_members_with_details() TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_permissions() TO authenticated;
GRANT EXECUTE ON FUNCTION add_company_member(text, text, text, text, text, integer, text[], text) TO authenticated;
GRANT EXECUTE ON FUNCTION update_company_member(uuid, text, text, text, text, text, integer, text[], text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION delete_company_member(uuid) TO authenticated;

-- 7. Verify functions were created
SELECT 
    routine_name,
    routine_type
FROM information_schema.routines 
WHERE routine_name LIKE '%company_member%'
    AND routine_schema = 'public'
ORDER BY routine_name;

SELECT 'All company member functions created successfully!' as status; 