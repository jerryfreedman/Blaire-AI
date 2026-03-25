import React, { useState } from 'react'
import OrnateButton from './OrnateButton'
import { supabase } from '../lib/supabase'

/**
 * Translate Supabase error messages to friendly Blair-voice messages.
 */
function friendlyError(message) {
  const lower = (message || '').toLowerCase()
  if (lower.includes('rate limit') || lower.includes('too many requests') || lower.includes('email rate limit exceeded'))
    return "Slow down, babe — too many attempts. Wait a minute and try again."
  if (lower.includes('invalid login credentials') || lower.includes('invalid email or password'))
    return "That email/password combo isn't matching up. Double check and try again."
  if (lower.includes('user already registered') || lower.includes('already been registered'))
    return "Looks like you already have an account with that email. Try signing in instead."
  if (lower.includes('invalid email'))
    return "That doesn't look like a valid email. Double check the spelling?"
  if (lower.includes('password') && lower.includes('least'))
    return "Password needs to be at least 6 characters. Make it a good one."
  if (lower.includes('email not confirmed'))
    return "Check your inbox for a confirmation email, then try signing in again."
  if (lower.includes('signup is disabled'))
    return "Signups are temporarily paused. Try again in a few minutes."
  return message || "Something went wrong. Try again in a moment."
}

/**
 * Basic client-side email validation.
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/**
 * AuthModal — sign in / sign up modal.
 * BE RICH aesthetic: burgundy background, cream inputs, mauve CTA.
 * Supports: sign up (with pre-filled email), sign in, forgot password.
 */
export default function AuthModal({ mode: initialMode = 'signup', prefillEmail = '', prefillName = '', onSuccess, onClose }) {
  const [mode, setMode] = useState(initialMode)
  const [email, setEmail] = useState(prefillEmail)
  const [password, setPassword] = useState('')
  const [name, setName] = useState(prefillName)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const handleSignUp = async (e) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) return

    if (!isValidEmail(email.trim())) {
      setError("That doesn't look like a valid email. Double check the spelling?")
      return
    }

    if (password.length < 6) {
      setError('Password needs to be at least 6 characters. Make it a good one.')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: { name: name.trim() }
        }
      })

      if (signUpError) {
        setError(friendlyError(signUpError.message))
        return
      }

      // Create profile
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert([{
            id: data.user.id,
            email: email.trim().toLowerCase(),
            name: name.trim(),
            audit_count: 0,
            ask_blair_count: 0,
            is_paid: false,
            onboarding_complete: false,
          }])

        if (profileError) {
          console.error('Profile creation error:', profileError)
        }
      }

      // Check if Supabase returned a session (email confirmation is off)
      // or just a user with no session (email confirmation is on)
      if (data.session) {
        onSuccess(data.user)
      } else if (data.user && !data.session) {
        // Email confirmation is likely on
        setMessage("Check your inbox and confirm your email to get started.")
      } else {
        onSuccess(data.user)
      }
    } catch (err) {
      console.error('Sign up error:', err)
      setError('Something went wrong. Try again in a moment.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSignIn = async (e) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) return

    if (!isValidEmail(email.trim())) {
      setError("That doesn't look like a valid email. Double check the spelling?")
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      })

      if (signInError) {
        setError(friendlyError(signInError.message))
        return
      }

      onSuccess(data.user)
    } catch (err) {
      console.error('Sign in error:', err)
      setError('Something went wrong. Try again in a moment.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    if (!email.trim()) return

    if (!isValidEmail(email.trim())) {
      setError("That doesn't look like a valid email. Double check the spelling?")
      return
    }

    setIsSubmitting(true)
    setError('')
    setMessage('')

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        { redirectTo: `${window.location.origin}/reset-password` }
      )

      if (resetError) {
        setError(friendlyError(resetError.message))
        return
      }

      setMessage('Check your email — we sent you a password reset link.')
    } catch (err) {
      console.error('Reset error:', err)
      setError('Something went wrong. Try again in a moment.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-40 bg-burgundy/95 flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-fade-slide-up">
        <div className="bg-burgundy-light/40 border border-mauve/20 rounded-xl p-8 md:p-10 backdrop-blur-sm relative">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="font-heading text-heading-2 text-cream mb-2">
              {mode === 'signup' && 'Create Your Account'}
              {mode === 'signin' && 'Welcome Back'}
              {mode === 'forgot' && 'Reset Your Password'}
            </h2>
            <p className="text-cream/50 font-body text-sm">
              {mode === 'signup' && 'Save your results and track your progress.'}
              {mode === 'signin' && 'Sign in to continue your audits.'}
              {mode === 'forgot' && "Enter your email and we'll send a reset link."}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={
            mode === 'signup' ? handleSignUp :
            mode === 'signin' ? handleSignIn :
            handleForgotPassword
          } className="space-y-4">

            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-body text-cream/50 mb-1.5 uppercase tracking-wider">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-4 py-3 rounded text-sm font-body"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-body text-cream/50 mb-1.5 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError('') }}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 rounded text-sm font-body"
              />
            </div>

            {mode !== 'forgot' && (
              <div>
                <label className="block text-xs font-body text-cream/50 mb-1.5 uppercase tracking-wider">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError('') }}
                  placeholder={mode === 'signup' ? 'Create a password (6+ chars)' : 'Your password'}
                  required
                  className="w-full px-4 py-3 rounded text-sm font-body"
                />
              </div>
            )}

            {error && (
              <p className="text-red-400 text-xs font-body text-center">{error}</p>
            )}

            {message && (
              <p className="text-mauve text-xs font-body text-center">{message}</p>
            )}

            <div className="pt-2 text-center">
              <OrnateButton
                onClick={
                  mode === 'signup' ? handleSignUp :
                  mode === 'signin' ? handleSignIn :
                  handleForgotPassword
                }
                disabled={isSubmitting}
                variant="filled"
              >
                {isSubmitting ? 'One moment...' :
                  mode === 'signup' ? 'Create Account' :
                  mode === 'signin' ? 'Sign In' :
                  'Send Reset Link'}
              </OrnateButton>
            </div>
          </form>

          {/* Mode switching links */}
          <div className="mt-6 text-center space-y-2">
            {mode === 'signin' && (
              <>
                <button
                  onClick={() => { setMode('forgot'); setError(''); setMessage('') }}
                  className="block w-full text-cream/35 hover:text-cream/50 text-xs font-body transition-colors"
                >
                  Forgot your password?
                </button>
                <button
                  onClick={() => { setMode('signup'); setError(''); setMessage('') }}
                  className="block w-full text-cream/35 hover:text-cream/50 text-xs font-body transition-colors"
                >
                  Don't have an account? Sign up →
                </button>
              </>
            )}
            {mode === 'signup' && (
              <button
                onClick={() => { setMode('signin'); setError(''); setMessage('') }}
                className="text-cream/35 hover:text-cream/50 text-xs font-body transition-colors"
              >
                Already have an account? Sign in →
              </button>
            )}
            {mode === 'forgot' && (
              <button
                onClick={() => { setMode('signin'); setError(''); setMessage('') }}
                className="text-cream/35 hover:text-cream/50 text-xs font-body transition-colors"
              >
                Back to sign in
              </button>
            )}
          </div>

          {/* Close button */}
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-cream/30 hover:text-cream/50 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
