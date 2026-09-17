import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';

export interface SoundtrackTrack {
  id: string;
  trackNumber: number;
  title: string;
  composer: string;
  duration: string;
  youtubeSearchQuery: string;
  youtubeId?: string;
}

export interface SoundtrackAlbum {
  albumTitle: string;
  composer: string;
  releaseYear?: number;
  label: string;
  tracksCount: number;
  totalDuration: string;
  playlistYoutubeQuery: string;
  tracks: SoundtrackTrack[];
}

interface SoundtrackContextType {
  currentAlbum: SoundtrackAlbum | null;
  currentTrack: SoundtrackTrack | null;
  currentTrackIndex: number;
  isPlaying: boolean;
  volume: number;
  isModalOpen: boolean;
  isBarVisible: boolean;
  playAlbum: (album: SoundtrackAlbum, trackIndex?: number) => void;
  playTrack: (album: SoundtrackAlbum, trackIndex: number) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setVolume: (vol: number) => void;
  openModal: () => void;
  closeModal: () => void;
  closeBar: () => void;
}

const SoundtrackContext = createContext<SoundtrackContextType | undefined>(undefined);

export const SoundtrackProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentAlbum, setCurrentAlbum] = useState<SoundtrackAlbum | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(80);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isBarVisible, setIsBarVisible] = useState<boolean>(false);

  const currentTrack = currentAlbum?.tracks[currentTrackIndex] || null;

  const playAlbum = (album: SoundtrackAlbum, trackIndex: number = 0) => {
    setCurrentAlbum(album);
    setCurrentTrackIndex(trackIndex);
    setIsPlaying(true);
    setIsBarVisible(true);
  };

  const playTrack = (album: SoundtrackAlbum, trackIndex: number) => {
    setCurrentAlbum(album);
    setCurrentTrackIndex(trackIndex);
    setIsPlaying(true);
    setIsBarVisible(true);
  };

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const nextTrack = () => {
    if (!currentAlbum || currentAlbum.tracks.length === 0) return;
    setCurrentTrackIndex((prev) => (prev + 1) % currentAlbum.tracks.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    if (!currentAlbum || currentAlbum.tracks.length === 0) return;
    setCurrentTrackIndex((prev) =>
      prev === 0 ? currentAlbum.tracks.length - 1 : prev - 1
    );
    setIsPlaying(true);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const closeBar = () => {
    setIsPlaying(false);
    setIsBarVisible(false);
  };

  return (
    <SoundtrackContext.Provider
      value={{
        currentAlbum,
        currentTrack,
        currentTrackIndex,
        isPlaying,
        volume,
        isModalOpen,
        isBarVisible,
        playAlbum,
        playTrack,
        togglePlay,
        nextTrack,
        prevTrack,
        setVolume,
        openModal,
        closeModal,
        closeBar,
      }}
    >
      {children}
    </SoundtrackContext.Provider>
  );
};

export const useSoundtrack = () => {
  const context = useContext(SoundtrackContext);
  if (!context) {
    throw new Error('useSoundtrack must be used within a SoundtrackProvider');
  }
  return context;
};
