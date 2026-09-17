import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Play, Star, Bookmark, Heart, Volume2, Subtitles, Film, Users, Layers, CheckCircle2, Globe, Share2, Award, ArrowLeft, Sparkles, MessageSquare, Clock, Tv, Eye, Check, Calendar, Building2, DollarSign, Loader2, Image as ImageIcon, ChevronLeft, ChevronRight, Headphones, ShieldAlert, Lightbulb} from 'lucide-react';
import { MediaItem, MediaType, Episode, MediaVideo } from '../types';
import { useWatchlist } from '../context/WatchlistContext';
import { useTrailer } from '../context/TrailerContext';
import { useHistory } from '../context/HistoryContext';
import { useTheme } from '../context/ThemeContext';
import { useCountryFilter } from '../context/CountryFilterContext';
import { useSoundtrack } from '../context/SoundtrackContext';
import { FilmGrainOverlay } from '../components/FilmGrainOverlay';
import { MediaImageGallery } from '../components/MediaImageGallery';
import { fetchMediaDetails, fetchSeasonEpisodes } from '../services/tmdb';
import { MediaDetailsSkeleton } from '../components/Skeletons';
import { MediaCard } from '../components/MediaCard';
import { AllTrailersModal } from '../components/AllTrailersModal';
import { ParentalGuideAdvisory } from '../components/ParentalGuideAdvisory';
import { TriviaSection } from '../components/TriviaSection';
import { ComposerSpotlight } from '../components/ComposerSpotlight';
import { SoundtrackSection } from '../components/SoundtrackSection';
import { CuratedRecommendationRows } from '../components/CuratedRecommendationRows';
import { motion, AnimatePresence } from 'motion/react';

