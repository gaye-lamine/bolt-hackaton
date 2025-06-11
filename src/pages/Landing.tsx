import React from 'react';
import { ArrowRight, Sparkles, Clock, Users, Smartphone, AlertTriangle, Star, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import { isSupabaseConfigured } from '../lib/supabase';

export const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-purple-50/30 dark:from-neutral-800 dark:via-neutral-800 dark:to-purple-900/10">
      {/* Configuration Warning */}
      {!isSupabaseConfigured && (
        <div className="bg-yellow-100 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-center">
              <AlertTriangle className="text-yellow-600 dark:text-yellow-400 mr-2" size={20} />
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Configuration requise:</strong> Veuillez configurer Supabase pour activer l'authentification et la base de données.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="flex justify-center mb-8 animate-bounce-gentle">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-strong">
                <span className="text-white font-bold text-2xl font-display">N</span>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 dark:text-neutral-50 mb-6 font-display leading-tight">
              Créez votre
              <span className="bg-gradient-to-r from-purple-600 to-purple-500 bg-clip-text text-transparent"> micro-entreprise </span>
              en 5 minutes
            </h1>
            
            <p className="text-xl text-neutral-600 dark:text-neutral-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              NOMAD AI vous accompagne pour lancer votre activité locale de services. 
              Aucune compétence technique requise, notre IA s'occupe de tout !
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {isSupabaseConfigured ? (
                <Link to="/auth">
                  <Button size="lg" className="px-8 py-4 text-lg shadow-strong hover:shadow-medium">
                    Commencer maintenant
                    <ArrowRight className="ml-2" size={20} />
                  </Button>
                </Link>
              ) : (
                <Button size="lg" className="px-8 py-4 text-lg" disabled>
                  Configuration requise
                  <AlertTriangle className="ml-2" size={20} />
                </Button>
              )}
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                Voir une démo
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-sm text-neutral-500 dark:text-neutral-400">
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-2 text-green-500" />
                100% sécurisé
              </div>
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-2 text-yellow-500" />
                Gratuit pour commencer
              </div>
              <div className="flex items-center">
                <Zap className="w-4 h-4 mr-2 text-purple-500" />
                Configuration en 5 min
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white dark:bg-neutral-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-50 mb-4 font-display">
              Comment ça marche ?
            </h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-300">
              3 étapes simples pour lancer votre micro-entreprise
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-medium transition-all duration-300 hover:scale-105" hover>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/40 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Sparkles className="text-purple-600 dark:text-purple-400" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-4 font-display">
                1. Discutez avec l'IA
              </h3>
              <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                Notre assistant intelligent vous pose des questions simples sur vos compétences et disponibilités
              </p>
            </Card>

            <Card className="text-center hover:shadow-medium transition-all duration-300 hover:scale-105" hover>
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Clock className="text-green-600 dark:text-green-400" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-4 font-display">
                2. Génération automatique
              </h3>
              <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                L'IA crée votre profil professionnel, vos services et tous vos outils de gestion
              </p>
            </Card>

            <Card className="text-center hover:shadow-medium transition-all duration-300 hover:scale-105" hover>
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/40 dark:to-yellow-800/40 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="text-yellow-600 dark:text-yellow-500" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-4 font-display">
                3. Commencez à travailler
              </h3>
              <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                Partagez votre profil, gérez vos clients et développez votre activité locale
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20 bg-neutral-50 dark:bg-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-50 mb-4 font-display">
              Tout ce qu'il vous faut
            </h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-300">
              Une solution complète pour votre micro-entreprise
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Profil professionnel', desc: 'Page web personnalisée', color: 'purple' },
              { title: 'Gestion clients', desc: 'Carnet d\'adresses intégré', color: 'green' },
              { title: 'Tarifs optimaux', desc: 'Recommandations IA', color: 'yellow' },
              { title: 'Coach personnel', desc: 'Conseils quotidiens', color: 'purple' },
              { title: 'Mode hors-ligne', desc: 'Fonctionne partout', color: 'green' },
              { title: 'Installation mobile', desc: 'App native sur téléphone', color: 'yellow' },
              { title: 'Messages types', desc: 'Templates WhatsApp/SMS', color: 'purple' },
              { title: 'Statistiques', desc: 'Suivi de performance', color: 'green' },
            ].map((benefit, index) => (
              <div key={index} className={`
                bg-white dark:bg-neutral-700 p-6 rounded-2xl shadow-soft border-l-4 
                ${benefit.color === 'purple' ? 'border-purple-500' : 
                  benefit.color === 'green' ? 'border-green-500' : 'border-yellow-500'}
                hover:shadow-medium transition-all duration-200 hover:scale-105
              `}>
                <h4 className="font-semibold text-neutral-900 dark:text-neutral-50 mb-2 font-display">{benefit.title}</h4>
                <p className="text-sm text-neutral-600 dark:text-neutral-300">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-purple-600 to-purple-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/90 to-purple-500/90"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Smartphone className="text-white mx-auto mb-6 animate-bounce-gentle" size={64} />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-display">
            Prêt à devenir votre propre patron ?
          </h2>
          <p className="text-xl text-purple-100 mb-8 leading-relaxed">
            Rejoignez des milliers d'entrepreneurs qui ont lancé leur micro-entreprise avec NOMAD AI
          </p>
          {isSupabaseConfigured ? (
            <Link to="/auth">
              <Button 
                size="lg" 
                className="px-8 py-4 text-lg bg-white text-purple-600 hover:bg-neutral-50 border-0 shadow-strong hover:shadow-medium transition-all duration-200"
              >
                Créer mon entreprise gratuitement
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
          ) : (
            <Button 
              size="lg" 
              className="px-8 py-4 text-lg bg-white text-purple-600 hover:bg-neutral-50 border-0 shadow-strong" 
              disabled
            >
              Configuration Supabase requise
              <AlertTriangle className="ml-2" size={20} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};