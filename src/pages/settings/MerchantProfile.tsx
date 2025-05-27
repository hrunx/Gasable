import React, { useState, useEffect } from 'react';
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
  Paperclip,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useCompanyData, type CompanyData, type UpdateCompanyDataParams } from '../../lib/hooks/useCompanyData';
import { useCompanyEmployees, type CompanyMember, type NewMember, type Role } from '../../lib/hooks/useCompanyEmployees';
import { useAuth } from '../../lib/auth';

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

interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
  status: 'active' | 'expired' | 'pending';
  documentUrl?: string;
  type: 'iso' | 'environmental' | 'safety' | 'other';
  description?: string;
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

interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  trend: number;
  target?: number;
  status: 'good' | 'warning' | 'critical';
  history: { date: string; value: number }[];
}

const subscriptionTiers: SubscriptionTier[] = [
  {
    name: 'Free',
    price: 'Free',
    yearlyDiscount: '–',
    monthlyPrice: 0,
    features: {
      customerType: 'B2C',
      productsAllowed: 'Up to 3',
      ordersLimit: '10 orders/month\nMax 500 SAR GMV',
      coverage: 'Domestic Only',
      branches: '1 branch',
      drivers: '3',
      inventory: 'Basic',
      compliance: 'Basic',
      marketing: '–',
      trial: '14 days',
      integration: 'N/A',
      analytics: '–',
      support: '24/7',
      training: 'Basic',
      commission: 'Tax + Transaction Fees Only',
    }
  },
  {
    name: 'Basic',
    price: '750 SAR/month',
    yearlyDiscount: '10%',
    monthlyPrice: 750,
    features: {
      customerType: 'B2C',
      productsAllowed: 'Up to 5',
      ordersLimit: '100 orders/month\nMax 5,000 SAR GMV',
      coverage: 'Domestic Only',
      branches: 'Up to 3 (+200 SAR per extra)',
      drivers: '10',
      inventory: 'Basic',
      compliance: 'Basic',
      marketing: 'Directory Listing',
      trial: '1 month',
      integration: 'API Access',
      analytics: 'Basic',
      support: '24/7',
      training: 'Basic',
      commission: 'Tax + Transaction Fees Only',
    }
  },
  {
    name: 'Advanced',
    price: '1,500 SAR/month',
    yearlyDiscount: '12%',
    monthlyPrice: 1500,
    recommended: true,
    features: {
      customerType: 'B2B & B2C',
      productsAllowed: 'Up to 35',
      ordersLimit: '500 orders/month\nMax 25,000 SAR GMV',
      coverage: 'Domestic + 1 country',
      branches: 'Up to 7 (+150 SAR per extra)',
      drivers: '50',
      inventory: 'Advanced',
      compliance: 'Advanced',
      marketing: 'Promotions & Campaigns',
      trial: '3 months',
      integration: 'API Access',
      analytics: 'Advanced',
      support: '24/7 + KAM',
      training: 'Enhanced',
      commission: '8–20% (UPC-based)',
    }
  },
  {
    name: 'Premium',
    price: 'Contact Us',
    yearlyDiscount: '5%',
    features: {
      customerType: 'B2B, B2C & B2G',
      productsAllowed: 'Unlimited',
      ordersLimit: 'Unlimited orders & GMV',
      coverage: 'Unlimited Global',
      branches: 'Up to 100 (+100 SAR per extra)',
      drivers: 'Unlimited',
      inventory: 'Advanced',
      compliance: 'Advanced',
      marketing: 'Featured & Custom Campaigns',
      trial: '3 months',
      integration: 'Custom API Setup',
      analytics: 'Full Performance Reports',
      support: '24/7 + Dedicated KAM',
      training: 'Full Training Suite',
      commission: '8–20% (UPC-based)',
    }
  }
];

const mockPaymentHistory: PaymentHistory[] = [
  {
    id: 'INV-2024-001',
    date: '2024-03-15',
    amount: 750,
    plan: 'Basic',
    status: 'completed',
    invoiceUrl: '#',
  },
  {
    id: 'INV-2024-002',
    date: '2024-02-15',
    amount: 750,
    plan: 'Basic',
    status: 'completed',
    invoiceUrl: '#',
  },
  {
    id: 'INV-2024-003',
    date: '2024-01-15',
    amount: 750,
    plan: 'Basic',
    status: 'completed',
    invoiceUrl: '#',
  },
];

