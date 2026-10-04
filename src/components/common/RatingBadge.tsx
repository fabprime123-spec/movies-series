import React from 'react';
import { Star } from 'lucide-react';

export type RatingBadgeVariant = 'glass' | 'solid' | 'minimal' | 'accent';
export type RatingBadgeSize = 'xs' | 'sm' | 'md' | 'lg';

export interface RatingBadgeProps {
  rating?: number | null;
  count?: number;
  variant?: RatingBadgeVariant;
  size?: RatingBadgeSize;
  showStar?: boolean;
  className?: string;
}

export const RatingBadge: React.FC<RatingBadgeProps> = ({
  rating,
  count,
  variant = 'glass',
  size = 'sm',
  showStar = true,
  className = '',
}) => {
  if (rating === undefined || rating === null || isNaN(rating) || rating <= 0) {
    return null;
  }

  const formattedRating = Number(rating).toFixed(1);

  const sizeClasses: Record<RatingBadgeSize, { container: string; star: string; text: string }> = {
    xs: {
      container: 'px-1.5 py-0.5 gap-1 rounded-md text-[10px]',
      star: 'w-2.5 h-2.5',
      text: 'text-[10px]',
    },
    sm: {
      container: 'px-2 py-0.5 gap-1 rounded-lg text-[11px]',
      star: 'w-3 h-3',
      text: 'text-[11px]',
    },
    md: {
      container: 'px-2.5 py-1 gap-1.5 rounded-xl text-xs',
      star: 'w-3.5 h-3.5',
      text: 'text-xs',
    },
    lg: {
      container: 'px-3 py-1.5 gap-1.5 rounded-xl text-sm',
      star: 'w-4 h-4',
      text: 'text-sm',
    },
  };

  const variantClasses: Record<RatingBadgeVariant, string> = {
    glass: 'bg-black/75 backdrop-blur-md border border-white/10 text-amber-400 font-bold shadow-md',
    solid: 'bg-amber-500 text-black font-extrabold shadow-sm',
    minimal: 'text-amber-400 font-semibold',
    accent: 'bg-accent/20 border border-accent/40 text-accent font-bold',
  };

  const currentSize = sizeClasses[size];

  return (
    <div
      className={`inline-flex items-center shrink-0 ${currentSize.container} ${variantClasses[variant]} ${className}`}
      aria-label={`Rating: ${formattedRating} out of 10`}
    >
      {showStar && (
        <Star
          className={`${currentSize.star} ${
            variant === 'solid' ? 'fill-black text-black' : 'fill-amber-400 text-amber-400'
          }`}
        />
      )}
      <span className={`font-mono font-bold leading-none ${currentSize.text}`}>
        {formattedRating}
      </span>
      {count !== undefined && count > 0 && (
        <span className="text-[10px] text-white/50 font-normal ml-0.5 hidden sm:inline">
          ({count > 1000 ? `${(count / 1000).toFixed(1)}k` : count})
        </span>
      )}
    </div>
  );
};
