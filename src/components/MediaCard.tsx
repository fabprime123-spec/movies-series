import React from 'react';
import { 
  Star, 
  Play, 
  Heart, 
  Volume2, 
  Subtitles
} from 'lucide-react';
import { MediaItem } from '../types';
import { useWatchlist } from '../context/WatchlistContext';
import { useTrailer } from '../context/TrailerContext';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

interface MediaCardProps {
  item?: MediaItem;
  media?: MediaItem;
  onOpenDetails?: (item: MediaItem) => void;
  onPlayTrailer?: (youtubeId: string, title: string) => void;
}

export const MediaCard: React.FC<MediaCardProps> = ({ item: itemProp, media, onOpenDetails, onPlayTrailer }) => {
  const item = itemProp || media;
  const { isInWatchlist, isFavorite, addToWatchlist, removeFromWatchlist, toggleFavorite } = useWatchlist();
  const { playTrailer } = useTrailer();
  const navigate = useNavigate();

  if (!item) return null;

  const inWatchlist = isInWatchlist(item.id);
  const favorite = isFavorite(item.id);

  const handleCardClick = () => {
    if (onOpenDetails) {
      onOpenDetails(item);
    } else {
      navigate(`/details/${item.type}/${item.id}`);
    }
  };

  const handleWatchlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inWatchlist) {
      removeFromWatchlist(item.id);
    } else {
      addToWatchlist(item, 'plan_to_watch');
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(item);
  };

  const handleTrailerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onPlayTrailer) {
      onPlayTrailer(item.trailerYoutubeId, item.title);
    } else if (item.trailerYoutubeId) {
      playTrailer(item.trailerYoutubeId, item.title);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      onClick={handleCardClick}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#14161f]/70 backdrop-blur-xl shadow-lg hover:shadow-2xl hover:shadow-orange-500/10 hover:border-orange-500/40 transition-all duration-300 cursor-pointer select-none"
    >
      {/* Poster Container with Overlay Actions */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-950">
        <img
          src={item.posterUrl}
          alt={item.title}
          referrerPolicy="no-referrer"
          loading="lazy"
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-108"
        />

        {/* Gradient Vignette for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d12] via-transparent to-black/40 opacity-80 group-hover:opacity-90 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5 z-10">
          <span className="flex items-center gap-1 rounded-lg bg-black/70 px-2 py-0.5 text-[11px] font-bold text-amber-400 backdrop-blur-md border border-amber-400/20 shadow-sm">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            {(item.ratings?.imdb ?? 0).toFixed(1)}
          </span>

          <div className="flex items-center gap-1">
            <button
              id={`fav-btn-${item.id}`}
              onClick={handleFavoriteClick}
              className={`flex h-7 w-7 items-center justify-center rounded-lg backdrop-blur-md border transition-all active:scale-90 ${
                favorite
                  ? 'bg-rose-500 border-rose-400 text-white shadow-md shadow-rose-500/30'
                  : 'bg-black/50 border-white/20 text-white/80 hover:bg-rose-500/30 hover:text-rose-400'
              }`}
              title={favorite ? 'Favorited' : 'Add to Favorites'}
            >
              <Heart className={`h-3.5 w-3.5 ${favorite ? 'fill-white' : ''}`} />
            </button>

            <button
              id={`watchlist-btn-${item.id}`}
              onClick={handleWatchlistClick}
              className={`flex h-7 w-7 items-center justify-center rounded-lg backdrop-blur-md border transition-all active:scale-90 ${
                inWatchlist
                  ? 'bg-orange-500 border-orange-400 text-white shadow-md shadow-orange-500/30'
                  : 'bg-black/50 border-white/20 text-white/80 hover:bg-orange-500/30 hover:text-orange-400'
              }`}
              title={inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
            >
              <span className={`text-xs ${inWatchlist ? 'text-white font-bold' : 'text-white'}`}>
                {inWatchlist ? '✓' : '+'}
              </span>
            </button>
          </div>
        </div>

        {/* Center Hover Play Trailer Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <button
            onClick={handleTrailerClick}
            className="pointer-events-auto flex items-center gap-2 rounded-full bg-orange-500/90 px-4 py-2 text-xs font-semibold text-white shadow-xl shadow-orange-500/40 backdrop-blur-md hover:bg-orange-500 hover:scale-105 active:scale-95 transition-all"
          >
            <Play className="h-3.5 w-3.5 fill-white" />
            <span>Trailer</span>
          </button>
        </div>

        {/* Bottom Poster Info (Year, Type badge) */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-white/80 z-10">
          <span className="font-medium">{item.releaseYear}</span>
          <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] uppercase tracking-wider backdrop-blur-md border border-white/10">
            {item.type === 'tv' ? (item.totalSeasons ? `${item.totalSeasons}S` : 'TV') : item.type === 'anime' ? 'ANIME' : 'FILM'}
          </span>
        </div>
      </div>

      {/* Title & Metadata Details */}
      <div className="flex flex-1 flex-col justify-between p-3.5">
        <div>
          <h3 className="font-['Outfit',sans-serif] text-sm font-semibold text-white leading-snug line-clamp-1 group-hover:text-orange-400 transition-colors">
            {item.title}
          </h3>
          
          <p className="mt-1 text-[11px] text-white/50 line-clamp-1">
            {item.genres.slice(0, 2).join(' • ')}
          </p>
        </div>

        {/* Audio & Subtitle Language count indicators */}
        <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-2 text-[10px] text-white/40">
          <div className="flex items-center gap-1" title={`${item.dubbedLanguages.length} spoken audio track(s)`}>
            <Volume2 className="h-3 w-3 text-orange-400/80" />
            <span>{item.dubbedLanguages.length} Audio</span>
          </div>

          <div className="flex items-center gap-1" title={`${item.subtitledLanguages.length} subtitled language(s)`}>
            <Subtitles className="h-3 w-3 text-amber-400/80" />
            <span>{item.subtitledLanguages.length} Subs</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
