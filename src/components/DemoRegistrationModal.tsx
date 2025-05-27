import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Mail, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';

interface DemoRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DemoRegistrationModal: React.FC<DemoRegistrationModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { setDemoMode } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    fullName: ''
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate email
    if (!formData.email || !formData.email.includes('@')) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      // Register the demo user in our database
      const { data, error: dbError } = await supabase.rpc(
        'track_demo_user_signup',
        { 
          p_email: formData.email,
          p_full_name: formData.fullName || null,
          p_metadata: { 
            user_agent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            referrer: document.referrer
          }
        }
      );

      if (dbError) {
        throw dbError;
      }

      // Enable demo mode with this email
      setDemoMode(true, {
        email: formData.email,
        fullName: formData.fullName
      });

      // Store demo email in localStorage for conversion tracking
      localStorage.setItem('demo_email', formData.email);

      // Close modal and navigate to dashboard
      onClose();
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Error in demo registration:', err);
      setError(err.message || 'Failed to create demo session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
        
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Try Demo Mode</h2>
          <p className="text-gray-600 mt-1">
            Experience all features without creating an account
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-3 rounded">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name (optional)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Your name"
                className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Start Demo Experience'}
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center mt-4">
            By continuing, you agree to our <a href="#" className="text-primary-600 hover:underline">Terms of Service</a> and <a href="#" className="text-primary-600 hover:underline">Privacy Policy</a>.
          </p>
        </form>
      </div>
    </div>
  );
};

export default DemoRegistrationModal; 