const mockCertifications: Certification[] = [
  {
    id: '1',
    name: 'ISO 9001:2015',
    issuer: 'International Organization for Standardization',
    issueDate: '2022-05-15',
    expiryDate: '2025-05-14',
    status: 'active',
    documentUrl: '#',
    type: 'iso',
    description: 'Quality Management System certification'
  },
  {
    id: '2',
    name: 'ISO 14001:2015',
    issuer: 'International Organization for Standardization',
    issueDate: '2022-06-20',
    expiryDate: '2025-06-19',
    status: 'active',
    documentUrl: '#',
    type: 'environmental',
    description: 'Environmental Management System certification'
  },
  {
    id: '3',
    name: 'OHSAS 18001',
    issuer: 'Occupational Health and Safety Assessment Series',
    issueDate: '2022-07-10',
    expiryDate: '2025-07-09',
    status: 'active',
    documentUrl: '#',
    type: 'safety',
    description: 'Occupational Health and Safety Management certification'
  },
  {
    id: '4',
    name: 'API 650',
    issuer: 'American Petroleum Institute',
    issueDate: '2023-01-15',
    expiryDate: '2026-01-14',
    status: 'active',
    documentUrl: '#',
    type: 'other',
    description: 'Welded Tanks for Oil Storage certification'
  },
];

const mockKeyPersonnel: KeyPerson[] = [
  {
    id: '1',
    name: 'Ahmed Al-Saud',
    position: 'CEO',
    email: 'ahmed@example.com',
    phone: '+966-123-456-789',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    experience: 15,
    expertise: ['Energy Management', 'Business Strategy', 'International Trade']
  },
  {
    id: '2',
    name: 'Sarah Al-Omar',
    position: 'Operations Director',
    email: 'sarah@example.com',
    phone: '+966-123-456-790',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    experience: 12,
    expertise: ['Supply Chain', 'Logistics', 'Process Optimization']
  },
  {
    id: '3',
    name: 'Mohammed Al-Qahtani',
    position: 'Technical Director',
    email: 'mohammed@example.com',
    phone: '+966-123-456-791',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    experience: 18,
    expertise: ['Gas Systems', 'Engineering', 'Safety Standards']
  },
];

