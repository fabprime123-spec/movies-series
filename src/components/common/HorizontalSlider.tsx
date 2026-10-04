import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { IconButton } from './IconButton';

export interface HorizontalSliderProps {
  id?: string;
  children: React.ReactNode;
  scrollAmount?: number;
  gap?: 'sm' | 'md' | 'lg';
  gutter?: 'standard' | 'compact' | 'none';
  header?: React.ReactNode;
  showButtons?: boolean;
  buttonsPosition?: 'header' | 'floating' | 'none';
  className?: string;
  trackClassName?: string;
}

export const HorizontalSlider: React.FC<HorizontalSliderProps> = ({
  id,
  children,
  scrollAmount = 500,
  gap = 'md',
  gutter = 'standard',
  header,
  showButtons = true,
  buttonsPosition = 'header',
  className = '',
  trackClassName = '',
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (el) {
      const isStart = el.scrollLeft <= 10;
      const isEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 10;
      setCanScrollLeft(!isStart);
      setCanScrollRight(!isEnd);
    }
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      checkScroll();
      el.addEventListener('scroll', checkScroll, { passive: true });
      window.addEventListener('resize', checkScroll);
      return () => {
        el.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [checkScroll, children]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = direction === 'left' ? -scrollAmount : scrollAmount;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  const gapClasses = {
    sm: 'gap-3',
    md: 'gap-4 sm:gap-5',
    lg: 'gap-6 sm:gap-8',
  };

  const gutterClasses = {
    standard: 'px-4 sm:px-8 lg:px-12',
    compact: 'px-3 sm:px-4',
    none: 'px-0',
  };

  const navButtons = showButtons && (
    <div className="flex items-center gap-1.5 shrink-0">
      <IconButton
        icon={<ChevronLeft className="w-4 h-4" />}
        aria-label="Scroll left"
        size="sm"
        disabled={!canScrollLeft}
        onClick={() => scroll('left')}
      />
      <IconButton
        icon={<ChevronRight className="w-4 h-4" />}
        aria-label="Scroll right"
        size="sm"
        disabled={!canScrollRight}
        onClick={() => scroll('right')}
      />
    </div>
  );

  return (
    <div id={id} className={`w-full group/slider relative ${className}`}>
      {/* Header if provided, with optional navigation buttons */}
      {header && (
        <div className="flex items-center justify-between">
          <div className="flex-1">{header}</div>
          {buttonsPosition === 'header' && navButtons}
        </div>
      )}

      {/* Floating Buttons if requested */}
      {buttonsPosition === 'floating' && showButtons && (
        <>
          <button
            type="button"
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
            className={`absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md text-white border border-white/20 shadow-xl transition-all ${
              canScrollLeft ? 'opacity-0 group-hover/slider:opacity-100 hover:scale-110' : 'hidden'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            aria-label="Scroll right"
            className={`absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md text-white border border-white/20 shadow-xl transition-all ${
              canScrollRight ? 'opacity-0 group-hover/slider:opacity-100 hover:scale-110' : 'hidden'
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Track */}
      <div
        ref={scrollRef}
        className={`flex ${gapClasses[gap]} overflow-x-auto scrollbar-none snap-x snap-mandatory py-2 ${gutterClasses[gutter]} carousel-contain ${trackClassName}`}
      >
        {children}
      </div>
    </div>
  );
};
