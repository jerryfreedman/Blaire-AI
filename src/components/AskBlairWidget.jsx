import React, { useState, useRef, useEffect } from 'react'
import { askBlair } from '../api/askBlair'

/**
 * Ask Blair — floating chat widget.
 * Fixed bottom-right, rose mauve bubble with "Ask Blair" label.
 * Expands into 300×400 chat panel.
 * Handles mobile keyboard via visualViewport.
 */
const CHAT_STORAGE_KEY = 'blair_ai_chat_history'
const WELCOME_MESSAGE = { role: 'assistant', content: "Hey! I'm Blair AI — your content strategist. Ask me anything about hooks, captions, what to post, or growing your brand. I'll keep it real." }

function loadChatHistory() {
  try {
    const saved = sessionStorage.getItem(CHAT_STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch (e) { /* ignore */ }
  return [WELCOME_MESSAGE]
}

function saveChatHistory(messages) {
  try {
    sessionStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages))
  } catch (e) { /* ignore */ }
}

export default function AskBlairWidget({ userContext = null, askBlairCount = 0, isPaid = false, maxFreeQuestions = 5, onQuestionAsked }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState(loadChatHistory)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [viewportOffset, setViewportOffset] = useState(0)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const panelRef = useRef(null)

  const questionsUsed = askBlairCount
  const atLimit = !isPaid && questionsUsed >= maxFreeQuestions

  // Simple inline markdown renderer — handles **bold** and *italic* gracefully
  const renderMessageText = (text) => {
    // Split on **bold** and *italic* patterns, render as styled spans
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/)
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i}>{part.slice(1, -1)}</em>
      }
      return part
    })
  }

  // Persist messages to sessionStorage on change
  useEffect(() => {
    saveChatHistory(messages)
  }, [messages])

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Mobile keyboard handling via visualViewport
  useEffect(() => {
    if (!isOpen) return

    const vv = window.visualViewport
    if (!vv) return

    const handleResize = () => {
      const offsetFromBottom = window.innerHeight - vv.height - vv.offsetTop
      setViewportOffset(Math.max(0, offsetFromBottom))
    }

    vv.addEventListener('resize', handleResize)
    vv.addEventListener('scroll', handleResize)

    return () => {
      vv.removeEventListener('resize', handleResize)
      vv.removeEventListener('scroll', handleResize)
      setViewportOffset(0)
    }
  }, [isOpen])

  const handleSend = async () => {
    const question = input.trim()
    if (!question || isLoading || atLimit) return

    // Add user message
    const newMessages = [...messages, { role: 'user', content: question }]
    setMessages(newMessages)
    setInput('')
    setIsLoading(true)

    try {
      // Build chat history (exclude the welcome message)
      const chatHistory = newMessages
        .slice(1) // skip initial welcome
        .slice(0, -1) // exclude current question (sent separately)
        .map(m => ({ role: m.role, content: m.content }))

      const response = await askBlair(question, userContext, chatHistory)
      setMessages(prev => [...prev, { role: 'assistant', content: response }])

      // Notify parent to increment count
      if (onQuestionAsked) {
        onQuestionAsked()
      }
    } catch (error) {
      console.error('Ask Blair error:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Sorry babe, something went wrong on my end. Try asking again — I'm here."
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-4 sm:right-6 z-50 inline-flex items-center justify-center gap-2 bg-mauve hover:bg-mauve-dark text-cream pl-4 pr-5 py-3 rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 animate-fade-slide-up"
        style={{ fontFamily: 'Inter, sans-serif', lineHeight: 1 }}
      >
        {/* Chat bubble icon */}
        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        <span className="text-sm font-medium leading-none">Ask Blair AI</span>
      </button>
    )
  }

  return (
    <div
      ref={panelRef}
      className="fixed z-50 shadow-2xl flex flex-col"
      style={{
        bottom: `${24 + viewportOffset}px`,
        right: window.innerWidth <= 480 ? '0' : '16px',
        width: window.innerWidth <= 480 ? '100%' : '320px',
        height: window.innerWidth <= 480 ? `calc(100% - ${48 + viewportOffset}px)` : '420px',
        maxHeight: `calc(100vh - ${48 + viewportOffset}px)`,
        borderRadius: window.innerWidth <= 480 ? '16px 16px 0 0' : '12px',
        overflow: 'hidden',
        border: '1px solid rgba(196, 133, 122, 0.3)',
      }}
    >
      {/* Header */}
      <div className="bg-burgundy-light px-4 py-3 flex items-center justify-between border-b border-mauve/20 flex-shrink-0">
        <div>
          <h3 className="font-heading text-cream text-lg leading-tight">Ask Blair AI</h3>
          {!isPaid && (
            <p className="text-cream/40 text-[11px] font-body mt-0.5">
              {questionsUsed}/{maxFreeQuestions} questions used
            </p>
          )}
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-cream/50 hover:text-cream transition-colors p-1.5 -mr-1"
          aria-label="Close chat"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto px-3 sm:px-4 py-3 space-y-3"
        style={{ backgroundColor: '#2a0008' }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] px-3 py-2.5 rounded-xl text-[13px] sm:text-sm font-body leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-mauve/20 text-cream rounded-br-sm'
                  : 'bg-burgundy-light/50 text-cream/90 rounded-bl-sm'
              }`}
            >
              {msg.role === 'assistant' ? renderMessageText(msg.content) : msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-burgundy-light/50 px-3 py-2.5 rounded-xl rounded-bl-sm">
              <span className="text-mauve text-[13px] sm:text-sm animate-pulse-mauve">Blair AI is thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-3 py-3 border-t border-mauve/20 flex-shrink-0" style={{ backgroundColor: '#1a0005' }}>
        {atLimit ? (
          <p className="text-center text-dusty text-[11px] sm:text-xs font-body py-2 leading-relaxed">
            You've used all {maxFreeQuestions} free questions. Upgrade to keep chatting with Blair.
          </p>
        ) : (
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              className="flex-1 px-3 py-2.5 rounded-lg text-[13px] sm:text-sm font-body bg-burgundy/80 border border-mauve/20 text-cream placeholder-cream/30 focus:outline-none focus:border-mauve"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="bg-mauve hover:bg-mauve-dark disabled:opacity-40 text-cream px-3 py-2.5 rounded-lg transition-colors flex-shrink-0"
              aria-label="Send message"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
