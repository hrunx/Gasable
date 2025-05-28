-- Certifications Database Schema Update
-- This script creates the certifications table and related functions

-- Drop existing objects if they exist
DROP TABLE IF EXISTS public.certifications CASCADE;
DROP FUNCTION IF EXISTS public.get_company_certifications(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.add_company_certification(uuid, text, text, date, date, text, text, text, text) CASCADE;
DROP FUNCTION IF EXISTS public.update_company_certification(uuid, uuid, text, text, date, date, text, text, text, text) CASCADE;
DROP FUNCTION IF EXISTS public.delete_company_certification(uuid, uuid) CASCADE;

-- Create certifications table
CREATE TABLE public.certifications (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    name text NOT NULL,
    issuer text NOT NULL,
    issue_date date NOT NULL,
    expiry_date date NOT NULL,
    certification_type text NOT NULL DEFAULT 'other' CHECK (certification_type IN ('iso', 'environmental', 'safety', 'other')),
    status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'pending', 'revoked')),
    description text,
    document_url text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_certifications_company_id ON public.certifications(company_id);
CREATE INDEX idx_certifications_status ON public.certifications(status);
CREATE INDEX idx_certifications_type ON public.certifications(certification_type);

-- Enable RLS
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their company certifications" ON public.certifications
    FOR SELECT USING (
        company_id IN (
            SELECT c.id FROM public.companies c 
            WHERE c.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert certifications for their company" ON public.certifications
    FOR INSERT WITH CHECK (
        company_id IN (
            SELECT c.id FROM public.companies c 
            WHERE c.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their company certifications" ON public.certifications
    FOR UPDATE USING (
        company_id IN (
            SELECT c.id FROM public.companies c 
            WHERE c.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their company certifications" ON public.certifications
    FOR DELETE USING (
        company_id IN (
            SELECT c.id FROM public.companies c 
            WHERE c.user_id = auth.uid()
        )
    );

-- Function to get company certifications
CREATE OR REPLACE FUNCTION public.get_company_certifications(user_id uuid)
RETURNS TABLE (
    id uuid,
    company_id uuid,
    name text,
    issuer text,
    issue_date date,
    expiry_date date,
    certification_type text,
    status text,
    description text,
    document_url text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        cert.id,
        cert.company_id,
        cert.name,
        cert.issuer,
        cert.issue_date,
        cert.expiry_date,
        cert.certification_type,
        cert.status,
        cert.description,
        cert.document_url,
        cert.created_at,
        cert.updated_at
    FROM public.certifications cert
    JOIN public.companies c ON cert.company_id = c.id
    WHERE c.user_id = get_company_certifications.user_id
    ORDER BY cert.created_at DESC;
END;
$$;

-- Function to add certification
CREATE OR REPLACE FUNCTION public.add_company_certification(
    user_id uuid,
    cert_name text,
    cert_issuer text,
    cert_issue_date date,
    cert_expiry_date date,
    cert_type text,
    cert_status text,
    cert_description text,
    cert_document_url text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    company_uuid uuid;
    new_cert_id uuid;
BEGIN
    -- Get company ID for the user
    SELECT c.id INTO company_uuid
    FROM public.companies c
    WHERE c.user_id = add_company_certification.user_id;
    
    IF company_uuid IS NULL THEN
        RETURN json_build_object('success', false, 'error', 'Company not found');
    END IF;
    
    -- Insert new certification
    INSERT INTO public.certifications (
        company_id,
        name,
        issuer,
        issue_date,
        expiry_date,
        certification_type,
        status,
        description,
        document_url
    ) VALUES (
        company_uuid,
        cert_name,
        cert_issuer,
        cert_issue_date,
        cert_expiry_date,
        COALESCE(cert_type, 'other'),
        COALESCE(cert_status, 'active'),
        cert_description,
        cert_document_url
    ) RETURNING id INTO new_cert_id;
    
    RETURN json_build_object(
        'success', true, 
        'certification_id', new_cert_id,
        'message', 'Certification added successfully'
    );
    
EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$;

-- Function to update certification
CREATE OR REPLACE FUNCTION public.update_company_certification(
    user_id uuid,
    cert_id uuid,
    cert_name text,
    cert_issuer text,
    cert_issue_date date,
    cert_expiry_date date,
    cert_type text,
    cert_status text,
    cert_description text,
    cert_document_url text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    company_uuid uuid;
BEGIN
    -- Get company ID for the user
    SELECT c.id INTO company_uuid
    FROM public.companies c
    WHERE c.user_id = update_company_certification.user_id;
    
    IF company_uuid IS NULL THEN
        RETURN json_build_object('success', false, 'error', 'Company not found');
    END IF;
    
    -- Update certification
    UPDATE public.certifications 
    SET 
        name = cert_name,
        issuer = cert_issuer,
        issue_date = cert_issue_date,
        expiry_date = cert_expiry_date,
        certification_type = COALESCE(cert_type, certification_type),
        status = COALESCE(cert_status, status),
        description = cert_description,
        document_url = cert_document_url,
        updated_at = now()
    WHERE id = cert_id AND company_id = company_uuid;
    
    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'error', 'Certification not found or access denied');
    END IF;
    
    RETURN json_build_object('success', true, 'message', 'Certification updated successfully');
    
EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$;

-- Function to delete certification
CREATE OR REPLACE FUNCTION public.delete_company_certification(
    user_id uuid,
    cert_id uuid
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    company_uuid uuid;
BEGIN
    -- Get company ID for the user
    SELECT c.id INTO company_uuid
    FROM public.companies c
    WHERE c.user_id = delete_company_certification.user_id;
    
    IF company_uuid IS NULL THEN
        RETURN json_build_object('success', false, 'error', 'Company not found');
    END IF;
    
    -- Delete certification
    DELETE FROM public.certifications 
    WHERE id = cert_id AND company_id = company_uuid;
    
    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'error', 'Certification not found or access denied');
    END IF;
    
    RETURN json_build_object('success', true, 'message', 'Certification deleted successfully');
    
EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$;

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.certifications TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_company_certifications(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.add_company_certification(uuid, text, text, date, date, text, text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_company_certification(uuid, uuid, text, text, date, date, text, text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.delete_company_certification(uuid, uuid) TO authenticated;

-- Verification queries
SELECT 'Certifications table created successfully' as status;
SELECT 'Functions created successfully' as status;
SELECT 'RLS policies created successfully' as status; 