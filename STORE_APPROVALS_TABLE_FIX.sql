-- ==========================================
-- STORE APPROVALS TABLE CREATION
-- ==========================================
-- Execute this in Supabase SQL Editor to create the store_approvals table

-- Create store_approvals table if it doesn't exist
CREATE TABLE IF NOT EXISTS store_approvals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'under_review')),
  submission_data JSONB NOT NULL DEFAULT '{}',
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ NULL,
  submitted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewer_notes TEXT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_store_approvals_store_id ON store_approvals(store_id);
CREATE INDEX IF NOT EXISTS idx_store_approvals_company_id ON store_approvals(company_id);
CREATE INDEX IF NOT EXISTS idx_store_approvals_status ON store_approvals(status);
CREATE INDEX IF NOT EXISTS idx_store_approvals_submitted_at ON store_approvals(submitted_at);

-- Enable RLS (Row Level Security)
ALTER TABLE store_approvals ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for store_approvals
-- Users can view approvals for their own company stores
CREATE POLICY "Users can view their company store approvals" ON store_approvals
  FOR SELECT USING (
    company_id IN (
      SELECT cm.company_id 
      FROM company_members cm 
      WHERE cm.profile_id = auth.uid()
    )
    OR
    company_id = (
      SELECT u.company_id 
      FROM users u 
      WHERE u.id = auth.uid()
    )
  );

-- Users can insert approvals for their own company stores  
CREATE POLICY "Users can submit approvals for their company stores" ON store_approvals
  FOR INSERT WITH CHECK (
    company_id IN (
      SELECT cm.company_id 
      FROM company_members cm 
      WHERE cm.profile_id = auth.uid()
    )
    OR
    company_id = (
      SELECT u.company_id 
      FROM users u 
      WHERE u.id = auth.uid()
    )
  );

-- Users can update approvals for their own company stores (for status updates)
CREATE POLICY "Users can update their company store approvals" ON store_approvals
  FOR UPDATE USING (
    company_id IN (
      SELECT cm.company_id 
      FROM company_members cm 
      WHERE cm.profile_id = auth.uid()
    )
    OR
    company_id = (
      SELECT u.company_id 
      FROM users u 
      WHERE u.id = auth.uid()
    )
  );

-- Add missing columns to stores table if they don't exist
DO $$
BEGIN
  -- Add approval_submitted_at column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'stores' AND column_name = 'approval_submitted_at'
  ) THEN
    ALTER TABLE stores ADD COLUMN approval_submitted_at TIMESTAMPTZ NULL;
  END IF;
  
  -- Update status column to include pending_approval if not already there
  BEGIN
    ALTER TABLE stores DROP CONSTRAINT IF EXISTS stores_status_check;
    ALTER TABLE stores ADD CONSTRAINT stores_status_check 
      CHECK (status IN ('draft', 'active', 'inactive', 'pending_approval', 'approved', 'rejected'));
  EXCEPTION WHEN OTHERS THEN
    -- If constraint update fails, continue anyway
    NULL;
  END;
END $$;

-- Create a function to handle store approval workflows
CREATE OR REPLACE FUNCTION handle_store_approval_update()
RETURNS TRIGGER AS $$
BEGIN
  -- When approval status changes to approved, update the store status
  IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
    UPDATE stores 
    SET status = 'approved', updated_at = NOW() 
    WHERE id = NEW.store_id;
  END IF;
  
  -- When approval status changes to rejected, update the store status
  IF NEW.status = 'rejected' AND OLD.status != 'rejected' THEN
    UPDATE stores 
    SET status = 'rejected', updated_at = NOW() 
    WHERE id = NEW.store_id;
  END IF;
  
  -- Update the reviewed_at timestamp
  IF NEW.status != OLD.status AND NEW.status IN ('approved', 'rejected') THEN
    NEW.reviewed_at = NOW();
    NEW.updated_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for store approval updates
DROP TRIGGER IF EXISTS store_approval_status_update ON store_approvals;
CREATE TRIGGER store_approval_status_update
  BEFORE UPDATE ON store_approvals
  FOR EACH ROW
  EXECUTE FUNCTION handle_store_approval_update();

-- Create updated_at trigger for store_approvals
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_store_approvals_updated_at ON store_approvals;
CREATE TRIGGER update_store_approvals_updated_at
  BEFORE UPDATE ON store_approvals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Verify table creation
SELECT 'Store approvals table created successfully with RLS policies' as status;

-- Show table structure using standard SQL (instead of \d command)
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'store_approvals' 
ORDER BY ordinal_position;

-- Show current policies using standard SQL (instead of \d command)
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual 
FROM pg_policies 
WHERE tablename = 'store_approvals'; 