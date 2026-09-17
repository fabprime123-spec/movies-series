import React from 'react';

/**
 * Modern Sleek Skeletons with Shimmer Animation & Accent Highlight
 */

export const MediaCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col rounded-2xl bg-card border border-border overflow-hidden animate-pulse">
      {/* Poster Aspect Ratio 2/3 */}
      <div className="relative aspect-[2/3] w-full bg-surface">
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
        <div className="absolute top-2 left-2 w-12 h-4 rounded bg-border" />
        <div className="absolute top-2 right-2 w-10 h-4 rounded bg-border" />
      </div>

      {/* Metadata Bottom */}
      <div className="p-3.5 space-y-2.5">
        <div className="h-4 w-3/4 rounded-md bg-border" />
        <div className="flex items-center justify-between">
          <div className="h-3 w-10 rounded bg-surface" />
          <div className="h-3 w-12 rounded bg-surface" />
        </div>
      </div>
    </div>
  );
};

export const MediaGridSkeleton: React.FC<{ count?: number; cols?: string }> = ({
  count = 12,
  cols = 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6',
}) => {
  return (
    <div className={cols}>
      {Array.from({ length: count }).map((_, idx) => (
        <MediaCardSkeleton key={idx} />
      ))}
    </div>
  );
};

export const MediaSliderSkeleton: React.FC<{ count?: number }> = ({ count = 7 }) => {
  return (
    <div className="flex gap-4 sm:gap-5 overflow-x-auto scrollbar-none py-3 px-4 sm:px-8 lg:px-12 animate-pulse">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="w-[140px] sm:w-[170px] md:w-[195px] shrink-0 flex flex-col rounded-2xl bg-card border border-border overflow-hidden"
        >
          <div className="aspect-[2/3] w-full bg-surface" />
          <div className="p-3 space-y-2">
            <div className="h-4 w-3/4 rounded bg-border" />
            <div className="h-3 w-1/2 rounded bg-surface" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const CircularCastSliderSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-none py-4 px-4 sm:px-8 lg:px-12 animate-pulse">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="w-24 sm:w-28 shrink-0 flex flex-col items-center text-center">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-surface border-2 border-border mb-2.5" />
          <div className="h-3.5 w-20 rounded bg-border mb-1" />
          <div className="h-2.5 w-16 rounded bg-surface" />
        </div>
      ))}
    </div>
  );
};

export const TrailersSliderSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <div className="flex gap-4 sm:gap-5 overflow-x-auto scrollbar-none py-2 px-4 sm:px-8 lg:px-12 animate-pulse">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="w-[260px] sm:w-[310px] shrink-0 flex flex-col">
          <div className="aspect-video w-full rounded-2xl bg-surface border border-border" />
          <div className="h-4 w-3/4 rounded bg-border mt-2.5 mb-1" />
          <div className="h-3 w-1/3 rounded bg-surface" />
        </div>
      ))}
    </div>
  );
};

export const BackdropsSliderSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-rows-2 grid-flow-col gap-4 overflow-x-auto scrollbar-none py-2 px-4 sm:px-8 lg:px-12 animate-pulse">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="w-[260px] sm:w-[320px] aspect-video rounded-2xl bg-surface border border-border shrink-0" />
      ))}
    </div>
  );
};

export const SoundtrackSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 animate-pulse px-4 sm:px-8 lg:px-12">
      <div className="h-20 w-full rounded-2xl bg-card border border-border" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="h-16 rounded-xl bg-surface border border-border" />
        ))}
      </div>
    </div>
  );
};

export const HeroBannerSkeleton: React.FC = () => {
  return (
    <div className="relative w-full h-[65vh] min-h-[500px] max-h-[750px] bg-card overflow-hidden animate-pulse">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />

      {/* Content Skeleton */}
      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-12 lg:p-16 max-w-4xl space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-5 w-24 rounded-full bg-border" />
          <div className="h-5 w-16 rounded-full bg-surface" />
        </div>

        <div className="h-10 sm:h-14 w-3/4 rounded-xl bg-border" />

        <div className="flex items-center gap-3">
          <div className="h-4 w-12 rounded bg-surface" />
          <div className="h-4 w-16 rounded bg-surface" />
          <div className="h-4 w-28 rounded bg-surface" />
        </div>

        <div className="space-y-2 max-w-xl">
          <div className="h-3.5 w-full rounded bg-surface" />
          <div className="h-3.5 w-5/6 rounded bg-surface" />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <div className="h-11 w-32 rounded-xl bg-border" />
          <div className="h-11 w-36 rounded-xl bg-surface" />
        </div>
      </div>
    </div>
  );
};

