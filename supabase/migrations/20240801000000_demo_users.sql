-- Create a new table for tracking demo users
CREATE TABLE demo_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_accessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  conversion_status TEXT NOT NULL DEFAULT 'pending' CHECK (conversion_status IN ('pending', 'converted', 'abandoned')),
  converted_user_id UUID REFERENCES auth.users(id),
  metadata JSONB
);

-- Enable Row Level Security
ALTER TABLE demo_users ENABLE ROW LEVEL SECURITY;

-- Create policies for demo_users table
-- Allow anyone to create a demo user (for public demo signup)
CREATE POLICY "Allow public creation of demo users" 
  ON demo_users FOR INSERT 
  TO public 
  WITH CHECK (true);

-- Allow authenticated users to read their own demo user records
CREATE POLICY "Allow users to read their own demo records" 
  ON demo_users FOR SELECT 
  TO authenticated 
  USING (converted_user_id = auth.uid());

-- Allow admins to read all demo user records
CREATE POLICY "Allow admins to read all demo user records" 
  ON demo_users FOR SELECT 
  TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

-- Allow admins to update demo user records
CREATE POLICY "Allow admins to update demo user records" 
  ON demo_users FOR UPDATE 
  TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.role = 'admin'
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

-- Create an index on email for faster lookups
CREATE INDEX demo_users_email_idx ON demo_users (email);

-- Create an index on conversion_status for analytics queries
CREATE INDEX demo_users_conversion_status_idx ON demo_users (conversion_status);

-- Create function to update last_accessed_at timestamp
CREATE OR REPLACE FUNCTION update_demo_user_last_accessed()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_accessed_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update last_accessed_at timestamp
CREATE TRIGGER update_demo_user_last_accessed_trigger
  BEFORE UPDATE ON demo_users
  FOR EACH ROW
  EXECUTE FUNCTION update_demo_user_last_accessed();

-- Create a function to track demo user signups
CREATE OR REPLACE FUNCTION public.track_demo_user_signup(
  p_email TEXT,
  p_full_name TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'::JSONB
) RETURNS UUID AS $$
DECLARE
  v_id UUID;
BEGIN
  -- Try to insert a new record
  INSERT INTO demo_users(email, full_name, metadata)
  VALUES (p_email, p_full_name, p_metadata)
  ON CONFLICT (email) 
  DO UPDATE SET 
    last_accessed_at = NOW(),
    metadata = demo_users.metadata || p_metadata
  RETURNING id INTO v_id;
  
  RETURN v_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 