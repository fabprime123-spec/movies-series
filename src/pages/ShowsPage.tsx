import React, { useState, useEffect } from 'react';
import { MediaCard } from '../components/MediaCard';
import { MediaGridSkeleton } from '../components/Skeletons';
import { MediaItem } from '../types';
import { GENRES_LIST } from '../data/constants';
import { fetchDiscoverMedia } from '../services/tmdb';
import { Tv, Filter } from 'lucide-react';

export const ShowsPage: React.FC = () => {
  const [shows, setShows] = useState<MediaItem[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>('All Genres');
  const [sortBy, setSortBy] = useState<string>('popularity.desc');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    async function loadShows() {
      setLoading(true);
      try {
        const data = await fetchDiscoverMedia(
          'tv',
          selectedGenre === 'All Genres' ? '' : selectedGenre,
          sortBy
        );
        if (isMounted) {
          setShows(data || []);
        }
      } catch (err) {
        console.error('Error loading shows:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadShows();
    return () => {
      isMounted = false;
    };
  }, [selectedGenre, sortBy]);

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-8 pb-24 space-y-8">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-widest mb-1.5">
            <Tv className="w-4 h-4" />
            <span>The Television Issue</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-['Outfit',sans-serif] text-foreground tracking-tight">
            Peak Series & Serialized Drama
          </h1>
          <p className="text-sm text-muted mt-1 max-w-2xl">
            Complete episode guides, season arcs, broadcast timelines, and multi-language dubbing tracks for world-class television.
          </p>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-3">
          <label className="text-xs text-muted flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Sort:
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-xl border border-border bg-surface px-3 py-1.5 text-xs text-foreground focus:border-ring focus:outline-none"
          >
            <option value="popularity.desc">Most Popular</option>
            <option value="vote_average.desc">Highest Rated</option>
            <option value="first_air_date.desc">Latest Air Dates</option>
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
                  ? 'bg-purple-500 text-white font-bold shadow-md shadow-purple-500/20'
                  : 'bg-surface text-muted hover:bg-surface/80 hover:text-foreground border border-border'
              }`}
            >
              {genre}
            </button>
          );
        })}
      </div>

      {/* Media Grid */}
      {loading ? (
        <MediaGridSkeleton count={18} />
      ) : shows.length === 0 ? (
        <div className="p-12 text-center text-muted bg-card border border-border rounded-2xl">
          No TV shows found matching your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {shows.map((item) => (
            <MediaCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};
