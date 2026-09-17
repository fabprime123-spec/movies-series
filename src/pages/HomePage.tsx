import React, { useState, useEffect, useRef } from 'react';
import { HeroBanner } from '../components/HeroBanner';
import { MediaCard } from '../components/MediaCard';
import { MediaGridSkeleton, HeroBannerSkeleton, MediaSliderSkeleton } from '../components/Skeletons';
import { MediaItem } from '../types';
import { GENRES_LIST } from '../data/constants';
import { fetchTrendingTitles, fetchDiscoverMedia } from '../services/tmdb';
import { Sparkles, Film, Tv, Flame, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCountryFilter } from '../context/CountryFilterContext';
import { CountryExclusionBar } from '../components/CountryExclusionBar';

export const HomePage: React.FC = () => {
  const [trending, setTrending] = useState<MediaItem[]>([]);
  const [topMovies, setTopMovies] = useState<MediaItem[]>([]);
  const [topSeries, setTopSeries] = useState<MediaItem[]>([]);
  const [topAnime, setTopAnime] = useState<MediaItem[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>('All Genres');
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const trendingScrollRef = useRef<HTMLDivElement>(null);
  const { filterMediaList, excludedCountries } = useCountryFilter();

  useEffect(() => {
    let isMounted = true;
    async function loadHomeContent() {
      setLoading(true);
      try {
        const [trendData, moviesData, seriesData, animeData] = await Promise.all([
          fetchTrendingTitles('all', 'week'),
          fetchDiscoverMedia('movie', selectedGenre === 'All Genres' ? '' : selectedGenre),
          fetchDiscoverMedia('tv', selectedGenre === 'All Genres' ? '' : selectedGenre),
          fetchDiscoverMedia('anime', selectedGenre === 'All Genres' ? '' : selectedGenre),
        ]);

        if (isMounted) {
          setTrending(trendData || []);
          setTopMovies(moviesData || []);
          setTopSeries(seriesData || []);
          setTopAnime(animeData || []);
        }
      } catch (err) {
        console.error('Home content load error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadHomeContent();
    return () => {
      isMounted = false;
    };
  }, [selectedGenre]);

  const scrollTrending = (direction: 'left' | 'right') => {
    if (trendingScrollRef.current) {
      const scrollAmount = direction === 'left' ? -480 : 480;
      trendingScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const filteredTrending = filterMediaList(trending);
  const filteredMovies = filterMediaList(topMovies);
  const filteredSeries = filterMediaList(topSeries);
  const filteredAnime = filterMediaList(topAnime);

  const featuredItem = filteredTrending[0];

  return (
    <div className="w-full pb-20">
      {/* Editorial Hero Banner or Skeleton */}
      {loading && !featuredItem ? (
        <HeroBannerSkeleton />
      ) : featuredItem ? (
        <HeroBanner
          item={featuredItem}
          onOpenDetails={() => navigate(`/details/${featuredItem.type}/${featuredItem.id}`)}
          onPlayTrailer={() => {}}
        />
      ) : null}

      <div className="w-full mt-8 space-y-12">
        {/* Country Exclusion & Genre Selection Header */}
        <div className="px-4 sm:px-8 lg:px-12 flex flex-col gap-4 border-b border-border pb-5">
          <CountryExclusionBar />

          {/* Genre Pill Selection */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {GENRES_LIST.map((genre) => {
              const isSelected = selectedGenre === genre;
              return (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`whitespace-nowrap px-4 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                    isSelected
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20'
                      : 'bg-surface text-muted hover:bg-surface/80 hover:text-foreground border border-border'
                  }`}
                >
                  {genre}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 1: Trending Now - 1 Row with Big Rank Numbers 1 to 15 */}
        <section>
          <div className="flex items-center justify-between mb-4 px-4 sm:px-8 lg:px-12">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-['Outfit',sans-serif] text-foreground">
                  Top 15 Trending Worldwide
                </h2>
                <p className="text-xs text-muted">Current global box-office and streaming phenomena ranked #1 to #15</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Carousel Scroll Buttons */}
              <div className="hidden sm:flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => scrollTrending('left')}
                  className="p-2 rounded-xl border border-border bg-card text-foreground hover:bg-muted/20 transition-all active:scale-95 shadow-sm"
                  aria-label="Scroll Left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollTrending('right')}
                  className="p-2 rounded-xl border border-border bg-card text-foreground hover:bg-muted/20 transition-all active:scale-95 shadow-sm"
                  aria-label="Scroll Right"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => navigate('/search')}
                className="text-xs font-semibold text-orange-400 hover:text-orange-300 flex items-center gap-1 transition-colors ml-2"
              >
                Explore All →
              </button>
            </div>
          </div>

          {loading ? (
            <div className="px-4 sm:px-8 lg:px-12">
              <MediaSliderSkeleton />
            </div>
          ) : filteredTrending.length === 0 ? (
            <div className="mx-4 sm:mx-8 lg:mx-12 p-12 text-center text-muted bg-card border border-border rounded-2xl">
              No releases found matching active country filters.
            </div>
          ) : (
            <div
              ref={trendingScrollRef}
              className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory py-4 px-4 sm:px-8 lg:px-12 carousel-contain"
            >
              {filteredTrending.slice(0, 15).map((item, index) => {
                const rank = index + 1;
                return (
                  <div
                    key={`trending-${item.id}-${rank}`}
                    className="relative shrink-0 w-[170px] sm:w-[195px] md:w-[215px] snap-start group pt-1 pl-4 sm:pl-5 card-gpu"
                  >
                    {/* Clean High-Contrast Rank Numeral - no overlapping stroke lines */}
                    <div className="absolute -left-2 sm:-left-3 bottom-8 sm:bottom-10 z-30 flex items-end select-none pointer-events-none">
                      <span
                        className="font-['Outfit',sans-serif] font-black text-6xl sm:text-7xl md:text-8xl leading-none tracking-normal select-none transition-transform duration-300 group-hover:scale-105 bg-gradient-to-b from-white via-slate-100 to-slate-400/80 bg-clip-text text-transparent drop-shadow-[0_12px_24px_rgba(0,0,0,0.95)]"
                      >
                        {rank}
                      </span>
                    </div>

                    {/* Poster Card with uniform identical size */}
                    <div className="w-full relative z-10">
                      <MediaCard item={item} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Section 2: Acclaimed Cinema (Movies) */}
        <section className="px-4 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Film className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-['Outfit',sans-serif] text-foreground">
                  Acclaimed Feature Films
                </h2>
                <p className="text-xs text-muted">Award-winning theatrical and streaming features</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/movies')}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
            >
              View Movies Issue →
            </button>
          </div>

          {loading ? (
            <MediaGridSkeleton count={6} />
          ) : filteredMovies.length === 0 ? (
            <div className="p-8 text-center text-muted bg-card border border-border rounded-2xl">
              No feature films found.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
              {filteredMovies.slice(0, 6).map((item) => (
                <MediaCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>

        {/* Section 3: High-Concept TV Series */}
        <section className="px-4 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30">
                <Tv className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-['Outfit',sans-serif] text-foreground">
                  Peak Television & Series
                </h2>
                <p className="text-xs text-muted">Compelling serial narratives and seasonal drama</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/series')}
              className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
            >
              View Series Issue →
            </button>
          </div>

          {loading ? (
            <MediaGridSkeleton count={6} />
          ) : filteredSeries.length === 0 ? (
            <div className="p-8 text-center text-muted bg-card border border-border rounded-2xl">
              No TV series found.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
              {filteredSeries.slice(0, 6).map((item) => (
                <MediaCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>

        {/* Section 4: Anime & Animation Masterpieces */}
        <section className="px-4 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-pink-500/20 text-pink-400 border border-pink-500/30">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-['Outfit',sans-serif] text-foreground">
                  Anime & Animation Spotlight
                </h2>
                <p className="text-xs text-muted">Iconic animation, visual mastery, and Japanese serialized sagas</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/search?type=anime')}
              className="text-xs font-semibold text-pink-400 hover:text-pink-300 flex items-center gap-1 transition-colors"
            >
              Explore Anime →
            </button>
          </div>

          {loading ? (
            <MediaGridSkeleton count={6} />
          ) : filteredAnime.length === 0 ? (
            <div className="p-8 text-center text-muted bg-card border border-border rounded-2xl">
              No anime titles found.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
              {filteredAnime.slice(0, 6).map((item) => (
                <MediaCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
