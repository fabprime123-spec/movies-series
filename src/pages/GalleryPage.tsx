import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Image as ImageIcon,
  Layers,
  Sparkles,
  Download,
  Share2,
  ExternalLink,
  Check,
  Film,
  Maximize2,
  Filter,
  Eye,
  Info
} from 'lucide-react';
import { MediaItem, MediaType, MediaImage, GalleryImages } from '../types';
import { fetchMediaDetails, fetchMediaImages } from '../services/tmdb';
import { GalleryGridSkeleton } from '../components/Skeletons';
import { ImageGalleryModal } from '../components/ImageGalleryModal';
import { useTheme } from '../context/ThemeContext';
import { FilmGrainOverlay } from '../components/FilmGrainOverlay';

export const GalleryPage: React.FC = () => {
  const { type = 'movie', id = '' } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const { accentConfig } = useTheme();

  const [loading, setLoading] = useState(true);
  const [mediaTitle, setMediaTitle] = useState('');
  const [mediaYear, setMediaYear] = useState<string | number>('');
  const [mediaBackdrop, setMediaBackdrop] = useState('');
  const [images, setImages] = useState<GalleryImages>({ backdrops: [], posters: [], logos: [] });
  const [activeTab, setActiveTab] = useState<'all' | 'backdrops' | 'posters' | 'logos'>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    let isMounted = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    async function loadGalleryData() {
      setLoading(true);

      try {
        // Fetch real TMDB details & images
        const [details, fetchedGallery] = await Promise.all([
          fetchMediaDetails(id, type as MediaType),
          fetchMediaImages(id, type as MediaType),
        ]);

        if (isMounted) {
          if (details) {
            setMediaTitle(details.title);
            setMediaYear(details.releaseYear);
            setMediaBackdrop(details.backdropUrl);
          }

          let combinedBackdrops = [...fetchedGallery.backdrops];
          let combinedPosters = [...fetchedGallery.posters];
          let combinedLogos = [...(fetchedGallery.logos || [])];

          // If no backdrops, supply high-res fallbacks
          if (combinedBackdrops.length === 0 && details?.backdropUrl) {
            combinedBackdrops.push({
              url: details.backdropUrl,
              type: 'backdrop',
              width: 3840,
              height: 2160,
            });
          }

          if (combinedPosters.length === 0 && details?.posterUrl) {
            combinedPosters.push({
              url: details.posterUrl,
              type: 'poster',
              width: 2000,
              height: 3000,
            });
          }

          setImages({
            backdrops: combinedBackdrops,
            posters: combinedPosters,
            logos: combinedLogos.length > 0 ? combinedLogos : undefined,
          });
        }
      } catch (err) {
        console.warn('Failed to load gallery assets:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadGalleryData();
    return () => {
      isMounted = false;
    };
  }, [id, type]);

  // Combined flat list for Lightbox
  const allImagesList = useMemo<MediaImage[]>(() => {
    const list: MediaImage[] = [];
    images.backdrops.forEach((b) => list.push({ ...b, type: 'backdrop' }));
    images.posters.forEach((p) => list.push({ ...p, type: 'poster' }));
    if (images.logos) {
      images.logos.forEach((l) => list.push({ ...l, type: 'logo' }));
    }
    return list;
  }, [images]);

  // Filtered list based on active tab
  const displayedImages = useMemo<MediaImage[]>(() => {
    if (activeTab === 'backdrops') return images.backdrops;
    if (activeTab === 'posters') return images.posters;
    if (activeTab === 'logos') return images.logos || [];
    return allImagesList;
  }, [activeTab, images, allImagesList]);

  const handleCopyShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-screen pb-24 text-slate-100 selection:bg-orange-500 selection:text-white" id="gallery-page-root">
      
      {/* ---------------- IMMERSIVE HEADER HERO ---------------- */}
      <section className="relative w-full overflow-hidden border-b border-border bg-card">
        {mediaBackdrop && (
          <div className="absolute inset-0 z-0">
            <img
              src={mediaBackdrop}
              alt={mediaTitle}
              className="w-full h-full object-cover object-center scale-105 opacity-25 filter blur-[2px]"
            />
            <FilmGrainOverlay opacity={0.25} />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/80 to-transparent" />
          </div>
        )}

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Top Bar with Back Link and Actions */}
          <div className="flex items-center justify-between gap-4 pb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface hover:bg-surface/80 text-foreground border border-border text-xs font-semibold shadow-sm transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <div className="flex items-center gap-2">
              <Link
                to={`/details/${type}/${id}`}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface hover:bg-surface/80 text-foreground border border-border text-xs font-semibold transition-all"
              >
                <Film className="w-3.5 h-3.5 text-muted" />
                <span>View Full Details</span>
              </Link>

              <button
                onClick={handleCopyShare}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface hover:bg-surface/80 text-foreground border border-border text-xs font-semibold transition-all"
                title="Share Gallery Link"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-muted" />}
                <span>{copiedLink ? 'Link Copied' : 'Share Gallery'}</span>
              </button>
            </div>
          </div>

          {/* Title Header */}
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-[10px] uppercase tracking-wider shadow">
                HD Image Vault
              </span>
              {mediaYear && (
                <span className="text-xs text-muted font-mono font-bold">
                  {mediaYear}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground">
              {mediaTitle ? `${mediaTitle} — Production Gallery` : 'Loading Visual Assets...'}
            </h1>
            <p className="text-xs sm:text-sm text-muted">
              Official high-resolution cinematographic stills, official movie posters, textless key artwork, and visual promotional assets.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- GALLERY CONTENT CONTAINER ---------------- */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        
        {/* Category Tabs & Stats */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-surface border border-border">
            {[
              { id: 'all', label: 'All Photos', count: allImagesList.length },
              { id: 'backdrops', label: 'Backdrops & Stills', count: images.backdrops.length },
              { id: 'posters', label: 'Official Posters', count: images.posters.length },
              ...(images.logos && images.logos.length > 0
                ? [{ id: 'logos', label: 'Logos & Art', count: images.logos.length }]
                : []),
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? `bg-gradient-to-r ${accentConfig.gradient} text-white shadow-md`
                    : 'text-muted hover:text-foreground'
                }`}
              >
                {tab.label} <span className="opacity-75">({tab.count})</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs text-muted">
            <Info className="w-3.5 h-3.5" />
            <span>Click any artwork to open high-res lightbox inspector</span>
          </div>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <GalleryGridSkeleton count={8} />
        ) : displayedImages.length === 0 ? (
          <div className="py-20 text-center space-y-3 rounded-3xl bg-card border border-border">
            <ImageIcon className="w-10 h-10 text-muted mx-auto" />
            <h3 className="text-base font-bold text-foreground">No images found in this category</h3>
            <p className="text-xs text-muted">Try viewing all artwork or check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayedImages.map((img, index) => {
              const isPoster = img.type === 'poster';
              return (
                <motion.div
                  key={`${img.url}-${index}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03, duration: 0.2 }}
                  onClick={() => {
                    const globalIdx = allImagesList.findIndex((item) => item.url === img.url);
                    setLightboxIndex(globalIdx >= 0 ? globalIdx : 0);
                  }}
                  className={`group relative overflow-hidden rounded-2xl border border-border bg-surface cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 ${
                    isPoster
                      ? 'aspect-[2/3]'
                      : 'aspect-[16/9] sm:col-span-1 md:col-span-1 lg:col-span-2'
                  }`}
                >
                  <img
                    src={img.url}
                    alt={`${mediaTitle} visual capture`}
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Dark Vignette Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                    <div className="flex justify-end">
                      <span className="p-2 rounded-xl bg-black/60 text-white backdrop-blur-md shadow-md">
                        <Maximize2 className="w-4 h-4" />
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-white">
                      <span className="capitalize px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold">
                        {img.type || (isPoster ? 'Poster' : 'Backdrop')}
                      </span>
                      {img.width && img.height && (
                        <span className="text-[10px] text-white/80 font-mono">
                          {img.width} × {img.height}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <ImageGalleryModal
          isOpen={lightboxIndex !== null}
          onClose={() => setLightboxIndex(null)}
          images={allImagesList}
          initialIndex={lightboxIndex}
          title={mediaTitle}
        />
      )}
    </div>
  );
};
