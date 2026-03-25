import React from 'react'

/**
 * BlairPhoto — circular image placeholder.
 * When Blair provides her photo, swap to:
 *   <img src="/blair.jpg" alt="Blair Richards" />
 */
export default function BlairPhoto({ size = 300 }) {
  return (
    <div
      className="mx-auto rounded-full border-4 border-mauve/40 overflow-hidden flex items-center justify-center bg-burgundy-light/40"
      style={{ width: size, height: size }}
    >
      {/* Placeholder — replace <div> below with <img src="/blair.jpg" alt="Blair Richards" className="w-full h-full object-cover" /> */}
      <div className="text-center px-6">
        <div className="text-mauve/40 mb-3">
          <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <p className="text-cream/25 text-xs font-body tracking-wide">
          [Blair's photo goes here]
        </p>
      </div>
    </div>
  )
}
