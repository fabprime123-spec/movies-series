import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Clapperboard, Award } from 'lucide-react';
import { MediaSliderSkeleton } from './Skeletons';
import { HorizontalSlider, RatingBadge } from './common';

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
  id?: string;
  category?: string;
  title: string;
  subtitle: string;
  badge?: string;
  badgeText?: string;
  items: CuratedItem[];
}

interface RecommendationsPayload {
  baseTitle?: string;
  title?: string;
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
          const contentType = res.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            const json = await res.json();
            if (isMounted) setData(json);
          }
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
      {data.rows.map((row, rowIndex) => {
        const rowKey = `curated-row-${row.id || row.category || 'cat'}-${rowIndex}`;
        return (
          <RecommendationRow
            key={rowKey}
            row={row}
            rowIndex={rowIndex}
            defaultType={type}
            navigate={navigate}
          />
        );
      })}
    </div>
  );
};

interface RowProps {
  row: CuratedRow;
  rowIndex: number;
  defaultType: string;
  navigate: (path: string) => void;
}

const RecommendationRow: React.FC<RowProps> = ({ row, rowIndex, defaultType, navigate }) => {
  const rowId = `rec-row-${row.id || row.category || 'cat'}-${rowIndex}`;
  const badgeLabel = row.badge || row.badgeText || 'Curated Match';

  const uniqueItems = React.useMemo(() => {
    const seen = new Set<string | number>();
    return (row.items || []).filter((item) => {
      if (!item || item.id === undefined || item.id === null) return false;
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  }, [row.items]);

  if (uniqueItems.length === 0) {
    return null;
  }

  const header = (
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-xl bg-accent/20 border border-accent/30 text-accent">
        {row.id === 'director-spotlight' || row.category === 'director' ? (
          <Clapperboard className="w-5 h-5" />
        ) : row.id === 'genre-masterpieces' || row.category === 'benchmark' ? (
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
          <span className="text-[10px] font-bold text-accent uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20 hidden sm:inline">
            {badgeLabel}
          </span>
        </div>
        <p className="text-xs text-white/50">{row.subtitle}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-3">
      <HorizontalSlider
        id={rowId}
        header={header}
        buttonsPosition="header"
        gutter="standard"
        gap="md"
        scrollAmount={550}
      >
        {uniqueItems.map((item, itemIndex) => {
          const itemTitle = item.title || item.name || 'Untitled';
          const itemYear = (item.release_date || item.first_air_date || '').split('-')[0];
          const rating = item.vote_average ? Number(item.vote_average.toFixed(1)) : null;
          const posterUrl = item.poster_path
            ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
            : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=80';
          const itemType = item.media_type || defaultType || 'movie';
          const itemKey = `${rowId}-${item.id || 'item'}-${itemIndex}`;

          return (
            <div
              key={itemKey}
              onClick={() => {
                navigate(`/details/${itemType}/${item.id}`);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group relative shrink-0 w-[145px] sm:w-[175px] md:w-[195px] snap-start cursor-pointer transition-transform duration-200 hover:-translate-y-1.5 card-gpu"
            >
              {/* Poster Container */}
              <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-[#12141d] border border-white/10 group-hover:border-accent/50 shadow-lg shadow-black/40 transition-colors">
                <img
                  src={posterUrl}
                  alt={itemTitle}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Rating Badge */}
                {rating !== null && rating > 0 && (
                  <div className="absolute top-2.5 right-2.5">
                    <RatingBadge rating={rating} size="sm" variant="glass" />
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
                  <span className="text-xs font-bold text-accent">Explore Title →</span>
                </div>
              </div>

              {/* Title & Info below card */}
              <div className="mt-2.5 space-y-0.5 px-0.5">
                <h4 className="text-xs sm:text-sm font-semibold text-white truncate group-hover:text-accent transition-colors">
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
      </HorizontalSlider>
    </div>
  );
};
