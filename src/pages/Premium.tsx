import React, { useState } from 'react';
import { Crown, Check, Star, TrendingUp, MessageCircle, BarChart3, Users, Sparkles, ArrowRight } from 'lucide-react';
import { Header } from '../components/Layout/Header';
import { Sidebar } from '../components/Layout/Sidebar';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { PremiumBadge } from '../components/Premium/PremiumBadge';
import { PaymentModal } from '../components/Premium/PaymentModal';
import { usePremium } from '../hooks/usePremium';

export const Premium = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const { isPremium, daysRemaining, loading } = usePremium();

  const premiumFeatures = [
    {
      icon: MessageCircle,
      title: 'Assistant IA Avancé',
      description: 'Conseils personnalisés illimités, analyses approfondies de votre marché local, et recommandations stratégiques basées sur vos données.',
      free: 'Conseils de base',
      premium: 'Analyses illimitées + Conseils personnalisés',
      color: 'text-purple-500',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20'
    },
    {
      icon: BarChart3,
      title: 'Statistiques Détaillées',
      description: 'Tableaux de bord avancés, prévisions de revenus, analyse de la concurrence, et rapports détaillés pour optimiser votre activité.',
      free: 'Statistiques simples',
      premium: 'Analyses complètes + Prévisions',
      color: 'text-green-500',
      bgColor: 'bg-green-100 dark:bg-green-900/20'
    },
    {
      icon: Users,
      title: 'Gestion Clients Pro',
      description: 'Historique complet des interactions, notes détaillées, rappels automatiques, et système de fidélisation intégré.',
      free: 'Liste de contacts',
      premium: 'CRM complet + Automatisation',
      color: 'text-blue-500',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20'
    },
    {
      icon: Star,
      title: 'Profil Mis en Avant',
      description: 'Votre profil apparaît en priorité dans les recherches locales, avec un badge Premium et une visibilité accrue.',
      free: 'Profil standard',
      premium: 'Visibilité prioritaire + Badge Premium',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20'
    },
    {
      icon: TrendingUp,
      title: 'Outils Marketing',
      description: 'Templates de messages WhatsApp, cartes de visite numériques, campagnes automatisées, et outils de promotion.',
      free: 'Partage basique',
      premium: 'Suite marketing complète',
      color: 'text-orange-500',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20'
    },
    {
      icon: Sparkles,
      title: 'Support Prioritaire',
      description: 'Assistance rapide par chat, conseils personnalisés d\'experts, et accès aux nouvelles fonctionnalités en avant-première.',
      free: 'Support standard',
      premium: 'Support prioritaire + Expert dédié',
      color: 'text-teal-500',
      bgColor: 'bg-teal-100 dark:bg-teal-900/20'
    }
  ];

  const testimonials = [
    {
      name: 'Aminata Diallo',
      business: 'Services de ménage - Dakar',
      text: 'Depuis que je suis Premium, j\'ai doublé ma clientèle ! Les outils marketing m\'ont vraiment aidée.',
      revenue: '+120% de revenus',
      investment: '500 CFA → 15,000 CFA/mois'
    },
    {
      name: 'Ibrahim Koné',
      business: 'Livraison - Abidjan',
      text: 'L\'assistant IA m\'a donné des conseils précieux pour optimiser mes tournées. Je gagne 2h par jour !',
      revenue: '+80% d\'efficacité',
      investment: '500 CFA → 12,000 CFA/mois'
    },
    {
      name: 'Fatou Sow',
      business: 'Aide à domicile - Bamako',
      text: 'Le CRM Premium me permet de fidéliser mes clients. Ils reviennent toujours !',
      revenue: '95% de fidélisation',
      investment: '500 CFA → 18,000 CFA/mois'
    }
  ];

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    // Recharger la page pour mettre à jour le statut Premium
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
        <Header onMenuClick={() => setSidebarOpen(true)} showMenu />
        <div className="flex">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-neutral-600 dark:text-neutral-300">Chargement...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <Header onMenuClick={() => setSidebarOpen(true)} showMenu />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1">
          <div className="p-4 sm:p-6">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-3xl mb-6 shadow-strong">
                <Crown className="w-10 h-10 text-white" />
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-neutral-50 mb-4 font-display">
                {isPremium ? 'Vous êtes Premium !' : 'Passez à NOMAD AI Premium'}
              </h1>
              
              {isPremium ? (
                <div className="space-y-2">
                  <p className="text-xl text-neutral-600 dark:text-neutral-300">
                    Profitez de toutes les fonctionnalités avancées
                  </p>
                  <div className="inline-flex items-center px-4 py-2 bg-green-100 dark:bg-green-900/20 rounded-xl">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-sm text-green-700 dark:text-green-300 font-medium">
                      Premium actif - {daysRemaining} jours restants
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-xl text-neutral-600 dark:text-neutral-300">
                    Débloquez tout le potentiel de votre micro-entreprise pour seulement 500 CFA/mois
                  </p>
                  <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl">
                    <div className="text-center">
                      <div className="flex items-baseline justify-center mb-1">
                        <span className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">500</span>
                        <span className="text-lg text-neutral-600 dark:text-neutral-300 ml-1">CFA/mois</span>
                      </div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">Moins de 17 CFA par jour !</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-center gap-4 text-sm text-neutral-600 dark:text-neutral-300">
                    <div className="flex items-center">
                      <Check className="w-4 h-4 text-green-500 mr-1" />
                      Première semaine gratuite
                    </div>
                    <div className="flex items-center">
                      <Check className="w-4 h-4 text-green-500 mr-1" />
                      Annulation à tout moment
                    </div>
                    <div className="flex items-center">
                      <Check className="w-4 h-4 text-green-500 mr-1" />
                      ROI garanti 3000%
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ROI Calculator */}
            {!isPremium && (
              <Card className="mb-12 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-2 border-green-200 dark:border-green-800">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-6 font-display">
                    💰 Calculateur de retour sur investissement
                  </h2>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">500 CFA</div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-300">Investissement mensuel</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">+15,000 CFA</div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-300">Gain moyen mensuel</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">3000%</div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-300">Retour sur investissement</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-white dark:bg-neutral-700 rounded-xl">
                    <p className="text-sm text-neutral-700 dark:text-neutral-300">
                      <strong>Exemple concret :</strong> Avec Premium, vous pourriez augmenter vos tarifs de 20%, 
                      attirer 3x plus de clients grâce à la visibilité prioritaire, et économiser 5h/semaine 
                      avec les outils d'automatisation. Résultat : +15,000 CFA/mois pour 500 CFA d\'investissement !
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Fonctionnalités Premium */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 text-center mb-8 font-display">
                Fonctionnalités Premium
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {premiumFeatures.map((feature, index) => (
                  <Card key={index} className="hover:shadow-medium transition-all duration-200 hover:scale-105" hover>
                    <div className="text-center">
                      <div className={`w-12 h-12 ${feature.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                        <feature.icon className={`w-6 h-6 ${feature.color}`} />
                      </div>
                      
                      <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-2 font-display">
                        {feature.title}
                      </h3>
                      
                      <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-4">
                        {feature.description}
                      </p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-neutral-500 dark:text-neutral-400">Gratuit:</span>
                          <span className="text-neutral-600 dark:text-neutral-300">{feature.free}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-yellow-600 dark:text-yellow-400 font-medium">Premium:</span>
                          <span className="text-neutral-900 dark:text-neutral-50 font-medium">{feature.premium}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Témoignages */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 text-center mb-8 font-display">
                Témoignages de nos utilisateurs Premium
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                {testimonials.map((testimonial, index) => (
                  <Card key={index} className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold text-lg">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    
                    <blockquote className="text-sm text-neutral-600 dark:text-neutral-300 mb-4 italic">
                      "{testimonial.text}"
                    </blockquote>
                    
                    <div className="space-y-2">
                      <p className="font-medium text-neutral-900 dark:text-neutral-50 text-sm">
                        {testimonial.name}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {testimonial.business}
                      </p>
                      <div className="space-y-1">
                        <div className="inline-flex items-center px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {testimonial.revenue}
                        </div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">
                          {testimonial.investment}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* CTA Section */}
            {!isPremium && (
              <Card className="text-center bg-gradient-to-r from-purple-50 to-yellow-50 dark:from-purple-900/20 dark:to-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800">
                <div className="max-w-2xl mx-auto">
                  <Crown className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
                  
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-4 font-display">
                    Prêt à faire passer votre micro-entreprise au niveau supérieur ?
                  </h2>
                  
                  <p className="text-neutral-600 dark:text-neutral-300 mb-6">
                    Rejoignez des milliers d'entrepreneurs qui ont boosté leur activité avec Premium
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Button
                      onClick={() => setShowPayment(true)}
                      size="lg"
                      className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-neutral-900 font-semibold px-8"
                    >
                      <Crown className="w-5 h-5 mr-2" />
                      Passer à Premium - 500 CFA
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                    
                    <div className="text-center">
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        ✓ Première semaine gratuite
                      </p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        ✓ Annulation à tout moment
                      </p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        ✓ Garantie satisfait ou remboursé
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Section Premium actif */}
            {isPremium && (
              <Card className="text-center bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-2 border-green-200 dark:border-green-800">
                <div className="max-w-2xl mx-auto">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-8 h-8 text-green-500" />
                  </div>
                  
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-4 font-display">
                    Félicitations ! Vous êtes Premium
                  </h2>
                  
                  <p className="text-neutral-600 dark:text-neutral-300 mb-6">
                    Profitez de toutes les fonctionnalités avancées pour développer votre micro-entreprise
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="bg-white dark:bg-neutral-700 rounded-lg p-4">
                      <h3 className="font-medium text-neutral-900 dark:text-neutral-50 mb-2">
                        Votre abonnement
                      </h3>
                      <p className="text-neutral-600 dark:text-neutral-300">
                        Premium actif - {daysRemaining} jours restants
                      </p>
                    </div>
                    <div className="bg-white dark:bg-neutral-700 rounded-lg p-4">
                      <h3 className="font-medium text-neutral-900 dark:text-neutral-50 mb-2">
                        Prochaine facturation
                      </h3>
                      <p className="text-neutral-600 dark:text-neutral-300">
                        500 CFA dans {daysRemaining} jours
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </main>
      </div>

      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};