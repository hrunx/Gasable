-- EaaS Requests Table
CREATE TABLE IF NOT EXISTS public.eaas_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies NOT NULL,
  project_name TEXT NOT NULL,
  site_location TEXT NOT NULL,
  site_coordinates POINT,
  energy_type TEXT NOT NULL,
  subscription_term INTEGER NOT NULL,
  expected_load NUMERIC NOT NULL,
  feasibility_report_url TEXT,
  go_live_date DATE,
  status TEXT DEFAULT 'draft',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Only enable RLS if it's not already enabled
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_class c
    JOIN pg_catalog.pg_attribute a ON a.attrelid = c.oid
    WHERE c.relname = 'eaas_requests' AND a.attname = 'rls_enabled' AND a.attnum > 0
  ) THEN
    ALTER TABLE public.eaas_requests ENABLE ROW LEVEL SECURITY;
  END IF;
END
$$;

-- EaaS Contracts Table
CREATE TABLE IF NOT EXISTS public.eaas_contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies NOT NULL,
  request_id UUID REFERENCES public.eaas_requests,
  contract_number TEXT NOT NULL,
  title TEXT NOT NULL,
  supplier_id TEXT NOT NULL,
  supplier_name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  term_years INTEGER NOT NULL,
  monthly_fee NUMERIC NOT NULL,
  annual_escalation_rate NUMERIC DEFAULT 0,
  early_termination_fee_formula TEXT,
  relocation_fee NUMERIC,
  sla_uptime_guarantee NUMERIC DEFAULT 95,
  ownership_terms TEXT DEFAULT 'supplier',
  renewal_policy TEXT,
  legal_jurisdiction TEXT,
  contract_url TEXT,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Only enable RLS if it's not already enabled
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_class c
    JOIN pg_catalog.pg_attribute a ON a.attrelid = c.oid
    WHERE c.relname = 'eaas_contracts' AND a.attname = 'rls_enabled' AND a.attnum > 0
  ) THEN
    ALTER TABLE public.eaas_contracts ENABLE ROW LEVEL SECURITY;
  END IF;
END
$$;

-- EaaS Subscriptions Table
CREATE TABLE IF NOT EXISTS public.eaas_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies NOT NULL,
  contract_id UUID REFERENCES public.eaas_contracts NOT NULL,
  site_name TEXT NOT NULL,
  site_location TEXT NOT NULL,
  site_coordinates POINT,
  energy_type TEXT NOT NULL,
  capacity NUMERIC NOT NULL,
  cod_date DATE,
  current_status TEXT DEFAULT 'pending',
  current_uptime NUMERIC DEFAULT 0,
  monthly_fee NUMERIC NOT NULL,
  next_invoice_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  last_maintenance_date DATE,
  next_maintenance_date DATE,
  maintenance_notes TEXT
);

-- Only enable RLS if it's not already enabled
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_class c
    JOIN pg_catalog.pg_attribute a ON a.attrelid = c.oid
    WHERE c.relname = 'eaas_subscriptions' AND a.attname = 'rls_enabled' AND a.attnum > 0
  ) THEN
    ALTER TABLE public.eaas_subscriptions ENABLE ROW LEVEL SECURITY;
  END IF;
END
$$;

-- EaaS Equipment Table
CREATE TABLE IF NOT EXISTS public.eaas_equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies NOT NULL,
  subscription_id UUID REFERENCES public.eaas_subscriptions NOT NULL,
  equipment_type TEXT NOT NULL,
  manufacturer TEXT NOT NULL,
  model TEXT NOT NULL,
  serial_number TEXT NOT NULL,
  capacity NUMERIC NOT NULL,
  installation_date DATE NOT NULL,
  warranty_end_date DATE,
  last_maintenance_date DATE,
  next_maintenance_date DATE,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  monitoring_system_id TEXT,
  monitoring_url TEXT,
  maintenance_frequency_months INTEGER DEFAULT 6
);

