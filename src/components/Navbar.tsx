import React, { useState } from 'react';
import { 
  Bookmark, 
  Search, 
  User, 
  LogOut, 
  Menu,
  Clapperboard,
  History,
  Sun,
  Moon,
  Palette,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWatchlist } from '../context/WatchlistContext';
import { useHistory } from '../context/HistoryContext';
import { useTheme } from '../context/ThemeContext';
import { AccentColor } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { NavbarDrawer } from './NavbarDrawer';

interface NavItem {
  path: string;
  id: string;
  label: string;
}

export const Navbar: React.FC = () => {
  const { currentUser, openAuthModal, logout } = useAuth();
  const { watchlist, isSyncing } = useWatchlist();
  const { history } = useHistory();
  const { theme, toggleTheme, accentColor, setAccentColor, accentConfig, availableAccents } = useTheme();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showPaletteMenu, setShowPaletteMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems: NavItem[] = [
    { path: '/', id: 'home', label: 'Home' },
    { path: '/movies', id: 'movies', label: 'Movies' },
    { path: '/series', id: 'series', label: 'Series' },
    { path: '/actors', id: 'actors', label: 'Actors' },
    { path: '/library', id: 'library', label: 'Library' },
  ];

  const currentPath = location.pathname;
  const isSearchActive = currentPath === '/search';
  const totalLibraryCount = watchlist.length + history.length;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-white/10 backdrop-blur-xl bg-white/75 dark:bg-[#0c0d12]/75 transition-colors duration-300">
      <div className="w-full px-4 sm:px-8 lg:px-12 py-3.5">
        <div className="flex items-center justify-between gap-6">
          
          {/* Brand Logo */}
          <Link 
            to="/"
            className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
            id="brand-logo-btn"
          >
            <div className={`w-9 h-9 bg-gradient-to-br ${accentConfig.gradient} rounded-xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-105`}>
              <Clapperboard className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-['Outfit',sans-serif] text-lg font-extrabold tracking-tight text-slate-900 dark:text-white transition-colors">
                Movieace
              </span>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-7">
            {navItems.map((item) => {
              const isActive = item.path === '/' 
                ? currentPath === '/' 
                : currentPath.startsWith(item.path);

              return (
                <Link
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  to={item.path}
                  className={`relative flex flex-col items-center py-1 text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'text-slate-900 dark:text-white font-bold'
                      : 'text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {item.label}
                    {item.id === 'library' && totalLibraryCount > 0 && (
                      <span className={`flex h-4 min-w-[16px] items-center justify-center rounded-full bg-gradient-to-r ${accentConfig.gradient} px-1 text-[10px] font-bold text-white`}>
                        {totalLibraryCount}
                      </span>
                    )}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNavDot"
                      className={`absolute -bottom-1.5 h-1 w-1 rounded-full bg-gradient-to-r ${accentConfig.gradient} shadow-md`}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Search Trigger Button leading to /search */}
            <button
              id="header-search-trigger"
              onClick={() => navigate('/search')}
              className={`flex items-center gap-2 sm:gap-2.5 rounded-xl px-2.5 sm:px-3 py-1.5 text-xs transition-all duration-200 border ${
                isSearchActive
                  ? `${accentConfig.badgeBg} border-current ${accentConfig.badgeText} shadow-sm`
                  : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10'
              }`}
              title="Open Cinema Search (Ctrl+K)"
            >
              <Search className={`h-4 w-4 sm:h-3.5 sm:w-3.5 ${accentConfig.badgeText}`} />
              <span className="hidden sm:inline font-medium">Search</span>
              <kbd className="hidden lg:inline-flex rounded bg-slate-200 dark:bg-white/10 px-1.5 py-0.5 text-[10px] text-slate-500 dark:text-white/50 font-mono border border-slate-300 dark:border-white/10">Ctrl+K</kbd>
            </button>

            {/* Accent Color Picker Popover (Desktop / Tablet) */}
            <div className="relative hidden md:block">
              <button
                id="accent-palette-picker-btn"
                onClick={() => setShowPaletteMenu(!showPaletteMenu)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-white/70 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                title="Customize Accent Color Theme"
              >
                <div 
                  className="w-4 h-4 rounded-full border border-white/40 shadow-sm" 
                  style={{ backgroundColor: accentConfig.primary }} 
                />
              </button>

              <AnimatePresence>
                {showPaletteMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -8 }}
                    className="absolute right-0 mt-2 w-48 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#141620] p-3 shadow-2xl backdrop-blur-2xl z-50"
                  >
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-white/40 mb-2 px-1 flex items-center justify-between">
                      <span>Accent Color</span>
                      <Palette className="w-3.5 h-3.5" />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {availableAccents.map((acc) => (
                        <button
                          key={acc.id}
                          onClick={() => {
                            setAccentColor(acc.id as AccentColor);
                            setShowPaletteMenu(false);
                          }}
                          className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all ${
                            accentColor === acc.id
                              ? 'border-slate-800 dark:border-white bg-slate-100 dark:bg-white/10 shadow-sm'
                              : 'border-transparent hover:bg-slate-50 dark:hover:bg-white/5'
                          }`}
                        >
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center shadow-md relative"
                            style={{ backgroundColor: acc.primary }}
                          >
                            {accentColor === acc.id && (
                              <Check className="w-3 h-3 text-white stroke-[3]" />
                            )}
                          </div>
                          <span className="text-[10px] font-medium text-slate-700 dark:text-white/80">
                            {acc.label.split(' ')[0]}
                          </span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Light / Dark Mode Toggle */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-white/70 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-amber-400 hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="h-4 w-4 text-slate-700 hover:-rotate-12 transition-transform" />
              )}
            </button>

            {/* Quick Watchlist Bookmark Button (Desktop) */}
            <button
              id="quick-watchlist-btn"
              onClick={() => navigate('/watchlist')}
              className={`hidden sm:flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-200 ${
                currentPath === '/watchlist'
                  ? `${accentConfig.badgeBg} border-current ${accentConfig.badgeText} shadow-sm`
                  : 'border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-white/70 hover:bg-slate-200 dark:hover:bg-white/10'
              }`}
              aria-label="View Watchlist"
            >
              <Bookmark className="h-4 w-4" />
            </button>

            {/* Quick History Button (Desktop) */}
            <button
              id="quick-history-btn"
              onClick={() => navigate('/history')}
              className={`hidden sm:flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-200 ${
                currentPath === '/history'
                  ? `${accentConfig.badgeBg} border-current ${accentConfig.badgeText} shadow-sm`
                  : 'border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-white/70 hover:bg-slate-200 dark:hover:bg-white/10'
              }`}
              aria-label="View History"
              title="Viewing History"
            >
              <History className="h-4 w-4" />
            </button>

            {/* User Auth Section */}
            {currentUser ? (
              <div className="relative">
                <button
                  id="user-profile-menu-btn"
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className={`flex items-center gap-2 rounded-xl border ${accentConfig.badgeBg} border-current/30 p-1 pr-2.5 text-xs font-medium text-slate-900 dark:text-white hover:opacity-90 transition-all`}
                >
                  <img
                    src={currentUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.uid}`}
                    alt="avatar"
                    className="h-6 w-6 rounded-lg object-cover bg-slate-300 dark:bg-white/10"
                  />
                  <span className="max-w-[80px] truncate hidden sm:inline">{currentUser.displayName || 'User'}</span>
                  {isSyncing ? (
                    <span className="flex h-1.5 w-1.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                    </span>
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                  )}
                </button>

                {/* Dropdown menu */}
                <AnimatePresence>
                  {showUserDropdown && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      style={{ backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}
                      className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200/80 dark:border-white/15 bg-white/70 dark:bg-[#141620]/75 p-2 shadow-2xl z-50 text-slate-900 dark:text-white transform-gpu will-change-transform"
                    >
                      <div className="px-3 py-2 border-b border-slate-100 dark:border-white/10">
                        <p className="text-xs font-medium text-slate-400 dark:text-white/50">Signed in as</p>
                        <p className="text-sm font-semibold truncate">{currentUser.displayName || currentUser.email}</p>
                        <p className="text-[10px] text-emerald-500 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                          Cloud Sync Active
                        </p>
                      </div>
                      
                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          navigate('/watchlist');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 dark:text-white/80 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-all"
                      >
                        <Bookmark className="h-3.5 w-3.5 text-orange-400" />
                        My Cinema Watchlist ({watchlist.length})
                      </button>

                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          navigate('/history');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 dark:text-white/80 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-all"
                      >
                        <History className="h-3.5 w-3.5 text-orange-400" />
                        Viewing History ({history.length})
                      </button>

                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all mt-1"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                id="header-sign-in-btn"
                onClick={openAuthModal}
                className={`flex items-center gap-1.5 rounded-xl bg-gradient-to-r ${accentConfig.gradient} px-3.5 py-1.5 text-xs font-semibold text-white shadow-md hover:brightness-110 active:scale-95 transition-all duration-200`}
              >
                <User className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            {/* Mobile / Menu Drawer Toggle */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(true)}
              className="flex md:hidden h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-white/70 hover:bg-slate-200 dark:hover:bg-white/10"
              aria-label="Open Navigation Drawer"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Shadcn-style Drawer for Navigation */}
      <NavbarDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </header>
  );
};
