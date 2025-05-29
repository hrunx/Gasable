-- Store Type System Migration
-- Add store_category to stores table to differentiate between physical and cloud stores

-- Add store_category column to stores table
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS store_category TEXT NOT NULL DEFAULT 'cloud' CHECK (store_category IN ('physical', 'cloud'));

-- Update existing stores to cloud type by default
UPDATE public.stores SET store_category = 'cloud' WHERE store_category IS NULL;

-- Create branches table for physical store management
CREATE TABLE IF NOT EXISTS public.branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES public.stores NOT NULL,
  company_id UUID REFERENCES public.companies NOT NULL,
  name TEXT NOT NULL,
  branch_code TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  location GEOGRAPHY(POINT),
  manager_name TEXT,
  manager_phone TEXT,
  manager_email TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
  operating_hours JSONB DEFAULT '{"is24Hours": false, "weekdays": {"open": "09:00", "close": "17:00"}, "weekends": {"open": "10:00", "close": "16:00"}}',
  services JSONB DEFAULT '[]',
  employee_count INTEGER DEFAULT 0,
  assets_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for branches table
CREATE POLICY "Users can read own company branches" ON public.branches
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.company_id = branches.company_id
    )
  );

CREATE POLICY "Users can insert branches for own company" ON public.branches
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.company_id = branches.company_id
    )
  );

CREATE POLICY "Users can update own company branches" ON public.branches
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.company_id = branches.company_id
    )
  );

CREATE POLICY "Users can delete own company branches" ON public.branches
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.company_id = branches.company_id
    )
  );

-- Admins can manage all branches
CREATE POLICY "Admins can read all branches" ON public.branches
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all branches" ON public.branches
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Add update timestamp trigger for branches
CREATE TRIGGER update_branches_timestamp
  BEFORE UPDATE ON public.branches
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- Create function to auto-create branch for physical stores
CREATE OR REPLACE FUNCTION create_branch_for_physical_store()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create branch if this is a physical store and doesn't already have one
  IF NEW.store_category = 'physical' THEN
    INSERT INTO public.branches (
      store_id,
      company_id,
      name,
      address,
      city,
      country,
      location,
      operating_hours,
      services
    ) VALUES (
      NEW.id,
      NEW.company_id,
      NEW.name || ' - Main Branch',
      NEW.address,
      NEW.city,
      NEW.country,
      NEW.location,
      NEW.working_hours,
      NEW.services
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-create branch when physical store is created
CREATE TRIGGER auto_create_branch_for_physical_store
  AFTER INSERT ON public.stores
  FOR EACH ROW EXECUTE FUNCTION create_branch_for_physical_store();

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_branches_store_id ON public.branches(store_id);
CREATE INDEX IF NOT EXISTS idx_branches_company_id ON public.branches(company_id);
CREATE INDEX IF NOT EXISTS idx_stores_store_category ON public.stores(store_category); 