import React, { createContext, useContext, useState } from 'react';

interface TrailerContextType {
  activeTrailer: { youtubeId: string; title: string } | null;
  playTrailer: (youtubeId: string, title: string) => void;
  closeTrailer: () => void;
}

const TrailerContext = createContext<TrailerContextType | undefined>(undefined);

export const TrailerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTrailer, setActiveTrailer] = useState<{ youtubeId: string; title: string } | null>(null);

  const playTrailer = (youtubeId: string, title: string) => {
    if (!youtubeId) return;
    setActiveTrailer({ youtubeId, title });
  };

  const closeTrailer = () => {
    setActiveTrailer(null);
  };

  return (
    <TrailerContext.Provider value={{ activeTrailer, playTrailer, closeTrailer }}>
      {children}
    </TrailerContext.Provider>
  );
};

export const useTrailer = () => {
  const context = useContext(TrailerContext);
  if (!context) throw new Error('useTrailer must be used within TrailerProvider');
  return context;
};
