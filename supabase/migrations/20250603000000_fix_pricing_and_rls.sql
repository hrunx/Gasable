-- Fix Pricing System and RLS Policies Migration
-- Addresses missing pricing columns and RLS violations

-- 1. Add missing pricing columns to products table (with error handling)
DO $$ 
BEGIN
    -- Add base_price column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'base_price') THEN
        ALTER TABLE public.products ADD COLUMN base_price DECIMAL(10,2);
    END IF;
    
    -- Add b2b_price column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'b2b_price') THEN
        ALTER TABLE public.products ADD COLUMN b2b_price DECIMAL(10,2);
    END IF;
    
    -- Add b2c_price column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'b2c_price') THEN
        ALTER TABLE public.products ADD COLUMN b2c_price DECIMAL(10,2);
    END IF;
    
    -- Add min_order_quantity column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'min_order_quantity') THEN
        ALTER TABLE public.products ADD COLUMN min_order_quantity INTEGER DEFAULT 1;
    END IF;
    
    -- Add vat_included column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'vat_included') THEN
        ALTER TABLE public.products ADD COLUMN vat_included BOOLEAN DEFAULT false;
    END IF;
    
    -- Add store_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'store_id') THEN
        ALTER TABLE public.products ADD COLUMN store_id UUID REFERENCES public.stores(id);
    END IF;
END $$;

-- 2. Update delivery_zones table with missing columns
DO $$ 
BEGIN
    -- Add zone_type column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'delivery_zones' AND column_name = 'zone_type') THEN
        ALTER TABLE public.delivery_zones ADD COLUMN zone_type VARCHAR(20) DEFAULT 'urban';
    END IF;
    
    -- Add delivery_fee column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'delivery_zones' AND column_name = 'delivery_fee') THEN
        ALTER TABLE public.delivery_zones ADD COLUMN delivery_fee DECIMAL(10,2) DEFAULT 0;
    END IF;
    
    -- Add default_b2b_price column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'delivery_zones' AND column_name = 'default_b2b_price') THEN
        ALTER TABLE public.delivery_zones ADD COLUMN default_b2b_price DECIMAL(10,2);
    END IF;
    
    -- Add default_b2c_price column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'delivery_zones' AND column_name = 'default_b2c_price') THEN
        ALTER TABLE public.delivery_zones ADD COLUMN default_b2c_price DECIMAL(10,2);
    END IF;
    
    -- Add discount_percentage column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'delivery_zones' AND column_name = 'discount_percentage') THEN
        ALTER TABLE public.delivery_zones ADD COLUMN discount_percentage DECIMAL(5,2) DEFAULT 0;
    END IF;
    
    -- Add is_active column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'delivery_zones' AND column_name = 'is_active') THEN
        ALTER TABLE public.delivery_zones ADD COLUMN is_active BOOLEAN DEFAULT true;
    END IF;
    
    -- Add coverage_areas column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'delivery_zones' AND column_name = 'coverage_areas') THEN
        ALTER TABLE public.delivery_zones ADD COLUMN coverage_areas TEXT[];
    END IF;
    
    -- Add description column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'delivery_zones' AND column_name = 'description') THEN
        ALTER TABLE public.delivery_zones ADD COLUMN description TEXT;
    END IF;
    
    -- Add store_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'delivery_zones' AND column_name = 'store_id') THEN
        ALTER TABLE public.delivery_zones ADD COLUMN store_id UUID REFERENCES public.stores(id);
    END IF;
END $$;

-- 3. Create product_zone_assignments table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.product_zone_assignments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    zone_id UUID REFERENCES public.delivery_zones(id) ON DELETE CASCADE,
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    override_base_price DECIMAL(10,2),
    override_b2b_price DECIMAL(10,2),
    override_b2c_price DECIMAL(10,2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(product_id, zone_id)
);

-- 4. Update RLS policies for products table
DROP POLICY IF EXISTS "Users can manage company products" ON public.products;
CREATE POLICY "Users can manage company products" ON public.products
    FOR ALL 
    USING (
        company_id IN (
            SELECT company_id FROM public.company_members 
            WHERE user_id = auth.uid()
        )
    )
    WITH CHECK (
        company_id IN (
            SELECT company_id FROM public.company_members 
            WHERE user_id = auth.uid()
        )
    );

-- 5. Fix RLS policies for delivery_zones table
DROP POLICY IF EXISTS "Users can manage company delivery zones" ON public.delivery_zones;
CREATE POLICY "Users can manage company delivery zones" ON public.delivery_zones
    FOR ALL 
    USING (
        company_id IN (
            SELECT company_id FROM public.company_members 
            WHERE user_id = auth.uid()
        )
    )
    WITH CHECK (
        company_id IN (
            SELECT company_id FROM public.company_members 
            WHERE user_id = auth.uid()
        )
    );

-- 6. Create RLS policies for product_zone_assignments table
ALTER TABLE public.product_zone_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage company product zone assignments" ON public.product_zone_assignments
    FOR ALL 
    USING (
        company_id IN (
            SELECT company_id FROM public.company_members 
            WHERE user_id = auth.uid()
        )
    )
    WITH CHECK (
        company_id IN (
            SELECT company_id FROM public.company_members 
            WHERE user_id = auth.uid()
        )
    );

-- 7. Fix RLS policies for delivery_vehicles table
DROP POLICY IF EXISTS "Users can manage company vehicles" ON public.delivery_vehicles;
CREATE POLICY "Users can manage company vehicles" ON public.delivery_vehicles
    FOR ALL 
    USING (
        company_id IN (
            SELECT company_id FROM public.company_members 
            WHERE user_id = auth.uid()
        )
    )
    WITH CHECK (
        company_id IN (
            SELECT company_id FROM public.company_members 
            WHERE user_id = auth.uid()
        )
    );

