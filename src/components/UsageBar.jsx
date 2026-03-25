import React from 'react'

/**
 * UsageBar — persistent top bar showing usage for free users.
 * Paid users see "Unlocked ✦" in mauve. Includes history link and sign out.
 */
export default function UsageBar({ isPaid, auditCount, askBlairCount, maxFreeAudits = 3, maxFreeQuestions = 5, onSignOut, onHistory }) {
  if (isPaid) {
    return (
      <div className="w-full bg-burgundy-dark/50 border-b border-mauve/10 px-4 py-2 flex items-center justify-between">
        <span className="text-mauve text-xs font-body tracking-wider">
          Unlocked ✦
        </span>
        <div className="flex items-center gap-4">
          {onHistory && (
            <button
              onClick={onHistory}
              className="text-cream/30 hover:text-cream/50 text-xs font-body transition-colors"
            >
              History
            </button>
          )}
          <button
            onClick={onSignOut}
            className="text-cream/30 hover:text-cream/50 text-xs font-body transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    )
  }

  const auditsRemaining = Math.max(0, maxFreeAudits - auditCount)
  const questionsRemaining = Math.max(0, maxFreeQuestions - askBlairCount)

  return (
    <div className="w-full bg-burgundy-dark/50 border-b border-mauve/10 px-3 sm:px-4 py-2 flex items-center justify-between gap-2">
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        <span className="text-cream/40 text-[10px] sm:text-xs font-body whitespace-nowrap">
          {auditsRemaining} audit{auditsRemaining !== 1 ? 's' : ''} left
        </span>
        <span className="text-cream/20 hidden sm:inline">·</span>
        <span className="text-cream/40 text-[10px] sm:text-xs font-body whitespace-nowrap">
          {questionsRemaining} Q's left
        </span>
      </div>
      <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
        {onHistory && (
          <button
            onClick={onHistory}
            className="text-cream/30 hover:text-cream/50 text-[10px] sm:text-xs font-body transition-colors"
          >
            History
          </button>
        )}
        <button
          onClick={onSignOut}
          className="text-cream/30 hover:text-cream/50 text-[10px] sm:text-xs font-body transition-colors"
        >
          Sign out
        </button>
      </div>
    </div>
  )
}
