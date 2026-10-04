import React from 'react';

export type IconButtonVariant = 'default' | 'subtle' | 'accent' | 'glass' | 'ghost' | 'danger';
export type IconButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  rounded?: 'full' | 'xl' | 'lg';
  active?: boolean;
  'aria-label': string;
  icon: React.ReactNode;
}

export const IconButton: React.FC<IconButtonProps> = ({
  variant = 'default',
  size = 'md',
  rounded = 'xl',
  active = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center transition-all duration-200 select-none active:scale-95 disabled:opacity-40 disabled:pointer-events-none disabled:active:scale-100 cursor-pointer';

  const sizeStyles: Record<IconButtonSize, string> = {
    xs: 'w-7 h-7 text-xs p-1',
    sm: 'w-8 h-8 text-sm p-1.5',
    md: 'w-9 h-9 sm:w-10 sm:h-10 text-base p-2',
    lg: 'w-11 h-11 sm:w-12 sm:h-12 text-lg p-2.5',
  };

  const roundedStyles = {
    full: 'rounded-full',
    xl: 'rounded-xl',
    lg: 'rounded-lg',
  };

  const variantStyles: Record<IconButtonVariant, string> = {
    default:
      'border border-white/10 bg-white/5 text-white/80 hover:bg-white/15 hover:text-white hover:border-white/25 shadow-sm',
    subtle:
      'border border-border bg-card text-foreground hover:bg-muted/20 hover:text-foreground shadow-sm',
    accent: active
      ? 'bg-accent text-white shadow-md shadow-accent/30'
      : 'bg-accent/20 border border-accent/40 text-accent hover:bg-accent/30 hover:border-accent',
    glass:
      'bg-black/40 backdrop-blur-md border border-white/15 text-white hover:bg-black/60 hover:border-white/30',
    ghost:
      'bg-transparent text-white/60 hover:text-white hover:bg-white/10',
    danger:
      'bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/25 hover:text-rose-200',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${roundedStyles[rounded]} ${variantStyles[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon}
    </button>
  );
};
