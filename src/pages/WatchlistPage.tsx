import React from 'react';
import { WatchlistView } from '../components/WatchlistView';
import { useNavigate } from 'react-router-dom';
import { MediaItem } from '../types';
import { useTrailer } from '../context/TrailerContext';

export const WatchlistPage: React.FC = () => {
  const navigate = useNavigate();
  const { playTrailer } = useTrailer();

  const handleOpenDetails = (item: MediaItem) => {
    navigate(`/details/${item.type}/${item.id}`);
  };

  const handlePlayTrailer = (youtubeId: string, title: string) => {
    playTrailer(youtubeId, title);
  };

  return (
    <div className="w-full pb-20">
      <WatchlistView
        onOpenDetails={handleOpenDetails}
        onPlayTrailer={handlePlayTrailer}
        onExplore={() => navigate('/')}
      />
    </div>
  );
};
