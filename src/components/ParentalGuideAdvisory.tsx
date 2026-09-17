import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';

interface AdvisoryCategory {
  category: string;
  level: 'None' | 'Mild' | 'Moderate' | 'Severe';
  summary: string;
}

interface ParentalGuideProps {
  ageRating: string;
  genres: string[];
  title: string;
}

export const ParentalGuideAdvisory: React.FC<ParentalGuideProps> = ({ ageRating, genres, title }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Generate realistic IMDb-standard advisory levels based on Age Rating & Genres
  const getAdvisories = (): AdvisoryCategory[] => {
    const isR = ageRating === 'R' || ageRating === 'TV-MA' || ageRating === 'NC-17';
    const isPG13 = ageRating === 'PG-13' || ageRating === 'TV-14';
    const isAction = genres.some((g) => ['Action', 'Thriller', 'War', 'Crime'].includes(g));
    const isHorror = genres.some((g) => ['Horror', 'Mystery'].includes(g));
    const isRomance = genres.some((g) => ['Romance', 'Drama'].includes(g));

    return [
      {
        category: 'Sex & Nudity',
        level: isR ? 'Moderate' : isPG13 ? 'Mild' : 'None',
        summary: isR
          ? 'Sensual references, passionate kissing sequences, and brief natural nudity.'
          : isPG13
          ? 'Mild suggestive dialogue, brief innuendo, and romantic embraces.'
          : 'No sexual content or nudity depicted.',
      },
      {
        category: 'Violence & Gore',
        level: isR || (isAction && isPG13) ? (isR ? 'Severe' : 'Moderate') : isAction ? 'Moderate' : 'Mild',
        summary: isR
          ? 'Intense combat sequences, cinematic gun battles, explosions, and realistic injury depictions.'
          : isAction
          ? 'Stylized hand-to-hand martial arts combat, vehicle collisions, and fantasy skirmishes.'
          : 'Mild physical peril and comedic slapstick.',
      },
      {
        category: 'Profanity & Language',
        level: isR ? 'Severe' : isPG13 ? 'Moderate' : 'Mild',
        summary: isR
          ? 'Frequent coarse language, strong expletives, and heated verbal altercations.'
          : isPG13
          ? 'Occasional moderate expletives and derogatory remarks.'
          : 'Infrequent mild insults and clean cinematic dialogue.',
      },
      {
        category: 'Alcohol, Drugs & Smoking',
        level: isR ? 'Moderate' : isPG13 ? 'Mild' : 'None',
        summary: isR
          ? 'Depictions of social drinking in nightlife settings, celebratory toasts, and cigar smoking.'
          : 'Incidental background beverage consumption with no glamorized substance use.',
      },
      {
        category: 'Frightening & Intense Scenes',
        level: isHorror ? 'Severe' : isR || isAction ? 'Moderate' : isPG13 ? 'Mild' : 'None',
        summary: isHorror
          ? 'Jump scares, claustrophobic psychological tension, and prolonged suspenseful encounters.'
          : isAction
          ? 'High-stakes suspense, ticking-clock countdowns, and perilous near-death escapes.'
          : 'Emotionally resonant moments and light narrative drama.',
      },
    ];
  };

  const advisories = getAdvisories();

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'Severe':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'Moderate':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'Mild':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#141622]/60 p-5 sm:p-6 backdrop-blur-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-orange-500/20 border border-orange-500/30 text-orange-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-white">
                Parents Guide & Content Advisory
              </h3>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                IMDb Standards
              </span>
            </div>
            <p className="text-xs text-white/50">
              Official classification: <span className="font-bold text-white">{ageRating || 'PG-13'}</span> • Suitable for informed audience viewing
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold text-white/80 transition-all"
        >
          <span>{isExpanded ? 'Hide Details' : 'View Full Guide'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
        {advisories.map((adv) => (
          <div
            key={adv.category}
            className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col justify-between space-y-2 hover:border-white/20 transition-colors"
          >
            <span className="text-xs font-semibold text-white/80">{adv.category}</span>
            <div className="flex items-center justify-between">
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getLevelBadge(
                  adv.level
                )}`}
              >
                {adv.level}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
          {advisories.map((adv) => (
            <div key={adv.category} className="p-3.5 rounded-xl bg-black/40 border border-white/10">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white">{adv.category}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getLevelBadge(adv.level)}`}>
                  {adv.level}
                </span>
              </div>
              <p className="text-xs text-white/60 leading-relaxed">{adv.summary}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
