-- Complete Store ID Fix Migration
-- Adds store_id columns to all tables that need to be linked to specific stores

-- 1. Add store_id to products table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS store_id UUID REFERENCES public.stores(id);
CREATE INDEX IF NOT EXISTS idx_products_store_id ON public.products(store_id);

-- 2. Add store_id to delivery_zones table
ALTER TABLE public.delivery_zones ADD COLUMN IF NOT EXISTS store_id UUID REFERENCES public.stores(id);
CREATE INDEX IF NOT EXISTS idx_delivery_zones_store_id ON public.delivery_zones(store_id);

-- 3. Add store_id to delivery_vehicles table
ALTER TABLE public.delivery_vehicles ADD COLUMN IF NOT EXISTS store_id UUID REFERENCES public.stores(id);
CREATE INDEX IF NOT EXISTS idx_delivery_vehicles_store_id ON public.delivery_vehicles(store_id);

-- 4. Add store_id to delivery_drivers table
ALTER TABLE public.delivery_drivers ADD COLUMN IF NOT EXISTS store_id UUID REFERENCES public.stores(id);
CREATE INDEX IF NOT EXISTS idx_delivery_drivers_store_id ON public.delivery_drivers(store_id);

-- 5. Update RLS policies for products table
DROP POLICY IF EXISTS "Users can read own company products" ON public.products;
DROP POLICY IF EXISTS "Users can insert products for own company" ON public.products;
DROP POLICY IF EXISTS "Users can update own company products" ON public.products;
DROP POLICY IF EXISTS "Users can delete own company products" ON public.products;
DROP POLICY IF EXISTS "Admins can read all products" ON public.products;

CREATE POLICY "Users can read own company products" ON public.products
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.company_id = products.company_id
    )
  );

CREATE POLICY "Users can insert products for own company" ON public.products
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.company_id = products.company_id
    )
  );

CREATE POLICY "Users can update own company products" ON public.products
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.company_id = products.company_id
    )
  );

CREATE POLICY "Users can delete own company products" ON public.products
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.company_id = products.company_id
    )
  );

CREATE POLICY "Admins can read all products" ON public.products
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 6. Update RLS policies for delivery_zones table
DROP POLICY IF EXISTS "Users can read own company delivery zones" ON public.delivery_zones;
DROP POLICY IF EXISTS "Users can insert delivery zones for own company" ON public.delivery_zones;
DROP POLICY IF EXISTS "Users can update own company delivery zones" ON public.delivery_zones;
DROP POLICY IF EXISTS "Users can delete own company delivery zones" ON public.delivery_zones;
DROP POLICY IF EXISTS "Admins can read all delivery zones" ON public.delivery_zones;

CREATE POLICY "Users can read own company delivery zones" ON public.delivery_zones
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.company_id = delivery_zones.company_id
    )
  );

CREATE POLICY "Users can insert delivery zones for own company" ON public.delivery_zones
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.company_id = delivery_zones.company_id
    )
  );

CREATE POLICY "Users can update own company delivery zones" ON public.delivery_zones
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.company_id = delivery_zones.company_id
    )
  );

CREATE POLICY "Users can delete own company delivery zones" ON public.delivery_zones
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.company_id = delivery_zones.company_id
    )
  );

CREATE POLICY "Admins can read all delivery zones" ON public.delivery_zones
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 7. Update RLS policies for delivery_vehicles table
DROP POLICY IF EXISTS "Users can read own company delivery vehicles" ON public.delivery_vehicles;
DROP POLICY IF EXISTS "Users can insert delivery vehicles for own company" ON public.delivery_vehicles;
DROP POLICY IF EXISTS "Users can update own company delivery vehicles" ON public.delivery_vehicles;
DROP POLICY IF EXISTS "Users can delete own company delivery vehicles" ON public.delivery_vehicles;
DROP POLICY IF EXISTS "Admins can read all delivery vehicles" ON public.delivery_vehicles;

CREATE POLICY "Users can read own company delivery vehicles" ON public.delivery_vehicles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.company_id = delivery_vehicles.company_id
    )
  );

CREATE POLICY "Users can insert delivery vehicles for own company" ON public.delivery_vehicles
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.company_id = delivery_vehicles.company_id
    )
  );

CREATE POLICY "Users can update own company delivery vehicles" ON public.delivery_vehicles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.company_id = delivery_vehicles.company_id
    )
  );

CREATE POLICY "Users can delete own company delivery vehicles" ON public.delivery_vehicles
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.company_id = delivery_vehicles.company_id
    )
  );

CREATE POLICY "Admins can read all delivery vehicles" ON public.delivery_vehicles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 8. Update RLS policies for delivery_drivers table
DROP POLICY IF EXISTS "Users can read own company delivery drivers" ON public.delivery_drivers;
DROP POLICY IF EXISTS "Users can insert delivery drivers for own company" ON public.delivery_drivers;
DROP POLICY IF EXISTS "Users can update own company delivery drivers" ON public.delivery_drivers;
DROP POLICY IF EXISTS "Users can delete own company delivery drivers" ON public.delivery_drivers;
DROP POLICY IF EXISTS "Admins can read all delivery drivers" ON public.delivery_drivers;

CREATE POLICY "Users can read own company delivery drivers" ON public.delivery_drivers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.company_id = delivery_drivers.company_id
    )
  );

CREATE POLICY "Users can insert delivery drivers for own company" ON public.delivery_drivers
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.company_id = delivery_drivers.company_id
    )
  );

CREATE POLICY "Users can update own company delivery drivers" ON public.delivery_drivers
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.company_id = delivery_drivers.company_id
    )
  );

CREATE POLICY "Users can delete own company delivery drivers" ON public.delivery_drivers
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.company_id = delivery_drivers.company_id
    )
  );

CREATE POLICY "Admins can read all delivery drivers" ON public.delivery_drivers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  ); 