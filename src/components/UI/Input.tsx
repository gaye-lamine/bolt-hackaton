import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helper,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-4 py-3 border-2 border-neutral-200 dark:border-neutral-600 rounded-xl shadow-soft
          bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-50
          placeholder-neutral-500 dark:placeholder-neutral-400
          focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-200
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      {helper && !error && (
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">{helper}</p>
      )}
    </div>
  );
};