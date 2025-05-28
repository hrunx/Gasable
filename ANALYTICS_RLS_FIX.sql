-- Analytics RLS Policies Fix
-- This script adds missing RLS policies for customers, orders, and order_items tables

-- =====================================================
-- CUSTOMERS TABLE POLICIES
-- =====================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read customers through orders" ON public.customers;

-- Users can read customers that are associated with their company's orders
CREATE POLICY "Users can read customers through orders" ON public.customers
  FOR SELECT USING (
    id IN (
      SELECT DISTINCT customer_id 
      FROM public.orders 
      WHERE company_id IN (
        SELECT company_id 
        FROM public.company_members 
        WHERE profile_id = auth.uid()
      )
    )
  );

-- =====================================================
-- ORDERS TABLE POLICIES
-- =====================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own company orders" ON public.orders;
DROP POLICY IF EXISTS "Users can manage own company orders" ON public.orders;

-- Users can read orders from their company
CREATE POLICY "Users can read own company orders" ON public.orders
  FOR SELECT USING (
    company_id IN (
      SELECT company_id 
      FROM public.company_members 
      WHERE profile_id = auth.uid()
    )
  );

-- Users can manage orders from their company
CREATE POLICY "Users can manage own company orders" ON public.orders
  FOR ALL USING (
    company_id IN (
      SELECT company_id 
      FROM public.company_members 
      WHERE profile_id = auth.uid()
    )
  );

-- =====================================================
-- ORDER_ITEMS TABLE POLICIES
-- =====================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own company order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can manage own company order items" ON public.order_items;

-- Users can read order items from their company's orders
CREATE POLICY "Users can read own company order items" ON public.order_items
  FOR SELECT USING (
    order_id IN (
      SELECT id 
      FROM public.orders 
      WHERE company_id IN (
        SELECT company_id 
        FROM public.company_members 
        WHERE profile_id = auth.uid()
      )
    )
  );

-- Users can manage order items from their company's orders
CREATE POLICY "Users can manage own company order items" ON public.order_items
  FOR ALL USING (
    order_id IN (
      SELECT id 
      FROM public.orders 
      WHERE company_id IN (
        SELECT company_id 
        FROM public.company_members 
        WHERE profile_id = auth.uid()
      )
    )
  );

-- =====================================================
-- PRODUCTS TABLE POLICIES (if missing)
-- =====================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own company products" ON public.products;
DROP POLICY IF EXISTS "Users can manage own company products" ON public.products;

-- Users can read products from their company
CREATE POLICY "Users can read own company products" ON public.products
  FOR SELECT USING (
    company_id IN (
      SELECT company_id 
      FROM public.company_members 
      WHERE profile_id = auth.uid()
    )
  );

-- Users can manage products from their company
CREATE POLICY "Users can manage own company products" ON public.products
  FOR ALL USING (
    company_id IN (
      SELECT company_id 
      FROM public.company_members 
      WHERE profile_id = auth.uid()
    )
  );

-- =====================================================
-- VERIFY POLICIES
-- =====================================================

-- Check if policies were created successfully
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename IN ('customers', 'orders', 'order_items', 'products')
ORDER BY tablename, policyname; 