-- Only enable RLS if it's not already enabled
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_class c
    JOIN pg_catalog.pg_attribute a ON a.attrelid = c.oid
    WHERE c.relname = 'eaas_equipment' AND a.attname = 'rls_enabled' AND a.attnum > 0
  ) THEN
    ALTER TABLE public.eaas_equipment ENABLE ROW LEVEL SECURITY;
  END IF;
END
$$;

-- EaaS Invoices Table
CREATE TABLE IF NOT EXISTS public.eaas_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies NOT NULL,
  subscription_id UUID REFERENCES public.eaas_subscriptions NOT NULL,
  invoice_number TEXT NOT NULL,
  invoice_date DATE NOT NULL,
  due_date DATE NOT NULL,
  base_amount NUMERIC NOT NULL,
  overuse_amount NUMERIC DEFAULT 0,
  additional_fees NUMERIC DEFAULT 0,
  additional_fees_description TEXT,
  total_amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending',
  payment_date DATE,
  payment_reference TEXT,
  invoice_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Only enable RLS if it's not already enabled
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_class c
    JOIN pg_catalog.pg_attribute a ON a.attrelid = c.oid
    WHERE c.relname = 'eaas_invoices' AND a.attname = 'rls_enabled' AND a.attnum > 0
  ) THEN
    ALTER TABLE public.eaas_invoices ENABLE ROW LEVEL SECURITY;
  END IF;
END
$$;

-- EaaS SLA Reports Table
CREATE TABLE IF NOT EXISTS public.eaas_sla_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies NOT NULL,
  subscription_id UUID REFERENCES public.eaas_subscriptions NOT NULL,
  report_period_start DATE NOT NULL,
  report_period_end DATE NOT NULL,
  uptime_percentage NUMERIC NOT NULL,
  downtime_minutes NUMERIC DEFAULT 0,
  planned_maintenance_minutes NUMERIC DEFAULT 0,
  unplanned_outages INTEGER DEFAULT 0,
  ticket_count INTEGER DEFAULT 0,
  avg_response_time_minutes NUMERIC,
  sla_met BOOLEAN DEFAULT true,
  report_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Only enable RLS if it's not already enabled
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_class c
    JOIN pg_catalog.pg_attribute a ON a.attrelid = c.oid
    WHERE c.relname = 'eaas_sla_reports' AND a.attname = 'rls_enabled' AND a.attnum > 0
  ) THEN
    ALTER TABLE public.eaas_sla_reports ENABLE ROW LEVEL SECURITY;
  END IF;
END
$$;

-- EaaS Carbon Reports Table
CREATE TABLE IF NOT EXISTS public.eaas_carbon_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies NOT NULL,
  subscription_id UUID REFERENCES public.eaas_subscriptions NOT NULL,
  report_period_start DATE NOT NULL,
  report_period_end DATE NOT NULL,
  energy_produced_kwh NUMERIC NOT NULL,
  carbon_saved_tons NUMERIC NOT NULL,
  carbon_credits_earned NUMERIC DEFAULT 0,
  carbon_credits_shared NUMERIC DEFAULT 0,
  certificate_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Only enable RLS if it's not already enabled
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_class c
    JOIN pg_catalog.pg_attribute a ON a.attrelid = c.oid
    WHERE c.relname = 'eaas_carbon_reports' AND a.attname = 'rls_enabled' AND a.attnum > 0
  ) THEN
    ALTER TABLE public.eaas_carbon_reports ENABLE ROW LEVEL SECURITY;
  END IF;
END
$$;

-- EaaS Service Requests Table
CREATE TABLE IF NOT EXISTS public.eaas_service_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies NOT NULL,
  subscription_id UUID REFERENCES public.eaas_subscriptions NOT NULL,
  request_type TEXT NOT NULL,
  priority TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'open',
  requested_date TIMESTAMPTZ DEFAULT now(),
  scheduled_date TIMESTAMPTZ,
  completed_date TIMESTAMPTZ,
  technician_notes TEXT,
  customer_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Only enable RLS if it's not already enabled
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_class c
    JOIN pg_catalog.pg_attribute a ON a.attrelid = c.oid
    WHERE c.relname = 'eaas_service_requests' AND a.attname = 'rls_enabled' AND a.attnum > 0
  ) THEN
    ALTER TABLE public.eaas_service_requests ENABLE ROW LEVEL SECURITY;
  END IF;
