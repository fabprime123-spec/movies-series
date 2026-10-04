import React from 'react';

export type BoxVariant = 'glass' | 'panel' | 'subtle' | 'glow' | 'card';
export type BoxPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';

export interface GlassBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BoxVariant;
  padding?: BoxPadding;
  rounded?: 'lg' | 'xl' | '2xl' | '3xl' | 'none';
  interactive?: boolean;
  children: React.ReactNode;
}

export const GlassBox: React.FC<GlassBoxProps> = ({
  variant = 'glass',
  padding = 'md',
  rounded = '2xl',
  interactive = false,
  children,
  className = '',
  ...props
}) => {
  const baseStyles = 'transition-all duration-200';

  const roundedClasses = {
    none: 'rounded-none',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl',
  };

  const paddingClasses: Record<BoxPadding, string> = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4 sm:p-5',
    lg: 'p-6 sm:p-8',
    xl: 'p-8 sm:p-10',
  };

  const variantClasses: Record<BoxVariant, string> = {
    glass:
      'bg-[#141622]/60 backdrop-blur-xl border border-white/10 shadow-xl shadow-black/30',
    panel:
      'bg-white/[0.03] border border-white/10 shadow-md',
    subtle:
      'bg-black/30 border border-white/5',
    glow:
      'bg-[#121420]/80 backdrop-blur-xl border border-accent/30 shadow-lg shadow-accent/10',
    card:
      'bg-[#0f111a] border border-white/10 shadow-lg shadow-black/40',
  };

  const interactiveClasses = interactive
    ? 'hover:border-accent/40 hover:-translate-y-0.5 hover:shadow-accent/15 cursor-pointer active:scale-[0.99]'
    : '';

  return (
    <div
      className={`${baseStyles} ${roundedClasses[rounded]} ${paddingClasses[padding]} ${variantClasses[variant]} ${interactiveClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
