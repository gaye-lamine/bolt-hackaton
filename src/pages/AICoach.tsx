import React, { useState, useEffect } from 'react';
import { MessageCircle, Lightbulb, TrendingUp, Users } from 'lucide-react';
import { Header } from '../components/Layout/Header';
import { Sidebar } from '../components/Layout/Sidebar';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { ChatMessage } from '../components/Chat/ChatMessage';
import { ChatInput } from '../components/Chat/ChatInput';
import { PremiumGate } from '../components/Premium/PremiumGate';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { usePremium } from '../hooks/usePremium';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const AICoach = () => {
  const { user } = useAuth();
  const { isPremium } = usePremium();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: isPremium 
        ? 'Bonjour ! Je suis votre coach IA Premium. J\'ai accès à toutes mes fonctionnalités avancées pour vous aider à optimiser votre micro-entreprise. Comment puis-je vous aider aujourd\'hui ?'
        : 'Bonjour ! Je suis votre coach IA. Je peux vous donner des conseils de base. Pour des analyses approfondies et des conseils personnalisés, passez à Premium ! Comment puis-je vous aider ?',
      timestamp: new Date().toISOString(),
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [userServices, setUserServices] = useState<any[]>([]);
  const [userClients, setUserClients] = useState<any[]>([]);
  const [messageCount, setMessageCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      // Fetch user profile
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      // Fetch user services
      const { data: services } = await supabase
        .from('services')
        .select('*')
        .eq('user_id', user.id);

      // Fetch user clients
      const { data: clients } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', user.id);

      setUserProfile(profile);
      setUserServices(services || []);
      setUserClients(clients || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const quickActions = [
    {
      title: 'Optimiser mes tarifs',
      description: 'Analyser la concurrence et ajuster mes prix',
      icon: TrendingUp,
      prompt: 'Peux-tu m\'aider à optimiser mes tarifs en analysant le marché local ?',
      premium: true
    },
    {
      title: 'Améliorer mes services',
      description: 'Suggestions pour développer mon offre',
      icon: Lightbulb,
      prompt: 'Quelles améliorations peux-tu suggérer pour mes services actuels ?'
    },
    {
      title: 'Stratégie client',
      description: 'Conseils pour fidéliser et attirer',
      icon: Users,
      prompt: 'Comment puis-je mieux fidéliser mes clients et en attirer de nouveaux ?',
      premium: true
    }
  ];

  const generateIntelligentResponse = async (userMessage: string): Promise<string> => {
    // Limiter les messages pour les utilisateurs gratuits
    if (!isPremium && messageCount >= 5) {
      return "Vous avez atteint la limite de 5 messages gratuits. Passez à Premium pour des conseils illimités et des analyses approfondies ! 🚀";
    }

    // Analyser le message de l'utilisateur pour fournir une réponse contextuelle
    const lowerMessage = userMessage.toLowerCase();
    
    // Construire le contexte utilisateur
    const hasServices = userServices.length > 0;
    const hasClients = userClients.length > 0;
    const location = userProfile?.location || 'votre région';
    const skills = userProfile?.skills || [];
    
    // Réponses Premium vs Gratuit
    if (lowerMessage.includes('tarif') || lowerMessage.includes('prix')) {
      if (!isPremium) {
        return "Pour des conseils tarifaires de base : commencez par analyser 2-3 concurrents locaux et positionnez-vous 10% en dessous pour débuter. Pour une analyse complète du marché et des recommandations personnalisées, passez à Premium ! 💎";
      }
      
      if (!hasServices) {
        return `[ANALYSE PREMIUM] Pour optimiser vos tarifs, vous devez d'abord créer vos services ! Je recommande de commencer par définir 2-3 services principaux avec des prix compétitifs pour ${location}. Basé sur l'analyse du marché local, commencez 10-15% en dessous du marché pour attirer vos premiers clients, puis augmentez progressivement.`;
      }
      
      const avgPrice = userServices.reduce((sum, s) => sum + s.price_from, 0) / userServices.length;
      return `[ANALYSE PREMIUM] Avec ${userServices.length} service(s) et un prix moyen de ${Math.round(avgPrice)} CFA, voici mon analyse détaillée : 1) Vos prix sont ${avgPrice > 8000 ? 'dans la fourchette haute' : 'compétitifs'} pour ${location}, 2) Si vous avez plus de 5 clients satisfaits, augmentez de 15-20%, 3) Créez des forfaits premium à +30% avec services additionnels. Analyse concurrentielle : positionnez-vous comme expert avec garantie qualité.`;
    }
    
    if (lowerMessage.includes('service') || lowerMessage.includes('améliorer') || lowerMessage.includes('développer')) {
      if (!hasServices) {
        return `Commençons par créer vos premiers services ! Basé sur vos compétences (${skills.join(', ') || 'à définir'}), je suggère de proposer des services complémentaires. ${isPremium ? '[PREMIUM] Stratégie recommandée : créez un service de base, un service premium (+50% prix) et un forfait mensuel (-20% par intervention).' : 'Pour une stratégie complète de développement, passez à Premium !'}`;
      }
      
      if (!isPremium) {
        return `Conseil de base : ajoutez des services complémentaires à vos ${userServices.length} service(s) existants. Pour une analyse détaillée de votre offre et des recommandations personnalisées, passez à Premium ! 🎯`;
      }
      
      return `[STRATÉGIE PREMIUM] Avec vos ${userServices.length} service(s) actuels, voici votre plan de développement : 1) Créez des packages premium (ex: ménage + repassage + organisation), 2) Lancez des services saisonniers (grand ménage de printemps, préparation fêtes), 3) Proposez des abonnements mensuels avec 15% de remise, 4) Développez une spécialité unique qui vous différencie. ROI estimé : +40% de revenus en 3 mois.`;
    }
    
    if (lowerMessage.includes('client') || lowerMessage.includes('fidéliser') || lowerMessage.includes('attirer')) {
      if (!hasClients) {
        return `Pour attirer vos premiers clients dans ${location} : 1) Créez des cartes de visite simples, 2) Rejoignez les groupes Facebook locaux, 3) Proposez une remise de 20% aux 5 premiers clients. ${isPremium ? '[PREMIUM] Plan d\'acquisition détaillé : semaine 1-2 (réseau personnel), semaine 3-4 (réseaux sociaux), semaine 5+ (bouche-à-oreille optimisé).' : 'Pour un plan d\'acquisition complet, passez à Premium !'}`;
      }
      
      if (!isPremium) {
        return `Avec ${userClients.length} client(s), concentrez-vous sur la fidélisation : envoyez un message de suivi après chaque service. Pour des stratégies avancées de fidélisation et d'acquisition, passez à Premium ! 📈`;
      }
      
      return `[STRATÉGIE PREMIUM] Avec ${userClients.length} client(s) enregistré(s), voici votre plan de croissance : 1) Fidélisation : système de points (10ème service gratuit), SMS de rappel automatique, 2) Acquisition : programme de parrainage (20% remise pour chaque nouveau client amené), 3) Upselling : proposez services premium aux clients satisfaits. Objectif : doubler votre clientèle en 2 mois.`;
    }

    // Réponse générale avec différenciation Premium
    const generalResponses = isPremium ? [
      `[ANALYSE PREMIUM] Excellente question ! Avec votre profil (${userServices.length} services, ${userClients.length} clients), je recommande de vous concentrer sur l'optimisation de votre taux de conversion. Stratégie : 1) Perfectionnez votre service phare, 2) Créez un système de recommandations, 3) Développez une offre premium. ROI attendu : +60% en 3 mois.`,
      
      `[COACHING PREMIUM] Dans le contexte de ${location}, votre positionnement optimal est : expert local de confiance. Plan d'action : 1) Spécialisez-vous dans un domaine, 2) Créez du contenu éducatif (posts Facebook), 3) Développez un réseau de partenaires. Vos compétences en ${skills.slice(0, 2).join(' et ')} sont des atouts différenciants.`,
    ] : [
      `Bonne question ! Pour développer votre activité : 1) Concentrez-vous sur la qualité, 2) Demandez des avis clients, 3) Partagez votre profil. Pour des conseils personnalisés et une stratégie complète, passez à Premium ! 💎`,
      
      `Conseil de base : ${hasServices ? 'optimisez vos services existants' : 'créez d\'abord vos services de base'} et concentrez-vous sur la satisfaction client. Pour une analyse approfondie et des recommandations personnalisées, découvrez Premium ! 🚀`,
    ];
    
    return generalResponses[Math.floor(Math.random() * generalResponses.length)];
  };

  const sendMessage = async (userMessage: string) => {
    if (!user) return;

    // Vérifier la limite pour les utilisateurs gratuits
    if (!isPremium && messageCount >= 5) {
      const limitMessage: Message = {
        role: 'assistant',
        content: "Vous avez atteint la limite de 5 messages gratuits. Passez à Premium pour des conseils illimités et des analyses approfondies ! 🚀",
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, limitMessage]);
      return;
    }

    setLoading(true);
    setMessageCount(prev => prev + 1);

    // Add user message
    const userMessageObj: Message = {
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessageObj]);

    try {
      const aiResponse = await generateIntelligentResponse(userMessage);
      const aiMessageObj: Message = {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, aiMessageObj]);

      // Save conversation to database
      const updatedMessages = [...messages, userMessageObj, aiMessageObj];
      await saveConversation(updatedMessages);

    } catch (error) {
      console.error('Erreur lors de la génération de la réponse IA:', error);
      const fallbackMessage: Message = {
        role: 'assistant',
        content: await generateIntelligentResponse(userMessage),
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setLoading(false);
    }
  };

  const saveConversation = async (conversationMessages: Message[]) => {
    if (!user) return;

    try {
      await supabase
        .from('ai_conversations')
        .upsert({
          user_id: user.id,
          messages: conversationMessages,
          conversation_type: 'coaching',
          updated_at: new Date().toISOString(),
        });
    } catch (error) {
      console.error('Error saving conversation:', error);
    }
  };

  const handleQuickAction = (prompt: string, premium: boolean = false) => {
    if (premium && !isPremium) {
      // Rediriger vers Premium
      window.location.href = '/premium';
      return;
    }
    sendMessage(prompt);
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <Header onMenuClick={() => setSidebarOpen(true)} showMenu />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1">
          <div className="p-4 sm:p-6">
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-2 font-display">
                Assistant IA Coach {isPremium && '✨ Premium'}
              </h1>
              <p className="text-neutral-600 dark:text-neutral-300">
                {isPremium 
                  ? 'Votre conseiller personnel avec toutes les fonctionnalités avancées'
                  : 'Votre conseiller personnel - Passez à Premium pour des analyses approfondies'
                }
              </p>
              {!isPremium && (
                <div className="mt-2 text-sm text-orange-600 dark:text-orange-400">
                  Messages restants : {Math.max(0, 5 - messageCount)}/5 gratuits
                </div>
              )}
            </div>

            <div className="grid lg:grid-cols-4 gap-6">
              {/* Quick Actions */}
              <div className="lg:col-span-1">
                <Card>
                  <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-4 font-display">
                    Actions rapides
                  </h2>
                  <div className="space-y-3">
                    {quickActions.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickAction(action.prompt, action.premium)}
                        className={`w-full text-left p-3 rounded-xl border transition-colors ${
                          action.premium && !isPremium
                            ? 'border-yellow-300 dark:border-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/30'
                            : 'border-neutral-200 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-600'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            action.premium && !isPremium
                              ? 'bg-yellow-100 dark:bg-yellow-900/40'
                              : 'bg-purple-100 dark:bg-purple-900'
                          }`}>
                            <action.icon className={`${
                              action.premium && !isPremium
                                ? 'text-yellow-600 dark:text-yellow-400'
                                : 'text-purple-600 dark:text-purple-400'
                            }`} size={16} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-neutral-900 dark:text-neutral-50 text-sm">
                              {action.title}
                              {action.premium && !isPremium && ' 💎'}
                            </h3>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                              {action.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </Card>

                <Card className="mt-6">
                  <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-4 font-display">
                    Votre profil
                  </h2>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-medium text-neutral-700 dark:text-neutral-300">Services:</span>
                      <span className="ml-2 text-neutral-600 dark:text-neutral-400">{userServices.length}</span>
                    </div>
                    <div>
                      <span className="font-medium text-neutral-700 dark:text-neutral-300">Clients:</span>
                      <span className="ml-2 text-neutral-600 dark:text-neutral-400">{userClients.length}</span>
                    </div>
                    <div>
                      <span className="font-medium text-neutral-700 dark:text-neutral-300">Localisation:</span>
                      <span className="ml-2 text-neutral-600 dark:text-neutral-400">{userProfile?.location || 'Non renseignée'}</span>
                    </div>
                  </div>
                </Card>

                {/* Tips Card */}
                <Card className="mt-6">
                  <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-4 font-display">
                    💡 Conseil du jour
                  </h2>
                  <div className="p-3 bg-gradient-to-r from-purple-50 to-teal-50 dark:from-purple-900/20 dark:to-teal-900/20 rounded-lg">
                    <p className="text-sm text-neutral-700 dark:text-neutral-300">
                      {userServices.length === 0 
                        ? "Commencez par créer 2-3 services de base pour attirer vos premiers clients."
                        : userClients.length === 0
                        ? "Partagez votre profil à 10 personnes pour obtenir vos premiers clients."
                        : isPremium
                        ? "Analysez vos performances avec les statistiques détaillées Premium pour optimiser vos revenus."
                        : "Passez à Premium pour des analyses approfondies et des conseils personnalisés !"
                      }
                    </p>
                  </div>
                </Card>
              </div>

              {/* Chat Interface */}
              <div className="lg:col-span-3">
                <Card className="h-96 md:h-[600px] flex flex-col">
                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message, index) => (
                      <ChatMessage key={index} message={message} />
                    ))}
                    
                    {loading && (
                      <div className="flex justify-start mb-4">
                        <div className="flex items-center space-x-2 bg-neutral-100 dark:bg-neutral-600 px-4 py-2 rounded-2xl">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <span className="text-sm text-neutral-500 dark:text-neutral-400">
                            {isPremium ? 'Analyse Premium en cours...' : 'Votre coach analyse...'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Input Area */}
                  <ChatInput
                    onSendMessage={sendMessage}
                    disabled={loading || (!isPremium && messageCount >= 5)}
                    placeholder={
                      !isPremium && messageCount >= 5
                        ? "Passez à Premium pour continuer..."
                        : "Posez votre question sur votre micro-entreprise..."
                    }
                  />
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};