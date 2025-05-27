# Gasable Supplier Portal Database Documentation

## Overview

The Gasable Supplier Portal uses Supabase (PostgreSQL) as its database backend. This document provides detailed information about the database schema, relationships, security policies, and optimization strategies.

## Database Schema

### Core Tables

#### users

This table stores user account information and is managed by Supabase Auth.

```sql
CREATE TABLE public.users (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'supplier',
  status TEXT NOT NULL DEFAULT 'active',
  company_id UUID REFERENCES public.companies,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
```

#### companies

Stores company/merchant information.

```sql
CREATE TABLE public.companies (
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
```

#### stores

Stores information about supplier stores/locations.

```sql
CREATE TABLE public.stores (
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
```

#### products

Stores product information.

```sql
CREATE TABLE public.products (
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
```

#### product_attributes

Stores product attributes and specifications.

```sql
CREATE TABLE public.product_attributes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products NOT NULL,
  attribute_type TEXT NOT NULL,
  name TEXT NOT NULL,
  value TEXT NOT NULL,
  unit TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.product_attributes ENABLE ROW LEVEL SECURITY;
```

#### product_images

Stores product images.

```sql
CREATE TABLE public.product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products NOT NULL,
  url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
```

#### product_pricing

Stores product pricing information.

```sql
CREATE TABLE public.product_pricing (
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
```

#### delivery_zones

Stores delivery zone information.

```sql
CREATE TABLE public.delivery_zones (
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
```

#### delivery_vehicles

Stores information about delivery vehicles.

```sql
CREATE TABLE public.delivery_vehicles (
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
```

#### delivery_drivers

Stores information about delivery drivers.

```sql
CREATE TABLE public.delivery_drivers (
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
```

#### customers

Stores customer information.

```sql
CREATE TABLE public.customers (
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
```

#### orders

Stores order information.

```sql
CREATE TABLE public.orders (
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
```

#### order_items

Stores order line items.

```sql
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders NOT NULL,
  product_id UUID REFERENCES public.products NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price NUMERIC NOT NULL,
  total_price NUMERIC NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
```

#### support_tickets

Stores customer support tickets.

```sql
CREATE TABLE public.support_tickets (
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
```

#### ticket_messages

Stores messages related to support tickets.

```sql
CREATE TABLE public.ticket_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES public.support_tickets NOT NULL,
  sender_id UUID REFERENCES public.users,
  sender_type TEXT NOT NULL,
  message TEXT NOT NULL,
  attachments TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;
```

#### campaigns

Stores marketing campaign information.

```sql
CREATE TABLE public.campaigns (
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
```

#### invoices

Stores invoice information.

```sql
CREATE TABLE public.invoices (
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
```

## Row Level Security Policies

### users Table Policies

```sql
-- Users can read their own data
CREATE POLICY "Users can read own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Admins can read all user data
CREATE POLICY "Admins can read all user data" ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can update all user data
CREATE POLICY "Admins can update all user data" ON public.users
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### companies Table Policies

```sql
-- Users can read their own company data
CREATE POLICY "Users can read own company data" ON public.companies
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.company_id = companies.id
    )
  );

-- Users can update their own company data
CREATE POLICY "Users can update own company data" ON public.companies
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.company_id = companies.id
    )
  );

-- Admins can read all company data
CREATE POLICY "Admins can read all company data" ON public.companies
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can update all company data
CREATE POLICY "Admins can update all company data" ON public.companies
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### stores Table Policies

