import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function StripeSuccess() {
  const navigate = useNavigate()
  const [updated, setUpdated] = useState(false)

  useEffect(() => {
    const updatePaymentStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          await supabase
            .from('profiles')
            .update({ is_paid: true })
            .eq('id', session.user.id)
          setUpdated(true)
        }
      } catch (err) {
        console.error('Payment status update error:', err)
      }

      // Redirect after 3 seconds
      setTimeout(() => navigate('/app'), 3000)
    }

    updatePaymentStatus()
  }, [navigate])

  return (
    <div className="min-h-screen bg-burgundy flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-fade-slide-up text-center">
        <div className="bg-burgundy-light/40 border border-mauve/20 rounded-xl p-8 md:p-10 backdrop-blur-sm">
          <div className="mb-6">
            <span className="text-mauve text-5xl">✦</span>
          </div>
          <h1 className="font-heading text-heading-1 text-cream mb-4">
            You're in.
          </h1>
          <p className="font-heading text-xl text-dusty italic mb-6">
            Let's build something real.
          </p>
          <p className="text-cream/40 text-sm font-body">
            Redirecting you to your audits...
          </p>
        </div>
      </div>
    </div>
  )
}
