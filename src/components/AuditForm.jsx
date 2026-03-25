import React, { useState, useRef } from 'react'
import OrnateButton from './OrnateButton'
import FirstTimeTooltip from './FirstTimeTooltip'

const AUDIT_TYPES = [
  { value: 'bio', label: 'Instagram Bio' },
  { value: 'caption', label: 'Instagram Caption' },
  { value: 'hook', label: 'Hook (Reel/TikTok opener)' },
  { value: 'profile', label: 'Profile Grid (screenshot)' },
  { value: 'concept', label: 'Content Concept' },
  { value: 'video_script', label: 'Video Script / TikTok Script' },
]

export default function AuditForm({ onSubmit, isLoading, showTooltip = false }) {
  const [auditType, setAuditType] = useState('bio')
  const [content, setContent] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const fileInputRef = useRef(null)

  const isProfileType = auditType === 'profile'
  const isVideoScriptType = auditType === 'video_script'

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isProfileType && !imageFile) return
    if (!isProfileType && !content.trim()) return

    // Convert image to base64 if present
    if (imageFile) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result.split(',')[1]
        onSubmit({
          auditType,
          content: content.trim(),
          imageBase64: base64,
        })
      }
      reader.readAsDataURL(imageFile)
    } else {
      onSubmit({
        auditType,
        content: content.trim(),
        imageBase64: null,
      })
    }
  }

  const canSubmit = isProfileType
    ? !!imageFile
    : content.trim().length > 0

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto">
      <div className="bg-burgundy-light/30 border border-mauve/20 rounded-lg p-6 md:p-8 backdrop-blur-sm">

        {/* Audit Type Dropdown */}
        <div className="mb-6">
          <label
            htmlFor="audit-type"
            className="block text-sm font-body text-cream/70 mb-2 tracking-wide uppercase"
          >
            What are we auditing?
          </label>
          <div className="relative">
            <select
              id="audit-type"
              value={auditType}
              onChange={(e) => {
                setAuditType(e.target.value)
                setContent('')
                removeImage()
              }}
              className="w-full px-4 py-3 rounded text-cream bg-burgundy/80 border border-mauve/30 font-body text-sm focus:border-mauve focus:outline-none"
            >
              {AUDIT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>

            {/* First-time tooltip pointing at the dropdown */}
            {showTooltip && <FirstTimeTooltip />}
          </div>
        </div>

        {/* Content Input — text area or image upload based on type */}
        {isProfileType ? (
          /* Image Upload for Profile Grid */
          <div className="mb-6">
            <label className="block text-sm font-body text-cream/70 mb-2 tracking-wide uppercase">
              Upload your profile screenshot
            </label>

            {imagePreview ? (
              <div className="relative">
                <div className="file-upload-area has-file p-4">
                  <img
                    src={imagePreview}
                    alt="Profile preview"
                    className="max-h-64 mx-auto rounded"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="mt-3 text-sm text-mauve hover:text-dusty transition-colors"
                  >
                    Remove image
                  </button>
                </div>
              </div>
            ) : (
              <div
                className="file-upload-area"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="text-mauve mb-2">
                  <svg className="w-10 h-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="text-cream/60 text-sm font-body">
                  Tap to upload your Instagram profile screenshot
                </p>
                <p className="text-cream/40 text-xs mt-1 font-body">
                  PNG, JPG up to 10MB
                </p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

            {/* Optional text context for profile audit */}
            <div className="mt-4">
              <label className="block text-sm font-body text-cream/50 mb-2">
                Any context? (optional)
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="E.g., 'I'm a fitness coach targeting women 25-35...'"
                rows={2}
                className="w-full px-4 py-3 rounded text-sm font-body resize-none"
              />
            </div>
          </div>
        ) : (
          /* Text Area for all other audit types */
          <div className="mb-6">
            <label className="block text-sm font-body text-cream/70 mb-2 tracking-wide uppercase">
              Paste your content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                isVideoScriptType
                  ? 'Paste your video script or describe your concept...'
                  : auditType === 'bio'
                  ? 'Paste your Instagram bio here — include everything from your name line to your CTA...'
                  : auditType === 'hook'
                  ? 'Type or paste your hook...'
                  : auditType === 'concept'
                  ? 'Describe your content idea...'
                  : 'Paste your caption here...'
              }
              rows={6}
              className="w-full px-4 py-3 rounded text-sm font-body resize-vertical min-h-[120px]"
            />

            {/* Bio helper note */}
            {auditType === 'bio' && (
              <p className="mt-3 text-sm text-dusty/80 font-body italic leading-relaxed">
                Copy your full bio text — name line, tagline, CTA, everything. Blair will
                audit it like she's seeing your profile for the first time.
              </p>
            )}

            {/* Video Script helper note */}
            {isVideoScriptType && (
              <p className="mt-3 text-sm text-dusty/80 font-body italic leading-relaxed">
                Paste your script or describe your video concept — Blair will
                audit it like a coach reviewing your content before you film.
              </p>
            )}
          </div>
        )}

        {/* Submit Button */}
        <div className="text-center">
          <OrnateButton
            onClick={handleSubmit}
            disabled={!canSubmit || isLoading}
            variant="filled"
          >
            {isLoading ? 'Blair AI is auditing your content...' : 'Run My Audit'}
          </OrnateButton>

          {isLoading && (
            <p className="mt-4 text-sm text-mauve animate-pulse-mauve font-body italic">
              Blair AI is auditing your content...
            </p>
          )}
        </div>
      </div>
    </form>
  )
}
