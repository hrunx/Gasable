import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  PlusCircle,
  Globe,
  Truck,
  Cpu,
  BarChart2,
  Zap,
  CheckCircle,
  AlertCircle,
  Clock,
  Download,
  Copy,
  ExternalLink,
  ChevronRight,
  Settings,
  Layout,
  Grid,
  List,
  Sliders,
  Languages,
  RefreshCw,
  Code,
  Layers,
  Shield,
  Database,
  Server,
  Smartphone,
  Tablet,
  Monitor,
  Tag,
  Star,
  Package,
  Clock as ClockIcon,
  Palette,
  Eye,
  EyeOff,
  ToggleLeft,
  ToggleRight,
  Search,
  Filter,
  ArrowRight,
  HelpCircle,
  Info,
  MessageSquare,
  X,
  Check,
  ChevronDown,
  ChevronUp,
  Wifi,
  Repeat,
  BarChart,
  PieChart,
  TrendingUp,
  Users,
  FileText,
  Clipboard,
  Paperclip,
  Upload,
  Save,
  Play,
  Pause,
  Trash2,
  Edit,
  Lock,
  Unlock,
  Key,
  QrCode,
  Link,
  Link2,
  Unlink,
  Share2,
  Shuffle,
  Bookmark,
  Award,
  ThumbsUp,
  DollarSign,
  CreditCard,
  ShoppingCart,
  ShoppingBag,
  Gift,
  Percent,
  Headphones,
  MessageCircle,
  LifeBuoy,
  Lightbulb,
  Wrench,
  Tool,
  Hammer,
  Briefcase,
  Codesandbox,
  Box,
  Boxes,
  Aperture,
  Compass,
  Map,
  Navigation,
  Anchor,
  GitBranch,
  GitCommit,
  GitMerge,
  GitPullRequest,
  Gitlab,
  GitHub,
  Figma,
  Framer,
  Codepen,
  Codesandbox as CodesandboxIcon,
  Chrome,
  Firefox,
  Safari,
  Edge,
  Slack,
  Trello,
  Jira,
  Notion,
  Airtable,
  Dropbox,
  Dribbble,
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  Youtube,
  Twitch,
  Snapchat,
  Tiktok,
  Whatsapp,
  Telegram,
  Discord,
  Skype,
  Zoom,
  Mic,
  Video,
  Camera,
  Music,
  Film,
  Image,
  FileImage,
  FileText as FileTextIcon,
  FilePlus,
  FileMinus,
  FileCheck,
  FileX,
  FileSearch,
  FileQuestion,
  FileCode,
  FileDigit,
  FileArchive,
  FileAudio,
  FileVideo,
  FileSignature,
  FileSymlink,
  FileTerminal,
  FileWarning,
  FileOutput,
  FileInput,
  FileJson,
  FileXml,
  FileCss,
  FileHtml,
  FileJsx,
  FileTsx,
  FileJs,
  FileTs,
  FileMd,
  FileSvg,
  FilePng,
  FileJpg,
  FileGif,
  FilePdf,
  FileZip,
  FileWord,
  FileExcel,
  FilePowerpoint,
  FileDatabase,
  FileServer,
  FileCloud,
  FileDownload,
  FileUpload,
  FileEdit,
  FileRemove,
  FileAdd,
  FileQuestion as FileQuestionIcon,
  FileWarning as FileWarningIcon,
  FileX as FileXIcon,
  FileCheck as FileCheckIcon,
  FileSearch as FileSearchIcon,
  FileCode as FileCodeIcon,
  FileText as FileTextIconAlt,
  FileImage as FileImageIcon,
  FileVideo as FileVideoIcon,
  FileAudio as FileAudioIcon,
  FileArchive as FileArchiveIcon,
  FileTerminal as FileTerminalIcon,
  FileSignature as FileSignatureIcon,
  FileSymlink as FileSymlinkIcon,
  FileOutput as FileOutputIcon,
  FileInput as FileInputIcon,
  FileJson as FileJsonIcon,
  FileXml as FileXmlIcon,
  FileCss as FileCssIcon,
  FileHtml as FileHtmlIcon,
  FileJsx as FileJsxIcon,
  FileTsx as FileTsxIcon,
  FileJs as FileJsIcon,
  FileTs as FileTsIcon,
  FileMd as FileMdIcon,
  FileSvg as FileSvgIcon,
  FilePng as FilePngIcon,
  FileJpg as FileJpgIcon,
  FileGif as FileGifIcon,
  FilePdf as FilePdfIcon,
  FileZip as FileZipIcon,
  FileWord as FileWordIcon,
  FileExcel as FileExcelIcon,
  FilePowerpoint as FilePowerPointIcon,
  FileDatabase as FileDatabaseIcon,
  FileServer as FileServerIcon,
  FileCloud as FileCloudIcon,
  FileDownload as FileDownloadIcon,
  FileUpload as FileUploadIcon,
  FileEdit as FileEditIcon,
  FileRemove as FileRemoveIcon,
  FileAdd as FileAddIcon,
} from 'lucide-react';

interface Addon {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'integration' | 'analytics' | 'marketing' | 'operations' | 'iot' | 'other';
  status: 'available' | 'installed' | 'coming_soon';
  price: {
    free: boolean;
    amount?: number;
    billingCycle?: 'monthly' | 'yearly' | 'one_time';
  };
  rating: number;
  reviews: number;
  features: string[];
  requirements?: string[];
  lastUpdated: string;
  version?: string;
  developer: string;
  developerUrl?: string;
  detailedDescription?: string;
  screenshots?: string[];
  demoUrl?: string;
  documentationUrl?: string;
  supportUrl?: string;
  faq?: {
    question: string;
    answer: string;
  }[];
}

