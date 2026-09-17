import React, { useEffect, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink, 
  Download, 
  Check, 
  Loader2, 
  Image as ImageIcon, 
  ZoomIn, 
  ZoomOut,
  Maximize
} from 'lucide-react';
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
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const { accentConfig } = useTheme();

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setIsZoomed(false);
  }, [initialIndex, isOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handlePrev = useCallback(() => {
    setIsZoomed(false);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setIsZoomed(false);
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'z' || e.key === 'Z') setIsZoomed((prev) => !prev);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handlePrev, handleNext]);

  const currentImage = images[currentIndex] || images[0];

  const handleDownload = async () => {
    if (!currentImage?.url || isDownloading) return;
    setIsDownloading(true);
    setDownloadSuccess(false);

    try {
      // Fetch image as blob for direct local download
      const response = await fetch(currentImage.url, { mode: 'cors' });
      if (!response.ok) throw new Error('Network response was not ok');
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const safeTitle = title.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
      const imgType = currentImage.type || 'image';
      const ext = currentImage.url.includes('.png') ? 'png' : 'jpg';
      const filename = `${safeTitle}_${imgType}_${currentIndex + 1}.${ext}`;

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    } catch (err) {
      console.warn('Direct blob download failed, falling back to direct tab/download', err);
      // Fallback: open image in new tab or trigger direct download link
      const fallbackLink = document.createElement('a');
      fallbackLink.href = currentImage.url;
      fallbackLink.target = '_blank';
      fallbackLink.rel = 'noopener noreferrer';
      fallbackLink.download = `${title.toLowerCase().replace(/\s+/g, '_')}_${currentIndex + 1}.jpg`;
      document.body.appendChild(fallbackLink);
      fallbackLink.click();
      document.body.removeChild(fallbackLink);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    } finally {
      setIsDownloading(false);
    }
  };

  if (!isOpen || images.length === 0) return null;

  const isBackdrop = currentImage?.type === 'backdrop' || (currentImage?.aspectRatio && currentImage.aspectRatio > 1.2);

  const modalContent = (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-[99999] flex flex-col items-center justify-between bg-black/96 backdrop-blur-3xl select-none overflow-hidden h-screen w-screen"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        {/* Top Control Bar */}
        <div className="relative z-30 w-full flex items-center justify-between px-4 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-b from-black/90 via-black/60 to-transparent border-b border-white/10 backdrop-blur-md">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`p-2 rounded-xl bg-gradient-to-br ${accentConfig.gradient} text-white shadow-lg shrink-0`}>
              <ImageIcon className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
                {title}
              </h3>
              <div className="text-xs text-white/50 flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-white/80">Photo {currentIndex + 1} of {images.length}</span>
                {currentImage.width && currentImage.height && (
                  <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-white/80 font-mono">
                    {currentImage.width} × {currentImage.height}
                  </span>
                )}
                <span className="capitalize px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-white/80">
                  {currentImage.type || (isBackdrop ? 'Backdrop' : 'Poster')}
                </span>
                {currentImage.width && currentImage.width >= 3000 && (
                  <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                    4K UHD
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons on top right */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Zoom toggle button */}
            <button
              onClick={() => setIsZoomed((prev) => !prev)}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all text-xs flex items-center gap-1.5 border border-white/10"
              title={isZoomed ? 'Zoom Out (Z)' : 'Zoom In (Z)'}
            >
              {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
              <span className="hidden sm:inline">{isZoomed ? 'Fit' : 'Zoom'}</span>
            </button>

            {/* Primary Download Image Button */}
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className={`p-2 sm:px-3.5 sm:py-2 rounded-xl font-semibold transition-all text-xs flex items-center gap-1.5 shadow-lg active:scale-95 ${
                downloadSuccess
                  ? 'bg-emerald-600 text-white'
                  : `bg-gradient-to-r ${accentConfig.gradient} text-white hover:brightness-110`
              }`}
              title="Download image to device"
            >
              {isDownloading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : downloadSuccess ? (
                <Check className="w-4 h-4 stroke-[3]" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">
                {isDownloading ? 'Downloading...' : downloadSuccess ? 'Saved!' : 'Download'}
              </span>
            </button>

            {/* Open Full Resolution in new tab */}
            <a
              href={currentImage.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 sm:p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all text-xs flex items-center gap-1.5 border border-white/10"
              title="Open full resolution in new tab"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden md:inline">Full Res</span>
            </a>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 sm:p-2.5 rounded-xl bg-white/10 hover:bg-rose-500/40 hover:text-rose-200 text-white/80 transition-all border border-white/10"
              title="Close modal (ESC)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Arrow Left */}
        {images.length > 1 && (
          <button
            onClick={handlePrev}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 p-3 sm:p-4 rounded-2xl bg-black/60 hover:bg-black/90 border border-white/15 text-white/90 hover:text-white hover:scale-110 active:scale-95 transition-all backdrop-blur-md shadow-2xl"
            aria-label="Previous image"
            title="Previous image (Left Arrow)"
          >
            <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
        )}

        {/* Navigation Arrow Right */}
        {images.length > 1 && (
          <button
            onClick={handleNext}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 p-3 sm:p-4 rounded-2xl bg-black/60 hover:bg-black/90 border border-white/15 text-white/90 hover:text-white hover:scale-110 active:scale-95 transition-all backdrop-blur-md shadow-2xl"
            aria-label="Next image"
            title="Next image (Right Arrow)"
          >
            <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
        )}

        {/* Main Center Image Display */}
        <div 
          className="relative w-full flex-1 flex items-center justify-center p-4 sm:p-8 overflow-auto scrollbar-none"
          onClick={() => setIsZoomed((prev) => !prev)}
        >
          <motion.img
            key={currentImage.url}
            src={currentImage.url}
            alt={`${title} visual ${currentIndex + 1}`}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ 
              opacity: 1, 
              scale: isZoomed ? 1.35 : 1,
            }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={`cursor-zoom-in transition-transform duration-300 rounded-xl sm:rounded-2xl shadow-2xl border border-white/10 ${
              isZoomed 
                ? 'max-w-none' 
                : 'max-h-[calc(100vh-175px)] max-w-[calc(100vw-80px)] w-auto h-auto object-contain'
            }`}
          />
        </div>

        {/* Bottom Thumbnail Strip and Download Bar */}
        <div className="relative z-30 w-full flex flex-col items-center gap-2 pb-3 px-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
          {images.length > 1 && (
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-black/80 border border-white/10 backdrop-blur-xl max-w-3xl overflow-x-auto scrollbar-none shadow-xl">
              {images.map((img, idx) => {
                const isSelected = idx === currentIndex;
                const isImgPoster = img.type === 'poster';
                return (
                  <button
                    key={`${img.url}-${idx}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentIndex(idx);
                      setIsZoomed(false);
                    }}
                    className={`relative shrink-0 rounded-lg overflow-hidden transition-all duration-200 ${
                      isSelected
                        ? `ring-2 ring-offset-2 ring-offset-black scale-105 opacity-100 ring-orange-500`
                        : 'opacity-40 hover:opacity-85'
                    }`}
                    style={{ width: isImgPoster ? '32px' : '56px', height: '36px' }}
                    title={`Go to image ${idx + 1}`}
                  >
                    <img
                      src={img.url}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex items-center gap-3 text-[11px] text-white/50 pb-1">
            <span>Use Left/Right arrows to browse</span>
            <span>•</span>
            <span>Click or press Z to toggle zoom</span>
            <span>•</span>
            <button
              onClick={handleDownload}
              className="text-orange-400 hover:text-orange-300 font-semibold underline flex items-center gap-1"
            >
              <Download className="w-3 h-3" />
              Download full resolution
            </button>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};
