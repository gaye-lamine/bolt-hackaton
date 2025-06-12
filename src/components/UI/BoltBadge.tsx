import React from 'react';

interface BoltBadgeProps {
  variant?: 'white' | 'black' | 'text';
  position?: 'top-right' | 'bottom-right' | 'bottom-left';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const BoltBadge: React.FC<BoltBadgeProps> = ({ 
  variant = 'white', 
  position = 'top-right',
  size = 'md',
  className = '' 
}) => {
  const sizes = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
  };

  const positions = {
    'top-right': 'fixed top-4 right-4 z-50',
    'bottom-right': 'fixed bottom-4 right-4 z-50',
    'bottom-left': 'fixed bottom-4 left-4 z-50',
  };

  const getImageSrc = () => {
    switch (variant) {
      case 'white':
        return '/white_circle_360x360.png';
      case 'black':
        return '/black_circle_360x360.png';
      case 'text':
        return '/logotext_poweredby_360w.png';
      default:
        return '/white_circle_360x360.png';
    }
  };

  return (
    <a
      href="https://bolt.new/"
      target="_blank"
      rel="noopener noreferrer"
      className={`${positions[position]} ${className} group transition-all duration-300 hover:scale-110 hover:shadow-lg`}
      title="Built with Bolt.new"
    >
      <img
        src={getImageSrc()}
        alt="Built with Bolt.new"
        className={`${sizes[size]} object-contain transition-all duration-300 group-hover:brightness-110`}
      />
    </a>
  );
};