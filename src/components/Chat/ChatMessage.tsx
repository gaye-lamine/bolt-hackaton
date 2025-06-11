import React from 'react';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  message: {
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  };
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex max-w-xs lg:max-w-md ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end`}>
        <div className={`flex-shrink-0 ${isUser ? 'ml-2' : 'mr-2'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isUser 
              ? 'bg-purple-500 text-white' 
              : 'bg-teal-500 text-white'
          }`}>
            {isUser ? <User size={16} /> : <Bot size={16} />}
          </div>
        </div>
        <div className={`px-4 py-2 rounded-2xl ${
          isUser 
            ? 'bg-purple-500 text-white rounded-br-sm' 
            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-sm'
        }`}>
          <p className="text-sm">{message.content}</p>
        </div>
      </div>
    </div>
  );
};