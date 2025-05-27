/*
  # Subscription Management Schema

  1. New Tables
    - `subscription_plans` - Available subscription plans
    - `subscription_tiers` - Tier details for each plan
    - `supplier_subscriptions` - Supplier subscription information
    - `subscription_addons` - Add-ons purchased by suppliers
    - `subscription_invoices` - Subscription invoice history
    - `subscription_usage` - Usage metrics for suppliers

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Add policies for admin users
*/

-- Subscription Plans Table
CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  monthly_price NUMERIC NOT NULL,
  yearly_price NUMERIC NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

-- Subscription Tiers Table (limits and features for each plan)
CREATE TABLE IF NOT EXISTS public.subscription_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID REFERENCES public.subscription_plans NOT NULL,
  product_limit INTEGER NOT NULL,
  order_limit INTEGER NOT NULL,
  gmv_limit NUMERIC NOT NULL,
  branch_limit INTEGER NOT NULL,
  user_limit INTEGER NOT NULL,
  customer_types TEXT[] NOT NULL,
  countries_access TEXT NOT NULL,
  commission_rate NUMERIC NOT NULL,
  support_level TEXT NOT NULL,
  api_access TEXT NOT NULL,
  features JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.subscription_tiers ENABLE ROW LEVEL SECURITY;

-- Supplier Subscriptions Table
CREATE TABLE IF NOT EXISTS public.supplier_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies NOT NULL,
  plan_id UUID REFERENCES public.subscription_plans NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  billing_cycle TEXT NOT NULL DEFAULT 'monthly',
  start_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  end_date TIMESTAMPTZ,
  auto_renew BOOLEAN DEFAULT true,
  payment_method TEXT,
  payment_details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.supplier_subscriptions ENABLE ROW LEVEL SECURITY;

-- Subscription Add-ons Table
CREATE TABLE IF NOT EXISTS public.subscription_addons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES public.supplier_subscriptions NOT NULL,
  addon_type TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC NOT NULL,
  start_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  end_date TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.subscription_addons ENABLE ROW LEVEL SECURITY;

-- Subscription Invoices Table
CREATE TABLE IF NOT EXISTS public.subscription_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES public.supplier_subscriptions NOT NULL,
  invoice_number TEXT NOT NULL UNIQUE,
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  billing_period_start TIMESTAMPTZ NOT NULL,
  billing_period_end TIMESTAMPTZ NOT NULL,
  due_date TIMESTAMPTZ NOT NULL,
  paid_date TIMESTAMPTZ,
  payment_method TEXT,
  payment_transaction_id TEXT,
  invoice_items JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.subscription_invoices ENABLE ROW LEVEL SECURITY;

-- Subscription Usage Table
CREATE TABLE IF NOT EXISTS public.subscription_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies NOT NULL,
  products_used INTEGER NOT NULL DEFAULT 0,
  orders_used INTEGER NOT NULL DEFAULT 0,
  gmv_used NUMERIC NOT NULL DEFAULT 0,
  branches_used INTEGER NOT NULL DEFAULT 0,
  users_used INTEGER NOT NULL DEFAULT 0,
  month DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(company_id, month)
);

ALTER TABLE public.subscription_usage ENABLE ROW LEVEL SECURITY;

-- Create update timestamp triggers
CREATE TRIGGER update_subscription_plans_timestamp
BEFORE UPDATE ON public.subscription_plans
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_subscription_tiers_timestamp
BEFORE UPDATE ON public.subscription_tiers
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_supplier_subscriptions_timestamp
BEFORE UPDATE ON public.supplier_subscriptions
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_subscription_addons_timestamp
BEFORE UPDATE ON public.subscription_addons
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_subscription_invoices_timestamp
BEFORE UPDATE ON public.subscription_invoices
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_subscription_usage_timestamp
BEFORE UPDATE ON public.subscription_usage
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- Create database indexes
CREATE INDEX IF NOT EXISTS idx_supplier_subscriptions_company_id ON public.supplier_subscriptions(company_id);
CREATE INDEX IF NOT EXISTS idx_supplier_subscriptions_plan_id ON public.supplier_subscriptions(plan_id);
CREATE INDEX IF NOT EXISTS idx_supplier_subscriptions_status ON public.supplier_subscriptions(status);