-- 8. Fix RLS policies for delivery_drivers table
DROP POLICY IF EXISTS "Users can manage company drivers" ON public.delivery_drivers;
CREATE POLICY "Users can manage company drivers" ON public.delivery_drivers
    FOR ALL 
    USING (
        company_id IN (
            SELECT company_id FROM public.company_members 
            WHERE user_id = auth.uid()
        )
    )
    WITH CHECK (
        company_id IN (
            SELECT company_id FROM public.company_members 
            WHERE user_id = auth.uid()
        )
    );

-- 9. Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_pricing ON public.products(base_price, b2b_price, b2c_price);
CREATE INDEX IF NOT EXISTS idx_products_store_id ON public.products(store_id);
CREATE INDEX IF NOT EXISTS idx_delivery_zones_store_id ON public.delivery_zones(store_id);
CREATE INDEX IF NOT EXISTS idx_delivery_zones_zone_type ON public.delivery_zones(zone_type);
CREATE INDEX IF NOT EXISTS idx_product_zone_assignments_product_id ON public.product_zone_assignments(product_id);
CREATE INDEX IF NOT EXISTS idx_product_zone_assignments_zone_id ON public.product_zone_assignments(zone_id);

-- 10. Create database functions for pricing
CREATE OR REPLACE FUNCTION get_effective_product_price(
    product_id UUID,
    zone_id UUID,
    price_type TEXT DEFAULT 'base'
)
RETURNS DECIMAL(10,2)
LANGUAGE plpgsql
AS $$
DECLARE
    effective_price DECIMAL(10,2);
    override_price DECIMAL(10,2);
    product_price DECIMAL(10,2);
    zone_price DECIMAL(10,2);
BEGIN
    -- Get override price from product_zone_assignments
    SELECT 
        CASE 
            WHEN price_type = 'b2b' THEN pza.override_b2b_price
            WHEN price_type = 'b2c' THEN pza.override_b2c_price
            ELSE pza.override_base_price
        END INTO override_price
    FROM product_zone_assignments pza
    WHERE pza.product_id = get_effective_product_price.product_id 
    AND pza.zone_id = get_effective_product_price.zone_id
    AND pza.is_active = true;
    
    -- If override exists, use it
    IF override_price IS NOT NULL THEN
        RETURN override_price;
    END IF;
    
    -- Get product default price
    SELECT 
        CASE 
            WHEN price_type = 'b2b' THEN p.b2b_price
            WHEN price_type = 'b2c' THEN p.b2c_price
            ELSE p.base_price
        END INTO product_price
    FROM products p
    WHERE p.id = get_effective_product_price.product_id;
    
    -- If product price exists, use it
    IF product_price IS NOT NULL THEN
        RETURN product_price;
    END IF;
    
    -- Get zone default price
    SELECT 
        CASE 
            WHEN price_type = 'b2b' THEN dz.default_b2b_price
            WHEN price_type = 'b2c' THEN dz.default_b2c_price
            ELSE dz.default_b2b_price  -- fallback to b2b for base
        END INTO zone_price
    FROM delivery_zones dz
    WHERE dz.id = get_effective_product_price.zone_id;
    
    RETURN COALESCE(zone_price, 0.00);
END;
$$;

-- 11. Create function for assigning products to zones
CREATE OR REPLACE FUNCTION assign_product_to_zone(
    p_product_id UUID,
    p_zone_id UUID,
    p_company_id UUID,
    p_override_base_price DECIMAL(10,2) DEFAULT NULL,
    p_override_b2b_price DECIMAL(10,2) DEFAULT NULL,
    p_override_b2c_price DECIMAL(10,2) DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
    assignment_id UUID;
BEGIN
    INSERT INTO product_zone_assignments (
        product_id,
        zone_id,
        company_id,
        override_base_price,
        override_b2b_price,
        override_b2c_price
    ) VALUES (
        p_product_id,
        p_zone_id,
        p_company_id,
        p_override_base_price,
        p_override_b2b_price,
        p_override_b2c_price
    ) ON CONFLICT (product_id, zone_id) 
    DO UPDATE SET
        override_base_price = EXCLUDED.override_base_price,
        override_b2b_price = EXCLUDED.override_b2b_price,
        override_b2c_price = EXCLUDED.override_b2c_price,
        updated_at = NOW()
    RETURNING id INTO assignment_id;
    
    RETURN assignment_id;
END;
$$;

-- 12. Create view for product pricing with zone information
CREATE OR REPLACE VIEW product_pricing_view AS
SELECT 
    p.id as product_id,
    p.name as product_name,
    p.company_id,
    p.store_id,
    p.base_price as product_base_price,
    p.b2b_price as product_b2b_price,
    p.b2c_price as product_b2c_price,
    dz.id as zone_id,
    dz.name as zone_name,
    dz.zone_type,
    dz.default_b2b_price as zone_default_b2b_price,
    dz.default_b2c_price as zone_default_b2c_price,
    pza.override_base_price,
    pza.override_b2b_price,
    pza.override_b2c_price,
    get_effective_product_price(p.id, dz.id, 'base') as effective_base_price,
    get_effective_product_price(p.id, dz.id, 'b2b') as effective_b2b_price,
    get_effective_product_price(p.id, dz.id, 'b2c') as effective_b2c_price
FROM products p
LEFT JOIN product_zone_assignments pza ON p.id = pza.product_id
LEFT JOIN delivery_zones dz ON pza.zone_id = dz.id
WHERE p.status = 'active' AND (dz.is_active IS NULL OR dz.is_active = true);

-- Migration completed: Fixed pricing system with proper RLS policies and database structure 