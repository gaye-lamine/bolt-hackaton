import React, { useState } from 'react';
import { X, Crown, Check, Sparkles, Star, TrendingUp, MessageCircle, BarChart3, Users } from 'lucide-react';
import { Button } from '../UI/Button';
import { Card } from '../UI/Card';
import { PaymentModal } from './PaymentModal';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: string;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({ isOpen, onClose, feature }) => {
  const [showPayment, setShowPayment] = useState(false);

  if (!isOpen) return null;

  const premiumFeatures = [
    {
      icon: MessageCircle,
      title: 'Assistant IA Avancé',
      description: 'Conseils personnalisés illimités et analyses approfondies',
      color: 'text-purple-500',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20'
    },
    {
      icon: BarChart3,
      title: 'Statistiques Détaillées',
      description: 'Analyses complètes de performance et recommandations',
      color: 'text-green-500',
      bgColor: 'bg-green-100 dark:bg-green-900/20'
    },
    {
      icon: Users,
      title: 'Gestion Clients Avancée',
      description: 'Historique complet, notes détaillées et suivi personnalisé',
      color: 'text-blue-500',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20'
    },
    {
      icon: Star,
      title: 'Profil Mis en Avant',
      description: 'Votre profil apparaît en priorité dans les recherches',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20'
    },
    {
      icon: TrendingUp,
      title: 'Outils Marketing',
      description: 'Templates de messages, cartes de visite numériques',
      color: 'text-orange-500',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20'
    },
    {
      icon: Sparkles,
      title: 'Support Prioritaire',
      description: 'Assistance rapide et conseils personnalisés',
      color: 'text-teal-500',
      bgColor: 'bg-teal-100 dark:bg-teal-900/20'
    }
  ];

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center mr-3">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 font-display">
                  NOMAD AI Premium
                </h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-300">
                  Débloquez tout le potentiel de votre micro-entreprise
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Prix */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl p-6 mb-4">
              <div className="text-center">
                <div className="flex items-baseline justify-center mb-2">
                  <span className="text-4xl font-bold text-neutral-900 dark:text-neutral-50">500</span>
                  <span className="text-lg text-neutral-600 dark:text-neutral-300 ml-1">CFA</span>
                </div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">par mois</p>
                <div className="mt-2 inline-flex items-center px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Moins de 17 CFA par jour !
                </div>
              </div>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-300">
              Annulation possible à tout moment • Première semaine gratuite
            </p>
          </div>

          {/* Fonctionnalités */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-4 font-display">
              Fonctionnalités Premium incluses :
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {premiumFeatures.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors">
                  <div className={`w-8 h-8 ${feature.bgColor} rounded-lg flex items-center justify-center`}>
                    <feature.icon className={`w-4 h-4 ${feature.color}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-neutral-900 dark:text-neutral-50 text-sm">
                      {feature.title}
                    </h4>
                    <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1">
                      {feature.description}
                    </p>
                  </div>
                  <Check className="w-4 h-4 text-green-500 mt-1" />
                </div>
              ))}
            </div>
          </div>

          {/* Avantages économiques */}
          <div className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-4 font-display">
              💰 Retour sur investissement
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-neutral-900 dark:text-neutral-50 mb-1">
                  Avec Premium, vous pourriez :
                </p>
                <ul className="text-neutral-600 dark:text-neutral-300 space-y-1">
                  <li>• Augmenter vos tarifs de 20%</li>
                  <li>• Attirer 3x plus de clients</li>
                  <li>• Économiser 5h/semaine</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-neutral-900 dark:text-neutral-50 mb-1">
                  Gain potentiel mensuel :
                </p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  +15,000 CFA
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  ROI de 3000% sur votre investissement !
                </p>
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => setShowPayment(true)}
              className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-neutral-900 font-semibold"
              size="lg"
            >
              <Crown className="w-5 h-5 mr-2" />
              Passer à Premium - 500 CFA
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="sm:w-auto"
            >
              Plus tard
            </Button>
          </div>

          {/* Garantie */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center px-4 py-2 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <Check className="w-4 h-4 text-green-500 mr-2" />
              <span className="text-sm text-green-700 dark:text-green-300 font-medium">
                Garantie satisfait ou remboursé 7 jours
              </span>
            </div>
          </div>
        </Card>
      </div>

      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        onSuccess={handlePaymentSuccess}
      />
    </>
  );
};