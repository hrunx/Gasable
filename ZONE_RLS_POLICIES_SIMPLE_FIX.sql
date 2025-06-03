-- ========================================
-- ZONE MANAGEMENT RLS POLICIES - SIMPLE FIX
-- ========================================
-- This file contains only the essential RLS policies 
-- with correct column names (profile_id instead of user_id)

-- Drop existing conflicting policies first (if they exist)
DROP POLICY IF EXISTS "Users can view company delivery zones" ON delivery_zones;
DROP POLICY IF EXISTS "Users can create company delivery zones" ON delivery_zones;
DROP POLICY IF EXISTS "Users can update company delivery zones" ON delivery_zones;
DROP POLICY IF EXISTS "Users can delete company delivery zones" ON delivery_zones;

DROP POLICY IF EXISTS "Users can view company product zone assignments" ON product_zone_assignments;
DROP POLICY IF EXISTS "Users can create company product zone assignments" ON product_zone_assignments;
DROP POLICY IF EXISTS "Users can update company product zone assignments" ON product_zone_assignments;
DROP POLICY IF EXISTS "Users can delete company product zone assignments" ON product_zone_assignments;

DROP POLICY IF EXISTS "Users can view company products" ON products;
DROP POLICY IF EXISTS "Users can create company products" ON products;
DROP POLICY IF EXISTS "Users can update company products" ON products;
DROP POLICY IF EXISTS "Users can delete company products" ON products;

DROP POLICY IF EXISTS "Users can view their companies" ON companies;
DROP POLICY IF EXISTS "Users can view company memberships" ON company_members;

-- Enable RLS on all tables (if not already enabled)
ALTER TABLE delivery_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_zone_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_members ENABLE ROW LEVEL SECURITY;

-- ========================================
-- DELIVERY ZONES POLICIES
-- ========================================

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
-- PRODUCTS TABLE RLS POLICIES
-- ========================================

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

CREATE POLICY "Users can view company memberships" ON company_members
    FOR SELECT USING (
        profile_id = auth.uid()
        OR
        company_id IN (
            SELECT company_id FROM users 
            WHERE id = auth.uid() AND company_id IS NOT NULL
        )
    );

-- ========================================
-- VERIFICATION QUERIES
-- ========================================

-- Verify policies were created successfully
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename IN ('delivery_zones', 'product_zone_assignments', 'products', 'companies', 'company_members')
ORDER BY tablename, policyname;

-- Test company ID resolution for current user
SELECT 
    'company_members' as source,
    company_id
FROM company_members 
WHERE profile_id = auth.uid()
UNION
SELECT 
    'users' as source,
    company_id
FROM users 
WHERE id = auth.uid() AND company_id IS NOT NULL; 