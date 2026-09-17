import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Clock,
  Radio,
  Play,
  Calendar,
  Sparkles,
  Flame,
  Bell,
  Check,
  Film,
  Tv,
  Image as ImageIcon,
  Share2,
  Filter,
  Search,
  ChevronRight,
  ShieldAlert,
  Layers,
  Star,
  Users,
  Compass
} from 'lucide-react';
import { UpcomingItem } from '../types';
import { fetchUpcomingReleases } from '../services/tmdb';
import { UpcomingHeroSkeleton, UpcomingGridSkeleton } from '../components/Skeletons';
import { useTrailer } from '../context/TrailerContext';
import { useTheme } from '../context/ThemeContext';
import { FilmGrainOverlay } from '../components/FilmGrainOverlay';
import { ImageGalleryModal } from '../components/ImageGalleryModal';

// Live countdown hook
function useLiveCountdown(targetTimestamp: number) {
  const [timeLeft, setTimeLeft] = useState(() => {
    const difference = targetTimestamp - Date.now();
    return calculateTime(difference);
  });

  function calculateTime(difference: number) {
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0, isLive: true };
    }
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    return { days, hours, minutes, seconds, totalMs: difference, isLive: false };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTime(targetTimestamp - Date.now()));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetTimestamp]);

  return timeLeft;
}

