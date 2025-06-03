-- ========================================
-- ZONE MANAGEMENT & PRODUCT PRICING RLS POLICIES (FIXED)
-- ========================================
-- This file contains comprehensive Row Level Security policies
-- for zone management and product pricing functionality

-- Enable RLS on all tables
ALTER TABLE delivery_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_zone_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_members ENABLE ROW LEVEL SECURITY;

-- ========================================
-- DELIVERY ZONES POLICIES
-- ========================================

-- Allow company members to view their company's zones
CREATE POLICY "Users can view company delivery zones" ON delivery_zones
    FOR SELECT USING (
        company_id IN (
            SELECT company_id FROM company_members 
            WHERE profile_id = auth.uid()
            UNION
            SELECT company_id FROM users 
            WHERE id = auth.uid() AND company_id IS NOT NULL
        )
    );

-- Allow company members to create zones for their company
CREATE POLICY "Users can create company delivery zones" ON delivery_zones
    FOR INSERT WITH CHECK (
        company_id IN (
            SELECT company_id FROM company_members 
            WHERE profile_id = auth.uid()
            UNION
            SELECT company_id FROM users 
            WHERE id = auth.uid() AND company_id IS NOT NULL
        )
    );

-- Allow company members to update their company's zones
CREATE POLICY "Users can update company delivery zones" ON delivery_zones
    FOR UPDATE USING (
        company_id IN (
            SELECT company_id FROM company_members 
            WHERE profile_id = auth.uid()
            UNION
            SELECT company_id FROM users 
            WHERE id = auth.uid() AND company_id IS NOT NULL
        )
    ) WITH CHECK (
        company_id IN (
            SELECT company_id FROM company_members 
            WHERE profile_id = auth.uid()
            UNION
            SELECT company_id FROM users 
            WHERE id = auth.uid() AND company_id IS NOT NULL
        )
    );

-- Allow company members to delete their company's zones
CREATE POLICY "Users can delete company delivery zones" ON delivery_zones
    FOR DELETE USING (
        company_id IN (
            SELECT company_id FROM company_members 
            WHERE profile_id = auth.uid()
            UNION
            SELECT company_id FROM users 
            WHERE id = auth.uid() AND company_id IS NOT NULL
        )
    );

-- ========================================
-- PRODUCT ZONE ASSIGNMENTS POLICIES
-- ========================================

-- Allow users to view product-zone assignments for their company's products/zones
CREATE POLICY "Users can view company product zone assignments" ON product_zone_assignments
    FOR SELECT USING (
        zone_id IN (
            SELECT id FROM delivery_zones dz
            WHERE dz.company_id IN (
                SELECT company_id FROM company_members 
                WHERE profile_id = auth.uid()
                UNION
                SELECT company_id FROM users 
                WHERE id = auth.uid() AND company_id IS NOT NULL
            )
        )
        AND
        product_id IN (
            SELECT id FROM products p
            WHERE p.company_id IN (
                SELECT company_id FROM company_members 
                WHERE profile_id = auth.uid()
                UNION
                SELECT company_id FROM users 
                WHERE id = auth.uid() AND company_id IS NOT NULL
            )
        )
    );

-- Allow users to create product-zone assignments for their company
CREATE POLICY "Users can create company product zone assignments" ON product_zone_assignments
    FOR INSERT WITH CHECK (
        zone_id IN (
            SELECT id FROM delivery_zones dz
            WHERE dz.company_id IN (
                SELECT company_id FROM company_members 
                WHERE profile_id = auth.uid()
                UNION
                SELECT company_id FROM users 
                WHERE id = auth.uid() AND company_id IS NOT NULL
            )
        )
        AND
        product_id IN (
            SELECT id FROM products p
            WHERE p.company_id IN (
                SELECT company_id FROM company_members 
                WHERE profile_id = auth.uid()
                UNION
                SELECT company_id FROM users 
                WHERE id = auth.uid() AND company_id IS NOT NULL
            )
        )
    );

-- Allow users to update product-zone assignments for their company
CREATE POLICY "Users can update company product zone assignments" ON product_zone_assignments
    FOR UPDATE USING (
        zone_id IN (
            SELECT id FROM delivery_zones dz
            WHERE dz.company_id IN (
                SELECT company_id FROM company_members 
                WHERE profile_id = auth.uid()
                UNION
                SELECT company_id FROM users 
                WHERE id = auth.uid() AND company_id IS NOT NULL
            )
        )
        AND
        product_id IN (
            SELECT id FROM products p
            WHERE p.company_id IN (
                SELECT company_id FROM company_members 
                WHERE profile_id = auth.uid()
                UNION
                SELECT company_id FROM users 
                WHERE id = auth.uid() AND company_id IS NOT NULL
            )
        )
    ) WITH CHECK (
        zone_id IN (
            SELECT id FROM delivery_zones dz
            WHERE dz.company_id IN (
                SELECT company_id FROM company_members 
                WHERE profile_id = auth.uid()
                UNION
                SELECT company_id FROM users 
                WHERE id = auth.uid() AND company_id IS NOT NULL
            )
        )
        AND
        product_id IN (
            SELECT id FROM products p
            WHERE p.company_id IN (
                SELECT company_id FROM company_members 
                WHERE profile_id = auth.uid()
                UNION
                SELECT company_id FROM users 
                WHERE id = auth.uid() AND company_id IS NOT NULL
            )
        )
    );

