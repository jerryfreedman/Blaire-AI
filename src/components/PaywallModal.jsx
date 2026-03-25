import React from 'react'
import OrnateButton from './OrnateButton'

/**
 * PaywallModal — shown when free user hits 3 audit limit.
 * Blair's voice copy. BE RICH aesthetic.
 */
export default function PaywallModal({ type = 'audit', onUpgrade, onClose }) {
  const isAudit = type === 'audit'

  return (
    <div className="fixed inset-0 z-50 bg-burgundy/95 flex items-center justify-center px-4 sm:px-6 overflow-y-auto">
      <div className="w-full max-w-md animate-fade-slide-up my-auto py-6">
        <div className="bg-burgundy-light/40 border border-mauve/20 rounded-xl p-6 sm:p-8 md:p-10 backdrop-blur-sm text-center">
          {/* Icon */}
          <div className="mb-6">
            <span className="text-mauve text-4xl">✦</span>
          </div>

          {/* Blair's copy */}
          <h2 className="font-heading text-heading-2 text-cream mb-4">
            {isAudit
              ? "You've used your 3 free audits."
              : "You've used your 5 free questions."
            }
          </h2>
          <p className="text-cream/70 font-body text-sm leading-relaxed mb-8">
            {isAudit
              ? "You're clearly not messing around — I love that. Let's keep going. Upgrade to get unlimited audits, unlimited Ask Blair questions, and my full feedback on every piece of content you create."
              : "I can tell you're serious about your content — that's exactly the energy I love. Upgrade to keep the conversation going with unlimited questions and full audits."
            }
          </p>

          {/* Upgrade button */}
          <div className="mb-4">
            <OrnateButton onClick={onUpgrade} variant="filled">
              Upgrade — $19/month
            </OrnateButton>
          </div>

          {/* Close / not now */}
          <button
            onClick={onClose}
            className="text-cream/30 hover:text-cream/50 text-xs font-body transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  )
}
