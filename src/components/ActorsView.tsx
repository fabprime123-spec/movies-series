import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ActorItem, MediaItem } from '../types';
import { fetchPopularActors, searchActors, fetchActorDetails } from '../services/tmdb';
import { ActorCardSkeleton } from './Skeletons';
import { Users, Star, Film, Sparkles, Search, Award, MapPin, Calendar, Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ActorsViewProps {
  onSelectMedia: (item: MediaItem) => void;
}

export const ActorsView: React.FC<ActorsViewProps> = ({ onSelectMedia }) => {
  const { id: urlActorId } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  const [actors, setActors] = useState<ActorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedActor, setSelectedActor] = useState<ActorItem | null>(null);
  const [actorDetails, setActorDetails] = useState<{ biography?: string; birthday?: string; placeOfBirth?: string } | null>(null);
  const [actorFilmography, setActorFilmography] = useState<MediaItem[]>([]);
  const [loadingFilmography, setLoadingFilmography] = useState(false);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  // Load popular actors or perform real-time server-side actor search
  useEffect(() => {
    let isMounted = true;

    async function load() {
      setLoading(true);
      try {
        if (searchQuery.trim()) {
          const res = await searchActors(searchQuery.trim());
          if (isMounted) {
            setActors(res.actors || []);
          }
        } else {
          const data = await fetchPopularActors(1);
          if (isMounted) {
            setActors(data);
            setPage(1);
          }
        }
      } catch (err) {
        console.error('Error fetching actors:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    const timer = setTimeout(load, searchQuery.trim() ? 250 : 0);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [searchQuery]);

  // Load actor from URL parameter if provided (e.g. /actors/3223)
  useEffect(() => {
    if (!urlActorId) return;

    let isMounted = true;
    async function loadActorFromUrl() {
      setLoadingFilmography(true);
      try {
        const actor = await fetchActorDetails(urlActorId!);
        if (isMounted && actor) {
          setSelectedActor(actor);
          setActorFilmography(actor.filmography || []);
          setActorDetails({
            biography: actor.biography,
            birthday: actor.birthday,
            placeOfBirth: actor.placeOfBirth
          });
        }
      } catch (err) {
        console.error('Error loading actor from URL:', err);
      } finally {
        if (isMounted) setLoadingFilmography(false);
      }
    }

    loadActorFromUrl();
    return () => {
      isMounted = false;
    };
  }, [urlActorId]);

  const handleActorClick = async (actor: ActorItem) => {
    setSelectedActor(actor);
    setLoadingFilmography(true);
    setActorFilmography([]);
    setActorDetails(null);

    try {
      const fullActor = await fetchActorDetails(actor.id);
      if (fullActor) {
        setSelectedActor(fullActor);
        setActorFilmography(fullActor.filmography || []);
        setActorDetails({
          biography: fullActor.biography,
          birthday: fullActor.birthday,
          placeOfBirth: fullActor.placeOfBirth
        });
      }
    } catch (err) {
      console.error('Error fetching actor details:', err);
    } finally {
      setLoadingFilmography(false);
    }
  };

  const loadMoreActors = async () => {
    if (loadingMore || searchQuery.trim()) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const data = await fetchPopularActors(nextPage);
      setActors((prev) => {
        const existing = new Set(prev.map((a) => a.id));
        const fresh = data.filter((a) => !existing.has(a.id));
        return [...prev, ...fresh];
      });
      setPage(nextPage);
    } catch (err) {
      console.error('Error loading more actors:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  const closeModal = () => {
    setSelectedActor(null);
    setActorDetails(null);
    setActorFilmography([]);
    if (urlActorId) {
      navigate('/actors', { replace: true });
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-widest mb-1.5">
            <Users className="w-4 h-4" />
            <span>Creative Talent & Legends</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-white flex items-center gap-3">
            Leading Actors & Visionaries
          </h1>
          <p className="text-sm text-white/50 mt-1 max-w-xl">
            Explore world-renowned cinema legends, breakout performers, and their acclaimed filmographies.
          </p>
        </div>

        {/* Live Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-orange-400" />
          <input
            type="text"
            placeholder="Search by actor name (e.g. Robert, Cillian)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-[#141622]/80 pl-10 pr-10 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all shadow-lg"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Search results banner if searching */}
      {searchQuery.trim() && (
        <div className="flex items-center justify-between text-xs text-white/60">
          <span>Found <strong className="text-white font-bold">{actors.length}</strong> performers matching "{searchQuery}"</span>
          <button
            onClick={() => setSearchQuery('')}
            className="text-orange-400 hover:text-orange-300 transition-colors"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Actors Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(12)].map((_, i) => (
            <ActorCardSkeleton key={i} />
          ))}
        </div>
      ) : actors.length === 0 ? (
        <div className="p-12 text-center text-white/50 bg-[#141622]/60 border border-white/10 rounded-2xl space-y-3">
          <Users className="w-10 h-10 text-white/20 mx-auto" />
          <p className="text-sm font-semibold text-white">No talent found matching "{searchQuery}"</p>
          <p className="text-xs text-white/40">Try searching with full names like "Robert Downey Jr.", "Robert De Niro", or "Robert Pattinson".</p>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {actors.map((actor) => (
              <div
                key={actor.id}
                onClick={() => handleActorClick(actor)}
                className="group cursor-pointer rounded-2xl overflow-hidden border border-white/10 bg-[#141622]/70 hover:border-orange-500/50 hover:bg-[#181a2b] transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10 flex flex-col"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-black/40">
                  <img
                    src={actor.profileUrl}
                    alt={actor.name}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <span className="rounded-md bg-orange-500/80 backdrop-blur-sm px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                      {actor.knownForDepartment || 'Acting'}
                    </span>
                  </div>
                </div>

                <div className="p-3 flex-1 flex flex-col justify-between">
                  <h3 className="font-bold text-xs sm:text-sm text-white group-hover:text-orange-400 transition-colors line-clamp-1">
                    {actor.name}
                  </h3>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {actor.knownFor.slice(0, 2).map((title, i) => (
                      <span
                        key={i}
                        className="text-[10px] text-white/50 truncate max-w-full"
                      >
                        {title}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button for popular actors */}
          {!searchQuery.trim() && (
            <div className="flex justify-center pt-4">
              <button
                onClick={loadMoreActors}
                disabled={loadingMore}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 text-xs font-semibold transition-all hover:border-orange-500/40 disabled:opacity-50"
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-orange-400" />
                    <span>Loading more performers...</span>
                  </>
                ) : (
                  <span>Load More Actors (Page {page + 1})</span>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Actor Filmography Drawer / Modal */}
      <AnimatePresence>
        {selectedActor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 w-full max-w-3xl rounded-3xl border border-white/10 bg-[#0e121f] p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <img
                  src={selectedActor.profileUrl}
                  alt={selectedActor.name}
                  referrerPolicy="no-referrer"
                  className="h-28 w-28 sm:h-36 sm:w-36 rounded-2xl object-cover shadow-xl border border-white/20"
                />
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-lg bg-orange-500/20 border border-orange-400/30 px-2.5 py-0.5 text-xs font-bold text-orange-400">
                      {selectedActor.knownForDepartment || 'Acting'}
                    </span>
                    {selectedActor.popularity != null && selectedActor.popularity > 0 && (
                      <span className="text-xs text-white/40">
                        TMDB Popularity: {selectedActor.popularity.toFixed(1)}
                      </span>
                    )}
                  </div>
                  <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-white">
                    {selectedActor.name}
                  </h2>
                  {actorDetails?.placeOfBirth && (
                    <p className="text-xs text-white/60 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-orange-400" />
                      <span>{actorDetails.placeOfBirth}</span>
                    </p>
                  )}
                  {actorDetails?.birthday && (
                    <p className="text-xs text-white/50 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      <span>Born: {actorDetails.birthday}</span>
                    </p>
                  )}
                  {selectedActor.knownFor.length > 0 && (
                    <p className="text-xs text-white/60">
                      Notable Works: {selectedActor.knownFor.join(' • ')}
                    </p>
                  )}
                </div>
              </div>

              {/* Biography if available */}
              {actorDetails?.biography && (
                <div className="space-y-1.5 p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-white/70 leading-relaxed max-h-36 overflow-y-auto">
                  <h4 className="font-bold text-white text-[11px] uppercase tracking-wider text-orange-400">Biography</h4>
                  <p>{actorDetails.biography}</p>
                </div>
              )}

              {/* Filmography titles */}
              <div className="space-y-3 pt-2 border-t border-white/10">
                <h3 className="font-['Outfit',sans-serif] text-sm font-bold text-white flex items-center gap-2">
                  <Film className="h-4 w-4 text-orange-500" />
                  <span>Featured Filmography & Releases ({actorFilmography.length})</span>
                </h3>

                {loadingFilmography ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="aspect-[2/3] rounded-xl bg-white/5 animate-pulse" />
                    ))}
                  </div>
                ) : actorFilmography.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-80 overflow-y-auto p-1">
                    {actorFilmography.map((film) => (
                      <div
                        key={film.id}
                        onClick={() => {
                          closeModal();
                          onSelectMedia(film);
                        }}
                        className="group cursor-pointer rounded-xl overflow-hidden border border-white/10 bg-white/5 p-2 hover:border-orange-500/50 transition-all hover:bg-white/10"
                      >
                        <img
                          src={film.posterUrl}
                          alt={film.title}
                          className="aspect-[2/3] w-full rounded-lg object-cover group-hover:scale-103 transition-transform"
                        />
                        <h4 className="mt-2 text-xs font-bold text-white truncate group-hover:text-orange-400">
                          {film.title}
                        </h4>
                        <p className="text-[10px] text-white/50">{film.releaseYear} • ⭐ {(film.ratings?.imdb ?? 0).toFixed(1)}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-white/40">No filmography entries found in the archive.</p>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={closeModal}
                  className="rounded-full bg-white/10 hover:bg-white/20 px-5 py-2 text-xs font-bold text-white transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
