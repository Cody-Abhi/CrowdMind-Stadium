import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: 'cyan' | 'blue' | 'purple' | 'green' | 'danger' | 'warning' | 'info';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'cyan',
  className = '',
  ...props
}) => {
  const baseClasses = 'px-2 py-0.5 rounded text-[8px] font-mono border tracking-wider uppercase';
  
  const variantClasses = {
    cyan: 'bg-neon-cyan-500/10 border-neon-cyan-500/30 text-neon-cyan-400',
    blue: 'bg-neon-blue-500/10 border-neon-blue-500/30 text-neon-blue-400',
    purple: 'bg-neon-purple-500/10 border-neon-purple-500/30 text-neon-purple-400',
    green: 'bg-state-success-bg/20 border-state-success-text/30 text-state-success-text',
    danger: 'bg-state-danger-bg/20 border-state-danger-text/30 text-state-danger-text',
    warning: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
    info: 'bg-void-700/50 border-void-600/30 text-void-300'
  };

  return (
    <span
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
