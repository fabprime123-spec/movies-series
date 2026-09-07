import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Play, 
  Star, 
  Bookmark, 
  Heart, 
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
  Sparkles, 
  MessageSquare,
  Clock,
  Tv,
  Eye,
  Check,
  Calendar,
  Building2,
  DollarSign,
  Loader2,
  Image as ImageIcon
} from 'lucide-react';
import { MediaItem, MediaType, Episode } from '../types';
import { useWatchlist } from '../context/WatchlistContext';
import { useTrailer } from '../context/TrailerContext';
import { useHistory } from '../context/HistoryContext';
import { useTheme } from '../context/ThemeContext';
import { FilmGrainOverlay } from '../components/FilmGrainOverlay';
import { MediaImageGallery } from '../components/MediaImageGallery';
import { fetchMediaDetails, fetchSeasonEpisodes } from '../services/tmdb';
import { MediaDetailsSkeleton } from '../components/Skeletons';
import { MediaCard } from '../components/MediaCard';
import { AllTrailersModal } from '../components/AllTrailersModal';
import { motion, AnimatePresence } from 'motion/react';

type DetailTab = 'overview' | 'gallery' | 'episodes' | 'cast' | 'languages' | 'providers' | 'journal' | 'similar';

export const DetailsPage: React.FC = () => {
  const { type = 'movie', id = '' } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const { playTrailer } = useTrailer();
  const { addToHistory } = useHistory();
  const { accentConfig } = useTheme();

  const [item, setItem] = useState<MediaItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<DetailTab>('overview');
  const [selectedSeasonNumber, setSelectedSeasonNumber] = useState<number>(1);
  const [seasonEpisodes, setSeasonEpisodes] = useState<Episode[]>([]);
  const [loadingEpisodes, setLoadingEpisodes] = useState<boolean>(false);
  const [languageSearch, setLanguageSearch] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [isAllTrailersOpen, setIsAllTrailersOpen] = useState<boolean>(false);
  const [allTrailersInitialKey, setAllTrailersInitialKey] = useState<string | undefined>(undefined);

  const { 
    isInWatchlist, 
    addToWatchlist, 
    removeFromWatchlist, 
    getWatchlistItem,
    updateStatus,
    updatePersonalRating,
    updatePersonalNote,
    updateEpisodeProgress,
    toggleFavorite,
    isFavorite
  } = useWatchlist();

  // Scroll to top on page mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id, type]);

  // Load media details from TMDB or local fallback
  useEffect(() => {
    let isMounted = true;
    async function loadItem() {
      setLoading(true);
      try {
        const data = await fetchMediaDetails(id, type as MediaType);
        if (isMounted) {
          setItem(data);
          addToHistory(data);
          if (data.seasons && data.seasons.length > 0) {
            const firstSeason = data.seasons.find((s) => s.seasonNumber > 0) || data.seasons[0];
            setSelectedSeasonNumber(firstSeason.seasonNumber);
            if (firstSeason.episodes && firstSeason.episodes.length > 0) {
              setSeasonEpisodes(firstSeason.episodes);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching media details:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadItem();
    return () => {
      isMounted = false;
    };
  }, [id, type]);

  // Fetch episodes when season selection changes
  useEffect(() => {
    if (!item || (item.type !== 'tv' && item.type !== 'anime')) return;
    let isMounted = true;
    async function loadSeason() {
      // Check if already present in item.seasons
      const seasonObj = item?.seasons?.find((s) => s.seasonNumber === selectedSeasonNumber);
      if (seasonObj && seasonObj.episodes && seasonObj.episodes.length > 0) {
        setSeasonEpisodes(seasonObj.episodes);
        return;
      }

      setLoadingEpisodes(true);
      try {
        const episodes = await fetchSeasonEpisodes(item.id, selectedSeasonNumber);
        if (isMounted && episodes.length > 0) {
          setSeasonEpisodes(episodes);
        }
      } catch (err) {
        console.warn('Error fetching season episodes:', err);
      } finally {
        if (isMounted) setLoadingEpisodes(false);
      }
    }
    loadSeason();
    return () => {
      isMounted = false;
    };
  }, [selectedSeasonNumber, item?.id]);

  if (loading && !item) {
    return <MediaDetailsSkeleton />;
  }

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4 px-4 text-center">
        <Film className="w-16 h-16 text-white/20" />
        <h2 className="text-2xl font-bold text-white">Media Record Not Found</h2>
        <p className="text-sm text-white/50 max-w-md">
          The requested title could not be found in the periodical archive.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-5 py-2.5 rounded-xl bg-orange-500 text-sm font-semibold text-white hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/25"
        >
          Return to Front Page
        </button>
      </div>
    );
  }

  const inWatchlist = isInWatchlist(item.id);
  const favorite = isFavorite(item.id);
  const watchlistItem = getWatchlistItem(item.id);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleTrailerClick = () => {
    if (item.trailerYoutubeId) {
      playTrailer(item.trailerYoutubeId, item.title);
    }
  };

  const seasons = item.seasons || [];
  const primaryCategory = item.type === 'anime' ? 'ANIMATION' : item.type === 'tv' ? 'SERIES' : 'CINEMA';

  const filteredSubtitles = item.subtitledLanguages.filter(
    (l) =>
      l.name.toLowerCase().includes(languageSearch.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(languageSearch.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen text-white pb-24 selection:bg-orange-500 selection:text-white">
      
      {/* ========================================================================= */}
      {/* 1. MOBILE HERO VIEW (Directly matching user mobile screenshot layout)    */}
      {/* ========================================================================= */}
      <div className="block md:hidden w-full">
        {/* Tall Backdrop Banner */}
        <div className="relative w-full h-[360px] sm:h-[400px] overflow-hidden">
          <img
            src={item.backdropUrl || item.posterUrl}
            alt={item.title}
            className="w-full h-full object-cover object-center filter brightness-[0.95] contrast-[1.05]"
          />
          {/* 35mm Cinematic Film Grain Overlay */}
          <FilmGrainOverlay opacity={1} />
          
          {/* Smooth bottom fade to page background */}
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          
          {/* Circular Mobile Navigation Controls */}
          <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white border border-white/20 active:scale-95 transition-all shadow-lg"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <button
              onClick={handleShare}
              className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white border border-white/20 active:scale-95 transition-all shadow-lg"
              aria-label="Share"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Poster Overlapping Bottom of Backdrop */}
        <div className="px-5 -mt-24 relative z-20 flex items-end">
          <div className="w-28 sm:w-32 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl shadow-black border border-white/20 bg-black/80 shrink-0 relative">
            <img
              src={item.posterUrl}
              alt={item.title}
              className="w-full h-full object-cover object-center"
            />
            {item.ageRating && (
              <div className={`absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-bold ${accentConfig.badgeText} border border-current/30`}>
                {item.ageRating}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Info & Action Controls */}
        <div className="px-5 pt-3.5 pb-6 space-y-3">
          {/* Title */}
          <h1 className="font-['Outfit',sans-serif] text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
            {item.title}
          </h1>

          {/* Tagline */}
          {item.tagline && (
            <p className="text-xs italic text-amber-200/80">
              "{item.tagline}"
            </p>
          )}

          {/* Clean Dot-Separated Metadata */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-white/70">
            <span className="font-medium text-white/90">{item.releaseYear}</span>
            <span>•</span>
            <span>
              {item.runtimeMinutes
                ? `${item.runtimeMinutes} min`
                : item.totalSeasons
                ? `${item.totalSeasons} Seasons`
                : 'Feature'}
            </span>
            <span>•</span>
            <span>{item.status}</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-amber-400 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              {(item.ratings?.imdb ?? 0).toFixed(1)}
            </span>
          </div>

          {/* Genre Pills */}
          <div className="flex flex-wrap gap-2 pt-0.5">
            {item.genres.map((genre) => (
              <span
                key={genre}
                className="px-3.5 py-1 rounded-full bg-white/10 text-xs font-medium text-white/90 border border-white/10"
              >
                {genre}
              </span>
            ))}
          </div>

          {/* Mobile Dual Action Buttons (Side-by-side White / Accent Pills) */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => toggleFavorite(item)}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-bold text-xs tracking-wide shadow-lg transition-all active:scale-95 ${
                favorite
                  ? 'bg-rose-500 text-white border border-rose-400'
                  : 'bg-white text-black hover:bg-white/90'
              }`}
            >
              <Heart className={`w-4 h-4 ${favorite ? 'fill-white text-white' : 'fill-black text-black'}`} />
              <span>{favorite ? 'Favorited' : 'Favorite'}</span>
            </button>

            <button
              onClick={() => {
                if (inWatchlist) removeFromWatchlist(item.id);
                else addToWatchlist(item, 'plan_to_watch');
              }}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-bold text-xs tracking-wide shadow-lg transition-all active:scale-95 ${
                inWatchlist
                  ? `bg-gradient-to-r ${accentConfig.gradient} text-white border border-transparent`
                  : 'bg-white text-black hover:bg-white/90'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${inWatchlist ? 'fill-white text-white' : 'fill-black text-black'}`} />
              <span>{inWatchlist ? 'In Watchlist' : 'Watchlist'}</span>
            </button>
          </div>

          {/* Mobile Trailer Buttons */}
          {item.trailerYoutubeId && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                onClick={handleTrailerClick}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-gradient-to-r ${accentConfig.gradient} text-white font-bold text-xs shadow-lg active:scale-95 transition-all`}
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Play Official Trailer</span>
              </button>

              <button
                onClick={() => {
                  setAllTrailersInitialKey(undefined);
                  setIsAllTrailersOpen(true);
                }}
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/15 shadow-md active:scale-95 transition-all"
              >
                <Film className="w-4 h-4 text-orange-400" />
                <span>All Trailers & Clips ({item.videos?.length || 1})</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. LAPTOP & DESKTOP HERO VIEW (Responsive backdrop, refined poster size)   */}
      {/* ========================================================================= */}
      <div className="hidden md:flex relative w-full min-h-[460px] lg:min-h-[500px] xl:min-h-[540px] max-h-[65vh] flex-col justify-end overflow-hidden border-b border-white/10">
        
        {/* Cinematic Backdrop Image with High Brightness and Crisp Colors */}
        <div className="absolute inset-0 z-0">
          <img
            src={item.backdropUrl || item.posterUrl}
            alt={item.title}
            className="h-full w-full object-cover object-center filter brightness-[0.92] contrast-[1.03]"
          />
          {/* 35mm Cinematic Film Grain Overlay */}
          <FilmGrainOverlay opacity={0.36} />
          
          {/* Refined gradient overlays that maintain art visibility while ensuring high text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d12] via-[#0c0d12]/55 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c0d12]/90 via-[#0c0d12]/40 to-transparent" />
        </div>


        {/* Top Back Navigation Bar */}
        <div className="relative z-20 w-full px-6 sm:px-8 lg:px-12 pt-6 mb-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-xl bg-black/60 px-3.5 py-1.5 text-xs font-semibold text-white/90 backdrop-blur-md border border-white/15 hover:bg-orange-500/20 hover:border-orange-500/40 hover:text-orange-300 transition-all shadow-md"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Issue</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 rounded-xl bg-black/60 px-3.5 py-1.5 text-xs font-medium text-white/80 backdrop-blur-md border border-white/15 hover:bg-white/10 transition-all shadow-md"
              title="Share Title"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Link Copied' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* Hero Foreground Content: PROPORTIONAL POSTER ON LEFT, DETAILS ON RIGHT */}
        <div className="relative z-10 w-full px-6 sm:px-8 lg:px-12 py-8 pb-10 max-w-7xl mx-auto">
          <div className="flex flex-row gap-8 lg:gap-10 items-end">
            
            {/* REFINED PROPORTIONAL POSTER ON LEFT (Compact & Sleek) */}
            <div className="w-44 md:w-48 lg:w-52 aspect-[2/3] max-h-[320px] shrink-0 rounded-2xl overflow-hidden shadow-2xl shadow-black/90 border-2 border-white/20 relative group bg-black/80">
              <img
                src={item.posterUrl}
                alt={item.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              {/* Age rating badge on poster */}
              {item.ageRating && (
                <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[11px] font-bold tracking-wider text-orange-400 border border-orange-500/30 shadow-md">
                  {item.ageRating}
                </div>
              )}

              {/* Status badge */}
              <div className="absolute bottom-3 left-3 right-3 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-[11px] font-medium text-white/90 border border-white/15 text-center">
                {item.status} • {item.releaseYear}
              </div>
            </div>

            {/* DETAILS ON RIGHT */}
            <div className="flex-1 flex flex-col justify-end space-y-3.5 text-left">
              
              {/* Issue Category Eyebrow */}
              <div className="flex flex-wrap items-center justify-start gap-2.5">
                <span className="rounded-md bg-orange-500 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.18em] text-white shadow-md shadow-orange-500/30">
                  {primaryCategory}
                </span>
                <span className="text-xs font-semibold text-white/50 tracking-wider">
                  ISSUE NO. {item.releaseYear % 100} • {item.genres.slice(0, 2).join(' / ').toUpperCase()}
                </span>
              </div>

              {/* Title & Original Title */}
              <div>
                <h1 className="font-['Outfit',sans-serif] text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                  {item.title}
                </h1>
                {item.originalTitle && item.originalTitle !== item.title && (
                  <p className="text-sm font-medium text-white/50 mt-1 italic">
                    Original title: {item.originalTitle}
                  </p>
                )}
              </div>

              {/* Tagline */}
              {item.tagline && (
                <p className="text-sm sm:text-base font-serif italic text-orange-300/90 max-w-2xl">
                  "{item.tagline}"
                </p>
              )}

              {/* Ratings and Quick Technical Badges */}
              <div className="flex flex-wrap items-center justify-start gap-3 pt-1">
                <div className="flex items-center gap-1.5 rounded-xl bg-black/60 border border-amber-400/30 px-3 py-1 text-xs font-bold text-amber-400 backdrop-blur-md shadow-sm">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span>IMDb {(item.ratings?.imdb ?? 0).toFixed(1)}</span>
                </div>

                {item.ratings.rottenTomatoes > 0 && (
                  <div className="flex items-center gap-1 rounded-xl bg-black/60 border border-rose-500/30 px-3 py-1 text-xs font-bold text-rose-400 backdrop-blur-md">
                    <span>🍅 {item.ratings.rottenTomatoes}%</span>
                  </div>
                )}

                {item.runtimeMinutes ? (
                  <div className="flex items-center gap-1 rounded-xl bg-white/5 border border-white/10 px-3 py-1 text-xs text-white/70">
                    <Clock className="h-3.5 w-3.5 text-white/40" />
                    <span>{item.runtimeMinutes} min</span>
                  </div>
                ) : item.totalSeasons ? (
                  <div className="flex items-center gap-1 rounded-xl bg-white/5 border border-white/10 px-3 py-1 text-xs text-white/70">
                    <Tv className="h-3.5 w-3.5 text-white/40" />
                    <span>{item.totalSeasons} Seasons ({item.totalEpisodes || (seasons.length > 0 ? seasons.reduce((a, c) => a + c.episodeCount, 0) : 10)} Ep)</span>
                  </div>
                ) : null}

                <div className="flex items-center gap-1 rounded-xl bg-white/5 border border-white/10 px-3 py-1 text-xs text-white/70">
                  <Globe className="h-3.5 w-3.5 text-white/40" />
                  <span>{item.originCountry || 'International'}</span>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center justify-start gap-3 pt-2">
                {/* Trailer / Play Button */}
                {item.trailerYoutubeId ? (
                  <>
                    <button
                      onClick={handleTrailerClick}
                      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 px-5 py-2.5 text-xs font-bold text-white shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-105 active:scale-95 transition-all"
                    >
                      <Play className="h-4 w-4 fill-white" />
                      <span>Play Trailer</span>
                    </button>

                    <button
                      onClick={() => {
                        setAllTrailersInitialKey(undefined);
                        setIsAllTrailersOpen(true);
                      }}
                      className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold border border-white/15 bg-black/50 text-white/90 hover:bg-white/10 hover:text-white transition-all shadow-sm"
                      title="Browse all official trailers, teasers, and clips"
                    >
                      <Film className="h-4 w-4 text-orange-400" />
                      <span>All Trailers ({item.videos?.length || 1})</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setActiveTab('episodes')}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-2.5 text-xs font-bold text-white shadow-xl shadow-orange-500/25"
                  >
                    <Play className="h-4 w-4 fill-white" />
                    <span>View Episodes Guide</span>
                  </button>
                )}

                {/* Watchlist Toggle */}
                <button
                  onClick={() => {
                    if (inWatchlist) removeFromWatchlist(item.id);
                    else addToWatchlist(item, 'plan_to_watch');
                  }}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold border transition-all ${
                    inWatchlist
                      ? 'bg-orange-500/20 border-orange-500 text-orange-400 shadow-md shadow-orange-500/20'
                      : 'bg-black/50 border-white/15 text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Bookmark className={`h-4 w-4 ${inWatchlist ? 'fill-orange-400 text-orange-400' : ''}`} />
                  <span>{inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}</span>
                </button>

                {/* Open Dedicated Gallery Route */}
                <button
                  onClick={() => navigate(`/gallery/${item.type}/${item.id}`)}
                  className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold border border-white/15 bg-black/50 text-white/80 hover:bg-white/10 hover:text-white transition-all shadow-sm"
                  title="Open Dedicated Fullscreen Photo Gallery"
                >
                  <ImageIcon className="h-4 w-4 text-amber-400" />
                  <span className="hidden sm:inline">Photo Gallery</span>
                </button>

                {/* Favorite Toggle */}
                <button
                  onClick={() => toggleFavorite(item)}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all ${
                    favorite
                      ? 'bg-rose-500 border-rose-400 text-white shadow-md shadow-rose-500/25'
                      : 'bg-black/50 border-white/15 text-white/70 hover:text-rose-400 hover:bg-rose-500/10'
                  }`}
                  title={favorite ? 'Favorited' : 'Add to Favorites'}
                >
                  <Heart className={`h-4 w-4 ${favorite ? 'fill-white text-white' : ''}`} />
                </button>
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-8 space-y-8">
        
        {/* Navigation Tabs for Deep Content */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto scrollbar-none">
          {[
            { id: 'overview', label: 'Story & Details', icon: Film },
            { id: 'gallery', label: 'Image Gallery & Stills', icon: ImageIcon },
            ...((item.type === 'tv' || item.type === 'anime' || seasons.length > 0)
              ? [{ id: 'episodes', label: `Episodes (${item.totalEpisodes || seasons.reduce((a, c) => a + c.episodeCount, 0) || 12})`, icon: Layers }]
              : []),
            { id: 'cast', label: `Cast & Directors (${item.cast.length})`, icon: Users },
            { id: 'languages', label: `Audio & Subtitles (${item.dubbedLanguages.length + item.subtitledLanguages.length})`, icon: Volume2 },
            { id: 'providers', label: 'Streaming Availability', icon: Tv },
            { id: 'journal', label: 'Review & Status Log', icon: MessageSquare },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as DetailTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                  isSelected
                    ? `bg-gradient-to-r ${accentConfig.gradient} text-white shadow-md`
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Story & Overview Details */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-2xl border border-white/10 bg-[#141622]/60 p-6 backdrop-blur-xl space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Film className="w-5 h-5 text-orange-400" />
                  <span>The Storyline Synopsis</span>
                </h3>
                <p className="text-sm sm:text-base leading-relaxed text-white/80 font-serif">
                  {item.overview || 'No extended synopsis currently available for this cinematic archive entry.'}
                </p>

                {/* Genre Badges */}
                <div className="pt-2">
                  <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Genres & Classifications</h4>
                  <div className="flex flex-wrap gap-2">
                    {item.genres.map((genre) => (
                      <span
                        key={genre}
                        className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-white/80"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Awards and Achievements */}
              {item.awards && item.awards.length > 0 && (
                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 backdrop-blur-xl space-y-3">
                  <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2 uppercase tracking-wider">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>Accolades & Festival Distinctions</span>
                  </h3>
                  <div className="space-y-2">
                    {item.awards.map((award, i) => (
                      <p key={i} className="text-xs text-white/80 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></span>
                        <span>{award}</span>
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Technical & Production Sidebar */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-white/10 bg-[#141622]/60 p-6 backdrop-blur-xl space-y-4">
                <h3 className="text-base font-bold text-white border-b border-white/10 pb-3">
                  Production Information
                </h3>

                {/* Directors */}
                <div>
                  <p className="text-xs text-white/40">Directed by</p>
                  <p className="text-sm font-semibold text-white mt-0.5">
                    {item.directors.map((d) => d.name).join(', ') || 'Various Creators'}
                  </p>
                </div>

                {/* Writers */}
                {item.writers.length > 0 && (
                  <div>
                    <p className="text-xs text-white/40">Screenplay & Story</p>
                    <p className="text-sm font-semibold text-white mt-0.5">
                      {item.writers.map((w) => w.name).join(', ')}
                    </p>
                  </div>
                )}

                {/* Production Studios */}
                {item.productionCompanies && item.productionCompanies.length > 0 && (
                  <div>
                    <p className="text-xs text-white/40">Production Studios</p>
                    <p className="text-sm text-white/80 mt-0.5">
                      {item.productionCompanies.join(' • ')}
                    </p>
                  </div>
                )}

                {/* Financial stats if available */}
                {(item.budget || item.revenue) && (
                  <div className="pt-2 border-t border-white/10 grid grid-cols-2 gap-3 text-xs">
                    {item.budget && (
                      <div>
                        <p className="text-white/40">Budget</p>
                        <p className="font-semibold text-white mt-0.5">${Number((item.budget / 1000000).toFixed(1))}M</p>
                      </div>
                    )}
                    {item.revenue && (
                      <div>
                        <p className="text-white/40">Worldwide Box Office</p>
                        <p className="font-semibold text-emerald-400 mt-0.5">${Number((item.revenue / 1000000).toFixed(1))}M</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Gallery Teaser Card */}
              <div className="rounded-2xl border border-white/10 bg-[#141622]/60 p-6 backdrop-blur-xl space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-orange-400" />
                    <span>Media Photo Gallery</span>
                  </h3>
                  <button
                    onClick={() => navigate(`/gallery/${item.type}/${item.id}`)}
                    className="text-xs text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1"
                  >
                    <span>Full Gallery Page →</span>
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <img
                    src={item.backdropUrl || item.posterUrl}
                    alt="Still 1"
                    onClick={() => navigate(`/gallery/${item.type}/${item.id}`)}
                    className="w-full aspect-video object-cover rounded-xl border border-white/10 cursor-pointer hover:opacity-80 transition-opacity hover:scale-[1.02]"
                  />
                  <img
                    src={item.posterUrl}
                    alt="Still 2"
                    onClick={() => navigate(`/gallery/${item.type}/${item.id}`)}
                    className="w-full aspect-video object-cover rounded-xl border border-white/10 cursor-pointer hover:opacity-80 transition-opacity hover:scale-[1.02]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Episodes Section - MUST AT LEAST HAVE TWO COLUMNS IN ANY SCREEN */}
        {activeTab === 'episodes' && (
          <div className="space-y-6">
            
            {/* Season Selector */}
            {seasons.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {seasons.map((season) => (
                  <button
                    key={season.seasonNumber}
                    onClick={() => setSelectedSeasonNumber(season.seasonNumber)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                      selectedSeasonNumber === season.seasonNumber
                        ? 'bg-orange-500 text-white font-bold shadow-md shadow-orange-500/20'
                        : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
                    }`}
                  >
                    Season {season.seasonNumber} ({season.episodeCount} Episodes)
                  </button>
                ))}
              </div>
            )}

            {loadingEpisodes ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
              </div>
            ) : seasonEpisodes.length > 0 ? (
              /* GUARANTEED AT LEAST 2 COLUMNS IN ANY SCREEN (grid-cols-2 even on mobile!) */
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {seasonEpisodes.map((ep) => {
                  const isWatched = (watchlistItem?.watchedEpisodes || 0) >= ep.episodeNumber;

                  return (
                    <div
                      key={ep.episodeNumber}
                      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#141622]/80 backdrop-blur-xl p-2.5 sm:p-3 shadow-lg hover:border-orange-500/40 hover:shadow-orange-500/10 transition-all"
                    >
                      <div>
                        {/* Episode Thumbnail */}
                        <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black/60 mb-2">
                          <img
                            src={ep.stillUrl || item.backdropUrl || item.posterUrl}
                            alt={ep.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                          
                          {/* Episode Badge */}
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[10px] sm:text-xs font-bold text-orange-400 border border-orange-500/30">
                            EP {ep.episodeNumber}
                          </div>

                          {/* Runtime */}
                          <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/70 text-[10px] text-white/80">
                            {ep.runtimeMinutes}m
                          </div>
                        </div>

                        {/* Title & Air Date */}
                        <div className="space-y-1">
                          <h4 className="font-semibold text-xs sm:text-sm text-white line-clamp-1 group-hover:text-orange-400 transition-colors">
                            {ep.title}
                          </h4>
                          {ep.airDate && (
                            <p className="text-[10px] text-white/40">{ep.airDate}</p>
                          )}
                          <p className="text-[11px] text-white/60 line-clamp-2 mt-1 hidden sm:block">
                            {ep.overview}
                          </p>
                        </div>
                      </div>

                      {/* Episode Action: Mark Watched */}
                      <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[10px] text-amber-400 flex items-center gap-1 font-semibold">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          {ep.voteAverage ? ep.voteAverage.toFixed(1) : '8.0'}
                        </span>

                        <button
                          onClick={() => {
                            if (!inWatchlist) addToWatchlist(item, 'watching');
                            updateEpisodeProgress(item.id, isWatched ? ep.episodeNumber - 1 : ep.episodeNumber);
                          }}
                          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                            isWatched
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10'
                          }`}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{isWatched ? 'Watched' : 'Mark'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-[#141622]/60 p-8 text-center space-y-3">
                <Tv className="w-10 h-10 text-white/30 mx-auto" />
                <p className="text-sm text-white/70">Episode list is being prepared from broadcast archives.</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Cast & Visionaries */}
        {activeTab === 'cast' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-orange-400" />
              <span>Leading Cast & Performers</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {item.cast.map((actor) => (
                <button
                  key={actor.id}
                  onClick={() => navigate(`/actors/${actor.id}`)}
                  className="group relative flex flex-col text-left overflow-hidden rounded-2xl border border-white/10 bg-[#141622]/70 p-3 backdrop-blur-xl shadow-lg hover:border-orange-500/50 hover:bg-[#181a2b] transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  title={`View ${actor.name}'s profile and filmography`}
                >
                  <div className="aspect-square w-full rounded-xl overflow-hidden bg-black/40 mb-2.5">
                    <img
                      src={actor.profileUrl}
                      alt={actor.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h4 className="font-semibold text-xs sm:text-sm text-white group-hover:text-orange-400 transition-colors line-clamp-1">
                    {actor.name}
                  </h4>
                  <p className="text-[11px] text-orange-400/90 line-clamp-1 mt-0.5">
                    {actor.character}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Real Audio & Subtitle Tracks */}
        {activeTab === 'languages' && (
          <div className="space-y-8">
            {/* Spoken Audio Dubbed Tracks */}
            <div className="rounded-2xl border border-white/10 bg-[#141622]/60 p-6 backdrop-blur-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-5 h-5 text-orange-400" />
                  <h3 className="text-base font-bold text-white">
                    Spoken Audio & Dubbed Tracks ({item.dubbedLanguages.length})
                  </h3>
                </div>
                <span className="text-xs text-white/40">Verified Studio Audio Tracks</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {item.dubbedLanguages.map((lang) => (
                  <div
                    key={lang.code}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10"
                  >
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-white flex items-center gap-2">
                        <span>{lang.name}</span>
                        {lang.isOriginal && (
                          <span className="px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 text-[10px] font-bold border border-orange-500/30">
                            ORIGINAL
                          </span>
                        )}
                      </p>
                      <p className="text-[11px] text-white/40">{lang.nativeName}</p>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 text-white/70 border border-white/10">
                      {lang.audioFormat || 'Dolby 5.1'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Subtitles & Translated Tracks */}
            <div className="rounded-2xl border border-white/10 bg-[#141622]/60 p-6 backdrop-blur-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Subtitles className="w-5 h-5 text-amber-400" />
                  <h3 className="text-base font-bold text-white">
                    Subtitles & CC Captions ({filteredSubtitles.length})
                  </h3>
                </div>
                <input
                  type="text"
                  placeholder="Filter languages..."
                  value={languageSearch}
                  onChange={(e) => setLanguageSearch(e.target.value)}
                  className="rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-white placeholder-white/40 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 max-h-96 overflow-y-auto pr-1">
                {filteredSubtitles.map((sub) => (
                  <div
                    key={sub.code}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs"
                  >
                    <div>
                      <p className="font-medium text-white">{sub.name}</p>
                      <p className="text-[10px] text-white/40">{sub.nativeName}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {sub.hasSDH && (
                        <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[9px] font-bold">
                          SDH
                        </span>
                      )}
                      {sub.hasCC && (
                        <span className="px-1.5 py-0.5 rounded bg-white/10 text-white/80 text-[9px] font-bold">
                          CC
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Streaming Providers */}
        {activeTab === 'providers' && (
          <div className="rounded-2xl border border-white/10 bg-[#141622]/60 p-6 backdrop-blur-xl space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Tv className="w-5 h-5 text-orange-400" />
              <span>Where to Stream & Watch</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {item.streamingProviders.map((provider, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-orange-500/30 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={provider.logoUrl}
                      alt={provider.name}
                      className="w-10 h-10 rounded-xl object-cover bg-black/40 border border-white/10"
                    />
                    <div>
                      <p className="text-sm font-semibold text-white">{provider.name}</p>
                      <p className="text-xs text-orange-400 capitalize">{provider.type} Plan Available</p>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-xl bg-orange-500/20 text-orange-400 text-xs font-semibold border border-orange-500/30">
                    Watch Now
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 6: Personal Review Journal */}
        {activeTab === 'journal' && (
          <div className="rounded-2xl border border-white/10 bg-[#141622]/60 p-6 backdrop-blur-xl space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-orange-400" />
              <span>Personal Cinema Log & Rating</span>
            </h3>

            {/* 10-Star Rating Bar */}
            <div>
              <p className="text-xs font-semibold text-white/50 mb-2">YOUR SCORE (1 to 10):</p>
              <div className="flex items-center gap-1.5 flex-wrap">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                  <button
                    key={star}
                    onClick={() => {
                      if (!inWatchlist) addToWatchlist(item, 'completed');
                      updatePersonalRating(item.id, star);
                    }}
                    className={`h-9 w-9 rounded-xl font-bold text-xs transition-all ${
                      (watchlistItem?.personalRating || 0) >= star
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30 scale-105'
                        : 'bg-white/5 text-white/60 hover:bg-white/15 hover:text-white border border-white/10'
                    }`}
                  >
                    {star}
                  </button>
                ))}
              </div>
            </div>

            {/* Personal Notes */}
            <div>
              <p className="text-xs font-semibold text-white/50 mb-2">PERSONAL CRITIQUE & NOTES:</p>
              <textarea
                rows={4}
                value={watchlistItem?.personalNote || ''}
                onChange={(e) => {
                  if (!inWatchlist) addToWatchlist(item, 'watching');
                  updatePersonalNote(item.id, e.target.value);
                }}
                placeholder="Write your editorial thoughts, memorable quotes, favorite scenes, or technical critiques..."
                className="w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-xs sm:text-sm text-white placeholder-white/40 focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Tab: Media Image Gallery */}
        {activeTab === 'gallery' && (
          <div className="rounded-2xl border border-white/10 bg-[#141622]/60 p-6 backdrop-blur-xl">
            <MediaImageGallery media={item} />
          </div>
        )}

        {/* ========================================================================= */}
        {/* Recommendation & Similar Rows (Always presented for rich discovery)      */}
        {/* ========================================================================= */}
        {((item.recommendations && item.recommendations.length > 0) || (item.similar && item.similar.length > 0)) && (
          <div className="space-y-10 pt-10 border-t border-white/10">
            {/* 1. Recommended For You */}
            {item.recommendations && item.recommendations.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white">Recommended For You</h3>
                      <p className="text-xs text-white/50">Curated by TMDB intelligence matching {item.title}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4">
                  {item.recommendations.slice(0, 12).map((rec) => (
                    <MediaCard key={`rec-${rec.id}`} media={rec} />
                  ))}
                </div>
              </div>
            )}

            {/* 2. Similar Titles */}
            {item.similar && item.similar.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-orange-500/20 border border-orange-500/30 text-orange-400">
                      <Film className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white">Similar Titles & Franchise</h3>
                      <p className="text-xs text-white/50">Sharing genre themes, directors, and cinematic tone</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4">
                  {item.similar.slice(0, 12).map((sim) => (
                    <MediaCard key={`sim-${sim.id}`} media={sim} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* All Trailers & Cinematic Videos Modal */}
      <AllTrailersModal
        isOpen={isAllTrailersOpen}
        onClose={() => setIsAllTrailersOpen(false)}
        media={item}
        initialVideoKey={allTrailersInitialKey}
      />
    </div>
  );
};
