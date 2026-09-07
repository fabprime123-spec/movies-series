import React, { useState, useEffect } from 'react';
import { X, Play, Film, Sparkles, CheckCircle2, Clock, Tv, ExternalLink } from 'lucide-react';
import { MediaItem, MediaVideo } from '../types';

interface AllTrailersModalProps {
  isOpen: boolean;
  onClose: () => void;
  media: MediaItem;
  initialVideoKey?: string;
}

export const AllTrailersModal: React.FC<AllTrailersModalProps> = ({
  isOpen,
  onClose,
  media,
  initialVideoKey,
}) => {
  const allVideos: MediaVideo[] = React.useMemo(() => {
    if (media.videos && media.videos.length > 0) {
      return media.videos;
    }
    if (media.trailerYoutubeId) {
      return [
        {
          id: 'primary-trailer',
          key: media.trailerYoutubeId,
          name: media.trailerTitle || `${media.title} - Official Main Trailer`,
          site: 'YouTube',
          type: 'Trailer',
          official: true,
        },
      ];
    }
    return [];
  }, [media]);

  // Default to first official trailer or initial key
  const [activeVideo, setActiveVideo] = useState<MediaVideo | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    if (initialVideoKey) {
      const match = allVideos.find((v) => v.key === initialVideoKey);
      if (match) {
        setActiveVideo(match);
        return;
      }
    }

    if (allVideos.length > 0) {
      // Find first official trailer, else first trailer, else first video
      const firstOfficial =
        allVideos.find((v) => v.official && v.type.toLowerCase().includes('trailer')) ||
        allVideos.find((v) => v.type.toLowerCase().includes('trailer')) ||
        allVideos[0];
      setActiveVideo(firstOfficial);
    }
  }, [isOpen, initialVideoKey, allVideos]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !activeVideo) return null;

  const getVideoTypeBadgeColor = (type: string, official: boolean) => {
    const t = type.toLowerCase();
    if (t.includes('trailer')) {
      return official
        ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
        : 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    }
    if (t.includes('teaser')) {
      return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    }
    if (t.includes('clip')) {
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
    if (t.includes('behind') || t.includes('featurette')) {
      return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    }
    return 'bg-white/10 text-white/70 border-white/10';
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 md:p-8">
      {/* Dark overlay backdrop */}
      <div
        className="fixed inset-0 bg-black/90 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-6xl max-h-[92vh] flex flex-col rounded-2xl sm:rounded-3xl border border-white/15 bg-[#0f111a] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 flex-shrink-0">
              <Film className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white truncate">
                  {media.title}
                </h2>
                <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-white/10 text-white/70">
                  {allVideos.length} {allVideos.length === 1 ? 'Video' : 'Videos'}
                </span>
              </div>
              <p className="text-xs text-white/50 truncate">
                Official Trailers, Teasers, Featurettes & Behind the Scenes
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-colors border border-white/10"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Main Content: Left/Top Player + Right/Bottom Video Playlist */}
        <div className="flex-1 overflow-y-auto lg:overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Main Active Video Player Area */}
          <div className="lg:col-span-8 flex flex-col bg-black/60 p-4 sm:p-6 lg:border-r border-white/10">
            {/* Embedded YouTube Player */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeVideo.key}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                title={activeVideo.name}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Currently Playing Video Metadata */}
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`px-2.5 py-0.5 rounded-md text-[10px] sm:text-xs font-bold border uppercase tracking-wider ${getVideoTypeBadgeColor(
                      activeVideo.type,
                      activeVideo.official
                    )}`}
                  >
                    {activeVideo.type}
                  </span>
                  {activeVideo.official && (
                    <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verified Official
                    </span>
                  )}
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-white">
                  {activeVideo.name}
                </h3>
              </div>

              <a
                href={`https://www.youtube.com/watch?v=${activeVideo.key}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-white/80 hover:text-white border border-white/10 transition-colors self-start sm:self-auto"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in YouTube</span>
              </a>
            </div>
          </div>

          {/* Video List / Playlist */}
          <div className="lg:col-span-4 flex flex-col bg-[#12141f]/80 p-4 sm:p-5 max-h-[400px] lg:max-h-none overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
              <span className="text-xs font-bold text-white/70 uppercase tracking-wider flex items-center gap-1.5">
                <Tv className="w-3.5 h-3.5 text-orange-400" />
                Available Trailers & Clips ({allVideos.length})
              </span>
            </div>

            <div className="space-y-2.5">
              {allVideos.map((video, idx) => {
                const isActive = activeVideo.key === video.key;
                return (
                  <button
                    key={video.id || video.key || idx}
                    onClick={() => setActiveVideo(video)}
                    className={`w-full text-left p-2.5 rounded-xl flex items-start gap-3 transition-all ${
                      isActive
                        ? 'bg-orange-500/20 border border-orange-500/40 text-white shadow-lg shadow-orange-500/10'
                        : 'bg-white/5 hover:bg-white/10 border border-white/5 text-white/70 hover:text-white'
                    }`}
                  >
                    {/* Video Thumbnail */}
                    <div className="relative w-24 sm:w-28 aspect-video rounded-lg overflow-hidden bg-black/40 flex-shrink-0 border border-white/10">
                      <img
                        src={`https://img.youtube.com/vi/${video.key}/mqdefault.jpg`}
                        alt={video.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            isActive
                              ? 'bg-orange-500 text-white'
                              : 'bg-black/60 text-white/80'
                          }`}
                        >
                          <Play className="w-3 h-3 fill-current ml-0.5" />
                        </div>
                      </div>
                      {video.official && (
                        <div className="absolute top-1 left-1 px-1 py-0.2 rounded bg-black/80 text-[8px] font-bold text-amber-400 border border-amber-500/40">
                          OFFICIAL
                        </div>
                      )}
                    </div>

                    {/* Video Info */}
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider border ${getVideoTypeBadgeColor(
                            video.type,
                            video.official
                          )}`}
                        >
                          {video.type}
                        </span>
                        {video.official && (
                          <span className="text-[9px] font-semibold text-emerald-400">
                            TMDB Official
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-semibold leading-tight line-clamp-2 text-white">
                        {video.name}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
