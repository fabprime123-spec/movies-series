import React from 'react';
import { Film } from 'lucide-react';
import { AppButton } from './AppButton';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  actionIcon?: React.ReactNode;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  actionIcon,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-3xl bg-[#141622]/40 border border-white/10 backdrop-blur-md max-w-xl mx-auto my-6 space-y-4 ${className}`}
    >
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white/40 shadow-inner">
        {icon || <Film className="w-8 h-8 text-white/40" />}
      </div>

      <div className="space-y-1.5 max-w-md">
        <h3 className="font-['Outfit',sans-serif] text-base sm:text-lg font-bold text-white tracking-tight">
          {title}
        </h3>
        {description && (
          <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {actionLabel && onAction && (
        <div className="pt-2">
          <AppButton
            variant="secondary"
            size="sm"
            icon={actionIcon}
            onClick={onAction}
          >
            {actionLabel}
          </AppButton>
        </div>
      )}
    </div>
  );
};
