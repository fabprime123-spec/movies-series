import React, { useState, useEffect } from 'react';
import { HeroBanner } from '../components/HeroBanner';
import { MediaCard } from '../components/MediaCard';
import { MediaItem } from '../types';
import { MOCK_MEDIA, GENRES_LIST } from '../data/mockMedia';
import { fetchTrendingTitles, fetchDiscoverMedia } from '../services/tmdb';
import { Sparkles, Film, Tv, Flame, Compass, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const [trending, setTrending] = useState<MediaItem[]>(MOCK_MEDIA);
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
          if (trendData.length > 0) setTrending(trendData);
          if (moviesData.length > 0) setTopMovies(moviesData);
          if (showsData.length > 0) setTopShows(showsData);
          if (animeData.length > 0) setTopAnime(animeData);
        }
      } catch (err) {
        console.warn('Using fallback home data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadHomeContent();
    return () => {
      isMounted = false;
    };
  }, [selectedGenre]);

  const featuredItem = trending[0] || MOCK_MEDIA[0];

  return (
    <div className="w-full pb-20">
      {/* Editorial Hero Banner */}
      {featuredItem && (
        <HeroBanner
          item={featuredItem}
          onOpenDetails={() => navigate(`/details/${featuredItem.type}/${featuredItem.id}`)}
          onPlayTrailer={() => {}}
        />
      )}

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
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
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
                <h2 className="text-xl sm:text-2xl font-bold font-['Outfit',sans-serif] text-white">
                  Trending Releases
                </h2>
                <p className="text-xs text-white/50">Current global box-office and streaming phenomena</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/search')}
              className="text-xs font-semibold text-orange-400 hover:text-orange-300 flex items-center gap-1 transition-colors"
            >
              Explore All →
            </button>
          </div>

          {loading && trending.length === 0 ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
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
                <h2 className="text-xl sm:text-2xl font-bold font-['Outfit',sans-serif] text-white">
                  Acclaimed Feature Films
                </h2>
                <p className="text-xs text-white/50">Award-winning theatrical and streaming features</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/movies')}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
            >
              View Movies Issue →
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {(topMovies.length > 0 ? topMovies : MOCK_MEDIA.filter(m => m.type === 'movie')).slice(0, 6).map((item) => (
              <MediaCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        {/* Section 3: High-Concept TV Series */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30">
                <Tv className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-['Outfit',sans-serif] text-white">
                  Peak Television & Series
                </h2>
                <p className="text-xs text-white/50">Compelling serial narratives and seasonal drama</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/shows')}
              className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
            >
              View Shows Issue →
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {(topShows.length > 0 ? topShows : MOCK_MEDIA.filter(m => m.type === 'tv')).slice(0, 6).map((item) => (
              <MediaCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        {/* Section 4: Anime & Animation Masterpieces */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-pink-500/20 text-pink-400 border border-pink-500/30">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-['Outfit',sans-serif] text-white">
                  Anime & Animation Spotlight
                </h2>
                <p className="text-xs text-white/50">Iconic animation, visual mastery, and Japanese serialized sagas</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/search?type=anime')}
              className="text-xs font-semibold text-pink-400 hover:text-pink-300 flex items-center gap-1 transition-colors"
            >
              Explore Anime →
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {(topAnime.length > 0 ? topAnime : MOCK_MEDIA.filter(m => m.type === 'anime')).slice(0, 6).map((item) => (
              <MediaCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
