import React, { useState, useEffect, useRef, useCallback } from 'react';
import { HeroBanner } from '../components/HeroBanner';
import { MediaCard } from '../components/MediaCard';
import { HeroBannerSkeleton, MediaSliderSkeleton } from '../components/Skeletons';
import { MediaItem } from '../types';
import { GENRES_LIST } from '../data/constants';
import { fetchTrendingTitles, fetchDiscoverMedia } from '../services/tmdb';
import { 
  Sparkles, 
  Film, 
  Flame, 
  ChevronLeft, 
  ChevronRight,
  Zap,
  Rocket,
  ShieldAlert,
  Smile,
  Skull,
  Compass,
  Heart,
  Search,
  Video
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCountryFilter } from '../context/CountryFilterContext';
import { useTheme } from '../context/ThemeContext';
import { CountryExclusionBar } from '../components/CountryExclusionBar';

interface GenreConfig {
  key: string;
  name: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  badgeBg: string;
  border: string;
}

const FEATURED_GENRES: GenreConfig[] = [
  {
    key: 'action',
    name: 'Action',
    title: 'Action & Explosive Thrills',
    subtitle: 'High-octane blockbusters, intense martial arts, and heroic spectacle',
    icon: Zap,
    color: 'text-amber-400',
    badgeBg: 'bg-amber-500/20',
    border: 'border-amber-500/30',
  },
  {
    key: 'scifi',
    name: 'Sci-Fi',
    title: 'Sci-Fi & Futuristic Realities',
    subtitle: 'Dystopian futures, interstellar exploration, and mind-bending technology',
    icon: Rocket,
    color: 'text-cyan-400',
    badgeBg: 'bg-cyan-500/20',
    border: 'border-cyan-500/30',
  },
  {
    key: 'thriller',
    name: 'Thriller',
    title: 'Edge-of-Your-Seat Thrillers',
    subtitle: 'Nail-biting suspense, psychological tension, and shocking twists',
    icon: ShieldAlert,
    color: 'text-rose-400',
    badgeBg: 'bg-rose-500/20',
    border: 'border-rose-500/30',
  },
  {
    key: 'comedy',
    name: 'Comedy',
    title: 'Comedy & Feel-Good Cinema',
    subtitle: 'Witty satires, riotous laughter, and uplifting crowd-pleasers',
    icon: Smile,
    color: 'text-yellow-400',
    badgeBg: 'bg-yellow-500/20',
    border: 'border-yellow-500/30',
  },
  {
    key: 'drama',
    name: 'Drama',
    title: 'Acclaimed Human Dramas',
    subtitle: 'Award-winning performances, powerful narratives, and poignant character journeys',
    icon: Film,
    color: 'text-indigo-400',
    badgeBg: 'bg-indigo-500/20',
    border: 'border-indigo-500/30',
  },
  {
    key: 'animation',
    name: 'Animation',
    title: 'Animation & Anime Masterpieces',
    subtitle: 'Visually stunning hand-drawn and 3D animated cinematic stories',
    icon: Sparkles,
    color: 'text-pink-400',
    badgeBg: 'bg-pink-500/20',
    border: 'border-pink-500/30',
  },
  {
    key: 'horror',
    name: 'Horror',
    title: 'Horror & Paranormal Nightmares',
    subtitle: 'Chilling hauntings, supernatural terrors, and atmospheric dread',
    icon: Skull,
    color: 'text-red-400',
    badgeBg: 'bg-red-500/20',
    border: 'border-red-500/30',
  },
  {
    key: 'adventure',
    name: 'Adventure',
    title: 'Grand Quests & Epic Expeditions',
    subtitle: 'Treasure hunts, wilderness survival, and mythical journeys',
    icon: Compass,
    color: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/20',
    border: 'border-emerald-500/30',
  },
  {
    key: 'crime',
    name: 'Crime',
    title: 'Crime & Underworld Chronicles',
    subtitle: 'Heists, mafia dynasties, hardboiled noir, and forensic investigations',
    icon: Film,
    color: 'text-violet-400',
    badgeBg: 'bg-violet-500/20',
    border: 'border-violet-500/30',
  },
  {
    key: 'fantasy',
    name: 'Fantasy',
    title: 'Fantasy & Mythic Realms',
    subtitle: 'Enchanted kingdoms, ancient prophecies, and legendary lore',
    icon: Sparkles,
    color: 'text-purple-400',
    badgeBg: 'bg-purple-500/20',
    border: 'border-purple-500/30',
  },
  {
    key: 'romance',
    name: 'Romance',
    title: 'Romance & Passionate Encounters',
    subtitle: 'Heartfelt connections, timeless love affairs, and passionate bonds',
    icon: Heart,
    color: 'text-rose-400',
    badgeBg: 'bg-rose-500/20',
    border: 'border-rose-500/30',
  },
  {
    key: 'mystery',
    name: 'Mystery',
    title: 'Mystery & Detective Whodunits',
    subtitle: 'Unsolved puzzles, cryptic secrets, and investigative riddles',
    icon: Search,
    color: 'text-teal-400',
    badgeBg: 'bg-teal-500/20',
    border: 'border-teal-500/30',
  },
  {
    key: 'documentary',
    name: 'Documentary',
    title: 'Documentary & True World Stories',
    subtitle: 'Fascinating true stories, nature wonders, and historical revelations',
    icon: Video,
    color: 'text-blue-400',
    badgeBg: 'bg-blue-500/20',
    border: 'border-blue-500/30',
  },
];

