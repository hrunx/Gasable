import React, { useState, useEffect, useRef } from 'react';
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Calendar,
  Users,
  Award,
  Leaf,
  Shield,
  FileText,
  Star,
  TrendingUp,
  Clock,
  CheckCircle,
  Upload,
  Save,
  Plus,
  Crown,
  Check,
  X,
  CreditCard,
  Download,
  Receipt,
  History,
  ArrowUpRight,
  ArrowDownRight,
  Building,
  Package,
  Tag,
  Percent,
  User,
  Truck,
  Zap,
  Settings,
  MessageSquare,
  HelpCircle,
  Bell,
  RefreshCw,
  Trash2,
  Edit,
  ExternalLink,
  AlertTriangle,
  BarChart2,
  PieChart,
  Clipboard,
  FileCheck,
  ShieldCheck,
  Briefcase,
  Layers,
  Sliders,
  Repeat,
  Gauge,
  Workflow,
  Lightbulb,
  Sparkles,
  Wrench,
  Hammer,
  Cpu,
  Cog,
  Paperclip
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../lib/auth';
import { useCompanyData } from '../../lib/hooks/useCompanyData';
import { useCompanyEmployees, type CompanyMember, type NewMember } from '../../lib/hooks/useCompanyEmployees';
import { useSubscription } from '../../lib/hooks/useSubscription';
import { useCertifications, type Certification, type NewCertification } from '../../lib/hooks/useCertifications';
import { usePerformanceMetrics, type PerformanceMetric } from '../../lib/hooks/usePerformanceMetrics';

interface SubscriptionTier {
  name: string;
  price: string;
  yearlyDiscount: string;
  features: {
    customerType: string;
    productsAllowed: string;
    ordersLimit: string;
    coverage: string;
    branches: string;
    drivers: string;
    inventory: string;
    compliance: string;
    marketing: string;
    trial: string;
    integration: string;
    analytics: string;
    support: string;
    training: string;
    commission: string;
  };
  recommended?: boolean;
  monthlyPrice?: number;
}

interface PaymentHistory {
  id: string;
  date: string;
  amount: number;
  plan: string;
  status: 'completed' | 'pending' | 'failed';
  invoiceUrl: string;
}

interface KeyPerson {
  id: string;
  name: string;
  position: string;
  email?: string;
  phone?: string;
  image: string;
  experience: number;
  expertise?: string[];
}

