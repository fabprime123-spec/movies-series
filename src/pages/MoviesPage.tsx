import React, { useState, useEffect } from 'react';
import { MediaCard } from '../components/MediaCard';
import { MediaItem } from '../types';
import { MOCK_MEDIA, GENRES_LIST } from '../data/mockMedia';
import { fetchDiscoverMedia } from '../services/tmdb';
import { Film, Filter, Loader2, Sparkles } from 'lucide-react';

export const MoviesPage: React.FC = () => {
  const [movies, setMovies] = useState<MediaItem[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>('All Genres');
  const [sortBy, setSortBy] = useState<string>('popularity.desc');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    async function loadMovies() {
      setLoading(true);
      try {
        const data = await fetchDiscoverMedia(
          'movie',
          selectedGenre === 'All Genres' ? '' : selectedGenre,
          sortBy
        );
        if (isMounted) {
          setMovies(data.length > 0 ? data : MOCK_MEDIA.filter((m) => m.type === 'movie'));
        }
      } catch (err) {
        console.warn('Error loading movies:', err);
        if (isMounted) setMovies(MOCK_MEDIA.filter((m) => m.type === 'movie'));
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadMovies();
    return () => {
      isMounted = false;
    };
  }, [selectedGenre, sortBy]);

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-8 pb-24 space-y-8">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-1.5">
            <Film className="w-4 h-4" />
            <span>The Cinema Edition</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-['Outfit',sans-serif] text-white tracking-tight">
            Feature Films & Premieres
          </h1>
          <p className="text-sm text-white/50 mt-1 max-w-2xl">
            Explore global cinema classics, modern blockbusters, and award-winning festival premieres with deep technical and audio specs.
          </p>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-3">
          <label className="text-xs text-white/50 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Sort:
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-xl border border-white/10 bg-[#151722] px-3 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none"
          >
            <option value="popularity.desc">Most Popular</option>
            <option value="vote_average.desc">Highest Rated</option>
            <option value="primary_release_date.desc">Newest Releases</option>
            <option value="revenue.desc">Box Office Gross</option>
          </select>
        </div>
      </div>

      {/* Genre Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {GENRES_LIST.map((genre) => {
          const isSelected = selectedGenre === genre;
          return (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              {genre}
            </button>
          );
        })}
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {movies.map((item) => (
            <MediaCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};
