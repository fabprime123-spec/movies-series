import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Info, 
  Play, 
  Bookmark, 
  Check, 
  Clock, 
  PlayCircle, 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  Copy, 
  Share2, 
  Maximize2, 
  ExternalLink,
  Trash2
} from 'lucide-react';
import { MediaItem, WatchlistStatus } from '../types';
import { useWatchlist } from '../context/WatchlistContext';
import { useTrailer } from '../context/TrailerContext';
import { useNavigate } from 'react-router-dom';

interface ContextMenuPosition {
  x: number;
  y: number;
}

interface MediaContextMenuProps {
  item: MediaItem;
  children: React.ReactNode;
  onOpenDetails?: (item: MediaItem) => void;
  onPlayTrailer?: (youtubeId: string, title: string) => void;
}

export const MediaContextMenu: React.FC<MediaContextMenuProps> = ({
  item,
  children,
  onOpenDetails,
  onPlayTrailer,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<ContextMenuPosition>({ x: 0, y: 0 });
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);
  const { watchlist, isInWatchlist, addToWatchlist, removeFromWatchlist, updateStatus } = useWatchlist();
  const { playTrailer } = useTrailer();
  const navigate = useNavigate();

  const inWatchlist = isInWatchlist(item.id);
  const currentWatchlistItem = watchlist.find((w) => w.id === item.id || w.media?.id === item.id);
  const currentStatus = currentWatchlistItem?.status;

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    setActiveSubmenu(null);
  }, []);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Smart viewport clamping
    const menuWidth = 230;
    const menuHeight = 280;
    let x = e.clientX;
    let y = e.clientY;

    if (x + menuWidth > window.innerWidth) {
      x = Math.max(10, window.innerWidth - menuWidth - 12);
    }
    if (y + menuHeight > window.innerHeight) {
      y = Math.max(10, window.innerHeight - menuHeight - 12);
    }

    setPosition({ x, y });
    setIsOpen(true);
    setActiveSubmenu(null);
  };

  // Close on outside click, window scroll or ESC
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        closeMenu();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu();
    };

    const handleScroll = () => {
      closeMenu();
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen, closeMenu]);

  const handleViewDetails = () => {
    closeMenu();
    if (onOpenDetails) {
      onOpenDetails(item);
    } else {
      navigate(`/details/${item.type}/${item.id}`);
    }
  };

  const handlePlayTrailer = () => {
    closeMenu();
    if (onPlayTrailer && item.trailerYoutubeId) {
      onPlayTrailer(item.trailerYoutubeId, item.title);
    } else if (item.trailerYoutubeId) {
      playTrailer(item.trailerYoutubeId, item.title);
    } else {
      handleViewDetails();
    }
  };

  const handleStatusChange = (status: WatchlistStatus) => {
    if (inWatchlist) {
      updateStatus(item.id, status);
    } else {
      addToWatchlist(item, status);
    }
    closeMenu();
  };

  const handleCopyTitle = async () => {
    try {
      await navigator.clipboard.writeText(item.title);
      setCopiedText('Title copied!');
      setTimeout(() => {
        setCopiedText(null);
        closeMenu();
      }, 900);
    } catch {
      closeMenu();
    }
  };

  const handleCopyLink = async () => {
    try {
      const url = `${window.location.origin}/details/${item.type}/${item.id}`;
      await navigator.clipboard.writeText(url);
      setCopiedText('Link copied!');
      setTimeout(() => {
        setCopiedText(null);
        closeMenu();
      }, 900);
    } catch {
      closeMenu();
    }
  };

  const handleShare = async () => {
    closeMenu();
    const url = `${window.location.origin}/details/${item.type}/${item.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: `Check out ${item.title} on Movieace`,
          url,
        });
      } catch {
        // User cancelled or unsupported
      }
    } else {
      handleCopyLink();
    }
  };

  const statusOptions: { label: string; status: WatchlistStatus; icon: React.FC<{ className?: string }> }[] = [
    { label: 'Plan to Watch', status: 'plan_to_watch', icon: Clock },
    { label: 'Watching', status: 'watching', icon: PlayCircle },
    { label: 'Completed', status: 'completed', icon: CheckCircle2 },
    { label: 'Dropped', status: 'dropped', icon: XCircle },
  ];

  return (
    <>
      <div 
        onContextMenu={handleContextMenu}
        className="w-full h-full"
      >
        {children}
      </div>

      {isOpen &&
        createPortal(
          <AnimatePresence>
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, scale: 0.95, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.12, ease: 'easeOut' }}
              style={{
                top: `${position.y}px`,
                left: `${position.x}px`,
              }}
              className="fixed z-[99999] min-w-[220px] rounded-xl border border-white/10 bg-[#121422]/95 p-1.5 text-white shadow-2xl backdrop-blur-2xl select-none"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Context Menu Header */}
              <div className="px-2.5 py-1.5 border-b border-white/10 mb-1 flex items-center justify-between">
                <span className="text-[11px] font-bold text-white/90 truncate max-w-[170px]">
                  {item.title}
                </span>
                <span className="text-[10px] text-white/40 uppercase tracking-wider font-mono">
                  {item.type}
                </span>
              </div>

              {/* View Details */}
              <button
                onClick={handleViewDetails}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-white/90 hover:bg-white/10 hover:text-white transition-colors group cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Info className="w-3.5 h-3.5 text-orange-400" />
                  <span>View Details</span>
                </span>
                <kbd className="text-[10px] text-white/40 group-hover:text-white/70 font-mono">↵</kbd>
              </button>

              {/* Play Trailer */}
              {item.trailerYoutubeId && (
                <button
                  onClick={handlePlayTrailer}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-white/90 hover:bg-white/10 hover:text-white transition-colors group cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Play className="w-3.5 h-3.5 text-amber-400 fill-amber-400/30" />
                    <span>Play Trailer</span>
                  </span>
                  <kbd className="text-[10px] text-white/40 group-hover:text-white/70 font-mono">Space</kbd>
                </button>
              )}

              {/* Divider */}
              <div className="h-px bg-white/10 my-1" />

              {/* Watchlist Submenu */}
              <div 
                className="relative"
                onMouseEnter={() => setActiveSubmenu('watchlist')}
                onMouseLeave={() => setActiveSubmenu(null)}
              >
                <button
                  onClick={() => setActiveSubmenu(activeSubmenu === 'watchlist' ? null : 'watchlist')}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-white/90 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Bookmark className={`w-3.5 h-3.5 ${inWatchlist ? 'text-amber-400 fill-amber-400' : 'text-white/60'}`} />
                    <span>Watchlist Status</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-white/40" />
                </button>

                {/* Submenu flyout (Shadcn style) */}
                <AnimatePresence>
                  {activeSubmenu === 'watchlist' && (
                    <motion.div
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -6 }}
                      transition={{ duration: 0.1 }}
                      className="absolute left-[calc(100%+4px)] top-0 min-w-[170px] rounded-xl border border-white/10 bg-[#141726]/95 p-1.5 text-white shadow-2xl backdrop-blur-2xl"
                    >
                      {statusOptions.map((opt) => {
                        const Icon = opt.icon;
                        const isSelected = currentStatus === opt.status;
                        return (
                          <button
                            key={opt.status}
                            onClick={() => handleStatusChange(opt.status)}
                            className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs text-white/90 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                          >
                            <span className="flex items-center gap-2">
                              <Icon className="w-3.5 h-3.5 text-white/70" />
                              <span>{opt.label}</span>
                            </span>
                            {isSelected && <Check className="w-3 h-3 text-amber-400 stroke-[3]" />}
                          </button>
                        );
                      })}

                      {inWatchlist && (
                        <>
                          <div className="h-px bg-white/10 my-1" />
                          <button
                            onClick={() => {
                              removeFromWatchlist(item.id);
                              closeMenu();
                            }}
                            className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-rose-400 hover:bg-rose-500/20 hover:text-rose-200 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove from Watchlist</span>
                          </button>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Divider */}
              <div className="h-px bg-white/10 my-1" />

              {/* Copy Title */}
              <button
                onClick={handleCopyTitle}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-white/90 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Copy className="w-3.5 h-3.5 text-white/60" />
                  <span>Copy Title</span>
                </span>
                {copiedText === 'Title copied!' && (
                  <span className="text-[10px] text-emerald-400 font-semibold">Copied!</span>
                )}
              </button>

              {/* Copy Link */}
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-white/90 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <ExternalLink className="w-3.5 h-3.5 text-white/60" />
                  <span>Copy Link</span>
                </span>
                {copiedText === 'Link copied!' && (
                  <span className="text-[10px] text-emerald-400 font-semibold">Copied!</span>
                )}
              </button>

              {/* Share */}
              <button
                onClick={handleShare}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-white/90 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-white/60" />
                <span>Share</span>
              </button>
            </motion.div>
          </AnimatePresence>,
          document.body
        )}
    </>
  );
};
