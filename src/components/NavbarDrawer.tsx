import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Search, 
  Film, 
  Tv, 
  Users, 
  Bookmark, 
  History, 
  Sparkles, 
  Sun, 
  Moon, 
  Palette, 
  Check, 
  Clapperboard, 
  Compass, 
  LogOut, 
  User,
  ArrowRight
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWatchlist } from '../context/WatchlistContext';
import { useHistory } from '../context/HistoryContext';
import { useTheme } from '../context/ThemeContext';
import { AccentColor } from '../types';

interface NavbarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NavbarDrawer: React.FC<NavbarDrawerProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, openAuthModal, logout } = useAuth();
  const { watchlist } = useWatchlist();
  const { history } = useHistory();
  const { theme, toggleTheme, accentColor, setAccentColor, accentConfig, availableAccents } = useTheme();

  const currentPath = location.pathname;
  const totalLibraryCount = watchlist.length + history.length;

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle ESC
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const navLinks = [
    { label: 'Home', path: '/', icon: Clapperboard, count: null },
    { label: 'Movies', path: '/movies', icon: Film, count: null },
    { label: 'Series', path: '/series', icon: Tv, count: null },
    { label: 'Actors', path: '/actors', icon: Users, count: null },
    { label: 'Library', path: '/library', icon: Bookmark, count: totalLibraryCount },
  ];

  if (!isOpen) return null;

  const drawerContent = (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex flex-col justify-end select-none">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/65 backdrop-blur-md transition-opacity"
        />

        {/* Shadcn Drawer Container (Bottom Sheet with rounded top & handle) */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="relative z-10 flex max-h-[88vh] w-full flex-col rounded-t-[28px] border-t border-slate-200 dark:border-white/15 bg-white dark:bg-[#0e1018] shadow-2xl overflow-hidden text-slate-900 dark:text-white"
        >
          {/* Drag Handle Bar (Shadcn signature) */}
          <div className="flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing">
            <div className="h-1.5 w-12 rounded-full bg-slate-300 dark:bg-white/20 hover:bg-slate-400 dark:hover:bg-white/30 transition-colors" />
          </div>

          {/* Drawer Header */}
          <div className="px-6 pt-2 pb-4 border-b border-slate-100 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${accentConfig.gradient} flex items-center justify-center text-white shadow-md`}>
                <Clapperboard className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-['Outfit',sans-serif] text-base font-bold text-slate-900 dark:text-white">
                  Movieace Navigation
                </h3>
                <p className="text-xs text-slate-500 dark:text-white/50">
                  Discover movies, series, stars & custom collections
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="h-8 w-8 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-white/60 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
              title="Close drawer (ESC)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Drawer Content (Scrollable) */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 max-h-[calc(88vh-130px)]">
            {/* Quick Search Bar */}
            <div>
              <button
                onClick={() => {
                  onClose();
                  navigate('/search');
                }}
                className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/70 hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-all text-xs font-medium group"
              >
                <span className="flex items-center gap-2.5">
                  <Search className={`w-4 h-4 ${accentConfig.badgeText}`} />
                  <span>Search cinema, actors, directors, genres...</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-white/50 font-mono">
                  Ctrl+K
                </span>
              </button>
            </div>

            {/* Main Navigation Links */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-white/40 block px-1">
                Explore Categories
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {navLinks.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.path === '/'
                    ? currentPath === '/'
                    : currentPath.startsWith(item.path);

                  return (
                    <button
                      key={item.path}
                      onClick={() => {
                        onClose();
                        navigate(item.path);
                      }}
                      className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold transition-all ${
                        isActive
                          ? `${accentConfig.badgeBg} ${accentConfig.badgeText} font-bold shadow-sm border border-current/20`
                          : 'bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-white/80 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white border border-transparent'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </span>
                      {item.count !== null && item.count > 0 && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold text-white bg-gradient-to-r ${accentConfig.gradient}`}>
                          {item.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Personal Access (Watchlist & History) */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => {
                  onClose();
                  navigate('/watchlist');
                }}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  currentPath === '/watchlist'
                    ? `${accentConfig.badgeBg} border-current ${accentConfig.badgeText}`
                    : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-white/80 hover:bg-slate-100 dark:hover:bg-white/10'
                }`}
              >
                <Bookmark className="w-4 h-4 text-orange-400" />
                <span>Watchlist ({watchlist.length})</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  navigate('/history');
                }}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  currentPath === '/history'
                    ? `${accentConfig.badgeBg} border-current ${accentConfig.badgeText}`
                    : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-white/80 hover:bg-slate-100 dark:hover:bg-white/10'
                }`}
              >
                <History className="w-4 h-4 text-orange-400" />
                <span>History ({history.length})</span>
              </button>
            </div>

            {/* Theme & Palette Controls */}
            <div className="pt-2 border-t border-slate-100 dark:border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-white/80">Appearance Mode</span>
                </div>
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 text-xs font-bold text-slate-800 dark:text-white border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                >
                  {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-700" />}
                  <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
                </button>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-white/80 mb-2">
                  <span className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-orange-400" />
                    <span>Accent Theme</span>
                  </span>
                  <span className="text-[11px] text-slate-400 dark:text-white/40 capitalize">{accentColor}</span>
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {availableAccents.map((acc) => (
                    <button
                      key={acc.id}
                      onClick={() => setAccentColor(acc.id as AccentColor)}
                      className={`h-9 rounded-xl flex items-center justify-center border transition-all ${
                        accentColor === acc.id
                          ? 'border-slate-800 dark:border-white scale-105 shadow-md'
                          : 'border-transparent hover:scale-102'
                      }`}
                      style={{ backgroundColor: acc.primary }}
                      title={acc.label}
                    >
                      {accentColor === acc.id && (
                        <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* User Account / Profile Section in Drawer */}
            <div className="pt-2 border-t border-slate-100 dark:border-white/10">
              {currentUser ? (
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={currentUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.uid}`}
                      alt="avatar"
                      className="w-8 h-8 rounded-xl object-cover bg-slate-300 dark:bg-white/10"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate text-slate-900 dark:text-white">{currentUser.displayName || 'User'}</p>
                      <p className="text-[10px] text-emerald-500 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Cloud Sync Active
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      onClose();
                    }}
                    className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 text-xs font-semibold flex items-center gap-1"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    onClose();
                    openAuthModal();
                  }}
                  className={`w-full py-3 rounded-2xl bg-gradient-to-r ${accentConfig.gradient} text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg hover:brightness-110 active:scale-98 transition-all`}
                >
                  <User className="w-4 h-4" />
                  <span>Sign In for Cloud Sync & Backup</span>
                </button>
              )}
            </div>
          </div>

          {/* Drawer Footer */}
          <div className="px-6 py-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between bg-slate-50/50 dark:bg-black/20 text-xs text-slate-400 dark:text-white/40">
            <span>Movieace Streaming Cinema</span>
            <button
              onClick={onClose}
              className="text-xs font-semibold text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );

  return createPortal(drawerContent, document.body);
};
