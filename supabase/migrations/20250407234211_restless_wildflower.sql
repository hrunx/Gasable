/*
  # Initial Database Schema

  1. New Tables
    - `users` - User account information
    - `companies` - Company/merchant information
    - `stores` - Store/location information
    - `products` - Product information
    - `product_attributes` - Product specifications
    - `product_images` - Product images
    - `product_pricing` - Product pricing by zone
    - `delivery_zones` - Delivery zone information
    - `delivery_vehicles` - Delivery vehicle information
    - `delivery_drivers` - Delivery driver information
    - `customers` - Customer information
    - `orders` - Order information
    - `order_items` - Order line items
    - `support_tickets` - Support ticket information
    - `ticket_messages` - Support ticket messages
    - `campaigns` - Marketing campaign information
    - `invoices` - Invoice information

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Add policies for admin users

  3. Functions
    - Create update_timestamp function
    - Create generate_order_number function
    - Create generate_ticket_number function
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable PostGIS for geographic data
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Update timestamp function
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'supplier',
  status TEXT NOT NULL DEFAULT 'active',
  company_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Companies table
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  cr_number TEXT,
  vat_number TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  logo_url TEXT,
  subscription_tier TEXT DEFAULT 'free',
  subscription_status TEXT DEFAULT 'active',
  subscription_start_date TIMESTAMPTZ,
  subscription_end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Update users table to reference companies
ALTER TABLE public.users ADD CONSTRAINT fk_users_company FOREIGN KEY (company_id) REFERENCES public.companies(id);

-- Stores table
CREATE TABLE IF NOT EXISTS public.stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  address TEXT,
  city TEXT,
  country TEXT,
  location GEOGRAPHY(POINT),
  status TEXT NOT NULL DEFAULT 'pending',
  services JSONB DEFAULT '{"pickup": false, "delivery": false}',
  working_hours JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;

-- Products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies NOT NULL,
  name TEXT NOT NULL,
  sku TEXT,
  description TEXT,
  type TEXT,
  category TEXT,
  brand TEXT,
  model TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Product attributes table
CREATE TABLE IF NOT EXISTS public.product_attributes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products NOT NULL,
  attribute_type TEXT NOT NULL,
  name TEXT NOT NULL,
  value TEXT NOT NULL,
  unit TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.product_attributes ENABLE ROW LEVEL SECURITY;

-- Product images table
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products NOT NULL,
  url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

-- Delivery zones table
CREATE TABLE IF NOT EXISTS public.delivery_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies NOT NULL,
  name TEXT NOT NULL,
  base_fee NUMERIC NOT NULL DEFAULT 0,
  min_order_value NUMERIC NOT NULL DEFAULT 0,
  estimated_time TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.delivery_zones ENABLE ROW LEVEL SECURITY;

-- Product pricing table
CREATE TABLE IF NOT EXISTS public.product_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products NOT NULL,
  zone_id UUID REFERENCES public.delivery_zones,
  base_price NUMERIC NOT NULL,
  b2b_price NUMERIC NOT NULL,
  b2c_price NUMERIC NOT NULL,
  currency TEXT DEFAULT 'SAR',
  min_order_quantity INTEGER DEFAULT 1,
  vat_included BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.product_pricing ENABLE ROW LEVEL SECURITY;

-- Delivery vehicles table
CREATE TABLE IF NOT EXISTS public.delivery_vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies NOT NULL,
  number TEXT NOT NULL,
  type TEXT NOT NULL,
  capacity NUMERIC,
  fuel_type TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.delivery_vehicles ENABLE ROW LEVEL SECURITY;

-- Delivery drivers table
CREATE TABLE IF NOT EXISTS public.delivery_drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies NOT NULL,
  name TEXT NOT NULL,
  license_number TEXT,
  phone TEXT,
  status TEXT DEFAULT 'available',
  vehicle_id UUID REFERENCES public.delivery_vehicles,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.delivery_drivers ENABLE ROW LEVEL SECURITY;

-- Customers table
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Create sequence for order numbers
CREATE SEQUENCE IF NOT EXISTS order_number_seq;

-- Orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  company_id UUID REFERENCES public.companies NOT NULL,
  customer_id UUID REFERENCES public.customers NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  total_amount NUMERIC NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  payment_method TEXT,
  payment_transaction_id TEXT,
  delivery_method TEXT NOT NULL,
  delivery_status TEXT NOT NULL DEFAULT 'pending',
  delivery_address TEXT,
  delivery_city TEXT,
  delivery_country TEXT,
  delivery_notes TEXT,
  delivery_tracking TEXT,
  delivery_carrier TEXT,
  priority TEXT DEFAULT 'medium',
  notes TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Generate order number function
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number := 'ORD-' || to_char(now(), 'YYYY') || '-' || 
                     lpad(nextval('order_number_seq')::text, 6, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for order number generation
CREATE TRIGGER set_order_number
BEFORE INSERT ON public.orders
FOR EACH ROW EXECUTE FUNCTION generate_order_number();

-- Order items table
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders NOT NULL,
  product_id UUID REFERENCES public.products NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price NUMERIC NOT NULL,
  total_price NUMERIC NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Create sequence for ticket numbers
CREATE SEQUENCE IF NOT EXISTS ticket_number_seq;

-- Support tickets table
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number TEXT NOT NULL UNIQUE,
  company_id UUID REFERENCES public.companies NOT NULL,
  customer_id UUID REFERENCES public.customers,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  priority TEXT NOT NULL DEFAULT 'medium',
  category TEXT NOT NULL,
  assignee_id UUID REFERENCES public.users,
  response_time INTEGER,
  resolution_time INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ
);

ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- Generate ticket number function
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.ticket_number := 'TKT-' || lpad(nextval('ticket_number_seq')::text, 6, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for ticket number generation
CREATE TRIGGER set_ticket_number
BEFORE INSERT ON public.support_tickets
FOR EACH ROW EXECUTE FUNCTION generate_ticket_number();

-- Ticket messages table
CREATE TABLE IF NOT EXISTS public.ticket_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES public.support_tickets NOT NULL,
  sender_id UUID REFERENCES public.users,
  sender_type TEXT NOT NULL,
  message TEXT NOT NULL,
  attachments TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;

-- Campaigns table
CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  discount_type TEXT NOT NULL,
  discount_value NUMERIC NOT NULL,
  target_type TEXT NOT NULL,
  target_value TEXT,
  description TEXT,
  terms TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

-- Create sequence for invoice numbers
CREATE SEQUENCE IF NOT EXISTS invoice_number_seq;

-- Invoices table
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT NOT NULL UNIQUE,
  company_id UUID REFERENCES public.companies NOT NULL,
  customer_id UUID REFERENCES public.customers NOT NULL,
  order_id UUID REFERENCES public.orders,
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  due_date TIMESTAMPTZ NOT NULL,
  issued_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  paid_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Generate invoice number function
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.invoice_number := 'INV-' || to_char(now(), 'YYYY') || '-' || 
                       lpad(nextval('invoice_number_seq')::text, 6, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for invoice number generation
CREATE TRIGGER set_invoice_number
BEFORE INSERT ON public.invoices
FOR EACH ROW EXECUTE FUNCTION generate_invoice_number();

-- Create update timestamp triggers
CREATE TRIGGER update_companies_timestamp
BEFORE UPDATE ON public.companies
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_users_timestamp
BEFORE UPDATE ON public.users
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_stores_timestamp
BEFORE UPDATE ON public.stores
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_products_timestamp
BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_delivery_zones_timestamp
BEFORE UPDATE ON public.delivery_zones
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_product_pricing_timestamp
BEFORE UPDATE ON public.product_pricing
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_delivery_vehicles_timestamp
BEFORE UPDATE ON public.delivery_vehicles
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_delivery_drivers_timestamp
BEFORE UPDATE ON public.delivery_drivers
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_customers_timestamp
BEFORE UPDATE ON public.customers
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_orders_timestamp
BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_support_tickets_timestamp
BEFORE UPDATE ON public.support_tickets
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_campaigns_timestamp
BEFORE UPDATE ON public.campaigns
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_invoices_timestamp
BEFORE UPDATE ON public.invoices
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- Create database indexes
-- Users table
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_company_id ON public.users(company_id);

-- Companies table
CREATE INDEX IF NOT EXISTS idx_companies_name ON public.companies(name);
CREATE INDEX IF NOT EXISTS idx_companies_cr_number ON public.companies(cr_number);
CREATE INDEX IF NOT EXISTS idx_companies_vat_number ON public.companies(vat_number);

-- Stores table
CREATE INDEX IF NOT EXISTS idx_stores_company_id ON public.stores(company_id);
CREATE INDEX IF NOT EXISTS idx_stores_status ON public.stores(status);
CREATE INDEX IF NOT EXISTS idx_stores_location ON public.stores USING GIST(location);

-- Products table
CREATE INDEX IF NOT EXISTS idx_products_company_id ON public.products(company_id);
CREATE INDEX IF NOT EXISTS idx_products_name ON public.products(name);
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_type_category ON public.products(type, category);

-- Product attributes table
CREATE INDEX IF NOT EXISTS idx_product_attributes_product_id ON public.product_attributes(product_id);
CREATE INDEX IF NOT EXISTS idx_product_attributes_type ON public.product_attributes(attribute_type);

-- Product pricing table
CREATE INDEX IF NOT EXISTS idx_product_pricing_product_id ON public.product_pricing(product_id);
CREATE INDEX IF NOT EXISTS idx_product_pricing_zone_id ON public.product_pricing(zone_id);

-- Orders table
CREATE INDEX IF NOT EXISTS idx_orders_company_id ON public.orders(company_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_delivery_status ON public.orders(delivery_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at);

-- Order items table
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);

-- Support tickets table
CREATE INDEX IF NOT EXISTS idx_support_tickets_company_id ON public.support_tickets(company_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON public.support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_priority ON public.support_tickets(priority);
CREATE INDEX IF NOT EXISTS idx_support_tickets_category ON public.support_tickets(category);
CREATE INDEX IF NOT EXISTS idx_support_tickets_assignee_id ON public.support_tickets(assignee_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_created_at ON public.support_tickets(created_at);

-- Ticket messages table
CREATE INDEX IF NOT EXISTS idx_ticket_messages_ticket_id ON public.ticket_messages(ticket_id);
CREATE INDEX IF NOT EXISTS idx_ticket_messages_sender_id ON public.ticket_messages(sender_id);

-- Create RLS policies

-- Users table policies
CREATE POLICY "Users can read own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can read all user data" ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all user data" ON public.users
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Companies table policies
CREATE POLICY "Users can read own company data" ON public.companies
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.company_id = companies.id
    )
  );

CREATE POLICY "Users can update own company data" ON public.companies
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.company_id = companies.id
    )
  );

CREATE POLICY "Admins can read all company data" ON public.companies
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all company data" ON public.companies
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Stores table policies
CREATE POLICY "Users can read own company stores" ON public.stores
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.company_id = stores.company_id
    )
  );

CREATE POLICY "Users can insert stores for own company" ON public.stores
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.company_id = stores.company_id
    )
  );

CREATE POLICY "Users can update own company stores" ON public.stores
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.company_id = stores.company_id
    )
  );

CREATE POLICY "Users can delete own company stores" ON public.stores
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.company_id = stores.company_id
    )
  );

CREATE POLICY "Admins can read all stores" ON public.stores
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Products table policies
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

-- Create database views

-- Active Products View
CREATE OR REPLACE VIEW public.active_products AS
SELECT 
  p.*,
  c.name as company_name,
  (
    SELECT json_agg(json_build_object('url', pi.url, 'is_primary', pi.is_primary))
    FROM product_images pi
    WHERE pi.product_id = p.id
  ) as images,
  (
    SELECT json_agg(json_build_object('attribute_type', pa.attribute_type, 'name', pa.name, 'value', pa.value, 'unit', pa.unit))
    FROM product_attributes pa
    WHERE pa.product_id = p.id
  ) as attributes
FROM 
  products p
JOIN 
  companies c ON p.company_id = c.id
WHERE 
  p.status = 'active';

-- Order Summary View
CREATE OR REPLACE VIEW public.order_summary AS
SELECT 
  o.*,
  c.name as customer_name,
  c.type as customer_type,
  c.email as customer_email,
  c.phone as customer_phone,
  (
    SELECT json_agg(json_build_object(
      'product_id', p.id,
      'product_name', p.name,
      'quantity', oi.quantity,
      'unit_price', oi.unit_price,
      'total_price', oi.total_price
    ))
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = o.id
  ) as items
FROM 
  orders o
JOIN 
  customers c ON o.customer_id = c.id;

-- Ticket Summary View
CREATE OR REPLACE VIEW public.ticket_summary AS
SELECT 
  t.*,
  u.full_name as assignee_name,
  c.name as company_name,
  (
    SELECT COUNT(*) FROM ticket_messages tm WHERE tm.ticket_id = t.id
  ) as message_count,
  (
    SELECT tm.created_at
    FROM ticket_messages tm
    WHERE tm.ticket_id = t.id
    ORDER BY tm.created_at DESC
    LIMIT 1
  ) as last_message_at
FROM 
  support_tickets t
LEFT JOIN 
  users u ON t.assignee_id = u.id
JOIN 
  companies c ON t.company_id = c.id;