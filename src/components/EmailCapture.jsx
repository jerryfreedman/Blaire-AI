import React, { useState } from 'react'
import OrnateButton from './OrnateButton'
import { supabase } from '../lib/supabase'

/**
 * EmailCapture — full-screen email capture modal.
 * BE RICH aesthetic: dark card, cream text, mauve CTA.
 * Saves to leads table in Supabase.
 */
export default function EmailCapture({ onComplete, onSignInClick }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return

    setIsSubmitting(true)
    setError('')

    try {
      // Save to leads table
      const { error: insertError } = await supabase
        .from('leads')
        .insert([{ name: name.trim(), email: email.trim().toLowerCase() }])

      if (insertError) {
        console.error('Lead insert error:', insertError)
        // Don't block the user even if leads insert fails
      }

      onComplete({ name: name.trim(), email: email.trim().toLowerCase() })
    } catch (err) {
      console.error('Email capture error:', err)
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-40 bg-burgundy/95 flex items-center justify-center px-4 sm:px-6 overflow-y-auto">
      <div className="w-full max-w-md animate-fade-slide-up my-auto py-6">
        <div className="bg-burgundy-light/40 border border-mauve/20 rounded-xl p-6 sm:p-8 md:p-10 backdrop-blur-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="font-heading text-heading-1 text-cream mb-3">
              Get Your First Free Audit
            </h2>
            <p className="text-cream/60 font-body text-sm leading-relaxed">
              Enter your email and Blair will review your content personally.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-body text-cream/50 mb-1.5 uppercase tracking-wider">
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="First name"
                required
                className="w-full px-4 py-3 rounded text-sm font-body"
              />
            </div>

            <div>
              <label className="block text-xs font-body text-cream/50 mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 rounded text-sm font-body"
              />
            </div>

            {error && (
              <p className="text-red-400 text-xs font-body text-center">{error}</p>
            )}

            <div className="pt-2 text-center">
              <OrnateButton
                onClick={handleSubmit}
                disabled={!name.trim() || !email.trim() || isSubmitting}
                variant="filled"
              >
                {isSubmitting ? 'One moment...' : 'Start My Free Audit →'}
              </OrnateButton>
            </div>
          </form>

          {/* Sign in link */}
          <div className="mt-6 text-center">
            <button
              onClick={onSignInClick}
              className="text-cream/40 hover:text-cream/60 text-xs font-body transition-colors"
            >
              Already have an account? Sign in →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