const ALL_GENRES = ['All Genres', ...GENRES_LIST];

interface SingleGenreRowProps {
  genre: GenreConfig;
  items: MediaItem[];
  loading: boolean;
  filterMediaList: (list: MediaItem[]) => MediaItem[];
}

const SingleGenreRow: React.FC<SingleGenreRowProps> = ({
  genre,
  items,
  loading,
  filterMediaList,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const filteredItems = filterMediaList(items);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -480 : 480;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const Icon = genre.icon;

  return (
    <section id={`genre-row-${genre.key}`} className="w-full">
      <div className="flex items-center justify-between mb-3 px-4 sm:px-8 lg:px-12">
        <div className="flex items-center gap-2.5">
          <div className={`p-1.5 rounded-lg ${genre.badgeBg} ${genre.color} border ${genre.border}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-['Outfit',sans-serif] text-foreground">
              {genre.title}
            </h2>
            <p className="text-xs text-muted line-clamp-1">{genre.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Carousel Scroll Buttons */}
          <div className="hidden sm:flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => scroll('left')}
              className="p-2 rounded-xl border border-border bg-card text-foreground hover:bg-muted/20 transition-all active:scale-95 shadow-sm"
              aria-label={`Scroll ${genre.name} Left`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              className="p-2 rounded-xl border border-border bg-card text-foreground hover:bg-muted/20 transition-all active:scale-95 shadow-sm"
              aria-label={`Scroll ${genre.name} Right`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => navigate(`/search?genre=${encodeURIComponent(genre.name)}`)}
            className={`text-xs font-semibold ${genre.color} hover:opacity-80 flex items-center gap-1 transition-opacity ml-2 shrink-0`}
          >
            Explore All →
          </button>
        </div>
      </div>

      {loading ? (
        <div className="px-4 sm:px-8 lg:px-12">
          <MediaSliderSkeleton />
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="mx-4 sm:mx-8 lg:mx-12 p-8 text-center text-muted bg-card border border-border rounded-2xl text-xs">
          No {genre.name} titles matching active country filters.
        </div>
      ) : (
        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-none py-4 px-4 sm:px-8 lg:px-12 snap-x"
        >
          {filteredItems.map((item) => (
            <div
              key={`${genre.key}-${item.id}`}
              className="shrink-0 w-[160px] sm:w-[185px] md:w-[205px] snap-start"
            >
              <MediaCard item={item} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export const HomePage: React.FC = () => {
  const { accentConfig } = useTheme();
  const [trending, setTrending] = useState<MediaItem[]>([]);
  const [genreData, setGenreData] = useState<Record<string, MediaItem[]>>({});
  const [selectedGenre, setSelectedGenre] = useState<string>('All Genres');
  const [loadingTrending, setLoadingTrending] = useState<boolean>(true);
  const [loadingGenres, setLoadingGenres] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();
  const trendingScrollRef = useRef<HTMLDivElement>(null);
  const { filterMediaList } = useCountryFilter();

  // Load Trending titles
  useEffect(() => {
    let isMounted = true;
    async function loadTrending() {
      setLoadingTrending(true);
      try {
        const trend = await fetchTrendingTitles('all', 'week');
        if (isMounted) {
          setTrending(trend || []);
        }
      } catch (err) {
        console.error('Trending fetch error:', err);
      } finally {
        if (isMounted) setLoadingTrending(false);
      }
    }
    loadTrending();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch movies for all genres progressively
  useEffect(() => {
    let isMounted = true;

    async function loadAllGenres() {
      // First batch: load top 6 genres immediately
      const initialGenres = FEATUREET_INITIAL_GENRES;
      initialGenres.forEach((g) => {
        setLoadingGenres((prev) => ({ ...prev, [g.name]: true }));
      });

      await Promise.all(
        initialGenres.map(async (genre) => {
          try {
            const movies = await fetchDiscoverMedia('movie', genre.name, 'popularity.desc', undefined, undefined, undefined, 1);
            if (isMounted) {
              setGenreData((prev) => ({ ...prev, [genre.name]: movies || [] }));
            }
          } catch (err) {
            console.error(`Error loading genre ${genre.name}:`, err);
          } finally {
            if (isMounted) {
              setLoadingGenres((prev) => ({ ...prev, [genre.name]: false }));
            }
          }
        })
      );

      // Second batch: load remaining genres
      const remainingGenres = FEATURED_GENRES.filter(
        (g) => !initialGenres.some((ig) => ig.name === g.name)
      );

      remainingGenres.forEach((g) => {
        setLoadingGenres((prev) => ({ ...prev, [g.name]: true }));
      });

      await Promise.all(
        remainingGenres.map(async (genre) => {
          try {
            const movies = await fetchDiscoverMedia('movie', genre.name, 'popularity.desc', undefined, undefined, undefined, 1);
            if (isMounted) {
              setGenreData((prev) => ({ ...prev, [genre.name]: movies || [] }));
            }
          } catch (err) {
            console.error(`Error loading genre ${genre.name}:`, err);
          } finally {
            if (isMounted) {
              setLoadingGenres((prev) => ({ ...prev, [genre.name]: false }));
            }
          }
        })
      );
    }

    loadAllGenres();

    return () => {
      isMounted = false;
    };
  }, []);

  // If user selects a specific genre that isn't in default list or wants extra items
  const handleSelectGenre = useCallback(async (genre: string) => {
    setSelectedGenre(genre);

    if (genre === 'All Genres') return;

    // Check if we need to load or scroll
    const existing = FEATURED_GENRES.find((g) => g.name.toLowerCase() === genre.toLowerCase());
    if (existing) {
      // Scroll to that row smoothly
      const el = document.getElementById(`genre-row-${existing.key}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      // Load this custom genre if not in featured list
      if (!genreData[genre]) {
        setLoadingGenres((prev) => ({ ...prev, [genre]: true }));
        try {
          const movies = await fetchDiscoverMedia('movie', genre, 'popularity.desc', undefined, undefined, undefined, 1);
          setGenreData((prev) => ({ ...prev, [genre]: movies || [] }));
        } finally {
          setLoadingGenres((prev) => ({ ...prev, [genre]: false }));
        }
      }
    }
  }, [genreData]);

  const scrollTrending = (direction: 'left' | 'right') => {
    if (trendingScrollRef.current) {
      const scrollAmount = direction === 'left' ? -480 : 480;
      trendingScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const filteredTrending = filterMediaList(trending);
  const featuredItem = filteredTrending[0];

  // List of genres to display
  // If a specific genre is selected, put that genre at the top of the genre list!
  const displayedGenres = selectedGenre === 'All Genres'
    ? FEATURED_GENRES
    : [
        ...(FEATURED_GENRES.filter((g) => g.name.toLowerCase() === selectedGenre.toLowerCase())),
        ...(FEATURED_GENRES.filter((g) => g.name.toLowerCase() !== selectedGenre.toLowerCase())),
      ];

  return (
    <div className="w-full pb-20">
      {/* Editorial Hero Banner or Skeleton */}
      {loadingTrending && !featuredItem ? (
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
            {ALL_GENRES.map((genre) => {
              const isSelected = selectedGenre === genre;
              return (
                <button
                  key={genre}
                  onClick={() => handleSelectGenre(genre)}
                  className={`whitespace-nowrap px-4 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? `bg-gradient-to-r ${accentConfig.gradient} text-white shadow-md shadow-accent/20`
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
              <div className="p-1.5 rounded-lg bg-accent/20 text-accent border border-accent/30">
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
                  className="p-2 rounded-xl border border-border bg-card text-foreground hover:bg-muted/20 transition-all active:scale-95 shadow-sm cursor-pointer"
                  aria-label="Scroll Left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollTrending('right')}
                  className="p-2 rounded-xl border border-border bg-card text-foreground hover:bg-muted/20 transition-all active:scale-95 shadow-sm cursor-pointer"
                  aria-label="Scroll Right"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => navigate('/search')}
                className="text-xs font-semibold text-accent hover:text-accent-hover flex items-center gap-1 transition-colors ml-2 cursor-pointer"
              >
                Explore All →
              </button>
            </div>
          </div>

          {loadingTrending ? (
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
              className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-none py-4 px-8 sm:px-12 lg:px-16"
            >
              {filteredTrending.slice(0, 15).map((item, index) => {
                const rank = index + 1;
                return (
                  <div
                    key={`trending-${item.id}-${rank}`}
                    className="relative shrink-0 w-[170px] sm:w-[195px] md:w-[215px] snap-start group pt-1 pl-4 sm:pl-5 card-gpu"
                  >
                    {/* Clean High-Contrast Rank Numeral */}
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

        {/* Section 2+: 1 Row For Each Genre (Multiple genres, each with a full horizontal row of movies) */}
        {displayedGenres.map((genre) => (
          <SingleGenreRow
            key={genre.key}
            genre={genre}
            items={genreData[genre.name] || []}
            loading={loadingGenres[genre.name] ?? true}
            filterMediaList={filterMediaList}
          />
        ))}
      </div>
    </div>
  );
};

const FEATUREET_INITIAL_GENRES = FEATURED_GENRES.slice(0, 6);
