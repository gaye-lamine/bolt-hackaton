import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Landing } from './pages/Landing';
import { Auth } from './pages/Auth';
import { Onboarding } from './pages/Onboarding';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';
import { Services } from './pages/Services';
import { Clients } from './pages/Clients';
import { AICoach } from './pages/AICoach';
import { Analytics } from './pages/Analytics';
import { UserProfile } from './pages/UserProfile';
import { Premium } from './pages/Premium';
import { isSupabaseConfigured } from './lib/supabase';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, isConfigured } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-neutral-600 dark:text-neutral-300">Chargement...</p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
            Si cette page ne se charge pas, vérifiez votre configuration Supabase
          </p>
        </div>
      </div>
    );
  }

  // If Supabase is not configured, redirect to landing page
  if (!isConfigured) {
    return <Navigate to="/" replace />;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

// Configuration Check Component
const ConfigurationCheck: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-6">
          <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-orange-600 dark:text-orange-400 text-2xl">⚠️</span>
          </div>
          
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-4">
            Configuration requise
          </h1>
          
          <p className="text-neutral-600 dark:text-neutral-300 mb-6">
            Pour utiliser NOMAD AI, vous devez configurer Supabase. Veuillez ajouter vos clés d'API dans le fichier .env :
          </p>
          
          <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-4 text-left text-sm font-mono">
            <div className="text-neutral-800 dark:text-neutral-200">
              VITE_SUPABASE_URL=votre-url-supabase<br/>
              VITE_SUPABASE_ANON_KEY=votre-clé-anon
            </div>
          </div>
          
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-4">
            Redémarrez l'application après avoir ajouté la configuration.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// Main App Routes
const AppRoutes: React.FC = () => {
  const { user, loading, isConfigured } = useAuth();

  // Show loading while checking auth state (only if Supabase is configured)
  // Add a timeout to prevent infinite loading
  if (loading && isConfigured) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-neutral-600 dark:text-neutral-300">Vérification de l'authentification...</p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
            Cela ne devrait prendre que quelques secondes
          </p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Landing />} />
      <Route path="/auth" element={user ? <Navigate to="/dashboard" replace /> : <Auth />} />
      <Route path="/profile/:username" element={<Profile />} />

      {/* Protected Routes */}
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/services"
        element={
          <ProtectedRoute>
            <Services />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clients"
        element={
          <ProtectedRoute>
            <Clients />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai-coach"
        element={
          <ProtectedRoute>
            <AICoach />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/premium"
        element={
          <ProtectedRoute>
            <Premium />
          </ProtectedRoute>
        }
      />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// Main App Component
function App() {
  useEffect(() => {
    // Check if we're not in StackBlitz environment before registering service worker
    const isStackBlitz = window.location.hostname.includes('stackblitz') || 
                        window.location.hostname.includes('webcontainer');
    
    if (!isStackBlitz && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(console.error);
    }

    // Handle install prompt (only if not in StackBlitz)
    if (!isStackBlitz) {
      let deferredPrompt: any;
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        
        // Show install button or banner
        const installButton = document.getElementById('install-app');
        if (installButton) {
          installButton.style.display = 'block';
          installButton.addEventListener('click', () => {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult: any) => {
              if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
              }
              deferredPrompt = null;
            });
          });
        }
      });
    }
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 transition-colors">
            <ConfigurationCheck>
              <AppRoutes />
            </ConfigurationCheck>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;