```sql
-- Users can read their own company's stores
CREATE POLICY "Users can read own company stores" ON public.stores
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.company_id = stores.company_id
    )
  );

-- Users can insert stores for their own company
CREATE POLICY "Users can insert stores for own company" ON public.stores
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.company_id = stores.company_id
    )
  );

-- Users can update their own company's stores
CREATE POLICY "Users can update own company stores" ON public.stores
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.company_id = stores.company_id
    )
  );

-- Users can delete their own company's stores
CREATE POLICY "Users can delete own company stores" ON public.stores
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.company_id = stores.company_id
    )
  );

-- Admins can read all stores
CREATE POLICY "Admins can read all stores" ON public.stores
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can update all stores
CREATE POLICY "Admins can update all stores" ON public.stores
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

Similar policies should be created for all tables to ensure proper data access control.

## Database Functions and Triggers

### Update Timestamp Trigger

```sql
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at column
CREATE TRIGGER update_companies_timestamp
BEFORE UPDATE ON public.companies
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_stores_timestamp
BEFORE UPDATE ON public.stores
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- Add similar triggers for all tables with updated_at column
```

### Generate Order Number Function

```sql
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number := 'ORD-' || to_char(now(), 'YYYY') || '-' || 
                     lpad(nextval('order_number_seq')::text, 6, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE IF NOT EXISTS order_number_seq;

CREATE TRIGGER set_order_number
BEFORE INSERT ON public.orders
FOR EACH ROW EXECUTE FUNCTION generate_order_number();
```

### Generate Ticket Number Function

```sql
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.ticket_number := 'TKT-' || to_char(now(), 'YYYY') || '-' || 
                      lpad(nextval('ticket_number_seq')::text, 6, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE IF NOT EXISTS ticket_number_seq;

CREATE TRIGGER set_ticket_number
BEFORE INSERT ON public.support_tickets
FOR EACH ROW EXECUTE FUNCTION generate_ticket_number();
```

## Database Indexes

Proper indexing is crucial for performance. Here are the recommended indexes:

```sql
-- users table
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_company_id ON public.users(company_id);

-- companies table
CREATE INDEX idx_companies_name ON public.companies(name);
CREATE INDEX idx_companies_cr_number ON public.companies(cr_number);
CREATE INDEX idx_companies_vat_number ON public.companies(vat_number);

-- stores table
CREATE INDEX idx_stores_company_id ON public.stores(company_id);
CREATE INDEX idx_stores_status ON public.stores(status);
CREATE INDEX idx_stores_location ON public.stores USING GIST(location);

-- products table
CREATE INDEX idx_products_company_id ON public.products(company_id);
CREATE INDEX idx_products_name ON public.products(name);
CREATE INDEX idx_products_sku ON public.products(sku);
CREATE INDEX idx_products_status ON public.products(status);
CREATE INDEX idx_products_type_category ON public.products(type, category);

-- product_attributes table
CREATE INDEX idx_product_attributes_product_id ON public.product_attributes(product_id);
CREATE INDEX idx_product_attributes_type ON public.product_attributes(attribute_type);

-- product_pricing table
CREATE INDEX idx_product_pricing_product_id ON public.product_pricing(product_id);
CREATE INDEX idx_product_pricing_zone_id ON public.product_pricing(zone_id);

-- orders table
CREATE INDEX idx_orders_company_id ON public.orders(company_id);
CREATE INDEX idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX idx_orders_delivery_status ON public.orders(delivery_status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at);

-- order_items table
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX idx_order_items_product_id ON public.order_items(product_id);

-- support_tickets table
CREATE INDEX idx_support_tickets_company_id ON public.support_tickets(company_id);
CREATE INDEX idx_support_tickets_status ON public.support_tickets(status);
CREATE INDEX idx_support_tickets_priority ON public.support_tickets(priority);
CREATE INDEX idx_support_tickets_category ON public.support_tickets(category);
CREATE INDEX idx_support_tickets_assignee_id ON public.support_tickets(assignee_id);
CREATE INDEX idx_support_tickets_created_at ON public.support_tickets(created_at);

-- ticket_messages table
CREATE INDEX idx_ticket_messages_ticket_id ON public.ticket_messages(ticket_id);
CREATE INDEX idx_ticket_messages_sender_id ON public.ticket_messages(sender_id);
```

## Database Views

### Active Products View

```sql
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
```

### Order Summary View

```sql
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
```

### Ticket Summary View

```sql
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
```

## Performance Optimization

### Query Optimization

1. **Use Prepared Statements**: For frequently executed queries to reduce parsing overhead.

2. **Limit Result Sets**: Always use LIMIT and OFFSET for pagination.

3. **Select Only Needed Columns**: Avoid `SELECT *` in production code.

4. **Use Appropriate Joins**: Choose the right join type (INNER, LEFT, etc.) based on requirements.

5. **Optimize Subqueries**: Replace subqueries with joins when possible for better performance.

### Database Maintenance

1. **Regular VACUUM**: Schedule regular VACUUM operations to reclaim space and update statistics.

2. **Update Statistics**: Run ANALYZE regularly to keep query planner statistics up to date.

3. **Monitor Index Usage**: Regularly review index usage and add/remove indexes as needed.

4. **Connection Pooling**: Use connection pooling to manage database connections efficiently.

## Backup and Recovery

### Backup Strategy

1. **Daily Full Backups**: Schedule daily full database backups.

2. **Point-in-Time Recovery**: Enable WAL archiving for point-in-time recovery.

3. **Backup Verification**: Regularly test backup restoration to ensure data integrity.

4. **Offsite Storage**: Store backups in multiple geographic locations.

### Recovery Procedures

1. **Full Database Restore**: Procedure for restoring the entire database.

2. **Point-in-Time Recovery**: Procedure for restoring to a specific point in time.

3. **Table-Level Recovery**: Procedure for restoring specific tables.

## Database Migration Strategy

1. **Version Control**: All database migrations should be version controlled.

2. **Forward-Only Migrations**: Design migrations to be forward-only (no rollbacks).

3. **Testing**: Test migrations in development and staging environments before production.

4. **Downtime Planning**: Schedule migrations during low-traffic periods to minimize impact.

5. **Backup Before Migration**: Always create a backup before applying migrations.

## Conclusion

This database schema is designed to support all the features of the Gasable Supplier Portal while ensuring data integrity, security, and performance. Regular maintenance and monitoring are essential to keep the database running optimally.