END
$$;

-- EaaS Service Messages Table
CREATE TABLE IF NOT EXISTS public.eaas_service_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_request_id UUID REFERENCES public.eaas_service_requests NOT NULL,
  sender_id UUID NOT NULL,
  sender_type TEXT NOT NULL,
  message TEXT NOT NULL,
  attachment_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Only enable RLS if it's not already enabled
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_class c
    JOIN pg_catalog.pg_attribute a ON a.attrelid = c.oid
    WHERE c.relname = 'eaas_service_messages' AND a.attname = 'rls_enabled' AND a.attnum > 0
  ) THEN
    ALTER TABLE public.eaas_service_messages ENABLE ROW LEVEL SECURITY;
  END IF;
END
$$;

-- EaaS Delivery Verifications Table
CREATE TABLE IF NOT EXISTS public.eaas_delivery_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies NOT NULL,
  subscription_id UUID REFERENCES public.eaas_subscriptions NOT NULL,
  verification_date DATE NOT NULL,
  verified_by UUID NOT NULL,
  verification_method TEXT NOT NULL,
  verification_notes TEXT,
  photo_evidence_url TEXT,
  signature_url TEXT,
  status TEXT DEFAULT 'verified',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Only enable RLS if it's not already enabled
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_class c
    JOIN pg_catalog.pg_attribute a ON a.attrelid = c.oid
    WHERE c.relname = 'eaas_delivery_verifications' AND a.attname = 'rls_enabled' AND a.attnum > 0
  ) THEN
    ALTER TABLE public.eaas_delivery_verifications ENABLE ROW LEVEL SECURITY;
  END IF;
END
$$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_eaas_requests_company ON public.eaas_requests(company_id);
CREATE INDEX IF NOT EXISTS idx_eaas_contracts_company ON public.eaas_contracts(company_id);
CREATE INDEX IF NOT EXISTS idx_eaas_subscriptions_company ON public.eaas_subscriptions(company_id);
CREATE INDEX IF NOT EXISTS idx_eaas_subscriptions_contract ON public.eaas_subscriptions(contract_id);
CREATE INDEX IF NOT EXISTS idx_eaas_equipment_company ON public.eaas_equipment(company_id);
CREATE INDEX IF NOT EXISTS idx_eaas_equipment_subscription ON public.eaas_equipment(subscription_id);
CREATE INDEX IF NOT EXISTS idx_eaas_invoices_company ON public.eaas_invoices(company_id);
CREATE INDEX IF NOT EXISTS idx_eaas_invoices_subscription ON public.eaas_invoices(subscription_id);
CREATE INDEX IF NOT EXISTS idx_eaas_sla_reports_company ON public.eaas_sla_reports(company_id);
CREATE INDEX IF NOT EXISTS idx_eaas_sla_reports_subscription ON public.eaas_sla_reports(subscription_id);
CREATE INDEX IF NOT EXISTS idx_eaas_carbon_reports_company ON public.eaas_carbon_reports(company_id);
CREATE INDEX IF NOT EXISTS idx_eaas_carbon_reports_subscription ON public.eaas_carbon_reports(subscription_id);
CREATE INDEX IF NOT EXISTS idx_eaas_service_requests_company ON public.eaas_service_requests(company_id);
CREATE INDEX IF NOT EXISTS idx_eaas_service_requests_subscription ON public.eaas_service_requests(subscription_id);
CREATE INDEX IF NOT EXISTS idx_eaas_service_messages_request ON public.eaas_service_messages(service_request_id);
CREATE INDEX IF NOT EXISTS idx_eaas_delivery_verifications_company ON public.eaas_delivery_verifications(company_id);
CREATE INDEX IF NOT EXISTS idx_eaas_delivery_verifications_subscription ON public.eaas_delivery_verifications(subscription_id);

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can view their company EaaS requests" ON public.eaas_requests;
DROP POLICY IF EXISTS "Users can insert EaaS requests for their company" ON public.eaas_requests;
DROP POLICY IF EXISTS "Users can update EaaS requests for their company" ON public.eaas_requests;
DROP POLICY IF EXISTS "Users can delete EaaS requests for their company" ON public.eaas_requests;

