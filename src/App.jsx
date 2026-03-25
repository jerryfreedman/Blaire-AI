import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import AuditForm from './components/AuditForm'
import ResultsDisplay from './components/ResultsDisplay'
import AskBlairWidget from './components/AskBlairWidget'
import EmailCapture from './components/EmailCapture'
import AuthModal from './components/AuthModal'
import PaywallModal from './components/PaywallModal'
import UsageBar from './components/UsageBar'
import ResetPassword from './components/ResetPassword'
import { runAudit } from './api/audit'
import { supabase } from './lib/supabase'

const MAX_FREE_AUDITS = 3
const MAX_FREE_QUESTIONS = 15

function MainApp() {
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
          // No session — show email capture for new visitors
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

  const loadProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Profile load error:', error)
        // Profile might not exist yet — create it
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

  // Check gating before audit
  const canRunAudit = () => {
    if (!profile) return true // No profile yet, allow first audit
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

      // Increment count
      await incrementAuditCount()
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

  // Handle upgrade (placeholder)
  const handleUpgrade = () => {
    // Placeholder — Stripe integration in Session 5
    console.log('Upgrade clicked — Stripe integration pending')
    setShowPaywall(false)
    alert('Payment integration coming soon! For now, enjoy your audits.')
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
              <AuditForm
                onSubmit={handleAuditSubmit}
                isLoading={isLoading}
              />
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

      {/* Email Capture Modal */}
      {showEmailCapture && (
        <EmailCapture
          onComplete={handleEmailCaptured}
          onSignInClick={handleSignInClick}
        />
      )}

      {/* Auth Modal */}
      {showAuth && (
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

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/*" element={<MainApp />} />
      </Routes>
    </Router>
  )
}
