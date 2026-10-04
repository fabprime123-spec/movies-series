import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { IconButton } from './IconButton';

export interface VerticalSliderProps {
  id?: string;
  children: React.ReactNode;
  maxHeight?: string;
  scrollAmount?: number;
  showButtons?: boolean;
  className?: string;
  trackClassName?: string;
}

export const VerticalSlider: React.FC<VerticalSliderProps> = ({
  id,
  children,
  maxHeight = '500px',
  scrollAmount = 240,
  showButtons = true,
  className = '',
  trackClassName = '',
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (el) {
      const isTop = el.scrollTop <= 5;
      const isBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 5;
      setCanScrollUp(!isTop);
      setCanScrollDown(!isBottom);
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

  const scroll = (direction: 'up' | 'down') => {
    if (scrollRef.current) {
      const amount = direction === 'up' ? -scrollAmount : scrollAmount;
      scrollRef.current.scrollBy({ top: amount, behavior: 'smooth' });
    }
  };

  return (
    <div id={id} className={`relative flex flex-col items-center group/vslider ${className}`}>
      {showButtons && (
        <div className="w-full flex justify-center py-1">
          <IconButton
            icon={<ChevronUp className="w-4 h-4" />}
            aria-label="Scroll up"
            size="sm"
            rounded="full"
            disabled={!canScrollUp}
            onClick={() => scroll('up')}
            className={`transition-opacity ${canScrollUp ? 'opacity-100' : 'opacity-20'}`}
          />
        </div>
      )}

      <div
        ref={scrollRef}
        style={{ maxHeight }}
        className={`w-full overflow-y-auto scrollbar-none snap-y py-2 space-y-3 ${trackClassName}`}
      >
        {children}
      </div>

      {showButtons && (
        <div className="w-full flex justify-center py-1">
          <IconButton
            icon={<ChevronDown className="w-4 h-4" />}
            aria-label="Scroll down"
            size="sm"
            rounded="full"
            disabled={!canScrollDown}
            onClick={() => scroll('down')}
            className={`transition-opacity ${canScrollDown ? 'opacity-100' : 'opacity-20'}`}
          />
        </div>
      )}
    </div>
  );
};