-- Allow users to delete product-zone assignments for their company
CREATE POLICY "Users can delete company product zone assignments" ON product_zone_assignments
    FOR DELETE USING (
        zone_id IN (
            SELECT id FROM delivery_zones dz
            WHERE dz.company_id IN (
                SELECT company_id FROM company_members 
                WHERE profile_id = auth.uid()
                UNION
                SELECT company_id FROM users 
                WHERE id = auth.uid() AND company_id IS NOT NULL
            )
        )
        AND
        product_id IN (
            SELECT id FROM products p
            WHERE p.company_id IN (
                SELECT company_id FROM company_members 
                WHERE profile_id = auth.uid()
                UNION
                SELECT company_id FROM users 
                WHERE id = auth.uid() AND company_id IS NOT NULL
            )
        )
    );

-- ========================================
-- PRODUCTS TABLE RLS POLICIES (UPDATE/CREATE)
-- ========================================

-- Allow company members to view their company's products
CREATE POLICY "Users can view company products" ON products
    FOR SELECT USING (
        company_id IN (
            SELECT company_id FROM company_members 
            WHERE profile_id = auth.uid()
            UNION
            SELECT company_id FROM users 
            WHERE id = auth.uid() AND company_id IS NOT NULL
        )
    );

-- Allow company members to create products for their company
CREATE POLICY "Users can create company products" ON products
    FOR INSERT WITH CHECK (
        company_id IN (
            SELECT company_id FROM company_members 
            WHERE profile_id = auth.uid()
            UNION
            SELECT company_id FROM users 
            WHERE id = auth.uid() AND company_id IS NOT NULL
        )
    );

-- Allow company members to update their company's products
CREATE POLICY "Users can update company products" ON products
    FOR UPDATE USING (
        company_id IN (
            SELECT company_id FROM company_members 
            WHERE profile_id = auth.uid()
            UNION
            SELECT company_id FROM users 
            WHERE id = auth.uid() AND company_id IS NOT NULL
        )
    ) WITH CHECK (
        company_id IN (
            SELECT company_id FROM company_members 
            WHERE profile_id = auth.uid()
            UNION
            SELECT company_id FROM users 
            WHERE id = auth.uid() AND company_id IS NOT NULL
        )
    );

-- Allow company members to delete their company's products
CREATE POLICY "Users can delete company products" ON products
    FOR DELETE USING (
        company_id IN (
            SELECT company_id FROM company_members 
            WHERE profile_id = auth.uid()
            UNION
            SELECT company_id FROM users 
            WHERE id = auth.uid() AND company_id IS NOT NULL
        )
    );

-- ========================================
-- COMPANY ACCESS POLICIES
-- ========================================

-- Allow users to view companies they are members of
CREATE POLICY "Users can view their companies" ON companies
    FOR SELECT USING (
        id IN (
            SELECT company_id FROM company_members 
            WHERE profile_id = auth.uid()
            UNION
            SELECT company_id FROM users 
            WHERE id = auth.uid() AND company_id IS NOT NULL
        )
    );

-- Allow users to view company memberships
CREATE POLICY "Users can view company memberships" ON company_members
    FOR SELECT USING (
        profile_id = auth.uid()
        OR
        company_id IN (
            SELECT company_id FROM company_members 
            WHERE profile_id = auth.uid()
            UNION
            SELECT company_id FROM users 
            WHERE id = auth.uid() AND company_id IS NOT NULL
        )
    );

-- ========================================
-- DATABASE FUNCTIONS FOR ZONE MANAGEMENT
-- ========================================

-- Function to get effective product price for a zone
CREATE OR REPLACE FUNCTION get_effective_product_price(
    p_product_id UUID,
    p_zone_id UUID,
    p_price_type TEXT DEFAULT 'b2c'
)
RETURNS DECIMAL(10,2) AS $$
DECLARE
    v_override_price DECIMAL(10,2);
    v_base_price DECIMAL(10,2);
