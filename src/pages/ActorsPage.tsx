import React from 'react';
import { ActorsView } from '../components/ActorsView';
import { useNavigate } from 'react-router-dom';
import { MediaItem } from '../types';

export const ActorsPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSelectMedia = (item: MediaItem) => {
    navigate(`/details/${item.type}/${item.id}`);
  };

  return (
    <div className="w-full pb-20">
      <ActorsView onSelectMedia={handleSelectMedia} />
    </div>
  );
};
