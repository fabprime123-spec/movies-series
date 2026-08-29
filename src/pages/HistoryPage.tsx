import React, { useState, useMemo } from 'react';
import { useHistory } from '../context/HistoryContext';
import { useTrailer } from '../context/TrailerContext';
import { useWatchlist } from '../context/WatchlistContext';
import { useTheme } from '../context/ThemeContext';
import { 
  History, 
  Trash2, 
  Search, 
  Clock, 
  Play, 
  Info, 
  Star, 
  X, 
  Film, 
  Tv, 
  Bookmark, 
  BookmarkCheck,
  ChevronRight
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  return new Date(timestamp).toLocaleDateString();
}

function getTimeGroup(timestamp: number): string {
  const now = new Date();
  const date = new Date(timestamp);
  
  const isToday = now.toDateString() === date.toDateString();
  if (isToday) return 'Today';

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (yesterday.toDateString() === date.toDateString()) return 'Yesterday';

  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  if (date > oneWeekAgo) return 'This Week';

  return 'Earlier';
}

export const HistoryPage: React.FC = () => {
  const { history, removeFromHistory, clearHistory } = useHistory();
  const { playTrailer } = useTrailer();
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const { accentConfig } = useTheme();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'movie' | 'tv' | 'anime'>('all');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      if (selectedType !== 'all' && item.media.type !== selectedType) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.media.title.toLowerCase().includes(query);
        const matchesGenre = item.media.genres.some((g) => g.toLowerCase().includes(query));
        return matchesTitle || matchesGenre;
      }
      return true;
    });
  }, [history, selectedType, searchQuery]);

  // Group by timeframe
  const groupedHistory = useMemo(() => {
    const groups: { [key: string]: typeof filteredHistory } = {
      Today: [],
      Yesterday: [],
      'This Week': [],
      Earlier: [],
    };

    filteredHistory.forEach((entry) => {
      const groupKey = getTimeGroup(entry.viewedAt);
      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(entry);
    });

    return Object.entries(groups).filter(([_, items]) => items.length > 0);
  }, [filteredHistory]);

  return (
    <div className="w-full min-h-screen px-4 sm:px-8 lg:px-12 py-8 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10 dark:border-white/10 border-slate-200">
        <div>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl bg-gradient-to-r ${accentConfig.gradient} text-white shadow-lg`}>
              <History className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-['Outfit',sans-serif] text-slate-900 dark:text-white">
                Viewing History
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-white/50">
                Titles and trailers you’ve recently explored ({history.length} logged)
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {history.length > 0 && (
            <>
              {showClearConfirm ? (
                <div className="flex items-center gap-2 bg-rose-500/20 border border-rose-500/40 p-1.5 rounded-xl">
                  <span className="text-xs text-rose-400 font-semibold px-2">Clear all?</span>
                  <button
                    onClick={() => {
                      clearHistory();
                      setShowClearConfirm(false);
                    }}
                    className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    Yes, Clear
                  </button>
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="px-2 py-1 bg-white/10 text-white/80 rounded-lg text-xs hover:bg-white/20 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Clear History</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 my-6">
        {/* Type tabs */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
          {(['all', 'movie', 'tv', 'anime'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                selectedType === type
                  ? `bg-gradient-to-r ${accentConfig.gradient} text-white shadow-md`
                  : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white/70 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10'
              }`}
            >
              {type === 'all' ? 'All Types' : type === 'movie' ? 'Movies' : type === 'tv' ? 'TV Series' : 'Anime'}
            </button>
          ))}
        </div>

        {/* Search input in history */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search history..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 focus:outline-none focus:border-orange-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-20 px-4 rounded-3xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 mt-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center text-orange-400 border border-orange-500/30 mb-4">
            <Clock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold font-['Outfit',sans-serif] text-slate-900 dark:text-white">
            No Viewing History Yet
          </h2>
          <p className="text-sm text-slate-500 dark:text-white/50 max-w-md mt-2 mb-6">
            As you browse movies, shows, and watch official trailers, your playback and browsing log will automatically appear here.
          </p>
          <button
            onClick={() => navigate('/')}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r ${accentConfig.gradient} text-white font-bold text-xs shadow-lg transition-transform hover:scale-105 active:scale-95`}
          >
            <Film className="w-4 h-4" />
            <span>Discover Cinema Titles</span>
          </button>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-sm text-slate-500 dark:text-white/50">
            No history entries match "{searchQuery}"
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {groupedHistory.map(([groupName, items]) => (
            <section key={groupName} className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-400" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-white/80">
                  {groupName}
                </h2>
                <span className="text-xs text-slate-400 dark:text-white/40 font-medium">
                  ({items.length})
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {items.map((entry) => {
                  const media = entry.media;
                  const inWatchlist = isInWatchlist(media.id);

                  return (
                    <motion.div
                      key={`${entry.id}-${entry.viewedAt}`}
                      layout
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="group relative rounded-2xl overflow-hidden bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-orange-500/40 shadow-sm dark:shadow-md transition-all flex flex-col"
                    >
                      {/* Top Poster Thumbnail with Info */}
                      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900 cursor-pointer" onClick={() => navigate(`/details/${media.type}/${media.id}`)}>
                        <img
                          src={media.backdropUrl || media.posterUrl}
                          alt={media.title}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 filter brightness-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Relative timestamp */}
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-bold text-white/90 border border-white/15">
                          {formatTimeAgo(entry.viewedAt)}
                        </div>

                        {/* Remove from history button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromHistory(media.id);
                          }}
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-rose-400 hover:bg-black border border-white/15 transition-colors"
                          title="Remove from history"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>

                        {/* Quick play trailer on hover */}
                        {media.trailerYoutubeId && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              playTrailer(media.trailerYoutubeId, media.title);
                            }}
                            className="absolute bottom-2 right-2 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-bold shadow-md active:scale-95 transition-all"
                          >
                            <Play className="w-3 h-3 fill-white" />
                            <span>Trailer</span>
                          </button>
                        )}
                      </div>

                      {/* Card Content */}
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-white/50 mb-1">
                            <span className="font-semibold uppercase tracking-wider">
                              {media.type === 'movie' ? 'Movie' : media.type === 'tv' ? 'TV Series' : 'Anime'}
                            </span>
                            <span className="flex items-center gap-1 font-bold text-amber-500 dark:text-amber-400">
                              <Star className="w-3 h-3 fill-current" />
                              {media.ratings.imdb.toFixed(1)}
                            </span>
                          </div>

                          <h3
                            onClick={() => navigate(`/details/${media.type}/${media.id}`)}
                            className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1 group-hover:text-orange-500 dark:group-hover:text-orange-400 cursor-pointer transition-colors"
                          >
                            {media.title}
                          </h3>

                          <p className="text-xs text-slate-500 dark:text-white/50 line-clamp-1 mt-0.5">
                            {media.genres.slice(0, 2).join(', ')} • {media.releaseYear}
                          </p>
                        </div>

                        {/* Footer Controls */}
                        <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-white/10">
                          <button
                            onClick={() => {
                              if (inWatchlist) removeFromWatchlist(media.id);
                              else addToWatchlist(media, 'plan_to_watch');
                            }}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                              inWatchlist
                                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                                : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-white/70 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10'
                            }`}
                          >
                            {inWatchlist ? (
                              <>
                                <BookmarkCheck className="w-3.5 h-3.5 fill-current" />
                                <span>Saved</span>
                              </>
                            ) : (
                              <>
                                <Bookmark className="w-3.5 h-3.5" />
                                <span>Save</span>
                              </>
                            )}
                          </button>

                          <Link
                            to={`/details/${media.type}/${media.id}`}
                            className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-white/80 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                          >
                            <span>Details</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
};
