import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, ExternalLink, Download, Image as ImageIcon, Sparkles } from 'lucide-react';
import { MediaImage } from '../types';
import { useTheme } from '../context/ThemeContext';

interface ImageGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: MediaImage[];
  initialIndex?: number;
  title: string;
}

export const ImageGalleryModal: React.FC<ImageGalleryModalProps> = ({
  isOpen,
  onClose,
  images,
  initialIndex = 0,
  title,
}) => {
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);
  const { accentConfig } = useTheme();

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, isOpen]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handlePrev, handleNext]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex] || images[0];
  const isBackdrop = currentImage.type === 'backdrop' || (currentImage.aspectRatio && currentImage.aspectRatio > 1.2);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-2 sm:p-4 md:p-6 select-none overflow-hidden">
        {/* Top Control Bar */}
        <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between p-4 sm:p-6 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl bg-gradient-to-br ${accentConfig.gradient} text-white shadow-lg`}>
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight line-clamp-1">
                {title}
              </h3>
              <p className="text-xs text-white/50 flex items-center gap-2">
                <span>Photo {currentIndex + 1} of {images.length}</span>
                {currentImage.width && currentImage.height && (
                  <span className="hidden sm:inline px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-white/70">
                    {currentImage.width} × {currentImage.height}
                  </span>
                )}
                <span className="capitalize px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-white/70">
                  {currentImage.type || (isBackdrop ? 'Backdrop' : 'Poster')}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={currentImage.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all text-xs flex items-center gap-1.5"
              title="Open full resolution in new tab"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden md:inline">Full Res</span>
            </a>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-rose-500/30 hover:text-rose-300 text-white/80 transition-all"
              title="Close viewer (ESC)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Previous Button */}
        {images.length > 1 && (
          <button
            onClick={handlePrev}
            className="absolute left-2 sm:left-6 z-20 p-3 sm:p-4 rounded-2xl bg-black/60 hover:bg-black/90 border border-white/10 text-white/80 hover:text-white hover:scale-110 active:scale-95 transition-all backdrop-blur-md"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
        )}

        {/* Next Button */}
        {images.length > 1 && (
          <button
            onClick={handleNext}
            className="absolute right-2 sm:right-6 z-20 p-3 sm:p-4 rounded-2xl bg-black/60 hover:bg-black/90 border border-white/10 text-white/80 hover:text-white hover:scale-110 active:scale-95 transition-all backdrop-blur-md"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
        )}

        {/* Active Center Image */}
        <div className="relative w-full h-full max-w-6xl max-h-[75vh] sm:max-h-[80vh] flex items-center justify-center my-auto">
          <motion.img
            key={currentImage.url}
            src={currentImage.url}
            alt={`${title} visual ${currentIndex + 1}`}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="max-h-full max-w-full object-contain rounded-xl sm:rounded-2xl shadow-2xl border border-white/10"
          />
        </div>

        {/* Bottom Thumbnail Strip */}
        {images.length > 1 && (
          <div className="absolute bottom-3 inset-x-0 z-20 flex justify-center px-4">
            <div className="flex items-center gap-2 p-2 rounded-2xl bg-black/70 border border-white/10 backdrop-blur-xl max-w-3xl overflow-x-auto scrollbar-none">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative shrink-0 rounded-lg overflow-hidden transition-all duration-200 ${
                    idx === currentIndex
                      ? `ring-2 ring-offset-2 ring-offset-black scale-105 opacity-100 ring-orange-500`
                      : 'opacity-50 hover:opacity-85'
                  }`}
                  style={{ width: img.type === 'poster' ? '36px' : '64px', height: '40px' }}
                >
                  <img
                    src={img.url}
                    alt="Thumbnail"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </AnimatePresence>
  );
};
