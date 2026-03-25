import React from 'react'
import { useNavigate } from 'react-router-dom'
import BlairPhoto from './BlairPhoto'
import OrnateButton from './OrnateButton'

const FEATURES = [
  'Get a detailed score, grade, and 5 personalized action items on every piece of content',
  'Ask Blair anything about hooks, captions, strategy, or growing your brand',
  'Built on the same framework that generated $3M+ with zero ad spend',
]

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-burgundy flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-20">
        <div className="w-full max-w-xl text-center">
          {/* Blair Photo */}
          <div className="mb-10 animate-fade-slide-up">
            <BlairPhoto size={220} />
          </div>

          {/* Headline */}
          <h1
            className="font-heading text-cream leading-tight mb-4 animate-fade-slide-up"
            style={{ fontSize: 'clamp(2rem, 6vw, 3.2rem)', animationDelay: '0.1s' }}
          >
            Finally Know If Your Content Is Actually Working
          </h1>

          {/* Subheadline */}
          <p
            className="text-cream/60 font-body text-base md:text-lg leading-relaxed mb-10 max-w-md mx-auto animate-fade-slide-up"
            style={{ animationDelay: '0.2s' }}
          >
            Blair Richards' exact framework for auditing your Instagram, captions, hooks, and profile — in seconds.
          </p>

          {/* Social proof stat bar */}
          <div
            className="flex items-center justify-center gap-4 md:gap-8 mb-12 animate-fade-slide-up"
            style={{ animationDelay: '0.3s' }}
          >
            {[
              { value: '$3M+', label: 'Revenue' },
              { value: '2M+', label: 'Followers' },
              { value: '$0', label: 'Spent on Ads' },
            ].map((stat, i) => (
              <React.Fragment key={stat.label}>
                {i > 0 && <span className="text-mauve/30">·</span>}
                <div className="text-center">
                  <span className="font-heading text-xl md:text-2xl text-mauve font-semibold block">
                    {stat.value}
                  </span>
                  <span className="text-cream/40 text-xs font-body tracking-wider uppercase">
                    {stat.label}
                  </span>
                </div>
              </React.Fragment>
            ))}
          </div>

          {/* Feature bullets */}
          <div
            className="text-left max-w-md mx-auto mb-12 space-y-4 animate-fade-slide-up"
            style={{ animationDelay: '0.4s' }}
          >
            {FEATURES.map((feature, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-mauve mt-0.5 flex-shrink-0">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
                <p className="text-cream/70 text-sm font-body leading-relaxed">{feature}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div
            className="animate-fade-slide-up"
            style={{ animationDelay: '0.5s' }}
          >
            <OrnateButton onClick={() => navigate('/app')} variant="filled">
              Get Your Free Audit →
            </OrnateButton>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center">
        <p className="text-cream/20 text-xs font-body tracking-wider">
          Built on Blair Richards' framework · BE RICH
        </p>
      </footer>
    </div>
  )
}
