import React, { createContext, useContext, useEffect, useState } from 'react';
import { MediaItem, HistoryItem } from '../types';

interface HistoryContextType {
  history: HistoryItem[];
  addToHistory: (item: MediaItem) => void;
  removeFromHistory: (mediaId: string) => void;
  clearHistory: () => void;
  isInHistory: (mediaId: string) => boolean;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

const STORAGE_KEY = 'movieace_view_history';

export const HistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.warn('Could not save history to localStorage:', e);
    }
  }, [history]);

  const addToHistory = (item: MediaItem) => {
    if (!item || !item.id) return;
    setHistory((prev) => {
      // Check if already in history
      const existing = prev.find((h) => h.id === item.id);
      const viewCount = (existing?.viewCount || 0) + 1;
      const filtered = prev.filter((h) => h.id !== item.id);
      
      const newEntry: HistoryItem = {
        id: item.id,
        media: item,
        viewedAt: Date.now(),
        viewCount,
      };

      // Keep max 100 history entries
      return [newEntry, ...filtered].slice(0, 100);
    });
  };

  const removeFromHistory = (mediaId: string) => {
    setHistory((prev) => prev.filter((h) => h.id !== mediaId));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const isInHistory = (mediaId: string) => {
    return history.some((h) => h.id === mediaId);
  };

  return (
    <HistoryContext.Provider
      value={{
        history,
        addToHistory,
        removeFromHistory,
        clearHistory,
        isInHistory,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = (): HistoryContextType => {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
};
