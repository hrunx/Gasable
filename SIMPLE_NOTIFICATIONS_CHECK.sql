-- Simple Notifications System Check and Setup
-- This script checks if notifications tables exist and creates them if needed

-- Check if notifications table exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'notifications') THEN
        -- Create notifications table
        CREATE TABLE public.notifications (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          company_id UUID NOT NULL,
          user_id UUID,
          title TEXT NOT NULL,
          message TEXT NOT NULL,
          type TEXT NOT NULL DEFAULT 'system',
          status TEXT NOT NULL DEFAULT 'unread',
          priority TEXT NOT NULL DEFAULT 'medium',
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

        -- Create basic indexes
        CREATE INDEX idx_notifications_company_id ON public.notifications(company_id);
        CREATE INDEX idx_notifications_status ON public.notifications(status);
        CREATE INDEX idx_notifications_created_at ON public.notifications(created_at);

        -- Create basic RLS policy
        CREATE POLICY "Users can read own company notifications" ON public.notifications
          FOR SELECT USING (
            company_id IN (
              SELECT id FROM public.companies WHERE user_id = auth.uid()
            ) OR
            company_id IN (
              SELECT company_id FROM public.company_members WHERE profile_id = auth.uid()
            ) OR
            company_id IN (
              SELECT company_id FROM public.users WHERE id = auth.uid()
            )
          );

        RAISE NOTICE 'Notifications table created successfully';
    ELSE
        RAISE NOTICE 'Notifications table already exists';
    END IF;
END
$$;

-- Check if activity_log table exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'activity_log') THEN
        -- Create activity log table
        CREATE TABLE public.activity_log (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          company_id UUID NOT NULL,
          user_id UUID,
          entity_type TEXT NOT NULL,
          entity_id UUID,
          action TEXT NOT NULL,
          description TEXT NOT NULL,
          old_values JSONB,
          new_values JSONB,
          ip_address INET,
          user_agent TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        );

        -- Enable RLS
        ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

        -- Create basic indexes
        CREATE INDEX idx_activity_log_company_id ON public.activity_log(company_id);
        CREATE INDEX idx_activity_log_created_at ON public.activity_log(created_at);

        -- Create basic RLS policy
        CREATE POLICY "Users can read own company activity log" ON public.activity_log
          FOR SELECT USING (
            company_id IN (
              SELECT id FROM public.companies WHERE user_id = auth.uid()
            ) OR
            company_id IN (
              SELECT company_id FROM public.company_members WHERE profile_id = auth.uid()
            ) OR
            company_id IN (
              SELECT company_id FROM public.users WHERE id = auth.uid()
            )
          );

        RAISE NOTICE 'Activity log table created successfully';
    ELSE
        RAISE NOTICE 'Activity log table already exists';
    END IF;
END
$$;

-- Create basic notification functions if they don't exist
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

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.create_notification(UUID, TEXT, TEXT, TEXT, UUID, TEXT, BOOLEAN, TEXT, JSONB) TO authenticated;

-- Insert a test notification if user has a company
DO $$
DECLARE
  user_company_id UUID;
BEGIN
  -- Try to find user's company
  SELECT id INTO user_company_id FROM public.companies WHERE user_id = auth.uid() LIMIT 1;
  
  IF user_company_id IS NOT NULL THEN
    -- Insert test notification
    INSERT INTO public.notifications (
      company_id,
      title,
      message,
      type,
      priority,
      action_required
    ) VALUES (
      user_company_id,
      'Welcome to Notifications',
      'Your notifications system is now active and ready to use.',
      'system',
      'low',
      FALSE
    );
    
    RAISE NOTICE 'Test notification created for company %', user_company_id;
  ELSE
    RAISE NOTICE 'No company found for current user - notifications system ready but no test notification created';
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Could not create test notification: %', SQLERRM;
END
$$;

SELECT 'Notifications system check completed' as status; 