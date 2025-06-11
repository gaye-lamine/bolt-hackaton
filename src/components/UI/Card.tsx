import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  padding = 'md',
  hover = false
}) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const hoverClasses = hover 
    ? 'hover:shadow-medium hover:scale-[1.01] transition-all duration-200' 
    : '';

  return (
    <div className={`
      bg-white dark:bg-neutral-700 rounded-2xl shadow-soft border border-neutral-200 dark:border-neutral-600
      ${paddingClasses[padding]} ${hoverClasses} ${className}
    `}>
      {children}
    </div>
  );
};