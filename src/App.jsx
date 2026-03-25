import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import Header from './components/Header'
import AuditForm from './components/AuditForm'
import ResultsDisplay from './components/ResultsDisplay'
import AskBlairWidget from './components/AskBlairWidget'
import EmailCapture from './components/EmailCapture'
import AuthModal from './components/AuthModal'
import PaywallModal from './components/PaywallModal'
import UsageBar from './components/UsageBar'
import ResetPassword from './components/ResetPassword'
import Onboarding from './components/Onboarding'
import FirstTimeTooltip from './components/FirstTimeTooltip'
import LandingPage from './components/LandingPage'
import AuditHistory from './components/AuditHistory'
import StripeSuccess from './components/StripeSuccess'
import { runAudit } from './api/audit'
import { supabase } from './lib/supabase'

const MAX_FREE_AUDITS = 3
const MAX_FREE_QUESTIONS = 15

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ''
const STRIPE_PRICE_ID = import.meta.env.VITE_STRIPE_PRICE_ID || ''

function MainApp() {
  const navigate = useNavigate()
  const location = useLocation()

  // Auth state
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  // UI state
  const [showEmailCapture, setShowEmailCapture] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState('signup')
  const [capturedEmail, setCapturedEmail] = useState('')
  const [capturedName, setCapturedName] = useState('')
  const [showPaywall, setShowPaywall] = useState(false)
  const [paywallType, setPaywallType] = useState('audit')
  const [showOnboarding, setShowOnboarding] = useState(false)

  // Audit state
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)

  // Check auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          setUser(session.user)
          await loadProfile(session.user.id)
        } else {
          // Not authenticated — show email capture
          setShowEmailCapture(true)
        }
      } catch (err) {
        console.error('Auth check error:', err)
        setShowEmailCapture(true)
      } finally {
        setAuthLoading(false)
      }
    }

    checkAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user)
          await loadProfile(session.user.id)
          setShowAuth(false)
          setShowEmailCapture(false)
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setProfile(null)
          setShowEmailCapture(true)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Check if onboarding needed after profile loads
  useEffect(() => {
    if (user && profile && !profile.onboarding_complete) {
      setShowOnboarding(true)
    }
  }, [user, profile])

  const loadProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Profile load error:', error)
        return
      }

      setProfile(data)
    } catch (err) {
      console.error('Profile load error:', err)
    }
  }

  // Email capture complete → show auth signup
  const handleEmailCaptured = ({ name, email }) => {
    setCapturedEmail(email)
    setCapturedName(name)
    setShowEmailCapture(false)
    setAuthMode('signup')
    setShowAuth(true)
  }

  // Sign in link from email capture
  const handleSignInClick = () => {
    setShowEmailCapture(false)
    setAuthMode('signin')
    setShowAuth(true)
  }

  // Auth success
  const handleAuthSuccess = async (authUser) => {
    setUser(authUser)
    setShowAuth(false)
    setShowEmailCapture(false)
    await loadProfile(authUser.id)
  }

  // Sign out
  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    setResults(null)
    setShowEmailCapture(true)
  }

  // Onboarding complete
  const handleOnboardingComplete = async ({ niche, audience, goal }) => {
    if (!user) return

    const userContext = { niche, audience, goal }

    const { error } = await supabase
      .from('profiles')
      .update({
        niche,
        audience,
        goal,
        user_context: userContext,
        onboarding_complete: true,
      })
      .eq('id', user.id)

    if (!error) {
      setProfile(prev => ({
        ...prev,
        niche,
        audience,
        goal,
        user_context: userContext,
        onboarding_complete: true,
      }))
    }

    setShowOnboarding(false)
  }

  // Check gating before audit
  const canRunAudit = () => {
    if (!profile) return true
    if (profile.is_paid) return true
    return (profile.audit_count || 0) < MAX_FREE_AUDITS
  }

  // Increment audit count in Supabase
  const incrementAuditCount = async () => {
    if (!user || !profile) return

    const newCount = (profile.audit_count || 0) + 1
    const { error } = await supabase
      .from('profiles')
      .update({ audit_count: newCount })
      .eq('id', user.id)

    if (!error) {
      setProfile(prev => ({ ...prev, audit_count: newCount }))
    }
  }

  // Increment ask blair count
  const incrementAskBlairCount = async () => {
    if (!user || !profile) return

    const newCount = (profile.ask_blair_count || 0) + 1
    const { error } = await supabase
      .from('profiles')
      .update({ ask_blair_count: newCount })
      .eq('id', user.id)

    if (!error) {
      setProfile(prev => ({ ...prev, ask_blair_count: newCount }))
    }
  }

  // Log audit to Supabase audits table
  const logAudit = async (auditType, result) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('audits')
        .insert([{
          user_id: user.id,
          audit_type: auditType,
          score: result.overall_score,
          grade: result.letter_grade,
          action_items: result.action_items,
        }])

      if (error) {
        console.error('Audit log error:', error)
      }
    } catch (err) {
      console.error('Audit log error:', err)
    }
  }

  // Handle audit submit
  const handleAuditSubmit = async ({ auditType, content, imageBase64 }) => {
    // Check gating
    if (!canRunAudit()) {
      setPaywallType('audit')
      setShowPaywall(true)
      return
    }

    setIsLoading(true)
    setError(null)
    setResults(null)

    try {
      const userContext = profile?.user_context || null
      const result = await runAudit(auditType, content, imageBase64, userContext)
      setResults(result)
      console.log('Audit complete:', result)
      window.scrollTo({ top: 0, behavior: 'smooth' })

      // Increment count + log audit
      await incrementAuditCount()
      await logAudit(auditType, result)
    } catch (err) {
      console.error('Audit error:', err)
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAuditAgain = () => {
    setResults(null)
    setError(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Handle question asked in Ask Blair
  const handleQuestionAsked = () => {
    incrementAskBlairCount()
  }

  // Handle Stripe upgrade
  const handleUpgrade = async () => {
    if (!STRIPE_PUBLISHABLE_KEY || !STRIPE_PRICE_ID) {
      console.warn('Stripe not configured — set VITE_STRIPE_PUBLISHABLE_KEY and VITE_STRIPE_PRICE_ID in .env')
      alert('Payment integration is being configured. Check back soon!')
      setShowPaywall(false)
      return
    }

    try {
      // Load Stripe.js dynamically
      const { loadStripe } = await import('@stripe/stripe-js')
      const stripe = await loadStripe(STRIPE_PUBLISHABLE_KEY)

      if (!stripe) {
        throw new Error('Failed to load Stripe')
      }

      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({
        lineItems: [{ price: STRIPE_PRICE_ID, quantity: 1 }],
        mode: 'subscription',
        successUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/app`,
        customerEmail: user?.email || profile?.email || undefined,
      })

      if (error) {
        console.error('Stripe redirect error:', error)
        alert('Something went wrong with the payment. Please try again.')
      }
    } catch (err) {
      console.error('Stripe error:', err)
      // If @stripe/stripe-js isn't installed, show a friendly message
      if (err.message?.includes('Failed to fetch') || err.message?.includes('loadStripe')) {
        alert('Payment integration is being configured. Check back soon!')
      } else {
        alert('Something went wrong. Please try again.')
      }
      setShowPaywall(false)
    }
  }

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-burgundy flex items-center justify-center">
        <p className="text-mauve font-body text-sm animate-pulse-mauve">Loading...</p>
      </div>
    )
  }

  const isPaid = profile?.is_paid || false
  const auditCount = profile?.audit_count || 0
  const askBlairCount = profile?.ask_blair_count || 0

  return (
    <div className="min-h-screen bg-burgundy flex flex-col">
      {/* Usage Bar — only for authenticated users */}
      {user && profile && (
        <UsageBar
          isPaid={isPaid}
          auditCount={auditCount}
          askBlairCount={askBlairCount}
          maxFreeAudits={MAX_FREE_AUDITS}
          maxFreeQuestions={MAX_FREE_QUESTIONS}
          onSignOut={handleSignOut}
          onHistory={() => navigate('/history')}
        />
      )}

      <Header />

      <main className="flex-1 flex flex-col items-center justify-start px-4 pb-12 pt-4">
        <div className="w-full max-w-2xl">
          {/* Error display */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-500/30 rounded-lg text-center animate-fade-slide-up">
              <p className="text-cream/80 text-sm font-body">{error}</p>
              <button
                onClick={() => setError(null)}
                className="mt-2 text-mauve text-sm hover:text-dusty transition-colors"
              >
                Try again
              </button>
            </div>
          )}

          {/* Results or Audit Form */}
          {results ? (
            <ResultsDisplay
              results={results}
              onAuditAgain={handleAuditAgain}
            />
          ) : (
            <div className="animate-fade-slide-up">
              {/* First-time tooltip wraps the form */}
              <div className="relative">
                <AuditForm
                  onSubmit={handleAuditSubmit}
                  isLoading={isLoading}
                />
                {user && profile?.onboarding_complete && (
                  <div className="absolute top-0 left-0 w-full" style={{ pointerEvents: 'none' }}>
                    <div className="relative" style={{ pointerEvents: 'auto' }}>
                      <FirstTimeTooltip />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer accent */}
      <footer className="py-4 text-center">
        <p className="text-cream/30 text-xs font-body tracking-wider">
          Built on Blair Richards' framework · BE RICH
        </p>
      </footer>

      {/* Ask Blair Widget */}
      <AskBlairWidget
        userContext={profile?.user_context || null}
        askBlairCount={askBlairCount}
        isPaid={isPaid}
        maxFreeQuestions={MAX_FREE_QUESTIONS}
        onQuestionAsked={handleQuestionAsked}
      />

      {/* Onboarding Modal */}
      {showOnboarding && (
        <Onboarding onComplete={handleOnboardingComplete} />
      )}

      {/* Email Capture Modal */}
      {!showOnboarding && showEmailCapture && (
        <EmailCapture
          onComplete={handleEmailCaptured}
          onSignInClick={handleSignInClick}
        />
      )}

      {/* Auth Modal */}
      {!showOnboarding && showAuth && (
        <AuthModal
          mode={authMode}
          prefillEmail={capturedEmail}
          prefillName={capturedName}
          onSuccess={handleAuthSuccess}
          onClose={() => {
            setShowAuth(false)
            if (!user) setShowEmailCapture(true)
          }}
        />
      )}

      {/* Paywall Modal */}
      {showPaywall && (
        <PaywallModal
          type={paywallType}
          onUpgrade={handleUpgrade}
          onClose={() => setShowPaywall(false)}
        />
      )}
    </div>
  )
}

/**
 * LandingWrapper — shows landing page for unauthenticated users,
 * redirects to /app for authenticated users.
 */
function LandingWrapper() {
  const [checking, setChecking] = useState(true)
  const [hasSession, setHasSession] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const check = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          setHasSession(true)
          navigate('/app', { replace: true })
        }
      } catch (err) {
        // Not authenticated
      } finally {
        setChecking(false)
      }
    }
    check()
  }, [navigate])

  if (checking) {
    return (
      <div className="min-h-screen bg-burgundy flex items-center justify-center">
        <p className="text-mauve font-body text-sm animate-pulse-mauve">Loading...</p>
      </div>
    )
  }

  if (hasSession) return null
  return <LandingPage />
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingWrapper />} />
        <Route path="/app" element={<MainApp />} />
        <Route path="/history" element={<AuditHistory />} />
        <Route path="/success" element={<StripeSuccess />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </Router>
  )
}
