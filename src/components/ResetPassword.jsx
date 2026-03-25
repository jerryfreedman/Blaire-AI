import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import OrnateButton from './OrnateButton'

/**
 * ResetPassword — handles Supabase password reset token.
 * Styled on brand, BE RICH aesthetic.
 * After success: Blair's voice confirmation.
 */
export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    // Supabase handles the token from the URL hash automatically
    // when using onAuthStateChange
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event) => {
        if (event === 'PASSWORD_RECOVERY') {
          // Token is valid, user can set new password
          console.log('Password recovery mode active')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const handleReset = async (e) => {
    e.preventDefault()
    if (!password || !confirmPassword) return

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password
      })

      if (updateError) {
        setError(updateError.message)
        return
      }

      setSuccess(true)

      // Redirect after 3 seconds
      setTimeout(() => {
        window.location.href = '/app'
      }, 3000)
    } catch (err) {
      console.error('Password reset error:', err)
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-burgundy flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-fade-slide-up">
        <div className="bg-burgundy-light/40 border border-mauve/20 rounded-xl p-8 md:p-10 backdrop-blur-sm">
          {/* Header */}
          <div className="text-center mb-2">
            <h1 className="font-heading text-display text-cream tracking-wide mb-2">
              Blair AI
            </h1>
            <div className="flex items-center justify-center gap-3 mb-8">
              <span className="block w-12 h-px bg-mauve opacity-50"></span>
              <span className="text-mauve text-xs tracking-[0.2em] uppercase font-body">
                Reset Password
              </span>
              <span className="block w-12 h-px bg-mauve opacity-50"></span>
            </div>
          </div>

          {success ? (
            <div className="text-center py-4">
              <p className="font-heading text-xl text-cream italic mb-3">
                "You're all set. Welcome back, let's get to work."
              </p>
              <p className="text-cream/40 text-xs font-body">
                Redirecting you now...
              </p>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label className="block text-xs font-body text-cream/50 mb-1.5 uppercase tracking-wider">
                  New Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="New password (6+ characters)"
                  required
                  className="w-full px-4 py-3 rounded text-sm font-body"
                />
              </div>

              <div>
                <label className="block text-xs font-body text-cream/50 mb-1.5 uppercase tracking-wider">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  required
                  className="w-full px-4 py-3 rounded text-sm font-body"
                />
              </div>

              {error && (
                <p className="text-red-400 text-xs font-body text-center">{error}</p>
              )}

              <div className="pt-2 text-center">
                <OrnateButton
                  onClick={handleReset}
                  disabled={isSubmitting}
                  variant="filled"
                >
                  {isSubmitting ? 'Updating...' : 'Set New Password'}
                </OrnateButton>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