DROP POLICY IF EXISTS "Users can view their company EaaS contracts" ON public.eaas_contracts;
DROP POLICY IF EXISTS "Users can insert EaaS contracts for their company" ON public.eaas_contracts;
DROP POLICY IF EXISTS "Users can update EaaS contracts for their company" ON public.eaas_contracts;
DROP POLICY IF EXISTS "Users can delete EaaS contracts for their company" ON public.eaas_contracts;

DROP POLICY IF EXISTS "Users can view their company EaaS subscriptions" ON public.eaas_subscriptions;
DROP POLICY IF EXISTS "Users can insert EaaS subscriptions for their company" ON public.eaas_subscriptions;
DROP POLICY IF EXISTS "Users can update EaaS subscriptions for their company" ON public.eaas_subscriptions;
DROP POLICY IF EXISTS "Users can delete EaaS subscriptions for their company" ON public.eaas_subscriptions;

DROP POLICY IF EXISTS "Users can view their company EaaS equipment" ON public.eaas_equipment;
DROP POLICY IF EXISTS "Users can insert EaaS equipment for their company" ON public.eaas_equipment;
DROP POLICY IF EXISTS "Users can update EaaS equipment for their company" ON public.eaas_equipment;
DROP POLICY IF EXISTS "Users can delete EaaS equipment for their company" ON public.eaas_equipment;

DROP POLICY IF EXISTS "Users can view their company EaaS invoices" ON public.eaas_invoices;
DROP POLICY IF EXISTS "Users can insert EaaS invoices for their company" ON public.eaas_invoices;
DROP POLICY IF EXISTS "Users can update EaaS invoices for their company" ON public.eaas_invoices;
DROP POLICY IF EXISTS "Users can delete EaaS invoices for their company" ON public.eaas_invoices;

DROP POLICY IF EXISTS "Users can view their company EaaS SLA reports" ON public.eaas_sla_reports;
DROP POLICY IF EXISTS "Users can insert EaaS SLA reports for their company" ON public.eaas_sla_reports;
DROP POLICY IF EXISTS "Users can update EaaS SLA reports for their company" ON public.eaas_sla_reports;
DROP POLICY IF EXISTS "Users can delete EaaS SLA reports for their company" ON public.eaas_sla_reports;

DROP POLICY IF EXISTS "Users can view their company EaaS carbon reports" ON public.eaas_carbon_reports;
DROP POLICY IF EXISTS "Users can insert EaaS carbon reports for their company" ON public.eaas_carbon_reports;
DROP POLICY IF EXISTS "Users can update EaaS carbon reports for their company" ON public.eaas_carbon_reports;
DROP POLICY IF EXISTS "Users can delete EaaS carbon reports for their company" ON public.eaas_carbon_reports;

DROP POLICY IF EXISTS "Users can view their company service requests" ON public.eaas_service_requests;
DROP POLICY IF EXISTS "Users can insert service requests for their company" ON public.eaas_service_requests;
DROP POLICY IF EXISTS "Users can update service requests for their company" ON public.eaas_service_requests;
DROP POLICY IF EXISTS "Users can delete service requests for their company" ON public.eaas_service_requests;

DROP POLICY IF EXISTS "Users can view service messages for their requests" ON public.eaas_service_messages;
DROP POLICY IF EXISTS "Users can insert service messages for their requests" ON public.eaas_service_messages;
DROP POLICY IF EXISTS "Users can update service messages they sent" ON public.eaas_service_messages;
DROP POLICY IF EXISTS "Users can delete service messages they sent" ON public.eaas_service_messages;

DROP POLICY IF EXISTS "Users can view their company delivery verifications" ON public.eaas_delivery_verifications;
DROP POLICY IF EXISTS "Users can insert delivery verifications for their company" ON public.eaas_delivery_verifications;
DROP POLICY IF EXISTS "Users can update delivery verifications for their company" ON public.eaas_delivery_verifications;
DROP POLICY IF EXISTS "Users can delete delivery verifications for their company" ON public.eaas_delivery_verifications;

