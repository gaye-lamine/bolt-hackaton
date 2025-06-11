import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithEmail: (email: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  isConfigured: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signInWithEmail: async () => ({ error: null }),
  signOut: async () => ({ error: null }),
  isConfigured: false,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // If Supabase is not configured, stop loading immediately
    if (!isSupabaseConfigured) {
      console.warn('⚠️ Supabase not configured. Authentication will not work.');
      setLoading(false);
      setUser(null);
      setSession(null);
      setIsInitialized(true);
      return;
    }

    // Set a maximum loading time to prevent infinite loading
    const maxLoadingTimeout = setTimeout(() => {
      console.warn('Auth initialization timeout - stopping loading state');
      setLoading(false);
      setIsInitialized(true);
    }, 8000); // 8 seconds max

    // Clean up URL hash if it contains auth tokens to prevent URL parsing errors
    const cleanUpAuthHash = () => {
      const hash = window.location.hash;
      if (hash.includes('access_token=') || hash.includes('error=')) {
        // Clean the URL after a short delay to allow Supabase to process the auth
        setTimeout(() => {
          window.history.replaceState({}, document.title, window.location.pathname);
        }, 100);
      }
    };

    // Handle auth errors from URL hash
    const handleAuthError = () => {
      const hash = window.location.hash;
      if (hash.includes('error=')) {
        try {
          const urlParams = new URLSearchParams(hash.substring(1));
          const error = urlParams.get('error');
          const errorDescription = urlParams.get('error_description');
          
          if (error === 'access_denied' && errorDescription?.includes('expired')) {
            console.log('Le lien de connexion a expiré. Veuillez demander un nouveau lien.');
          }
        } catch (e) {
          console.warn('Error parsing auth hash:', e);
        }
        // Clean the error from URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    };

    handleAuthError();
    cleanUpAuthHash();

    // Get initial session with error handling and timeout
    const initializeAuth = async () => {
      try {
        // Add timeout to prevent infinite loading
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Auth timeout')), 5000)
        );

        const authPromise = supabase.auth.getSession();
        
        const { data: { session }, error } = await Promise.race([authPromise, timeoutPromise]) as any;
        
        if (error) {
          console.error('Error getting session:', error);
        } else {
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Even if there's an error, we should stop loading
        setSession(null);
        setUser(null);
      } finally {
        clearTimeout(maxLoadingTimeout);
        setLoading(false);
        setIsInitialized(true);
      }
    };

    initializeAuth();

    // Listen for auth changes with error handling
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        try {
          setSession(session);
          setUser(session?.user ?? null);
          
          // Clear the loading timeout since we got a response
          clearTimeout(maxLoadingTimeout);
          setLoading(false);
          setIsInitialized(true);

          // Handle successful sign in - ONLY redirect if we're not already on the target page
          if (event === 'SIGNED_IN' && session?.user && isInitialized) {
            // Prevent redirect loops by checking current location
            const currentPath = window.location.pathname;
            
            // Don't redirect if we're already on dashboard or onboarding
            if (currentPath === '/dashboard' || currentPath === '/onboarding') {
              return;
            }

            try {
              // Check if user has completed onboarding
              const { data: userProfile } = await supabase
                .from('users')
                .select('onboarding_completed')
                .eq('id', session.user.id)
                .single();

              // Only redirect if we're not already on the correct page
              if (userProfile?.onboarding_completed && currentPath !== '/dashboard') {
                setTimeout(() => {
                  window.location.href = '/dashboard';
                }, 1000);
              } else if (!userProfile?.onboarding_completed && currentPath !== '/onboarding') {
                setTimeout(() => {
                  window.location.href = '/onboarding';
                }, 1000);
              }
            } catch (dbError) {
              console.error('Error checking user profile:', dbError);
              // If there's a database error, only redirect if not already on onboarding
              if (currentPath !== '/onboarding') {
                setTimeout(() => {
                  window.location.href = '/onboarding';
                }, 1000);
              }
            }
          }
        } catch (error) {
          console.error('Error handling auth state change:', error);
          clearTimeout(maxLoadingTimeout);
          setLoading(false);
          setIsInitialized(true);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
      clearTimeout(maxLoadingTimeout);
    };
  }, [isInitialized]);

  const signInWithEmail = async (email: string) => {
    // Check if Supabase is configured
    if (!isSupabaseConfigured) {
      return { error: { message: 'Supabase configuration missing. Please contact support.' } };
    }

    try {
      // Determine the correct redirect URL based on environment
      let redirectTo = `${window.location.origin}/auth`;
      
      // If we're in production (Netlify), use the production URL
      if (window.location.hostname.includes('netlify.app')) {
        redirectTo = 'https://hackaton-bolt.netlify.app/auth';
      }
      
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectTo,
        },
      });
      return { error };
    } catch (error) {
      console.error('Error signing in:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (!error) {
        // Clear state immediately
        setUser(null);
        setSession(null);
        // Redirect to home
        window.location.href = '/';
      }
      return { error };
    } catch (error) {
      console.error('Error signing out:', error);
      return { error };
    }
  };

  const value = {
    user,
    session,
    loading,
    signInWithEmail,
    signOut,
    isConfigured: isSupabaseConfigured,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};