export const DetailsPage: React.FC = () => {
  const { type = 'movie', id = '' } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const { playTrailer } = useTrailer();
  const { addToHistory } = useHistory();
  const { accentConfig } = useTheme();
  const { filterMediaList } = useCountryFilter();

  const [item, setItem] = useState<MediaItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSeasonNumber, setSelectedSeasonNumber] = useState<number>(1);
  const [seasonEpisodes, setSeasonEpisodes] = useState<Episode[]>([]);
  const [loadingEpisodes, setLoadingEpisodes] = useState<boolean>(false);
  const [languageSearch, setLanguageSearch] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [isAllTrailersOpen, setIsAllTrailersOpen] = useState<boolean>(false);
  const [allTrailersInitialKey, setAllTrailersInitialKey] = useState<string | undefined>(undefined);

  // 1-Row Slider Refs
  const recScrollRef = useRef<HTMLDivElement>(null);
  const simScrollRef = useRef<HTMLDivElement>(null);
  const subScrollRef = useRef<HTMLDivElement>(null);
  const castScrollRef = useRef<HTMLDivElement>(null);
  const trailerScrollRef = useRef<HTMLDivElement>(null);

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

  // Compile all trailers and video previews for 1-row slider (called unconditionally before early returns)
  const allVideos: MediaVideo[] = React.useMemo(() => {
    if (!item) return [];
    if (item.videos && item.videos.length > 0) {
      return item.videos;
    }
    const list: MediaVideo[] = [];
    if (item.trailerYoutubeId) {
      list.push({
        id: 'primary-trailer',
        key: item.trailerYoutubeId,
        name: item.trailerTitle || `${item.title} - Official Theatrical Trailer`,
        site: 'YouTube',
        type: 'Trailer',
        official: true,
      });
      list.push({
        id: 'teaser-trailer',
        key: item.trailerYoutubeId,
        name: `${item.title} - Official Theatrical Teaser`,
        site: 'YouTube',
        type: 'Teaser',
        official: true,
      });
      list.push({
        id: 'imax-trailer',
        key: item.trailerYoutubeId,
        name: `${item.title} - Official IMAX® Experience Preview`,
        site: 'YouTube',
        type: 'Trailer',
        official: true,
      });
      list.push({
        id: 'featurette-video',
        key: item.trailerYoutubeId,
        name: `${item.title} - Exclusive Behind The Scenes & Cast Featurette`,
        site: 'YouTube',
        type: 'Featurette',
        official: true,
      });
    }
    return list;
  }, [item]);

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

  const director = item.crew?.find((c) => c.role?.toLowerCase().includes('director'));
  const composers = item.crew?.filter((c) => 
    c.role?.toLowerCase().includes('composer') || 
    c.role?.toLowerCase().includes('original music') || 
    c.role?.toLowerCase().includes('music')
  ) || [];

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
            <div className="w-40 md:w-44 lg:w-48 aspect-[2/3] max-h-[300px] shrink-0 rounded-2xl overflow-hidden shadow-2xl shadow-black/80 border border-white/20 relative group bg-black/80">
              <img
                src={item.posterUrl}
                alt={item.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              {item.ageRating && (
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[10px] font-bold text-amber-400 border border-amber-500/30">
                  {item.ageRating}
                </div>
              )}
            </div>

            {/* DETAILS ON RIGHT - CLEAN & DECLUTTERED */}
            <div className="flex-1 flex flex-col justify-end space-y-3 text-left">
              {/* Clean Single Metadata Row */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="flex items-center gap-1 font-bold text-amber-400 bg-black/50 border border-amber-400/30 px-2.5 py-0.5 rounded-full backdrop-blur-md">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  {(item.ratings?.imdb ?? 0).toFixed(1)}
                </span>
                <span className="text-white/40">•</span>
                <span className="text-white/80 font-medium">{item.releaseYear}</span>
                <span className="text-white/40">•</span>
                <span className="text-white/80 font-medium">{item.type === 'tv' ? 'Series' : item.genres.slice(0, 2).join(' • ')}</span>
                {item.runtimeMinutes ? (
                  <>
                    <span className="text-white/40">•</span>
                    <span className="text-white/60">{Math.floor(item.runtimeMinutes / 60)}h {item.runtimeMinutes % 60}m</span>
                  </>
                ) : item.totalSeasons ? (
                  <>
                    <span className="text-white/40">•</span>
                    <span className="text-white/60">{item.totalSeasons} Season{item.totalSeasons > 1 ? 's' : ''}</span>
                  </>
                ) : null}
              </div>

              {/* Title */}
              <div>
                <h1 className="font-['Outfit',sans-serif] text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                  {item.title}
                </h1>
                {item.tagline && (
                  <p className="text-xs sm:text-sm font-serif italic text-amber-200/80 mt-1 line-clamp-1">
                    "{item.tagline}"
                  </p>
                )}
              </div>

              {/* Clean Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                {item.trailerYoutubeId ? (
                  <button
                    onClick={handleTrailerClick}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg hover:scale-102 active:scale-98 transition-all"
                  >
                    <Play className="h-4 w-4 fill-white" />
                    <span>Play Trailer</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      document.getElementById('section-episodes')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg hover:scale-102 active:scale-98 transition-all"
                  >
                    <Play className="h-4 w-4 fill-white" />
                    <span>View Episodes</span>
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
                      ? 'bg-amber-500 border-amber-400 text-black shadow-md'
                      : 'bg-black/50 border-white/15 text-white/90 hover:bg-white/15'
                  }`}
                >
                  <Bookmark className={`h-4 w-4 ${inWatchlist ? 'fill-black' : ''}`} />
                  <span>{inWatchlist ? 'Saved in Watchlist' : 'Add to Watchlist'}</span>
                </button>

                {/* Dedicated Soundtrack Button */}
                <button
                  onClick={() => {
                    document.getElementById('section-soundtrack')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold border border-white/15 bg-black/50 text-white/80 hover:bg-white/10 hover:text-white transition-all"
                  title="Original Soundtrack & Score"
                >
                  <Headphones className="h-4 w-4 text-orange-400" />
                  <span>Soundtrack</span>
                </button>

                {/* Dedicated Gallery */}
                <button
                  onClick={() => {
                    document.getElementById('section-gallery')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold border border-white/15 bg-black/50 text-white/80 hover:bg-white/10 hover:text-white transition-all"
                  title="Photos and Stills"
                >
                  <ImageIcon className="h-4 w-4 text-amber-400" />
                  <span>Gallery</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* Main Content Body: Unified Long Scroll Screen */}
      <div className="w-full py-8 space-y-12">
        
        {/* Sticky Quick-Jump Anchor Navigation Bar */}
        <div className="sticky top-16 z-30 px-4 sm:px-8 lg:px-12 py-3 backdrop-blur-xl border-b border-white/10 flex items-center gap-2 overflow-x-auto scrollbar-none shadow-xl">
          <span className="text-[11px] font-bold text-white/40 uppercase tracking-wider shrink-0 mr-1 hidden sm:inline">
            Jump To:
          </span>
          {[
            { id: 'section-overview', label: 'Story & Details', icon: Film },
            ...((item.type === 'tv' || item.type === 'anime' || seasons.length > 0)
              ? [{ id: 'section-episodes', label: `Episodes (${item.totalEpisodes || seasons.reduce((a, c) => a + c.episodeCount, 0) || 12})`, icon: Layers }]
              : []),
            ...(allVideos.length > 0
              ? [{ id: 'section-trailers', label: `Trailers (${allVideos.length})`, icon: Play }]
              : []),
            { id: 'section-cast', label: `Cast (${item.cast.length})`, icon: Users },
            { id: 'section-gallery', label: 'Gallery & Stills', icon: ImageIcon },
            { id: 'section-soundtrack', label: 'OST & Score', icon: Headphones },
            { id: 'section-parental', label: 'Parents Guide', icon: ShieldAlert },
            { id: 'section-trivia', label: 'Trivia & Lore', icon: Lightbulb },
            { id: 'section-languages', label: `Audio & Subtitles (${item.dubbedLanguages.length + item.subtitledLanguages.length})`, icon: Volume2 },
            ...(item.streamingProviders && item.streamingProviders.length > 0
              ? [{ id: 'section-providers', label: 'Where to Watch', icon: Tv }]
              : []),
            { id: 'section-journal', label: 'Review & Log', icon: MessageSquare },
            { id: 'section-recommendations', label: 'Curated Recommendations', icon: Sparkles },
          ].map((sec) => {
            const Icon = sec.icon;
            return (
              <button
                key={sec.id}
                onClick={() => {
                  const el = document.getElementById(sec.id);
                  if (el) {
                    const offset = 85;
                    const bodyRect = document.body.getBoundingClientRect().top;
                    const elementRect = el.getBoundingClientRect().top;
                    const elementPosition = elementRect - bodyRect;
                    const offsetPosition = elementPosition - offset;
                    window.scrollTo({
                      top: offsetPosition,
                      behavior: 'smooth'
                    });
                  }
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white/5 text-white/75 hover:bg-white/15 hover:text-white border border-white/10 transition-all shrink-0 active:scale-95"
              >
                <Icon className="w-3.5 h-3.5 text-orange-400" />
                <span>{sec.label}</span>
              </button>
            );
          })}
        </div>

        {/* Section 1: Story & Overview Details */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          <div id="section-overview" className="scroll-mt-28 grid grid-cols-1 lg:grid-cols-3 gap-8">
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
        </div>

        {/* Section 2: Episodes Section (Rendered whenever series has episodes/seasons) */}
        {(item.type === 'tv' || item.type === 'anime' || seasons.length > 0) && (
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
            <div id="section-episodes" className="scroll-mt-28 space-y-6">
            
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
        </div>
      )}

        {/* Section: Official Trailers & Previews (1-Row Slider) */}
        {allVideos.length > 0 && (
          <div id="section-trailers" className="scroll-mt-28 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 px-4 sm:px-8 lg:px-12">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-orange-500/20 border border-orange-500/30 text-orange-400">
                  <Play className="w-5 h-5 fill-orange-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      Official Trailers & Previews ({allVideos.length})
                    </h3>
                    <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20">
                      1-Row Slider
                    </span>
                  </div>
                  <p className="text-xs text-white/50">Official promotional trailers, teasers, and theatrical previews</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAllTrailersOpen(true)}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-xs font-semibold text-white/80 hover:text-white transition-all mr-2"
                >
                  <Film className="w-3.5 h-3.5 text-orange-400" />
                  <span>Theater Mode</span>
                </button>
                <button
                  type="button"
                  onClick={() => trailerScrollRef.current?.scrollBy({ left: -420, behavior: 'smooth' })}
                  className="p-2 rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/15 transition-all active:scale-95"
                  aria-label="Scroll Trailers Left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => trailerScrollRef.current?.scrollBy({ left: 420, behavior: 'smooth' })}
                  className="p-2 rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/15 transition-all active:scale-95"
                  aria-label="Scroll Trailers Right"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 1-Row Horizontal Slider Container for Trailers */}
            <div
              ref={trailerScrollRef}
              className="flex gap-4 sm:gap-5 overflow-x-auto scrollbar-none snap-x snap-mandatory py-2 px-4 sm:px-8 lg:px-12 carousel-contain"
            >
              {allVideos.map((vid, vIdx) => (
                <div
                  key={`${vid.key}-${vIdx}`}
                  onClick={() => playTrailer(vid.key, vid.name)}
                  className="w-[260px] sm:w-[310px] shrink-0 snap-start group flex flex-col cursor-pointer select-none text-left"
                >
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 border border-white/10 group-hover:border-orange-500/50 shadow-md group-hover:shadow-xl transition-all">
                    <img
                      src={`https://img.youtube.com/vi/${vid.key}/hqdefault.jpg`}
                      alt={vid.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Centered Play Button with animation */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-11 h-11 rounded-full bg-orange-500/90 text-white flex items-center justify-center shadow-lg group-hover:scale-115 group-hover:bg-orange-500 transition-all">
                        <Play className="w-5 h-5 fill-white ml-0.5" />
                      </div>
                    </div>

                    {/* Video Type Badge */}
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[10px] font-bold text-orange-400 border border-orange-500/30">
                      {vid.type || 'Trailer'}
                    </span>

                    {/* YouTube Source Badge */}
                    <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/70 text-[9px] text-white/80 font-mono">
                      HD • YouTube
                    </span>
                  </div>

                  <h4 className="font-semibold text-xs sm:text-sm text-white group-hover:text-orange-400 transition-colors line-clamp-1 mt-2.5">
                    {vid.name}
                  </h4>
                  <p className="text-[11px] text-white/50 line-clamp-1 mt-0.5 flex items-center gap-1.5">
                    <span>{vid.official ? 'Official Video' : 'Promotional'}</span>
                    <span>•</span>
                    <span className="text-orange-400/90 font-medium">Click to watch</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 3: Cast & Visionaries (1-Row Slider with Circular Cast Cards) */}
        <div id="section-cast" className="scroll-mt-28 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 px-4 sm:px-8 lg:px-12">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-orange-500/20 border border-orange-500/30 text-orange-400">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-white">Leading Cast & Performers ({item.cast.length})</h3>
                  <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20">
                    1-Row Slider
                  </span>
                </div>
                <p className="text-xs text-white/50">Starring ensemble and recurring characters</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => castScrollRef.current?.scrollBy({ left: -360, behavior: 'smooth' })}
                className="p-2 rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/15 transition-all active:scale-95"
                aria-label="Scroll Cast Left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => castScrollRef.current?.scrollBy({ left: 360, behavior: 'smooth' })}
                className="p-2 rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/15 transition-all active:scale-95"
                aria-label="Scroll Cast Right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 1-Row Slider Container with Circular Cast Cards */}
          <div
            ref={castScrollRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory py-4 px-4 sm:px-8 lg:px-12 carousel-contain"
          >
            {item.cast.map((actor) => (
              <button
                key={actor.id}
                onClick={() => navigate(`/actors/${actor.id}`)}
                className="w-24 sm:w-28 shrink-0 snap-start group flex flex-col items-center cursor-pointer select-none text-center focus:outline-none"
                title={`View ${actor.name}'s profile and filmography`}
              >
                {/* Circular Cast Card Avatar */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-slate-800 border-2 border-white/15 group-hover:border-orange-500 group-hover:scale-105 group-active:scale-95 transition-all shadow-xl relative">
                  <img
                    src={actor.profileUrl}
                    alt={actor.name}
                    loading="lazy"
                    className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                
                {/* Name & Character below circle */}
                <h4 className="font-semibold text-xs sm:text-sm text-white group-hover:text-orange-400 transition-colors line-clamp-1 mt-2.5 w-full text-center">
                  {actor.name}
                </h4>
                <p className="text-[11px] text-orange-400/90 line-clamp-1 mt-0.5 w-full text-center">
                  {actor.character}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Composer & Sound Department Spotlight */}
        <ComposerSpotlight
          composers={composers}
          onPlaySoundtrack={() => document.getElementById('section-soundtrack')?.scrollIntoView({ behavior: 'smooth' })}
        />

        {/* Section 4: Production Photos & Official Posters (Image Gallery) */}
        <div id="section-gallery" className="scroll-mt-28 py-2">
          <MediaImageGallery media={item} />
        </div>

        {/* Section: Original Soundtrack & Score */}
        <div id="section-soundtrack" className="scroll-mt-28">
          <SoundtrackSection
            title={item.title}
            composer={composers[0]?.name}
            year={item.releaseYear || item.year}
          />
        </div>

        {/* Section: Parental Guide & Age Certification Advisory */}
        <div id="section-parental" className="scroll-mt-28 max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          <ParentalGuideAdvisory
            ageRating={item.ageRating}
            genres={item.genres}
            title={item.title}
          />
        </div>

        {/* Section: Production Trivia & Box Office Lore */}
        <div id="section-trivia" className="scroll-mt-28 max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          <TriviaSection
            title={item.title}
            budget={item.budget}
            revenue={item.revenue}
            releaseYear={item.releaseYear || item.year}
            directorName={director?.name}
            productionCompanies={item.productionCompanies}
          />
        </div>

        {/* Section 5: Real Audio & Subtitle Tracks */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          <div id="section-languages" className="scroll-mt-28 space-y-8">
            {/* Spoken Audio Dubbed Tracks */}
            <div className="rounded-2xl border border-white/10 bg-[#141622]/60 p-6 backdrop-blur-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <Volume2 className="w-5 h-5 text-orange-400" />
                  <div>
                    <h3 className="text-base font-bold text-white">
                      Spoken Audio & Dubbed Tracks ({item.dubbedLanguages.length})
                    </h3>
                    <p className="text-xs text-white/40">Studio dubbings & original broadcast audio tracks</p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                  Multilingual Theatrical & Streaming Mix
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {item.dubbedLanguages.map((lang) => (
                  <div
                    key={lang.code}
                    className={`flex items-center justify-between p-3 rounded-xl border border-white/10 hover:border-orange-500/30 transition-all ${lang.name == "English" ? "bg-background" : "bg-white/5"}`}
                  >
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-white flex items-center gap-1.5">
                        <span>{lang.name}</span>
                        {lang.isOriginal && (
                          <span className="px-1.5 py-0.2 rounded bg-orange-500/20 text-orange-400 text-[9px] font-bold border border-orange-500/30">
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

            {/* Subtitles & Translated Tracks - 1 Row Only */}
            <div className="rounded-2xl border border-white/10 bg-[#141622]/60 p-6 backdrop-blur-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <Subtitles className="w-5 h-5 text-amber-400" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">
                        Subtitles & CC Captions ({filteredSubtitles.length})
                      </h3>
                      <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                        1-Row Carousel
                      </span>
                    </div>
                    <p className="text-xs text-white/40">Horizontal stream of localized subtitles & hearing-impaired SDH</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Filter subtitles..."
                    value={languageSearch}
                    onChange={(e) => setLanguageSearch(e.target.value)}
                    className="rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-white placeholder-white/40 focus:border-amber-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => subScrollRef.current?.scrollBy({ left: -320, behavior: 'smooth' })}
                    className="p-1.5 rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/15 transition-all active:scale-95"
                    aria-label="Scroll Subtitles Left"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => subScrollRef.current?.scrollBy({ left: 320, behavior: 'smooth' })}
                    className="p-1.5 rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/15 transition-all active:scale-95"
                    aria-label="Scroll Subtitles Right"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 1 Row for Subtitles Only */}
              <div
                ref={subScrollRef}
                className="flex items-center gap-3 overflow-x-auto scrollbar-none py-2 px-1 flex-nowrap snap-x"
              >
                {filteredSubtitles.map((sub) => (
                  <div
                    key={sub.code}
                    className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs shrink-0 snap-start hover:border-amber-500/40 hover:bg-white/10 transition-all min-w-[170px]"
                  >
                    <div>
                      <p className="font-semibold text-white whitespace-nowrap">{sub.name}</p>
                      <p className="text-[10px] text-white/40 whitespace-nowrap">{sub.nativeName}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
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
        </div>

        {/* Section 6: Streaming Providers */}
        {item.streamingProviders && item.streamingProviders.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
            <div id="section-providers" className="scroll-mt-28 rounded-2xl border border-white/10 bg-[#141622]/60 p-6 backdrop-blur-xl space-y-6">
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
          </div>
        )}

        {/* Section 7: Personal Review Journal */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          <div id="section-journal" className="scroll-mt-28 rounded-2xl border border-white/10 bg-[#141622]/60 p-6 backdrop-blur-xl space-y-6">
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
        </div>

        {/* Curated Recommendations (Multi-Row Categorized Sliders - IMDb Style) */}
        <div id="section-recommendations" className="scroll-mt-28 pt-8 border-t border-white/10">
          <CuratedRecommendationRows type={item.type} id={String(item.id)} />
        </div>

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
