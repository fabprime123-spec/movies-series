import React, { useEffect, useState } from 'react';
import { useSoundtrack, SoundtrackAlbum } from '../context/SoundtrackContext';
import { useTheme } from '../context/ThemeContext';
import { SoundtrackSkeleton } from './Skeletons';
import { 
  Music, 
  Disc, 
  Play, 
  Pause, 
  Maximize2, 
  Radio, 
  ExternalLink,
  Headphones
} from 'lucide-react';

interface SoundtrackSectionProps {
  title: string;
  composer?: string;
  year?: number;
}

export const SoundtrackSection: React.FC<SoundtrackSectionProps> = ({ title, composer, year }) => {
  const { accentConfig } = useTheme();
  const [album, setAlbum] = useState<SoundtrackAlbum | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { currentTrack, isPlaying, playAlbum, playTrack, togglePlay, openModal } = useSoundtrack();

  useEffect(() => {
    let isMounted = true;
    async function loadSoundtrack() {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/soundtrack/${encodeURIComponent(title)}?composer=${encodeURIComponent(composer || '')}&year=${year || ''}`
        );
        if (res.ok) {
          const contentType = res.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            const data = await res.json();
            if (isMounted) setAlbum(data.album || data);
          }
        }
      } catch (err) {
        console.warn('Could not load soundtrack:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadSoundtrack();
    return () => {
      isMounted = false;
    };
  }, [title, composer, year]);

  if (loading) {
    return <SoundtrackSkeleton />;
  }

  if (!album || album.tracks.length === 0) {
    return null;
  }

  return (
    <div id="section-soundtrack" className="scroll-mt-28 space-y-6">
      {/* Header Container with padding */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 sm:px-8 lg:px-12">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-accent/20 border border-accent/30 text-accent shrink-0">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl sm:text-2xl font-bold font-['Outfit',sans-serif] text-white">
                Original Soundtrack (OST) & Score
              </h3>
              <span className="text-[10px] font-bold text-accent uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-accent/10 border border-accent/20 hidden sm:inline">
                Spatial Audio
              </span>
            </div>
            <p className="text-xs text-white/50">
              Composed by <span className="font-semibold text-white/90">{album.composer}</span> • {album.tracksCount} Movements ({album.totalDuration})
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => playAlbum(album, 0)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r ${accentConfig.gradient} hover:opacity-90 text-white text-xs font-bold shadow-lg shadow-accent/20 active:scale-95 transition-all`}
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Play Album</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playAlbum(album, 0);
              openModal();
            }}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 text-xs font-semibold transition-all active:scale-95"
            title="Open Full Soundtrack Modal"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Theater View</span>
          </button>

          <a
            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(album.playlistYoutubeQuery)}`}
            target="_blank"
            rel="noreferrer"
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 transition-all"
            title="Open YouTube Soundtrack Playlist"
          >
            <ExternalLink className="w-4 h-4 text-accent" />
          </a>
        </div>
      </div>

      {/* Edge-to-edge Track Slider / Grid */}
      <div className="px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {album.tracks.map((track, idx) => {
            const isThisTrackActive = currentTrack?.id === track.id;
            return (
              <div
                key={track.id}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-200 group ${
                  isThisTrackActive
                    ? 'bg-accent/15 border-accent/40 shadow-lg shadow-accent/10'
                    : 'bg-[#141622]/60 hover:bg-[#191c2b]/80 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <span className={`w-5 text-xs font-mono font-bold ${isThisTrackActive ? 'text-accent' : 'text-white/40'}`}>
                    {String(track.trackNumber).padStart(2, '0')}
                  </span>
                  
                  <div className="min-w-0">
                    <p className={`text-xs sm:text-sm font-semibold truncate transition-colors ${
                      isThisTrackActive ? 'text-accent' : 'text-white group-hover:text-accent'
                    }`}>
                      {track.title}
                    </p>
                    <p className="text-[11px] text-white/40 truncate">
                      {track.composer}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <span className="text-xs font-mono text-white/40">{track.duration}</span>
                  <button
                    type="button"
                    onClick={() => {
                      if (isThisTrackActive) {
                        togglePlay();
                      } else {
                        playTrack(album, idx);
                      }
                    }}
                    className={`p-2 rounded-xl transition-all active:scale-90 ${
                      isThisTrackActive
                        ? 'bg-accent text-white shadow-md shadow-accent/30'
                        : 'bg-white/5 text-white/70 group-hover:bg-accent group-hover:text-white'
                    }`}
                    title={isThisTrackActive && isPlaying ? 'Pause' : 'Play Track'}
                  >
                    {isThisTrackActive && isPlaying ? (
                      <Pause className="w-3.5 h-3.5 fill-current" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
