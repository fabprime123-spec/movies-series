import React from 'react';
import { 
  Star, 
  Play, 
  Bookmark,
  Check,
  MoreVertical
} from 'lucide-react';
import { MediaItem } from '../types';
import { useWatchlist } from '../context/WatchlistContext';
import { useTrailer } from '../context/TrailerContext';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { MediaContextMenu } from './MediaContextMenu';

interface MediaCardProps {
  item?: MediaItem;
  media?: MediaItem;
  onOpenDetails?: (item: MediaItem) => void;
  onPlayTrailer?: (youtubeId: string, title: string) => void;
}

export const MediaCard: React.FC<MediaCardProps> = ({ item: itemProp, media, onOpenDetails, onPlayTrailer }) => {
  const item = itemProp || media;
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const { playTrailer } = useTrailer();
  const navigate = useNavigate();

  if (!item) return null;

  const inWatchlist = isInWatchlist(item.id);

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

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onPlayTrailer && item.trailerYoutubeId) {
      onPlayTrailer(item.trailerYoutubeId, item.title);
    } else if (item.trailerYoutubeId) {
      playTrailer(item.trailerYoutubeId, item.title);
    } else {
      handleCardClick();
    }
  };

  const primaryGenre = item.genres?.[0] || (item.type === 'tv' ? 'Series' : 'Film');
  const rating = (item.ratings?.imdb ?? 0).toFixed(1);

  return (
    <MediaContextMenu
      item={item}
      onOpenDetails={onOpenDetails}
      onPlayTrailer={onPlayTrailer}
    >
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 26 }}
        onClick={handleCardClick}
        className="group relative flex flex-col cursor-pointer select-none"
      >
        {/* Poster Container with Microsoft Store fluent lighting and shadow */}
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl bg-slate-900 border border-white/10 shadow-md group-hover:shadow-[0_16px_36px_rgba(0,0,0,0.45)] group-hover:border-white/30 group-hover:ring-1 group-hover:ring-white/20 transition-all duration-300">
          <img
            src={item.posterUrl}
            alt={item.title}
            referrerPolicy="no-referrer"
            loading="lazy"
            className="h-full w-full object-cover object-center"
          />

          {/* Subtle Bottom Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-60 group-hover:opacity-80 transition-opacity" />

          {/* Top Badges: Rating on left, discreet Bookmark & Options on right */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
            <span className="flex items-center gap-1 rounded-lg bg-black/75 px-2 py-0.5 text-[11px] font-bold text-amber-400 backdrop-blur-md border border-white/10 shadow-sm">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              {rating}
            </span>

            <div className="flex items-center gap-1">
              <button
                id={`watchlist-btn-${item.id}`}
                onClick={handleWatchlistClick}
                className={`flex h-7 w-7 items-center justify-center rounded-lg backdrop-blur-md border transition-all active:scale-90 ${
                  inWatchlist
                    ? 'bg-amber-500 border-amber-400 text-black shadow-md'
                    : 'bg-black/60 border-white/15 text-white/80 opacity-0 group-hover:opacity-100 hover:bg-white/20 hover:text-white'
                }`}
                title={inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
              >
                {inWatchlist ? (
                  <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                ) : (
                  <Bookmark className="h-3.5 w-3.5" />
                )}
              </button>

              {/* Context menu hint / mobile trigger */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Dispatch contextmenu event on the card container
                  const event = new MouseEvent('contextmenu', {
                    bubbles: true,
                    cancelable: true,
                    clientX: e.clientX,
                    clientY: e.clientY,
                  });
                  e.currentTarget.dispatchEvent(event);
                }}
                className="flex h-7 w-7 items-center justify-center rounded-lg backdrop-blur-md border border-white/15 bg-black/60 text-white/80 opacity-0 group-hover:opacity-100 hover:bg-white/20 hover:text-white transition-all active:scale-90"
                title="Options menu"
              >
                <MoreVertical className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Center Hover Play Action */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <button
              onClick={handlePlayClick}
              className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-black shadow-xl hover:scale-110 active:scale-95 transition-transform"
              title="Play Trailer or View"
            >
              <Play className="h-4 w-4 fill-black ml-0.5" />
            </button>
          </div>
        </div>

        {/* Clean Title & Metadata Below Poster */}
        <div className="pt-2 px-0.5">
          <h3 className="font-semibold text-xs sm:text-sm text-foreground line-clamp-1 group-hover:text-amber-400 transition-colors">
            {item.title}
          </h3>
          <p className="mt-0.5 text-[11px] text-muted line-clamp-1">
            {item.releaseYear} • {item.type === 'tv' ? 'Series' : primaryGenre}
          </p>
        </div>
      </motion.div>
    </MediaContextMenu>
  );
};