export const UpcomingView: React.FC = () => {
  const navigate = useNavigate();
  const { playTrailer } = useTrailer();
  const { accentConfig } = useTheme();

  const [releases, setReleases] = useState<UpcomingItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [featuredItem, setFeaturedItem] = useState<UpcomingItem | null>(null);

  // Filters & State
  const [selectedUniverse, setSelectedUniverse] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'movie' | 'tv' | 'anime'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [reminders, setReminders] = useState<Record<string, boolean>>({});
  const [hypeVotes, setHypeVotes] = useState<Record<string, number>>({});
  const [activeGalleryItem, setActiveGalleryItem] = useState<UpcomingItem | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setLoading(true);
        const data = await fetchUpcomingReleases();
        if (isMounted) {
          if (data && data.length > 0) {
            setReleases(data);
            setFeaturedItem(data[0]);
          }
        }
      } catch (err) {
        console.warn('Failed to load upcoming releases:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const countdown = useLiveCountdown(featuredItem?.targetTimestamp || Date.now() + 86400000);

  // Toggle Reminder
  const toggleReminder = (id: string, title: string) => {
    setReminders((prev) => {
      const newState = !prev[id];
      return { ...prev, [id]: newState };
    });
  };

  // Add Hype Vote
  const addHype = (id: string) => {
    setHypeVotes((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  // Filtered releases
  const filteredList = useMemo(() => {
    return releases.filter((item) => {
      const matchUniverse = selectedUniverse === 'all' || item.universe === selectedUniverse;
      const matchType = selectedType === 'all' || item.type === selectedType;
      const matchQuery =
        !searchQuery.trim() ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.director?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.genres.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchUniverse && matchType && matchQuery;
    });
  }, [releases, selectedUniverse, selectedType, searchQuery]);

  const universes = ['all', 'Marvel Cinematic Universe', 'DC Universe', 'Sci-Fi', 'Anime', 'Original'];

  if (loading) {
    return (
      <div className="min-h-screen pb-24 text-slate-100 selection:bg-orange-500 selection:text-white" id="upcoming-page-root">
        <UpcomingHeroSkeleton />
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <UpcomingGridSkeleton count={6} />
        </div>
      </div>
    );
  }

  if (!featuredItem || releases.length === 0) {
    return (
      <div className="min-h-screen pb-24 text-slate-100 selection:bg-orange-500 selection:text-white flex flex-col items-center justify-center p-8 text-center" id="upcoming-page-root">
        <div className="max-w-md space-y-4">
          <Clock className="w-16 h-16 text-orange-500 mx-auto animate-pulse" />
          <h2 className="text-2xl font-bold text-white">Upcoming Releases Loading</h2>
          <p className="text-sm text-slate-400">
            Fetching latest theatrical broadcast schedules and cinema release dates.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 rounded-xl bg-orange-500 text-white font-bold text-sm shadow-lg hover:bg-orange-600 transition-all"
          >
            Refresh Schedule
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 text-slate-100 selection:bg-orange-500 selection:text-white" id="upcoming-page-root">
      
      {/* ---------------- LIVE HERO COUNTDOWN BROADCAST ---------------- */}
      <section className="relative w-full overflow-hidden bg-slate-950 border-b border-white/10" id="live-countdown-hero">
        {/* Background Backdrop Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={featuredItem.backdropUrl}
            alt={featuredItem.title}
            className="w-full h-full object-cover object-center scale-105 opacity-35 filter blur-[1px]"
          />
          {/* Film Grain Texture */}
          <FilmGrainOverlay opacity={0.35} />

          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/50" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-slate-950/60 to-slate-950" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
          {/* Top Live Broadcast Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-600/90 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-red-600/30 animate-pulse">
                <Radio className="w-3.5 h-3.5" />
                <span>CINEMA PREMIERE COUNTDOWN</span>
              </div>
              <span className="text-xs text-white/70 font-mono hidden sm:inline">
                OFFICIAL THEATRICAL BROADCAST
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-white/70 font-mono">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                <span className="font-bold text-white">
                  {((featuredItem.hypeCount || 800000) + (hypeVotes[featuredItem.id] || 0)).toLocaleString()}
                </span>
                <span className="text-white/50">hyped</span>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                CONFIRMED PREMIERE
              </span>
            </div>
          </div>

          {/* Hero Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8">
            
            {/* Left Column: Title & Live Countdown Box */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Studio & Franchise Tag */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-md bg-red-600 text-white font-black text-[11px] uppercase tracking-wider shadow">
                  {featuredItem.studio || 'WORLD PREMIERE'}
                </span>
                <span className="px-3 py-1 rounded-md bg-white/10 border border-white/15 text-white/90 text-xs font-semibold">
                  {featuredItem.universe}
                </span>
                <span className="text-xs text-white/50 font-mono">
                  Target Date: <strong className="text-white">{featuredItem.releaseDate}</strong>
                </span>
              </div>

              {/* Title & Tagline */}
              <div>
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight uppercase font-sans drop-shadow-2xl">
                  {featuredItem.title}
                </h1>
                {featuredItem.tagline && (
                  <p className="text-base sm:text-lg text-orange-400/90 font-medium italic mt-2">
                    "{featuredItem.tagline}"
                  </p>
                )}
              </div>

              {/* LIVE DIGITAL COUNTDOWN CLOCK */}
              <div className="p-4 sm:p-6 rounded-3xl bg-slate-900/90 border border-orange-500/30 shadow-2xl backdrop-blur-2xl space-y-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex items-center justify-between text-xs uppercase tracking-widest text-white/60 font-mono">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-400 animate-spin" style={{ animationDuration: '8s' }} />
                    <span>TIME UNTIL GLOBAL PREMIERE</span>
                  </div>
                  <span className="text-orange-400 font-bold">{featuredItem.releaseDate}</span>
                </div>

                {/* Digital Clock Digits */}
                <div className="grid grid-cols-4 gap-2 sm:gap-4 pt-2 text-center">
                  
                  {/* DAYS */}
                  <div className="flex flex-col p-3 sm:p-4 rounded-2xl bg-black/60 border border-white/10 shadow-inner">
                    <span className="text-2xl sm:text-4xl md:text-5xl font-black text-white font-mono tracking-tight text-glow">
                      {String(countdown.days).padStart(3, '0')}
                    </span>
                    <span className="text-[10px] sm:text-xs uppercase tracking-widest text-orange-400 font-bold mt-1">
                      DAYS
                    </span>
                  </div>

                  {/* HOURS */}
                  <div className="flex flex-col p-3 sm:p-4 rounded-2xl bg-black/60 border border-white/10 shadow-inner">
                    <span className="text-2xl sm:text-4xl md:text-5xl font-black text-white font-mono tracking-tight">
                      {String(countdown.hours).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] sm:text-xs uppercase tracking-widest text-orange-400 font-bold mt-1">
                      HOURS
                    </span>
                  </div>

                  {/* MINUTES */}
                  <div className="flex flex-col p-3 sm:p-4 rounded-2xl bg-black/60 border border-white/10 shadow-inner">
                    <span className="text-2xl sm:text-4xl md:text-5xl font-black text-white font-mono tracking-tight">
                      {String(countdown.minutes).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] sm:text-xs uppercase tracking-widest text-orange-400 font-bold mt-1">
                      MINS
                    </span>
                  </div>

                  {/* SECONDS */}
                  <div className="flex flex-col p-3 sm:p-4 rounded-2xl bg-black/60 border border-orange-500/40 shadow-inner bg-gradient-to-b from-orange-500/10 to-transparent">
                    <span className="text-2xl sm:text-4xl md:text-5xl font-black text-orange-400 font-mono tracking-tight animate-pulse">
                      {String(countdown.seconds).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] sm:text-xs uppercase tracking-widest text-orange-300 font-bold mt-1">
                      SECS
                    </span>
                  </div>
                </div>

                <p className="text-xs text-white/50 text-center pt-1 font-mono">
                  Counting down in real-time to worldwide release
                </p>
              </div>

              {/* Overview & Cast Summary */}
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed max-w-3xl">
                {featuredItem.overview}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {featuredItem.trailerYoutubeId && (
                  <button
                    onClick={() => playTrailer(featuredItem.trailerYoutubeId!, featuredItem.title)}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold text-sm shadow-xl shadow-red-600/30 hover:scale-105 active:scale-95 transition-all"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Watch Teaser Trailer</span>
                  </button>
                )}

                <button
                  onClick={() => toggleReminder(featuredItem.id, featuredItem.title)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm border transition-all ${
                    reminders[featuredItem.id]
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-lg'
                      : 'bg-white/10 hover:bg-white/20 text-white border-white/15'
                  }`}
                >
                  {reminders[featuredItem.id] ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Reminder Set!</span>
                    </>
                  ) : (
                    <>
                      <Bell className="w-4 h-4" />
                      <span>Notify On Premiere</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => addHype(featuredItem.id)}
                  className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 font-semibold text-sm transition-all"
                >
                  <Flame className="w-4 h-4" />
                  <span>Hype +1</span>
                </button>

                <button
                  onClick={() => navigate(`/gallery/${featuredItem.type}/${featuredItem.id}`)}
                  className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 text-sm transition-all"
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>View Production Gallery</span>
                </button>
              </div>
            </div>

            {/* Right Column: Key Poster Card with Director & Cast */}
            <div className="lg:col-span-4 flex flex-col items-center">
              <div className="relative group w-full max-w-[280px] sm:max-w-[320px] rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl bg-slate-900">
                <img
                  src={featuredItem.posterUrl}
                  alt={featuredItem.title}
                  className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-4 space-y-2">
                  <span className="px-2.5 py-1 rounded-full bg-red-600 text-white text-[10px] font-black uppercase tracking-wider self-start shadow">
                    Premiere Release
                  </span>
                  <p className="text-xs text-white/80 font-mono">
                    Director: <strong className="text-white">{featuredItem.director}</strong>
                  </p>
                  {featuredItem.cast && (
                    <div className="text-[11px] text-white/70 line-clamp-2">
                      Starring: {featuredItem.cast.join(', ')}
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ---------------- UPCOMING RELEASES ROSTER & SEARCH ---------------- */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8">
        
        {/* Header & Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-orange-400" />
              <span>Upcoming Movies, Series & Episodes</span>
            </h2>
            <p className="text-xs sm:text-sm text-white/60 mt-1">
              Live theatrical countdowns, release dates, official trailers & concept art galleries
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search upcoming titles, cast..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/40 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>
        </div>

        {/* Universe / Studio Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {universes.map((uni) => (
            <button
              key={uni}
              onClick={() => setSelectedUniverse(uni)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                selectedUniverse === uni
                  ? `bg-gradient-to-r ${accentConfig.gradient} text-white shadow-md shadow-orange-500/20`
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              {uni === 'all' ? 'All Universes & Franchises' : uni}
            </button>
          ))}
        </div>

        {/* Media Type Toggle */}
        <div className="flex items-center gap-2">
          {[
            { id: 'all', label: 'All Formats' },
            { id: 'movie', label: 'Movies & Theatrical' },
            { id: 'tv', label: 'Series & Episodes' },
            { id: 'anime', label: 'Anime Releases' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedType(t.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedType === t.id
                  ? 'bg-white/20 text-white font-bold'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ---------------- UPCOMING CARDS GRID ---------------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredList.map((item) => {
            const isFeatured = featuredItem.id === item.id;
            const itemCountdown = useLiveCountdown(item.targetTimestamp);
            const isReminded = reminders[item.id];
            const currentHype = (item.hypeCount || 500000) + (hypeVotes[item.id] || 0);

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`relative flex flex-col justify-between overflow-hidden rounded-3xl border transition-all duration-300 ${
                  isFeatured
                    ? 'border-orange-500/60 bg-gradient-to-b from-orange-500/10 via-slate-900 to-slate-950 shadow-2xl shadow-orange-500/10 ring-1 ring-orange-500/40'
                    : 'border-white/10 bg-slate-900/70 hover:border-white/25 hover:shadow-xl'
                }`}
              >
                {/* Backdrop & Poster Header */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-black/80">
                  <img
                    src={item.backdropUrl || item.posterUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-lg bg-black/70 border border-white/10 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
                      {item.universe || item.type}
                    </span>
                    
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-600/90 text-white text-[10px] font-black uppercase tracking-wider shadow">
                      <Clock className="w-3 h-3" />
                      <span>{item.releaseDate}</span>
                    </span>
                  </div>

                  {/* Live Mini Countdown Ribbon */}
                  <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-2xl bg-black/85 border border-white/10 backdrop-blur-xl flex items-center justify-around text-center">
                    <div>
                      <span className="text-sm font-black text-white font-mono">{itemCountdown.days}</span>
                      <span className="block text-[8px] uppercase tracking-wider text-orange-400 font-bold">DAYS</span>
                    </div>
                    <span className="text-white/30">:</span>
                    <div>
                      <span className="text-sm font-black text-white font-mono">{itemCountdown.hours}</span>
                      <span className="block text-[8px] uppercase tracking-wider text-orange-400 font-bold">HRS</span>
                    </div>
                    <span className="text-white/30">:</span>
                    <div>
                      <span className="text-sm font-black text-white font-mono">{itemCountdown.minutes}</span>
                      <span className="block text-[8px] uppercase tracking-wider text-orange-400 font-bold">MINS</span>
                    </div>
                    <span className="text-white/30">:</span>
                    <div>
                      <span className="text-sm font-black text-orange-400 font-mono animate-pulse">{itemCountdown.seconds}</span>
                      <span className="block text-[8px] uppercase tracking-wider text-orange-300 font-bold">SECS</span>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg font-bold text-white tracking-tight line-clamp-1">
                        {item.title}
                      </h3>
                      <button
                        onClick={() => setFeaturedItem(item)}
                        className={`text-[10px] font-bold px-2 py-1 rounded-lg transition-all ${
                          isFeatured
                            ? 'bg-orange-500 text-white'
                            : 'bg-white/10 text-white/70 hover:text-white hover:bg-white/20'
                        }`}
                        title="Pin this title as the main hero live countdown"
                      >
                        {isFeatured ? 'LIVE PINNED' : 'PIN TO TOP'}
                      </button>
                    </div>

                    <p className="text-xs text-white/70 line-clamp-3 leading-relaxed">
                      {item.overview}
                    </p>

                    {/* Genres */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.genres.map((g) => (
                        <span key={g} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-white/60">
                          {g}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {item.trailerYoutubeId && (
                        <button
                          onClick={() => playTrailer(item.trailerYoutubeId!, item.title)}
                          className="p-2.5 rounded-xl bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-500/30 transition-all"
                          title="Play Teaser Trailer"
                        >
                          <Play className="w-4 h-4 fill-current" />
                        </button>
                      )}

                      <button
                        onClick={() => navigate(`/gallery/${item.type}/${item.id}`)}
                        className="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 text-white/80 border border-white/10 transition-all"
                        title="Open HD Production Gallery Page"
                      >
                        <ImageIcon className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => addHype(item.id)}
                        className="flex items-center gap-1 px-3 py-2 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-semibold transition-all"
                        title="Cast hype vote"
                      >
                        <Flame className="w-3.5 h-3.5" />
                        <span>{currentHype.toLocaleString()}</span>
                      </button>
                    </div>

                    <button
                      onClick={() => toggleReminder(item.id, item.title)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        isReminded
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                          : 'bg-white/10 hover:bg-white/20 text-white border-white/15'
                      }`}
                    >
                      {isReminded ? <Check className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
                      <span>{isReminded ? 'Reminded' : 'Remind Me'}</span>
                    </button>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>

      </div>

      {/* Lightbox for Gallery in Upcoming */}
      {activeGalleryItem && activeGalleryItem.images && (
        <ImageGalleryModal
          isOpen={activeGalleryItem !== null}
          onClose={() => setActiveGalleryItem(null)}
          images={[
            ...activeGalleryItem.images.backdrops,
            ...activeGalleryItem.images.posters,
          ]}
          title={activeGalleryItem.title}
        />
      )}
    </div>
  );
};

export const UpcomingPage = UpcomingView;