CREATE INDEX IF NOT EXISTS idx_subscription_addons_subscription_id ON public.subscription_addons(subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscription_addons_addon_type ON public.subscription_addons(addon_type);

CREATE INDEX IF NOT EXISTS idx_subscription_invoices_subscription_id ON public.subscription_invoices(subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscription_invoices_status ON public.subscription_invoices(status);

CREATE INDEX IF NOT EXISTS idx_subscription_usage_company_id ON public.subscription_usage(company_id);
CREATE INDEX IF NOT EXISTS idx_subscription_usage_month ON public.subscription_usage(month);

-- Create RLS policies

-- Subscription Plans policies
CREATE POLICY "Users can read subscription plans" ON public.subscription_plans
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage subscription plans" ON public.subscription_plans
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Subscription Tiers policies
CREATE POLICY "Users can read subscription tiers" ON public.subscription_tiers
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage subscription tiers" ON public.subscription_tiers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Supplier Subscriptions policies
CREATE POLICY "Users can read own company subscription" ON public.supplier_subscriptions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.company_id = supplier_subscriptions.company_id
    )
  );

CREATE POLICY "Admins can manage all subscriptions" ON public.supplier_subscriptions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Subscription Add-ons policies
CREATE POLICY "Users can read own company addons" ON public.subscription_addons
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.supplier_subscriptions ss
      JOIN public.users u ON ss.company_id = u.company_id
      WHERE u.id = auth.uid() AND ss.id = subscription_addons.subscription_id
    )
  );

CREATE POLICY "Admins can manage all addons" ON public.subscription_addons
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Subscription Invoices policies
CREATE POLICY "Users can read own company invoices" ON public.subscription_invoices
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.supplier_subscriptions ss
      JOIN public.users u ON ss.company_id = u.company_id
      WHERE u.id = auth.uid() AND ss.id = subscription_invoices.subscription_id
    )
  );

CREATE POLICY "Admins can manage all invoices" ON public.subscription_invoices
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Subscription Usage policies
CREATE POLICY "Users can read own company usage" ON public.subscription_usage
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.company_id = subscription_usage.company_id
    )
  );

CREATE POLICY "Admins can manage all usage data" ON public.subscription_usage
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Insert default subscription plans
INSERT INTO public.subscription_plans (name, description, monthly_price, yearly_price)
VALUES 
  ('Free', 'For small suppliers just getting started', 0, 0),
  ('Basic', 'For growing suppliers with established operations', 750, 8100),
  ('Advanced', 'For established suppliers looking to scale', 1500, 15840),
  ('Premium', 'For enterprise suppliers with complex needs', 0, 0);

-- Insert subscription tiers
INSERT INTO public.subscription_tiers (
  plan_id, 
  product_limit, 
  order_limit, 
  gmv_limit, 
  branch_limit, 
  user_limit, 
  customer_types, 
  countries_access, 
  commission_rate, 
  support_level, 
  api_access, 
  features
)
VALUES 
  (
    (SELECT id FROM public.subscription_plans WHERE name = 'Free'),
    3, 10, 500, 1, 3, 
    ARRAY['B2C'], 
    'Domestic only',
    20,
    'Email support (48h response)',
    'None',
    '["Basic inventory management", "Standard support"]'::jsonb
  ),
  (
    (SELECT id FROM public.subscription_plans WHERE name = 'Basic'),
    5, 100, 5000, 3, 10, 
    ARRAY['B2C'], 
    'Domestic only',
    15,
    'Priority email support (24h response)',
    'Basic read-only API',
    '["Basic inventory management", "Priority support", "Directory listing", "API access", "Basic analytics"]'::jsonb
  ),
  (
    (SELECT id FROM public.subscription_plans WHERE name = 'Advanced'),
    35, 500, 25000, 7, 50, 
    ARRAY['B2B', 'B2C'], 
    'Domestic + 1 international',
    12,
    'Dedicated account manager',
    'Full API access',
    '["Advanced inventory management", "Dedicated account manager", "Promotions & campaigns", "Advanced analytics", "Enhanced training"]'::jsonb
  ),
  (
    (SELECT id FROM public.subscription_plans WHERE name = 'Premium'),
    2147483647, 2147483647, 2147483647, 100, 2147483647, 
    ARRAY['B2B', 'B2C', 'B2G'], 
    'Global coverage',
    8,
    'Premium support with SLAs',
    'Custom API integration',
    '["Advanced inventory management", "Dedicated account manager", "Custom campaigns", "Full performance reports", "Complete training suite"]'::jsonb
  );