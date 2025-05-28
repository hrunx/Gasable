-- Notifications System Database Update
-- This script creates a comprehensive notifications system with automatic triggers

-- =====================================================
-- 1. NOTIFICATIONS TABLE
-- =====================================================

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies NOT NULL,
  user_id UUID REFERENCES public.users,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('order', 'delivery', 'alert', 'system', 'payment', 'product', 'customer', 'support')),
  status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'archived')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  action_required BOOLEAN DEFAULT FALSE,
  link TEXT,
  metadata JSONB DEFAULT '{}',
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  read_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_notifications_company_id ON public.notifications(company_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON public.notifications(status);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON public.notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_priority ON public.notifications(priority);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at);

-- =====================================================
-- 2. ACTIVITY LOG TABLE
-- =====================================================

-- Create activity log table for tracking all system activities
CREATE TABLE IF NOT EXISTS public.activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies NOT NULL,
  user_id UUID REFERENCES public.users,
  entity_type TEXT NOT NULL, -- 'order', 'product', 'customer', etc.
  entity_id UUID,
  action TEXT NOT NULL, -- 'created', 'updated', 'deleted', 'status_changed', etc.
  description TEXT NOT NULL,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_activity_log_company_id ON public.activity_log(company_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_user_id ON public.activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_entity_type ON public.activity_log(entity_type);
CREATE INDEX IF NOT EXISTS idx_activity_log_entity_id ON public.activity_log(entity_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON public.activity_log(created_at);

-- =====================================================
-- 3. RLS POLICIES
-- =====================================================

-- Notifications policies
CREATE POLICY "Users can read own company notifications" ON public.notifications
  FOR SELECT USING (
    company_id IN (
      SELECT company_id 
      FROM public.company_members 
      WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own company notifications" ON public.notifications
  FOR UPDATE USING (
    company_id IN (
      SELECT company_id 
      FROM public.company_members 
      WHERE profile_id = auth.uid()
    )
  );

-- Activity log policies
CREATE POLICY "Users can read own company activity log" ON public.activity_log
  FOR SELECT USING (
    company_id IN (
      SELECT company_id 
      FROM public.company_members 
      WHERE profile_id = auth.uid()
    )
  );

-- =====================================================
-- 4. NOTIFICATION FUNCTIONS
-- =====================================================

-- Function to create notifications (fixed parameter ordering)
CREATE OR REPLACE FUNCTION public.create_notification(
  p_company_id UUID,
  p_title TEXT,
  p_message TEXT,
  p_type TEXT,
  p_user_id UUID DEFAULT NULL,
  p_priority TEXT DEFAULT 'medium',
  p_action_required BOOLEAN DEFAULT FALSE,
  p_link TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
) RETURNS UUID AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO public.notifications (
    company_id, user_id, title, message, type, priority, action_required, link, metadata
  ) VALUES (
    p_company_id, p_user_id, p_title, p_message, p_type, p_priority, p_action_required, p_link, p_metadata
  ) RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log activity (fixed parameter ordering)
CREATE OR REPLACE FUNCTION public.log_activity(
  p_company_id UUID,
  p_user_id UUID,
  p_entity_type TEXT,
  p_entity_id UUID,
  p_action TEXT,
  p_description TEXT,
  p_old_values JSONB DEFAULT NULL,
  p_new_values JSONB DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  activity_id UUID;
BEGIN
  INSERT INTO public.activity_log (
    company_id, user_id, entity_type, entity_id, action, description, old_values, new_values
  ) VALUES (
    p_company_id, p_user_id, p_entity_type, p_entity_id, p_action, p_description, p_old_values, p_new_values
  ) RETURNING id INTO activity_id;
  
  RETURN activity_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 5. AUTOMATIC NOTIFICATION TRIGGERS
-- =====================================================

-- Function to handle order notifications
CREATE OR REPLACE FUNCTION public.handle_order_notifications()
RETURNS TRIGGER AS $$
BEGIN
  -- New order notification
  IF TG_OP = 'INSERT' THEN
    PERFORM public.create_notification(
      NEW.company_id,
      'New Order Received',
      'Order #' || NEW.order_number || ' has been placed with total amount $' || NEW.total_amount,
      'order',
      NULL,
      'high',
      TRUE,
      '/dashboard/orders/' || NEW.id
    );
    
    PERFORM public.log_activity(
      NEW.company_id,
      auth.uid(),
      'order',
      NEW.id,
      'created',
      'New order ' || NEW.order_number || ' created'
    );
  END IF;
  
  -- Order status change notification
  IF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
    PERFORM public.create_notification(
      NEW.company_id,
      'Order Status Updated',
      'Order #' || NEW.order_number || ' status changed from ' || OLD.status || ' to ' || NEW.status,
      'order',
      NULL,
      CASE 
        WHEN NEW.status = 'completed' THEN 'medium'
        WHEN NEW.status = 'cancelled' THEN 'high'
        ELSE 'low'
      END,
      CASE WHEN NEW.status IN ('pending', 'processing') THEN TRUE ELSE FALSE END,
      '/dashboard/orders/' || NEW.id
    );
    
    PERFORM public.log_activity(
      NEW.company_id,
      auth.uid(),
      'order',
      NEW.id,
      'status_changed',
      'Order ' || NEW.order_number || ' status changed from ' || OLD.status || ' to ' || NEW.status,
      jsonb_build_object('status', OLD.status),
      jsonb_build_object('status', NEW.status)
    );
  END IF;
  
  -- Payment status change notification
  IF TG_OP = 'UPDATE' AND OLD.payment_status != NEW.payment_status THEN
    PERFORM public.create_notification(
      NEW.company_id,
      'Payment Status Updated',
      'Payment for Order #' || NEW.order_number || ' is now ' || NEW.payment_status,
      'payment',
      NULL,
      CASE 
        WHEN NEW.payment_status = 'paid' THEN 'medium'
        WHEN NEW.payment_status = 'failed' THEN 'high'
        ELSE 'low'
      END,
      CASE WHEN NEW.payment_status = 'failed' THEN TRUE ELSE FALSE END,
      '/dashboard/orders/' || NEW.id
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle product stock alerts
CREATE OR REPLACE FUNCTION public.handle_product_stock_alerts()
RETURNS TRIGGER AS $$
BEGIN
  -- Low stock alert
  IF TG_OP = 'UPDATE' AND NEW.stock_quantity <= 10 AND OLD.stock_quantity > 10 THEN
    PERFORM public.create_notification(
      NEW.company_id,
      'Low Stock Alert',
      'Product "' || NEW.name || '" stock level is low (' || NEW.stock_quantity || ' units remaining)',
      'alert',
      NULL,
      'high',
      TRUE,
      '/dashboard/setup/products/' || NEW.id,
      jsonb_build_object('product_id', NEW.id, 'stock_quantity', NEW.stock_quantity)
    );
  END IF;
  
  -- Out of stock alert
  IF TG_OP = 'UPDATE' AND NEW.stock_quantity = 0 AND OLD.stock_quantity > 0 THEN
    PERFORM public.create_notification(
      NEW.company_id,
      'Out of Stock Alert',
      'Product "' || NEW.name || '" is now out of stock',
      'alert',
      NULL,
      'urgent',
      TRUE,
      '/dashboard/setup/products/' || NEW.id,
      jsonb_build_object('product_id', NEW.id, 'stock_quantity', 0)
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle customer notifications
CREATE OR REPLACE FUNCTION public.handle_customer_notifications()
RETURNS TRIGGER AS $$
BEGIN
  -- New customer notification
  IF TG_OP = 'INSERT' THEN
    -- Find company_id through orders (since customers don't have direct company_id)
    DECLARE
      customer_company_id UUID;
    BEGIN
      SELECT DISTINCT company_id INTO customer_company_id
      FROM public.orders 
      WHERE customer_id = NEW.id 
      LIMIT 1;
      
      IF customer_company_id IS NOT NULL THEN
        PERFORM public.create_notification(
          customer_company_id,
          'New Customer Registered',
          'New customer "' || NEW.name || '" has been added to your system',
          'customer',
          NULL,
          'low',
          FALSE,
          '/dashboard/customers/' || NEW.id
        );
      END IF;
    END;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 6. CREATE TRIGGERS
-- =====================================================

-- Order triggers
DROP TRIGGER IF EXISTS order_notifications_trigger ON public.orders;
CREATE TRIGGER order_notifications_trigger
  AFTER INSERT OR UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_order_notifications();

-- Product triggers
DROP TRIGGER IF EXISTS product_stock_alerts_trigger ON public.products;
CREATE TRIGGER product_stock_alerts_trigger
  AFTER UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.handle_product_stock_alerts();

-- Customer triggers
DROP TRIGGER IF EXISTS customer_notifications_trigger ON public.customers;
CREATE TRIGGER customer_notifications_trigger
  AFTER INSERT ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.handle_customer_notifications();

-- =====================================================
-- 7. UTILITY FUNCTIONS
-- =====================================================

-- Function to mark notification as read
CREATE OR REPLACE FUNCTION public.mark_notification_read(notification_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.notifications 
  SET status = 'read', read_at = now(), updated_at = now()
  WHERE id = notification_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark all notifications as read for a company
CREATE OR REPLACE FUNCTION public.mark_all_notifications_read(p_company_id UUID)
RETURNS INTEGER AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE public.notifications 
  SET status = 'read', read_at = now(), updated_at = now()
  WHERE company_id = p_company_id AND status = 'unread';
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up old notifications (older than 30 days)
CREATE OR REPLACE FUNCTION public.cleanup_old_notifications()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.notifications 
  WHERE created_at < now() - INTERVAL '30 days' 
    AND status = 'read';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 8. SAMPLE DATA (for testing)
-- =====================================================

-- Insert some sample notifications for testing
-- Note: This will only work if you have existing companies
/*
INSERT INTO public.notifications (company_id, title, message, type, priority, action_required, link) 
SELECT 
  c.id,
  'Welcome to the Portal',
  'Your company profile has been set up successfully. Complete your product catalog to start receiving orders.',
  'system',
  'medium',
  TRUE,
  '/dashboard/setup/products'
FROM public.companies c
LIMIT 1;
*/

-- =====================================================
-- 9. VERIFICATION
-- =====================================================

-- Verify tables were created
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name IN ('notifications', 'activity_log')
  AND table_schema = 'public'
ORDER BY table_name, ordinal_position; 