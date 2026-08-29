import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { TrailerModal } from './components/TrailerModal';
import { AuthModal } from './components/AuthModal';

import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { WatchlistProvider } from './context/WatchlistContext';
import { TrailerProvider } from './context/TrailerContext';
import { HistoryProvider } from './context/HistoryContext';

// Pages
import { HomePage } from './pages/HomePage';
import { MoviesPage } from './pages/MoviesPage';
import { ShowsPage } from './pages/ShowsPage';
import { ActorsPage } from './pages/ActorsPage';
import { UpcomingPage } from './pages/UpcomingPage';
import { LibraryPage } from './pages/LibraryPage';
import { GalleryPage } from './pages/GalleryPage';
import { SearchPage } from './pages/SearchPage';
import { DetailsPage } from './pages/DetailsPage';

function AppContent() {
  const navigate = useNavigate();

  // Keyboard shortcut listener (Ctrl+K or ⌘K navigates to /search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        navigate('/search');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-orange-500 selection:text-white transition-colors duration-300">
      {/* Navigation Header */}
      <Navbar />

      {/* Main Pages Router View */}
      <main className="flex-1 w-full">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/shows" element={<ShowsPage />} />
          <Route path="/upcoming" element={<UpcomingPage />} />
          <Route path="/actors" element={<ActorsPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/watchlist" element={<LibraryPage />} />
          <Route path="/history" element={<LibraryPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/gallery/:type/:id" element={<GalleryPage />} />
          <Route path="/details/:type/:id" element={<DetailsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Global Modals */}
      <TrailerModal />
      <AuthModal />

      {/* Global Periodical Footer */}
      <Footer />
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <WatchlistProvider>
          <HistoryProvider>
            <TrailerProvider>
              <BrowserRouter>
                <AppContent />
              </BrowserRouter>
            </TrailerProvider>
          </HistoryProvider>
        </WatchlistProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
