import React from 'react';
import { useSoundtrack } from '../context/SoundtrackContext';
import { Play, Pause, SkipForward, SkipBack, Maximize2, X, Music2, Disc } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const FloatingSoundtrackBar: React.FC = () => {
  const {
    currentAlbum,
    currentTrack,
    isPlaying,
    isBarVisible,
    isModalOpen,
    togglePlay,
    nextTrack,
    prevTrack,
    openModal,
    closeBar,
  } = useSoundtrack();

  if (!isBarVisible || !currentTrack || isModalOpen) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40"
      >
        <div className="flex items-center justify-between gap-3 p-3 sm:p-3.5 rounded-2xl bg-[#0e1017]/90 text-white backdrop-blur-2xl border border-orange-500/30 shadow-2xl shadow-black/80">
          
          {/* Album Vinyl Art & Soundwave Indicator */}
          <div className="flex items-center gap-3 min-w-0 cursor-pointer" onClick={openModal}>
            <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/20 overflow-hidden group">
              <Disc className={`w-6 h-6 text-white ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">OST Player</span>
                {isPlaying && (
                  <div className="flex items-end gap-0.5 h-2.5">
                    <span className="w-0.5 bg-orange-400 rounded-full animate-pulse h-full" />
                    <span className="w-0.5 bg-orange-400 rounded-full animate-pulse h-2 delay-75" />
                    <span className="w-0.5 bg-orange-400 rounded-full animate-pulse h-3 delay-150" />
                  </div>
                )}
              </div>
              <p className="text-xs sm:text-sm font-semibold text-white truncate hover:text-orange-400 transition-colors">
                {currentTrack.title}
              </p>
              <p className="text-[11px] text-white/50 truncate">
                {currentAlbum?.composer || 'Original Score'}
              </p>
            </div>
          </div>

          {/* Audio Controls */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={prevTrack}
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              title="Previous Track"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={togglePlay}
              className="p-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/30 transition-all active:scale-95"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
            </button>

            <button
              type="button"
              onClick={nextTrack}
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              title="Next Track"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={openModal}
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors ml-1"
              title="Expand Soundtrack Theater"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={closeBar}
              className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              title="Close Soundtrack Player"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
};
