-- Add created_by column to companies table
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES public.users(id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_companies_created_by ON public.companies(created_by);

-- Comment on column
COMMENT ON COLUMN public.companies.created_by IS 'Reference to the user who created this company'; 