export const MediaDetailsSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground animate-pulse">
      {/* Hero Backdrop */}
      <div className="relative h-[55vh] min-h-[420px] bg-card w-full">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-44 relative z-10 space-y-12 pb-24">
        {/* Main Details Info Box */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Poster Skeleton */}
          <div className="w-56 sm:w-64 aspect-[2/3] rounded-2xl bg-surface border border-border shrink-0 shadow-2xl" />

          {/* Details Column */}
          <div className="flex-1 space-y-4 w-full">
            <div className="flex items-center gap-2">
              <div className="h-6 w-20 rounded-md bg-border" />
              <div className="h-6 w-16 rounded-md bg-surface" />
            </div>

            <div className="h-10 sm:h-12 w-2/3 rounded-xl bg-border" />
            <div className="h-4 w-1/3 rounded-md bg-surface" />

            {/* Ratings & Metadata Chips */}
            <div className="flex flex-wrap gap-2 pt-2">
              <div className="h-8 w-24 rounded-xl bg-surface border border-border" />
              <div className="h-8 w-20 rounded-xl bg-surface border border-border" />
              <div className="h-8 w-24 rounded-xl bg-surface border border-border" />
              <div className="h-8 w-28 rounded-xl bg-surface border border-border" />
            </div>

            {/* Synopsis Paragraph */}
            <div className="space-y-2 pt-4">
              <div className="h-4 w-full rounded bg-surface" />
              <div className="h-4 w-11/12 rounded bg-surface" />
              <div className="h-4 w-4/5 rounded bg-surface" />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <div className="h-12 w-36 rounded-xl bg-border" />
              <div className="h-12 w-36 rounded-xl bg-surface border border-border" />
              <div className="h-12 w-12 rounded-xl bg-surface border border-border" />
            </div>
          </div>
        </div>

        {/* Cast Avatars Row Skeleton */}
        <div className="space-y-4">
          <div className="h-6 w-40 rounded-lg bg-border" />
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="flex flex-col items-center text-center space-y-2 p-2 rounded-xl bg-card border border-border">
                <div className="w-16 h-16 rounded-full bg-surface" />
                <div className="h-3 w-16 rounded bg-surface" />
                <div className="h-2.5 w-12 rounded bg-surface/60" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ActorCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col rounded-2xl bg-card border border-border overflow-hidden animate-pulse">
      <div className="relative aspect-[3/4] w-full bg-surface" />
      <div className="p-3.5 space-y-2">
        <div className="h-4 w-3/4 rounded bg-border" />
        <div className="h-3 w-1/2 rounded bg-surface" />
      </div>
    </div>
  );
};

export const GalleryGridSkeleton: React.FC<{ count?: number }> = ({ count = 12 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-pulse">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="aspect-video w-full rounded-2xl bg-card border border-border overflow-hidden"
        >
          <div className="w-full h-full bg-surface" />
        </div>
      ))}
    </div>
  );
};

export const UpcomingHeroSkeleton: React.FC = () => {
  return (
    <div className="relative w-full overflow-hidden bg-slate-950 border-b border-white/10 animate-pulse py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between pb-6 border-b border-white/10">
          <div className="h-6 w-48 rounded-full bg-white/10" />
          <div className="h-6 w-32 rounded-lg bg-white/10" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center gap-2">
              <div className="h-5 w-24 rounded bg-white/15" />
              <div className="h-5 w-32 rounded bg-white/10" />
            </div>
            <div className="h-12 sm:h-16 w-3/4 rounded-2xl bg-white/15" />
            <div className="h-32 w-full rounded-3xl bg-white/10 border border-white/10" />
            <div className="space-y-2">
              <div className="h-4 w-full rounded bg-white/10" />
              <div className="h-4 w-5/6 rounded bg-white/10" />
            </div>
            <div className="flex gap-3 pt-2">
              <div className="h-12 w-44 rounded-2xl bg-white/15" />
              <div className="h-12 w-36 rounded-2xl bg-white/10" />
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-center">
            <div className="w-full max-w-[280px] sm:max-w-[320px] aspect-[2/3] rounded-3xl bg-white/10 border border-white/15" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const UpcomingGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="flex flex-col rounded-3xl border border-white/10 bg-slate-900/70 overflow-hidden"
        >
          <div className="aspect-[16/9] w-full bg-white/10" />
          <div className="p-5 space-y-3">
            <div className="h-5 w-2/3 rounded-md bg-white/15" />
            <div className="space-y-1.5">
              <div className="h-3.5 w-full rounded bg-white/10" />
              <div className="h-3.5 w-4/5 rounded bg-white/10" />
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-white/10">
              <div className="h-8 w-24 rounded-xl bg-white/10" />
              <div className="h-8 w-24 rounded-xl bg-white/10" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

