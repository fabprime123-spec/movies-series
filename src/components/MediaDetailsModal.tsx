import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Star, 
  Bookmark, 
  BookmarkCheck, 
  Volume2, 
  Subtitles, 
  Film, 
  Users, 
  Layers, 
  CheckCircle2, 
  Globe, 
  Share2,
  Award,
  ArrowLeft,
  Search,
  Clapperboard,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { MediaItem, NavTab } from '../types';
import { useWatchlist } from '../context/WatchlistContext';
import { motion, AnimatePresence } from 'motion/react';
import { fetchMediaDetails, fetchSeasonEpisodes } from '../services/tmdb';

interface MediaDetailsModalProps {
  item: MediaItem | null;
  onClose: () => void;
  onSelectMedia: (item: MediaItem) => void;
  onPlayTrailer: (youtubeId: string, title: string) => void;
  onNavTabChange?: (tab: NavTab) => void;
  onOpenSearch?: () => void;
}

type DetailTab = 'overview' | 'episodes' | 'cast' | 'languages' | 'providers' | 'journal' | 'similar';

export const MediaDetailsModal: React.FC<MediaDetailsModalProps> = ({
  item: initialItem,
  onClose,
  onSelectMedia,
  onPlayTrailer,
  onNavTabChange,
  onOpenSearch,
}) => {
  if (!initialItem) return null;

  const [item, setItem] = useState<MediaItem>(initialItem);
  const [activeTab, setActiveTab] = useState<DetailTab>('overview');
  const [selectedSeasonNumber, setSelectedSeasonNumber] = useState<number>(1);
  const [languageSearch, setLanguageSearch] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const { 
    isInWatchlist, 
    addToWatchlist, 
    removeFromWatchlist, 
    getWatchlistItem,
    updateStatus,
    updatePersonalRating,
    updatePersonalNote,
    updateEpisodeProgress
  } = useWatchlist();

  // Load deep details if available from TMDB
  useEffect(() => {
    let isMounted = true;
    setItem(initialItem);
    async function loadFullDetails() {
      if (initialItem && (!initialItem.seasons || initialItem.seasons.length === 0)) {
        try {
          setLoadingDetails(true);
          const fullData = await fetchMediaDetails(initialItem.id, initialItem.type);
          if (isMounted) {
            setItem(fullData);
          }
        } catch (e) {
          console.warn('Could not load extra details:', e);
        } finally {
          if (isMounted) setLoadingDetails(false);
        }
      }
    }
    loadFullDetails();
    return () => {
      isMounted = false;
    };
  }, [initialItem.id]);

  const inWatchlist = isInWatchlist(item.id);
  const watchlistItem = getWatchlistItem(item.id);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const seasons = item.seasons || [];
  const currentSeason = seasons.find((s) => s.seasonNumber === selectedSeasonNumber) || seasons[0];

  const filteredSubtitles = item.subtitledLanguages.filter(
    (l) =>
      l.name.toLowerCase().includes(languageSearch.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(languageSearch.toLowerCase())
  );

  const primaryCategory = item.type === 'anime' ? 'ANIMATION' : item.type === 'tv' ? 'SERIES' : 'CINEMA';
  const secondaryCategory = item.genres[0]?.toUpperCase() || 'FEATURE';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0c0d12] text-white flex flex-col selection:bg-orange-500 selection:text-white">
      
      {/* Top Navigation Bar Matching Screenshot */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 backdrop-blur-xl bg-[#0c0d12]/75 transition-all duration-300">
        <div className="w-full px-4 sm:px-8 lg:px-12 py-3.5 flex items-center justify-between gap-6">
          
          {/* Logo */}
          <div 
            onClick={onClose}
            className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-orange-500 via-orange-600 to-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/25 group-hover:scale-105 transition-transform duration-300">
              <Clapperboard className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-['Outfit',sans-serif] text-lg font-extrabold tracking-tight text-white group-hover:text-orange-400 transition-colors">
                Movieace
              </span>
              <span className="text-[9px] font-bold tracking-[0.2em] text-white/50 uppercase">
                A Cinema Periodical
              </span>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => {
                onClose();
                onNavTabChange?.('home');
              }}
              className="py-1 text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => {
                onClose();
                onNavTabChange?.('movies');
              }}
              className={`py-1 text-sm font-medium transition-colors ${
                item.type === 'movie' ? 'text-white font-bold' : 'text-white/70 hover:text-white'
              }`}
            >
              Movies
            </button>
            <button
              onClick={() => {
                onClose();
                onNavTabChange?.('shows');
              }}
              className={`relative flex flex-col items-center py-1 text-sm font-medium transition-colors ${
                item.type === 'tv' || item.type === 'anime' ? 'text-white font-bold' : 'text-white/70 hover:text-white'
              }`}
            >
              <span>Shows</span>
              {(item.type === 'tv' || item.type === 'anime') && (
                <div className="absolute -bottom-1.5 h-1 w-1 rounded-full bg-orange-500 shadow-md shadow-orange-500/50" />
              )}
            </button>
            <button
              onClick={() => {
                onClose();
                onNavTabChange?.('actors');
              }}
              className="py-1 text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              Actors
            </button>
            <button
              onClick={() => {
                onClose();
                onNavTabChange?.('watchlist');
              }}
              className="py-1 text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              Watchlist
            </button>
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenSearch || onClose}
              className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 px-3.5 py-1.5 text-xs text-white/60 hover:border-orange-500/40 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              <Search className="h-3.5 w-3.5 text-white/40" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden sm:inline-flex rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-white/50 font-mono border border-white/10">Ctrl+K</kbd>
            </button>

            <button
              onClick={() => {
                if (inWatchlist) removeFromWatchlist(item.id);
                else addToWatchlist(item);
              }}
              className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-200 ${
                inWatchlist
                  ? 'border-orange-500 bg-orange-500/20 text-orange-400 shadow-md shadow-orange-500/20'
                  : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
              }`}
              title={inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
            >
              {inWatchlist ? <BookmarkCheck className="h-4 w-4 text-orange-400 fill-orange-400/20" /> : <Bookmark className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* FULLSCREEN HERO BANNER (Directly matching reference screenshot) */}
      <section className="relative w-full min-h-[82vh] md:min-h-[88vh] flex flex-col justify-between overflow-hidden">
        
        {/* Full-bleed edge-to-edge backdrop image */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src={item.backdropUrl}
            alt={item.title}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover object-center filter brightness-[0.88] contrast-[1.05]"
          />
          {/* Subtle cinematic gradient vignette fading into bottom dark */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>

        {/* Back button (← BACK TO ISSUE / ← BACK TO DISCOVER) */}
        <div className="relative z-20 px-6 sm:px-12 lg:px-16 pt-6">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-white/70 hover:text-orange-400 transition-colors group cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Issue</span>
          </button>
        </div>

        {/* Hero Title & Actions Container */}
        <div className="relative z-20 px-6 sm:px-12 lg:px-16 pb-12 sm:pb-16 max-w-5xl space-y-5">
          
          {/* Category & Year Tagline: ANIMATION • SERIES • 2013 */}
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em]">
            <span className="text-orange-500 font-extrabold">
              {primaryCategory} • {secondaryCategory}
            </span>
            <span className="text-white/40">•</span>
            <span className="text-white/70">{item.releaseYear}</span>
          </div>

          {/* Title in Majestic Editorial Serif Font */}
          <h1 className="font-editorial text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal tracking-tight text-white drop-shadow-2xl leading-[1.05]">
            {item.title}
          </h1>

          {/* Badges Row: ★ 7.0 | ANIMATION | DRAMA */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <div className="flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 px-3.5 py-1 text-xs font-bold text-white">
              <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
              <span>{item.ratings.imdb.toFixed(1)}</span>
            </div>

            {item.genres.slice(0, 3).map((genre) => (
              <span
                key={genre}
                className="rounded-full bg-white/10 backdrop-blur-md border border-white/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-white/90"
              >
                {genre}
              </span>
            ))}

            {item.runtimeMinutes && (
              <span className="rounded-full bg-white/5 backdrop-blur-md border border-white/10 px-3 py-1 text-xs font-medium text-white/60">
                {item.type === 'movie' ? `${item.runtimeMinutes} min` : `${item.totalEpisodes || seasons.length * 12} Episodes`}
              </span>
            )}
          </div>

          {/* Action Buttons: Solid Orange Pill + Ghost Watchlist Pill */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            {/* Primary Action Button: Resume S1 • E1 / Play Trailer */}
            <button
              onClick={() => onPlayTrailer(item.trailerYoutubeId, item.title)}
              className="flex items-center gap-2.5 rounded-full bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 hover:from-orange-600 hover:to-orange-700 px-7 py-3 text-sm font-bold text-white shadow-xl shadow-orange-500/30 transition-all active:scale-95 cursor-pointer"
            >
              <Play className="h-4 w-4 fill-white" />
              <span>
                {item.type !== 'movie' ? 'Resume S1 • E1' : 'Play Official Trailer'}
              </span>
            </button>

            {/* Watchlist Button */}
            <button
              onClick={() => {
                if (inWatchlist) removeFromWatchlist(item.id);
                else addToWatchlist(item);
              }}
              className={`flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-bold backdrop-blur-md transition-all active:scale-95 cursor-pointer ${
                inWatchlist
                  ? 'border-orange-500 bg-orange-500/20 text-orange-400 shadow-lg shadow-orange-500/20'
                  : 'border-white/20 bg-white/5 text-white hover:bg-white/15 hover:border-white/30'
              }`}
            >
              {inWatchlist ? (
                <>
                  <BookmarkCheck className="h-4 w-4 fill-orange-400" />
                  <span>In Watchlist</span>
                </>
              ) : (
                <>
                  <Bookmark className="h-4 w-4" />
                  <span>Watchlist</span>
                </>
              )}
            </button>

            {/* Share Link */}
            <button
              onClick={handleShare}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/70 hover:text-white hover:bg-white/15 backdrop-blur-md transition-all"
              title="Copy share link"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>

        </div>
      </section>

      {/* DETAILED CONTENT SECTIONS BELOW HERO */}
      <section className="w-full bg-[#0c0d12] border-t border-white/10 px-6 sm:px-12 lg:px-16 py-10 space-y-10">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-4 overflow-x-auto">
          {[
            { id: 'overview', label: 'Storyline & Details', icon: Film },
            ...(item.type !== 'movie' ? [{ id: 'episodes', label: `Episodes (${seasons.length > 0 ? seasons.reduce((acc, s) => acc + s.episodeCount, 0) : item.totalEpisodes || 12})`, icon: Layers }] : []),
            { id: 'cast', label: `Leading Cast (${item.cast.length})`, icon: Users },
            { id: 'languages', label: `Global Audio & Subs (${item.dubbedLanguages.length + item.subtitledLanguages.length})`, icon: Globe },
            { id: 'providers', label: 'Where to Stream', icon: Sparkles },
            { id: 'journal', label: inWatchlist ? 'My Watchlist Log' : 'Review Tracker', icon: MessageSquare },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as DetailTab)}
                className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main synopsis */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="font-editorial text-2xl font-bold text-white mb-3">
                  Storyline & Synopsis
                </h2>
                <p className="text-sm sm:text-base text-white/80 leading-relaxed font-light">
                  {item.overview}
                </p>
              </div>

              {item.tagline && (
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 italic text-sm text-orange-300 font-serif">
                  "{item.tagline}"
                </div>
              )}

              {/* Directorial & Writing leads */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-white/40">Directed By</span>
                  <p className="text-sm font-semibold text-white">
                    {item.directors.map((d) => d.name).join(', ') || 'Acclaimed Director'}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-white/40">Written By</span>
                  <p className="text-sm font-semibold text-white">
                    {item.writers.map((w) => w.name).join(', ') || item.directors[0]?.name || 'Original Script'}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-white/40">Original Language</span>
                  <p className="text-sm font-semibold text-white">
                    {item.originalLanguage.toUpperCase()} ({item.originCountry})
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-white/40">Production Studios</span>
                  <p className="text-sm font-semibold text-white">
                    {item.productionCompanies.join(', ') || 'TMDB Premiere'}
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar stats & ratings */}
            <div className="space-y-6">
              {/* Ratings Box */}
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white/50">
                  Critical Consensus & Ratings
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/70">TMDB User Rating</span>
                    <div className="flex items-center gap-1 text-sm font-bold text-amber-400">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span>{item.ratings.community.toFixed(1)} / 10</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/70">Rotten Tomatoes Rating</span>
                    <span className="text-sm font-bold text-rose-400">{item.ratings.rottenTomatoes}%</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/70">Metacritic Score</span>
                    <span className="text-sm font-bold text-emerald-400">{item.ratings.metacritic}/100</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/70">Community Votes</span>
                    <span className="text-xs font-mono text-white/60">{item.ratings.communityVotesCount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Awards */}
              {item.awards.length > 0 && (
                <div className="p-5 rounded-3xl bg-orange-500/10 border border-orange-500/20 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-400">
                    <Award className="h-4 w-4" />
                    <span>Recognition & Awards</span>
                  </div>
                  <ul className="text-xs text-white/80 space-y-1 list-disc list-inside">
                    {item.awards.map((award, i) => (
                      <li key={i}>{award}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Episodes & Seasons Guide */}
        {activeTab === 'episodes' && item.type !== 'movie' && (
          <div className="space-y-6">
            {/* Season Selector */}
            {seasons.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {seasons.map((s) => (
                  <button
                    key={s.seasonNumber}
                    onClick={() => setSelectedSeasonNumber(s.seasonNumber)}
                    className={`rounded-full px-5 py-2 text-xs font-bold transition-all ${
                      selectedSeasonNumber === s.seasonNumber
                        ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                        : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {s.name} ({s.episodeCount} Episodes)
                  </button>
                ))}
              </div>
            )}

            {/* Episodes List */}
            {currentSeason?.episodes ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentSeason.episodes.map((ep) => {
                  const isWatched = (watchlistItem?.watchedEpisodes || 0) >= ep.episodeNumber;
                  return (
                    <div
                      key={ep.episodeNumber}
                      className={`flex flex-col sm:flex-row items-start gap-4 p-4 rounded-3xl border transition-all ${
                        isWatched
                          ? 'bg-orange-500/10 border-orange-500/30'
                          : 'bg-white/5 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="relative w-full sm:w-44 aspect-video rounded-2xl overflow-hidden bg-slate-900 flex-shrink-0">
                        <img
                          src={ep.stillUrl}
                          alt={ep.title}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute bottom-2 left-2 rounded-md bg-black/70 px-1.5 py-0.5 text-[10px] font-mono text-white">
                          {ep.runtimeMinutes}m
                        </div>
                      </div>

                      <div className="flex-1 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-white line-clamp-1">
                            {ep.episodeNumber}. {ep.title}
                          </h4>
                          <span className="flex items-center gap-1 text-xs text-amber-400 font-bold">
                            <Star className="h-3 w-3 fill-amber-400" />
                            {ep.voteAverage.toFixed(1)}
                          </span>
                        </div>
                        <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">
                          {ep.overview}
                        </p>
                        
                        <div className="pt-2 flex items-center justify-between">
                          <span className="text-[10px] text-white/40 font-mono">Air Date: {ep.airDate || '2013-10-06'}</span>
                          <button
                            onClick={() => {
                              if (!inWatchlist) addToWatchlist(item, 'watching');
                              updateEpisodeProgress(item.id, isWatched ? ep.episodeNumber - 1 : ep.episodeNumber);
                            }}
                            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                              isWatched
                                ? 'bg-orange-500 text-white'
                                : 'bg-white/10 text-white/70 hover:bg-orange-500 hover:text-white'
                            }`}
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>{isWatched ? 'Watched' : 'Mark'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-white/40 text-xs py-8">No episode details available.</p>
            )}
          </div>
        )}

        {/* Tab 3: Cast & Characters */}
        {activeTab === 'cast' && (
          <div className="space-y-6">
            <h3 className="font-editorial text-2xl font-bold text-white">
              Leading Cast & Voice Performers
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {item.cast.map((c) => (
                <div
                  key={c.id}
                  className="group rounded-2xl overflow-hidden border border-white/10 bg-white/5 hover:border-orange-500/40 transition-all flex flex-col"
                >
                  <div className="aspect-[3/4] overflow-hidden bg-slate-900">
                    <img
                      src={c.profileUrl}
                      alt={c.name}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-3">
                    <h4 className="text-xs font-bold text-white truncate group-hover:text-orange-400 transition-colors">
                      {c.name}
                    </h4>
                    <p className="text-[11px] text-orange-400 truncate mt-0.5">
                      {c.character}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Languages */}
        {activeTab === 'languages' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-orange-500/10 border border-orange-500/20">
              <div>
                <h3 className="font-editorial text-xl font-bold text-white flex items-center gap-2">
                  <Globe className="h-5 w-5 text-orange-400" />
                  35+ Global Audio & Subtitle Translations
                </h3>
                <p className="text-xs text-white/70 mt-1">
                  Enjoy cinema in its original native audio or professional dubbed localization.
                </p>
              </div>

              <input
                type="text"
                placeholder="Search languages..."
                value={languageSearch}
                onChange={(e) => setLanguageSearch(e.target.value)}
                className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Dubbed Audio */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white/50 flex items-center gap-2">
                  <Volume2 className="h-4 w-4 text-orange-400" />
                  Spoken Audio Tracks ({item.dubbedLanguages.length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {item.dubbedLanguages.map((lang) => (
                    <div
                      key={lang.code}
                      className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10 text-xs"
                    >
                      <div>
                        <p className="font-bold text-white">
                          {lang.name}
                          {lang.isOriginal && (
                            <span className="ml-1.5 rounded bg-orange-500/20 px-1.5 py-0.5 text-[9px] font-bold text-orange-400">
                              Original
                            </span>
                          )}
                        </p>
                        <p className="text-[10px] text-white/40">{lang.nativeName}</p>
                      </div>
                      <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-mono text-white/70">
                        {lang.audioFormat || 'Dolby 5.1'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subtitles */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white/50 flex items-center gap-2">
                  <Subtitles className="h-4 w-4 text-sky-400" />
                  Subtitle Tracks ({filteredSubtitles.length})
                </h4>
                <div className="grid grid-cols-2 gap-2.5">
                  {filteredSubtitles.map((sub) => (
                    <div
                      key={sub.code}
                      className="p-3 rounded-2xl bg-white/5 border border-white/10 text-xs"
                    >
                      <p className="font-semibold text-white truncate">{sub.name}</p>
                      <p className="text-[10px] text-white/40">{sub.nativeName}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Providers */}
        {activeTab === 'providers' && (
          <div className="space-y-6">
            <h3 className="font-editorial text-2xl font-bold text-white">
              Where to Stream & Watch
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {item.streamingProviders.map((p) => (
                <div
                  key={p.name}
                  className="flex items-center gap-3 p-4 rounded-3xl bg-white/5 border border-white/10"
                >
                  <img src={p.logoUrl} alt={p.name} className="h-8 w-8 rounded-xl object-cover" />
                  <div>
                    <h4 className="text-xs font-bold text-white">{p.name}</h4>
                    <span className="text-[10px] uppercase font-bold text-orange-400">{p.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 6: Journal */}
        {activeTab === 'journal' && (
          <div className="max-w-2xl space-y-6">
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-5">
              <h3 className="font-editorial text-xl font-bold text-white">
                Personal Review & Watchlist Progress
              </h3>

              {/* Status */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-white/40">Status</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'plan_to_watch', label: 'Plan to Watch' },
                    { id: 'watching', label: 'Watching' },
                    { id: 'completed', label: 'Completed' },
                    { id: 'on_hold', label: 'On Hold' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        if (!inWatchlist) addToWatchlist(item, s.id as any);
                        else updateStatus(item.id, s.id as any);
                      }}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-all ${
                        watchlistItem?.status === s.id
                          ? 'bg-orange-500 border-orange-400 text-white'
                          : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Star Rating */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-white/40">
                  Your Rating: {watchlistItem?.personalRating ? `${watchlistItem.personalRating} / 10` : 'Unrated'}
                </label>
                <div className="flex items-center gap-2 overflow-x-auto py-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                    <button
                      key={star}
                      onClick={() => {
                        if (!inWatchlist) addToWatchlist(item);
                        updatePersonalRating(item.id, star);
                      }}
                      className={`h-8 w-8 rounded-xl font-bold text-xs transition-all ${
                        (watchlistItem?.personalRating || 0) >= star
                          ? 'bg-amber-400 text-black'
                          : 'bg-white/10 text-white/50 hover:bg-amber-400/30'
                      }`}
                    >
                      {star}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-white/40">Private Notes</label>
                <textarea
                  rows={3}
                  placeholder="Record your thoughts, favorite quotes, or memorable moments..."
                  value={watchlistItem?.personalNote || ''}
                  onChange={(e) => {
                    if (!inWatchlist) addToWatchlist(item);
                    updatePersonalNote(item.id, e.target.value);
                  }}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-xs text-white placeholder-white/40 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
          </div>
        )}

      </section>

    </div>
  );
};
