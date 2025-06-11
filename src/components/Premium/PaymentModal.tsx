import React, { useState } from 'react';
import { X, Crown, Check, Smartphone, CreditCard, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '../UI/Button';
import { Card } from '../UI/Card';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<'mobile_money' | 'card'>('mobile_money');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [provider, setProvider] = useState<'orange' | 'wave' | 'free'>('orange');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'method' | 'details' | 'processing' | 'success'>('method');

  if (!isOpen) return null;

  const handlePayment = async () => {
    if (!user) return;
    
    setLoading(true);
    setError('');
    
    try {
      if (paymentMethod === 'mobile_money') {
        if (!phoneNumber || phoneNumber.length < 9) {
          setError('Veuillez entrer un numéro de téléphone valide (9 chiffres)');
          setLoading(false);
          return;
        }
        
        setStep('processing');
        
        // Simuler l'appel à l'API de paiement mobile money
        await simulateMobileMoneyPayment();
      } else {
        // Pour les cartes bancaires, rediriger vers un service de paiement
        setStep('processing');
        await simulateCardPayment();
      }
      
      // Activer le premium dans la base de données
      const { error: updateError } = await supabase
        .from('users')
        .update({ 
          is_premium: true,
          premium_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 jours
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setStep('success');
      setTimeout(() => {
        onSuccess();
        onClose();
        window.location.reload(); // Recharger pour appliquer les changements
      }, 2000);
      
    } catch (error) {
      console.error('Erreur lors du paiement:', error);
      setError('Erreur lors du paiement. Veuillez réessayer.');
      setStep('details');
    } finally {
      setLoading(false);
    }
  };

  const simulateMobileMoneyPayment = async () => {
    // Simulation d'un appel API vers Orange Money, Wave, ou Free Money
    return new Promise((resolve) => {
      setTimeout(() => {
        // En production, ici on ferait l'appel réel à l'API
        resolve(true);
      }, 3000);
    });
  };

  const simulateCardPayment = async () => {
    // Simulation d'un paiement par carte
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 2000);
    });
  };

  const formatPhoneNumber = (value: string) => {
    // Formater le numéro de téléphone sénégalais (9 chiffres)
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 9) {
      if (cleaned.length <= 2) return cleaned;
      if (cleaned.length <= 5) return cleaned.replace(/(\d{2})(\d{1,3})/, '$1 $2');
      if (cleaned.length <= 7) return cleaned.replace(/(\d{2})(\d{3})(\d{1,2})/, '$1 $2 $3');
      return cleaned.replace(/(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4');
    }
    return cleaned.slice(0, 9).replace(/(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4');
  };

  const getProviderInfo = (providerId: string) => {
    const providers = {
      orange: { name: 'Orange Money', color: 'bg-orange-500', ussd: '*144#' },
      wave: { name: 'Wave', color: 'bg-blue-600', ussd: '*1*7#' },
      free: { name: 'Free Money', color: 'bg-red-500', ussd: '*880#' }
    };
    return providers[providerId as keyof typeof providers];
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center mr-3">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50 font-display">
                Paiement Premium
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-300">
                500 CFA/mois
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

        {step === 'method' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-4 font-display">
                Choisissez votre méthode de paiement
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => setPaymentMethod('mobile_money')}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    paymentMethod === 'mobile_money'
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-neutral-200 dark:border-neutral-600 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                      <Smartphone className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900 dark:text-neutral-50">Mobile Money</p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">Orange Money, Wave, Free Money</p>
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    paymentMethod === 'card'
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-neutral-200 dark:border-neutral-600 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                      <CreditCard className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900 dark:text-neutral-50">Carte Bancaire</p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">Visa, Mastercard</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <Button
              onClick={() => setStep('details')}
              className="w-full"
            >
              Continuer
            </Button>
          </div>
        )}

        {step === 'details' && paymentMethod === 'mobile_money' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-4 font-display">
                Informations Mobile Money
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Opérateur
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'orange', name: 'Orange', color: 'bg-orange-500' },
                      { id: 'wave', name: 'Wave', color: 'bg-blue-600' },
                      { id: 'free', name: 'Free', color: 'bg-red-500' }
                    ].map((op) => (
                      <button
                        key={op.id}
                        onClick={() => setProvider(op.id as any)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          provider === op.id
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                            : 'border-neutral-200 dark:border-neutral-600'
                        }`}
                      >
                        <div className={`w-6 h-6 ${op.color} rounded mx-auto mb-1`}></div>
                        <p className="text-xs font-medium text-neutral-900 dark:text-neutral-50">{op.name}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Numéro de téléphone (9 chiffres)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500 dark:text-neutral-400">
                      +221
                    </span>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                      placeholder="XX XXX XX XX"
                      className="w-full pl-12 pr-4 py-3 border-2 border-neutral-200 dark:border-neutral-600 rounded-xl shadow-soft
                                 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-50
                                 placeholder-neutral-500 dark:placeholder-neutral-400
                                 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Format: 77 123 45 67 ou 70 123 45 67
                  </p>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="text-red-500 mr-2" size={16} />
                  <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                </div>
              </div>
            )}

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Instructions :</h4>
              <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>1. Vous recevrez un SMS de confirmation</li>
                <li>2. Composez {getProviderInfo(provider).ussd} pour valider</li>
                <li>3. Votre compte sera activé automatiquement</li>
              </ol>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep('method')}
                className="flex-1"
              >
                Retour
              </Button>
              <Button
                onClick={handlePayment}
                loading={loading}
                className="flex-1"
              >
                Payer 500 CFA
              </Button>
            </div>
          </div>
        )}

        {step === 'details' && paymentMethod === 'card' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-4 font-display">
                Paiement par carte
              </h3>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Vous allez être redirigé vers notre partenaire de paiement sécurisé pour finaliser votre transaction.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep('method')}
                className="flex-1"
              >
                Retour
              </Button>
              <Button
                onClick={handlePayment}
                loading={loading}
                className="flex-1"
              >
                Continuer
              </Button>
            </div>
          </div>
        )}

        {step === 'processing' && (
          <div className="text-center py-8">
            <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-2 font-display">
              Traitement du paiement...
            </h3>
            <p className="text-neutral-600 dark:text-neutral-300">
              {paymentMethod === 'mobile_money' 
                ? `Vérifiez votre téléphone ${getProviderInfo(provider).name} pour confirmer le paiement`
                : 'Redirection vers le service de paiement...'
              }
            </p>
            {paymentMethod === 'mobile_money' && (
              <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  Code USSD: <strong>{getProviderInfo(provider).ussd}</strong>
                </p>
              </div>
            )}
          </div>
        )}

        {step === 'success' && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-2 font-display">
              Paiement réussi !
            </h3>
            <p className="text-neutral-600 dark:text-neutral-300 mb-4">
              Votre compte Premium est maintenant actif
            </p>
            <div className="inline-flex items-center px-4 py-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-xl">
              <Crown className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mr-2" />
              <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                Premium activé pour 30 jours
              </span>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};