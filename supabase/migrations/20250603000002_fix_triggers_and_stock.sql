-- Fix Triggers and Stock Quantity Issues
-- Addresses the stock_quantity trigger error

-- 1. Add stock_quantity column to products table if missing
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'stock_quantity') THEN
        ALTER TABLE public.products ADD COLUMN stock_quantity INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'low_stock_threshold') THEN
        ALTER TABLE public.products ADD COLUMN low_stock_threshold INTEGER DEFAULT 10;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'track_inventory') THEN
        ALTER TABLE public.products ADD COLUMN track_inventory BOOLEAN DEFAULT true;
    END IF;
END $$;

-- 2. Drop existing problematic trigger function if it exists
DROP FUNCTION IF EXISTS handle_product_stock_alerts() CASCADE;

-- 3. Create corrected stock alert function
CREATE OR REPLACE FUNCTION handle_product_stock_alerts()
RETURNS TRIGGER AS $$
BEGIN
    -- Only proceed if stock_quantity column exists and product tracks inventory
    IF TG_OP = 'UPDATE' AND NEW.track_inventory = true THEN
        -- Check if stock went from above threshold to below threshold
        IF NEW.stock_quantity <= NEW.low_stock_threshold AND 
           (OLD.stock_quantity IS NULL OR OLD.stock_quantity > NEW.low_stock_threshold) THEN
            
            -- Insert low stock notification
            INSERT INTO notifications (
                company_id,
                type,
                title,
                message,
                metadata,
                created_at
            ) VALUES (
                NEW.company_id,
                'low_stock',
                'Low Stock Alert',
                'Product "' || NEW.name || '" is running low on stock (' || NEW.stock_quantity || ' remaining)',
                jsonb_build_object(
                    'product_id', NEW.id,
                    'product_name', NEW.name,
                    'current_stock', NEW.stock_quantity,
                    'threshold', NEW.low_stock_threshold
                ),
                NOW()
            );
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Create trigger for stock alerts (only if products table exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'products') THEN
        -- Drop existing trigger if it exists
        DROP TRIGGER IF EXISTS product_stock_alert_trigger ON products;
        
        -- Create new trigger
        CREATE TRIGGER product_stock_alert_trigger
            AFTER UPDATE ON products
            FOR EACH ROW
            EXECUTE FUNCTION handle_product_stock_alerts();
    END IF;
END $$;

-- 5. Add indexes for stock-related queries
CREATE INDEX IF NOT EXISTS idx_products_stock_quantity ON public.products(stock_quantity);
CREATE INDEX IF NOT EXISTS idx_products_low_stock ON public.products(stock_quantity, low_stock_threshold) WHERE track_inventory = true;

-- 6. Update existing products with reasonable stock defaults
UPDATE public.products 
SET 
    stock_quantity = 100,
    low_stock_threshold = 10,
    track_inventory = true
WHERE stock_quantity IS NULL;

-- Migration completed: Fixed triggers and added stock management 