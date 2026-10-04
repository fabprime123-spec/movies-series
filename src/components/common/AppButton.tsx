import React from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'pill' | 'danger';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface AppButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  active?: boolean;
  fullWidth?: boolean;
  children?: React.ReactNode;
}

export const AppButton: React.FC<AppButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  active = false,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-200 select-none active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 cursor-pointer';

  const sizeStyles: Record<ButtonSize, string> = {
    xs: 'text-[11px] px-2.5 py-1 rounded-lg gap-1.5',
    sm: 'text-xs px-3 py-1.5 rounded-xl gap-1.5',
    md: 'text-xs sm:text-sm px-4 py-2.5 rounded-xl gap-2',
    lg: 'text-sm sm:text-base px-6 py-3 rounded-2xl gap-2.5',
  };

  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      'bg-gradient-to-r from-accent to-accent-hover text-white shadow-lg shadow-accent/25 hover:opacity-95 hover:shadow-accent/40',
    secondary:
      'bg-white/5 border border-white/10 text-white/90 hover:bg-white/10 hover:text-white hover:border-white/20',
    ghost:
      'bg-transparent text-white/70 hover:text-white hover:bg-white/5',
    outline:
      'bg-transparent border border-accent/40 text-accent hover:bg-accent/10 hover:border-accent',
    pill: active
      ? 'bg-accent/20 border border-accent text-accent font-bold shadow-sm'
      : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white',
    danger:
      'bg-rose-500/20 border border-rose-500/40 text-rose-400 hover:bg-rose-500/30 hover:text-rose-300',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>
      )}
      {children && <span>{children}</span>}
      {!loading && icon && iconPosition === 'right' && (
        <span className="shrink-0">{icon}</span>
      )}
    </button>
  );
};
