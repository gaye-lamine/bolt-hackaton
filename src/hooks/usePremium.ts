import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface PremiumStatus {
  isPremium: boolean;
  expiresAt: string | null;
  daysRemaining: number;
  loading: boolean;
}

export const usePremium = () => {
  const { user } = useAuth();
  const [premiumStatus, setPremiumStatus] = useState<PremiumStatus>({
    isPremium: false,
    expiresAt: null,
    daysRemaining: 0,
    loading: true,
  });

  useEffect(() => {
    if (user) {
      checkPremiumStatus();
    }
  }, [user]);

  const checkPremiumStatus = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('users')
        .select('is_premium, premium_expires_at')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      const isPremium = data?.is_premium || false;
      const expiresAt = data?.premium_expires_at;
      
      let daysRemaining = 0;
      if (isPremium && expiresAt) {
        const expireDate = new Date(expiresAt);
        const now = new Date();
        const diffTime = expireDate.getTime() - now.getTime();
        daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
        
        // Si expiré, mettre à jour le statut
        if (daysRemaining === 0) {
          await supabase
            .from('users')
            .update({ is_premium: false, premium_expires_at: null })
            .eq('id', user.id);
        }
      }

      setPremiumStatus({
        isPremium: isPremium && daysRemaining > 0,
        expiresAt,
        daysRemaining,
        loading: false,
      });
    } catch (error) {
      console.error('Error checking premium status:', error);
      setPremiumStatus(prev => ({ ...prev, loading: false }));
    }
  };

  const requiresPremium = (feature: string): boolean => {
    const premiumFeatures = [
      'advanced_ai',
      'detailed_analytics',
      'advanced_client_management',
      'priority_listing',
      'marketing_tools',
      'priority_support'
    ];
    
    return premiumFeatures.includes(feature);
  };

  return {
    ...premiumStatus,
    requiresPremium,
    checkPremiumStatus,
  };
};