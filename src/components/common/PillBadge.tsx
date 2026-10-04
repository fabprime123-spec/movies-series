import React from 'react';
import { X } from 'lucide-react';

export type PillVariant = 'accent' | 'amber' | 'sky' | 'purple' | 'rose' | 'neutral';
export type PillSize = 'xs' | 'sm' | 'md';

export interface PillBadgeProps {
  label: React.ReactNode;
  icon?: React.ReactNode;
  variant?: PillVariant;
  size?: PillSize;
  active?: boolean;
  clickable?: boolean;
  onRemove?: () => void;
  onClick?: () => void;
  className?: string;
}

export const PillBadge: React.FC<PillBadgeProps> = ({
  label,
  icon,
  variant = 'neutral',
  size = 'sm',
  active = false,
  clickable = false,
  onRemove,
  onClick,
  className = '',
}) => {
  const sizeStyles: Record<PillSize, string> = {
    xs: 'text-[10px] px-2 py-0.5 gap-1 rounded-md',
    sm: 'text-[11px] px-2.5 py-0.5 gap-1.5 rounded-full',
    md: 'text-xs px-3 py-1 gap-1.5 rounded-full',
  };

  const variantStyles: Record<PillVariant, { active: string; idle: string }> = {
    accent: {
      active: 'bg-accent text-white font-bold shadow-md shadow-accent/20 border-transparent',
      idle: 'bg-accent/15 border-accent/30 text-accent hover:bg-accent/25 hover:text-white',
    },
    amber: {
      active: 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/20 border-transparent',
      idle: 'bg-amber-500/15 border-amber-500/30 text-amber-300 hover:bg-amber-500/25 hover:text-white',
    },
    sky: {
      active: 'bg-sky-500 text-white font-bold shadow-md shadow-sky-500/20 border-transparent',
      idle: 'bg-sky-500/15 border-sky-500/30 text-sky-300 hover:bg-sky-500/25 hover:text-white',
    },
    purple: {
      active: 'bg-purple-500 text-white font-bold shadow-md shadow-purple-500/20 border-transparent',
      idle: 'bg-purple-500/15 border-purple-500/30 text-purple-300 hover:bg-purple-500/25 hover:text-white',
    },
    rose: {
      active: 'bg-rose-500 text-white font-bold shadow-md shadow-rose-500/20 border-transparent',
      idle: 'bg-rose-500/15 border-rose-500/30 text-rose-300 hover:bg-rose-500/25 hover:text-white',
    },
    neutral: {
      active: 'bg-white/20 border-white/40 text-white font-bold',
      idle: 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white hover:border-white/20',
    },
  };

  const currentVariant = variantStyles[variant];
  const styling = active ? currentVariant.active : currentVariant.idle;
  const cursor = clickable || onClick ? 'cursor-pointer active:scale-95 transition-all select-none' : '';

  return (
    <span
      onClick={clickable || onClick ? onClick : undefined}
      className={`inline-flex items-center border font-medium transition-all ${sizeStyles[size]} ${styling} ${cursor} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="truncate">{label}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 p-0.5 rounded-full hover:bg-white/20 text-white/70 hover:text-white transition-colors"
          aria-label="Remove filter"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
};
