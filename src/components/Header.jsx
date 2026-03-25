import React from 'react'

/**
 * Branded header — "Blair AI" in Cormorant Garamond
 * Premium, feminine, elegant
 */
export default function Header() {
  return (
    <header className="w-full py-6 px-4 text-center">
      <h1 className="font-heading text-display text-cream tracking-wide">
        Blair AI
      </h1>
      <div className="mt-2 flex items-center justify-center gap-3">
        <span className="block w-12 h-px bg-mauve opacity-50"></span>
        <span className="text-mauve text-xs tracking-[0.2em] uppercase font-body">
          Content Auditing
        </span>
        <span className="block w-12 h-px bg-mauve opacity-50"></span>
      </div>
    </header>
  )
}