interface WebIntegrationSettings {
  apiKey: string;
  domain: string;
  verificationStatus: 'pending' | 'verified' | 'failed';
  embedCode: string;
  shortcode: string;
  layout: 'grid' | 'list' | 'carousel';
  showTags: boolean;
  showRatings: boolean;
  showInventory: boolean;
  showDeliveryEta: boolean;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    textColor: string;
    backgroundColor: string;
  };
  language: 'en' | 'ar';
  syncOptions: {
    syncAll: boolean;
    selectedCategories: string[];
    selectedProducts: string[];
    autoSync: boolean;
    syncInterval: number;
  };
  analytics: {
    views: number;
    clicks: number;
    conversions: number;
    conversionRate: number;
  };
}

const mockAddons: Addon[] = [
  {
    id: 'web-integration',
    name: 'Web Integration',
    description: 'Embed your Gasable store on your own website',
    icon: <Globe className="h-6 w-6" />,
    category: 'integration',
    status: 'available',
    price: {
      free: true,
    },
    rating: 4.8,
    reviews: 156,
    features: [
      'WordPress Plugin Integration',
      'Custom Domain Presentation',
      'Product Catalog Widget',
      'Widget Customization Options',
      'Live Sync & Management',
      'Tracking & Analytics'
    ],
    requirements: [
      'WordPress 5.0+',
      'PHP 7.4+',
      'Active Gasable account'
    ],
    lastUpdated: '2024-03-15',
    version: '1.2.0',
    developer: 'Gasable',
    developerUrl: 'https://gasable.com',
    detailedDescription: 'This Add-on allows suppliers on Gasable to seamlessly embed their Gasable store or product catalog on their own website, especially WordPress-powered sites. It\'s a no-code, plug-and-play plugin that reflects real-time product updates, availability, and pricing directly from their Gasable dashboard. This enables multi-channel selling, improved visibility, and a consistent brand experience across all platforms.',
    screenshots: [
      'https://images.unsplash.com/photo-1517292987719-0369a794ec0f?w=800',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800'
    ],
    demoUrl: 'https://demo.gasable.com/web-integration',
    documentationUrl: 'https://docs.gasable.com/addons/web-integration',
    supportUrl: 'https://support.gasable.com/addons/web-integration',
    faq: [
      {
        question: 'How do I install the WordPress plugin?',
        answer: 'You can install the plugin directly from your WordPress dashboard. Go to Plugins > Add New, search for "Gasable Store", and click Install Now.'
      },
      {
        question: 'Can I customize the appearance of the embedded store?',
        answer: 'Yes, you can customize the layout, colors, and display options to match your website\'s branding.'
      },
      {
        question: 'Do I need technical knowledge to use this add-on?',
        answer: 'No, the add-on is designed to be user-friendly with a simple setup wizard and no coding required.'
      }
    ]
  },
  {
    id: 'fleet-management',
    name: 'Fleet Management',
    description: 'Track and manage your delivery fleet in real-time',
    icon: <Truck className="h-6 w-6" />,
    category: 'operations',
    status: 'available',
    price: {
      free: false,
      amount: 99,
      billingCycle: 'monthly',
    },
    rating: 4.6,
    reviews: 89,
    features: [
      'Real-time vehicle tracking',
      'Driver management',
      'Route optimization',
      'Maintenance scheduling',
      'Fuel consumption analytics',
      'Delivery performance metrics'
    ],
    lastUpdated: '2024-03-10',
    version: '2.1.0',
    developer: 'Gasable',
    developerUrl: 'https://gasable.com',
  },
  {
    id: 'iot-integration',
    name: 'IoT Integration',
    description: 'Connect and monitor your IoT devices',
    icon: <Cpu className="h-6 w-6" />,
    category: 'iot',
    status: 'installed',
    price: {
      free: false,
      amount: 149,
      billingCycle: 'monthly',
    },
    rating: 4.7,
    reviews: 112,
    features: [
      'Device management',
      'Real-time monitoring',
      'Automated alerts',
      'Data visualization',
      'Predictive maintenance',
      'Integration with major IoT platforms'
    ],
    lastUpdated: '2024-03-05',
    version: '1.5.0',
    developer: 'Gasable',
    developerUrl: 'https://gasable.com',
  },
  {
    id: 'advanced-analytics',
    name: 'Advanced Analytics',
    description: 'Gain deeper insights into your business performance',
    icon: <BarChart2 className="h-6 w-6" />,
    category: 'analytics',
    status: 'available',
    price: {
      free: false,
      amount: 79,
      billingCycle: 'monthly',
    },
    rating: 4.9,
    reviews: 203,
    features: [
      'Custom dashboards',
      'Advanced reporting',
      'Predictive analytics',
      'Customer segmentation',
      'Export capabilities',
      'Scheduled reports'
    ],
    lastUpdated: '2024-02-28',
    version: '3.0.0',
    developer: 'Gasable',
    developerUrl: 'https://gasable.com',
  },
  {
    id: 'eaas-subscription',
    name: 'EaaS Subscription',
    description: 'Energy-as-a-Service subscription management',
    icon: <Zap className="h-6 w-6" />,
    category: 'operations',
    status: 'coming_soon',
    price: {
      free: false,
      amount: 199,
      billingCycle: 'monthly',
    },
    rating: 0,
    reviews: 0,
    features: [
      'Subscription billing',
      'Customer portal',
      'Usage-based pricing',
      'Automated renewals',
      'Flexible pricing models',
      'Revenue analytics'
    ],
    lastUpdated: 'Coming Soon',
    developer: 'Gasable',
    developerUrl: 'https://gasable.com',
  }
];

