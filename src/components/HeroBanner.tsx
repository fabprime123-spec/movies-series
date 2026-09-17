import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Info, 
  Bookmark, 
  BookmarkCheck, 
  Star, 
  Volume2, 
  Subtitles, 
  ChevronLeft, 
  ChevronRight,
  Flame,
  Award
} from 'lucide-react';
import { MediaItem } from '../types';
import { useWatchlist } from '../context/WatchlistContext';
import { useTrailer } from '../context/TrailerContext';
import { useTheme } from '../context/ThemeContext';
import { FilmGrainOverlay } from './FilmGrainOverlay';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

interface HeroBannerProps {
  item?: MediaItem;
  items?: MediaItem[];
  onOpenDetails?: (item: MediaItem) => void;
  onPlayTrailer?: (youtubeId: string, title: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ 
  item, 
  items = [], 
  onOpenDetails, 
  onPlayTrailer 
}) => {
  const navigate = useNavigate();
  const { playTrailer } = useTrailer();
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const { accentConfig } = useTheme();

  const allItems = items.length > 0 ? items : item ? [item] : [];
  const featuredItems = allItems.filter(i => i.featured).slice(0, 5);
  const displayItems = featuredItems.length > 0 ? featuredItems : allItems.slice(0, 5);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const currentItem = displayItems[currentIndex] || item || allItems[0];

  useEffect(() => {
    if (isPaused || displayItems.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayItems.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [isPaused, displayItems.length]);

  if (!currentItem) return null;

  const inWatchlist = isInWatchlist(currentItem.id);

  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inWatchlist) {
      removeFromWatchlist(currentItem.id);
    } else {
      addToWatchlist(currentItem, 'plan_to_watch');
    }
  };

  const handleDetailsClick = () => {
    if (onOpenDetails) {
      onOpenDetails(currentItem);
    } else {
      navigate(`/details/${currentItem.type}/${currentItem.id}`);
    }
  };

  const handleTrailerClick = () => {
    if (onPlayTrailer) {
      onPlayTrailer(currentItem.trailerYoutubeId, currentItem.title);
    } else if (currentItem.trailerYoutubeId) {
      playTrailer(currentItem.trailerYoutubeId, currentItem.title);
    }
  };

  return (
    <section 
      className="relative w-full overflow-hidden border border-white/10 shadow-2xl transition-all"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Backdrop Image with Crossfade */}
      <div className="relative h-[480px] sm:h-[560px] md:h-[620px] w-full overflow-hidden bg-slate-950">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentItem.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute inset-0 h-full w-full"
          >
            <img
              src={currentItem.backdropUrl || currentItem.posterUrl}
              alt={currentItem.title}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover object-center filter brightness-90"
            />
            {/* 35mm Cinematic Film Grain Texture */}
            <FilmGrainOverlay opacity={0.36} />
            
            {/* Multi-layered glassmorphic & vignette gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Content Container */}
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end p-6 sm:p-10 md:p-14">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentItem.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="max-w-2xl space-y-4"
            >
              {/* Minimalist Metadata Pill */}
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-2 rounded-full bg-black/50 px-3.5 py-1 text-xs font-medium text-white/90 backdrop-blur-md border border-white/15 shadow-sm">
                  <span className="flex items-center gap-1 font-bold text-amber-400">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    {(currentItem.ratings?.imdb ?? 0).toFixed(1)}
                  </span>
                  <span className="text-white/30">•</span>
                  <span>{currentItem.releaseYear}</span>
                  <span className="text-white/30">•</span>
                  <span className="text-white/80">{currentItem.type === 'tv' ? 'Series' : currentItem.genres?.[0] || 'Cinema'}</span>
                  {currentItem.runtimeMinutes && (
                    <>
                      <span className="text-white/30">•</span>
                      <span className="text-white/70">{Math.floor(currentItem.runtimeMinutes / 60)}h {currentItem.runtimeMinutes % 60}m</span>
                    </>
                  )}
                </span>
              </div>

              {/* Title & Concise Logline */}
              <div className="space-y-2">
                <h1 className="font-['Outfit',sans-serif] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white drop-shadow-md leading-tight">
                  {currentItem.title}
                </h1>
                {currentItem.tagline && (
                  <p className="text-sm sm:text-base font-serif italic text-amber-200/90 line-clamp-1">
                    "{currentItem.tagline}"
                  </p>
                )}
              </div>

              {/* Overview snippet - concise */}
              <p className="line-clamp-2 text-xs sm:text-sm text-white/80 leading-relaxed max-w-xl">
                {currentItem.overview}
              </p>

              {/* Focused Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  id={`hero-play-trailer-${currentItem.id}`}
                  onClick={handleTrailerClick}
                  className={`flex items-center gap-2 rounded-2xl bg-gradient-to-r ${accentConfig.gradient} hover:opacity-95 px-5 sm:px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-xl hover:scale-102 active:scale-98 transition-all`}
                >
                  <Play className="h-4 w-4 fill-white" />
                  <span>Watch Trailer</span>
                </button>

                <button
                  id={`hero-view-details-${currentItem.id}`}
                  onClick={handleDetailsClick}
                  className="flex items-center gap-2 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md px-5 sm:px-6 py-3 text-xs sm:text-sm font-semibold text-white border border-white/15 transition-all active:scale-98"
                >
                  <Info className="h-4 w-4" />
                  <span>Details</span>
                </button>

                <button
                  id={`hero-watchlist-toggle-${currentItem.id}`}
                  onClick={handleWatchlistToggle}
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl backdrop-blur-xl border transition-all active:scale-90 ${
                    inWatchlist
                      ? 'bg-amber-500 border-amber-400 text-black shadow-md'
                      : 'bg-black/50 border-white/15 text-white hover:bg-white/20'
                  }`}
                  title={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                >
                  {inWatchlist ? <BookmarkCheck className="h-4 w-4 fill-current" /> : <Bookmark className="h-4 w-4" />}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Slide Indicators & Navigation Arrows */}
        {displayItems.length > 1 && (
          <div className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 z-20 flex items-center gap-2 bg-slate-950/60 backdrop-blur-xl p-1.5 rounded-2xl border border-white/10">
            <button
              onClick={() => setCurrentIndex((prev) => (prev - 1 + displayItems.length) % displayItems.length)}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
              aria-label="Previous featured"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-1.5 px-2">
              {displayItems.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentIndex === idx ? `w-6 bg-gradient-to-r ${accentConfig.gradient}` : 'w-2 bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % displayItems.length)}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
              aria-label="Next featured"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
