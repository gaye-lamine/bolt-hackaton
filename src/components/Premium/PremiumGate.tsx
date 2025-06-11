import React, { useState } from 'react';
import { Crown, Lock } from 'lucide-react';
import { Button } from '../UI/Button';
import { Card } from '../UI/Card';
import { PremiumModal } from './PremiumModal';
import { usePremium } from '../../hooks/usePremium';

interface PremiumGateProps {
  feature: string;
  title: string;
  description: string;
  children: React.ReactNode;
}

export const PremiumGate: React.FC<PremiumGateProps> = ({
  feature,
  title,
  description,
  children
}) => {
  const { isPremium, requiresPremium } = usePremium();
  const [showModal, setShowModal] = useState(false);

  // Si la fonctionnalité ne nécessite pas Premium ou si l'utilisateur est Premium
  if (!requiresPremium(feature) || isPremium) {
    return <>{children}</>;
  }

  // Sinon, afficher le gate Premium
  return (
    <>
      <Card className="text-center py-12 border-2 border-dashed border-yellow-300 dark:border-yellow-600 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10">
        <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-soft">
          <Crown className="w-8 h-8 text-white" />
        </div>
        
        <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-50 mb-3 font-display">
          {title}
        </h3>
        
        <p className="text-neutral-600 dark:text-neutral-300 mb-6 max-w-md mx-auto">
          {description}
        </p>
        
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center px-4 py-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-xl">
            <Lock className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mr-2" />
            <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
              Fonctionnalité Premium
            </span>
          </div>
        </div>
        
        <div className="space-y-3">
          <Button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-neutral-900 font-semibold"
            size="lg"
          >
            <Crown className="w-5 h-5 mr-2" />
            Débloquer pour 500 CFA/mois
          </Button>
          
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Première semaine gratuite • Annulation à tout moment • ROI garanti 3000%
          </p>
        </div>
      </Card>

      <PremiumModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        feature={feature}
      />
    </>
  );
};