const AddonsMarketplace = () => {
  const [activeTab, setActiveTab] = useState<'marketplace' | 'installed' | 'details'>('marketplace');
  const [selectedAddon, setSelectedAddon] = useState<Addon | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isInstalling, setIsInstalling] = useState(false);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [isGeneratingApiKey, setIsGeneratingApiKey] = useState(false);
  const [webIntegrationSettings, setWebIntegrationSettings] = useState<WebIntegrationSettings>({
    apiKey: '',
    domain: '',
    verificationStatus: 'pending',
    embedCode: '',
    shortcode: '',
    layout: 'grid',
    showTags: true,
    showRatings: true,
    showInventory: false,
    showDeliveryEta: true,
    theme: {
      primaryColor: '#0EA5E9',
      secondaryColor: '#6366F1',
      textColor: '#1E293B',
      backgroundColor: '#FFFFFF',
    },
    language: 'en',
    syncOptions: {
      syncAll: true,
      selectedCategories: [],
      selectedProducts: [],
      autoSync: true,
      syncInterval: 15,
    },
    analytics: {
      views: 0,
      clicks: 0,
      conversions: 0,
      conversionRate: 0,
    },
  });

  const handleInstallAddon = (addon: Addon) => {
    setIsInstalling(true);
    
    // Simulate installation process
    setTimeout(() => {
      setIsInstalling(false);
      
      // If it's the web integration addon, show configuration modal
      if (addon.id === 'web-integration') {
        setIsConfiguring(true);
      } else {
        alert(`${addon.name} has been installed successfully!`);
      }
    }, 2000);
  };

  const handleGenerateApiKey = () => {
    setIsGeneratingApiKey(true);
    
    // Simulate API key generation
    setTimeout(() => {
      setIsGeneratingApiKey(false);
      setWebIntegrationSettings({
        ...webIntegrationSettings,
        apiKey: 'gas_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
        embedCode: `<div id="gasable-store" data-api-key="${webIntegrationSettings.apiKey}" data-layout="${webIntegrationSettings.layout}"></div><script src="https://cdn.gasable.com/embed.js"></script>`,
        shortcode: '[gasable_store layout="grid" show_tags="true" show_ratings="true"]',
      });
    }, 1500);
  };

  const handleVerifyDomain = () => {
    if (!webIntegrationSettings.domain) {
      alert('Please enter a domain first');
      return;
    }
    
    // Simulate domain verification
    setTimeout(() => {
      setWebIntegrationSettings({
        ...webIntegrationSettings,
        verificationStatus: 'verified',
      });
    }, 1500);
  };

  const handleSaveSettings = () => {
    alert('Settings saved successfully!');
    setIsConfiguring(false);
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const filteredAddons = mockAddons.filter(addon => {
    if (filterCategory !== 'all' && addon.category !== filterCategory) {
      return false;
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        addon.name.toLowerCase().includes(query) ||
        addon.description.toLowerCase().includes(query) ||
        addon.features.some(feature => feature.toLowerCase().includes(query))
      );
    }
    
    return true;
  });

  const installedAddons = mockAddons.filter(addon => addon.status === 'installed');

  const renderMarketplace = () => (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search add-ons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
        >
          <option value="all">All Categories</option>
          <option value="integration">Integration</option>
          <option value="analytics">Analytics</option>
          <option value="marketing">Marketing</option>
          <option value="operations">Operations</option>
          <option value="iot">IoT</option>
          <option value="other">Other</option>
        </select>
        <button className="p-2 hover:bg-secondary-100 rounded-lg text-secondary-600">
          <Filter className="h-5 w-5" />
        </button>
      </div>

      {/* Featured Add-on */}
      <div 
        className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-8 text-white cursor-pointer"
        onClick={() => {
          setSelectedAddon(mockAddons.find(addon => addon.id === 'web-integration') || null);
          setActiveTab('details');
        }}
      >
        <div className="flex items-start justify-between">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-white/20 rounded-lg">
                <Globe className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Web Integration</h2>
                <p className="text-primary-100">Sell Everywhere. Stay in Control.</p>
              </div>
            </div>
            <p className="max-w-2xl">
              Seamlessly embed your Gasable store on your own website. This no-code solution 
              reflects real-time product updates, availability, and pricing directly from your 
              Gasable dashboard.
            </p>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-1">
                <Star className="h-5 w-5 text-yellow-300 fill-current" />
                <span>4.8 (156 reviews)</span>
              </div>
              <div className="flex items-center space-x-1">
                <Tag className="h-5 w-5" />
                <span>Free</span>
              </div>
            </div>
          </div>
          <button className="px-6 py-3 bg-white text-primary-600 rounded-lg hover:bg-primary-50 transition-colors flex items-center space-x-2">
            <span>Learn More</span>
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Add-ons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredAddons.map((addon) => (
          <motion.div
            key={addon.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl border border-secondary-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => {
              setSelectedAddon(addon);
              setActiveTab('details');
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg ${
                  addon.category === 'integration' ? 'bg-blue-50 text-blue-600' :
                  addon.category === 'analytics' ? 'bg-purple-50 text-purple-600' :
                  addon.category === 'marketing' ? 'bg-pink-50 text-pink-600' :
                  addon.category === 'operations' ? 'bg-green-50 text-green-600' :
                  addon.category === 'iot' ? 'bg-yellow-50 text-yellow-600' :
                  'bg-gray-50 text-gray-600'
                }`}>
                  {addon.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{addon.name}</h3>
                  <p className="text-sm text-secondary-600 capitalize">{addon.category.replace('_', ' ')}</p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs ${
                addon.status === 'installed' ? 'bg-green-50 text-green-700' :
                addon.status === 'coming_soon' ? 'bg-yellow-50 text-yellow-700' :
                'bg-blue-50 text-blue-700'
              }`}>
                {addon.status === 'installed' ? 'Installed' :
                 addon.status === 'coming_soon' ? 'Coming Soon' :
                 'Available'}
              </div>
            </div>
            <p className="text-secondary-600 mb-4">{addon.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm">{addon.rating} ({addon.reviews})</span>
              </div>
              <div className="text-sm font-medium">
                {addon.price.free ? 'Free' : `$${addon.price.amount}/${addon.price.billingCycle?.charAt(0)}`}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderInstalledAddons = () => (
    <div className="space-y-6">
      {installedAddons.length === 0 ? (
        <div className="bg-white p-8 rounded-xl border border-secondary-200 text-center">
          <Cpu className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-secondary-900 mb-2">No add-ons installed</h3>
          <p className="text-secondary-600 mb-6">
            Enhance your Gasable experience by installing add-ons from the marketplace
          </p>
          <button
            onClick={() => setActiveTab('marketplace')}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Browse Marketplace
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {installedAddons.map((addon) => (
            <div
              key={addon.id}
              className="bg-white p-6 rounded-xl border border-secondary-200 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg ${
                    addon.category === 'integration' ? 'bg-blue-50 text-blue-600' :
                    addon.category === 'analytics' ? 'bg-purple-50 text-purple-600' :
                    addon.category === 'marketing' ? 'bg-pink-50 text-pink-600' :
                    addon.category === 'operations' ? 'bg-green-50 text-green-600' :
                    addon.category === 'iot' ? 'bg-yellow-50 text-yellow-600' :
                    'bg-gray-50 text-gray-600'
                  }`}>
                    {addon.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{addon.name}</h3>
                    <p className="text-sm text-secondary-600">Version {addon.version}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedAddon(addon);
                      setActiveTab('details');
                    }}
                    className="px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => {
                      if (addon.id === 'iot-integration') {
                        window.location.href = '/dashboard/setup/iot';
                      } else if (addon.id === 'web-integration') {
                        setIsConfiguring(true);
                      }
                    }}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Configure
                  </button>
                </div>
              </div>
              
              {addon.id === 'iot-integration' && (
                <div className="mt-6 p-4 bg-secondary-50 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Connected Devices</h4>
                    <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">3 Active</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Wifi className="h-4 w-4 text-green-500" />
                        <span>Gas Level Sensor #1</span>
                      </div>
                      <span className="text-sm text-secondary-600">Last sync: 2 minutes ago</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Wifi className="h-4 w-4 text-green-500" />
                        <span>Flow Meter #2</span>
                      </div>
                      <span className="text-sm text-secondary-600">Last sync: 5 minutes ago</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Wifi className="h-4 w-4 text-red-500" />
                        <span>Smart Valve #3</span>
                      </div>
                      <span className="text-sm text-secondary-600">Last sync: 15 minutes ago</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderAddonDetails = () => {
    if (!selectedAddon) return null;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <button
            onClick={() => setActiveTab('marketplace')}
            className="px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors flex items-center space-x-2"
          >
            <ArrowRight className="h-5 w-5 transform rotate-180" />
            <span>Back to Marketplace</span>
          </button>
          {selectedAddon.status === 'available' ? (
            <button
              onClick={() => handleInstallAddon(selectedAddon)}
              disabled={selectedAddon.status === 'coming_soon' || isInstalling}
              className={`px-6 py-2 rounded-lg ${
                selectedAddon.status === 'coming_soon'
                  ? 'bg-secondary-100 text-secondary-500 cursor-not-allowed'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              } transition-colors flex items-center space-x-2`}
            >
              {isInstalling ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  <span>Installing...</span>
                </>
              ) : (
                <>
                  <PlusCircle className="h-5 w-5" />
                  <span>{selectedAddon.status === 'coming_soon' ? 'Coming Soon' : 'Install Add-on'}</span>
                </>
              )}
            </button>
          ) : selectedAddon.status === 'installed' ? (
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  if (selectedAddon.id === 'iot-integration') {
                    window.location.href = '/dashboard/setup/iot';
                  } else if (selectedAddon.id === 'web-integration') {
                    setIsConfiguring(true);
                  }
                }}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Configure
              </button>
              <button
                onClick={() => alert('Add-on uninstalled successfully!')}
                className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              >
                Uninstall
              </button>
            </div>
          ) : (
            <button
              disabled
              className="px-6 py-2 bg-yellow-500 text-white rounded-lg flex items-center space-x-2"
            >
              <Clock className="h-5 w-5" />
              <span>Coming Soon</span>
            </button>
          )}
        </div>

        {/* Add-on Details */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
          <div className="flex items-start space-x-4 mb-6">
            <div className={`p-4 rounded-lg ${
              selectedAddon.category === 'integration' ? 'bg-blue-50 text-blue-600' :
              selectedAddon.category === 'analytics' ? 'bg-purple-50 text-purple-600' :
              selectedAddon.category === 'marketing' ? 'bg-pink-50 text-pink-600' :
              selectedAddon.category === 'operations' ? 'bg-green-50 text-green-600' :
              selectedAddon.category === 'iot' ? 'bg-yellow-50 text-yellow-600' :
              'bg-gray-50 text-gray-600'
            }`}>
              {selectedAddon.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">{selectedAddon.name}</h2>
                <div className={`px-3 py-1 rounded-full text-sm ${
                  selectedAddon.status === 'installed' ? 'bg-green-50 text-green-700' :
                  selectedAddon.status === 'coming_soon' ? 'bg-yellow-50 text-yellow-700' :
                  'bg-blue-50 text-blue-700'
                }`}>
                  {selectedAddon.status === 'installed' ? 'Installed' :
                   selectedAddon.status === 'coming_soon' ? 'Coming Soon' :
                   'Available'}
                </div>
              </div>
              <p className="text-secondary-600 mt-1">{selectedAddon.description}</p>
              <div className="flex items-center space-x-6 mt-2">
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span>{selectedAddon.rating} ({selectedAddon.reviews} reviews)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Tag className="h-5 w-5 text-secondary-400" />
                  <span>{selectedAddon.price.free ? 'Free' : `$${selectedAddon.price.amount}/${selectedAddon.price.billingCycle?.charAt(0)}`}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <RefreshCw className="h-5 w-5 text-secondary-400" />
                  <span>Updated: {selectedAddon.lastUpdated}</span>
                </div>
                {selectedAddon.version && (
                  <div className="flex items-center space-x-1">
                    <Tag className="h-5 w-5 text-secondary-400" />
                    <span>v{selectedAddon.version}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-secondary-100 mb-6">
            <div className="flex space-x-6">
              <button className="px-4 py-2 border-b-2 border-primary-500 text-primary-600 font-medium">
                Overview
              </button>
              <button className="px-4 py-2 text-secondary-600 hover:text-secondary-900">
                Reviews
              </button>
              <button className="px-4 py-2 text-secondary-600 hover:text-secondary-900">
                Support
              </button>
              <button className="px-4 py-2 text-secondary-600 hover:text-secondary-900">
                FAQ
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="grid grid-cols-3 gap-8">
            <div className="col-span-2 space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Description</h3>
                <p className="text-secondary-600">
                  {selectedAddon.detailedDescription || selectedAddon.description}
                </p>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Key Features</h3>
                <ul className="space-y-2">
                  {selectedAddon.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Screenshots */}
              {selectedAddon.screenshots && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Screenshots</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedAddon.screenshots.map((screenshot, index) => (
                      <img
                        key={index}
                        src={screenshot}
                        alt={`${selectedAddon.name} Screenshot ${index + 1}`}
                        className="rounded-lg border border-secondary-200"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* FAQ */}
              {selectedAddon.faq && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Frequently Asked Questions</h3>
                  <div className="space-y-4">
                    {selectedAddon.faq.map((item, index) => (
                      <div key={index} className="border border-secondary-200 rounded-lg overflow-hidden">
                        <div className="p-4 bg-secondary-50 font-medium">
                          {item.question}
                        </div>
                        <div className="p-4 border-t border-secondary-200">
                          {item.answer}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {/* Sidebar */}
              <div className="bg-secondary-50 p-6 rounded-lg border border-secondary-200">
                <h3 className="font-semibold mb-4">Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Developer</span>
                    <a
                      href={selectedAddon.developerUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700"
                    >
                      {selectedAddon.developer}
                    </a>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Version</span>
                    <span>{selectedAddon.version || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Last Updated</span>
                    <span>{selectedAddon.lastUpdated}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Category</span>
                    <span className="capitalize">{selectedAddon.category.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>

              {/* Requirements */}
              {selectedAddon.requirements && (
                <div className="bg-secondary-50 p-6 rounded-lg border border-secondary-200">
                  <h3 className="font-semibold mb-4">Requirements</h3>
                  <ul className="space-y-2">
                    {selectedAddon.requirements.map((req, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Links */}
              <div className="bg-secondary-50 p-6 rounded-lg border border-secondary-200">
                <h3 className="font-semibold mb-4">Resources</h3>
                <div className="space-y-3">
                  {selectedAddon.demoUrl && (
                    <a
                      href={selectedAddon.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-primary-600 hover:text-primary-700"
                    >
                      <ExternalLink className="h-5 w-5 mr-2" />
                      <span>View Demo</span>
                    </a>
                  )}
                  {selectedAddon.documentationUrl && (
                    <a
                      href={selectedAddon.documentationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-primary-600 hover:text-primary-700"
                    >
                      <FileText className="h-5 w-5 mr-2" />
                      <span>Documentation</span>
                    </a>
                  )}
                  {selectedAddon.supportUrl && (
                    <a
                      href={selectedAddon.supportUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-primary-600 hover:text-primary-700"
                    >
                      <LifeBuoy className="h-5 w-5 mr-2" />
                      <span>Get Support</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderWebIntegrationConfig = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Web Integration Setup</h2>
          <button
            onClick={() => setIsConfiguring(false)}
            className="p-2 hover:bg-secondary-100 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-8">
          {/* Step 1: Generate API Key */}
          <div className="p-6 bg-secondary-50 rounded-xl border border-secondary-200">
            <h3 className="text-lg font-semibold mb-4">Step 1: Generate API Key & Script</h3>
            <div className="space-y-4">
              {!webIntegrationSettings.apiKey ? (
                <button
                  onClick={handleGenerateApiKey}
                  disabled={isGeneratingApiKey}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
                >
                  {isGeneratingApiKey ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Key className="h-5 w-5" />
                      <span>Generate API Key</span>
                    </>
                  )}
                </button>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      API Key
                    </label>
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={webIntegrationSettings.apiKey}
                        readOnly
                        className="flex-1 px-4 py-2 border border-secondary-200 rounded-l-lg bg-secondary-50"
                      />
                      <button
                        onClick={() => handleCopyToClipboard(webIntegrationSettings.apiKey)}
                        className="px-4 py-2 bg-secondary-200 text-secondary-700 rounded-r-lg hover:bg-secondary-300 transition-colors"
                      >
                        <Copy className="h-5 w-5" />
                      </button>
                    </div>
                    <p className="text-xs text-secondary-500 mt-1">
                      Keep this key secure. It provides access to your store data.
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Embed Code
                    </label>
                    <div className="flex items-center">
                      <textarea
                        value={webIntegrationSettings.embedCode}
                        readOnly
                        className="flex-1 px-4 py-2 border border-secondary-200 rounded-l-lg bg-secondary-50 h-24"
                      />
                      <button
                        onClick={() => handleCopyToClipboard(webIntegrationSettings.embedCode)}
                        className="px-4 py-[2.65rem] bg-secondary-200 text-secondary-700 rounded-r-lg hover:bg-secondary-300 transition-colors"
                      >
                        <Copy className="h-5 w-5" />
                      </button>
                    </div>
                    <p className="text-xs text-secondary-500 mt-1">
                      Add this code to any HTML page where you want your store to appear.
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      WordPress Shortcode
                    </label>
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={webIntegrationSettings.shortcode}
                        readOnly
                        className="flex-1 px-4 py-2 border border-secondary-200 rounded-l-lg bg-secondary-50"
                      />
                      <button
                        onClick={() => handleCopyToClipboard(webIntegrationSettings.shortcode)}
                        className="px-4 py-2 bg-secondary-200 text-secondary-700 rounded-r-lg hover:bg-secondary-300 transition-colors"
                      >
                        <Copy className="h-5 w-5" />
                      </button>
                    </div>
                    <p className="text-xs text-secondary-500 mt-1">
                      Use this shortcode in WordPress pages or posts after installing the plugin.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Step 2: Domain Verification */}
          <div className="p-6 bg-secondary-50 rounded-xl border border-secondary-200">
            <h3 className="text-lg font-semibold mb-4">Step 2: Domain Verification</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Your Website Domain
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={webIntegrationSettings.domain}
                    onChange={(e) => setWebIntegrationSettings({
                      ...webIntegrationSettings,
                      domain: e.target.value
                    })}
                    placeholder="e.g., mywebsite.com or shop.mywebsite.com"
                    className="flex-1 px-4 py-2 border border-secondary-200 rounded-lg"
                  />
                  <button
                    onClick={handleVerifyDomain}
                    disabled={!webIntegrationSettings.domain}
                    className="ml-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Verify
                  </button>
                </div>
                <p className="text-xs text-secondary-500 mt-1">
                  Enter the domain where you'll embed your Gasable store.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                {webIntegrationSettings.verificationStatus === 'pending' ? (
                  <Clock className="h-5 w-5 text-yellow-500" />
                ) : webIntegrationSettings.verificationStatus === 'verified' ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
                <span className={`${
                  webIntegrationSettings.verificationStatus === 'pending' ? 'text-yellow-700' :
                  webIntegrationSettings.verificationStatus === 'verified' ? 'text-green-700' :
                  'text-red-700'
                }`}>
                  {webIntegrationSettings.verificationStatus === 'pending' ? 'Pending verification' :
                   webIntegrationSettings.verificationStatus === 'verified' ? 'Domain verified successfully' :
                   'Verification failed'}
                </span>
              </div>

              {webIntegrationSettings.verificationStatus === 'verified' && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Domain Verified</span>
                  </div>
                  <p className="text-sm">
                    Your domain has been successfully verified. You can now embed your Gasable store on your website.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Step 3: Widget Customization */}
          <div className="p-6 bg-secondary-50 rounded-xl border border-secondary-200">
            <h3 className="text-lg font-semibold mb-4">Step 3: Widget Customization</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Layout
                  </label>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setWebIntegrationSettings({
                        ...webIntegrationSettings,
                        layout: 'grid'
                      })}
                      className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                        webIntegrationSettings.layout === 'grid'
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-secondary-200 hover:border-primary-200 text-secondary-700'
                      }`}
                    >
                      <Grid className="h-5 w-5 mx-auto mb-1" />
                      <span className="text-sm">Grid</span>
                    </button>
                    <button
                      onClick={() => setWebIntegrationSettings({
                        ...webIntegrationSettings,
                        layout: 'list'
                      })}
                      className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                        webIntegrationSettings.layout === 'list'
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-secondary-200 hover:border-primary-200 text-secondary-700'
                      }`}
                    >
                      <List className="h-5 w-5 mx-auto mb-1" />
                      <span className="text-sm">List</span>
                    </button>
                    <button
                      onClick={() => setWebIntegrationSettings({
                        ...webIntegrationSettings,
                        layout: 'carousel'
                      })}
                      className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                        webIntegrationSettings.layout === 'carousel'
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-secondary-200 hover:border-primary-200 text-secondary-700'
                      }`}
                    >
                      <Sliders className="h-5 w-5 mx-auto mb-1" />
                      <span className="text-sm">Carousel</span>
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Language
                  </label>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setWebIntegrationSettings({
                        ...webIntegrationSettings,
                        language: 'en'
                      })}
                      className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                        webIntegrationSettings.language === 'en'
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-secondary-200 hover:border-primary-200 text-secondary-700'
                      }`}
                    >
                      <span className="text-sm">English</span>
                    </button>
                    <button
                      onClick={() => setWebIntegrationSettings({
                        ...webIntegrationSettings,
                        language: 'ar'
                      })}
                      className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                        webIntegrationSettings.language === 'ar'
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-secondary-200 hover:border-primary-200 text-secondary-700'
                      }`}
                    >
                      <span className="text-sm">Arabic</span>
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-3">
                  Display Options
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center space-x-2 p-3 border border-secondary-200 rounded-lg">
                    <input
                      type="checkbox"
                      checked={webIntegrationSettings.showTags}
                      onChange={(e) => setWebIntegrationSettings({
                        ...webIntegrationSettings,
                        showTags: e.target.checked
                      })}
                      className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                    />
                    <div>
                      <span className="font-medium">Show Product Tags</span>
                      <p className="text-xs text-secondary-500">Display category and type tags</p>
                    </div>
                  </label>
                  <label className="flex items-center space-x-2 p-3 border border-secondary-200 rounded-lg">
                    <input
                      type="checkbox"
                      checked={webIntegrationSettings.showRatings}
                      onChange={(e) => setWebIntegrationSettings({
                        ...webIntegrationSettings,
                        showRatings: e.target.checked
                      })}
                      className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                    />
                    <div>
                      <span className="font-medium">Show Ratings</span>
                      <p className="text-xs text-secondary-500">Display product ratings and reviews</p>
                    </div>
                  </label>
                  <label className="flex items-center space-x-2 p-3 border border-secondary-200 rounded-lg">
                    <input
                      type="checkbox"
                      checked={webIntegrationSettings.showInventory}
                      onChange={(e) => setWebIntegrationSettings({
                        ...webIntegrationSettings,
                        showInventory: e.target.checked
                      })}
                      className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                    />
                    <div>
                      <span className="font-medium">Show Inventory</span>
                      <p className="text-xs text-secondary-500">Display stock levels</p>
                    </div>
                  </label>
                  <label className="flex items-center space-x-2 p-3 border border-secondary-200 rounded-lg">
                    <input
                      type="checkbox"
                      checked={webIntegrationSettings.showDeliveryEta}
                      onChange={(e) => setWebIntegrationSettings({
                        ...webIntegrationSettings,
                        showDeliveryEta: e.target.checked
                      })}
                      className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                    />
                    <div>
                      <span className="font-medium">Show Delivery ETA</span>
                      <p className="text-xs text-secondary-500">Display estimated delivery times</p>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-3">
                  Theme Colors
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-secondary-600 mb-1">
                      Primary Color
                    </label>
                    <div className="flex items-center">
                      <input
                        type="color"
                        value={webIntegrationSettings.theme.primaryColor}
                        onChange={(e) => setWebIntegrationSettings({
                          ...webIntegrationSettings,
                          theme: {
                            ...webIntegrationSettings.theme,
                            primaryColor: e.target.value
                          }
                        })}
                        className="w-10 h-10 rounded-lg border border-secondary-200 p-1"
                      />
                      <input
                        type="text"
                        value={webIntegrationSettings.theme.primaryColor}
                        onChange={(e) => setWebIntegrationSettings({
                          ...webIntegrationSettings,
                          theme: {
                            ...webIntegrationSettings.theme,
                            primaryColor: e.target.value
                          }
                        })}
                        className="flex-1 ml-2 px-4 py-2 border border-secondary-200 rounded-lg"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-secondary-600 mb-1">
                      Secondary Color
                    </label>
                    <div className="flex items-center">
                      <input
                        type="color"
                        value={webIntegrationSettings.theme.secondaryColor}
                        onChange={(e) => setWebIntegrationSettings({
                          ...webIntegrationSettings,
                          theme: {
                            ...webIntegrationSettings.theme,
                            secondaryColor: e.target.value
                          }
                        })}
                        className="w-10 h-10 rounded-lg border border-secondary-200 p-1"
                      />
                      <input
                        type="text"
                        value={webIntegrationSettings.theme.secondaryColor}
                        onChange={(e) => setWebIntegrationSettings({
                          ...webIntegrationSettings,
                          theme: {
                            ...webIntegrationSettings.theme,
                            secondaryColor: e.target.value
                          }
                        })}
                        className="flex-1 ml-2 px-4 py-2 border border-secondary-200 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4: Sync Options */}
          <div className="p-6 bg-secondary-50 rounded-xl border border-secondary-200">
            <h3 className="text-lg font-semibold mb-4">Step 4: Sync Options</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-secondary-200">
                <div className="flex items-center space-x-3">
                  <RefreshCw className="h-5 w-5 text-primary-600" />
                  <div>
                    <h4 className="font-medium">Auto-Sync</h4>
                    <p className="text-sm text-secondary-600">Automatically sync product changes</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={webIntegrationSettings.syncOptions.autoSync}
                    onChange={(e) => setWebIntegrationSettings({
                      ...webIntegrationSettings,
                      syncOptions: {
                        ...webIntegrationSettings.syncOptions,
                        autoSync: e.target.checked
                      }
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-secondary-200">
                <div className="flex items-center space-x-3">
                  <Package className="h-5 w-5 text-primary-600" />
                  <div>
                    <h4 className="font-medium">Sync All Products</h4>
                    <p className="text-sm text-secondary-600">Include all products in your store</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={webIntegrationSettings.syncOptions.syncAll}
                    onChange={(e) => setWebIntegrationSettings({
                      ...webIntegrationSettings,
                      syncOptions: {
                        ...webIntegrationSettings.syncOptions,
                        syncAll: e.target.checked
                      }
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              {!webIntegrationSettings.syncOptions.syncAll && (
                <div className="p-4 bg-white rounded-lg border border-secondary-200">
                  <h4 className="font-medium mb-3">Select Categories to Sync</h4>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                      />
                      <span>Industrial Gas</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                      />
                      <span>Residential Gas</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                      />
                      <span>Equipment</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                      />
                      <span>Accessories</span>
                    </label>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-secondary-200">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-primary-600" />
                  <div>
                    <h4 className="font-medium">Sync Interval</h4>
                    <p className="text-sm text-secondary-600">How often to check for updates</p>
                  </div>
                </div>
                <select
                  value={webIntegrationSettings.syncOptions.syncInterval}
                  onChange={(e) => setWebIntegrationSettings({
                    ...webIntegrationSettings,
                    syncOptions: {
                      ...webIntegrationSettings.syncOptions,
                      syncInterval: parseInt(e.target.value)
                    }
                  })}
                  className="px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value={5}>Every 5 minutes</option>
                  <option value={15}>Every 15 minutes</option>
                  <option value={30}>Every 30 minutes</option>
                  <option value={60}>Every hour</option>
                </select>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={() => alert('Manual sync completed successfully!')}
                  className="px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors flex items-center space-x-2"
                >
                  <RefreshCw className="h-5 w-5" />
                  <span>Sync Now</span>
                </button>
              </div>
            </div>
          </div>

          {/* Step 5: Analytics */}
          <div className="p-6 bg-secondary-50 rounded-xl border border-secondary-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Step 5: Tracking & Analytics</h3>
              <button className="px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors flex items-center space-x-2">
                <Download className="h-5 w-5" />
                <span>Export Report</span>
              </button>
            </div>
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-white rounded-lg border border-secondary-200">
                <h4 className="text-sm text-secondary-600 mb-1">Views</h4>
                <div className="text-2xl font-bold">{webIntegrationSettings.analytics.views}</div>
              </div>
              <div className="p-4 bg-white rounded-lg border border-secondary-200">
                <h4 className="text-sm text-secondary-600 mb-1">Clicks</h4>
                <div className="text-2xl font-bold">{webIntegrationSettings.analytics.clicks}</div>
              </div>
              <div className="p-4 bg-white rounded-lg border border-secondary-200">
                <h4 className="text-sm text-secondary-600 mb-1">Conversions</h4>
                <div className="text-2xl font-bold">{webIntegrationSettings.analytics.conversions}</div>
              </div>
              <div className="p-4 bg-white rounded-lg border border-secondary-200">
                <h4 className="text-sm text-secondary-600 mb-1">Conversion Rate</h4>
                <div className="text-2xl font-bold">{webIntegrationSettings.analytics.conversionRate}%</div>
              </div>
            </div>
            <div className="p-4 bg-white rounded-lg border border-secondary-200 text-center">
              <BarChart className="h-8 w-8 text-secondary-400 mx-auto mb-2" />
              <p className="text-secondary-600">
                Analytics data will appear here once your store is embedded and receiving traffic.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setIsConfiguring(false)}
              className="px-4 py-2 text-secondary-700 hover:bg-secondary-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveSettings}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
            >
              <Save className="h-5 w-5" />
              <span>Save Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900 mb-2">
              🧩 Add-ons Marketplace
            </h1>
            <p className="text-secondary-600">
              Enhance your Gasable experience with powerful add-ons and integrations
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors flex items-center space-x-2">
              <HelpCircle className="h-5 w-5" />
              <span>Help</span>
            </button>
            <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2">
              <RefreshCw className="h-5 w-5" />
              <span>Check for Updates</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 border-b border-secondary-100">
          <button
            onClick={() => setActiveTab('marketplace')}
            className={`px-4 py-2 ${
              activeTab === 'marketplace'
                ? 'border-b-2 border-primary-500 text-primary-600 font-medium'
                : 'text-secondary-600 hover:text-secondary-900'
            }`}
          >
            Marketplace
          </button>
          <button
            onClick={() => setActiveTab('installed')}
            className={`px-4 py-2 ${
              activeTab === 'installed'
                ? 'border-b-2 border-primary-500 text-primary-600 font-medium'
                : 'text-secondary-600 hover:text-secondary-900'
            }`}
          >
            Installed Add-ons
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'marketplace' && renderMarketplace()}
      {activeTab === 'installed' && renderInstalledAddons()}
      {activeTab === 'details' && renderAddonDetails()}

      {/* Web Integration Configuration Modal */}
      {isConfiguring && renderWebIntegrationConfig()}
    </div>
  );
};

export default AddonsMarketplace;