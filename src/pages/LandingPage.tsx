import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Truck,
  Globe,
  Users,
  Star,
  Package,
  Clock,
  Award,
  Shield,
  Zap,
  DollarSign,
  ChevronRight,
  CheckCircle,
  BarChart2,
  Settings,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  Check,
  X,
} from 'lucide-react';
import { useAuth } from '../lib/auth';
import DemoRegistrationModal from '../components/DemoRegistrationModal';

const LandingPage = () => {
  const navigate = useNavigate();
  const { setDemoMode } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isYearly, setIsYearly] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);

  const stats = [
    { icon: <Users className="h-6 w-6" />, number: '4,000+', label: 'Active Suppliers' },
    { icon: <Star className="h-6 w-6" />, number: '98%', label: 'Customer Satisfaction' },
    { icon: <Package className="h-6 w-6" />, number: '1M+', label: 'Orders Delivered' },
    { icon: <Globe className="h-6 w-6" />, number: '15+', label: 'Countries Served' },
    { icon: <Award className="h-6 w-6" />, number: '$500M+', label: 'Annual GMV' },
  ];

  const features = [
    {
      icon: <Globe className="h-8 w-8 text-primary-600" />,
      title: 'Global Market Access',
      description: 'Expand your reach across borders with our integrated marketplace platform. Access new markets and grow your customer base internationally.',
    },
    {
      icon: <BarChart2 className="h-8 w-8 text-primary-600" />,
      title: 'Smart Analytics',
      description: 'Make data-driven decisions with our advanced analytics suite. Track performance, understand market trends, and optimize your operations.',
    },
    {
      icon: <Shield className="h-8 w-8 text-primary-600" />,
      title: 'Secure Transactions',
      description: 'Benefit from our enterprise-grade security infrastructure. Every transaction is protected with state-of-the-art encryption and fraud prevention.',
    },
    {
      icon: <Zap className="h-8 w-8 text-primary-600" />,
      title: 'IoT Integration',
      description: 'Leverage cutting-edge IoT technology for real-time inventory tracking, automated reordering, and predictive maintenance.',
    },
    {
      icon: <DollarSign className="h-8 w-8 text-primary-600" />,
      title: 'Flexible Pricing',
      description: 'Choose from our range of pricing plans designed to fit businesses of all sizes. Scale your subscription as your business grows.',
    },
    {
      icon: <Settings className="h-8 w-8 text-primary-600" />,
      title: 'Easy Integration',
      description: 'Seamlessly integrate with your existing systems through our comprehensive API suite and dedicated technical support.',
    },
  ];

  const testimonials = [
    {
      quote: "Gasable has transformed our energy distribution business. The platform's efficiency and reach have helped us expand into three new markets within months.",
      author: "Mohammed Al-Rashid",
      position: "CEO, Gulf Energy Solutions",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    },
    {
      quote: "The IoT integration and real-time analytics have revolutionized how we manage our inventory and serve our customers. Truly a game-changer.",
      author: "Sarah Al-Mansour",
      position: "Operations Director, Saudi Gas Corp",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    },
  ];

  const benefits = [
    "Access to 4,000+ verified buyers",
    "Smart inventory management",
    "Real-time market analytics",
    "Automated order processing",
    "24/7 customer support",
    "Secure payment processing",
    "IoT device integration",
    "Custom reporting tools",
    "Marketing automation",
    "Multi-currency support",
    "Compliance management",
    "Training and onboarding",
  ];

  const energySectors = [
    {
      title: "Oil & Gas",
      description: "Complete solutions for oil and gas distribution, from wellhead to retail",
      image: "https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=800",
      stats: ["500+ Suppliers", "2M+ Orders", "$1.2B GMV"],
    },
    {
      title: "Renewable Energy",
      description: "Solar, wind, and sustainable energy equipment distribution",
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800", 
      stats: ["300+ Suppliers", "1M+ Orders", "$800M GMV"],
    },
    {
      title: "EV Infrastructure",
      description: "Electric vehicle charging and infrastructure solutions",
      image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800",
      stats: ["200+ Suppliers", "500K+ Orders", "$400M GMV"],
    },
    {
      title: "Hydrogen Solutions",
      description: "Next-generation hydrogen fuel and storage systems",
      image: "https://images.unsplash.com/photo-1622778455359-7eb80c0a33c9?w=800",
      stats: ["100+ Suppliers", "200K+ Orders", "$200M GMV"],
    }
  ];

  const subscriptionTiers = [
    {
      name: 'Free',
      price: isYearly ? 'Free' : 'Free',
      description: 'For small suppliers just getting started',
      features: [
        'B2C customers only',
        'Up to 3 products',
        '10 orders/month (max 500 SAR GMV)',
        'Domestic coverage only',
        '1 branch location',
        'Basic inventory management',
        'Standard support',
      ],
      limitations: [
        'No API access',
        'No analytics',
        'No marketing tools',
      ],
      cta: 'Start Free',
      popular: false,
    },
    {
      name: 'Basic',
      price: isYearly ? '8,100 SAR/year' : '750 SAR/month',
      description: 'For growing suppliers with established operations',
      features: [
        'B2C customers only',
        'Up to 5 products',
        '100 orders/month (max 5,000 SAR GMV)',
        'Domestic coverage only',
        'Up to 3 branch locations',
        'Basic inventory management',
        'Priority support',
        'Directory listing',
        'API access',
        'Basic analytics',
      ],
      limitations: [],
      cta: 'Subscribe',
      popular: false,
      monthlyPrice: 750,
      yearlyPrice: 8100,
      discount: '10%',
    },
    {
      name: 'Advanced',
      price: isYearly ? '15,840 SAR/year' : '1,500 SAR/month',
      description: 'For established suppliers looking to scale',
      features: [
        'B2B & B2C customers',
        'Up to 35 products',
        '500 orders/month (max 25,000 SAR GMV)',
        'Domestic + 1 international country',
        'Up to 7 branch locations',
        'Advanced inventory management',
        'Dedicated account manager',
        'Promotions & campaigns',
        'Advanced analytics',
        'Enhanced training',
      ],
      limitations: [],
      cta: 'Subscribe',
      popular: true,
      monthlyPrice: 1500,
      yearlyPrice: 15840,
      discount: '12%',
    },
    {
      name: 'Premium',
      price: 'Contact Us',
      description: 'For enterprise suppliers with complex needs',
      features: [
        'B2B, B2C & B2G customers',
        'Unlimited products',
        'Unlimited orders & GMV',
        'Global coverage',
        'Up to 100 branch locations',
        'Advanced inventory management',
        'Dedicated account manager',
        'Custom campaigns',
        'Full performance reports',
        'Complete training suite',
      ],
      limitations: [],
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  const handleDemoMode = () => {
    setShowDemoModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* Demo Registration Modal */}
      <DemoRegistrationModal 
        isOpen={showDemoModal} 
        onClose={() => setShowDemoModal(false)} 
      />

      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <img 
                src="https://gasable.com/wp-content/uploads/2024/09/WhatsApp_Image_2024-09-04_at_2.08.02_PM-removebg-preview-300x86.png"
                alt="Gasable Logo"
                className="h-10"
              />
            </div>
            <div className="flex items-center space-x-8">
              <a href="#features" className="text-secondary-600 hover:text-primary-600">Features</a>
              <a href="#benefits" className="text-secondary-600 hover:text-primary-600">Benefits</a>
              <a href="#pricing" className="text-secondary-600 hover:text-primary-600">Pricing</a>
              <a href="#contact" className="text-secondary-600 hover:text-primary-600">Contact</a>
              <Link to="/signin" className="text-secondary-600 hover:text-primary-600">Sign In</Link>
              <Link
                to="/signup"
                className="btn-primary"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581094288338-2314dddb7ece?q=80&w=2070')] bg-cover bg-center opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-heading font-bold text-secondary-900 leading-tight mb-6">
              Transform Your Energy Business with
              <span className="text-primary-600 block">Smart Distribution</span>
            </h1>
            <p className="text-xl text-secondary-600 leading-relaxed mb-8">
              Join the Middle East's first AI-powered energy marketplace. Connect with verified buyers, optimize operations with IoT integration, and scale your business globally.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={handleDemoMode}
                className="btn-primary text-lg px-8 py-4 shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30 transition-all"
              >
                Try Demo Account
              </button>
              <Link
                to="/signup"
                className="px-8 py-4 text-lg font-medium text-primary-700 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
              >
                Start Free Trial
              </Link>
            </div>
            <p className="mt-4 text-sm text-secondary-500">No credit card required • Full access to all features • Cancel anytime</p>
          </motion.div>

          {/* Stats Section */}
          <motion.div 
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            initial="hidden"
            animate="show"
            className="mt-20 grid grid-cols-5 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 }
                }}
                className="bg-white/80 backdrop-blur rounded-xl p-6 text-center shadow-lg shadow-primary-500/5"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-primary-50 text-primary-600 rounded-full">
                  {stat.icon}
                </div>
                <h3 className="text-2xl font-bold text-primary-600 mb-1">{stat.number}</h3>
                <p className="text-secondary-600 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Energy Sectors */}
      <div className="py-24 bg-gradient-to-b from-white to-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-heading font-bold text-secondary-900 mb-4">
              Powering Every Energy Sector
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Comprehensive solutions for all energy verticals, from traditional fuels to next-generation power sources.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-8">
            {energySectors.map((sector, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative group overflow-hidden rounded-2xl shadow-xl"
              >
                <div className="aspect-video relative">
                  <img
                    src={sector.image}
                    alt={sector.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">{sector.title}</h3>
                    <p className="text-white/80 mb-4">{sector.description}</p>
                    <div className="flex space-x-4">
                      {sector.stats.map((stat, i) => (
                        <div key={i} className="bg-white/10 px-3 py-1 rounded-full text-sm">
                          {stat}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-heading font-bold text-secondary-900 mb-4">
              Everything You Need to Scale Your Energy Business
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Our comprehensive platform provides all the tools and features you need to streamline operations, increase efficiency, and drive growth.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-xl shadow-lg shadow-primary-500/5 hover:shadow-xl hover:shadow-primary-500/10 border border-secondary-100 hover:border-primary-200 transition-all"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-heading font-semibold text-secondary-900 mb-2">{feature.title}</h3>
                <p className="text-secondary-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-heading font-bold text-secondary-900 mb-4">
              Transparent Pricing for Every Business Size
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Choose the plan that fits your business needs. Scale as you grow with our flexible subscription options.
            </p>
            
            <div className="flex items-center justify-center mt-8 space-x-4">
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
                Yearly <span className="text-sm text-green-600">(Save up to 12%)</span>
              </span>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {subscriptionTiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative rounded-xl border ${
                  tier.popular
                    ? 'border-primary-500 shadow-xl'
                    : 'border-gray-200 shadow-lg'
                } bg-white overflow-hidden`}
              >
                {tier.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-primary-500 text-white text-center py-1 text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <div className={`p-6 ${tier.popular ? 'pt-10' : ''}`}>
                  <h3 className="text-xl font-bold text-secondary-900 mb-2">{tier.name}</h3>
                  <div className="mb-4">
                    <div className="text-3xl font-bold text-primary-600">{tier.price}</div>
                    <p className="text-sm text-secondary-600 mt-1">{tier.description}</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedPlan(tier.name);
                      if (tier.name === 'Free') {
                        handleDemoMode();
                      } else {
                        setShowPaymentModal(true);
                      }
                    }}
                    className={`w-full py-2 px-4 rounded-lg font-medium mb-6 ${
                      tier.popular
                        ? 'bg-primary-600 text-white hover:bg-primary-700'
                        : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                    } transition-colors`}
                  >
                    {tier.cta}
                  </button>
                  <div className="space-y-3">
                    {tier.features.map((feature, i) => (
                      <div key={i} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-secondary-700">{feature}</span>
                      </div>
                    ))}
                    {tier.limitations && tier.limitations.map((limitation, i) => (
                      <div key={i} className="flex items-start">
                        <X className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-secondary-500">{limitation}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div id="benefits" className="py-24 bg-gradient-to-b from-primary-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-heading font-bold text-secondary-900 mb-6">
                Why Choose Gasable?
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-2"
                  >
                    <CheckCircle className="h-5 w-5 text-primary-600" />
                    <span className="text-secondary-700">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1581092162384-8987c1d64926?w=800"
                alt="Energy Distribution"
                className="rounded-xl shadow-2xl"
              />
              <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-xl shadow-xl">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <BarChart2 className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">+156%</div>
                    <div className="text-sm text-secondary-600">Average Growth</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-heading font-bold text-center text-secondary-900 mb-16">
            Trusted by Industry Leaders
          </h2>
          <div className="grid grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-secondary-50 p-8 rounded-xl relative"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.author}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-secondary-900">{testimonial.author}</h3>
                    <p className="text-secondary-600">{testimonial.position}</p>
                  </div>
                </div>
                <p className="text-lg text-secondary-700 italic">"{testimonial.quote}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-heading font-bold mb-6">
            Ready to Transform Your Energy Business?
          </h2>
          <p className="text-xl text-primary-100 mb-10">
            Join 4,000+ suppliers already growing with Gasable
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleDemoMode}
              className="inline-block px-8 py-4 text-lg font-medium bg-white text-primary-900 rounded-lg hover:bg-primary-50 transition-colors"
            >
              Try Demo Account
            </button>
            <Link
              to="/signup"
              className="inline-block px-8 py-4 text-lg font-medium border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              Start Free Trial
            </Link>
          </div>
          <p className="mt-4 text-primary-200">Set up your account in less than 5 minutes</p>
        </div>
      </div>

      {/* Contact Section */}
      <div id="contact" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-heading font-bold text-secondary-900 mb-6">
                Get in Touch
              </h2>
              <p className="text-secondary-600 mb-8">
                Have questions about our platform? Our team is here to help you get started.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-primary-50 rounded-lg">
                    <Phone className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <div className="font-medium text-secondary-900">Call Us</div>
                    <div className="text-secondary-600">+966-920005469</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-primary-50 rounded-lg">
                    <Mail className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <div className="font-medium text-secondary-900">Email Us</div>
                    <div className="text-secondary-600">support@gasable.com</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-primary-50 rounded-lg">
                    <MapPin className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <div className="font-medium text-secondary-900">Visit Us</div>
                    <div className="text-secondary-600">Riyadh, Saudi Arabia</div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Message
                  </label>
                  <textarea
                    className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 h-32"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>
                <button type="submit" className="btn-primary w-full">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-secondary-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-4 gap-12">
            <div className="col-span-1">
              <img 
                src="https://gasable.com/wp-content/uploads/2024/09/WhatsApp_Image_2024-09-04_at_2.08.02_PM-removebg-preview-300x86.png"
                alt="Gasable Logo"
                className="h-8 mb-6 brightness-200"
              />
              <p className="text-secondary-400 mb-6">Your Sustainable Energy Partner™</p>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Globe className="h-5 w-5 text-primary-500" />
                  <span className="text-secondary-300">Operating in 15+ countries</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-primary-500" />
                  <span className="text-secondary-300">4,000+ active suppliers</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-primary-500" />
                  <span className="text-secondary-300">98% customer satisfaction</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-heading font-semibold mb-4">Platform</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#features" className="text-secondary-400 hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-secondary-400 hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-secondary-400 hover:text-white transition-colors">
                    API Documentation
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-heading font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-secondary-400 hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-secondary-400 hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-secondary-400 hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-heading font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-secondary-400 hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-secondary-400 hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-secondary-400 hover:text-white transition-colors">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-secondary-800">
            <div className="flex items-center justify-between">
              <div className="text-secondary-400">
                © 2025 Gasable. All rights reserved.
              </div>
              <div className="flex space-x-6">
                <a href="#" className="text-secondary-400 hover:text-white transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-secondary-400 hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-secondary-400 hover:text-white transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Complete Your Subscription</h2>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="p-2 hover:bg-secondary-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-6">
              <h3 className="font-medium text-lg mb-2">Selected Plan: {selectedPlan}</h3>
              <p className="text-secondary-600">
                {selectedPlan === 'Basic' ? (
                  isYearly ? 'Annual billing at 8,100 SAR/year' : 'Monthly billing at 750 SAR/month'
                ) : selectedPlan === 'Advanced' ? (
                  isYearly ? 'Annual billing at 15,840 SAR/year' : 'Monthly billing at 1,500 SAR/month'
                ) : selectedPlan === 'Free' ? (
                  'Free plan with limited features'
                ) : (
                  'Our sales team will contact you with a custom quote'
                )}
              </p>
            </div>

            {selectedPlan !== 'Free' && selectedPlan !== 'Premium' && (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="1234 5678 9012 3456"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      CVC
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="123"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="John Smith"
                  />
                </div>
              </div>
            )}

            {selectedPlan === 'Free' && (
              <div className="mb-6">
                <p className="text-secondary-600">
                  You're signing up for our Free plan. No payment information is required.
                </p>
              </div>
            )}

            {selectedPlan === 'Premium' && (
              <div className="mb-6">
                <p className="text-secondary-600">
                  Our sales team will contact you shortly to discuss your specific requirements and provide a custom quote.
                </p>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2 text-secondary-700 hover:bg-secondary-100 rounded-lg"
              >
                Cancel
              </button>
              <Link
                to="/signup"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                {selectedPlan === 'Free' ? 'Create Account' : 
                 selectedPlan === 'Premium' ? 'Request Quote' : 'Complete Payment'}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;