-- Create RLS policies for EaaS tables
-- EaaS Requests
CREATE POLICY "Users can view their company EaaS requests" 
  ON public.eaas_requests FOR SELECT 
  TO authenticated USING (company_id = auth.uid());

CREATE POLICY "Users can insert EaaS requests for their company" 
  ON public.eaas_requests FOR INSERT 
  TO authenticated WITH CHECK (company_id = auth.uid());

CREATE POLICY "Users can update EaaS requests for their company" 
  ON public.eaas_requests FOR UPDATE 
  TO authenticated USING (company_id = auth.uid()) 
  WITH CHECK (company_id = auth.uid());

CREATE POLICY "Users can delete EaaS requests for their company" 
  ON public.eaas_requests FOR DELETE 
  TO authenticated USING (company_id = auth.uid());

-- EaaS Contracts
CREATE POLICY "Users can view their company EaaS contracts" 
  ON public.eaas_contracts FOR SELECT 
  TO authenticated USING (company_id = auth.uid());

CREATE POLICY "Users can insert EaaS contracts for their company" 
  ON public.eaas_contracts FOR INSERT 
  TO authenticated WITH CHECK (company_id = auth.uid());

CREATE POLICY "Users can update EaaS contracts for their company" 
  ON public.eaas_contracts FOR UPDATE 
  TO authenticated USING (company_id = auth.uid()) 
  WITH CHECK (company_id = auth.uid());

CREATE POLICY "Users can delete EaaS contracts for their company" 
  ON public.eaas_contracts FOR DELETE 
  TO authenticated USING (company_id = auth.uid());

-- EaaS Subscriptions
CREATE POLICY "Users can view their company EaaS subscriptions" 
  ON public.eaas_subscriptions FOR SELECT 
  TO authenticated USING (company_id = auth.uid());

CREATE POLICY "Users can insert EaaS subscriptions for their company" 
  ON public.eaas_subscriptions FOR INSERT 
  TO authenticated WITH CHECK (company_id = auth.uid());

CREATE POLICY "Users can update EaaS subscriptions for their company" 
  ON public.eaas_subscriptions FOR UPDATE 
  TO authenticated USING (company_id = auth.uid()) 
  WITH CHECK (company_id = auth.uid());

CREATE POLICY "Users can delete EaaS subscriptions for their company" 
  ON public.eaas_subscriptions FOR DELETE 
  TO authenticated USING (company_id = auth.uid());

-- EaaS Equipment
CREATE POLICY "Users can view their company EaaS equipment" 
  ON public.eaas_equipment FOR SELECT 
  TO authenticated USING (company_id = auth.uid());

CREATE POLICY "Users can insert EaaS equipment for their company" 
  ON public.eaas_equipment FOR INSERT 
  TO authenticated WITH CHECK (company_id = auth.uid());

CREATE POLICY "Users can update EaaS equipment for their company" 
  ON public.eaas_equipment FOR UPDATE 
  TO authenticated USING (company_id = auth.uid()) 
  WITH CHECK (company_id = auth.uid());

CREATE POLICY "Users can delete EaaS equipment for their company" 
  ON public.eaas_equipment FOR DELETE 
  TO authenticated USING (company_id = auth.uid());

-- EaaS Invoices
CREATE POLICY "Users can view their company EaaS invoices" 
  ON public.eaas_invoices FOR SELECT 
  TO authenticated USING (company_id = auth.uid());

CREATE POLICY "Users can insert EaaS invoices for their company" 
  ON public.eaas_invoices FOR INSERT 
  TO authenticated WITH CHECK (company_id = auth.uid());

CREATE POLICY "Users can update EaaS invoices for their company" 
  ON public.eaas_invoices FOR UPDATE 
  TO authenticated USING (company_id = auth.uid()) 
  WITH CHECK (company_id = auth.uid());

CREATE POLICY "Users can delete EaaS invoices for their company" 
  ON public.eaas_invoices FOR DELETE 
  TO authenticated USING (company_id = auth.uid());

