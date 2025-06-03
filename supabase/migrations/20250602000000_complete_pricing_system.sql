-- Complete Pricing System Migration
-- Restructures pricing to support store-based default pricing + zone-specific overrides

-- 1. Add default pricing columns to products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS base_price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS b2b_price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS b2c_price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS min_order_quantity INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS vat_included BOOLEAN DEFAULT false;

-- 2. Update delivery_zones table to include zone-specific settings
ALTER TABLE public.delivery_zones 
ADD COLUMN IF NOT EXISTS zone_type VARCHAR(20) DEFAULT 'urban',
ADD COLUMN IF NOT EXISTS delivery_fee DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS default_b2b_price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS default_b2c_price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS discount_percentage DECIMAL(5,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS coverage_areas TEXT[],
ADD COLUMN IF NOT EXISTS description TEXT;

-- 3. Create product_zone_assignments table (junction table)
CREATE TABLE IF NOT EXISTS public.product_zone_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    zone_id UUID NOT NULL REFERENCES public.delivery_zones(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
    
    -- Zone-specific pricing overrides (nullable - uses product default if null)
    override_base_price DECIMAL(10,2),
    override_b2b_price DECIMAL(10,2),
    override_b2c_price DECIMAL(10,2),
    override_min_order_quantity INTEGER,
    
    -- Assignment metadata
    is_active BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 1, -- For zone priority if product is in multiple zones
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure unique product-zone combinations
    UNIQUE(product_id, zone_id)
);

-- 4. Update product_pricing table to reference zone assignments (if keeping it)
-- This keeps the existing structure but adds reference to assignments
ALTER TABLE public.product_pricing 
ADD COLUMN IF NOT EXISTS assignment_id UUID REFERENCES public.product_zone_assignments(id) ON DELETE CASCADE;

-- 5. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_product_zone_assignments_product_id ON public.product_zone_assignments(product_id);
CREATE INDEX IF NOT EXISTS idx_product_zone_assignments_zone_id ON public.product_zone_assignments(zone_id);
CREATE INDEX IF NOT EXISTS idx_product_zone_assignments_store_id ON public.product_zone_assignments(store_id);
CREATE INDEX IF NOT EXISTS idx_product_zone_assignments_company_id ON public.product_zone_assignments(company_id);
CREATE INDEX IF NOT EXISTS idx_delivery_zones_store_id ON public.delivery_zones(store_id);
CREATE INDEX IF NOT EXISTS idx_delivery_zones_zone_type ON public.delivery_zones(zone_type);
CREATE INDEX IF NOT EXISTS idx_products_store_pricing ON public.products(store_id, base_price);

-- 6. Row Level Security Policies

-- Product zone assignments RLS
ALTER TABLE public.product_zone_assignments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own company product zone assignments" ON public.product_zone_assignments;
CREATE POLICY "Users can read own company product zone assignments"
    ON public.product_zone_assignments FOR SELECT
    USING (company_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert product zone assignments for own company" ON public.product_zone_assignments;
CREATE POLICY "Users can insert product zone assignments for own company"
    ON public.product_zone_assignments FOR INSERT
    WITH CHECK (company_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own company product zone assignments" ON public.product_zone_assignments;
CREATE POLICY "Users can update own company product zone assignments"
    ON public.product_zone_assignments FOR UPDATE
    USING (company_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete own company product zone assignments" ON public.product_zone_assignments;
CREATE POLICY "Users can delete own company product zone assignments"
    ON public.product_zone_assignments FOR DELETE
    USING (company_id = auth.uid());

-- Update delivery zones RLS to include new columns
DROP POLICY IF EXISTS "Users can read own company delivery zones" ON public.delivery_zones;
CREATE POLICY "Users can read own company delivery zones"
    ON public.delivery_zones FOR SELECT
    USING (company_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert delivery zones for own company" ON public.delivery_zones;
CREATE POLICY "Users can insert delivery zones for own company"
    ON public.delivery_zones FOR INSERT
    WITH CHECK (company_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own company delivery zones" ON public.delivery_zones;
CREATE POLICY "Users can update own company delivery zones"
    ON public.delivery_zones FOR UPDATE
    USING (company_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete own company delivery zones" ON public.delivery_zones;
CREATE POLICY "Users can delete own company delivery zones"
    ON public.delivery_zones FOR DELETE
    USING (company_id = auth.uid());

-- 7. Create helpful views for common queries

-- View for products with their zone assignments and effective pricing
CREATE OR REPLACE VIEW public.products_with_zone_pricing AS
SELECT 
    p.id as product_id,
    p.name as product_name,
    p.store_id,
    p.company_id,
    p.base_price as default_base_price,
    p.b2b_price as default_b2b_price,
    p.b2c_price as default_b2c_price,
    p.min_order_quantity as default_min_order,
    
    dz.id as zone_id,
    dz.name as zone_name,
    dz.zone_type,
    dz.delivery_fee,
    dz.discount_percentage,
    
    pza.override_base_price,
    pza.override_b2b_price,
    pza.override_b2c_price,
    pza.override_min_order_quantity,
    
    -- Effective pricing (override if exists, otherwise default)
    COALESCE(pza.override_base_price, p.base_price) as effective_base_price,
    COALESCE(pza.override_b2b_price, p.b2b_price) as effective_b2b_price,
    COALESCE(pza.override_b2c_price, p.b2c_price) as effective_b2c_price,
    COALESCE(pza.override_min_order_quantity, p.min_order_quantity) as effective_min_order,
    
    pza.is_active as assignment_active,
    pza.priority,
    pza.created_at as assigned_at
    
FROM public.products p
LEFT JOIN public.product_zone_assignments pza ON p.id = pza.product_id
LEFT JOIN public.delivery_zones dz ON pza.zone_id = dz.id
WHERE p.status = 'active' AND (pza.is_active IS NULL OR pza.is_active = true);

-- Grant permissions on the view
GRANT SELECT ON public.products_with_zone_pricing TO authenticated;

-- 8. Create functions for common operations

-- Function to get effective price for a product in a specific zone
CREATE OR REPLACE FUNCTION public.get_effective_product_price(
    p_product_id UUID,
    p_zone_id UUID,
    p_price_type TEXT DEFAULT 'base'
) RETURNS DECIMAL(10,2) AS $$
DECLARE
    effective_price DECIMAL(10,2);
BEGIN
    SELECT 
        CASE 
            WHEN p_price_type = 'b2b' THEN 
                COALESCE(pza.override_b2b_price, p.b2b_price)
            WHEN p_price_type = 'b2c' THEN 
                COALESCE(pza.override_b2c_price, p.b2c_price)
            ELSE 
                COALESCE(pza.override_base_price, p.base_price)
        END
    INTO effective_price
    FROM public.products p
    LEFT JOIN public.product_zone_assignments pza ON p.id = pza.product_id AND pza.zone_id = p_zone_id
    WHERE p.id = p_product_id;
    
    RETURN effective_price;
END;
$$ LANGUAGE plpgsql;

-- Function to assign product to zone with optional pricing override
CREATE OR REPLACE FUNCTION public.assign_product_to_zone(
    p_product_id UUID,
    p_zone_id UUID,
    p_company_id UUID,
    p_store_id UUID,
    p_override_base_price DECIMAL(10,2) DEFAULT NULL,
    p_override_b2b_price DECIMAL(10,2) DEFAULT NULL,
    p_override_b2c_price DECIMAL(10,2) DEFAULT NULL,
    p_override_min_order INTEGER DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    assignment_id UUID;
BEGIN
    INSERT INTO public.product_zone_assignments (
        product_id, zone_id, company_id, store_id,
        override_base_price, override_b2b_price, override_b2c_price, override_min_order_quantity
    ) VALUES (
        p_product_id, p_zone_id, p_company_id, p_store_id,
        p_override_base_price, p_override_b2b_price, p_override_b2c_price, p_override_min_order
    ) 
    ON CONFLICT (product_id, zone_id) 
    DO UPDATE SET
        override_base_price = EXCLUDED.override_base_price,
        override_b2b_price = EXCLUDED.override_b2b_price,
        override_b2c_price = EXCLUDED.override_b2c_price,
        override_min_order_quantity = EXCLUDED.override_min_order_quantity,
        updated_at = NOW()
    RETURNING id INTO assignment_id;
    
    RETURN assignment_id;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION public.get_effective_product_price TO authenticated;
GRANT EXECUTE ON FUNCTION public.assign_product_to_zone TO authenticated; 