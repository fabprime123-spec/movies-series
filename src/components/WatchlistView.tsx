import React, { useState } from 'react';
import { 
  Bookmark, 
  Heart, 
  Star, 
  Trash2, 
  ExternalLink, 
  Download, 
  Upload, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Film, 
  Tv, 
  Play, 
  Eye, 
  Search,
  CloudCheck
} from 'lucide-react';
import { MediaItem, WatchlistItem, WatchlistStatus } from '../types';
import { useWatchlist } from '../context/WatchlistContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';

interface WatchlistViewProps {
  onOpenDetails: (item: MediaItem) => void;
  onPlayTrailer: (youtubeId: string, title: string) => void;
  onExplore: () => void;
}

export const WatchlistView: React.FC<WatchlistViewProps> = ({
  onOpenDetails,
  onPlayTrailer,
  onExplore,
}) => {
  const {
    watchlist,
    favoritesCount,
    watchingCount,
    completedCount,
    planToWatchCount,
    removeFromWatchlist,
    updateStatus,
    updatePersonalRating,
    toggleFavorite,
    exportWatchlistJson,
    importWatchlistJson,
    isSyncing,
  } = useWatchlist();

  const { currentUser, openAuthModal } = useAuth();
  const [filterTab, setFilterTab] = useState<'all' | 'favorites' | WatchlistStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [importError, setImportError] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importWatchlistJson(content);
      if (!success) {
        setImportError('Invalid JSON format for watchlist backup.');
        setTimeout(() => setImportError(''), 4000);
      }
    };
    reader.readAsText(file);
  };

  const filteredItems = watchlist.filter((item) => {
    if (filterTab === 'favorites' && !item.isFavorite) return false;
    if (filterTab !== 'all' && filterTab !== 'favorites' && item.status !== filterTab) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.media.title.toLowerCase().includes(q);
      const matchDirector = item.media.directors.some((d) => d.name.toLowerCase().includes(q));
      const matchGenre = item.media.genres.some((g) => g.toLowerCase().includes(q));
      return matchTitle || matchDirector || matchGenre;
    }
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-fadeIn">
      {/* Watchlist Header & Cloud Sync State */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="font-['Outfit',sans-serif] text-2xl sm:text-3xl font-extrabold text-white">
              My Personalized Watchlist
            </h1>
            <span className="rounded-full bg-indigo-500/20 border border-indigo-500/30 px-2.5 py-0.5 text-xs font-bold text-indigo-300">
              {watchlist.length} Titles
            </span>
          </div>
          <p className="text-xs sm:text-sm text-white/60">
            {currentUser
              ? `Synced across all your devices via Firebase Authentication (${currentUser.displayName || currentUser.email})`
              : 'Stored safely in your browser’s persistent storage. Sign in with Google to sync across devices.'}
          </p>
        </div>

        {/* Action buttons (Sign-in / Sync / Export / Import) */}
        <div className="flex flex-wrap items-center gap-2">
          {!currentUser ? (
            <button
              onClick={openAuthModal}
              className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:from-indigo-600 hover:to-purple-700 transition-all"
            >
              <CloudCheck className="h-4 w-4" />
              <span>Enable Cloud Sync</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-2 text-xs font-semibold text-emerald-400">
              <CloudCheck className="h-4 w-4" />
              <span>{isSyncing ? 'Syncing...' : 'Cloud Synced'}</span>
            </div>
          )}

          <button
            onClick={exportWatchlistJson}
            disabled={watchlist.length === 0}
            className="flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3.5 py-2 text-xs font-semibold text-white/80 hover:bg-white/10 hover:text-white disabled:opacity-50 transition-all"
            title="Export watchlist as JSON backup"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export</span>
          </button>

          <label className="flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3.5 py-2 text-xs font-semibold text-white/80 hover:bg-white/10 hover:text-white cursor-pointer transition-all">
            <Upload className="h-3.5 w-3.5" />
            <span>Import</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {importError && (
        <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-xs font-semibold text-rose-400">
          {importError}
        </div>
      )}

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
          <span className="text-[11px] font-bold text-white/50 uppercase tracking-wider">Plan to Watch</span>
          <p className="text-xl font-extrabold text-sky-400">{planToWatchCount}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
          <span className="text-[11px] font-bold text-white/50 uppercase tracking-wider">Currently Watching</span>
          <p className="text-xl font-extrabold text-amber-400">{watchingCount}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
          <span className="text-[11px] font-bold text-white/50 uppercase tracking-wider">Completed</span>
          <p className="text-xl font-extrabold text-emerald-400">{completedCount}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
          <span className="text-[11px] font-bold text-white/50 uppercase tracking-wider">Favorites</span>
          <p className="text-xl font-extrabold text-indigo-400">{favoritesCount}</p>
        </div>
      </div>

      {/* Watchlist Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-full border border-white/10 backdrop-blur-md overflow-x-auto">
          {[
            { id: 'all', label: `All (${watchlist.length})` },
            { id: 'favorites', label: `Favorites (${favoritesCount})` },
            { id: 'watching', label: `Watching (${watchingCount})` },
            { id: 'plan_to_watch', label: `Plan (${planToWatchCount})` },
            { id: 'completed', label: `Completed (${completedCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id as any)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                filterTab === tab.id
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            type="text"
            placeholder="Search watchlist..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 rounded-full border border-white/10 bg-white/5 pl-9 pr-3 py-1.5 text-xs text-white placeholder-white/40 backdrop-blur-md focus:border-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Watchlist Items Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl shadow-lg hover:border-indigo-500/40 transition-all"
            >
              <div className="flex gap-3.5">
                {/* Poster image */}
                <div 
                  onClick={() => onOpenDetails(item.media)}
                  className="relative aspect-[2/3] w-20 flex-shrink-0 cursor-pointer overflow-hidden rounded-xl bg-slate-950 shadow-md"
                >
                  <img
                    src={item.media.posterUrl}
                    alt={item.media.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Eye className="h-5 w-5 text-white" />
                  </div>
                </div>

                {/* Info & Status */}
                <div className="flex-1 space-y-1.5 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <h3
                      onClick={() => onOpenDetails(item.media)}
                      className="font-['Outfit',sans-serif] text-sm font-bold text-white truncate cursor-pointer hover:text-indigo-400 transition-colors"
                    >
                      {item.media.title}
                    </h3>
                    <button
                      onClick={() => toggleFavorite(item.media)}
                      className={`p-1 rounded-lg transition-colors ${
                        item.isFavorite ? 'text-rose-500' : 'text-white/40 hover:text-rose-400'
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${item.isFavorite ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <p className="text-[11px] text-white/50 truncate">
                    {item.media.releaseYear} • {item.media.genres.slice(0, 2).join(', ')}
                  </p>

                  {/* Status Picker Pill */}
                  <div className="pt-1">
                    <select
                      value={item.status}
                      onChange={(e) => updateStatus(item.id, e.target.value as any)}
                      className="rounded-lg border border-white/10 bg-white/10 px-2 py-1 text-[11px] font-semibold text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="plan_to_watch" className="bg-[#0c0e18]">Plan to Watch</option>
                      <option value="watching" className="bg-[#0c0e18]">Currently Watching</option>
                      <option value="completed" className="bg-[#0c0e18]">Completed</option>
                      <option value="on_hold" className="bg-[#0c0e18]">On Hold</option>
                    </select>
                  </div>

                  {/* User Rating */}
                  <div className="flex items-center gap-1 text-[11px] pt-1">
                    <span className="text-white/40">My Rating:</span>
                    <select
                      value={item.personalRating || ''}
                      onChange={(e) => updatePersonalRating(item.id, parseInt(e.target.value) || 0)}
                      className="rounded-md bg-transparent border border-white/10 px-1 py-0.5 text-[11px] font-bold text-amber-400 focus:outline-none"
                    >
                      <option value="" className="bg-[#0c0e18]">Unrated</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <option key={num} value={num} className="bg-[#0c0e18]">
                          ⭐ {num}/10
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Personal notes snippet if any */}
              {item.personalNote && (
                <div className="mt-3 p-2 rounded-xl bg-white/5 text-[11px] text-white/70 italic line-clamp-2 border border-white/5">
                  "{item.personalNote}"
                </div>
              )}

              {/* Bottom Card Actions */}
              <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2.5 text-xs">
                <button
                  onClick={() => onPlayTrailer(item.media.trailerYoutubeId, item.media.title)}
                  className="flex items-center gap-1 text-white/60 hover:text-indigo-400 font-semibold"
                >
                  <Play className="h-3.5 w-3.5" />
                  <span>Trailer</span>
                </button>

                <button
                  onClick={() => onOpenDetails(item.media)}
                  className="text-xs font-semibold text-indigo-400 hover:underline"
                >
                  Full Details
                </button>

                <button
                  onClick={() => removeFromWatchlist(item.id)}
                  className="text-white/40 hover:text-rose-400 p-1"
                  title="Remove from Watchlist"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl border border-dashed border-white/10 bg-white/5 backdrop-blur-md space-y-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400">
            <Bookmark className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-['Outfit',sans-serif] text-lg font-bold text-white">
              Your Watchlist is Empty
            </h3>
            <p className="text-xs text-white/50 max-w-sm">
              Discover top movies, series, and anime with global language tracks, and save them to your personal watchlist.
            </p>
          </div>
          <button
            onClick={onExplore}
            className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-600 hover:to-purple-700 transition-all"
          >
            Explore Titles Now
          </button>
        </div>
      )}
    </div>
  );
};