-- EaaS SLA Reports
CREATE POLICY "Users can view their company EaaS SLA reports" 
  ON public.eaas_sla_reports FOR SELECT 
  TO authenticated USING (company_id = auth.uid());

CREATE POLICY "Users can insert EaaS SLA reports for their company" 
  ON public.eaas_sla_reports FOR INSERT 
  TO authenticated WITH CHECK (company_id = auth.uid());

CREATE POLICY "Users can update EaaS SLA reports for their company" 
  ON public.eaas_sla_reports FOR UPDATE 
  TO authenticated USING (company_id = auth.uid()) 
  WITH CHECK (company_id = auth.uid());

CREATE POLICY "Users can delete EaaS SLA reports for their company" 
  ON public.eaas_sla_reports FOR DELETE 
  TO authenticated USING (company_id = auth.uid());

-- EaaS Carbon Reports
CREATE POLICY "Users can view their company EaaS carbon reports" 
  ON public.eaas_carbon_reports FOR SELECT 
  TO authenticated USING (company_id = auth.uid());

CREATE POLICY "Users can insert EaaS carbon reports for their company" 
  ON public.eaas_carbon_reports FOR INSERT 
  TO authenticated WITH CHECK (company_id = auth.uid());

CREATE POLICY "Users can update EaaS carbon reports for their company" 
  ON public.eaas_carbon_reports FOR UPDATE 
  TO authenticated USING (company_id = auth.uid()) 
  WITH CHECK (company_id = auth.uid());

CREATE POLICY "Users can delete EaaS carbon reports for their company" 
  ON public.eaas_carbon_reports FOR DELETE 
  TO authenticated USING (company_id = auth.uid());

-- EaaS Service Requests
CREATE POLICY "Users can view their company service requests" 
  ON public.eaas_service_requests FOR SELECT 
  TO authenticated USING (company_id = auth.uid());

CREATE POLICY "Users can insert service requests for their company" 
  ON public.eaas_service_requests FOR INSERT 
  TO authenticated WITH CHECK (company_id = auth.uid());

CREATE POLICY "Users can update service requests for their company" 
  ON public.eaas_service_requests FOR UPDATE 
  TO authenticated USING (company_id = auth.uid()) 
  WITH CHECK (company_id = auth.uid());

CREATE POLICY "Users can delete service requests for their company" 
  ON public.eaas_service_requests FOR DELETE 
  TO authenticated USING (company_id = auth.uid());

-- EaaS Service Messages
CREATE POLICY "Users can view service messages for their requests" 
  ON public.eaas_service_messages FOR SELECT 
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM eaas_service_requests 
      WHERE eaas_service_requests.id = eaas_service_messages.service_request_id 
      AND eaas_service_requests.company_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert service messages for their requests" 
  ON public.eaas_service_messages FOR INSERT 
  TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM eaas_service_requests 
      WHERE eaas_service_requests.id = eaas_service_messages.service_request_id 
      AND eaas_service_requests.company_id = auth.uid()
    )
  );

CREATE POLICY "Users can update service messages they sent" 
  ON public.eaas_service_messages FOR UPDATE 
  TO authenticated USING (sender_id = auth.uid()) 
  WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can delete service messages they sent" 
  ON public.eaas_service_messages FOR DELETE 
  TO authenticated USING (sender_id = auth.uid());

-- EaaS Delivery Verifications
CREATE POLICY "Users can view their company delivery verifications" 
  ON public.eaas_delivery_verifications FOR SELECT 
  TO authenticated USING (company_id = auth.uid());

CREATE POLICY "Users can insert delivery verifications for their company" 
  ON public.eaas_delivery_verifications FOR INSERT 
  TO authenticated WITH CHECK (company_id = auth.uid());

CREATE POLICY "Users can update delivery verifications for their company" 
  ON public.eaas_delivery_verifications FOR UPDATE 
  TO authenticated USING (company_id = auth.uid()) 
  WITH CHECK (company_id = auth.uid());

CREATE POLICY "Users can delete delivery verifications for their company" 
  ON public.eaas_delivery_verifications FOR DELETE 
  TO authenticated USING (company_id = auth.uid());