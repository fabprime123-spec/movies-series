import React from 'react';
import { Flame, Heart, Film, Tv, Globe, ShieldCheck, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-white/10 bg-black/40 backdrop-blur-xl mt-16 text-white/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand info */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-md shadow-indigo-500/20">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#0c0d12]">
                <Flame className="h-4 w-4 text-indigo-400 fill-indigo-400/30" />
              </div>
            </div>
            <div>
              <p className="font-['Outfit',sans-serif] text-sm font-bold text-white">
                Movie<span className="text-indigo-400">Ace</span>
              </p>
              <p className="text-[11px] text-white/40">Global Cinema & Series Discovery</p>
            </div>
          </div>

          {/* Highlights & Features */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1 text-white/70">
              <Globe className="h-3.5 w-3.5 text-indigo-400" />
              35+ Global Audio & Subtitle Tracks
            </span>
            <span className="flex items-center gap-1 text-white/70">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              Firebase Cloud Watchlist Sync
            </span>
            <span className="flex items-center gap-1 text-white/70">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              Cast, Crew & Episode Breakdown
            </span>
          </div>

          {/* Copyright */}
          <div className="text-xs text-white/40 text-center md:text-right">
            <span>Powered by MovieAce Pro & TMDB Data</span>
            <p className="text-[10px] text-white/30 mt-0.5">Designed with Immersive Glass System</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
