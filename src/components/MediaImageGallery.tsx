import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Image as ImageIcon, Maximize2, Sparkles, Film, LayoutGrid } from 'lucide-react';
import { GalleryImages, MediaImage, MediaItem } from '../types';
import { ImageGalleryModal } from './ImageGalleryModal';
import { useTheme } from '../context/ThemeContext';

interface MediaImageGalleryProps {
  media: MediaItem;
}

export const MediaImageGallery: React.FC<MediaImageGalleryProps> = ({ media }) => {
  const { accentConfig } = useTheme();
  const [activeCategory, setActiveCategory] = useState<'all' | 'backdrops' | 'posters'>('all');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  // Compile all images with fallbacks
  const allImages = useMemo<MediaImage[]>(() => {
    const list: MediaImage[] = [];

    if (media.images?.backdrops && media.images.backdrops.length > 0) {
      media.images.backdrops.forEach((b) => list.push({ ...b, type: 'backdrop' }));
    } else if (media.backdropUrl) {
      list.push({ url: media.backdropUrl, type: 'backdrop', width: 3840, height: 2160 });
    }

    if (media.images?.posters && media.images.posters.length > 0) {
      media.images.posters.forEach((p) => list.push({ ...p, type: 'poster' }));
    } else if (media.posterUrl) {
      list.push({ url: media.posterUrl, type: 'poster', width: 2000, height: 3000 });
    }

    // If list is small, provide high-quality cinematic still variations
    if (list.length < 4) {
      const extraStills = [
        'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1600&auto=format&fit=crop&q=80',
      ];
      extraStills.forEach((url, i) => {
        if (!list.some((img) => img.url === url)) {
          list.push({ url, type: 'backdrop', width: 1920, height: 1080 });
        }
      });
    }

    return list;
  }, [media]);

  const filteredImages = useMemo(() => {
    if (activeCategory === 'backdrops') return allImages.filter((img) => img.type === 'backdrop');
    if (activeCategory === 'posters') return allImages.filter((img) => img.type === 'poster');
    return allImages;
  }, [allImages, activeCategory]);

  const backdropsCount = allImages.filter((img) => img.type === 'backdrop').length;
  const postersCount = allImages.filter((img) => img.type === 'poster').length;

  return (
    <div className="space-y-6" id="media-image-gallery-section">
      {/* Category Tabs Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-xl bg-gradient-to-br ${accentConfig.gradient} text-white shadow-md`}>
            <ImageIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Production Photos & Official Posters
            </h3>
            <p className="text-xs text-slate-500 dark:text-white/50">
              High-definition production stills, cinematography captures & key visual artwork
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeCategory === 'all'
                ? `bg-gradient-to-r ${accentConfig.gradient} text-white shadow-sm`
                : 'text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Images ({allImages.length})
          </button>
          <button
            onClick={() => setActiveCategory('backdrops')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeCategory === 'backdrops'
                ? `bg-gradient-to-r ${accentConfig.gradient} text-white shadow-sm`
                : 'text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Backdrops & Stills ({backdropsCount})
          </button>
          <button
            onClick={() => setActiveCategory('posters')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeCategory === 'posters'
                ? `bg-gradient-to-r ${accentConfig.gradient} text-white shadow-sm`
                : 'text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Posters ({postersCount})
          </button>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredImages.map((img, index) => {
          const isPoster = img.type === 'poster';
          return (
            <motion.div
              key={`${img.url}-${index}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04, duration: 0.25 }}
              onClick={() => {
                const globalIndex = allImages.findIndex((item) => item.url === img.url);
                setSelectedImageIndex(globalIndex >= 0 ? globalIndex : 0);
              }}
              className={`group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 ${
                isPoster ? 'aspect-[2/3]' : 'aspect-[16/9] sm:col-span-1 md:col-span-1 lg:col-span-2'
              }`}
            >
              <img
                src={img.url}
                alt={`${media.title} gallery asset ${index + 1}`}
                loading="lazy"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />

              {/* Hover Dark Vignette & Info */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3 sm:p-4">
                <div className="flex justify-end">
                  <span className="p-2 rounded-xl bg-black/60 text-white backdrop-blur-md shadow-md">
                    <Maximize2 className="w-4 h-4" />
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-white">
                  <span className="capitalize px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-semibold">
                    {img.type || (isPoster ? 'Poster' : 'Backdrop')}
                  </span>
                  {img.width && img.height && (
                    <span className="text-[10px] text-white/70 font-mono">
                      {img.width}×{img.height}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {selectedImageIndex !== null && (
        <ImageGalleryModal
          isOpen={selectedImageIndex !== null}
          onClose={() => setSelectedImageIndex(null)}
          images={allImages}
          initialIndex={selectedImageIndex}
          title={media.title}
        />
      )}
    </div>
  );
};
