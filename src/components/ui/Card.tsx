import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'glass' | 'solid' | 'panel';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'glass',
  ...props
}) => {
  const baseClasses = 'border rounded-2xl p-5 transition-all duration-300';
  
  const variantClasses = {
    glass: 'bg-void-850/80 border-void-600/20 backdrop-blur-md hover:border-void-600/40',
    solid: 'bg-void-900 border-void-700/50',
    panel: 'bg-void-850 border-void-600/30 shadow-elevation-medium'
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
