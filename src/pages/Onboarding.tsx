import React from 'react';
import { ChatMessage } from '../components/Chat/ChatMessage';
import { ChatInput } from '../components/Chat/ChatInput';
import { useOnboarding } from '../hooks/useOnboarding';
import { Header } from '../components/Layout/Header';
import { Card } from '../components/UI/Card';

export const Onboarding = () => {
  const { messages, sendMessage, loading, isComplete } = useOnboarding();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Configuration de votre micro-entreprise
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Notre assistant IA va vous guider pour créer votre profil professionnel personnalisé
          </p>
        </div>

        <Card className="h-96 md:h-[500px] flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))}
            
            {loading && (
              <div className="flex justify-start mb-4">
                <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">L'assistant réfléchit...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <ChatInput
            onSendMessage={sendMessage}
            disabled={loading || isComplete}
            placeholder={isComplete ? "Configuration terminée..." : "Tapez votre réponse..."}
          />
        </Card>

        {/* Progress Indicator */}
        <div className="mt-6 text-center">
          <div className="flex justify-center space-x-2 mb-2">
            {[...Array(7)].map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index < messages.length / 2
                    ? 'bg-purple-500'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Configuration en cours...
          </p>
        </div>
      </div>
    </div>
  );
};