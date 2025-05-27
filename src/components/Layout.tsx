import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Settings, Package, DollarSign, BarChart2, Gift, HelpCircle, PlusCircle, Menu, X, LogOut, Bell, Store, Tag, Users, Star, Calendar, Upload, User, ChevronDown, Ticket, MessageSquare, LifeBuoy, Zap, Sun, Building2, MapPin, UserPlus, PenTool as Tool, Cpu, Gauge, PieChart, BriefcaseBusiness, UserCog, ShoppingBag, Wrench, CreditCard } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { useCompany } from '../lib/hooks/useCompany';
import SubscriptionBanner from './SubscriptionBanner';

interface MenuItem {
  icon: JSX.Element;
  label: string;
  path: string;
  subItems?: {
    label: string;
    path: string;
  }[];
}

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, signOut, isDemoMode } = useAuth();
  const { company } = useCompany();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedMenuItem, setExpandedMenuItem] = useState<string | null>(null);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const accountMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        alert('File size must be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompanyLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/signin');
  };

  const menuItems: MenuItem[] = [
    {
      icon: <LayoutDashboard size={20} />,
      label: 'Dashboard',
      path: '/dashboard',
      subItems: [
        { label: 'Overview', path: '/dashboard' },
        { label: 'Real-Time Metrics', path: '/dashboard/metrics' },
        { label: 'Visual Analytics', path: '/dashboard/analytics' },
        { label: 'Notifications', path: '/dashboard/notifications' }
      ]
    },
    {
      icon: <Settings size={20} />,
      label: 'Setup & Configuration',
      path: '/dashboard/setup',
      subItems: [
        { label: 'Store Setup', path: '/setup' },
        { label: 'Product Management', path: '/dashboard/setup/products' },
        { label: 'Product Pricing', path: '/dashboard/setup/pricing' },
        { label: 'Logistics & Shipping', path: '/dashboard/setup/logistics' },
        { label: 'IoT & Integration', path: '/dashboard/setup/iot' }
      ]
    },
    {
      icon: <Store size={20} />,
      label: 'Manage Stores',
      path: '/dashboard/stores',
      subItems: [
        { label: 'Branch Directory', path: '/dashboard/stores/branches' },
        { label: 'Add New Branch', path: '/dashboard/stores/add-branch' },
        { label: 'Employees', path: '/dashboard/stores/employees' },
        { label: 'Customers', path: '/dashboard/stores/customers' },
        { label: 'Asset Management', path: '/dashboard/stores/assets' },
      ]
    },
    {
      icon: <Users size={20} />,
      label: 'Users & Customers',
      path: '/dashboard/users',
      subItems: [
        { label: 'All Users', path: '/dashboard/users' },
        { label: 'Admins', path: '/dashboard/users?tab=admin' },
        { label: 'Storekeepers', path: '/dashboard/users?tab=storekeeper' },
        { label: 'Drivers', path: '/dashboard/users?tab=driver' },
        { label: 'Employees', path: '/dashboard/users?tab=employee' },
        { label: 'Corporate Clients', path: '/dashboard/users?tab=corporate' },
        { label: 'Individual Customers', path: '/dashboard/users?tab=individual' },
      ]
    },
    {
      icon: <Package size={20} />,
      label: 'Orders & Shipments',
      path: '/dashboard/orders',
      subItems: [
        { label: 'Order Management', path: '/dashboard/orders/management' },
        { label: 'Shipment Tracking', path: '/dashboard/orders/tracking' },
        { label: 'Delivery & Partners', path: '/dashboard/orders/delivery' },
        { label: 'Order History', path: '/dashboard/orders/history' },
        { label: 'Order Feedback', path: '/dashboard/orders/feedback' }
      ]
    },
    {
      icon: <DollarSign size={20} />,
      label: 'Finance',
      path: '/dashboard/finance',
      subItems: [
        { label: 'Overview', path: '/dashboard/finance' },
        { label: 'Transactions', path: '/dashboard/finance/transactions' },
        { label: 'Account Statement', path: '/dashboard/finance/statement' },
        { label: 'Invoices', path: '/dashboard/finance/invoices' },
        { label: 'Settings', path: '/dashboard/finance/settings' }
      ]
    },
    {
      icon: <BarChart2 size={20} />,
      label: 'Analytics & Reports',
      path: '/dashboard/analytics',
      subItems: [
        { label: 'Overview', path: '/dashboard/analytics' },
        { label: 'Sales Analytics', path: '/dashboard/analytics/sales' },
        { label: 'Product Performance', path: '/dashboard/analytics/products' },
        { label: 'Customer Insights', path: '/dashboard/analytics/customers' },
        { label: 'Market Analysis', path: '/dashboard/analytics/market' },
        { label: 'Logistics Reports', path: '/dashboard/analytics/logistics' }
      ]
    },
    {
      icon: <Gift size={20} />,
      label: 'Campaigns',
      path: '/dashboard/campaigns',
      subItems: [
        { label: 'Overview', path: '/dashboard/campaigns' },
        { label: 'Manage Promotions', path: '/dashboard/campaigns/promotions' },
        { label: 'Special Offers', path: '/dashboard/campaigns/offers' },
        { label: 'Loyalty Programs', path: '/dashboard/campaigns/loyalty' },
        { label: 'Campaign Analytics', path: '/dashboard/campaigns/analytics' }
      ]
    },
    {
      icon: <HelpCircle size={20} />,
      label: 'Settings & Support',
      path: '/dashboard/settings',
      subItems: [
        { label: 'User Preferences', path: '/dashboard/settings/preferences' },
        { label: 'Security', path: '/dashboard/settings/security' },
        { label: 'Subscription & Usage', path: '/dashboard/settings/subscription' },
        { label: 'Integrations', path: '/dashboard/settings/integrations' },
        { label: 'Support Center', path: '/dashboard/settings/support' },
        { label: 'Ticketing System', path: '/dashboard/settings/tickets' }
      ]
    },
    {
      icon: <PlusCircle size={20} />,
      label: 'Add-ons',
      path: '/dashboard/addons',
      subItems: [
        { label: 'Marketplace', path: '/dashboard/addons/marketplace' },
        { label: 'IoT Integration', path: '/dashboard/addons/iot' },
        { label: 'Fleet Management', path: '/dashboard/addons/fleet' },
        { label: 'EaaS Subscription', path: '/dashboard/addons/eaas' },
        { label: 'Energy Solutions', path: '/dashboard/addons/energy' }
      ]
    },
  ];

  const toggleMenuItem = (label: string) => {
    setExpandedMenuItem(expandedMenuItem === label ? null : label);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-white shadow-lg transition-all duration-300 ease-in-out overflow-y-auto border-r border-secondary-100`}
      >
        <div className="p-4 flex items-center justify-between border-b border-secondary-100">
          <div className="flex items-center">
            {companyLogo ? (
              <img 
                src={companyLogo}
                alt="Company Logo"
                className={`h-8 ${!isSidebarOpen && 'hidden'}`}
              />
            ) : company?.logo_url ? (
              <img 
                src={company.logo_url}
                alt={company.name}
                className={`h-8 ${!isSidebarOpen && 'hidden'}`}
              />
            ) : (
              <img 
                src="https://gasable.com/wp-content/uploads/2024/09/WhatsApp_Image_2024-09-04_at_2.08.02_PM-removebg-preview-300x86.png"
                alt="Gasable Logo"
                className={`h-8 ${!isSidebarOpen && 'hidden'}`}
              />
            )}
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-secondary-100 text-secondary-600"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        <nav className="mt-6 px-2">
          {menuItems.map((item, index) => (
            <div key={index} className="mb-2">
              <button
                onClick={() => toggleMenuItem(item.label)}
                className={`sidebar-link w-full ${
                  location.pathname === item.path ? 'active' : ''
                }`}
              >
                {item.icon}
                {isSidebarOpen && (
                  <span className="ml-3 font-medium">{item.label}</span>
                )}
                {isSidebarOpen && item.subItems && (
                  <span className={`ml-auto transform transition-transform duration-200 ${
                    expandedMenuItem === item.label ? 'rotate-180' : ''
                  }`}>
                    ▼
                  </span>
                )}
              </button>
              {isSidebarOpen && expandedMenuItem === item.label && item.subItems && (
                <div className="mt-2 ml-4 space-y-1">
                  {item.subItems.map((subItem, subIndex) => (
                    <Link
                      key={subIndex}
                      to={subItem.path}
                      className={`sidebar-link text-sm ${
                        location.pathname === subItem.path ? 'active' : ''
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current mr-3"></span>
                      {subItem.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-secondary-100">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-8">
              <div className="relative" ref={accountMenuRef}>
                <button
                  onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-secondary-50 text-secondary-700"
                >
                  <User size={20} />
                  <span>{user?.user_metadata?.full_name || user?.email || 'Manage Account'}</span>
                  <ChevronDown size={16} className={`transform transition-transform ${isAccountMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {isAccountMenuOpen && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-secondary-100 py-2 z-50">
                    <div className="px-4 py-3 border-b border-secondary-100">
                      <div className="flex items-center space-x-3">
                        <div className="relative group">
                          {companyLogo ? (
                            <img
                              src={companyLogo}
                              alt="Company Logo"
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
                              <Upload className="h-6 w-6 text-primary-600" />
                            </div>
                          )}
                          <label className="absolute inset-0 cursor-pointer group-hover:bg-black/10 rounded-lg transition-colors">
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleLogoUpload}
                            />
                          </label>
                        </div>
                        <div>
                          <p className="font-medium">{company?.name || 'Company Name'}</p>
                          <p className="text-xs text-secondary-500">{isDemoMode ? 'Demo Account' : 'Live Account'}</p>
                        </div>
                      </div>
                    </div>
                    <Link
                      to="/dashboard/settings/merchant-profile"
                      className="block px-4 py-2 hover:bg-secondary-50 text-secondary-700"
                      onClick={() => setIsAccountMenuOpen(false)}
                    >
                      Company Profile
                    </Link>
                    <Link
                      to="/dashboard/settings/subscription"
                      className="block px-4 py-2 hover:bg-secondary-50 text-secondary-700"
                      onClick={() => setIsAccountMenuOpen(false)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <CreditCard className="h-4 w-4 mr-2" />
                          <span>Subscription & Usage</span>
                        </div>
                        <span className="px-2 py-0.5 bg-primary-50 text-primary-600 rounded text-xs font-medium">
                          {company?.subscription_tier || 'Basic'}
                        </span>
                      </div>
                    </Link>
                    <Link
                      to="/dashboard/settings"
                      className="block px-4 py-2 hover:bg-secondary-50 text-secondary-700"
                      onClick={() => setIsAccountMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <div className="border-t border-secondary-100 mt-2 pt-2">
                      <button 
                        className="w-full px-4 py-2 text-left hover:bg-secondary-50 text-red-600"
                        onClick={handleSignOut}
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <h2 className="text-xl font-heading font-semibold text-secondary-900">Dashboard</h2>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/dashboard/settings/tickets" className="p-2 hover:bg-secondary-100 rounded-lg text-secondary-600 relative">
                <Ticket size={20} />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </Link>
              <Link to="/dashboard/notifications" className="p-2 hover:bg-secondary-100 rounded-lg text-secondary-600">
                <Bell size={20} />
              </Link>
              <button 
                className="btn-primary flex items-center space-x-2"
                onClick={handleSignOut}
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <SubscriptionBanner />
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;