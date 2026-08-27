import React, { useState, useEffect } from 'react';
import { ActorItem, MediaItem } from '../types';
import { fetchPopularActors, searchTmdbMedia } from '../services/tmdb';
import { Users, Star, Film, Sparkles, Search, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ActorsViewProps {
  onSelectMedia: (item: MediaItem) => void;
}

export const ActorsView: React.FC<ActorsViewProps> = ({ onSelectMedia }) => {
  const [actors, setActors] = useState<ActorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedActor, setSelectedActor] = useState<ActorItem | null>(null);
  const [actorFilmography, setActorFilmography] = useState<MediaItem[]>([]);
  const [loadingFilmography, setLoadingFilmography] = useState(false);

  useEffect(() => {
    async function loadActors() {
      setLoading(true);
      const data = await fetchPopularActors(1);
      setActors(data);
      setLoading(false);
    }
    loadActors();
  }, []);

  const handleActorClick = async (actor: ActorItem) => {
    setSelectedActor(actor);
    setLoadingFilmography(true);
    // Fetch films known for this actor
    const allFilms: MediaItem[] = [];
    for (const title of actor.knownFor.slice(0, 4)) {
      if (title) {
        const results = await searchTmdbMedia(title);
        if (results.length > 0 && !allFilms.some((f) => f.id === results[0].id)) {
          allFilms.push(results[0]);
        }
      }
    }
    setActorFilmography(allFilms);
    setLoadingFilmography(false);
  };

  const filteredActors = actors.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.knownFor.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-white flex items-center gap-3">
            <Users className="h-8 w-8 text-orange-500" />
            Leading Actors & Visionaries
          </h1>
          <p className="text-sm text-white/50 mt-1 max-w-xl">
            Explore world-renowned cinema legends, breakout performers, and their acclaimed filmographies.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            type="text"
            placeholder="Search actors & performers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-white/10 bg-white/5 pl-10 pr-4 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>
      </div>

      {/* Actors Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="aspect-[3/4] rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredActors.map((actor) => (
            <div
              key={actor.id}
              onClick={() => handleActorClick(actor)}
              className="group cursor-pointer rounded-2xl overflow-hidden border border-white/10 bg-white/5 hover:border-orange-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10 flex flex-col"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-slate-900">
                <img
                  src={actor.profileUrl}
                  alt={actor.name}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                <div className="absolute bottom-2 left-2 right-2">
                  <span className="rounded-md bg-orange-500/80 backdrop-blur-sm px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                    {actor.knownForDepartment}
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
      )}

      {/* Actor Filmography Drawer / Modal */}
      <AnimatePresence>
        {selectedActor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedActor(null)}
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
                  <div className="flex items-center gap-2">
                    <span className="rounded-lg bg-orange-500/20 border border-orange-400/30 px-2.5 py-0.5 text-xs font-bold text-orange-400">
                      {selectedActor.knownForDepartment}
                    </span>
                    <span className="text-xs text-white/40">
                      TMDB Popularity: {selectedActor.popularity.toFixed(1)}
                    </span>
                  </div>
                  <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-white">
                    {selectedActor.name}
                  </h2>
                  <p className="text-xs text-white/60">
                    Notable Works: {selectedActor.knownFor.join(' • ')}
                  </p>
                </div>
              </div>

              {/* Filmography titles */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <h3 className="font-['Outfit',sans-serif] text-sm font-bold text-white flex items-center gap-2">
                  <Film className="h-4 w-4 text-orange-500" />
                  Featured Filmography & Releases
                </h3>

                {loadingFilmography ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="aspect-[2/3] rounded-xl bg-white/5 animate-pulse" />
                    ))}
                  </div>
                ) : actorFilmography.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {actorFilmography.map((film) => (
                      <div
                        key={film.id}
                        onClick={() => {
                          setSelectedActor(null);
                          onSelectMedia(film);
                        }}
                        className="group cursor-pointer rounded-xl overflow-hidden border border-white/10 bg-white/5 p-2 hover:border-orange-500/50 transition-all"
                      >
                        <img
                          src={film.posterUrl}
                          alt={film.title}
                          className="aspect-[2/3] w-full rounded-lg object-cover group-hover:scale-103 transition-transform"
                        />
                        <h4 className="mt-2 text-xs font-bold text-white truncate group-hover:text-orange-400">
                          {film.title}
                        </h4>
                        <p className="text-[10px] text-white/50">{film.releaseYear} • ⭐ {film.ratings.imdb.toFixed(1)}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-white/40">Searching for titles...</p>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedActor(null)}
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
