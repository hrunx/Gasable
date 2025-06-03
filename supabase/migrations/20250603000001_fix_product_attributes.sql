-- Fix Product Attributes Table Structure
-- Addresses the attribute_name column issue

-- 1. Check and fix product_attributes table structure
DO $$ 
BEGIN
    -- Check if product_attributes table exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'product_attributes') THEN
        -- Check if attribute_name column exists, if not rename or add
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'product_attributes' AND column_name = 'attribute_name') THEN
            -- If name column exists, rename it to attribute_name
            IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'product_attributes' AND column_name = 'name') THEN
                ALTER TABLE public.product_attributes RENAME COLUMN name TO attribute_name;
            ELSE
                -- Add attribute_name column if it doesn't exist
                ALTER TABLE public.product_attributes ADD COLUMN attribute_name TEXT;
            END IF;
        END IF;
        
        -- Check if attribute_value column exists
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'product_attributes' AND column_name = 'attribute_value') THEN
            -- If value column exists, rename it to attribute_value
            IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'product_attributes' AND column_name = 'value') THEN
                ALTER TABLE public.product_attributes RENAME COLUMN value TO attribute_value;
            ELSE
                -- Add attribute_value column if it doesn't exist
                ALTER TABLE public.product_attributes ADD COLUMN attribute_value TEXT;
            END IF;
        END IF;
        
        -- Check if attribute_type column exists
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'product_attributes' AND column_name = 'attribute_type') THEN
            -- If type column exists, rename it to attribute_type
            IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'product_attributes' AND column_name = 'type') THEN
                ALTER TABLE public.product_attributes RENAME COLUMN type TO attribute_type;
            ELSE
                -- Add attribute_type column if it doesn't exist
                ALTER TABLE public.product_attributes ADD COLUMN attribute_type TEXT;
            END IF;
        END IF;
    ELSE
        -- Create product_attributes table if it doesn't exist
        CREATE TABLE public.product_attributes (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
            attribute_name TEXT NOT NULL,
            attribute_value TEXT NOT NULL,
            attribute_type TEXT DEFAULT 'general',
            unit TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );
        
        -- Enable RLS
        ALTER TABLE public.product_attributes ENABLE ROW LEVEL SECURITY;
        
        -- Create RLS policy
        CREATE POLICY "Users can manage company product attributes" ON public.product_attributes
            FOR ALL 
            USING (
                product_id IN (
                    SELECT id FROM public.products 
                    WHERE company_id IN (
                        SELECT company_id FROM public.company_members 
                        WHERE user_id = auth.uid()
                    )
                )
            )
            WITH CHECK (
                product_id IN (
                    SELECT id FROM public.products 
                    WHERE company_id IN (
                        SELECT company_id FROM public.company_members 
                        WHERE user_id = auth.uid()
                    )
                )
            );
    END IF;
END $$;

-- 2. Update existing products with default pricing for testing
-- This is temporary data to help with testing until migration is run
UPDATE public.products 
SET 
    base_price = 100.00,
    b2b_price = 85.00,
    b2c_price = 120.00,
    min_order_quantity = 1,
    vat_included = true
WHERE base_price IS NULL OR b2b_price IS NULL OR b2c_price IS NULL;

-- Migration completed: Fixed product attributes table structure 