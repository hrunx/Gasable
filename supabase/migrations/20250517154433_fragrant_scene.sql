/*
  # Company Documents Schema

  1. New Tables
    - `company_documents` - Store company verification documents and compliance files
  
  2. Security
    - Enable RLS on the table
    - Add policies for authenticated users to manage their own documents
*/

-- Company Documents Table
CREATE TABLE IF NOT EXISTS public.company_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies,
  document_type TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT now(),
  status TEXT DEFAULT 'pending',
  verified_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'
);

-- Only enable RLS if it's not already enabled
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' AND tablename = 'company_documents' AND rowsecurity = true
  ) THEN
    ALTER TABLE public.company_documents ENABLE ROW LEVEL SECURITY;
  END IF;
END
$$;

-- Create RLS policies for company_documents if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'company_documents' 
    AND policyname = 'Companies can view their own documents'
  ) THEN
    CREATE POLICY "Companies can view their own documents" 
      ON public.company_documents FOR SELECT 
      TO authenticated USING (company_id = auth.uid());
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'company_documents' 
    AND policyname = 'Companies can insert their own documents'
  ) THEN
    CREATE POLICY "Companies can insert their own documents" 
      ON public.company_documents FOR INSERT 
      TO authenticated WITH CHECK (company_id = auth.uid());
  END IF;
END
$$;

-- Create indexes for better performance if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE schemaname = 'public' 
    AND tablename = 'company_documents' 
    AND indexname = 'idx_company_documents_company_id'
  ) THEN
    CREATE INDEX idx_company_documents_company_id ON public.company_documents(company_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE schemaname = 'public' 
    AND tablename = 'company_documents' 
    AND indexname = 'idx_company_documents_document_type'
  ) THEN
    CREATE INDEX idx_company_documents_document_type ON public.company_documents(document_type);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE schemaname = 'public' 
    AND tablename = 'company_documents' 
    AND indexname = 'idx_company_documents_status'
  ) THEN
    CREATE INDEX idx_company_documents_status ON public.company_documents(status);
  END IF;
END
$$;