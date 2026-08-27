import React, { useState } from 'react';
import { 
  Bookmark, 
  Search, 
  User, 
  LogOut, 
  Menu, 
  X,
  Clapperboard,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWatchlist } from '../context/WatchlistContext';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

interface NavItem {
  path: string;
  id: string;
  label: string;
}

export const Navbar: React.FC = () => {
  const { currentUser, openAuthModal, logout } = useAuth();
  const { watchlist, isSyncing } = useWatchlist();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems: NavItem[] = [
    { path: '/', id: 'home', label: 'Home' },
    { path: '/movies', id: 'movies', label: 'Movies' },
    { path: '/shows', id: 'shows', label: 'Shows' },
    { path: '/actors', id: 'actors', label: 'Actors' },
    { path: '/watchlist', id: 'watchlist', label: 'Watchlist' },
  ];

  const currentPath = location.pathname;
  const isSearchActive = currentPath === '/search';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 backdrop-blur-xl bg-[#0c0d12]/80 transition-all duration-300">
      <div className="w-full px-4 sm:px-8 lg:px-12 py-3.5">
        <div className="flex items-center justify-between gap-6">
          
          {/* Brand Logo */}
          <Link 
            to="/"
            className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
            id="brand-logo-btn"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-orange-500 via-orange-600 to-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/25 group-hover:scale-105 transition-transform duration-300">
              <Clapperboard className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-['Outfit',sans-serif] text-lg font-extrabold tracking-tight text-white group-hover:text-orange-400 transition-colors">
                Movieace
              </span>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
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
                      ? 'text-white font-bold'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {item.label}
                    {item.id === 'watchlist' && watchlist.length > 0 && (
                      <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white">
                        {watchlist.length}
                      </span>
                    )}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNavDot"
                      className="absolute -bottom-1.5 h-1 w-1 rounded-full bg-orange-500 shadow-md shadow-orange-500/50"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            {/* Search Trigger Button leading to /search */}
            <button
              id="header-search-trigger"
              onClick={() => navigate('/search')}
              className={`flex items-center gap-3 rounded-xl px-3.5 py-1.5 text-xs transition-all duration-200 border ${
                isSearchActive
                  ? 'border-orange-500 bg-orange-500/20 text-white shadow-md shadow-orange-500/20'
                  : 'bg-white/5 border-white/10 text-white/60 hover:border-orange-500/40 hover:text-white hover:bg-white/10'
              }`}
              title="Open Cinema Search (Ctrl+K)"
            >
              <Search className="h-3.5 w-3.5 text-orange-400" />
              <span className="hidden sm:inline font-medium">Search</span>
              <kbd className="hidden sm:inline-flex rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-white/50 font-mono border border-white/10">Ctrl+K</kbd>
            </button>

            {/* Quick Watchlist Bookmark Button */}
            <button
              id="quick-watchlist-btn"
              onClick={() => navigate('/watchlist')}
              className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-200 ${
                currentPath === '/watchlist'
                  ? 'border-orange-500 bg-orange-500/20 text-orange-400 shadow-md shadow-orange-500/20'
                  : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
              }`}
              aria-label="View Watchlist"
            >
              <Bookmark className="h-4 w-4" />
            </button>

            {/* User Auth Section */}
            {currentUser ? (
              <div className="relative">
                <button
                  id="user-profile-menu-btn"
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2 rounded-xl border border-orange-500/30 bg-orange-500/10 p-1 pr-2.5 text-xs font-medium text-white hover:bg-orange-500/20 transition-all"
                >
                  <img
                    src={currentUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.uid}`}
                    alt="avatar"
                    className="h-6 w-6 rounded-lg object-cover bg-orange-500/30"
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
                      className="absolute right-0 mt-2 w-56 rounded-2xl border border-white/10 bg-[#141620] p-2 shadow-2xl backdrop-blur-2xl z-50"
                    >
                      <div className="px-3 py-2 border-b border-white/10">
                        <p className="text-xs font-medium text-white/50">Signed in as</p>
                        <p className="text-sm font-semibold text-white truncate">{currentUser.displayName || currentUser.email}</p>
                        <p className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                          Cloud Sync Active
                        </p>
                      </div>
                      
                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          navigate('/watchlist');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-white/80 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                      >
                        <Bookmark className="h-3.5 w-3.5 text-orange-400" />
                        My Cinema Watchlist ({watchlist.length})
                      </button>

                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all mt-1"
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
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-orange-500/25 hover:shadow-orange-500/40 hover:brightness-110 active:scale-95 transition-all duration-200"
              >
                <User className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex md:hidden h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-white/10 bg-[#0c0d12] px-4 py-4"
          >
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    navigate(item.path);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                    currentPath === item.path
                      ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.id === 'watchlist' && watchlist.length > 0 && (
                    <span className="rounded-full bg-orange-500 px-2 py-0.5 text-xs font-bold text-white">
                      {watchlist.length}
                    </span>
                  )}
                </button>
              ))}

              <button
                onClick={() => {
                  navigate('/search');
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm font-medium text-white/80 hover:text-white mt-2"
              >
                <Search className="h-4 w-4 text-orange-400" />
                <span>Search Titles, Actors, Directors</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
