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
import { CountryFilterProvider } from './context/CountryFilterContext';
import { SoundtrackProvider } from './context/SoundtrackContext';
import { FloatingSoundtrackBar } from './components/FloatingSoundtrackBar';
import { SoundtrackModal } from './components/SoundtrackModal';

// Pages
import { HomePage } from './pages/HomePage';
import { MoviesPage } from './pages/MoviesPage';
import { SeriesPage } from './pages/ShowsPage';
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
          <Route path="/series" element={<SeriesPage />} />
          <Route path="/shows" element={<Navigate to="/series" replace />} />
          <Route path="/upcoming" element={<LibraryPage defaultTab="upcoming" />} />
          <Route path="/actors" element={<ActorsPage />} />
          <Route path="/actors/:id" element={<ActorsPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/watchlist" element={<LibraryPage defaultTab="watchlist" />} />
          <Route path="/history" element={<LibraryPage defaultTab="history" />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/gallery/:type/:id" element={<GalleryPage />} />
          <Route path="/details/:type/:id" element={<DetailsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Global Modals */}
      <TrailerModal />
      <SoundtrackModal />
      <AuthModal />

      {/* Persistent Floating Soundtrack Audio Bar */}
      <FloatingSoundtrackBar />

      {/* Global Periodical Footer */}
      <Footer />
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CountryFilterProvider>
          <WatchlistProvider>
            <HistoryProvider>
              <TrailerProvider>
                <SoundtrackProvider>
                  <BrowserRouter>
                    <AppContent />
                  </BrowserRouter>
                </SoundtrackProvider>
              </TrailerProvider>
            </HistoryProvider>
          </WatchlistProvider>
        </CountryFilterProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
