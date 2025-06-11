import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'error';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]';
  
  const variants = {
    primary: 'bg-purple-500 text-white hover:bg-purple-600 focus:ring-purple-500 shadow-soft hover:shadow-medium',
    secondary: 'bg-yellow-300 text-neutral-900 hover:bg-yellow-400 focus:ring-yellow-500 shadow-soft hover:shadow-medium',
    outline: 'border-2 border-neutral-200 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 focus:ring-purple-500 hover:border-purple-300',
    ghost: 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 focus:ring-purple-500',
    success: 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-500 shadow-soft hover:shadow-medium',
    error: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 shadow-soft hover:shadow-medium',
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
};