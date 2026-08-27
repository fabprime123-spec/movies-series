import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { MediaItem, WatchlistItem, WatchlistStatus } from '../types';
import { useAuth } from './AuthContext';
import { 
  saveWatchlistItemToFirestore, 
  deleteWatchlistItemFromFirestore, 
  fetchWatchlistFromFirestore 
} from '../lib/firebase';

const LOCAL_STORAGE_KEY = 'movieace_user_watchlist_v1';

interface WatchlistContextType {
  watchlist: WatchlistItem[];
  favoritesCount: number;
  watchingCount: number;
  completedCount: number;
  planToWatchCount: number;
  addToWatchlist: (media: MediaItem, status?: WatchlistStatus, isFavorite?: boolean) => void;
  removeFromWatchlist: (mediaId: string) => void;
  updateStatus: (mediaId: string, status: WatchlistStatus) => void;
  toggleFavorite: (media: MediaItem) => void;
  updatePersonalRating: (mediaId: string, rating: number) => void;
  updatePersonalNote: (mediaId: string, note: string) => void;
  updateEpisodeProgress: (mediaId: string, watched: number) => void;
  isInWatchlist: (mediaId: string) => boolean;
  isFavorite: (mediaId: string) => boolean;
  getWatchlistItem: (mediaId: string) => WatchlistItem | undefined;
  exportWatchlistJson: () => void;
  importWatchlistJson: (jsonString: string) => boolean;
  clearWatchlist: () => void;
  isSyncing: boolean;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export const WatchlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse local watchlist', e);
    }
    return [];
  });

  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Save to LocalStorage whenever watchlist changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(watchlist));
    } catch (e) {
      console.error('Failed to write to local storage', e);
    }
  }, [watchlist]);

  // Cloud Sync with Firestore whenever user logs in
  useEffect(() => {
    if (!currentUser?.uid) return;

    let isMounted = true;
    const syncWithCloud = async () => {
      setIsSyncing(true);
      try {
        const cloudItems = await fetchWatchlistFromFirestore(currentUser.uid);
        if (!isMounted) return;

        if (cloudItems.length > 0) {
          // Merge local and cloud items (cloud takes precedence if newer, else merge)
          setWatchlist((localItems) => {
            const mergedMap = new Map<string, WatchlistItem>();
            localItems.forEach((item) => mergedMap.set(item.id, item));
            cloudItems.forEach((item) => mergedMap.set(item.id, item));
            const mergedList = Array.from(mergedMap.values());
            return mergedList;
          });
        } else if (watchlist.length > 0) {
          // Upload local items to cloud if cloud was empty
          for (const item of watchlist) {
            await saveWatchlistItemToFirestore(currentUser.uid, item);
          }
        }
      } catch (err) {
        console.warn('Sync failed:', err);
      } finally {
        if (isMounted) setIsSyncing(false);
      }
    };

    syncWithCloud();

    return () => {
      isMounted = false;
    };
  }, [currentUser?.uid]);

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#f43f5e', '#ec4899', '#8b5cf6', '#3b82f6', '#10b981'],
      });
    } catch {
      // ignore
    }
  };

  const addToWatchlist = useCallback(
    (media: MediaItem, status: WatchlistStatus = 'plan_to_watch', isFavorite = false) => {
      const now = new Date().toISOString();
      const existing = watchlist.find((i) => i.id === media.id);

      const newItem: WatchlistItem = {
        id: media.id,
        media,
        status: existing?.status || status,
        isFavorite: isFavorite || existing?.isFavorite || false,
        personalRating: existing?.personalRating,
        personalNote: existing?.personalNote,
        watchedEpisodes: existing?.watchedEpisodes || (media.type !== 'movie' ? 0 : undefined),
        totalEpisodes: media.totalEpisodes,
        addedAt: existing?.addedAt || now,
        updatedAt: now,
      };

      setWatchlist((prev) => {
        const filtered = prev.filter((i) => i.id !== media.id);
        return [newItem, ...filtered];
      });

      if (currentUser?.uid) {
        saveWatchlistItemToFirestore(currentUser.uid, newItem);
      }

      triggerCelebration();
    },
    [watchlist, currentUser?.uid]
  );

  const removeFromWatchlist = useCallback(
    (mediaId: string) => {
      setWatchlist((prev) => prev.filter((i) => i.id !== mediaId));
      if (currentUser?.uid) {
        deleteWatchlistItemFromFirestore(currentUser.uid, mediaId);
      }
    },
    [currentUser?.uid]
  );

  const updateStatus = useCallback(
    (mediaId: string, status: WatchlistStatus) => {
      setWatchlist((prev) => {
        return prev.map((item) => {
          if (item.id === mediaId) {
            const updated = {
              ...item,
              status,
              updatedAt: new Date().toISOString(),
              watchedEpisodes: status === 'completed' && item.totalEpisodes ? item.totalEpisodes : item.watchedEpisodes,
            };
            if (currentUser?.uid) {
              saveWatchlistItemToFirestore(currentUser.uid, updated);
            }
            if (status === 'completed') triggerCelebration();
            return updated;
          }
          return item;
        });
      });
    },
    [currentUser?.uid]
  );

  const toggleFavorite = useCallback(
    (media: MediaItem) => {
      const existing = watchlist.find((i) => i.id === media.id);
      const now = new Date().toISOString();

      if (existing) {
        const newFavState = !existing.isFavorite;
        const updated: WatchlistItem = {
          ...existing,
          isFavorite: newFavState,
          updatedAt: now,
        };

        setWatchlist((prev) => prev.map((i) => (i.id === media.id ? updated : i)));
        if (currentUser?.uid) {
          saveWatchlistItemToFirestore(currentUser.uid, updated);
        }
        if (newFavState) triggerCelebration();
      } else {
        // Add as favorite
        const newItem: WatchlistItem = {
          id: media.id,
          media,
          status: 'plan_to_watch',
          isFavorite: true,
          addedAt: now,
          updatedAt: now,
        };
        setWatchlist((prev) => [newItem, ...prev]);
        if (currentUser?.uid) {
          saveWatchlistItemToFirestore(currentUser.uid, newItem);
        }
        triggerCelebration();
      }
    },
    [watchlist, currentUser?.uid]
  );

  const updatePersonalRating = useCallback(
    (mediaId: string, rating: number) => {
      setWatchlist((prev) => {
        return prev.map((item) => {
          if (item.id === mediaId) {
            const updated = {
              ...item,
              personalRating: rating,
              updatedAt: new Date().toISOString(),
            };
            if (currentUser?.uid) {
              saveWatchlistItemToFirestore(currentUser.uid, updated);
            }
            return updated;
          }
          return item;
        });
      });
    },
    [currentUser?.uid]
  );

  const updatePersonalNote = useCallback(
    (mediaId: string, note: string) => {
      setWatchlist((prev) => {
        return prev.map((item) => {
          if (item.id === mediaId) {
            const updated = {
              ...item,
              personalNote: note,
              updatedAt: new Date().toISOString(),
            };
            if (currentUser?.uid) {
              saveWatchlistItemToFirestore(currentUser.uid, updated);
            }
            return updated;
          }
          return item;
        });
      });
    },
    [currentUser?.uid]
  );

  const updateEpisodeProgress = useCallback(
    (mediaId: string, watched: number) => {
      setWatchlist((prev) => {
        return prev.map((item) => {
          if (item.id === mediaId) {
            const isFinished = item.totalEpisodes && watched >= item.totalEpisodes;
            const updated = {
              ...item,
              watchedEpisodes: watched,
              status: isFinished ? 'completed' : item.status === 'plan_to_watch' ? 'watching' : item.status,
              updatedAt: new Date().toISOString(),
            };
            if (currentUser?.uid) {
              saveWatchlistItemToFirestore(currentUser.uid, updated);
            }
            return updated;
          }
          return item;
        });
      });
    },
    [currentUser?.uid]
  );

  const isInWatchlist = useCallback(
    (mediaId: string) => watchlist.some((i) => i.id === mediaId),
    [watchlist]
  );

  const isFavorite = useCallback(
    (mediaId: string) => watchlist.some((i) => i.id === mediaId && i.isFavorite),
    [watchlist]
  );

  const getWatchlistItem = useCallback(
    (mediaId: string) => watchlist.find((i) => i.id === mediaId),
    [watchlist]
  );

  const exportWatchlistJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(watchlist, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `movieace_watchlist_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importWatchlistJson = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed)) {
        setWatchlist(parsed);
        if (currentUser?.uid) {
          parsed.forEach((item) => saveWatchlistItemToFirestore(currentUser.uid, item));
        }
        return true;
      }
    } catch (e) {
      console.error('Import failed', e);
    }
    return false;
  };

  const clearWatchlist = () => {
    if (confirm('Are you sure you want to clear your local watchlist?')) {
      setWatchlist([]);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  };

  const favoritesCount = watchlist.filter((i) => i.isFavorite).length;
  const watchingCount = watchlist.filter((i) => i.status === 'watching').length;
  const completedCount = watchlist.filter((i) => i.status === 'completed').length;
  const planToWatchCount = watchlist.filter((i) => i.status === 'plan_to_watch').length;

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        favoritesCount,
        watchingCount,
        completedCount,
        planToWatchCount,
        addToWatchlist,
        removeFromWatchlist,
        updateStatus,
        toggleFavorite,
        updatePersonalRating,
        updatePersonalNote,
        updateEpisodeProgress,
        isInWatchlist,
        isFavorite,
        getWatchlistItem,
        exportWatchlistJson,
        importWatchlistJson,
        clearWatchlist,
        isSyncing,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = (): WatchlistContextType => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};
