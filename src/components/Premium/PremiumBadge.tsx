import React from 'react';
import { Crown, Sparkles } from 'lucide-react';

interface PremiumBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const PremiumBadge: React.FC<PremiumBadgeProps> = ({ 
  size = 'md', 
  showText = true,
  className = '' 
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={`inline-flex items-center ${className}`}>
      <div className="relative">
        <Crown className={`${sizes[size]} text-yellow-500`} />
        <Sparkles className="absolute -top-1 -right-1 w-2 h-2 text-yellow-400 animate-pulse" />
      </div>
      {showText && (
        <span className={`ml-1 font-medium text-yellow-600 dark:text-yellow-400 ${textSizes[size]}`}>
          Premium
        </span>
      )}
    </div>
  );
};