const MerchantProfile = () => {
  const { user } = useAuth();
  const { companyData, loading, error, updateCompanyData } = useCompanyData();
  const { 
    members, 
    roles, 
    loading: employeesLoading, 
    error: employeesError,
    addMember,
    updateMember,
    deleteMember,
    hasPermission 
  } = useCompanyEmployees();
  
  // Add subscription hook with dynamic data
  const {
    subscriptionData,
    paymentHistory,
    formattedTiers,
    loading: subscriptionLoading,
    error: subscriptionError,
    updateSubscriptionPlan,
    cancelSubscription,
    isFreePlan,
    canUpgrade,
    canCancel
  } = useSubscription();

  // Add certifications hook
  const {
    certifications,
    loading: certificationsLoading,
    error: certificationsError,
    addCertification,
    updateCertification,
    deleteCertification,
    uploadDocument,
    isExpired,
    isExpiringSoon,
    getCertificationTypeDisplayName,
    getStatusDisplayName
  } = useCertifications();

  // Add performance metrics hook
  const {
    performanceData,
    loading: performanceLoading,
    error: performanceError,
    refreshMetrics,
    getMetricsByCategory
  } = usePerformanceMetrics();

  const [activeTab, setActiveTab] = useState('company');
  const [isYearly, setIsYearly] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank'>('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  });
  const [isAddCertificationModalOpen, setIsAddCertificationModalOpen] = useState(false);
  const [isEditCertificationModalOpen, setIsEditCertificationModalOpen] = useState(false);
  const [editingCertification, setEditingCertification] = useState<Certification | null>(null);
  const [newCertification, setNewCertification] = useState<NewCertification>({
    name: '',
    issuer: '',
    issue_date: '',
    expiry_date: '',
    certification_type: 'other',
    status: 'active',
    description: '',
    document_url: ''
  });
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
  const [isEditEmployeeModalOpen, setIsEditEmployeeModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<CompanyMember | null>(null);
  const [newEmployee, setNewEmployee] = useState<NewMember>({
    full_name: '',
    job_position: '',
    email: '',
    phone: '',
    years_experience: 0,
    expertise: [],
    role_name: 'employee'
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingDocument, setUploadingDocument] = useState(false);

  // Add ref for scrolling to plans
  const plansRef = useRef<HTMLDivElement>(null);

  // Dynamic form data based on company data from database
  const [formData, setFormData] = useState({
    companyName: '',
    tradeName: '',
    logo: '',
    description: '',
    phone: '',
    email: '',
    website: '',
    address: '',
    city: '',
    country: '',
    foundedYear: '',
    teamSize: '',
    complianceHistory: [
      { date: '2023-12-15', type: 'Annual Audit', status: 'Passed', notes: 'No issues found' },
      { date: '2023-06-10', type: 'Safety Inspection', status: 'Passed', notes: 'Minor recommendations implemented' },
    ],
    riskStrategies: [
      { name: 'Backup Suppliers', description: 'Multiple supplier agreements to ensure continuous product availability' },
      { name: 'Inventory Buffer', description: 'Maintaining 30-day safety stock for critical products' },
      { name: 'Weather Contingency', description: 'Alternative delivery routes mapped for extreme weather conditions' },
    ],
    contingencyPlans: [
      { name: 'Emergency Delivery', description: 'Rapid response team for critical customer needs' },
      { name: 'Supply Chain Disruption', description: 'Alternative sourcing protocol for major supply interruptions' },
    ],
  });

  // Update form data when company data is loaded
  useEffect(() => {
    if (companyData) {
      setFormData(prev => ({
        ...prev,
        companyName: companyData.legal_name || '',
        tradeName: companyData.trade_name || '',
        logo: companyData.logo_url || '',
        description: companyData.description || '',
        phone: companyData.phone || companyData.user_phone || '',
        email: companyData.email || companyData.user_email || '',
        website: companyData.website || '',
        address: companyData.address || '',
        city: companyData.city || '',
        country: companyData.country || '',
        foundedYear: companyData.founded_year || '',
        teamSize: companyData.team_size || '',
      }));
    }
  }, [companyData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          logo: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async () => {
    if (!companyData) return;
    
    setIsSaving(true);
    try {
      const updates = {
        legal_name: formData.companyName,
        trade_name: formData.tradeName || undefined,
        email: formData.email,
        phone: formData.phone,
        website: formData.website || undefined,
        address: formData.address || undefined,
        city: formData.city || undefined,
        country: formData.country || undefined,
        description: formData.description || undefined,
        founded_year: formData.foundedYear || undefined,
        team_size: formData.teamSize || undefined,
        logo_url: formData.logo || undefined,
      };

      await updateCompanyData(updates);
      setIsEditMode(false);
      alert('Changes saved successfully!');
    } catch (err) {
      console.error('Error saving changes:', err);
      alert('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelectPlan = (planName: string) => {
    if (planName === 'Premium') {
      // Handle contact sales
      window.open('mailto:sales@gasable.com?subject=Premium Plan Inquiry', '_blank');
      return;
    }
    
    setSelectedPlan(planName);
    setShowPaymentModal(true);
  };

  const handlePayment = async () => {
    try {
      // Update subscription plan
      const result = await updateSubscriptionPlan(selectedPlan);
      
      if (result.success) {
        setShowPaymentModal(false);
        setSelectedPlan('');
        // Show success message
        alert('Subscription updated successfully!');
      } else {
        alert(result.error || 'Failed to update subscription');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    }
  };

  const handleCancelSubscription = async () => {
    if (window.confirm('Are you sure you want to cancel your subscription? You will be downgraded to the Free plan.')) {
      const result = await cancelSubscription();
      
      if (result.success) {
        alert('Subscription cancelled successfully. You are now on the Free plan.');
      } else {
        alert(result.error || 'Failed to cancel subscription');
      }
    }
  };

  const handleUpgradePlan = () => {
    // Scroll to plans section
    plansRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDownloadInvoice = (invoiceUrl: string) => {
    alert('Invoice downloaded!');
  };

  const handleAddCertification = async () => {
    if (!newCertification.name || !newCertification.issuer || !newCertification.issue_date || !newCertification.expiry_date) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const result = await addCertification(newCertification);
      if (result.success) {
        setIsAddCertificationModalOpen(false);
        resetCertificationForm();
        alert('Certification added successfully!');
      } else {
        alert(result.error || 'Failed to add certification');
      }
    } catch (err) {
      console.error('Error adding certification:', err);
      alert('Failed to add certification. Please try again.');
    }
  };

  const handleEditCertification = (certification: Certification) => {
    setEditingCertification(certification);
    setNewCertification({
      name: certification.name,
      issuer: certification.issuer,
      issue_date: certification.issue_date,
      expiry_date: certification.expiry_date,
      certification_type: certification.certification_type,
      status: certification.status,
      description: certification.description || '',
      document_url: certification.document_url || ''
    });
    setIsEditCertificationModalOpen(true);
  };

  const handleUpdateCertification = async () => {
    if (!editingCertification || !newCertification.name || !newCertification.issuer || !newCertification.issue_date || !newCertification.expiry_date) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const result = await updateCertification({
        id: editingCertification.id,
        ...newCertification
      });
      if (result.success) {
        setIsEditCertificationModalOpen(false);
        setEditingCertification(null);
        resetCertificationForm();
        alert('Certification updated successfully!');
      } else {
        alert(result.error || 'Failed to update certification');
      }
    } catch (err) {
      console.error('Error updating certification:', err);
      alert('Failed to update certification. Please try again.');
    }
  };

  const handleDeleteCertification = async (certificationId: string) => {
    if (!confirm('Are you sure you want to delete this certification?')) {
      return;
    }

    try {
      const result = await deleteCertification(certificationId);
      if (result.success) {
        alert('Certification deleted successfully!');
      } else {
        alert(result.error || 'Failed to delete certification');
      }
    } catch (err) {
      console.error('Error deleting certification:', err);
      alert('Failed to delete certification. Please try again.');
    }
  };

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingDocument(true);
    try {
      const result = await uploadDocument(file);
      if (result.success && result.url) {
        setNewCertification(prev => ({
          ...prev,
          document_url: result.url!
        }));
        alert('Document uploaded successfully!');
      } else {
        alert(result.error || 'Failed to upload document');
      }
    } catch (err) {
      console.error('Error uploading document:', err);
      alert('Failed to upload document. Please try again.');
    } finally {
      setUploadingDocument(false);
    }
  };

  // Employee management functions
  const handleAddEmployee = async () => {
    if (!newEmployee.full_name || !newEmployee.job_position) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const result = await addMember(newEmployee);
      if (result.success) {
        setIsAddEmployeeModalOpen(false);
        resetEmployeeForm();
        alert('Employee added successfully!');
      } else {
        alert(result.error || 'Failed to add employee');
      }
    } catch (err) {
      console.error('Error adding employee:', err);
      alert('Failed to add employee. Please try again.');
    }
  };

  const handleEditEmployee = (employee: CompanyMember) => {
    setEditingEmployee(employee);
    setNewEmployee({
      full_name: employee.full_name,
      job_position: employee.job_position,
      email: employee.email || '',
      phone: employee.phone || '',
      years_experience: employee.years_experience || 0,
      expertise: employee.expertise || [],
      role_name: employee.role_name
    });
    setIsEditEmployeeModalOpen(true);
  };

  const handleUpdateEmployee = async () => {
    if (!editingEmployee || !newEmployee.full_name || !newEmployee.job_position) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const result = await updateMember(editingEmployee.profile_id, newEmployee);
      if (result.success) {
        setIsEditEmployeeModalOpen(false);
        setEditingEmployee(null);
        resetEmployeeForm();
        alert('Employee updated successfully!');
      } else {
        alert(result.error || 'Failed to update employee');
      }
    } catch (err) {
      console.error('Error updating employee:', err);
      alert('Failed to update employee. Please try again.');
    }
  };

  const handleRemoveEmployee = async (profileId: string) => {
    if (!confirm('Are you sure you want to remove this employee?')) {
      return;
    }

    try {
      const result = await deleteMember(profileId);
      if (result.success) {
        alert('Employee removed successfully!');
      } else {
        alert(result.error || 'Failed to remove employee');
      }
    } catch (err) {
      console.error('Error removing employee:', err);
      alert('Failed to remove employee. Please try again.');
    }
  };

  const resetCertificationForm = () => {
    setNewCertification({
      name: '',
      issuer: '',
      issue_date: '',
      expiry_date: '',
      certification_type: 'other',
      status: 'active',
      description: '',
      document_url: ''
    });
  };

  const resetEmployeeForm = () => {
    setNewEmployee({
      full_name: '',
      job_position: '',
      email: '',
      phone: '',
      years_experience: 0,
      expertise: [],
      role_name: 'employee'
    });
  };

  const getCertificationTypeIcon = (type: Certification['certification_type']) => {
    switch (type) {
      case 'iso':
        return <FileCheck className="h-5 w-5 text-blue-600" />;
      case 'environmental':
        return <Leaf className="h-5 w-5 text-green-600" />;
      case 'safety':
        return <ShieldCheck className="h-5 w-5 text-red-600" />;
      case 'other':
        return <Award className="h-5 w-5 text-purple-600" />;
      default:
        return <Award className="h-5 w-5 text-gray-600" />;
    }
  };

  const getCertificationStatusColor = (status: Certification['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'expired':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'revoked':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getMetricStatusColor = (status: PerformanceMetric['status']) => {
    switch (status) {
      case 'good':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'critical':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getMetricIcon = (name: string) => {
    if (name.toLowerCase().includes('delivery') || name.toLowerCase().includes('time')) {
      return <Clock className="h-5 w-5" />;
    } else if (name.toLowerCase().includes('accuracy') || name.toLowerCase().includes('order')) {
      return <CheckCircle className="h-5 w-5" />;
    } else if (name.toLowerCase().includes('return')) {
      return <Repeat className="h-5 w-5" />;
    } else if (name.toLowerCase().includes('response')) {
      return <MessageSquare className="h-5 w-5" />;
    } else if (name.toLowerCase().includes('market')) {
      return <PieChart className="h-5 w-5" />;
    } else if (name.toLowerCase().includes('supply') || name.toLowerCase().includes('chain')) {
      return <Workflow className="h-5 w-5" />;
    } else {
      return <Gauge className="h-5 w-5" />;
    }
  };

  const renderSubscriptionPlans = () => (
    <div className="space-y-6" ref={plansRef}>
      {/* Current Plan Status */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              Current Plan: {subscriptionData?.currentPlan || 'Free'}
            </h2>
            {subscriptionData?.nextBillingDate && (
              <p className="text-gray-600">
                Next billing date: {subscriptionData.nextBillingDate}
              </p>
            )}
            {isFreePlan() && (
              <p className="text-gray-600">
                You are currently on the free plan with no billing.
              </p>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {canCancel() && (
              <button 
                onClick={handleCancelSubscription}
                className="px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg"
              >
                Cancel Subscription
              </button>
            )}
            {canUpgrade() && (
              <button 
                onClick={handleUpgradePlan}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Upgrade Plan
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold mb-6">Payment History</h2>
        {paymentHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-200">
                  <th className="pb-3 font-medium">Invoice #</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Plan</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paymentHistory.map((payment) => (
                  <tr key={payment.id} className="border-b border-gray-100">
                    <td className="py-4">{payment.id}</td>
                    <td className="py-4">{payment.date}</td>
                    <td className="py-4">{payment.amount} SAR</td>
                    <td className="py-4">{payment.plan}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        payment.status === 'completed'
                          ? 'bg-green-50 text-green-700'
                          : payment.status === 'pending'
                          ? 'bg-yellow-50 text-yellow-700'
                          : 'bg-red-50 text-red-700'
                      }`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4">
                      <button
                        onClick={() => handleDownloadInvoice(payment.invoiceUrl)}
                        className="text-primary-600 hover:text-primary-700"
                      >
                        <Download className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <Receipt className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No payment history available</p>
            {isFreePlan() && (
              <p className="text-sm text-gray-500 mt-2">
                Upgrade to a paid plan to see payment history
              </p>
            )}
          </div>
        )}
      </div>

      {/* Billing Cycle Toggle */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        <span className={`text-lg ${!isYearly ? 'font-bold text-primary-600' : 'text-gray-600'}`}>
          Monthly
        </span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isYearly}
            onChange={() => setIsYearly(!isYearly)}
            className="sr-only peer"
          />
          <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary-600"></div>
        </label>
        <span className={`text-lg ${isYearly ? 'font-bold text-primary-600' : 'text-gray-600'}`}>
          Yearly
        </span>
      </div>

      {/* Subscription Plans - Dynamic from Database */}
      {subscriptionLoading ? (
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin text-primary-600" />
          <span className="ml-2 text-gray-600">Loading subscription plans...</span>
        </div>
      ) : subscriptionError ? (
        <div className="text-center py-8">
          <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-600">Failed to load subscription plans</p>
          <p className="text-sm text-gray-500">{subscriptionError}</p>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-6">
          {formattedTiers.map((tier, index) => {
            const isCurrentPlan = tier.name === subscriptionData?.currentPlan;
            
            return (
              <div
                key={index}
                className={`relative rounded-xl border ${
                  tier.recommended
                    ? 'border-primary-500 shadow-lg'
                    : isCurrentPlan
                    ? 'border-green-500 shadow-md'
                    : 'border-gray-200'
                }`}
              >
                {tier.recommended && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Recommended
                  </div>
                )}
                {isCurrentPlan && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Current Plan
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                  <div className="mb-4">
                    <div className="text-2xl font-bold text-primary-600">
                      {tier.monthlyPrice ? (
                        <>
                          {isYearly ? (
                            <>
                              {(tier.monthlyPrice * 12 * (1 - parseFloat(tier.yearlyDiscount) / 100)).toFixed(0)} SAR/year
                              <div className="text-sm text-green-600">Save {tier.yearlyDiscount}</div>
                            </>
                          ) : (
                            <>{tier.monthlyPrice} SAR/month</>
                          )}
                        </>
                      ) : (
                        tier.price
                      )}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-start">
                        <Users className="h-5 w-5 text-primary-600 mt-1 mr-2" />
                        <div>
                          <div className="font-medium">Customer Type</div>
                          <div className="text-sm text-gray-600">{tier.features.customerType}</div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Package className="h-5 w-5 text-primary-600 mt-1 mr-2" />
                        <div>
                          <div className="font-medium">Products</div>
                          <div className="text-sm text-gray-600">{tier.features.productsAllowed}</div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Truck className="h-5 w-5 text-primary-600 mt-1 mr-2" />
                        <div>
                          <div className="font-medium">Orders Limit</div>
                          <div className="text-sm text-gray-600 whitespace-pre-line">{tier.features.ordersLimit}</div>
                        </div>
                      </div>
                    </div>
                    <hr />
                    <div className="space-y-2">
                      {Object.entries(tier.features).map(([key, value]) => {
                        if (!['customerType', 'productsAllowed', 'ordersLimit'].includes(key)) {
                          return (
                            <div key={key} className="flex items-center">
                              {value === '–' ? (
                                <X className="h-4 w-4 text-gray-400 mr-2" />
                              ) : (
                                <Check className="h-4 w-4 text-green-500 mr-2" />
                              )}
                              <span className="text-sm text-gray-600">{value}</span>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                  <div className="mt-6">
                    <button
                      onClick={() => handleSelectPlan(tier.name)}
                      disabled={isCurrentPlan}
                      className={`w-full py-2 px-4 rounded-lg font-medium ${
                        isCurrentPlan
                          ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                          : tier.recommended
                          ? 'bg-primary-600 text-white hover:bg-primary-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {isCurrentPlan 
                        ? 'Current Plan' 
                        : tier.name === 'Premium' 
                        ? 'Contact Sales' 
                        : 'Select Plan'
                      }
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Payment Details</h2>
            <div className="space-y-4">
              <div className="flex space-x-4 mb-6">
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`flex-1 py-2 px-4 rounded-lg ${
                    paymentMethod === 'card'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <CreditCard className="h-5 w-5 mx-auto mb-2" />
                  Credit Card
                </button>
                <button
                  onClick={() => setPaymentMethod('bank')}
                  className={`flex-1 py-2 px-4 rounded-lg ${
                    paymentMethod === 'bank'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <Building2 className="h-5 w-5 mx-auto mb-2" />
                  Bank Transfer
                </button>
              </div>

              {paymentMethod === 'card' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="1234 5678 9012 3456"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="MM/YY"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CVC
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="123"
                        value={cardDetails.cvc}
                        onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="John Smith"
                      value={cardDetails.name}
                      onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Bank Transfer Details</h3>
                    <div className="space-y-2 text-sm">
                      <p>Bank: Saudi National Bank</p>
                      <p>Account Name: Gasable LLC</p>
                      <p>IBAN: SA44 2000 0001 2345 6789 1234</p>
                      <p>Reference: {selectedPlan}-{Date.now()}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Please make the transfer and upload the receipt below
                  </p>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">Click to upload receipt</p>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Complete Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const tabs = [
    { id: 'company', label: 'Company Info', icon: <Building2 className="h-5 w-5" /> },
    { id: 'subscription', label: 'Subscription', icon: <Crown className="h-5 w-5" /> },
    { id: 'certifications', label: 'Certifications', icon: <Award className="h-5 w-5" /> },
    { id: 'performance', label: 'Performance', icon: <TrendingUp className="h-5 w-5" /> },
    { id: 'compliance', label: 'Compliance', icon: <Shield className="h-5 w-5" /> },
  ];

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Merchant Profile</h1>
        <button
          onClick={handleSaveChanges}
          disabled={isSaving || loading}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <RefreshCw className="h-5 w-5 animate-spin" />
          ) : (
            <Save className="h-5 w-5" />
          )}
          <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary-600" />
          <p className="text-gray-600">Loading company data...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
            <h3 className="text-red-800 font-medium">Error Loading Data</h3>
          </div>
          <p className="text-red-700 mt-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Main Content */}
      {!loading && !error && (
        <>
          <div className="bg-white rounded-xl shadow-sm mb-8">
            <div className="flex border-b">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 ${
                    activeTab === tab.id
                      ? 'border-b-2 border-primary-500 text-primary-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {activeTab === 'company' && (
            <div className="space-y-8">
              {/* Basic Info */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between mb-6">
                  <h3 className="text-xl font-semibold text-secondary-900">Supplier Information</h3>
                  {!isEditMode ? (
                    <button 
                      onClick={() => setIsEditMode(true)}
                      className="px-4 py-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors flex items-center space-x-2"
                    >
                      <Edit className="h-5 w-5" />
                      <span>Edit Information</span>
                    </button>
                  ) : (
                    <div className="flex space-x-3">
                      <button 
                        onClick={() => setIsEditMode(false)}
                        className="px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleSaveChanges}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
                      >
                        <Save className="h-5 w-5" />
                        <span>Save Changes</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-6 mb-6">
                  <div className="relative w-32 h-32">
                    <img
                      src={formData.logo || 'https://via.placeholder.com/128?text=Company+Logo'}
                      alt={formData.companyName || 'Company Logo'}
                      className="w-full h-full object-cover rounded-lg border border-secondary-200"
                    />
                    {isEditMode && (
                      <label className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 cursor-pointer">
                        <Upload className="h-4 w-4" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleLogoUpload}
                        />
                      </label>
                    )}
                  </div>
                  <div className="flex-1">
                    {isEditMode ? (
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        placeholder="Enter Company Name"
                        className="text-2xl font-bold text-gray-900 mb-2 w-full border-b border-gray-300 focus:border-primary-500 outline-none px-2 py-1"
                      />
                    ) : (
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{formData.companyName}</h2>
                    )}
                    {/* Trade Name Field */}
                    {isEditMode && (
                      <input
                        type="text"
                        name="tradeName"
                        value={formData.tradeName}
                        onChange={handleInputChange}
                        placeholder="Enter Trade Name (optional)"
                        className="text-lg text-gray-600 mb-2 w-full border-b border-gray-300 focus:border-primary-500 outline-none px-2 py-1"
                      />
                    )}
                    {!isEditMode && formData.tradeName && (
                      <p className="text-lg text-gray-600 mb-2">Trading as: {formData.tradeName}</p>
                    )}
                    <div className="flex items-center space-x-4 text-gray-500">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        {isEditMode ? (
                          <input
                            type="text"
                            name="foundedYear"
                            value={formData.foundedYear}
                            onChange={handleInputChange}
                            placeholder="Founded Year"
                            className="border-b border-gray-300 focus:border-primary-500 outline-none w-20"
                          />
                        ) : (
                          <span>Founded {formData.foundedYear}</span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        {isEditMode ? (
                          <input
                            type="text"
                            name="teamSize"
                            value={formData.teamSize}
                            onChange={handleInputChange}
                            placeholder="Team Size"
                            className="border-b border-gray-300 focus:border-primary-500 outline-none w-20"
                          />
                        ) : (
                          <span>{formData.teamSize} employees</span>
                        )}
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-1 text-yellow-400" />
                        <span>4.8 rating</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Description</label>
                    {isEditMode ? (
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Enter company description"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 h-32"
                      />
                    ) : (
                      <p className="text-gray-700">{formData.description}</p>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contact Information</label>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Phone className="h-5 w-5 text-gray-400 mr-2" />
                          {isEditMode ? (
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              placeholder="Enter phone number"
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                          ) : (
                            <span>{formData.phone}</span>
                          )}
                        </div>
                        <div className="flex items-center">
                          <Mail className="h-5 w-5 text-gray-400 mr-2" />
                          {isEditMode ? (
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder="Enter email address"
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                          ) : (
                            <span>{formData.email}</span>
                          )}
                        </div>
                        <div className="flex items-center">
                          <Globe className="h-5 w-5 text-gray-400 mr-2" />
                          {isEditMode ? (
                            <input
                              type="url"
                              name="website"
                              value={formData.website}
                              onChange={handleInputChange}
                              placeholder="Enter website URL"
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                          ) : (
                            <span>{formData.website}</span>
                          )}
                        </div>
                        <div className="flex items-start">
                          <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-1" />
                          {isEditMode ? (
                            <div className="flex-1 space-y-2">
                              <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                placeholder="Enter address"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              />
                              <div className="grid grid-cols-2 gap-2">
                                <input
                                  type="text"
                                  name="city"
                                  value={formData.city}
                                  onChange={handleInputChange}
                                  placeholder="City"
                                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                />
                                <input
                                  type="text"
                                  name="country"
                                  value={formData.country}
                                  onChange={handleInputChange}
                                  placeholder="Country"
                                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                />
                              </div>
                            </div>
                          ) : (
                            <span>{formData.address}, {formData.city}, {formData.country}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Personnel */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">Key Personnel</h3>
                  {hasPermission('employees', 'write') && (
                    <button
                      onClick={() => setIsAddEmployeeModalOpen(true)}
                      className="px-4 py-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors flex items-center space-x-2"
                    >
                      <Plus className="h-5 w-5" />
                      <span>Add Team Member</span>
                    </button>
                  )}
                </div>
                
                {employeesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <RefreshCw className="h-6 w-6 animate-spin text-primary-600" />
                    <span className="ml-2 text-gray-600">Loading employees...</span>
                  </div>
                ) : employeesError ? (
                  <div className="text-center py-8">
                    <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                    <p className="text-red-600">Failed to load employees</p>
                    <p className="text-sm text-gray-500">{employeesError}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {members.map((employee) => (
                      <div key={employee.profile_id} className="bg-white p-6 rounded-xl border border-secondary-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            employee.member_status === 'active' ? 'bg-green-100 text-green-800' :
                            employee.member_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {employee.member_status}
                          </span>
                          {hasPermission('employees', 'delete') && (
                            <div className="flex space-x-1">
                              <button
                                onClick={() => handleEditEmployee(employee)}
                                className="p-1 text-blue-500 hover:bg-blue-50 rounded-full"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleRemoveEmployee(employee.profile_id)}
                                className="p-1 text-red-500 hover:bg-red-50 rounded-full"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-center text-center mb-4">
                          <img
                            src={employee.profile_image_url || 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400'}
                            alt={employee.full_name}
                            className="w-24 h-24 rounded-full object-cover mb-3"
                          />
                          <h4 className="text-lg font-semibold">{employee.full_name}</h4>
                          <p className="text-secondary-600">{employee.job_position}</p>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs mt-1">
                            {employee.role_name}
                          </span>
                        </div>
                        <div className="space-y-2 text-sm">
                          {employee.email && (
                            <div className="flex items-center justify-center">
                              <Mail className="h-4 w-4 text-secondary-400 mr-2" />
                              <span>{employee.email}</span>
                            </div>
                          )}
                          {employee.phone && (
                            <div className="flex items-center justify-center">
                              <Phone className="h-4 w-4 text-secondary-400 mr-2" />
                              <span>{employee.phone}</span>
                            </div>
                          )}
                          <div className="flex items-center justify-center">
                            <Briefcase className="h-4 w-4 text-secondary-400 mr-2" />
                            <span>{employee.years_experience} years experience</span>
                          </div>
                        </div>
                        {employee.expertise && employee.expertise.length > 0 && (
                          <div className="mt-4">
                            <div className="flex flex-wrap gap-2 justify-center">
                              {employee.expertise.map((skill, index) => (
                                <span key={index} className="px-2 py-1 bg-primary-50 text-primary-700 rounded-full text-xs">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    {hasPermission('employees', 'write') && (
                      <button
                        onClick={() => setIsAddEmployeeModalOpen(true)}
                        className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-secondary-200 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-colors"
                      >
                        <Plus className="h-8 w-8 text-secondary-400 mb-2" />
                        <span className="text-secondary-600">Add Team Member</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Add/Edit Employee Modal */}
              {(isAddEmployeeModalOpen || isEditEmployeeModalOpen) && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold">
                        {isEditEmployeeModalOpen ? 'Edit Team Member' : 'Add Team Member'}
                      </h3>
                      <button
                        onClick={() => {
                          setIsAddEmployeeModalOpen(false);
                          setIsEditEmployeeModalOpen(false);
                          setEditingEmployee(null);
                          setNewEmployee({
                            full_name: '',
                            job_position: '',
                            email: '',
                            phone: '',
                            years_experience: 0,
                            expertise: [],
                            role_name: 'employee'
                          });
                        }}
                        className="p-2 hover:bg-secondary-100 rounded-lg"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={newEmployee.full_name}
                          onChange={(e) => setNewEmployee({ ...newEmployee, full_name: e.target.value })}
                          className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Enter full name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">
                          Position *
                        </label>
                        <input
                          type="text"
                          value={newEmployee.job_position}
                          onChange={(e) => setNewEmployee({ ...newEmployee, job_position: e.target.value })}
                          className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Enter position"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">
                          Role *
                        </label>
                        <select
                          value={newEmployee.role_name}
                          onChange={(e) => setNewEmployee({ ...newEmployee, role_name: e.target.value })}
                          className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          required
                        >
                          {roles.map((role) => (
                            <option key={role.id} value={role.name}>
                              {role.display_name}
                            </option>
                          ))}
                        </select>
                        <p className="text-xs text-secondary-500 mt-1">
                          Role determines access permissions in the portal
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-1">
                            Email
                          </label>
                          <input
                            type="email"
                            value={newEmployee.email}
                            onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                            className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Enter email"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-1">
                            Phone
                          </label>
                          <input
                            type="tel"
                            value={newEmployee.phone}
                            onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                            className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Enter phone number"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">
                          Years of Experience *
                        </label>
                        <input
                          type="number"
                          value={newEmployee.years_experience}
                          onChange={(e) => setNewEmployee({ ...newEmployee, years_experience: parseInt(e.target.value) || 0 })}
                          className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Enter years of experience"
                          min="0"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">
                          Expertise (comma-separated)
                        </label>
                        <input
                          type="text"
                          value={(newEmployee.expertise || []).join(', ')}
                          onChange={(e) => setNewEmployee({ 
                            ...newEmployee, 
                            expertise: e.target.value.split(',').map(item => item.trim()).filter(Boolean)
                          })}
                          className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="E.g. Gas Systems, Engineering, Safety"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                      <button
                        onClick={() => {
                          setIsAddEmployeeModalOpen(false);
                          setIsEditEmployeeModalOpen(false);
                          setEditingEmployee(null);
                          setNewEmployee({
                            full_name: '',
                            job_position: '',
                            email: '',
                            phone: '',
                            years_experience: 0,
                            expertise: [],
                            role_name: 'employee'
                          });
                        }}
                        className="px-4 py-2 text-secondary-700 bg-secondary-100 rounded-lg hover:bg-secondary-200 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={isEditEmployeeModalOpen ? handleUpdateEmployee : handleAddEmployee}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        {isEditEmployeeModalOpen ? 'Update Employee' : 'Add Employee'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {activeTab === 'subscription' && renderSubscriptionPlans()}
          {activeTab === 'certifications' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Certifications & Standards</h3>
                <button
                  onClick={() => setIsAddCertificationModalOpen(true)}
                  className="px-4 py-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors flex items-center space-x-2"
                >
                  <Plus className="h-5 w-5" />
                  <span>Add Certification</span>
                </button>
              </div>

              {certificationsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin text-primary-600" />
                  <span className="ml-2 text-gray-600">Loading certifications...</span>
                </div>
              ) : certificationsError ? (
                <div className="text-center py-8">
                  <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <p className="text-red-600">Failed to load certifications</p>
                  <p className="text-sm text-gray-500">{certificationsError}</p>
                </div>
              ) : certifications.length === 0 ? (
                <div className="text-center py-12">
                  <Award className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No certifications yet</h3>
                  <p className="text-gray-600 mb-6">Add your first certification to showcase your company's standards and compliance.</p>
                  <button
                    onClick={() => setIsAddCertificationModalOpen(true)}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Add First Certification
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {certifications.map((certification) => (
                    <div key={certification.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          {getCertificationTypeIcon(certification.certification_type)}
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">{certification.name}</h4>
                            <p className="text-sm text-gray-600">{certification.issuer}</p>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleEditCertification(certification)}
                            className="p-1 text-blue-500 hover:bg-blue-50 rounded-full"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCertification(certification.id)}
                            className="p-1 text-red-500 hover:bg-red-50 rounded-full"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCertificationStatusColor(certification.status)}`}>
                            {getStatusDisplayName(certification.status)}
                          </span>
                          <span className="text-xs text-gray-500">
                            {getCertificationTypeDisplayName(certification.certification_type)}
                          </span>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Issue Date:</span>
                            <span className="font-medium">{new Date(certification.issue_date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Expiry Date:</span>
                            <span className={`font-medium ${
                              isExpired(certification) ? 'text-red-600' :
                              isExpiringSoon(certification) ? 'text-yellow-600' :
                              'text-gray-900'
                            }`}>
                              {new Date(certification.expiry_date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {certification.description && (
                          <p className="text-sm text-gray-600 mt-3">{certification.description}</p>
                        )}

                        {certification.document_url && (
                          <div className="mt-4">
                            <a
                              href={certification.document_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 text-sm"
                            >
                              <FileText className="h-4 w-4" />
                              <span>View Document</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        )}

                        {(isExpired(certification) || isExpiringSoon(certification)) && (
                          <div className={`mt-3 p-2 rounded-lg text-xs ${
                            isExpired(certification) 
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                          }`}>
                            {isExpired(certification) 
                              ? '⚠️ This certification has expired'
                              : '⏰ This certification expires soon'
                            }
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add/Edit Certification Modal */}
              {(isAddCertificationModalOpen || isEditCertificationModalOpen) && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold">
                        {isEditCertificationModalOpen ? 'Edit Certification' : 'Add Certification'}
                      </h3>
                      <button
                        onClick={() => {
                          setIsAddCertificationModalOpen(false);
                          setIsEditCertificationModalOpen(false);
                          setEditingCertification(null);
                          resetCertificationForm();
                        }}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Certification Name *
                        </label>
                        <input
                          type="text"
                          value={newCertification.name}
                          onChange={(e) => setNewCertification({ ...newCertification, name: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="e.g., ISO 9001:2015"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Issuing Organization *
                        </label>
                        <input
                          type="text"
                          value={newCertification.issuer}
                          onChange={(e) => setNewCertification({ ...newCertification, issuer: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="e.g., International Organization for Standardization"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Issue Date *
                          </label>
                          <input
                            type="date"
                            value={newCertification.issue_date}
                            onChange={(e) => setNewCertification({ ...newCertification, issue_date: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Expiry Date *
                          </label>
                          <input
                            type="date"
                            value={newCertification.expiry_date}
                            onChange={(e) => setNewCertification({ ...newCertification, expiry_date: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Certification Type
                          </label>
                          <select
                            value={newCertification.certification_type}
                            onChange={(e) => setNewCertification({ ...newCertification, certification_type: e.target.value as any })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          >
                            <option value="iso">ISO Standard</option>
                            <option value="environmental">Environmental</option>
                            <option value="safety">Safety</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Status
                          </label>
                          <select
                            value={newCertification.status}
                            onChange={(e) => setNewCertification({ ...newCertification, status: e.target.value as any })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          >
                            <option value="active">Active</option>
                            <option value="pending">Pending</option>
                            <option value="expired">Expired</option>
                            <option value="revoked">Revoked</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          value={newCertification.description}
                          onChange={(e) => setNewCertification({ ...newCertification, description: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Brief description of the certification"
                          rows={3}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Document Upload
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary-500 transition-colors">
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            onChange={handleDocumentUpload}
                            className="hidden"
                            id="document-upload"
                            disabled={uploadingDocument}
                          />
                          <label htmlFor="document-upload" className="cursor-pointer">
                            {uploadingDocument ? (
                              <div className="flex items-center justify-center">
                                <RefreshCw className="h-5 w-5 animate-spin text-primary-600 mr-2" />
                                <span className="text-sm text-gray-600">Uploading...</span>
                              </div>
                            ) : (
                              <>
                                <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                                <p className="text-sm text-gray-600">
                                  Drag and drop file here or click to browse
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  PDF, DOC, DOCX, JPG, PNG (max 10MB)
                                </p>
                              </>
                            )}
                          </label>
                        </div>
                        {newCertification.document_url && (
                          <div className="mt-2 flex items-center space-x-2 text-sm text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            <span>Document uploaded successfully</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                      <button
                        onClick={() => {
                          setIsAddCertificationModalOpen(false);
                          setIsEditCertificationModalOpen(false);
                          setEditingCertification(null);
                          resetCertificationForm();
                        }}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={isEditCertificationModalOpen ? handleUpdateCertification : handleAddCertification}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        {isEditCertificationModalOpen ? 'Update Certification' : 'Add Certification'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {activeTab === 'performance' && (
            <div className="space-y-8">
              {/* Performance Header */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">Performance Metrics</h3>
                  <button
                    onClick={refreshMetrics}
                    disabled={performanceLoading}
                    className="px-4 py-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors flex items-center space-x-2 disabled:opacity-50"
                  >
                    <RefreshCw className={`h-5 w-5 ${performanceLoading ? 'animate-spin' : ''}`} />
                    <span>Refresh Metrics</span>
                  </button>
                </div>

                {performanceLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <RefreshCw className="h-6 w-6 animate-spin text-primary-600" />
                    <span className="ml-2 text-gray-600">Loading performance metrics...</span>
                  </div>
                ) : performanceError ? (
                  <div className="text-center py-8">
                    <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                    <p className="text-red-600">Failed to load performance metrics</p>
                    <p className="text-sm text-gray-500">{performanceError}</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Key Performance Indicators */}
                    <div>
                      <h4 className="text-lg font-semibold mb-4">Key Performance Indicators</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {getMetricsByCategory('kpi').map((metric) => (
                          <div key={metric.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center space-x-3">
                                <div className={`p-2 rounded-lg ${getMetricStatusColor(metric.status)}`}>
                                  {getMetricIcon(metric.name)}
                                </div>
                                <div>
                                  <h5 className="font-medium text-gray-900">{metric.name}</h5>
                                  <p className="text-sm text-gray-600">{metric.description}</p>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-2xl font-bold text-gray-900">
                                  {metric.value}{metric.unit}
                                </span>
                                {metric.trend !== 0 && (
                                  <div className={`flex items-center space-x-1 ${
                                    metric.trend > 0 ? 'text-green-600' : 'text-red-600'
                                  }`}>
                                    {metric.trend > 0 ? (
                                      <ArrowUpRight className="h-4 w-4" />
                                    ) : (
                                      <ArrowDownRight className="h-4 w-4" />
                                    )}
                                    <span className="text-sm font-medium">
                                      {Math.abs(metric.trend)}{metric.unit}
                                    </span>
                                  </div>
                                )}
                              </div>
                              {metric.target && (
                                <div className="text-sm text-gray-600">
                                  Target: {metric.target}{metric.unit}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Operational Performance */}
                    <div>
                      <h4 className="text-lg font-semibold mb-4">Operational Performance</h4>
                      <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {getMetricsByCategory('operational').map((metric) => (
                            <div key={metric.id} className="text-center">
                              <div className="flex items-center justify-center mb-2">
                                <div className={`p-3 rounded-full ${getMetricStatusColor(metric.status)} bg-opacity-10`}>
                                  {getMetricIcon(metric.name)}
                                </div>
                              </div>
                              <h5 className="font-medium text-gray-900 mb-1">{metric.name}</h5>
                              <div className="text-2xl font-bold text-gray-900 mb-1">
                                {metric.value}{metric.unit}
                              </div>
                              <p className="text-sm text-gray-600">{metric.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Pricing Competitiveness */}
                    <div>
                      <h4 className="text-lg font-semibold mb-4">Pricing Competitiveness</h4>
                      <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {getMetricsByCategory('pricing').map((metric) => (
                            <div key={metric.id} className="text-center">
                              <h5 className="font-medium text-gray-900 mb-2">{metric.name}</h5>
                              <div className="text-2xl font-bold text-gray-900 mb-1">
                                {metric.id === 'price_perception' ? metric.description : `${metric.value}${metric.unit}`}
                              </div>
                              {metric.id === 'price_perception' && (
                                <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Competitive
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Market Share */}
                    <div>
                      <h4 className="text-lg font-semibold mb-4">Market Share</h4>
                      <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {getMetricsByCategory('market').map((metric) => (
                            <div key={metric.id} className="text-center">
                              <h5 className="font-medium text-gray-900 mb-2">{metric.name}</h5>
                              <div className="text-2xl font-bold text-gray-900 mb-1">
                                {metric.id === 'market_position' ? metric.description : `${metric.value}${metric.unit}`}
                              </div>
                              {metric.id === 'yoy_growth' && metric.trend !== 0 && (
                                <div className={`flex items-center justify-center space-x-1 ${
                                  metric.trend > 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {metric.trend > 0 ? (
                                    <ArrowUpRight className="h-4 w-4" />
                                  ) : (
                                    <ArrowDownRight className="h-4 w-4" />
                                  )}
                                  <span className="text-sm">
                                    {metric.trend > 0 ? '+' : ''}{metric.trend}%
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Flexibility & Customization */}
                    <div>
                      <h4 className="text-lg font-semibold mb-4">Flexibility & Customization</h4>
                      <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {getMetricsByCategory('flexibility').map((metric) => (
                            <div key={metric.id} className="text-center">
                              <div className="flex items-center justify-center mb-3">
                                <div className="p-3 rounded-full bg-green-100">
                                  <CheckCircle className="h-6 w-6 text-green-600" />
                                </div>
                              </div>
                              <h5 className="font-medium text-gray-900 mb-1">{metric.name}</h5>
                              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                {metric.description}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Performance Insights */}
                    <div className="bg-blue-50 rounded-xl p-6">
                      <h4 className="text-lg font-semibold text-blue-900 mb-4">Performance Insights</h4>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Lightbulb className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h5 className="font-medium text-blue-900">Getting Started</h5>
                            <p className="text-blue-700 text-sm">
                              Your metrics will improve as you process more orders and build your customer base. 
                              Focus on maintaining high quality service to establish strong performance baselines.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <TrendingUp className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h5 className="font-medium text-blue-900">Growth Opportunities</h5>
                            <p className="text-blue-700 text-sm">
                              Consider adding more products to your catalog and optimizing your delivery processes 
                              to improve your market position and customer satisfaction.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          {activeTab === 'compliance' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-semibold mb-6">Compliance & Risk Management</h3>
              <p className="text-gray-600">Compliance tracking coming soon...</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MerchantProfile;