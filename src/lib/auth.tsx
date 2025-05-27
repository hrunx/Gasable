import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData: Record<string, any>) => Promise<{ error: any, user: User | null, needsConfirmation?: boolean }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updatePassword: (password: string) => Promise<{ error: any }>;
  setDemoMode: (isDemoMode: boolean, userData?: DemoUserData) => void;
  isDemoMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface DemoUserData {
  email?: string;
  fullName?: string;
  metadata?: Record<string, any>;
}

// Helper function to generate UUIDs properly
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Create a demo user session with mock data
const createDemoUser = (userData?: DemoUserData) => {
  const demoUserId = generateUUID();
  const demoCompanyId = generateUUID();
  
  // Create mock user
  const mockUser: User = {
    id: demoUserId,
    app_metadata: {},
    user_metadata: {
      full_name: userData?.fullName || 'Demo User',
      company_name: 'Demo Company',
      company_id: demoCompanyId,
      role: 'supplier',
      demo_user: true,
      // Store original email for tracking
      demo_email: userData?.email || 'demo@example.com',
    },
    aud: 'authenticated',
    created_at: new Date().toISOString(),
    email: userData?.email || 'demo@example.com',
    role: 'authenticated',
    email_confirmed_at: new Date().toISOString(),
    phone: '',
    confirmed_at: new Date().toISOString(),
    last_sign_in_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    identities: []
  };
  
  // Create mock session
  const mockSession: Session = {
    access_token: `demo-token-${Date.now()}`,
    refresh_token: `demo-refresh-${Date.now()}`,
    expires_in: 86400, // 24 hours
    expires_at: Math.floor(Date.now() / 1000) + 86400,
    token_type: 'bearer',
    user: mockUser
  };
  
  return { user: mockUser, session: mockSession };
};

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoModeState] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('demo_mode') === 'true';
    }
    return false;
  });

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        // Check if we're in demo mode first
        if (isDemoMode) {
          const localSession = localStorage.getItem('supabase.auth.token');
          if (localSession) {
            try {
              const parsedSession = JSON.parse(localSession);
              if (parsedSession && parsedSession.currentSession) {
                setSession(parsedSession.currentSession);
                setUser(parsedSession.currentSession.user);
                setLoading(false);
                return;
              }
            } catch (e) {
              console.error("Error parsing local session:", e);
            }
          }
        }
        
        // Get Supabase session
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
      } catch (e) {
        console.error("Error getting initial session:", e);
      }
      setLoading(false);
    };

    getInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe?.();
    };
  }, [isDemoMode]);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      // If sign in is successful, refresh the session to get the latest claims
      if (!error && data.session) {
        const { data: refreshData } = await supabase.auth.refreshSession();
        setSession(refreshData.session);
        setUser(refreshData.session?.user ?? null);
      }
      
      return { error };
    } catch (err) {
      console.error("Error during sign in:", err);
      return { error: err as Error };
    }
  };

  const signUp = async (email: string, password: string, userData: Record<string, any>) => {
    try {
      // Default role is 'supplier' if not specified
      const role = userData.role || 'supplier';
      
      // Validate password length
      if (password.length < 6) {
        return { 
          error: { message: "Password should be at least 6 characters." }, 
          user: null 
        };
      }

      // Use Supabase Auth for signup
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.full_name || userData.companyName || email.split('@')[0],
            company_name: userData.company_name || userData.companyName,
            role: role,
            converted_from_demo: userData.converted_from_demo || false
          }
        }
      });

      if (error) {
        // If it's an email confirmation error, provide a helpful message
        if (error.message.includes('confirmation email') || error.message.includes('email')) {
          return { 
            error: { 
              message: "Account created successfully! Please check your email to confirm your account, or contact support if you don't receive the email." 
            }, 
            user: data?.user || null 
          };
        }
        return { error, user: null };
      }

      // If user is created but not confirmed, still return success
      if (data.user && !data.user.email_confirmed_at) {
        console.log("User created but email not confirmed yet");
        return { 
          error: null, 
          user: data.user,
          needsConfirmation: true 
        };
      }

      return { error: null, user: data.user };
    } catch (err: any) {
      console.error("Error during signup:", err);
      return { error: err, user: null };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('demo_mode');
      localStorage.removeItem('supabase.auth.token');
    }
    setIsDemoModeState(false);
    setUser(null);
    setSession(null);
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    return { error };
  };

  const updatePassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password });
    return { error };
  };

  const setDemoMode = (isDemo: boolean, userData?: DemoUserData) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('demo_mode', isDemo.toString());
    }
    setIsDemoModeState(isDemo);
    
    // If enabling demo mode, create a demo user
    if (isDemo && !user) {
      const { user: demoUser, session: demoSession } = createDemoUser(userData);
      setUser(demoUser);
      setSession(demoSession);
      
      // Store in localStorage for persistence
      if (typeof window !== 'undefined') {
        localStorage.setItem('supabase.auth.token', JSON.stringify({
          currentSession: demoSession,
          expiresAt: demoSession.expires_at
        }));
      }
    }
  };

  const providerValue: AuthContextType = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    setDemoMode,
    isDemoMode,
  };

  return (
    <AuthContext.Provider value={providerValue}>
      {children}
    </AuthContext.Provider>
  );
}

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { useAuth, AuthProvider };