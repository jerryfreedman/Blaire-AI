import React, { useState, useEffect } from 'react'

const STORAGE_KEY = 'blair_tooltip_dismissed'

export default function FirstTimeTooltip() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY)
    if (!dismissed) {
      const timer = setTimeout(() => setShow(true), 800)
      return () => clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    if (!show) return
    const handleDismiss = () => {
      setShow(false)
      localStorage.setItem(STORAGE_KEY, 'true')
    }
    document.addEventListener('click', handleDismiss)
    document.addEventListener('touchstart', handleDismiss)
    return () => {
      document.removeEventListener('click', handleDismiss)
      document.removeEventListener('touchstart', handleDismiss)
    }
  }, [show])

  if (!show) return null

  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 z-30 animate-fade-slide-up"
      style={{ top: 'calc(100% + 10px)', width: 'min(280px, 90vw)' }}
    >
      {/* Arrow pointing up at the dropdown */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-mauve/90" />
      <div className="bg-mauve/90 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg">
        <p className="text-cream text-sm font-body leading-relaxed">
          <span className="font-semibold">Start here →</span> I already set it to Instagram Bio for you. It's the #1 thing I see holding girls back — paste yours in and let's fix it.
        </p>
      </div>
    </div>
  )
}
