-- KEY PERSONNEL & ROLE-BASED ACCESS CONTROL DATABASE UPDATE
-- Enhanced system for managing company team members with granular permissions
-- Works with existing company_members and profiles tables

-- 1. Drop existing functions if they exist (in correct order)
DROP FUNCTION IF EXISTS get_user_permissions();
DROP FUNCTION IF EXISTS delete_company_member(uuid);
DROP FUNCTION IF EXISTS update_company_member(uuid, text, text, text, text, text, integer, text[], text, text);
DROP FUNCTION IF EXISTS add_company_member(text, text, text, text, text, integer, text[], text);
DROP FUNCTION IF EXISTS get_company_members_with_details();

-- 2. Drop existing policies for company_members table only
DROP POLICY IF EXISTS "Users can delete members of their company" ON public.company_members;
DROP POLICY IF EXISTS "Users can update members of their company" ON public.company_members;
DROP POLICY IF EXISTS "Users can insert members to their company" ON public.company_members;
DROP POLICY IF EXISTS "Users can view members of their company" ON public.company_members;

-- 3. Fix the company_members role check constraint to allow new role names
ALTER TABLE public.company_members DROP CONSTRAINT IF EXISTS company_members_role_check;
ALTER TABLE public.company_members ADD CONSTRAINT company_members_role_check 
CHECK ((role = ANY (ARRAY['owner'::text, 'admin'::text, 'staff'::text, 'storekeeper'::text, 'driver'::text, 'employee'::text])));

-- 4. Create roles table with predefined roles and permissions
CREATE TABLE IF NOT EXISTS public.roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  display_name text NOT NULL,
  description text,
  permissions jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 5. Insert predefined system roles
INSERT INTO public.roles (name, display_name, description, permissions) VALUES
('owner', 'Owner', 'Company owner with full access to all features', '{
  "company": {"read": true, "write": true, "delete": true},
  "employees": {"read": true, "write": true, "delete": true},
  "products": {"read": true, "write": true, "delete": true},
  "orders": {"read": true, "write": true, "delete": true},
  "analytics": {"read": true, "write": true, "delete": true},
  "settings": {"read": true, "write": true, "delete": true},
  "billing": {"read": true, "write": true, "delete": true}
}'),
('admin', 'Administrator', 'Administrative access with most permissions except billing', '{
  "company": {"read": true, "write": true, "delete": false},
  "employees": {"read": true, "write": true, "delete": false},
  "products": {"read": true, "write": true, "delete": true},
  "orders": {"read": true, "write": true, "delete": true},
  "analytics": {"read": true, "write": false, "delete": false},
  "settings": {"read": true, "write": true, "delete": false},
  "billing": {"read": false, "write": false, "delete": false}
}'),
('storekeeper', 'Storekeeper', 'Inventory and product management access', '{
  "company": {"read": true, "write": false, "delete": false},
  "employees": {"read": true, "write": false, "delete": false},
  "products": {"read": true, "write": true, "delete": false},
  "orders": {"read": true, "write": true, "delete": false},
  "analytics": {"read": true, "write": false, "delete": false},
  "settings": {"read": false, "write": false, "delete": false},
  "billing": {"read": false, "write": false, "delete": false}
}'),
('driver', 'Driver', 'Delivery and order fulfillment access', '{
  "company": {"read": true, "write": false, "delete": false},
  "employees": {"read": false, "write": false, "delete": false},
  "products": {"read": true, "write": false, "delete": false},
  "orders": {"read": true, "write": true, "delete": false},
  "analytics": {"read": false, "write": false, "delete": false},
  "settings": {"read": false, "write": false, "delete": false},
  "billing": {"read": false, "write": false, "delete": false}
}'),
('employee', 'Employee', 'Basic access for general staff members', '{
  "company": {"read": true, "write": false, "delete": false},
  "employees": {"read": true, "write": false, "delete": false},
  "products": {"read": true, "write": false, "delete": false},
  "orders": {"read": true, "write": false, "delete": false},
  "analytics": {"read": false, "write": false, "delete": false},
  "settings": {"read": false, "write": false, "delete": false},
  "billing": {"read": false, "write": false, "delete": false}
}');

-- 6. Enable RLS on roles table
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

-- 7. Create RLS policies for roles table
CREATE POLICY "Anyone can view roles" ON public.roles
  FOR SELECT USING (true);

-- 8. Add new columns to existing profiles table for employee details
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS job_position text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS profile_image_url text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS years_experience integer DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS expertise text[]; -- Array of expertise areas
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS hire_date date DEFAULT CURRENT_DATE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS employee_status text DEFAULT 'active';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company_id uuid;

-- Add constraint for employee status
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_employee_status_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_employee_status_check 
  CHECK ((employee_status = ANY (ARRAY['active'::text, 'inactive'::text, 'pending'::text])));