const mockPerformanceMetrics: PerformanceMetric[] = [
  {
    id: '1',
    name: 'Delivery Time',
    value: 1.8,
    unit: 'days',
    trend: -0.2,
    target: 2,
    status: 'good',
    history: [
      { date: '2024-01', value: 2.1 },
      { date: '2024-02', value: 2.0 },
      { date: '2024-03', value: 1.8 },
    ]
  },
  {
    id: '2',
    name: 'Order Accuracy',
    value: 98.5,
    unit: '%',
    trend: 0.5,
    target: 99,
    status: 'good',
    history: [
      { date: '2024-01', value: 97.8 },
      { date: '2024-02', value: 98.0 },
      { date: '2024-03', value: 98.5 },
    ]
  },
  {
    id: '3',
    name: 'Return Rate',
    value: 1.2,
    unit: '%',
    trend: -0.3,
    target: 1.0,
    status: 'warning',
    history: [
      { date: '2024-01', value: 1.8 },
      { date: '2024-02', value: 1.5 },
      { date: '2024-03', value: 1.2 },
    ]
  },
  {
    id: '4',
    name: 'Response Time',
    value: 2.5,
    unit: 'hours',
    trend: -0.5,
    target: 2.0,
    status: 'warning',
    history: [
      { date: '2024-01', value: 3.5 },
      { date: '2024-02', value: 3.0 },
      { date: '2024-03', value: 2.5 },
    ]
  },
  {
    id: '5',
    name: 'Market Share',
    value: 15.8,
    unit: '%',
    trend: 2.3,
    status: 'good',
    history: [
      { date: '2024-01', value: 12.5 },
      { date: '2024-02', value: 14.2 },
      { date: '2024-03', value: 15.8 },
    ]
  },
  {
    id: '6',
    name: 'Supply Chain Reliability',
    value: 97.2,
    unit: '%',
    trend: 1.2,
    target: 98.0,
    status: 'good',
    history: [
      { date: '2024-01', value: 95.0 },
      { date: '2024-02', value: 96.0 },
      { date: '2024-03', value: 97.2 },
    ]
  },
];

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
    hasPermission,
    getRoleByName 
  } = useCompanyEmployees();
  
  const [activeTab, setActiveTab] = useState('info');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isYearly, setIsYearly] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank'>('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddPersonModalOpen, setIsAddPersonModalOpen] = useState(false);
  const [isEditPersonModalOpen, setIsEditPersonModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<CompanyMember | null>(null);
  const [isAddCertificationModalOpen, setIsAddCertificationModalOpen] = useState(false);
  const [newCertification, setNewCertification] = useState<Partial<Certification>>({
    name: '',
    issuer: '',
    issueDate: '',
    expiryDate: '',
    type: 'iso',
    status: 'active',
    description: ''
  });
  const [newEmployee, setNewEmployee] = useState<NewMember>({
    full_name: '',
    job_position: '',
    email: '',
    phone: '',
    profile_image_url: '',
    years_experience: 0,
    expertise: [],
    role_name: 'employee'
  });
  const [certifications, setCertifications] = useState<Certification[]>(mockCertifications);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>(mockPerformanceMetrics);

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
    certifications: mockCertifications,
    keyPersonnel: mockKeyPersonnel,
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
      const updates: UpdateCompanyDataParams = {
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
    setSelectedPlan(planName);
    setShowPaymentModal(true);
  };

  const handlePayment = () => {
    alert('Payment processed successfully!');
    setShowPaymentModal(false);
  };

  const handleDownloadInvoice = (invoiceUrl: string) => {
    alert('Invoice downloaded!');
  };

  const handleAddCertification = () => {
    if (!newCertification.name || !newCertification.issuer || !newCertification.issueDate || !newCertification.expiryDate) {
      alert('Please fill in all required fields');
      return;
    }

    const certification: Certification = {
      id: Date.now().toString(),
      name: newCertification.name || '',
      issuer: newCertification.issuer || '',
      issueDate: newCertification.issueDate || '',
      expiryDate: newCertification.expiryDate || '',
      status: newCertification.status as 'active' | 'expired' | 'pending' || 'active',
      type: newCertification.type as 'iso' | 'environmental' | 'safety' | 'other' || 'other',
      description: newCertification.description || '',
    };

    setCertifications([...certifications, certification]);
    setIsAddCertificationModalOpen(false);
    setNewCertification({
      name: '',
      issuer: '',
      issueDate: '',
      expiryDate: '',
      type: 'iso',
      status: 'active',
      description: ''
    });
  };

  const handleAddKeyPerson = async () => {
    if (!newEmployee.full_name || !newEmployee.job_position) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const result = await addMember(newEmployee);
      if (result.success) {
        setIsAddPersonModalOpen(false);
        setNewEmployee({
          full_name: '',
          job_position: '',
          email: '',
          phone: '',
          profile_image_url: '',
          years_experience: 0,
          expertise: [],
          role_name: 'employee'
        });
        alert('Employee added successfully!');
      } else {
        alert(result.error || 'Failed to add employee');
      }
    } catch (err) {
      console.error('Error adding employee:', err);
      alert('Failed to add employee. Please try again.');
    }
  };

  const handleRemoveCertification = (id: string) => {
    setCertifications(certifications.filter(cert => cert.id !== id));
  };

  const handleRemoveKeyPerson = async (employeeId: string) => {
    if (!confirm('Are you sure you want to remove this employee?')) {
      return;
    }

    try {
      const result = await deleteMember(employeeId);
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

  const handleEditEmployee = (employee: CompanyMember) => {
    setEditingEmployee(employee);
    setNewEmployee({
      full_name: employee.full_name,
      job_position: employee.job_position,
      email: employee.email || '',
      phone: employee.phone || '',
      profile_image_url: employee.profile_image_url || '',
      years_experience: employee.years_experience || 0,
      expertise: employee.expertise || [],
      role_name: employee.role_name || 'employee'
    });
    setIsEditPersonModalOpen(true);
  };

  const handleUpdateEmployee = async () => {
    if (!editingEmployee || !newEmployee.full_name || !newEmployee.job_position) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const result = await updateMember(editingEmployee.profile_id, newEmployee);
      if (result.success) {
        setIsEditPersonModalOpen(false);
        setEditingEmployee(null);
        setNewEmployee({
          full_name: '',
          job_position: '',
          email: '',
          phone: '',
          profile_image_url: '',
          years_experience: 0,
          expertise: [],
          role_name: 'employee'
        });
        alert('Employee updated successfully!');
      } else {
        alert(result.error || 'Failed to update employee');
      }
    } catch (err) {
      console.error('Error updating employee:', err);
      alert('Failed to update employee');
    }
  };

  const handleAddEmployee = async () => {
    if (!newEmployee.full_name || !newEmployee.job_position) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const result = await addMember(newEmployee);
      if (result.success) {
        setIsAddPersonModalOpen(false);
        setNewEmployee({
          full_name: '',
          job_position: '',
          email: '',
          phone: '',
          profile_image_url: '',
          years_experience: 0,
          expertise: [],
          role_name: 'employee'
        });
        alert('Employee added successfully!');
      } else {
        alert(result.error || 'Failed to add employee');
      }
    } catch (err) {
      console.error('Error adding employee:', err);
      alert('Failed to add employee. Please try again.');
    }
  };

  const tabs = [
    { id: 'info', label: 'Company Info', icon: <Building2 className="h-5 w-5" /> },
    { id: 'subscription', label: 'Subscription', icon: <Crown className="h-5 w-5" /> },
    { id: 'certifications', label: 'Certifications', icon: <Award className="h-5 w-5" /> },
    { id: 'performance', label: 'Performance', icon: <TrendingUp className="h-5 w-5" /> },
    { id: 'compliance', label: 'Compliance', icon: <Shield className="h-5 w-5" /> },
  ];

  const getCertificationTypeIcon = (type: Certification['type']) => {
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

  const renderCompanyInfo = () => (
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
              onClick={() => setIsAddPersonModalOpen(true)}
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
                        onClick={() => handleRemoveKeyPerson(employee.profile_id)}
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
                    {getRoleByName(employee.role_name)?.display_name || employee.role_name}
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
                onClick={() => setIsAddPersonModalOpen(true)}
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
      {(isAddPersonModalOpen || isEditPersonModalOpen) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">
                {isEditPersonModalOpen ? 'Edit Team Member' : 'Add Team Member'}
              </h3>
              <button
                onClick={() => {
                  setIsAddPersonModalOpen(false);
                  setIsEditPersonModalOpen(false);
                  setEditingEmployee(null);
                  setNewEmployee({
                    full_name: '',
                    job_position: '',
                    email: '',
                    phone: '',
                    profile_image_url: '',
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
                  Profile Image URL
                </label>
                <input
                  type="url"
                  value={newEmployee.profile_image_url}
                  onChange={(e) => setNewEmployee({ ...newEmployee, profile_image_url: e.target.value })}
                  className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter image URL"
                />
                <p className="text-xs text-secondary-500 mt-1">Leave blank for default avatar</p>
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
                  setIsAddPersonModalOpen(false);
                  setIsEditPersonModalOpen(false);
                  setEditingEmployee(null);
                  setNewEmployee({
                    full_name: '',
                    job_position: '',
                    email: '',
                    phone: '',
                    profile_image_url: '',
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
                onClick={isEditPersonModalOpen ? handleUpdateEmployee : handleAddKeyPerson}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                {isEditPersonModalOpen ? 'Update Employee' : 'Add Employee'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderSubscriptionPlans = () => (
    <div className="space-y-6">
      {/* Current Plan Status */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Current Plan: Basic</h2>
            <p className="text-gray-600">Next billing date: April 15, 2024</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg">
              Cancel Subscription
            </button>
            <button className="btn-primary">
              Upgrade Plan
            </button>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold mb-6">Payment History</h2>
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
              {mockPaymentHistory.map((payment) => (
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

      {/* Subscription Plans */}
      <div className="grid grid-cols-4 gap-6">
        {subscriptionTiers.map((tier, index) => (
          <div
            key={index}
            className={`relative rounded-xl border ${
              tier.recommended
                ? 'border-primary-500 shadow-lg'
                : 'border-gray-200'
            }`}
          >
            {tier.recommended && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                Recommended
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
                  className={`w-full py-2 px-4 rounded-lg font-medium ${
                    tier.recommended
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tier.name === 'Premium' ? 'Contact Sales' : 'Select Plan'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

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

  const renderCertifications = () => (
    <div className="space-y-6">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certifications.map((cert) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 rounded-xl border ${getCertificationStatusColor(cert.status)}`}
            >
              <div className="flex justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getCertificationTypeIcon(cert.type)}
                  <h4 className="font-semibold text-lg">{cert.name}</h4>
                </div>
                <button
                  onClick={() => handleRemoveCertification(cert.id)}
                  className="p-1 text-red-500 hover:bg-red-50 rounded-full"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-secondary-600">Issuer:</span>
                  <span className="font-medium">{cert.issuer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600">Issue Date:</span>
                  <span>{cert.issueDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600">Expiry Date:</span>
                  <span>{cert.expiryDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600">Status:</span>
                  <span className={`capitalize ${
                    cert.status === 'active' ? 'text-green-600' :
                    cert.status === 'expired' ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    {cert.status}
                  </span>
                </div>
              </div>
              {cert.description && (
                <div className="mt-4 pt-4 border-t border-secondary-100">
                  <p className="text-secondary-600 text-sm">{cert.description}</p>
                </div>
              )}
              <div className="mt-4 flex justify-end">
                {cert.documentUrl && (
                  <a
                    href={cert.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 flex items-center space-x-1"
                  >
                    <FileText className="h-4 w-4" />
                    <span>View Document</span>
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Add Certification Modal */}
      {isAddCertificationModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Add Certification</h3>
              <button
                onClick={() => setIsAddCertificationModalOpen(false)}
                className="p-2 hover:bg-secondary-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Certification Name *
                </label>
                <input
                  type="text"
                  value={newCertification.name}
                  onChange={(e) => setNewCertification({ ...newCertification, name: e.target.value })}
                  className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="E.g. ISO 9001:2015"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Issuing Organization *
                </label>
                <input
                  type="text"
                  value={newCertification.issuer}
                  onChange={(e) => setNewCertification({ ...newCertification, issuer: e.target.value })}
                  className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="E.g. International Organization for Standardization"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Issue Date *
                  </label>
                  <input
                    type="date"
                    value={newCertification.issueDate}
                    onChange={(e) => setNewCertification({ ...newCertification, issueDate: e.target.value })}
                    className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Expiry Date *
                  </label>
                  <input
                    type="date"
                    value={newCertification.expiryDate}
                    onChange={(e) => setNewCertification({ ...newCertification, expiryDate: e.target.value })}
                    className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Certification Type
                </label>
                <select
                  value={newCertification.type}
                  onChange={(e) => setNewCertification({ ...newCertification, type: e.target.value as Certification['type'] })}
                  className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="iso">ISO Certification</option>
                  <option value="environmental">Environmental Certification</option>
                  <option value="safety">Safety Certification</option>
                  <option value="other">Other Certification</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Status
                </label>
                <select
                  value={newCertification.status}
                  onChange={(e) => setNewCertification({ ...newCertification, status: e.target.value as Certification['status'] })}
                  className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newCertification.description}
                  onChange={(e) => setNewCertification({ ...newCertification, description: e.target.value })}
                  className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 h-24"
                  placeholder="Enter a brief description of this certification"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Document Upload
                </label>
                <div className="border-2 border-dashed border-secondary-200 rounded-lg p-4 text-center">
                  <Paperclip className="h-8 w-8 mx-auto mb-2 text-secondary-400" />
                  <p className="text-sm text-secondary-600">
                    Drag and drop file here or click to browse
                  </p>
                  <input type="file" className="hidden" />
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsAddCertificationModalOpen(false)}
                className="px-4 py-2 text-secondary-700 hover:bg-secondary-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCertification}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Add Certification
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderPerformance = () => (
    <div className="space-y-6">
      {/* KPI Overview */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-xl font-semibold mb-6">Key Performance Indicators</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {performanceMetrics.map((metric) => (
            <div key={metric.id} className="bg-white p-6 rounded-xl border border-secondary-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    metric.status === 'good' ? 'bg-green-50' :
                    metric.status === 'warning' ? 'bg-yellow-50' : 'bg-red-50'
                  }`}>
                    {getMetricIcon(metric.name)}
                  </div>
                  <h4 className="font-semibold">{metric.name}</h4>
                </div>
                <div className={`flex items-center ${
                  metric.trend > 0 
                    ? metric.name.toLowerCase().includes('return') ? 'text-red-600' : 'text-green-600'
                    : metric.name.toLowerCase().includes('return') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.trend > 0 ? (
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                  )}
                  <span>{Math.abs(metric.trend)}{metric.unit === '%' ? '%' : ''}</span>
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-3xl font-bold">{metric.value}</span>
                  <span className="text-secondary-600 ml-1">{metric.unit}</span>
                </div>
                {metric.target && (
                  <div className="text-sm text-secondary-600">
                    Target: {metric.target}{metric.unit}
                  </div>
                )}
              </div>
              <div className="mt-4 h-10">
                <div className="w-full bg-secondary-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      metric.status === 'good' ? 'bg-green-500' :
                      metric.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ 
                      width: `${
                        metric.name.toLowerCase().includes('return')
                          ? `${100 - (metric.value / (metric.target || 5) * 100)}%`
                          : `${(metric.value / (metric.target || 100) * 100)}%`
                      }`
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Operational Performance */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-xl font-semibold mb-6">Operational Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-secondary-50 rounded-xl">
            <h4 className="font-semibold mb-4 flex items-center">
              <Workflow className="h-5 w-5 text-primary-600 mr-2" />
              Supply Chain Reliability
            </h4>
            <div className="flex items-center justify-between mb-2">
              <span className="text-secondary-600">Uptime</span>
              <span className="font-medium">99.2%</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-secondary-600">On-time Delivery</span>
              <span className="font-medium">95.8%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-secondary-600">Inventory Accuracy</span>
              <span className="font-medium">98.5%</span>
            </div>
          </div>
          <div className="p-6 bg-secondary-50 rounded-xl">
            <h4 className="font-semibold mb-4 flex items-center">
              <Tag className="h-5 w-5 text-primary-600 mr-2" />
              Pricing Competitiveness
            </h4>
            <div className="flex items-center justify-between mb-2">
              <span className="text-secondary-600">Market Average</span>
              <span className="font-medium">100%</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-secondary-600">Your Pricing</span>
              <span className="font-medium text-green-600">96.5%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-secondary-600">Price Perception</span>
              <span className="font-medium">Competitive</span>
            </div>
          </div>
          <div className="p-6 bg-secondary-50 rounded-xl">
            <h4 className="font-semibold mb-4 flex items-center">
              <PieChart className="h-5 w-5 text-primary-600 mr-2" />
              Market Share
            </h4>
            <div className="flex items-center justify-between mb-2">
              <span className="text-secondary-600">Current Share</span>
              <span className="font-medium">15.8%</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-secondary-600">YoY Growth</span>
              <span className="font-medium text-green-600">+2.3%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-secondary-600">Market Position</span>
              <span className="font-medium">#2 in Region</span>
            </div>
          </div>
          <div className="p-6 bg-secondary-50 rounded-xl">
            <h4 className="font-semibold mb-4 flex items-center">
              <Sliders className="h-5 w-5 text-primary-600 mr-2" />
              Flexibility & Customization
            </h4>
            <div className="flex items-center justify-between mb-2">
              <span className="text-secondary-600">MOQ Adjustments</span>
              <span className="font-medium text-green-600">Supported</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-secondary-600">Product Customization</span>
              <span className="font-medium text-green-600">Available</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-secondary-600">Bundled Offers</span>
              <span className="font-medium text-green-600">Available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCompliance = () => (
    <div className="space-y-6">
      {/* Compliance History */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-xl font-semibold mb-6">Compliance History</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-200">
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Notes</th>
              </tr>
            </thead>
            <tbody>
              {formData.complianceHistory.map((item, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-4">{item.date}</td>
                  <td className="py-4">{item.type}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      item.status === 'Passed'
                        ? 'bg-green-50 text-green-700'
                        : 'bg-red-50 text-red-700'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4">{item.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Risk Management */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-xl font-semibold mb-6">Risk Management</h3>
        
        <div className="mb-8">
          <h4 className="font-semibold mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 text-primary-600 mr-2" />
            Risk Mitigation Strategies
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formData.riskStrategies.map((strategy, index) => (
              <div key={index} className="p-4 bg-secondary-50 rounded-lg">
                <h5 className="font-medium mb-2">{strategy.name}</h5>
                <p className="text-secondary-600 text-sm">{strategy.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold mb-4 flex items-center">
            <Shield className="h-5 w-5 text-primary-600 mr-2" />
            Contingency Plans
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formData.contingencyPlans.map((plan, index) => (
              <div key={index} className="p-4 bg-secondary-50 rounded-lg">
                <h5 className="font-medium mb-2">{plan.name}</h5>
                <p className="text-secondary-600 text-sm">{plan.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Merchant Profile</h1>
        <button
          onClick={handleSaveChanges}
          disabled={isSaving || loading}
          className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
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

          {activeTab === 'info' && renderCompanyInfo()}
          {activeTab === 'subscription' && renderSubscriptionPlans()}
          {activeTab === 'certifications' && renderCertifications()}
          {activeTab === 'performance' && renderPerformance()}
          {activeTab === 'compliance' && renderCompliance()}
        </>
      )}
    </div>
  );
};

export default MerchantProfile;