import React, { useState, useEffect } from 'react';
import { Mail, ArrowLeft, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/UI/Button';
import { Input } from '../components/UI/Input';
import { Card } from '../components/UI/Card';
import { isSupabaseConfigured } from '../lib/supabase';

export const Auth = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const { signInWithEmail, isConfigured, user } = useAuth();

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (user) {
      window.location.href = '/dashboard';
      return;
    }

    // Check for auth success in URL
    const hash = window.location.hash;
    if (hash.includes('access_token=')) {
      // Auth was successful, show success message
      setSent(true);
      setError('');
      // Clean the URL
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    // Check for auth errors in URL
    if (hash.includes('error=')) {
      const urlParams = new URLSearchParams(hash.substring(1));
      const error = urlParams.get('error');
      const errorDescription = urlParams.get('error_description');
      
      if (error === 'access_denied' && errorDescription?.includes('expired')) {
        setError('Le lien de connexion a expiré. Veuillez demander un nouveau lien.');
      } else {
        setError('Erreur de connexion. Veuillez réessayer.');
      }
      // Clear the error from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || cooldown > 0) return;

    // Check if Supabase is configured
    if (!isConfigured) {
      setError('Configuration Supabase manquante. Veuillez contacter le support.');
      return;
    }

    setLoading(true);
    setError('');

    const { error } = await signInWithEmail(email);
    
    if (error) {
      if (error.message?.includes('rate_limit')) {
        setError('Veuillez attendre quelques secondes avant de demander un nouveau lien');
        // Start cooldown timer
        setCooldown(5);
        const timer = setInterval(() => {
          setCooldown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else if (error.message?.includes('configuration')) {
        setError('Configuration Supabase manquante. Veuillez contacter le support.');
      } else {
        setError('Erreur lors de l\'envoi du lien de connexion');
      }
    } else {
      setSent(true);
    }
    
    setLoading(false);
  };

  // Show configuration warning if Supabase is not configured
  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
        <Card className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="text-orange-600 dark:text-orange-400" size={32} />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Configuration requise
          </h1>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Supabase n'est pas configuré. L'authentification ne peut pas fonctionner sans la configuration appropriée.
          </p>
          
          <Link to="/">
            <Button variant="outline" className="w-full">
              <ArrowLeft size={16} className="mr-2" />
              Retour à l'accueil
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
        <Card className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-white" size={32} />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Email envoyé !
          </h1>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Un lien de connexion a été envoyé à <strong>{email}</strong>. 
            Cliquez sur le lien dans votre email pour vous connecter.
          </p>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <AlertCircle className="text-blue-500 mr-3 mt-0.5" size={20} />
              <div className="text-left">
                <p className="text-sm text-blue-800 dark:text-blue-200 font-medium mb-1">
                  Important :
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Le lien expire dans 1 heure. Vérifiez votre dossier spam si vous ne recevez pas l'email.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <Button
              variant="outline"
              onClick={() => {
                setSent(false);
                setEmail('');
                setError('');
              }}
              className="w-full"
            >
              Renvoyer un lien
            </Button>
            
            <Link to="/">
              <Button variant="ghost" className="w-full">
                <ArrowLeft size={16} className="mr-2" />
                Retour à l'accueil
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link 
          to="/" 
          className="inline-flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 mb-8"
        >
          <ArrowLeft size={20} className="mr-2" />
          Retour à l'accueil
        </Link>

        <Card>
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-white font-bold text-xl">N</span>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Connexion à NOMAD AI
            </h1>
            
            <p className="text-gray-600 dark:text-gray-300">
              Entrez votre email pour recevoir un lien de connexion
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="text-red-500 mr-3" size={20} />
                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="email"
              label="Adresse email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {cooldown > 0 && (
              <div className="flex items-center justify-center text-sm text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                <Clock size={16} className="mr-2" />
                Veuillez attendre {cooldown} seconde{cooldown > 1 ? 's' : ''} avant de renvoyer
              </div>
            )}

            <Button
              type="submit"
              loading={loading}
              disabled={!email || cooldown > 0 || !isConfigured}
              className="w-full"
              size="lg"
            >
              {cooldown > 0 ? `Attendre ${cooldown}s` : 'Envoyer le lien de connexion'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Pas de mot de passe requis. Nous vous enverrons un lien sécurisé par email.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};