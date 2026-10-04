import React from 'react';

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  icon?: React.ReactNode;
  iconBg?: string;
  iconColor?: string;
  action?: React.ReactNode;
  className?: string;
  id?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  badge,
  icon,
  iconBg = 'bg-accent/20',
  iconColor = 'text-accent',
  action,
  className = '',
  id,
}) => {
  return (
    <div
      id={id}
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-8 lg:px-12 mb-4 ${className}`}
    >
      <div className="flex items-center gap-3">
        {icon && (
          <div
            className={`p-2 rounded-xl ${iconBg} ${iconColor} border border-white/10 shrink-0 shadow-sm`}
          >
            {icon}
          </div>
        )}
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold font-['Outfit',sans-serif] text-foreground tracking-tight">
              {title}
            </h2>
            {badge && (
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/25">
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs sm:text-sm text-muted line-clamp-1 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {action && <div className="flex items-center gap-2 shrink-0">{action}</div>}
    </div>
  );
};
