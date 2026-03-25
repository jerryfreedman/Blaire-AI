import React from 'react'

/**
 * Ornate button with decorative flourish borders — BE RICH aesthetic.
 * SVG flourishes on left and right, cream text on dark background.
 */
export default function OrnateButton({ children, onClick, disabled, className = '', variant = 'default' }) {
  const baseClasses = 'btn-ornate group relative inline-flex items-center justify-center gap-3'
  const variantClasses = variant === 'filled' ? 'btn-ornate-filled' : ''
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : ''

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses} ${disabledClasses} ${className}`}
    >
      {/* Left flourish — ornate SVG */}
      <svg
        className="flourish-left w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2 12C2 12 4 8 8 8C12 8 12 12 12 12C12 12 12 16 8 16C4 16 2 12 2 12Z"
          stroke="currentColor"
          strokeWidth="1.2"
          fill="none"
        />
        <path
          d="M12 12C12 12 14 8 18 8C22 8 22 12 22 12"
          stroke="currentColor"
          strokeWidth="1.2"
          fill="none"
        />
        <path
          d="M8 8C8 8 8 4 12 2"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M8 16C8 16 8 20 12 22"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
        />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      </svg>

      <span className="relative z-10">{children}</span>

      {/* Right flourish — mirrored */}
      <svg
        className="flourish-right w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform: 'scaleX(-1)' }}
      >
        <path
          d="M2 12C2 12 4 8 8 8C12 8 12 12 12 12C12 12 12 16 8 16C4 16 2 12 2 12Z"
          stroke="currentColor"
          strokeWidth="1.2"
          fill="none"
        />
        <path
          d="M12 12C12 12 14 8 18 8C22 8 22 12 22 12"
          stroke="currentColor"
          strokeWidth="1.2"
          fill="none"
        />
        <path
          d="M8 8C8 8 8 4 12 2"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M8 16C8 16 8 20 12 22"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
        />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      </svg>
    </button>
  )
}
