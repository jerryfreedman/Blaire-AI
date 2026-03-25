import React, { useState, useEffect } from 'react'
import OrnateButton from './OrnateButton'
import ShareableScoreCard from './ShareableScoreCard'
import RewriteTeaser from './RewriteTeaser'

/**
 * ResultsDisplay — Full audit results screen.
 * BE RICH visual aesthetic: circular score, letter grade,
 * category bars, Blair quote, action items, shareable card.
 */

const SIGN_OFFS = [
  "Now go make it happen, babe.",
  "You've got this — now execute.",
  "That's the game plan. Go build.",
  "Stop overthinking, start posting.",
  "Now go show them what you've got.",
  "The blueprint is right here. Go.",
  "Less planning, more posting. Let's go.",
  "Your next post starts now. Make it count.",
]

function getScoreColor(score) {
  if (score >= 80) return '#c4857a' // mauve
  if (score >= 50) return '#d4a040' // gold/amber
  return '#a04040' // muted red
}

function getGradeColor(grade) {
  const colors = { A: '#c4857a', B: '#d4a098', C: '#d4a040', D: '#c47a4a', F: '#a04040' }
  return colors[grade] || '#c4857a'
}

function CircularScore({ score, size = 160 }) {
  const [animatedScore, setAnimatedScore] = useState(0)
  const strokeWidth = 6
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const color = getScoreColor(score)

  useEffect(() => {
    let frame
    const duration = 1200
    const start = performance.now()

    const animate = (now) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setAnimatedScore(Math.round(eased * score))
      if (progress < 1) {
        frame = requestAnimationFrame(animate)
      }
    }

    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [score])

  const offset = circumference - (animatedScore / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(196, 133, 122, 0.15)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Score arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.1s ease-out' }}
        />
      </svg>
      {/* Score number */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-heading font-bold leading-none"
          style={{ fontSize: size * 0.3, color }}
        >
          {animatedScore}
        </span>
        <span className="text-cream/40 text-xs font-body mt-1">/ 100</span>
      </div>
    </div>
  )
}

function CategoryBar({ name, score, delay = 0 }) {
  const [width, setWidth] = useState(0)
  const percentage = (score / 20) * 100
  const color = score >= 17 ? '#c4857a' : score >= 10 ? '#d4a040' : '#a04040'

  useEffect(() => {
    const timer = setTimeout(() => setWidth(percentage), 100 + delay)
    return () => clearTimeout(timer)
  }, [percentage, delay])

  return (
    <div className="mb-4">
      <div className="flex justify-between items-baseline mb-1.5">
        <span className="text-cream/70 text-sm font-body">{name}</span>
        <span className="text-cream/50 text-xs font-body tabular-nums">{score}/20</span>
      </div>
      <div className="w-full h-1.5 bg-cream/5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${width}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}

export default function ResultsDisplay({ results, onAuditAgain, isPaid, auditType, originalContent, userContext, onUpgrade }) {
  const [showShareCard, setShowShareCard] = useState(false)
  const [copied, setCopied] = useState(false)
  const signOff = SIGN_OFFS[Math.floor(Math.random() * SIGN_OFFS.length)]

  const handleShare = () => {
    const text = [
      `Blair AI Score: ${results.overall_score}/100 (${results.letter_grade})`,
      '',
      'Top 3 Action Items:',
      ...results.action_items.slice(0, 3).map((item, i) => `${i + 1}. ${item}`),
      '',
      'Get your audit at blairai.com'
    ].join('\n')

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => {
      // Fallback for mobile
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

  const categoryEntries = Object.entries(results.category_scores || {})

  return (
    <div className="w-full max-w-xl mx-auto px-4 pb-8">
      {/* Score + Grade Row */}
      <div
        className="flex items-center justify-center gap-5 sm:gap-6 md:gap-10 mb-8 animate-fade-slide-up"
      >
        <CircularScore score={results.overall_score} size={window.innerWidth <= 390 ? 120 : 140} />
        <div className="text-center">
          <span
            className="font-heading font-bold block leading-none"
            style={{
              fontSize: 'clamp(3rem, 10vw, 4.5rem)',
              color: getGradeColor(results.letter_grade)
            }}
          >
            {results.letter_grade}
          </span>
          <span className="text-cream/40 text-[10px] sm:text-xs font-body tracking-wider uppercase mt-1 block">
            Overall Grade
          </span>
        </div>
      </div>

      {/* Category Score Bars */}
      <div
        className="mb-8 animate-fade-slide-up"
        style={{ animationDelay: '0.15s', animationFillMode: 'both' }}
      >
        {categoryEntries.map(([name, score], i) => (
          <CategoryBar key={name} name={name} score={score} delay={i * 100} />
        ))}
      </div>

      {/* Blair's Summary Quote Block */}
      <div
        className="mb-8 border-l-2 border-mauve pl-5 py-2 animate-fade-slide-up"
        style={{ animationDelay: '0.3s', animationFillMode: 'both' }}
      >
        <p className="text-cream/85 font-body italic leading-relaxed text-sm">
          "{results.summary}"
        </p>
        <p className="text-mauve/70 text-xs font-body mt-3 tracking-wide">
          — Blair Richards
        </p>
      </div>

      {/* Action Items */}
      <div
        className="space-y-3 mb-8 animate-fade-slide-up"
        style={{ animationDelay: '0.45s', animationFillMode: 'both' }}
      >
        <h3 className="font-heading text-heading-3 text-cream/90 mb-4">Your Action Plan</h3>
        {results.action_items.map((item, i) => (
          <div
            key={i}
            className="flex gap-4 items-start bg-burgundy-light/20 border border-mauve/10 rounded-lg p-4 animate-fade-slide-up"
            style={{ animationDelay: `${0.5 + i * 0.1}s`, animationFillMode: 'both' }}
          >
            <span className="bg-mauve text-cream text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              {i + 1}
            </span>
            <p className="text-cream/80 text-sm font-body leading-relaxed">{item}</p>
          </div>
        ))}
      </div>

      {/* Rewrite Teaser — between action items and sign-off */}
      {originalContent && (
        <RewriteTeaser
          isPaid={isPaid}
          auditType={auditType}
          originalContent={originalContent}
          auditResult={results}
          userContext={userContext}
          onUpgrade={onUpgrade}
        />
      )}

      {/* Sign-off */}
      <div
        className="text-center mb-10 animate-fade-slide-up"
        style={{ animationDelay: '1s', animationFillMode: 'both' }}
      >
        <p className="font-heading text-xl text-dusty italic font-semibold">
          {signOff}
        </p>
      </div>

      {/* Action Buttons */}
      <div
        className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 animate-fade-slide-up"
        style={{ animationDelay: '1.1s', animationFillMode: 'both' }}
      >
        <OrnateButton onClick={onAuditAgain} variant="filled">
          Audit Again
        </OrnateButton>

        <OrnateButton onClick={handleShare}>
          {copied ? 'Copied!' : 'Share Your Score'}
        </OrnateButton>
      </div>

      {/* Shareable Score Card Toggle */}
      <div
        className="text-center mb-6 animate-fade-slide-up"
        style={{ animationDelay: '1.2s', animationFillMode: 'both' }}
      >
        <button
          onClick={() => setShowShareCard(!showShareCard)}
          className="text-mauve/60 hover:text-mauve text-xs font-body underline underline-offset-4 transition-colors"
        >
          {showShareCard ? 'Hide score card' : 'View shareable score card'}
        </button>
      </div>

      {showShareCard && (
        <div className="animate-fade-slide-up">
          <ShareableScoreCard results={results} />
        </div>
      )}
    </div>
  )
}
