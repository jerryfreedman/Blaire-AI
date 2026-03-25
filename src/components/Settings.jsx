import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
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

export default function Settings() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Editable fields
  const [name, setName] = useState('')
  const [niche, setNiche] = useState('')
  const [customNiche, setCustomNiche] = useState('')
  const [audience, setAudience] = useState('')
  const [goal, setGoal] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.user) {
          navigate('/app')
          return
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (error) {
          console.error('Settings profile load error:', error)
          return
        }

        setProfile(data)
        setName(data.name || '')
        setAudience(data.audience || '')
        setGoal(data.goal || '')

        // Check if niche matches a preset option
        if (NICHE_OPTIONS.includes(data.niche)) {
          setNiche(data.niche)
        } else if (data.niche) {
          setNiche('Other')
          setCustomNiche(data.niche)
        }
      } catch (err) {
        console.error('Settings load error:', err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [navigate])

  const handleSave = async () => {
    if (!profile) return
    setSaving(true)
    setSaved(false)

    const finalNiche = niche === 'Other' ? (customNiche.trim() || 'Other') : niche
    const userContext = { niche: finalNiche, audience: audience.trim(), goal }

    const { error } = await supabase
      .from('profiles')
      .update({
        name: name.trim(),
        niche: finalNiche,
        audience: audience.trim(),
        goal,
        user_context: userContext,
      })
      .eq('id', profile.id)

    if (!error) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    }

    setSaving(false)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-burgundy flex items-center justify-center">
        <p className="text-mauve font-body text-sm animate-pulse-mauve">Loading...</p>
      </div>
    )
  }

  const isPaid = profile?.is_paid || false

  return (
    <div className="min-h-screen bg-burgundy flex flex-col">
      {/* Header */}
      <header className="w-full py-6 px-4 text-center">
        <h1 className="font-heading text-display text-cream tracking-wide">Blair AI</h1>
        <div className="mt-2 flex items-center justify-center gap-3">
          <span className="block w-12 h-px bg-mauve opacity-50"></span>
          <span className="text-mauve text-xs tracking-[0.2em] uppercase font-body">Settings</span>
          <span className="block w-12 h-px bg-mauve opacity-50"></span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center px-4 pb-12 pt-4">
        <div className="w-full max-w-md space-y-6 animate-fade-slide-up">

          {/* Subscription Status */}
          <div className="bg-burgundy-light/30 border border-mauve/20 rounded-lg p-5 sm:p-6">
            <h2 className="font-heading text-heading-3 text-cream mb-3">Subscription</h2>
            {isPaid ? (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-mauve text-sm font-body">Blair AI Pro</span>
                  <span className="text-mauve/60 text-xs px-2 py-0.5 rounded-full border border-mauve/30">Active</span>
                </div>
                <p className="text-cream/50 text-xs font-body leading-relaxed mb-4">
                  Unlimited audits and Ask Blair AI questions. You're all in — I love that.
                </p>
                <button
                  onClick={() => {
                    // Stripe customer portal would go here
                    window.open('https://billing.stripe.com/p/login/test', '_blank')
                  }}
                  className="text-mauve/70 hover:text-mauve text-xs font-body underline underline-offset-4 transition-colors"
                >
                  Manage billing on Stripe →
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-cream/60 text-sm font-body">Free Plan</span>
                </div>
                <p className="text-cream/50 text-xs font-body leading-relaxed mb-1">
                  {Math.max(0, 3 - (profile?.audit_count || 0))} audit{Math.max(0, 3 - (profile?.audit_count || 0)) !== 1 ? 's' : ''} remaining
                </p>
                <p className="text-cream/50 text-xs font-body leading-relaxed mb-4">
                  {Math.max(0, 5 - (profile?.ask_blair_count || 0))} Ask Blair AI question{Math.max(0, 5 - (profile?.ask_blair_count || 0)) !== 1 ? 's' : ''} remaining
                </p>
                <OrnateButton onClick={() => navigate('/app')} variant="filled">
                  Upgrade — $19/month
                </OrnateButton>
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="bg-burgundy-light/30 border border-mauve/20 rounded-lg p-5 sm:p-6">
            <h2 className="font-heading text-heading-3 text-cream mb-4">Profile</h2>

            {/* Name */}
            <div className="mb-4">
              <label className="block text-xs font-body text-cream/50 mb-1.5 tracking-wide uppercase">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded text-sm font-body"
              />
            </div>

            {/* Email (read-only) */}
            <div className="mb-4">
              <label className="block text-xs font-body text-cream/50 mb-1.5 tracking-wide uppercase">Email</label>
              <p className="text-cream/60 text-sm font-body px-4 py-2.5 bg-burgundy/40 rounded border border-mauve/10">
                {profile?.email || '—'}
              </p>
            </div>
          </div>

          {/* Content Strategy (Onboarding Answers) */}
          <div className="bg-burgundy-light/30 border border-mauve/20 rounded-lg p-5 sm:p-6">
            <h2 className="font-heading text-heading-3 text-cream mb-1">Content Strategy</h2>
            <p className="text-cream/40 text-xs font-body mb-4">
              These personalize every audit and Ask Blair AI response.
            </p>

            {/* Niche */}
            <div className="mb-4">
              <label className="block text-xs font-body text-cream/50 mb-1.5 tracking-wide uppercase">Your niche</label>
              <select
                value={niche}
                onChange={(e) => {
                  setNiche(e.target.value)
                  if (e.target.value !== 'Other') setCustomNiche('')
                }}
                className="w-full px-4 py-2.5 rounded text-sm font-body text-cream bg-burgundy/80 border border-mauve/30"
              >
                <option value="">Select...</option>
                {NICHE_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              {niche === 'Other' && (
                <input
                  type="text"
                  value={customNiche}
                  onChange={(e) => setCustomNiche(e.target.value)}
                  placeholder="Describe your niche..."
                  className="w-full mt-2 px-4 py-2.5 rounded text-sm font-body"
                />
              )}
            </div>

            {/* Audience */}
            <div className="mb-4">
              <label className="block text-xs font-body text-cream/50 mb-1.5 tracking-wide uppercase">Dream follower</label>
              <textarea
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="E.g., Women in their 20s-30s who want to start an online business..."
                rows={2}
                className="w-full px-4 py-2.5 rounded text-sm font-body resize-none"
              />
            </div>

            {/* Goal */}
            <div className="mb-5">
              <label className="block text-xs font-body text-cream/50 mb-1.5 tracking-wide uppercase">Main goal</label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full px-4 py-2.5 rounded text-sm font-body text-cream bg-burgundy/80 border border-mauve/30"
              >
                <option value="">Select...</option>
                {GOAL_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Save button */}
            <OrnateButton onClick={handleSave} disabled={saving} variant="filled">
              {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
            </OrnateButton>
          </div>

          {/* Account Actions */}
          <div className="bg-burgundy-light/30 border border-mauve/20 rounded-lg p-5 sm:p-6">
            <h2 className="font-heading text-heading-3 text-cream mb-4">Account</h2>

            <div className="space-y-3">
              <button
                onClick={async () => {
                  const { error } = await supabase.auth.resetPasswordForEmail(
                    profile?.email,
                    { redirectTo: `${window.location.origin}/reset-password` }
                  )
                  if (!error) {
                    alert('Password reset email sent — check your inbox.')
                  }
                }}
                className="text-cream/50 hover:text-cream/70 text-sm font-body transition-colors block"
              >
                Change password →
              </button>

              <button
                onClick={handleSignOut}
                className="text-cream/50 hover:text-cream/70 text-sm font-body transition-colors block"
              >
                Sign out →
              </button>
            </div>
          </div>

          {/* Back link */}
          <div className="text-center pt-2">
            <button
              onClick={() => navigate('/app')}
              className="text-cream/35 hover:text-cream/50 text-sm font-body transition-colors"
            >
              ← Back to audits
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