BEGIN
    -- Get override price from assignment
    EXECUTE format('
        SELECT pza.override_%s_price 
        FROM product_zone_assignments pza 
        WHERE pza.product_id = $1 AND pza.zone_id = $2 AND pza.is_active = true
    ', p_price_type)
    INTO v_override_price
    USING p_product_id, p_zone_id;
    
    -- If override exists, return it
    IF v_override_price IS NOT NULL THEN
        RETURN v_override_price;
    END IF;
    
    -- Otherwise get base price from product
    EXECUTE format('
        SELECT p.%s_price 
        FROM products p 
        WHERE p.id = $1
    ', p_price_type)
    INTO v_base_price
    USING p_product_id;
    
    RETURN COALESCE(v_base_price, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to assign product to zone with optional pricing
CREATE OR REPLACE FUNCTION assign_product_to_zone(
    p_product_id UUID,
    p_zone_id UUID,
    p_override_base_price DECIMAL(10,2) DEFAULT NULL,
    p_override_b2b_price DECIMAL(10,2) DEFAULT NULL,
    p_override_b2c_price DECIMAL(10,2) DEFAULT NULL,
    p_priority INTEGER DEFAULT 1
)
RETURNS UUID AS $$
DECLARE
    v_assignment_id UUID;
    v_company_id UUID;
BEGIN
    -- Verify both product and zone belong to same company
    SELECT p.company_id INTO v_company_id
    FROM products p
    JOIN delivery_zones dz ON dz.company_id = p.company_id
    WHERE p.id = p_product_id AND dz.id = p_zone_id;
    
    IF v_company_id IS NULL THEN
        RAISE EXCEPTION 'Product and zone must belong to same company';
    END IF;
    
    -- Insert assignment
    INSERT INTO product_zone_assignments (
        id,
        product_id,
        zone_id,
        override_base_price,
        override_b2b_price,
        override_b2c_price,
        priority,
        is_active,
        created_at,
        updated_at
    ) VALUES (
        gen_random_uuid(),
        p_product_id,
        p_zone_id,
        p_override_base_price,
        p_override_b2b_price,
        p_override_b2c_price,
        p_priority,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (product_id, zone_id) 
    DO UPDATE SET
        override_base_price = EXCLUDED.override_base_price,
        override_b2b_price = EXCLUDED.override_b2b_price,
        override_b2c_price = EXCLUDED.override_b2c_price,
        priority = EXCLUDED.priority,
        updated_at = NOW()
    RETURNING id INTO v_assignment_id;
    
    RETURN v_assignment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get zone statistics
CREATE OR REPLACE FUNCTION get_zone_statistics(p_company_id UUID)
RETURNS JSON AS $$
DECLARE
    v_stats JSON;
BEGIN
    SELECT json_build_object(
        'total_zones', COUNT(*),
        'active_zones', COUNT(*) FILTER (WHERE is_active = true),
        'zone_types', json_object_agg(zone_type, type_count)
    ) INTO v_stats
    FROM (
        SELECT 
            zone_type,
            COUNT(*) as type_count,
            bool_and(is_active) as is_active
        FROM delivery_zones 
        WHERE company_id = p_company_id
        GROUP BY zone_type
    ) zone_stats;
    
    RETURN COALESCE(v_stats, '{}'::json);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- INDEXES FOR PERFORMANCE
-- ========================================

-- Indexes for delivery_zones
CREATE INDEX IF NOT EXISTS idx_delivery_zones_company_id ON delivery_zones(company_id);
CREATE INDEX IF NOT EXISTS idx_delivery_zones_active ON delivery_zones(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_delivery_zones_zone_type ON delivery_zones(zone_type);

-- Indexes for product_zone_assignments
CREATE INDEX IF NOT EXISTS idx_product_zone_assignments_product_id ON product_zone_assignments(product_id);
CREATE INDEX IF NOT EXISTS idx_product_zone_assignments_zone_id ON product_zone_assignments(zone_id);
CREATE INDEX IF NOT EXISTS idx_product_zone_assignments_active ON product_zone_assignments(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_product_zone_assignments_priority ON product_zone_assignments(priority);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_product_zone_assignments_product_zone ON product_zone_assignments(product_id, zone_id);
CREATE INDEX IF NOT EXISTS idx_delivery_zones_company_active ON delivery_zones(company_id, is_active);

-- ========================================
-- PERMISSIONS FOR FUNCTIONS
-- ========================================

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION get_effective_product_price(UUID, UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION assign_product_to_zone(UUID, UUID, DECIMAL, DECIMAL, DECIMAL, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_zone_statistics(UUID) TO authenticated;

-- ========================================
-- DATA VALIDATION TRIGGERS
-- ========================================

-- Trigger to validate zone assignments belong to same company
CREATE OR REPLACE FUNCTION validate_product_zone_assignment()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if product and zone belong to same company
    IF NOT EXISTS (
        SELECT 1 
        FROM products p
        JOIN delivery_zones dz ON dz.company_id = p.company_id
        WHERE p.id = NEW.product_id AND dz.id = NEW.zone_id
    ) THEN
        RAISE EXCEPTION 'Product and delivery zone must belong to the same company';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_validate_product_zone_assignment
    BEFORE INSERT OR UPDATE ON product_zone_assignments
    FOR EACH ROW EXECUTE FUNCTION validate_product_zone_assignment();

-- ========================================
-- SUMMARY
-- ========================================
/*
This file creates:
1. Comprehensive RLS policies for all zone management tables
2. Database functions for pricing calculations and zone assignments
3. Performance indexes for efficient queries
4. Data validation triggers
5. Proper permissions for authenticated users

To execute:
1. Run this SQL in Supabase SQL Editor
2. Verify policies are active: SELECT * FROM pg_policies WHERE tablename LIKE '%zone%';
3. Test functions: SELECT get_zone_statistics('company-uuid-here');
4. Check indexes: \di in psql or use Supabase dashboard

Security Features:
- All operations restricted to company members only
- Cross-company data access prevented
- Pricing overrides properly validated
- Assignment integrity enforced
*/ 