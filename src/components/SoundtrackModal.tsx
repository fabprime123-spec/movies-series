import React from 'react';
import { useSoundtrack } from '../context/SoundtrackContext';
import { 
  X, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Music2, 
  Disc, 
  Volume2, 
  VolumeX, 
  ExternalLink,
  ListMusic,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const SoundtrackModal: React.FC = () => {
  const {
    currentAlbum,
    currentTrack,
    currentTrackIndex,
    isPlaying,
    isModalOpen,
    volume,
    togglePlay,
    playTrack,
    nextTrack,
    prevTrack,
    setVolume,
    closeModal,
  } = useSoundtrack();

  if (!isModalOpen || !currentAlbum || !currentTrack) {
    return null;
  }

  const activeVideoKey = currentTrack.youtubeId || 'dQw4w9WgXcQ';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl">
        
        {/* Dynamic Ambient Glow matching Soundtrack Mood */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
          <div className="w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-orange-600/25 via-amber-500/20 to-transparent blur-[140px] animate-pulse" />
        </div>

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-4xl max-h-[92vh] rounded-3xl bg-[#0c0e15] border border-white/10 shadow-2xl overflow-hidden flex flex-col z-10 text-white"
        >
          
          {/* Header */}
          <div className="flex items-center justify-between px-5 sm:px-8 py-4 border-b border-white/10 bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
                <Music2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-white line-clamp-1">
                  {currentAlbum.albumTitle}
                </h3>
                <p className="text-xs text-white/50 flex items-center gap-2">
                  <span>Score by {currentAlbum.composer}</span>
                  <span>•</span>
                  <span>{currentAlbum.tracksCount} Movements</span>
                  <span>•</span>
                  <span>{currentAlbum.totalDuration} Total</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(currentAlbum.playlistYoutubeQuery)}`}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white/80 transition-colors border border-white/10"
              >
                <ExternalLink className="w-3.5 h-3.5 text-orange-400" />
                <span>Search on YouTube</span>
              </a>
              <button
                type="button"
                onClick={closeModal}
                className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto scrollbar-none p-5 sm:p-8 space-y-6">
            
            {/* Player Stage with Audio Visualizer Simulation */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-white/10 p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 shadow-inner">
              
              {/* Spinning Vinyl Visualizer */}
              <div className="relative shrink-0 flex items-center justify-center">
                <div className={`w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-tr from-slate-900 via-neutral-900 to-slate-800 p-2 border-4 border-white/15 shadow-2xl flex items-center justify-center relative ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }}>
                  {/* Vinyl Grooves */}
                  <div className="w-full h-full rounded-full border border-white/10 flex items-center justify-center">
                    <div className="w-3/4 h-3/4 rounded-full border border-white/10 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-md">
                        <Disc className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Track Details & Controls */}
              <div className="flex-1 text-center md:text-left space-y-4">
                <div>
                  <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20">
                    Track #{currentTrack.trackNumber}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mt-1.5 line-clamp-1">
                    {currentTrack.title}
                  </h2>
                  <p className="text-sm text-white/60">
                    Composed by {currentTrack.composer}
                  </p>
                </div>

                {/* Simulated Audio Waveform Bar */}
                <div className="flex items-center justify-center md:justify-start gap-1 h-8 px-2">
                  {Array.from({ length: 28 }).map((_, idx) => (
                    <span
                      key={idx}
                      className={`w-1 rounded-full bg-orange-400/70 transition-all ${
                        isPlaying ? 'animate-pulse' : 'h-2 opacity-30'
                      }`}
                      style={{
                        height: isPlaying ? `${Math.max(6, Math.sin(idx + Date.now() * 0.001) * 26 + 12)}px` : '4px',
                        animationDelay: `${(idx % 6) * 120}ms`,
                      }}
                    />
                  ))}
                </div>

                {/* Interactive Play Controls */}
                <div className="flex items-center justify-center md:justify-start gap-3 pt-1">
                  <button
                    type="button"
                    onClick={prevTrack}
                    className="p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/15 text-white transition-all active:scale-95"
                    title="Previous Track"
                  >
                    <SkipBack className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={togglePlay}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm shadow-xl shadow-orange-500/25 flex items-center gap-2 transition-all active:scale-95"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-5 h-5 fill-white" />
                        <span>Pause Track</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5 fill-white ml-0.5" />
                        <span>Play Track</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={nextTrack}
                    className="p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/15 text-white transition-all active:scale-95"
                    title="Next Track"
                  >
                    <SkipForward className="w-5 h-5" />
                  </button>
                </div>
              </div>

            </div>

            {/* Embedded Playback Screen (if video active) */}
            <div className="rounded-2xl overflow-hidden border border-white/10 bg-black aspect-video max-h-[260px] w-full">
              <iframe
                src={`https://www.youtube.com/embed/${activeVideoKey}?autoplay=${isPlaying ? 1 : 0}&enablejsapi=1`}
                title={currentTrack.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>

            {/* Tracklist Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <ListMusic className="w-4 h-4 text-orange-400" />
                  <span>Album Tracklist ({currentAlbum.tracks.length} Tracks)</span>
                </div>
                <span className="text-xs text-white/50">{currentAlbum.label}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {currentAlbum.tracks.map((track, idx) => {
                  const isActive = idx === currentTrackIndex;
                  return (
                    <button
                      key={track.id}
                      type="button"
                      onClick={() => playTrack(currentAlbum, idx)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all group ${
                        isActive
                          ? 'bg-orange-500/15 border-orange-500/40 text-orange-400 shadow-sm'
                          : 'bg-white/[0.02] border-white/10 text-white/80 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={`w-6 text-xs font-mono font-bold ${isActive ? 'text-orange-400' : 'text-white/40'}`}>
                          {String(track.trackNumber).padStart(2, '0')}
                        </span>
                        <div className="min-w-0">
                          <p className={`text-xs sm:text-sm font-medium truncate group-hover:text-orange-400 transition-colors ${isActive ? 'font-bold text-orange-400' : ''}`}>
                            {track.title}
                          </p>
                          <p className="text-[11px] text-white/40 truncate">
                            {track.composer}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        <span className="text-xs font-mono text-white/50">{track.duration}</span>
                        <div className={`p-1.5 rounded-lg ${isActive ? 'bg-orange-500 text-white' : 'bg-white/5 text-white/60 group-hover:bg-orange-500 group-hover:text-white'} transition-colors`}>
                          {isActive && isPlaying ? (
                            <Pause className="w-3.5 h-3.5 fill-current" />
                          ) : (
                            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
