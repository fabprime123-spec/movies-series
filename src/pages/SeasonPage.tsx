import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Tv, 
  ArrowLeft, 
  Star, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  Loader2, 
  Film, 
  Sparkles,
  Bookmark,
  Share2,
  Check,
  Layers,
  Search
} from 'lucide-react';
import { fetchMediaDetails, fetchSeasonEpisodes, fetchTrendingTitles } from '../services/tmdb';
import { MediaItem, Season, Episode, MediaType } from '../types';
import { useWatchlist } from '../context/WatchlistContext';
import { useTheme } from '../context/ThemeContext';
import { FilmGrainOverlay } from '../components/FilmGrainOverlay';

export const SeasonPage: React.FC = () => {
  const { type: paramType, id: paramId, seasonNumber: paramSeasonNum } = useParams<{
    type?: string;
    id?: string;
    seasonNumber?: string;
  }>();

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isInWatchlist, addToWatchlist, updateEpisodeProgress, getWatchlistItem } = useWatchlist();
  const { accentConfig } = useTheme();

  const resolvedId = paramId || searchParams.get('id') || '';
  const resolvedType = (paramType || searchParams.get('type') || 'tv') as MediaType;
  const initialSeason = parseInt(paramSeasonNum || searchParams.get('season') || '1', 10);

  const [media, setMedia] = useState<MediaItem | null>(null);
  const [catalogSeries, setCatalogSeries] = useState<MediaItem[]>([]);
  const [loadingMedia, setLoadingMedia] = useState<boolean>(true);
  const [selectedSeasonNumber, setSelectedSeasonNumber] = useState<number>(isNaN(initialSeason) ? 1 : initialSeason);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loadingEpisodes, setLoadingEpisodes] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // 1. Fetch Media details or Trending TV catalog if no ID is passed
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setLoadingMedia(true);
      try {
        if (!resolvedId) {
          const list = await fetchTrendingTitles('tv', 'week');
          if (isMounted) {
            setCatalogSeries(list || []);
          }
        } else {
          const item = await fetchMediaDetails(resolvedId, resolvedType);
          if (isMounted) {
            setMedia(item);
            if (item.seasons && item.seasons.length > 0) {
              const hasRequested = item.seasons.some((s) => s.seasonNumber === initialSeason);
              if (!hasRequested) {
                const defaultSeason = item.seasons.find((s) => s.seasonNumber > 0) || item.seasons[0];
                setSelectedSeasonNumber(defaultSeason.seasonNumber);
              }
            }
          }
        }
      } catch (err) {
        console.error('Failed to load media for seasons page:', err);
      } finally {
        if (isMounted) setLoadingMedia(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [resolvedId, resolvedType, initialSeason]);

  // 2. Fetch episodes whenever selectedSeasonNumber changes
  useEffect(() => {
    let isMounted = true;
    if (!resolvedId) return;

    async function loadEpisodes() {
      setLoadingEpisodes(true);
      try {
        const eps = await fetchSeasonEpisodes(resolvedId, selectedSeasonNumber);
        if (isMounted) {
          if (eps && eps.length > 0) {
            setEpisodes(eps);
          } else if (media?.seasons) {
            // Fallback to pre-cached episodes on media.seasons
            const currentSeason = media.seasons.find((s) => s.seasonNumber === selectedSeasonNumber);
            setEpisodes(currentSeason?.episodes || []);
          }
        }
      } catch (err) {
        console.error('Failed to load season episodes:', err);
      } finally {
        if (isMounted) setLoadingEpisodes(false);
      }
    }

    loadEpisodes();
    return () => {
      isMounted = false;
    };
  }, [resolvedId, selectedSeasonNumber, media]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (loadingMedia && !media && catalogSeries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-accent" />
        <p className="text-xs text-muted">Loading season directory and episode archives...</p>
      </div>
    );
  }

  // If no media loaded but catalogSeries is available, render Series & Seasons Directory
  if (!media && catalogSeries.length > 0) {
    return (
      <div className="w-full min-h-screen px-4 sm:px-8 lg:px-12 py-8 pb-24 space-y-8 max-w-7xl mx-auto">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-semibold">
            <Layers className="w-3.5 h-3.5" />
            <span>Broadcast Registry & Episode Archives</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-['Outfit',sans-serif] text-foreground tracking-tight">
            Explore Series & Seasons
          </h1>
          <p className="text-xs sm:text-sm text-muted">
            Select any television series or animation to inspect its complete season lineup, specials, and broadcast guide.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {catalogSeries.map((show) => (
            <div
              key={show.id}
              onClick={() => {
                navigate(`/season?id=${show.id}&type=${show.type}`);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/40 bg-card hover:border-accent/50 p-2.5 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer select-none text-left"
            >
              <div>
                <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-surface mb-2.5">
                  <img
                    src={show.posterUrl}
                    alt={show.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md flex items-center gap-1 text-[10px] font-bold text-amber-400">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{(show.ratings?.imdb ?? 0).toFixed(1)}</span>
                  </div>
                </div>

                <h4 className="font-semibold text-xs sm:text-sm text-foreground line-clamp-1 group-hover:text-accent transition-colors">
                  {show.title}
                </h4>
                <p className="text-[11px] text-muted line-clamp-1 mt-0.5">
                  {show.releaseYear} • {show.genres?.slice(0, 2).join(', ')}
                </p>
              </div>

              <div className="mt-2.5 pt-2 border-t border-border/30 flex items-center justify-between text-xs text-accent font-semibold">
                <span>View Seasons</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!media) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4 text-center">
        <Tv className="w-16 h-16 text-muted/30" />
        <h2 className="text-2xl font-bold text-foreground">Series Not Found</h2>
        <p className="text-sm text-muted max-w-md">
          Unable to locate broadcast seasons for the requested record.
        </p>
        <button
          onClick={() => navigate('/')}
          className={`px-5 py-2.5 rounded-xl bg-gradient-to-r ${accentConfig.gradient} text-sm font-semibold text-white shadow-lg cursor-pointer`}
        >
          Return Home
        </button>
      </div>
    );
  }

  const seasonsList: Season[] = media.seasons && media.seasons.length > 0 
    ? media.seasons 
    : [
        {
          seasonNumber: 1,
          name: 'Season 1',
          episodeCount: media.totalEpisodes || 12,
          posterUrl: media.posterUrl,
          overview: media.overview,
          airYear: media.releaseYear,
        }
      ];

  const currentSeason = seasonsList.find((s) => s.seasonNumber === selectedSeasonNumber) || seasonsList[0];
  const inWatchlist = isInWatchlist(media.id);
  const watchlistItem = getWatchlistItem(media.id);

  return (
    <div className="w-full min-h-screen pb-24 text-foreground selection:bg-accent selection:text-white">
      {/* Top Hero Banner with Show Overview & Backdrop */}
      <div className="relative w-full max-h-[480px] overflow-hidden border-b border-border/20 bg-card">
        {/* Backdrop Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={media.backdropUrl || media.posterUrl}
            alt={media.title}
            className="w-full h-full object-cover object-center filter brightness-[0.88] contrast-[1.02]"
          />
          <FilmGrainOverlay opacity={0.3} />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />
        </div>

        {/* Header Controls */}
        <div className="relative z-10 w-full px-4 sm:px-8 lg:px-12 pt-6 flex items-center justify-between">
          <button
            onClick={() => navigate(`/details/${media.type}/${media.id}`)}
            className="inline-flex items-center gap-2 rounded-xl bg-black/60 px-3.5 py-1.5 text-xs font-semibold text-white/90 backdrop-blur-md border border-white/15 hover:bg-surface/50 hover:text-foreground transition-all shadow-md active:scale-95"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Title Details</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 rounded-xl bg-black/60 px-3.5 py-1.5 text-xs font-medium text-white/90 backdrop-blur-md border border-white/15 hover:bg-surface/50 transition-all shadow-md"
            title="Share Season"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link Copied' : 'Share'}</span>
          </button>
        </div>

        {/* Hero Meta & Poster */}
        <div className="relative z-10 w-full px-4 sm:px-8 lg:px-12 py-8 pb-10 max-w-7xl mx-auto flex flex-col sm:flex-row gap-6 sm:gap-8 items-start sm:items-end">
          <div className="w-28 sm:w-36 aspect-[2/3] shrink-0 rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-card">
            <img
              src={currentSeason?.posterUrl || media.posterUrl}
              alt={currentSeason?.name || media.title}
              className="w-full h-full object-cover object-center"
            />
          </div>

          <div className="space-y-2.5 max-w-2xl text-left">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className={`px-2.5 py-0.5 rounded-full font-bold ${accentConfig.badgeBg} ${accentConfig.badgeText} border border-accent/30`}>
                {media.type === 'anime' ? 'Anime Series' : 'TV Series'}
              </span>
              <span className="text-muted">•</span>
              <span className="text-foreground font-medium">{media.releaseYear}</span>
              <span className="text-muted">•</span>
              <span className="text-foreground font-medium">{seasonsList.length} Season{seasonsList.length > 1 ? 's' : ''} Available</span>
              <span className="text-muted">•</span>
              <span className="flex items-center gap-1 text-amber-400 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {(media.ratings?.imdb ?? 0).toFixed(1)}
              </span>
            </div>

            <h1 className="font-['Outfit',sans-serif] text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
              {media.title}
            </h1>

            <p className="text-xs sm:text-sm text-muted line-clamp-2">
              {currentSeason?.overview || media.overview}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-8 space-y-8">
        {/* Season & Specials Selector Tabs */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Tv className="w-4 h-4 text-accent" />
              <h2 className="text-base sm:text-lg font-bold font-['Outfit',sans-serif] text-foreground">
                All Seasons & Specials ({seasonsList.length})
              </h2>
            </div>
            <span className="text-xs text-muted">
              Select a season to view its complete episode broadcast guide
            </span>
          </div>

          <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
            {seasonsList.map((s) => {
              const isSelected = selectedSeasonNumber === s.seasonNumber;
              const isSpecial = s.seasonNumber === 0;

              return (
                <button
                  key={`season-tab-${s.seasonNumber}`}
                  onClick={() => setSelectedSeasonNumber(s.seasonNumber)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shadow-sm ${
                    isSelected
                      ? `bg-gradient-to-r ${accentConfig.gradient} text-white shadow-accent/25`
                      : 'bg-surface/50 text-muted hover:text-foreground hover:bg-surface border border-border/40'
                  }`}
                >
                  {isSpecial ? (
                    <Sparkles className="w-3.5 h-3.5" />
                  ) : (
                    <Film className="w-3.5 h-3.5" />
                  )}
                  <span>{s.name || (isSpecial ? 'Specials' : `Season ${s.seasonNumber}`)}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isSelected ? 'bg-black/30 text-white' : 'bg-background/80 text-muted'}`}>
                    {s.episodeCount} eps
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Season Header */}
        <div className="p-5 rounded-2xl bg-surface/30 border border-border/40 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-foreground">
                {currentSeason?.name || `Season ${selectedSeasonNumber}`}
              </h3>
              {currentSeason?.seasonNumber === 0 && (
                <span className="px-2 py-0.5 rounded-md bg-accent/20 text-accent border border-accent/30 text-[10px] font-bold">
                  SPECIALS
                </span>
              )}
            </div>
            <p className="text-xs text-muted">
              {currentSeason?.airYear ? `Premiered in ${currentSeason.airYear} • ` : ''}
              {episodes.length} Episodes Catalogued
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (!inWatchlist) addToWatchlist(media, 'watching');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                inWatchlist
                  ? `${accentConfig.badgeBg} border-accent text-accent`
                  : 'bg-card border-border/50 text-muted hover:text-foreground hover:bg-surface'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{inWatchlist ? 'In Watchlist' : 'Add Show to Watchlist'}</span>
            </button>
          </div>
        </div>

        {/* Episode Grid (Responsive & High-Density) */}
        <div>
          {loadingEpisodes ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
              <p className="text-xs text-muted">Loading episodes for {currentSeason?.name}...</p>
            </div>
          ) : episodes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {episodes.map((ep) => {
                const isWatched = (watchlistItem?.watchedEpisodes || 0) >= ep.episodeNumber;

                return (
                  <div
                    key={`ep-${ep.episodeNumber}`}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/40 bg-card hover:border-accent/50 p-3 shadow-md hover:shadow-xl transition-all duration-300"
                  >
                    <div>
                      {/* Thumbnail Container */}
                      <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-surface mb-2.5">
                        <img
                          src={ep.stillUrl || media.backdropUrl || media.posterUrl}
                          alt={ep.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                        {/* Episode Number Badge */}
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[10px] font-bold text-accent border border-accent/30">
                          EP {ep.episodeNumber}
                        </div>

                        {/* Runtime */}
                        {ep.runtimeMinutes && (
                          <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/70 text-[10px] text-white/90 font-mono">
                            {ep.runtimeMinutes}m
                          </div>
                        )}
                      </div>

                      {/* Episode Title & Metadata */}
                      <div className="space-y-1">
                        <h4 className="font-semibold text-xs sm:text-sm text-foreground line-clamp-1 group-hover:text-accent transition-colors">
                          {ep.title}
                        </h4>

                        {ep.airDate && (
                          <p className="text-[10px] text-muted flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-muted/70" />
                            <span>{ep.airDate}</span>
                          </p>
                        )}

                        <p className="text-[11px] text-muted line-clamp-2 mt-1 leading-relaxed">
                          {ep.overview}
                        </p>
                      </div>
                    </div>

                    {/* Footer Actions: Rating & Watched Toggle */}
                    <div className="mt-3 pt-2.5 border-t border-border/30 flex items-center justify-between">
                      <span className="text-[10px] text-amber-400 flex items-center gap-1 font-semibold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {ep.voteAverage ? ep.voteAverage.toFixed(1) : '8.0'}
                      </span>

                      <button
                        onClick={() => {
                          if (!inWatchlist) addToWatchlist(media, 'watching');
                          updateEpisodeProgress(media.id, isWatched ? ep.episodeNumber - 1 : ep.episodeNumber);
                        }}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-semibold transition-all cursor-pointer ${
                          isWatched
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-surface/50 text-muted hover:bg-surface hover:text-foreground border border-border/50'
                        }`}
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{isWatched ? 'Watched' : 'Mark Watched'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-border/40 bg-card p-10 text-center space-y-3">
              <Tv className="w-10 h-10 text-muted/40 mx-auto" />
              <p className="text-sm text-foreground font-semibold">No episodes found for this season</p>
              <p className="text-xs text-muted">Episode details are still being synchronized with broadcast registries.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
