import React from 'react';
import { X, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTrailer } from '../context/TrailerContext';

export const TrailerModal: React.FC = () => {
  const { activeTrailer, closeTrailer } = useTrailer();

  if (!activeTrailer || !activeTrailer.youtubeId) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeTrailer}
          className="fixed inset-0 bg-black/90 backdrop-blur-xl"
        />

        {/* Video Player Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative z-10 w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-[#0e121f] shadow-2xl"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5 bg-black/40 backdrop-blur-md text-white">
            <div className="flex items-center gap-2">
              <Play className="h-4 w-4 text-orange-400 fill-orange-400" />
              <h3 className="font-['Outfit',sans-serif] text-sm font-bold truncate max-w-md">
                Official Trailer — {activeTrailer.title}
              </h3>
            </div>
            <button
              onClick={closeTrailer}
              id="trailer-modal-close-btn"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-orange-500 transition-colors"
              aria-label="Close trailer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* YouTube Video iframe Container */}
          <div className="relative aspect-video w-full bg-black">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${activeTrailer.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
              title={`${activeTrailer.title} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full border-0"
            />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
