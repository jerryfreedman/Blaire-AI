import React, { useState } from 'react'
import Header from './components/Header'
import AuditForm from './components/AuditForm'

export default function App() {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState(null)

  const handleAuditSubmit = async ({ auditType, content, imageBase64 }) => {
    setIsLoading(true)
    console.log('Audit submitted:', { auditType, content, hasImage: !!imageBase64 })

    // Placeholder — audit engine wired in Session 2
    setTimeout(() => {
      setIsLoading(false)
      console.log('Audit engine not yet connected — Session 2')
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-burgundy flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-start px-4 pb-12 pt-4">
        {/* App Shell Card */}
        <div className="w-full max-w-2xl animate-fade-slide-up">
          <AuditForm
            onSubmit={handleAuditSubmit}
            isLoading={isLoading}
          />
        </div>
      </main>

      {/* Footer accent */}
      <footer className="py-4 text-center">
        <p className="text-cream/30 text-xs font-body tracking-wider">
          Built on Blair Richards' framework · BE RICH
        </p>
      </footer>
    </div>
  )
}
