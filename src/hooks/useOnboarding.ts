import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface OnboardingData {
  fullName: string;
  location: string;
  skills: string[];
  availability: string[];
  transportMeans: string[];
  bio: string;
  phone: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const useOnboarding = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Bonjour ! Je suis votre assistant IA NOMAD. Je vais vous aider à créer votre micro-entreprise locale en quelques minutes. Commençons par nous connaître ! Comment vous appelez-vous ?',
      timestamp: new Date().toISOString(),
    }
  ]);
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<Partial<OnboardingData>>({});
  const [loading, setLoading] = useState(false);

  const onboardingSteps = [
    {
      field: 'fullName',
      validation: (value: string) => value.length > 2 && !isInvalidResponse(value),
      question: 'Comment vous appelez-vous ?',
      nextQuestion: 'Dans quelle ville ou région souhaitez-vous proposer vos services ?'
    },
    {
      field: 'location',
      validation: (value: string) => value.length > 2,
      question: 'Dans quelle ville ou région souhaitez-vous proposer vos services ?',
      nextQuestion: 'Quelles sont vos compétences ou services que vous aimeriez proposer ? (ménage, livraison, aide aux personnes, bricolage, etc.)'
    },
    {
      field: 'skills',
      validation: (value: string) => value.length > 2,
      question: 'Quelles sont vos compétences ?',
      nextQuestion: 'Quels sont vos créneaux de disponibilité préférés ? (matin, après-midi, soir, week-end)'
    },
    {
      field: 'availability',
      validation: (value: string) => value.length > 2,
      question: 'Quels sont vos créneaux de disponibilité ?',
      nextQuestion: 'Avez-vous un moyen de transport ? (voiture, vélo, transports en commun, à pied)'
    },
    {
      field: 'transportMeans',
      validation: (value: string) => value.length > 2,
      question: 'Quels sont vos moyens de transport ?',
      nextQuestion: 'Pouvez-vous me donner un numéro de téléphone pour que vos futurs clients puissent vous contacter ?'
    },
    {
      field: 'phone',
      validation: (value: string) => value.length > 5,
      question: 'Quel est votre numéro de téléphone ?',
      nextQuestion: 'Pour finir, écrivez une courte présentation de vous-même (2-3 phrases) qui apparaîtra sur votre profil public.'
    },
    {
      field: 'bio',
      validation: (value: string) => value.length > 10,
      question: 'Écrivez une courte présentation de vous-même',
      nextQuestion: ''
    },
  ];

  const isInvalidResponse = (response: string): boolean => {
    const invalidPatterns = [
      /tu ne connais pas mon nom/i,
      /je ne sais pas/i,
      /aucune idée/i,
      /pas de nom/i,
      /sans nom/i,
      /anonyme/i,
      /pourquoi/i,
      /^non$/i,
      /^oui$/i,
      /^ok$/i,
      /^d'accord$/i,
      /ne veux pas/i,
      /refuse/i,
      /^.{1,2}$/  // Réponses trop courtes (1-2 caractères)
    ];

    return invalidPatterns.some(pattern => pattern.test(response.trim()));
  };

  const generateAIResponse = useCallback(async (userMessage: string, step: number, isRetry: boolean = false): Promise<string> => {
    const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;
    
    if (!openaiApiKey) {
      return getFallbackResponse(userMessage, step, isRetry);
    }

    try {
      const currentStepInfo = onboardingSteps[step];
      const isLastStep = step >= onboardingSteps.length - 1;
      const isValidResponse = currentStepInfo?.validation(userMessage) || false;

      const systemPrompt = `Tu es NOMAD, un assistant IA spécialisé dans l'aide à la création de micro-entreprises locales. Tu es chaleureux, encourageant et professionnel.

CONTEXTE ACTUEL:
- Étape ${step + 1}/${onboardingSteps.length}
- Question actuelle: "${currentStepInfo?.question}"
- Réponse de l'utilisateur: "${userMessage}"
- Réponse valide: ${isValidResponse ? 'OUI' : 'NON'}
- Tentative de retry: ${isRetry ? 'OUI' : 'NON'}

INSTRUCTIONS IMPORTANTES:
1. Si la réponse n'est PAS valide (évasive, incomplète, non pertinente):
   - Explique poliment pourquoi tu as besoin de cette information
   - Reformule la question de manière plus claire
   - Donne un exemple si nécessaire
   - Reste patient et encourageant

2. Si la réponse EST valide:
   - Remercie l'utilisateur en utilisant sa réponse
   - Montre de l'enthousiasme approprié
   - ${isLastStep ? 'Annonce que tu vas créer son profil' : `Pose la question suivante: "${currentStepInfo?.nextQuestion}"`}

3. Ton ton doit être:
   - Naturel et conversationnel
   - Professionnel mais chaleureux
   - Adapté à la situation (patient si retry, enthousiaste si bonne réponse)

Réponds en français, maximum 2-3 phrases courtes.`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage }
          ],
          max_tokens: 150,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || getFallbackResponse(userMessage, step, isRetry);
    } catch (error) {
      console.error('Erreur OpenAI:', error);
      return getFallbackResponse(userMessage, step, isRetry);
    }
  }, []);

  const getFallbackResponse = useCallback((userMessage: string, step: number, isRetry: boolean = false): string => {
    const currentStepInfo = onboardingSteps[step];
    const isValidResponse = currentStepInfo?.validation(userMessage) || false;

    // Si la réponse n'est pas valide, demander une clarification
    if (!isValidResponse) {
      const retryResponses = [
        "Je comprends, mais j'ai vraiment besoin de votre nom complet pour créer votre profil professionnel. Pouvez-vous me dire votre prénom et nom de famille ?",
        "Pour vous aider au mieux, j'ai besoin de connaître votre ville ou région. Dans quelle zone géographique souhaitez-vous travailler ?",
        "C'est important de connaître vos compétences ! Que savez-vous faire ? Par exemple : ménage, jardinage, bricolage, livraison, aide aux personnes...",
        "Pour organiser votre planning, j'ai besoin de vos disponibilités. Êtes-vous plutôt disponible le matin, l'après-midi, le soir ou le week-end ?",
        "Comment vous déplacez-vous ? Avez-vous une voiture, un vélo, ou utilisez-vous les transports en commun ?",
        "Un numéro de téléphone est essentiel pour que vos clients puissent vous contacter. Quel est votre numéro ?",
        "Parlez-moi un peu de vous ! Qui êtes-vous et qu'est-ce qui vous motive dans ce projet ?"
      ];
      return retryResponses[step] || "Pouvez-vous me donner plus de détails s'il vous plaît ?";
    }

    // Si la réponse est valide, continuer normalement
    const successResponses = [
      `Parfait ${userMessage} ! Dans quelle ville ou région souhaitez-vous proposer vos services ?`,
      `${userMessage}, excellent choix de zone ! Maintenant, parlez-moi de vos compétences ou services que vous aimeriez proposer (ménage, livraison, aide aux personnes, bricolage, etc.)`,
      `Formidable ! Ces compétences sont très demandées. Quels sont vos créneaux de disponibilité préférés ? (matin, après-midi, soir, week-end)`,
      `Ces disponibilités sont parfaites ! Avez-vous un moyen de transport ? (voiture, vélo, transports en commun, à pied)`,
      `Excellent ! Cela vous donnera une bonne flexibilité. Pouvez-vous me donner un numéro de téléphone pour que vos futurs clients puissent vous contacter ?`,
      `Parfait ! Pour finir, écrivez une courte présentation de vous-même (2-3 phrases) qui apparaîtra sur votre profil public.`,
      `Magnifique ! J'ai toutes les informations nécessaires. Je vais maintenant créer votre profil de micro-entreprise personnalisé avec vos services et vos outils de gestion. Tous les prix seront configurés en Franc CFA. Cela ne prendra que quelques secondes...`,
    ];
    return successResponses[step] || 'Merci pour cette information !';
  }, []);

  const sendMessage = useCallback(async (userMessage: string) => {
    if (!user) return;

    setLoading(true);

    // Add user message
    const userMessageObj: Message = {
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessageObj]);

    // Vérifier si on est dans les étapes d'onboarding
    if (currentStep < onboardingSteps.length) {
      const step = onboardingSteps[currentStep];
      const isValidResponse = step.validation(userMessage);

      try {
        // Générer la réponse IA
        const aiResponse = await generateAIResponse(userMessage, currentStep, !isValidResponse);
        const aiMessageObj: Message = {
          role: 'assistant',
          content: aiResponse,
          timestamp: new Date().toISOString(),
        };

        setTimeout(() => {
          setMessages(prev => [...prev, aiMessageObj]);
          
          // Si la réponse est valide, passer à l'étape suivante et sauvegarder les données
          if (isValidResponse) {
            const newData = { ...onboardingData };

            switch (step.field) {
              case 'skills':
                newData.skills = userMessage.split(',').map(s => s.trim()).filter(s => s.length > 0);
                break;
              case 'availability':
                newData.availability = userMessage.split(',').map(s => s.trim()).filter(s => s.length > 0);
                break;
              case 'transportMeans':
                newData.transportMeans = userMessage.split(',').map(s => s.trim()).filter(s => s.length > 0);
                break;
              default:
                (newData as any)[step.field] = userMessage;
            }

            setOnboardingData(newData);
            setCurrentStep(currentStep + 1);

            // Si c'était la dernière étape, compléter l'onboarding
            if (currentStep === onboardingSteps.length - 1) {
              setTimeout(() => {
                completeOnboarding(newData as OnboardingData, [...messages, userMessageObj, aiMessageObj]);
              }, 2000);
            }
          }
          // Si la réponse n'est pas valide, on reste sur la même étape
          
          setLoading(false);
        }, 1000);

      } catch (error) {
        console.error('Erreur lors de la génération de la réponse IA:', error);
        const fallbackMessage: Message = {
          role: 'assistant',
          content: getFallbackResponse(userMessage, currentStep, !isValidResponse),
          timestamp: new Date().toISOString(),
        };
        
        setTimeout(() => {
          setMessages(prev => [...prev, fallbackMessage]);
          setLoading(false);
        }, 1000);
      }
    } else {
      setLoading(false);
    }
  }, [user, currentStep, onboardingData, messages, generateAIResponse, getFallbackResponse]);

  const completeOnboarding = async (data: OnboardingData, conversationMessages: Message[]) => {
    if (!user) return;

    try {
      // Create username from email
      const username = user.email?.split('@')[0] || 'user';

      // Save user profile
      const { error: userError } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          email: user.email!,
          username,
          full_name: data.fullName,
          bio: data.bio,
          location: data.location,
          phone: data.phone,
          skills: data.skills,
          availability: data.availability,
          transport_means: data.transportMeans,
          onboarding_completed: true,
          updated_at: new Date().toISOString(),
        });

      if (userError) throw userError;

      // Save conversation
      const { error: conversationError } = await supabase
        .from('ai_conversations')
        .insert({
          user_id: user.id,
          messages: conversationMessages,
          conversation_type: 'onboarding',
        });

      if (conversationError) throw conversationError;

      // Generate initial services based on skills with CFA pricing
      const services = data.skills.map(skill => ({
        user_id: user.id,
        title: `Service de ${skill}`,
        description: `Service professionnel de ${skill} dans la région de ${data.location}`,
        price_from: 5000, // Prix en CFA
        price_to: 15000,  // Prix en CFA
        price_unit: 'heure',
        category: skill,
        is_active: true,
      }));

      const { error: servicesError } = await supabase
        .from('services')
        .insert(services);

      if (servicesError) throw servicesError;

      // Redirect to dashboard
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  return {
    messages,
    sendMessage,
    loading,
    currentStep,
    isComplete: currentStep >= onboardingSteps.length,
  };
};