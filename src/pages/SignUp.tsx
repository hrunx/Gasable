import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Truck, AlertCircle } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';

const SignUp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signUp, isDemoMode } = useAuth();
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFromDemo, setIsFromDemo] = useState(false);

  // Check if user is coming from demo mode
  useEffect(() => {
    // Check if we have a demoEmail in query params or local storage
    const params = new URLSearchParams(location.search);
    const demoEmail = params.get('demoEmail') || localStorage.getItem('demo_email');
    
    if (demoEmail) {
      setFormData(prev => ({ ...prev, email: demoEmail }));
      setIsFromDemo(true);
    } else if (isDemoMode) {
      // If user is in demo mode, get their email from auth context
      const fetchDemoUser = async () => {
        const { data } = await supabase.auth.getUser();
        const demoUserEmail = data?.user?.user_metadata?.demo_email;
        if (demoUserEmail) {
          setFormData(prev => ({ ...prev, email: demoUserEmail }));
          setIsFromDemo(true);
        }
      };
      
      fetchDemoUser();
    }
  }, [location, isDemoMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await signUp(
        formData.email, 
        formData.password, 
        { 
          full_name: formData.companyName,
          company_name: formData.companyName,
          role: 'supplier',
          // Track that this user converted from demo if applicable
          converted_from_demo: isFromDemo
        }
      );
      
      const { error, user, needsConfirmation } = result;
      
      if (error) {
        // Check for specific error codes
        if (error.message === 'User already registered') {
          throw new Error('An account with this email already exists. Please sign in instead.');
        }
        
        // If it's an email confirmation message, treat it as success
        if (error.message.includes('Account created successfully')) {
          setSuccess(true);
          // Clear any demo data from localStorage
          localStorage.removeItem('demo_email');
          
          // Redirect to sign in page after a delay with a message
          setTimeout(() => {
            navigate('/signin?message=Please check your email to confirm your account');
          }, 3000);
          return;
        }
        
        throw error;
      }
      
      // If the user converted from demo, track this conversion
      if (isFromDemo && user) {
        try {
          // Call our conversion tracking function
          await supabase.rpc('track_demo_user_conversion', {
            p_demo_email: formData.email,
            p_user_id: user.id
          });
        } catch (conversionError) {
          // Log but don't block the user
          console.error('Error tracking demo conversion:', conversionError);
        }
      }
      
      // Show success message
      setSuccess(true);
      
      // Clear any demo data from localStorage
      localStorage.removeItem('demo_email');
      
      // If user needs email confirmation, redirect to sign in
      if (needsConfirmation) {
        console.log("User created but needs email confirmation");
        setTimeout(() => {
          navigate('/signin?message=Account created! Please check your email to confirm your account, then sign in.');
        }, 3000);
      } else if (user) {
        // If user is fully authenticated, go to dashboard
        console.log("User registered and authenticated successfully");
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        // Fallback to sign in page
        setTimeout(() => {
          navigate('/signin');
        }, 2000);
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      setError(error.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Truck className="h-12 w-12 text-primary-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/signin" className="font-medium text-primary-600 hover:text-primary-500">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}
          
          {success && (
            <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-green-500 mr-2" />
                <p className="text-green-700">Account created successfully! Redirecting...</p>
              </div>
            </div>
          )}
          
          <div className="mb-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Development Note:</strong> Email confirmation is currently enabled. 
                  After creating your account, you may need to check your email for a confirmation link, 
                  or contact the administrator to manually confirm your account.
                </p>
              </div>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                Company Name
              </label>
              <div className="mt-1">
                <input
                  id="company"
                  name="company"
                  type="text"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || success}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/signin"
                className="w-full flex justify-center py-2 px-4 border border-primary-300 rounded-md shadow-sm text-sm font-medium text-primary-700 bg-white hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Sign in instead
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;