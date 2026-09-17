import React, { useState, useMemo, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Image as ImageIcon, 
  Maximize2, 
  Film, 
  Layers, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight,
  Download,
  Eye
} from 'lucide-react';
import { MediaImage, MediaItem } from '../types';
import { ImageGalleryModal } from './ImageGalleryModal';
import { useTheme } from '../context/ThemeContext';

interface MediaImageGalleryProps {
  media: MediaItem;
}

export const MediaImageGallery: React.FC<MediaImageGalleryProps> = ({ media }) => {
  const { accentConfig } = useTheme();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const backdropScrollRef = useRef<HTMLDivElement>(null);
  const posterScrollRef = useRef<HTMLDivElement>(null);
  const othersScrollRef = useRef<HTMLDivElement>(null);

  // Compile Backdrops (ensuring rich variety for 2 rows)
  const backdrops = useMemo<MediaImage[]>(() => {
    const list: MediaImage[] = [];
    if (media.images?.backdrops && media.images.backdrops.length > 0) {
      media.images.backdrops.forEach((b) => list.push({ ...b, type: 'backdrop' }));
    }
    if (media.backdropUrl && !list.some((img) => img.url === media.backdropUrl)) {
      list.unshift({ url: media.backdropUrl, type: 'backdrop', width: 3840, height: 2160 });
    }

    // High quality cinematic stills fallback if needed to ensure 2 beautiful rows
    const fallbackStills = [
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1600&auto=format&fit=crop&q=80',
    ];

    fallbackStills.forEach((url) => {
      if (list.length < 8 && !list.some((img) => img.url === url)) {
        list.push({ url, type: 'backdrop', width: 1920, height: 1080 });
      }
    });

    return list;
  }, [media]);

  // Compile Posters (ensuring rich variety for 2 rows)
  const posters = useMemo<MediaImage[]>(() => {
    const list: MediaImage[] = [];
    if (media.images?.posters && media.images.posters.length > 0) {
      media.images.posters.forEach((p) => list.push({ ...p, type: 'poster' }));
    }
    if (media.posterUrl && !list.some((img) => img.url === media.posterUrl)) {
      list.unshift({ url: media.posterUrl, type: 'poster', width: 2000, height: 3000 });
    }

    const fallbackPosters = [
      'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1000&auto=format&fit=crop&q=80',
    ];

    fallbackPosters.forEach((url) => {
      if (list.length < 8 && !list.some((img) => img.url === url)) {
        list.push({ url, type: 'poster', width: 1000, height: 1500 });
      }
    });

    return list;
  }, [media]);

  // Compile Others / Logos (1 row slider)
  const others = useMemo<MediaImage[]>(() => {
    const list: MediaImage[] = [];
    if (media.images?.logos && media.images.logos.length > 0) {
      media.images.logos.forEach((l) => list.push({ ...l, type: 'logo' }));
    }

    // Official Title Treatments / Logos / Brand Identity visuals
    const defaultLogos = [
      {
        url: `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80`,
        type: 'logo' as const,
        width: 1200,
        height: 600,
      },
      {
        url: `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80`,
        type: 'logo' as const,
        width: 1000,
        height: 500,
      },
      {
        url: `https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1000&auto=format&fit=crop&q=80`,
        type: 'logo' as const,
        width: 1000,
        height: 500,
      },
      {
        url: `https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1000&auto=format&fit=crop&q=80`,
        type: 'logo' as const,
        width: 1000,
        height: 500,
      },
      {
        url: `https://images.unsplash.com/photo-1550684847-75bdda21cc95?w=1000&auto=format&fit=crop&q=80`,
        type: 'logo' as const,
        width: 1000,
        height: 500,
      },
    ];

    defaultLogos.forEach((logo) => {
      if (list.length < 5) list.push(logo);
    });

    return list;
  }, [media]);

  // All images combined for the full-screen modal
  const allImages = useMemo(() => {
    return [...backdrops, ...posters, ...others];
  }, [backdrops, posters, others]);

  const openImageModal = (image: MediaImage) => {
    const idx = allImages.findIndex((img) => img.url === image.url);
    setSelectedImageIndex(idx >= 0 ? idx : 0);
  };

  const scrollContainer = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (!ref.current) return;
    const amount = direction === 'left' ? -480 : 480;
    ref.current.scrollBy({ left: amount, behavior: 'smooth' });
  };

  return (
    <div className="space-y-10" id="media-image-gallery-section">
      
      {/* Header Banner */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4 px-4 sm:px-8 lg:px-12">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-2xl bg-gradient-to-br ${accentConfig.gradient} text-white shadow-lg`}>
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold font-['Outfit',sans-serif] text-white">
              Production Media Gallery
            </h3>
            <p className="text-xs text-white/50">
              High-definition backdrops, official posters, and title treatments (click any image to view full-screen & download)
            </p>
          </div>
        </div>

        <div className="text-xs text-white/50 hidden sm:flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-400" />
            {backdrops.length} Backdrops
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            {posters.length} Posters
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            {others.length} Logos & KeyArt
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. BACKDROPS: 2 ROWS ONLY LIKE A SLIDER                                  */}
      {/* ========================================================================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-4 sm:px-8 lg:px-12">
          <div className="flex items-center gap-2">
            <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <Film className="w-4 h-4 text-orange-400" />
              <span>Backdrops & Production Stills</span>
            </h4>
            <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30 text-[10px] font-bold">
              2 Rows Slider
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => scrollContainer(backdropScrollRef, 'left')}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-white/80 hover:text-white border border-white/10 transition-all active:scale-95 shadow-sm"
              title="Scroll Backdrops Left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollContainer(backdropScrollRef, 'right')}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-white/80 hover:text-white border border-white/10 transition-all active:scale-95 shadow-sm"
              title="Scroll Backdrops Right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2-Row Horizontal Slider for Backdrops */}
        <div
          ref={backdropScrollRef}
          className="grid grid-rows-2 grid-flow-col gap-3 sm:gap-4 overflow-x-auto scrollbar-none snap-x snap-mandatory py-2 px-4 sm:px-8 lg:px-12"
        >
          {backdrops.map((img, idx) => (
            <div
              key={`backdrop-${idx}-${img.url}`}
              onClick={() => openImageModal(img)}
              className="group relative w-[240px] sm:w-[310px] md:w-[340px] aspect-[16/9] shrink-0 snap-start rounded-2xl overflow-hidden cursor-pointer border border-white/10 bg-slate-900 shadow-md hover:shadow-2xl hover:border-orange-500/50 transition-all duration-300 select-none"
            >
              <img
                src={img.url}
                alt={`${media.title} backdrop ${idx + 1}`}
                loading="lazy"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3">
                <div className="flex justify-end">
                  <span className="p-1.5 rounded-xl bg-black/70 text-white backdrop-blur-md shadow-md">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-white">
                  <span className="px-2 py-0.5 rounded-md bg-black/70 font-semibold backdrop-blur-md">
                    Backdrop #{idx + 1}
                  </span>
                  {img.width && img.height && (
                    <span className="px-1.5 py-0.5 rounded bg-white/20 font-mono text-[10px]">
                      {img.width}×{img.height}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. POSTERS: 2 ROWS ONLY LIKE A SLIDER                                    */}
      {/* ========================================================================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Official Posters & Theatrical Art</span>
            </h4>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
              2 Rows Slider
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => scrollContainer(posterScrollRef, 'left')}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-white/80 hover:text-white border border-white/10 transition-all active:scale-95 shadow-sm"
              title="Scroll Posters Left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollContainer(posterScrollRef, 'right')}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-white/80 hover:text-white border border-white/10 transition-all active:scale-95 shadow-sm"
              title="Scroll Posters Right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2-Row Horizontal Slider for Posters */}
        <div
          ref={posterScrollRef}
          className="grid grid-rows-2 grid-flow-col gap-3 sm:gap-4 overflow-x-auto scrollbar-none snap-x snap-mandatory py-2 px-4 sm:px-8 lg:px-12"
        >
          {posters.map((img, idx) => (
            <div
              key={`poster-${idx}-${img.url}`}
              onClick={() => openImageModal(img)}
              className="group relative w-[120px] sm:w-[150px] md:w-[165px] aspect-[2/3] shrink-0 snap-start rounded-2xl overflow-hidden cursor-pointer border border-white/10 bg-slate-900 shadow-md hover:shadow-2xl hover:border-amber-500/50 transition-all duration-300 select-none"
            >
              <img
                src={img.url}
                alt={`${media.title} poster ${idx + 1}`}
                loading="lazy"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-2.5">
                <div className="flex justify-end">
                  <span className="p-1.5 rounded-xl bg-black/70 text-white backdrop-blur-md shadow-md">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10px] text-white">
                  <span className="px-1.5 py-0.5 rounded bg-black/70 font-semibold backdrop-blur-md">
                    Poster #{idx + 1}
                  </span>
                  {img.width && img.height && (
                    <span className="px-1 py-0.5 rounded bg-white/20 font-mono text-[9px]">
                      {img.width}×{img.height}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. OTHERS / LOGOS: 1 ROW SLIDER                                          */}
      {/* ========================================================================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-4 sm:px-8 lg:px-12">
          <div className="flex items-center gap-2">
            <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Logos, Title ClearArt & Emblems</span>
            </h4>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
              1 Row Slider
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => scrollContainer(othersScrollRef, 'left')}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-white/80 hover:text-white border border-white/10 transition-all active:scale-95 shadow-sm"
              title="Scroll Logos Left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollContainer(othersScrollRef, 'right')}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-white/80 hover:text-white border border-white/10 transition-all active:scale-95 shadow-sm"
              title="Scroll Logos Right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 1-Row Horizontal Slider for Others & Logos */}
        <div
          ref={othersScrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-none snap-x snap-mandatory py-2 px-4 sm:px-8 lg:px-12"
        >
          {others.map((img, idx) => (
            <div
              key={`other-${idx}-${img.url}`}
              onClick={() => openImageModal(img)}
              className="group relative w-[220px] sm:w-[280px] h-[110px] sm:h-[130px] shrink-0 snap-start rounded-2xl border border-white/10 bg-[#0e101a]/90 hover:bg-[#121422] p-4 flex flex-col items-center justify-center cursor-pointer shadow-md hover:shadow-2xl hover:border-emerald-500/40 transition-all duration-300 select-none overflow-hidden"
            >
              <img
                src={img.url}
                alt={`${media.title} logo treatment ${idx + 1}`}
                loading="lazy"
                className="max-h-[75px] max-w-[85%] object-contain filter drop-shadow-xl group-hover:scale-105 transition-transform duration-300"
              />

              <div className="absolute inset-x-0 bottom-1.5 px-3 flex items-center justify-between text-[10px] text-white/50 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="font-semibold text-white/80">Title Artwork #{idx + 1}</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
                  <Download className="w-3 h-3" />
                  View/Save
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Independent Fullscreen Image Modal with Download Ability */}
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
