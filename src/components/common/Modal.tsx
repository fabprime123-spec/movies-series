import React, { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { IconButton } from './IconButton';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  headerAction?: React.ReactNode;
  footer?: React.ReactNode;
  size?: ModalSize;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  hideHeader?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  headerAction,
  footer,
  size = 'lg',
  children,
  className = '',
  bodyClassName = '',
  closeOnBackdropClick = true,
  closeOnEscape = true,
  hideHeader = false,
}) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === 'Escape') {
        onClose();
      }
    },
    [closeOnEscape, onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const sizeClasses: Record<ModalSize, string> = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl',
    full: 'max-w-[96vw] h-[92vh]',
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
    >
      {/* Backdrop */}
      <div
        onClick={closeOnBackdropClick ? onClose : undefined}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
      />

      {/* Modal Dialog Surface */}
      <div
        className={`relative z-10 w-full ${sizeClasses[size]} rounded-2xl sm:rounded-3xl border border-white/10 bg-[#0c0e18]/95 backdrop-blur-2xl shadow-2xl flex flex-col overflow-hidden text-white my-auto max-h-[92vh] ${className}`}
      >
        {/* Header */}
        {!hideHeader && (
          <div className="flex items-center justify-between border-b border-white/10 px-5 sm:px-6 py-4 bg-white/[0.02]">
            <div className="flex items-center gap-3">
              {icon && (
                <div className="p-2 rounded-xl bg-accent/20 border border-accent/30 text-accent">
                  {icon}
                </div>
              )}
              <div>
                {title && (
                  <h3 className="font-['Outfit',sans-serif] text-base sm:text-lg font-bold text-white tracking-tight">
                    {title}
                  </h3>
                )}
                {subtitle && (
                  <p className="text-xs text-white/50">{subtitle}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {headerAction}
              <IconButton
                icon={<X className="w-4 h-4" />}
                aria-label="Close modal"
                size="sm"
                rounded="full"
                variant="default"
                onClick={onClose}
              />
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className={`flex-1 overflow-y-auto p-5 sm:p-6 ${bodyClassName}`}>
          {children}
        </div>

        {/* Optional Footer */}
        {footer && (
          <div className="border-t border-white/10 px-5 sm:px-6 py-4 bg-black/40 flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
