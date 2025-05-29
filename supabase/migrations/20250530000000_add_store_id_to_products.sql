-- Add store_id column to products table
-- This allows products to be linked to specific stores within a company

-- Add store_id column to products table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS store_id UUID REFERENCES public.stores(id);

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_products_store_id ON public.products(store_id);

-- Update RLS policies to consider store_id
-- Drop existing policies first
DROP POLICY IF EXISTS "Users can read own company products" ON public.products;
DROP POLICY IF EXISTS "Users can insert products for own company" ON public.products;
DROP POLICY IF EXISTS "Users can update own company products" ON public.products;
DROP POLICY IF EXISTS "Users can delete own company products" ON public.products;

-- Create new policies that consider both company_id and store access
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

-- Admin policies remain the same
CREATE POLICY "Admins can read all products" ON public.products
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  ); 