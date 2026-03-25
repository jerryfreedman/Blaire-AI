import React, { useState } from 'react'
import OrnateButton from './OrnateButton'

const NICHE_OPTIONS = [
  'Business & Money',
  'Beauty & Lifestyle',
  'Fitness & Wellness',
  'Food & Travel',
  'Fashion & Style',
  'Other',
]

const GOAL_OPTIONS = [
  'Grow my following',
  'Launch a digital product',
  'Build my brand presence',
]

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(1)
  const [niche, setNiche] = useState('')
  const [audience, setAudience] = useState('')
  const [goal, setGoal] = useState('')
  const [customNiche, setCustomNiche] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleNext = () => {
    if (step === 1 && !niche) return
    if (step === 2 && !audience.trim()) return
    if (step < 3) {
      setStep(step + 1)
    }
  }

  const handleComplete = async () => {
    if (!goal) return
    setIsSubmitting(true)
    const finalNiche = niche === 'Other' ? (customNiche.trim() || 'Other') : niche
    await onComplete({
      niche: finalNiche,
      audience: audience.trim(),
      goal,
    })
    setIsSubmitting(false)
  }

  return (
    <div className="fixed inset-0 z-40 bg-burgundy flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-fade-slide-up">
        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-8 px-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1 h-1 rounded-full overflow-hidden bg-cream/10">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: s <= step ? '100%' : '0%',
                  backgroundColor: '#c4857a',
                }}
              />
            </div>
          ))}
        </div>

        <div className="bg-burgundy-light/40 border border-mauve/20 rounded-xl p-8 md:p-10 backdrop-blur-sm">
          {/* Step 1: Niche */}
          {step === 1 && (
            <div className="animate-fade-slide-up" key="step1">
              <h2 className="font-heading text-heading-2 text-cream mb-2 text-center">
                What's your niche?
              </h2>
              <p className="text-cream/50 text-sm font-body text-center mb-8">
                This helps Blair tailor her feedback to your specific space.
              </p>
              <div className="space-y-3">
                {NICHE_OPTIONS.map((option) => (
                  <button
                    key={option}
                    onClick={() => setNiche(option)}
                    className={`w-full text-left px-4 py-3.5 rounded-lg border font-body text-sm transition-all ${
                      niche === option
                        ? 'border-mauve bg-mauve/15 text-cream'
                        : 'border-mauve/20 bg-cream/5 text-cream/70 hover:border-mauve/40 hover:bg-cream/8'
                    }`}
                  >
                    {option}
                  </button>
                ))}
                {niche === 'Other' && (
                  <input
                    type="text"
                    value={customNiche}
                    onChange={(e) => setCustomNiche(e.target.value)}
                    placeholder="Tell us your niche..."
                    className="w-full px-4 py-3 rounded text-sm font-body mt-2"
                    autoFocus
                  />
                )}
              </div>
              <div className="mt-8 text-center">
                <OrnateButton onClick={handleNext} disabled={!niche} variant="filled">
                  Continue
                </OrnateButton>
              </div>
            </div>
          )}

          {/* Step 2: Audience */}
          {step === 2 && (
            <div className="animate-fade-slide-up" key="step2">
              <h2 className="font-heading text-heading-2 text-cream mb-2 text-center">
                Who is your dream follower?
              </h2>
              <p className="text-cream/50 text-sm font-body text-center mb-8">
                Describe the person you're creating content for.
              </p>
              <textarea
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="E.g., Women in their 20s-30s who want to start an online business but don't know where to begin..."
                rows={4}
                className="w-full px-4 py-3 rounded text-sm font-body resize-none"
                autoFocus
              />
              <div className="mt-8 flex items-center justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="text-cream/40 hover:text-cream/60 text-sm font-body transition-colors"
                >
                  Back
                </button>
                <OrnateButton onClick={handleNext} disabled={!audience.trim()} variant="filled">
                  Continue
                </OrnateButton>
              </div>
            </div>
          )}

          {/* Step 3: Goal */}
          {step === 3 && (
            <div className="animate-fade-slide-up" key="step3">
              <h2 className="font-heading text-heading-2 text-cream mb-2 text-center">
                What's your main goal right now?
              </h2>
              <p className="text-cream/50 text-sm font-body text-center mb-8">
                Blair will focus her feedback on what matters most to you.
              </p>
              <div className="space-y-3">
                {GOAL_OPTIONS.map((option) => (
                  <button
                    key={option}
                    onClick={() => setGoal(option)}
                    className={`w-full text-left px-4 py-3.5 rounded-lg border font-body text-sm transition-all ${
                      goal === option
                        ? 'border-mauve bg-mauve/15 text-cream'
                        : 'border-mauve/20 bg-cream/5 text-cream/70 hover:border-mauve/40 hover:bg-cream/8'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <div className="mt-8 flex items-center justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="text-cream/40 hover:text-cream/60 text-sm font-body transition-colors"
                >
                  Back
                </button>
                <OrnateButton onClick={handleComplete} disabled={!goal || isSubmitting} variant="filled">
                  {isSubmitting ? 'Saving...' : "Let's Go"}
                </OrnateButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
