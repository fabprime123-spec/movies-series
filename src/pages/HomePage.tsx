import React, { useState, useEffect } from 'react';
import { HeroBanner } from '../components/HeroBanner';
import { MediaCard } from '../components/MediaCard';
import { MediaGridSkeleton, HeroBannerSkeleton } from '../components/Skeletons';
import { MediaItem } from '../types';
import { GENRES_LIST } from '../data/constants';
import { fetchTrendingTitles, fetchDiscoverMedia } from '../services/tmdb';
import { Sparkles, Film, Tv, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const [trending, setTrending] = useState<MediaItem[]>([]);
  const [topMovies, setTopMovies] = useState<MediaItem[]>([]);
  const [topShows, setTopShows] = useState<MediaItem[]>([]);
  const [topAnime, setTopAnime] = useState<MediaItem[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>('All Genres');
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    async function loadHomeContent() {
      setLoading(true);
      try {
        const [trendData, moviesData, showsData, animeData] = await Promise.all([
          fetchTrendingTitles('all', 'week'),
          fetchDiscoverMedia('movie', selectedGenre === 'All Genres' ? '' : selectedGenre),
          fetchDiscoverMedia('tv', selectedGenre === 'All Genres' ? '' : selectedGenre),
          fetchDiscoverMedia('anime', selectedGenre === 'All Genres' ? '' : selectedGenre),
        ]);

        if (isMounted) {
          setTrending(trendData || []);
          setTopMovies(moviesData || []);
          setTopShows(showsData || []);
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

  const featuredItem = trending[0];

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

      <div className="w-full px-4 sm:px-8 lg:px-12 mt-8 space-y-12">
        {/* Genre Pill Selection */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
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

        {/* Section 1: Trending Now */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-['Outfit',sans-serif] text-foreground">
                  Trending Releases
                </h2>
                <p className="text-xs text-muted">Current global box-office and streaming phenomena</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/search')}
              className="text-xs font-semibold text-orange-400 hover:text-orange-300 flex items-center gap-1 transition-colors"
            >
              Explore All →
            </button>
          </div>

          {loading ? (
            <MediaGridSkeleton count={12} />
          ) : trending.length === 0 ? (
            <div className="p-12 text-center text-muted bg-card border border-border rounded-2xl">
              No releases found for this category.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
              {trending.slice(0, 12).map((item) => (
                <MediaCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>

        {/* Section 2: Acclaimed Cinema (Movies) */}
        <section>
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
          ) : topMovies.length === 0 ? (
            <div className="p-8 text-center text-muted bg-card border border-border rounded-2xl">
              No feature films found.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
              {topMovies.slice(0, 6).map((item) => (
                <MediaCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>

        {/* Section 3: High-Concept TV Series */}
        <section>
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
              onClick={() => navigate('/shows')}
              className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
            >
              View Shows Issue →
            </button>
          </div>

          {loading ? (
            <MediaGridSkeleton count={6} />
          ) : topShows.length === 0 ? (
            <div className="p-8 text-center text-muted bg-card border border-border rounded-2xl">
              No TV series found.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
              {topShows.slice(0, 6).map((item) => (
                <MediaCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>

        {/* Section 4: Anime & Animation Masterpieces */}
        <section>
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
          ) : topAnime.length === 0 ? (
            <div className="p-8 text-center text-muted bg-card border border-border rounded-2xl">
              No anime titles found.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
              {topAnime.slice(0, 6).map((item) => (
                <MediaCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
