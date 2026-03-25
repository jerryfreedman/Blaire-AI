import React, { useState } from 'react'
import { generateRewrite } from '../api/rewrite'
import OrnateButton from './OrnateButton'

/**
 * RewriteTeaser — shown on the results page after an audit.
 *
 * Free users: see a blurred/locked preview teasing the rewrite feature.
 * Paid users: see a "Generate Rewrite" button that calls the rewrite API.
 */
export default function RewriteTeaser({
  isPaid,
  auditType,
  originalContent,
  auditResult,
  userContext,
  onUpgrade,
}) {
  const [rewrite, setRewrite] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Find the weakest category for display
  const scores = auditResult?.category_scores || {}
  let weakestCategory = ''
  let lowestScore = 21
  for (const [cat, score] of Object.entries(scores)) {
    if (score < lowestScore) {
      lowestScore = score
      weakestCategory = cat
    }
  }

  const handleGenerate = async () => {
    if (!originalContent) return
    setLoading(true)
    setError(null)

    try {
      const result = await generateRewrite(auditType, originalContent, auditResult, userContext)
      setRewrite(result)
    } catch (err) {
      console.error('Rewrite error:', err)
      setError(err.message || 'Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  // Free user — locked teaser
  if (!isPaid) {
    return (
      <div
        className="relative mt-8 rounded-xl border border-mauve/15 overflow-hidden animate-fade-slide-up"
        style={{ animationDelay: '1.15s', animationFillMode: 'both' }}
      >
        {/* Blurred fake content behind the lock */}
        <div className="p-5 sm:p-6 blur-[6px] select-none pointer-events-none" aria-hidden="true">
          <div className="text-cream/60 text-sm font-body leading-relaxed space-y-2">
            <p>Here's how I'd rewrite this for you — your {weakestCategory || 'weakest area'} needs the most work so I focused there...</p>
            <p className="bg-cream/5 rounded-lg p-3 text-cream/50 text-sm italic">
              "Your rewritten content would appear here with Blair's exact suggestions woven in, making it scroll-stopping and on-brand for your niche..."
            </p>
          </div>
        </div>

        {/* Lock overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-burgundy/80 backdrop-blur-sm px-6">
          {/* Lock icon */}
          <div className="w-10 h-10 rounded-full bg-mauve/15 flex items-center justify-center mb-3">
            <svg className="w-5 h-5 text-mauve" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>

          <p className="font-heading text-cream text-lg sm:text-xl text-center mb-1">
            Blair rewrote your content
          </p>
          <p className="text-cream/50 text-xs sm:text-sm font-body text-center max-w-xs mb-5 leading-relaxed">
            She focused on your weakest area — {weakestCategory || 'the area that needs the most work'}. Upgrade to see exactly how she'd fix it.
          </p>

          <OrnateButton onClick={onUpgrade} variant="filled">
            Unlock Rewrites — $19/mo
          </OrnateButton>
        </div>
      </div>
    )
  }

  // Paid user — rewrite already generated
  if (rewrite) {
    return (
      <div
        className="mt-8 rounded-xl border border-mauve/15 overflow-hidden animate-fade-slide-up"
        style={{ animationDelay: '1.15s', animationFillMode: 'both' }}
      >
        <div className="px-5 sm:px-6 pt-5 pb-2">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-4 h-4 text-mauve" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
            <h3 className="font-heading text-cream text-lg">Blair's Rewrite</h3>
          </div>
          <p className="text-mauve/60 text-xs font-body mb-4">
            Focused on: {rewrite.focus_area || weakestCategory}
          </p>
        </div>

        {/* Rewritten content */}
        <div className="mx-5 sm:mx-6 mb-4 bg-cream/5 rounded-lg p-4 border border-mauve/10">
          <p className="text-cream/90 text-sm font-body leading-relaxed whitespace-pre-wrap">
            {rewrite.rewritten_content}
          </p>
        </div>

        {/* Blair's explanation */}
        <div className="mx-5 sm:mx-6 mb-5 border-l-2 border-mauve/30 pl-4 py-1">
          <p className="text-cream/60 text-sm font-body italic leading-relaxed">
            {rewrite.explanation}
          </p>
          <p className="text-mauve/50 text-xs font-body mt-2">— Blair Richards</p>
        </div>

        {/* Copy rewrite button */}
        <div className="px-5 sm:px-6 pb-5">
          <CopyRewriteButton text={rewrite.rewritten_content} />
        </div>
      </div>
    )
  }

  // Paid user — not yet generated
  return (
    <div
      className="mt-8 rounded-xl border border-mauve/15 bg-burgundy-light/10 overflow-hidden animate-fade-slide-up"
      style={{ animationDelay: '1.15s', animationFillMode: 'both' }}
    >
      <div className="p-5 sm:p-6 text-center">
        <div className="w-10 h-10 rounded-full bg-mauve/10 flex items-center justify-center mx-auto mb-3">
          <svg className="w-5 h-5 text-mauve" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
          </svg>
        </div>

        <p className="font-heading text-cream text-lg mb-1">
          Want Blair to rewrite this for you?
        </p>
        <p className="text-cream/50 text-xs sm:text-sm font-body max-w-xs mx-auto mb-5 leading-relaxed">
          She'll focus on your weakest area — {weakestCategory || 'the part that needs the most help'} — and give you a ready-to-post version.
        </p>

        {error && (
          <p className="text-red-400/80 text-xs font-body mb-3">{error}</p>
        )}

        <OrnateButton onClick={handleGenerate} variant="filled" disabled={loading}>
          {loading ? 'Blair AI is rewriting...' : 'Generate Rewrite'}
        </OrnateButton>
      </div>
    </div>
  )
}


/**
 * CopyRewriteButton — small inline copy button for the rewritten content
 */
function CopyRewriteButton({ text }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => {
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 text-mauve/60 hover:text-mauve text-xs font-body transition-colors"
    >
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
      </svg>
      {copied ? 'Copied!' : 'Copy rewrite'}
    </button>
  )
}
