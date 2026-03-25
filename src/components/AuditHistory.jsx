import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import OrnateButton from './OrnateButton'

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function getScoreColor(score) {
  if (score >= 80) return '#c4857a'
  if (score >= 50) return '#d4a040'
  return '#a04040'
}

const AUDIT_TYPE_LABELS = {
  bio: 'Instagram Bio',
  caption: 'Instagram Caption',
  hook: 'Hook (Reel/TikTok)',
  profile: 'Profile Grid',
  concept: 'Content Concept',
  video_script: 'Video Script',
}

export default function AuditHistory() {
  const navigate = useNavigate()
  const [audits, setAudits] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState(null)

  useEffect(() => {
    const loadAudits = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.user) {
          navigate('/app')
          return
        }

        const { data, error } = await supabase
          .from('audits')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(10)

        if (error) {
          console.error('Audit history load error:', error)
        } else {
          setAudits(data || [])
        }
      } catch (err) {
        console.error('Audit history error:', err)
      } finally {
        setLoading(false)
      }
    }

    loadAudits()
  }, [navigate])

  return (
    <div className="min-h-screen bg-burgundy flex flex-col">
      {/* Header */}
      <header className="w-full py-6 px-4 text-center">
        <h1 className="font-heading text-display text-cream tracking-wide">Blair AI</h1>
        <div className="mt-2 flex items-center justify-center gap-3">
          <span className="block w-12 h-px bg-mauve opacity-50"></span>
          <span className="text-mauve text-xs tracking-[0.2em] uppercase font-body">Audit History</span>
          <span className="block w-12 h-px bg-mauve opacity-50"></span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center px-4 pb-12 pt-4">
        <div className="w-full max-w-xl">
          {loading ? (
            <p className="text-center text-mauve font-body text-sm animate-pulse-mauve">Loading your audits...</p>
          ) : audits.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-cream/50 font-body text-sm mb-6">
                No audits yet. Run your first audit and it'll show up here.
              </p>
              <OrnateButton onClick={() => navigate('/app')} variant="filled">
                Run an Audit
              </OrnateButton>
            </div>
          ) : (
            <div className="space-y-3">
              {audits.map((audit) => {
                const isExpanded = expandedId === audit.id
                const scoreColor = getScoreColor(audit.score)
                const actionItems = Array.isArray(audit.action_items) ? audit.action_items : []

                return (
                  <div
                    key={audit.id}
                    className="bg-burgundy-light/30 border border-mauve/15 rounded-lg overflow-hidden transition-all cursor-pointer hover:border-mauve/30"
                    onClick={() => setExpandedId(isExpanded ? null : audit.id)}
                  >
                    {/* Summary row */}
                    <div className="flex items-center justify-between px-5 py-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-cream/90 text-sm font-body font-medium truncate">
                          {AUDIT_TYPE_LABELS[audit.audit_type] || audit.audit_type}
                        </p>
                        <p className="text-cream/35 text-xs font-body mt-0.5">
                          {formatDate(audit.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 ml-4">
                        <div className="text-right">
                          <span className="font-heading text-2xl font-bold" style={{ color: scoreColor }}>
                            {audit.score}
                          </span>
                          <span className="text-cream/30 text-xs font-body">/100</span>
                        </div>
                        <span className="font-heading text-2xl font-bold" style={{ color: scoreColor }}>
                          {audit.grade}
                        </span>
                        <svg
                          className={`w-4 h-4 text-cream/30 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          fill="none" viewBox="0 0 24 24" stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    {/* Expanded action items */}
                    {isExpanded && actionItems.length > 0 && (
                      <div className="px-5 pb-4 border-t border-mauve/10 pt-4 animate-fade-slide-up">
                        <p className="text-cream/40 text-xs font-body uppercase tracking-wider mb-3">Action Items</p>
                        <div className="space-y-2">
                          {actionItems.map((item, i) => (
                            <div key={i} className="flex items-start gap-3">
                              <span className="bg-mauve/20 text-mauve text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                {i + 1}
                              </span>
                              <p className="text-cream/70 text-xs font-body leading-relaxed">{item}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* Back button */}
          <div className="mt-8 text-center">
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
