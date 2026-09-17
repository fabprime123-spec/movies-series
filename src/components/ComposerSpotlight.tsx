import React from 'react';
import { Music, Headphones, Volume2 } from 'lucide-react';
import { CrewMember } from '../types';

interface ComposerSpotlightProps {
  composers?: CrewMember[];
  onPlaySoundtrack?: () => void;
}

export const ComposerSpotlight: React.FC<ComposerSpotlightProps> = ({ composers = [], onPlaySoundtrack }) => {
  if (composers.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 px-4 sm:px-8 lg:px-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-orange-500/20 border border-orange-500/30 text-orange-400">
            <Music className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-bold font-['Outfit',sans-serif] text-white">
                Composer & Sound Department
              </h3>
              <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20">
                Score & Acoustics
              </span>
            </div>
            <p className="text-xs text-white/50">Musical architects, orchestral arrangements, and acoustic score</p>
          </div>
        </div>

        {onPlaySoundtrack && (
          <button
            type="button"
            onClick={onPlaySoundtrack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold text-white/80 transition-all active:scale-95"
          >
            <Headphones className="w-3.5 h-3.5 text-orange-400" />
            <span>Soundtrack</span>
          </button>
        )}
      </div>

      <div className="flex gap-4 overflow-x-auto scrollbar-none py-2">
        {composers.map((comp) => (
          <div
            key={comp.id}
            className="flex items-center gap-3 p-3 rounded-2xl bg-[#141622]/60 border border-white/10 shrink-0 min-w-[220px]"
          >
            <div className="w-12 h-12 rounded-full overflow-hidden bg-white/10 border border-white/20 shrink-0 flex items-center justify-center">
              {comp.profileUrl ? (
                <img
                  src={comp.profileUrl}
                  alt={comp.name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Music className="w-5 h-5 text-orange-400" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{comp.name}</p>
              <p className="text-xs text-orange-400 flex items-center gap-1">
                <Volume2 className="w-3 h-3" />
                <span>{comp.role || 'Original Score Composer'}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
