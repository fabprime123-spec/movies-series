import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bookmark,
  History,
  Trash2,
  Play,
  Film,
  Tv,
  Star,
  Search,
  Clock,
  Eye,
  ArrowRight,
  Filter,
  Sparkles,
  Layers,
  Image as ImageIcon
} from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import { useHistory } from '../context/HistoryContext';
import { useTrailer } from '../context/TrailerContext';
import { useTheme } from '../context/ThemeContext';
import { WatchlistStatus, MediaType } from '../types';

export const LibraryPage: React.FC = () => {
  const { watchlist, removeFromWatchlist, updateStatus } = useWatchlist();
  const { history, removeFromHistory, clearHistory } = useHistory();
  const { playTrailer } = useTrailer();
  const { accentConfig } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeMainTab, setActiveMainTab] = useState<'watchlist' | 'history'>(() => {
    return location.pathname === '/history' ? 'history' : 'watchlist';
  });

  useEffect(() => {
    if (location.pathname === '/history') {
      setActiveMainTab('history');
    } else if (location.pathname === '/watchlist') {
      setActiveMainTab('watchlist');
    }
  }, [location.pathname]);

  const [selectedStatus, setSelectedStatus] = useState<WatchlistStatus | 'all'>('all');
  const [filterType, setFilterType] = useState<MediaType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter Watchlist items
  const filteredWatchlist = useMemo(() => {
    return watchlist.filter((item) => {
      const matchStatus = selectedStatus === 'all' || item.status === selectedStatus;
      const matchType = filterType === 'all' || item.media.type === filterType;
      const matchQuery =
        !searchQuery ||
        item.media.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.media.genres?.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchStatus && matchType && matchQuery;
    });
  }, [watchlist, selectedStatus, filterType, searchQuery]);

  // Filter History items
  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const matchType = filterType === 'all' || item.media.type === filterType;
      const matchQuery =
        !searchQuery ||
        item.media.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.media.genres?.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchType && matchQuery;
    });
  }, [history, filterType, searchQuery]);

  const totalWatchlist = watchlist.length;
  const totalHistory = history.length;
  const completedCount = watchlist.filter((w) => w.status === 'completed').length;
  const watchingCount = watchlist.filter((w) => w.status === 'watching').length;

  return (
    <div className="min-h-screen pb-24 text-foreground selection:bg-orange-500 selection:text-white" id="library-page-root">
      
      {/* ---------------- LIBRARY HERO HEADER ---------------- */}
      <section className="border-b border-border bg-card py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-[10px] uppercase tracking-wider shadow">
                  Personal Vault
                </span>
                <span className="text-xs text-muted font-medium">
                  {totalWatchlist} in Watchlist • {totalHistory} in History
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground">
                My Cinema Library
              </h1>
              <p className="text-sm text-muted max-w-2xl">
                Organize your bookmarked cinema, track your binge status, and revisit all watched films and television episodes in one unified vault.
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-surface border border-border text-center">
                <div className="text-xl font-black text-foreground">{totalWatchlist}</div>
                <div className="text-[11px] text-muted font-medium">Bookmarked</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-surface border border-border text-center">
                <div className="text-xl font-black text-foreground">{watchingCount}</div>
                <div className="text-[11px] text-muted font-medium">Watching</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-surface border border-border text-center">
                <div className="text-xl font-black text-foreground">{completedCount}</div>
                <div className="text-[11px] text-muted font-medium">Completed</div>
              </div>
            </div>
          </div>

          {/* Main Tab Toggle: Watchlist vs History */}
          <div className="flex items-center gap-2 border-t border-border pt-4">
            <button
              id="library-tab-watchlist"
              onClick={() => setActiveMainTab('watchlist')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                activeMainTab === 'watchlist'
                  ? `bg-gradient-to-r ${accentConfig.gradient} text-white shadow-lg`
                  : 'bg-surface text-muted hover:text-foreground border border-border'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>Watchlist ({totalWatchlist})</span>
            </button>

            <button
              id="library-tab-history"
              onClick={() => setActiveMainTab('history')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                activeMainTab === 'history'
                  ? `bg-gradient-to-r ${accentConfig.gradient} text-white shadow-lg`
                  : 'bg-surface text-muted hover:text-foreground border border-border'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Viewing History ({totalHistory})</span>
            </button>
          </div>
        </div>
      </section>

      {/* ---------------- MAIN CONTENT & FILTERS ---------------- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        
        {/* Filter Controls Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Filter by title or genre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-surface border border-border text-foreground text-xs placeholder:text-muted focus:outline-none focus:border-ring"
            />
          </div>

          {/* Media Type Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {(['all', 'movie', 'tv'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                  filterType === t
                    ? 'bg-foreground text-background shadow-sm'
                    : 'bg-surface text-muted hover:text-foreground border border-border'
                }`}
              >
                {t === 'all' ? 'All Formats' : t === 'movie' ? 'Movies' : 'TV Shows'}
              </button>
            ))}
          </div>

          {/* Watch Status Filter (Watchlist Only) */}
          {activeMainTab === 'watchlist' && (
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              {(['all', 'plan_to_watch', 'watching', 'completed', 'dropped'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedStatus(s)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all whitespace-nowrap ${
                    selectedStatus === s
                      ? `${accentConfig.badgeBg} ${accentConfig.badgeText} border border-current`
                      : 'bg-surface text-muted hover:text-foreground border border-border'
                  }`}
                >
                  {s.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          )}

          {/* Clear History Button (History Only) */}
          {activeMainTab === 'history' && history.length > 0 && (
            <button
              onClick={clearHistory}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-bold hover:bg-rose-500/20 transition-all shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {/* ---------------- WATCHLIST GRID ---------------- */}
        {activeMainTab === 'watchlist' && (
          <div>
            {filteredWatchlist.length === 0 ? (
              <div className="py-20 text-center space-y-4 rounded-3xl bg-card border border-border p-8">
                <Bookmark className="w-12 h-12 text-muted mx-auto" />
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-foreground">No bookmarked titles in this view</h3>
                  <p className="text-xs text-muted max-w-md mx-auto">
                    Explore trending movies and shows, click "+ Watchlist", and your saved releases will appear right here.
                  </p>
                </div>
                <Link
                  to="/movies"
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r ${accentConfig.gradient} text-white font-bold text-xs shadow-md`}
                >
                  <Film className="w-4 h-4" />
                  <span>Explore Catalog</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                {filteredWatchlist.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group relative flex flex-col rounded-2xl bg-card border border-border overflow-hidden hover:border-ring transition-all duration-300 shadow-md"
                  >
                    {/* Poster Image */}
                    <div className="relative aspect-[2/3] w-full overflow-hidden bg-surface">
                      <img
                        src={item.media.posterUrl}
                        alt={item.media.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />

                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider">
                          {item.media.type}
                        </span>
                      </div>

                      {/* Status Tag */}
                      <div className="absolute top-2 right-2">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase backdrop-blur-md ${
                          item.status === 'completed'
                            ? 'bg-emerald-500/80 text-white'
                            : item.status === 'watching'
                            ? 'bg-amber-500/80 text-white'
                            : 'bg-black/70 text-white'
                        }`}>
                          {item.status.replace(/_/g, ' ')}
                        </span>
                      </div>

                      {/* Overlay Action Buttons */}
                      <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2.5 p-3">
                        <button
                          onClick={() => navigate(`/details/${item.media.type}/${item.media.id}`)}
                          className="w-full py-2 px-3 rounded-xl bg-white text-black font-bold text-xs flex items-center justify-center gap-1.5 shadow"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Details</span>
                        </button>

                        <button
                          onClick={() => navigate(`/gallery/${item.media.type}/${item.media.id}`)}
                          className="w-full py-2 px-3 rounded-xl bg-surface border border-border text-foreground font-bold text-xs flex items-center justify-center gap-1.5"
                        >
                          <ImageIcon className="w-3.5 h-3.5 text-muted" />
                          <span>Gallery</span>
                        </button>

                        {item.media.trailerYoutubeId && (
                          <button
                            onClick={() => playTrailer(item.media.trailerYoutubeId!, item.media.title)}
                            className={`w-full py-2 px-3 rounded-xl bg-gradient-to-r ${accentConfig.gradient} text-white font-bold text-xs flex items-center justify-center gap-1.5`}
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Trailer</span>
                          </button>
                        )}

                        <button
                          onClick={() => removeFromWatchlist(item.media.id)}
                          className="w-full py-1.5 px-3 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-xs font-bold flex items-center justify-center gap-1 mt-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>

                    {/* Meta Footer */}
                    <div className="p-3 flex flex-col flex-1 justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-xs text-foreground line-clamp-1 group-hover:text-amber-400 transition-colors">
                          {item.media.title}
                        </h4>
                        <div className="flex items-center justify-between text-[11px] text-muted mt-1">
                          <span>{item.media.releaseYear}</span>
                          <span className="flex items-center gap-1 text-amber-400 font-bold">
                            <Star className="w-3 h-3 fill-amber-400" />
                            {(item.media?.ratings?.imdb ?? (item.media as any)?.rating ?? 0).toFixed(1)}
                          </span>
                        </div>
                      </div>

                      {/* Status Selector Dropdown */}
                      <select
                        value={item.status}
                        onChange={(e) => updateStatus(item.media.id, e.target.value as WatchlistStatus)}
                        className="w-full text-[11px] py-1 px-2 rounded-lg bg-surface border border-border text-foreground focus:outline-none focus:border-ring cursor-pointer"
                      >
                        <option value="plan_to_watch">Plan to Watch</option>
                        <option value="watching">Currently Watching</option>
                        <option value="completed">Completed</option>
                        <option value="dropped">Dropped</option>
                      </select>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ---------------- VIEWING HISTORY GRID ---------------- */}
        {activeMainTab === 'history' && (
          <div>
            {filteredHistory.length === 0 ? (
              <div className="py-20 text-center space-y-4 rounded-3xl bg-card border border-border p-8">
                <History className="w-12 h-12 text-muted mx-auto" />
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-foreground">No viewing history recorded yet</h3>
                  <p className="text-xs text-muted max-w-md mx-auto">
                    Whenever you open a trailer or view titles, your recent activity is archived here for quick reference.
                  </p>
                </div>
                <Link
                  to="/"
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r ${accentConfig.gradient} text-white font-bold text-xs shadow-md`}
                >
                  <Film className="w-4 h-4" />
                  <span>Start Browsing</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredHistory.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 p-3.5 rounded-2xl bg-card border border-border hover:border-ring transition-all group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <img
                        src={item.media.posterUrl}
                        alt={item.media.title}
                        className="w-12 h-16 object-cover rounded-xl bg-surface shrink-0"
                      />
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded bg-surface border border-border text-[9px] font-bold uppercase text-muted">
                            {item.media.type}
                          </span>
                          <span className="text-[11px] text-muted">
                            {new Date(item.timestamp).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-foreground truncate group-hover:text-amber-400 transition-colors">
                          {item.media.title}
                        </h4>
                        <p className="text-xs text-muted truncate">
                          {item.media.genres?.join(', ') || 'Feature Film'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => navigate(`/gallery/${item.media.type}/${item.media.id}`)}
                        className="p-2 rounded-xl bg-surface border border-border text-muted hover:text-foreground text-xs font-semibold"
                        title="View Photos"
                      >
                        <ImageIcon className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => navigate(`/details/${item.media.type}/${item.media.id}`)}
                        className="px-3 py-1.5 rounded-xl bg-surface border border-border text-foreground hover:bg-surface/80 text-xs font-bold flex items-center gap-1"
                      >
                        <span>Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>

                      <button
                        onClick={() => removeFromHistory(item.media.id)}
                        className="p-2 rounded-xl text-muted hover:text-rose-400 transition-colors"
                        title="Remove from history"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
