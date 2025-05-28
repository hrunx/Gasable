import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useAuth } from '../auth';

export interface Certification {
  id: string;
  company_id: string;
  name: string;
  issuer: string;
  issue_date: string;
  expiry_date: string;
  certification_type: 'iso' | 'environmental' | 'safety' | 'other';
  status: 'active' | 'expired' | 'pending' | 'revoked';
  description?: string;
  document_url?: string;
  created_at: string;
  updated_at: string;
}

export interface NewCertification {
  name: string;
  issuer: string;
  issue_date: string;
  expiry_date: string;
  certification_type: 'iso' | 'environmental' | 'safety' | 'other';
  status: 'active' | 'expired' | 'pending' | 'revoked';
  description?: string;
  document_url?: string;
}

export interface UpdateCertification extends NewCertification {
  id: string;
}

export const useCertifications = () => {
  const { user } = useAuth();
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch certifications
  const fetchCertifications = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .rpc('get_company_certifications', { user_id: user.id });

      if (fetchError) {
        console.error('Error fetching certifications:', fetchError);
        setError(fetchError.message);
        return;
      }

      setCertifications(data || []);
    } catch (err) {
      console.error('Error in fetchCertifications:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch certifications');
    } finally {
      setLoading(false);
    }
  };

  // Add certification
  const addCertification = async (certification: NewCertification) => {
    if (!user?.id) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      const { data, error: addError } = await supabase
        .rpc('add_company_certification', {
          user_id: user.id,
          cert_name: certification.name,
          cert_issuer: certification.issuer,
          cert_issue_date: certification.issue_date,
          cert_expiry_date: certification.expiry_date,
          cert_type: certification.certification_type,
          cert_status: certification.status,
          cert_description: certification.description || null,
          cert_document_url: certification.document_url || null
        });

      if (addError) {
        console.error('Error adding certification:', addError);
        return { success: false, error: addError.message };
      }

      if (data?.success) {
        // Refresh certifications list
        await fetchCertifications();
        return { success: true, certification_id: data.certification_id };
      } else {
        return { success: false, error: data?.error || 'Failed to add certification' };
      }
    } catch (err) {
      console.error('Error in addCertification:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Failed to add certification' };
    }
  };

  // Update certification
  const updateCertification = async (certification: UpdateCertification) => {
    if (!user?.id) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      const { data, error: updateError } = await supabase
        .rpc('update_company_certification', {
          user_id: user.id,
          cert_id: certification.id,
          cert_name: certification.name,
          cert_issuer: certification.issuer,
          cert_issue_date: certification.issue_date,
          cert_expiry_date: certification.expiry_date,
          cert_type: certification.certification_type,
          cert_status: certification.status,
          cert_description: certification.description || null,
          cert_document_url: certification.document_url || null
        });

      if (updateError) {
        console.error('Error updating certification:', updateError);
        return { success: false, error: updateError.message };
      }

      if (data?.success) {
        // Refresh certifications list
        await fetchCertifications();
        return { success: true };
      } else {
        return { success: false, error: data?.error || 'Failed to update certification' };
      }
    } catch (err) {
      console.error('Error in updateCertification:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Failed to update certification' };
    }
  };

  // Delete certification
  const deleteCertification = async (certificationId: string) => {
    if (!user?.id) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      const { data, error: deleteError } = await supabase
        .rpc('delete_company_certification', {
          user_id: user.id,
          cert_id: certificationId
        });

      if (deleteError) {
        console.error('Error deleting certification:', deleteError);
        return { success: false, error: deleteError.message };
      }

      if (data?.success) {
        // Refresh certifications list
        await fetchCertifications();
        return { success: true };
      } else {
        return { success: false, error: data?.error || 'Failed to delete certification' };
      }
    } catch (err) {
      console.error('Error in deleteCertification:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Failed to delete certification' };
    }
  };

  // Upload document (placeholder for file upload functionality)
  const uploadDocument = async (file: File): Promise<{ success: boolean; url?: string; error?: string }> => {
    try {
      // For now, we'll return a placeholder URL
      // In a real implementation, you would upload to Supabase Storage or another service
      const fileName = `${Date.now()}_${file.name}`;
      
      // Placeholder implementation - replace with actual file upload
      const placeholderUrl = `https://example.com/documents/${fileName}`;
      
      return { success: true, url: placeholderUrl };
    } catch (err) {
      console.error('Error uploading document:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Failed to upload document' };
    }
  };

  // Helper function to check if certification is expired
  const isExpired = (certification: Certification): boolean => {
    return new Date(certification.expiry_date) < new Date();
  };

  // Helper function to check if certification is expiring soon (within 30 days)
  const isExpiringSoon = (certification: Certification): boolean => {
    const expiryDate = new Date(certification.expiry_date);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return expiryDate <= thirtyDaysFromNow && expiryDate >= new Date();
  };

  // Get certification type display name
  const getCertificationTypeDisplayName = (type: Certification['certification_type']): string => {
    switch (type) {
      case 'iso':
        return 'ISO Standard';
      case 'environmental':
        return 'Environmental';
      case 'safety':
        return 'Safety';
      case 'other':
        return 'Other';
      default:
        return 'Unknown';
    }
  };

  // Get status display name
  const getStatusDisplayName = (status: Certification['status']): string => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'expired':
        return 'Expired';
      case 'pending':
        return 'Pending';
      case 'revoked':
        return 'Revoked';
      default:
        return 'Unknown';
    }
  };

  // Load certifications on mount and when user changes
  useEffect(() => {
    fetchCertifications();
  }, [user?.id]);

  return {
    certifications,
    loading,
    error,
    addCertification,
    updateCertification,
    deleteCertification,
    uploadDocument,
    fetchCertifications,
    isExpired,
    isExpiringSoon,
    getCertificationTypeDisplayName,
    getStatusDisplayName
  };
}; 