import React from 'react'

/**
 * ShareableScoreCard — styled CSS card designed to be screenshotted.
 * Shows score, grade, one action item, Blair AI branding.
 */
export default function ShareableScoreCard({ results }) {
  const scoreColor = results.overall_score >= 80
    ? '#c4857a'
    : results.overall_score >= 50
    ? '#d4a040'
    : '#a04040'

  return (
    <div className="mx-auto max-w-sm">
      {/* The card itself */}
      <div
        className="rounded-xl overflow-hidden border border-mauve/20"
        style={{
          background: 'linear-gradient(165deg, #2a0008 0%, #1a0005 50%, #2a0008 100%)',
          padding: '2rem 1.5rem',
        }}
      >
        {/* Blair AI branding */}
        <div className="text-center mb-6">
          <h2 className="font-heading text-2xl text-cream tracking-wide">Blair AI</h2>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="block w-8 h-px bg-mauve/40"></span>
            <span className="text-mauve/50 text-[10px] tracking-[0.2em] uppercase font-body">
              Content Audit
            </span>
            <span className="block w-8 h-px bg-mauve/40"></span>
          </div>
        </div>

        {/* Score + Grade */}
        <div className="flex items-center justify-center gap-6 mb-6">
          {/* Score circle */}
          <div
            className="relative w-24 h-24 rounded-full flex items-center justify-center"
            style={{ border: `3px solid ${scoreColor}` }}
          >
            <div className="text-center">
              <span
                className="font-heading font-bold text-3xl leading-none"
                style={{ color: scoreColor }}
              >
                {results.overall_score}
              </span>
              <span className="block text-cream/30 text-[10px] font-body">/100</span>
            </div>
          </div>

          {/* Grade */}
          <span
            className="font-heading font-bold text-6xl leading-none"
            style={{ color: scoreColor }}
          >
            {results.letter_grade}
          </span>
        </div>

        {/* Top action item */}
        {results.action_items[0] && (
          <div className="bg-cream/5 rounded-lg p-4 mb-6 border border-mauve/10">
            <p className="text-cream/50 text-[10px] font-body uppercase tracking-wider mb-2">
              Top Priority
            </p>
            <p className="text-cream/80 text-xs font-body leading-relaxed">
              {results.action_items[0]}
            </p>
          </div>
        )}

        {/* Branding footer */}
        <div className="text-center">
          <p className="text-mauve/40 text-[10px] font-body tracking-wider">
            blairai.com · Built on Blair Richards' framework
          </p>
        </div>
      </div>

      {/* Share prompt */}
      <p className="text-center text-cream/30 text-xs font-body mt-4 italic">
        Screenshot this card and share to your stories
      </p>
    </div>
  )
}
