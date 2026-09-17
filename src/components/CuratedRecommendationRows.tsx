import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ChevronLeft, ChevronRight, Star, Clapperboard, Award, Film } from 'lucide-react';
import { MediaSliderSkeleton } from './Skeletons';

interface CuratedItem {
  id: number | string;
  title?: string;
  name?: string;
  poster_path?: string;
  backdrop_path?: string;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
  media_type?: string;
  genre_ids?: number[];
}

interface CuratedRow {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  items: CuratedItem[];
}

interface RecommendationsPayload {
  baseTitle: string;
  primaryGenre: string;
  directorName?: string;
  leadActorName?: string;
  rows: CuratedRow[];
}

interface CuratedRecommendationRowsProps {
  type: string;
  id: string;
}

export const CuratedRecommendationRows: React.FC<CuratedRecommendationRowsProps> = ({ type, id }) => {
  const navigate = useNavigate();
  const [data, setData] = useState<RecommendationsPayload | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchCurated() {
      try {
        setLoading(true);
        const res = await fetch(`/api/recommendations/${type}/${id}`);
        if (res.ok) {
          const json = await res.json();
          if (isMounted) setData(json);
        }
      } catch (err) {
        console.error('Failed to load curated recommendations:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchCurated();
    return () => {
      isMounted = false;
    };
  }, [type, id]);

  if (loading) {
    return (
      <div className="space-y-10 py-6">
        <MediaSliderSkeleton />
        <MediaSliderSkeleton />
      </div>
    );
  }

  if (!data || !data.rows || data.rows.length === 0) {
    return null;
  }

  return (
    <div id="section-recommendations" className="scroll-mt-28 space-y-12">
      {data.rows.map((row) => (
        <RecommendationRow key={row.id} row={row} defaultType={type} navigate={navigate} />
      ))}
    </div>
  );
};

interface RowProps {
  row: CuratedRow;
  defaultType: string;
  navigate: (path: string) => void;
}

const RecommendationRow: React.FC<RowProps> = ({ row, defaultType, navigate }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -500 : 500;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!row.items || row.items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Row Header with standard screen gutters */}
      <div className="flex items-center justify-between px-4 sm:px-8 lg:px-12">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-orange-500/20 border border-orange-500/30 text-orange-400">
            {row.id === 'director-spotlight' ? (
              <Clapperboard className="w-5 h-5" />
            ) : row.id === 'genre-masterpieces' ? (
              <Award className="w-5 h-5" />
            ) : (
              <Sparkles className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-bold font-['Outfit',sans-serif] text-white">
                {row.title}
              </h3>
              <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 hidden sm:inline">
                {row.badge}
              </span>
            </div>
            <p className="text-xs text-white/50">{row.subtitle}</p>
          </div>
        </div>

        {/* Carousel Navigation Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => scroll('left')}
            className="p-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/15 text-white transition-all active:scale-95"
            aria-label="Scroll Left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            className="p-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/15 text-white transition-all active:scale-95"
            aria-label="Scroll Right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Edge-to-Edge 1-Row Slider Track */}
      <div
        ref={scrollRef}
        className="flex gap-4 sm:gap-5 overflow-x-auto scrollbar-none snap-x snap-mandatory py-2 px-4 sm:px-8 lg:px-12 carousel-contain"
      >
        {row.items.map((item) => {
          const itemTitle = item.title || item.name || 'Untitled';
          const itemYear = (item.release_date || item.first_air_date || '').split('-')[0];
          const rating = item.vote_average ? item.vote_average.toFixed(1) : null;
          const posterUrl = item.poster_path
            ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
            : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=80';
          const itemType = item.media_type || defaultType || 'movie';

          return (
            <div
              key={`${row.id}-${item.id}`}
              onClick={() => {
                navigate(`/details/${itemType}/${item.id}`);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group relative shrink-0 w-[145px] sm:w-[175px] md:w-[195px] snap-start cursor-pointer transition-transform duration-200 hover:-translate-y-1.5 card-gpu"
            >
              {/* Poster Container */}
              <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-[#12141d] border border-white/10 group-hover:border-orange-500/50 shadow-lg shadow-black/40 transition-colors">
                <img
                  src={posterUrl}
                  alt={itemTitle}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Rating Badge */}
                {rating && (
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-black/75 backdrop-blur-md border border-white/10 flex items-center gap-1 text-[11px] font-bold text-amber-400">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{rating}</span>
                  </div>
                )}

                {/* Year Pill */}
                {itemYear && (
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-black/75 backdrop-blur-md border border-white/10 text-[10px] font-semibold text-white/80">
                    {itemYear}
                  </div>
                )}

                {/* Hover Gradient Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <span className="text-xs font-bold text-orange-400">Explore Title →</span>
                </div>
              </div>

              {/* Title & Info below card */}
              <div className="mt-2.5 space-y-0.5 px-0.5">
                <h4 className="text-xs sm:text-sm font-semibold text-white truncate group-hover:text-orange-400 transition-colors">
                  {itemTitle}
                </h4>
                <p className="text-[11px] text-white/50 flex items-center gap-1.5">
                  <span>{itemYear || 'Cinema'}</span>
                  <span>•</span>
                  <span className="capitalize">{itemType}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
