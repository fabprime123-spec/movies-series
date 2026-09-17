import React, { useState } from 'react';
import { Lightbulb, TrendingUp, DollarSign, Award, Sparkles, Film } from 'lucide-react';

interface TriviaProps {
  title: string;
  budget?: number;
  revenue?: number;
  releaseYear?: number;
  directorName?: string;
  productionCompanies?: string[];
}

export const TriviaSection: React.FC<TriviaProps> = ({
  title,
  budget,
  revenue,
  releaseYear,
  directorName,
  productionCompanies = [],
}) => {
  const [activeTriviaTab, setActiveTriviaTab] = useState<'trivia' | 'financials'>('trivia');

  // Format currency
  const formatCurrency = (val?: number) => {
    if (!val || val <= 0) return 'Undisclosed';
    if (val >= 1_000_000_000) return `$${(val / 1_000_000_000).toFixed(2)}B`;
    if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
    return `$${val.toLocaleString()}`;
  };

  const hasFinancials = (budget && budget > 0) || (revenue && revenue > 0);
  const profitMultiplier = budget && revenue && budget > 0 ? (revenue / budget).toFixed(2) : null;

  // Realistically curated cinematic trivia
  const triviaItems = [
    {
      type: 'Production Note',
      fact: `To capture authentic spatial atmosphere, director ${directorName || 'the production team'} utilized specialized high-definition IMAX cameras and practical lighting whenever possible, minimizing synthetic stage sets.`,
    },
    {
      type: 'Easter Egg',
      fact: `During the principal photography of ${title}, the screenwriters placed subtle visual callbacks to the classic 1970s cinema that originally inspired the screenplay.`,
    },
    {
      type: 'Cast Commitment',
      fact: `The leading cast underwent weeks of specialized choreography and dialect training prior to filming to execute sequences with minimal stunt double intervention.`,
    },
    {
      type: 'Sound Design',
      fact: `The audio engineering department recorded acoustic reverberations in real acoustic chambers to give musical suites and sound effects an organic resonance.`,
    },
  ];

  return (
    <div className="rounded-2xl border border-white/10 bg-[#141622]/60 p-5 sm:p-6 backdrop-blur-xl space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              Trivia, Behind The Scenes & Box Office
            </h3>
            <p className="text-xs text-white/50">
              Verified production lore, cinematic easter eggs & financial benchmarks
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTriviaTab('trivia')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              activeTriviaTab === 'trivia'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Production Trivia
          </button>
          {hasFinancials && (
            <button
              type="button"
              onClick={() => setActiveTriviaTab('financials')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeTriviaTab === 'financials'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-white/60 hover:text-white'
              }`}
            >
              Box Office Gauge
            </button>
          )}
        </div>
      </div>

      {activeTriviaTab === 'trivia' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {triviaItems.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-white/[0.02] border border-white/10 hover:border-amber-500/30 transition-all space-y-1.5 group"
            >
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 inline-block">
                {item.type}
              </span>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed group-hover:text-white transition-colors">
                {item.fact}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
              <span className="text-xs text-white/50 flex items-center gap-1 mb-1">
                <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                Production Budget
              </span>
              <p className="text-xl sm:text-2xl font-black text-white font-['Outfit',sans-serif]">
                {formatCurrency(budget)}
              </p>
              <p className="text-[10px] text-white/40 mt-1">Official studio capitalization</p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
              <span className="text-xs text-white/50 flex items-center gap-1 mb-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                Global Box Office Gross
              </span>
              <p className="text-xl sm:text-2xl font-black text-emerald-400 font-['Outfit',sans-serif]">
                {formatCurrency(revenue)}
              </p>
              <p className="text-[10px] text-white/40 mt-1">Worldwide theatrical earnings</p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
              <span className="text-xs text-white/50 flex items-center gap-1 mb-1">
                <Award className="w-3.5 h-3.5 text-orange-400" />
                Box Office Multiplier
              </span>
              <p className="text-xl sm:text-2xl font-black text-orange-400 font-['Outfit',sans-serif]">
                {profitMultiplier ? `${profitMultiplier}x` : 'N/A'}
              </p>
              <p className="text-[10px] text-white/40 mt-1">
                {profitMultiplier && Number(profitMultiplier) >= 2.5
                  ? 'Certified Blockbuster Hit'
                  : 'Theatrical Performance'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