-- Remove the foreign key constraint that links profiles.id to auth.users
-- This allows us to create employee profiles that are not auth users
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Add foreign key for company_id if it doesn't exist
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_company_id_fkey;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_company_id_fkey 
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE;

-- 9. Add role_id column to existing company_members table
ALTER TABLE public.company_members ADD COLUMN IF NOT EXISTS role_id uuid;
ALTER TABLE public.company_members ADD COLUMN IF NOT EXISTS created_by uuid;
ALTER TABLE public.company_members ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now();
ALTER TABLE public.company_members ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- Add foreign key constraints (now that roles table exists)
ALTER TABLE public.company_members DROP CONSTRAINT IF EXISTS company_members_role_id_fkey;
ALTER TABLE public.company_members ADD CONSTRAINT company_members_role_id_fkey 
  FOREIGN KEY (role_id) REFERENCES roles(id);

ALTER TABLE public.company_members DROP CONSTRAINT IF EXISTS company_members_created_by_fkey;
ALTER TABLE public.company_members ADD CONSTRAINT company_members_created_by_fkey 
  FOREIGN KEY (created_by) REFERENCES auth.users(id);

-- 10. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_company_id ON public.profiles(company_id);
CREATE INDEX IF NOT EXISTS idx_profiles_job_position ON public.profiles(job_position);
CREATE INDEX IF NOT EXISTS idx_profiles_employee_status ON public.profiles(employee_status);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_company_members_role_id ON public.company_members(role_id);

-- 11. Update RLS policies for company_members table
CREATE POLICY "Users can view members of their company" ON public.company_members
  FOR SELECT USING (
    company_id IN (
      SELECT id FROM companies WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert members to their company" ON public.company_members
  FOR INSERT WITH CHECK (
    company_id IN (
      SELECT id FROM companies WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update members of their company" ON public.company_members
  FOR UPDATE USING (
    company_id IN (
      SELECT id FROM companies WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete members of their company" ON public.company_members
  FOR DELETE USING (
    company_id IN (
      SELECT id FROM companies WHERE user_id = auth.uid()
    )
  );

-- 12. Create function to get company members with detailed information
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
    gen_random_uuid() as member_id, -- Generate a UUID for member_id
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
    AND p.id != auth.uid() -- Exclude the company owner from employee list
    AND r.name != 'owner' -- Also exclude anyone with owner role
  ORDER BY cm.created_at DESC;
END;
$$;

-- 13. Create function to add company member
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
  
  -- Generate a new UUID for the profile (not linked to auth.users)
  new_profile_id := gen_random_uuid();
  
  -- Create new profile for the employee (without foreign key to auth.users)
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
  
  -- Add to company_members
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
  
  RETURN json_build_object(
    'success', true, 
    'message', 'Employee added successfully',
    'profile_id', new_profile_id
  );
END;
$$;

-- 14. Create function to update company member
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
      role = p_role_name,
      role_id = role_record.id,
      updated_at = now()
    WHERE profile_id = p_profile_id;
  END IF;
  
  RETURN json_build_object('success', true, 'message', 'Employee updated successfully');
END;
$$;

-- 15. Create function to delete company member
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
  
  IF NOT member_exists THEN
    RETURN json_build_object('error', 'Employee not found or access denied');
  END IF;
  
  -- Delete from company_members (this will not delete the profile itself)
  DELETE FROM company_members WHERE profile_id = p_profile_id;
  
  -- Optionally mark profile as inactive instead of deleting
  UPDATE profiles SET 
    employee_status = 'inactive',
    updated_at = now()
  WHERE id = p_profile_id;
  
  RETURN json_build_object('success', true, 'message', 'Employee removed successfully');
END;
$$;

-- 16. Create function to get user permissions based on role
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

-- 17. Update existing company_members to have default role
UPDATE company_members 
SET role_id = (SELECT id FROM roles WHERE name = 'employee' LIMIT 1)
WHERE role_id IS NULL;

-- 18. Grant permissions
GRANT EXECUTE ON FUNCTION get_company_members_with_details() TO authenticated;
GRANT EXECUTE ON FUNCTION add_company_member(text, text, text, text, text, integer, text[], text) TO authenticated;
GRANT EXECUTE ON FUNCTION update_company_member(uuid, text, text, text, text, text, integer, text[], text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION delete_company_member(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_permissions() TO authenticated;

-- 19. Test the setup
SELECT 'Key Personnel database setup completed successfully' as status;

-- 20. Verify the setup
SELECT 
  'Roles table created with ' || COUNT(*) || ' predefined roles' as verification
FROM roles;

SELECT 
  'Company members table enhanced and ready for use' as verification
WHERE EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'company_members' AND column_name = 'role_id'); 