'use client'

import { useState, useRef, useEffect } from 'react'
import {
  MessageCircle,
  X,
  Send,
  Loader2,
  Sparkles,
  HelpCircle,
  ChevronDown,
  Bot,
  User
} from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ChatWidgetProps {
  dashboardContext?: string
}

const SUGGESTED_QUESTIONS = [
  "What does our completion rate mean for Star Ratings?",
  "Explain the AIM ROI calculation",
  "What are the 2025 CMS eligibility changes?",
  "How can we improve our refusal rate?",
  "Which members should we prioritize?"
]

export function ChatWidget({ dashboardContext }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [showWelcome, setShowWelcome] = useState(true)
  const [hasInteracted, setHasInteracted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Hide welcome tooltip after 8 seconds or on first interaction
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false)
    }, 8000)
    return () => clearTimeout(timer)
  }, [])

  // Hide welcome when chat is opened
  useEffect(() => {
    if (isOpen || hasInteracted) {
      setShowWelcome(false)
    }
  }, [isOpen, hasInteracted])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setShowSuggestions(false)
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
          dashboardContext
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response')
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const handleSuggestionClick = (question: string) => {
    sendMessage(question)
  }

  const clearChat = () => {
    setMessages([])
    setShowSuggestions(true)
    setError(null)
  }

  const handleOpenChat = () => {
    setHasInteracted(true)
    setIsOpen(!isOpen)
  }

  return (
    <>
      {/* Welcome Tooltip - shows briefly on load */}
      {showWelcome && !isOpen && (
        <div className="fixed bottom-24 right-6 z-50 animate-fade-in print:hidden">
          <div className="bg-white rounded-lg shadow-xl border border-purple-200 p-4 max-w-xs">
            <div className="flex items-start gap-3">
              <div className="bg-purple-100 p-2 rounded-full">
                <Sparkles className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">AI Analytics Assistant</p>
                <p className="text-gray-600 text-xs mt-1">
                  Ask me questions about your MTM metrics, Star Ratings, or get insights from your data.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowWelcome(false)}
                className="text-gray-400 hover:text-gray-600 -mt-1 -mr-1"
                aria-label="Dismiss welcome message"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {/* Arrow pointing to button */}
            <div className="absolute -bottom-2 right-10 w-4 h-4 bg-white border-r border-b border-purple-200 transform rotate-45"></div>
          </div>
        </div>
      )}

      {/* Chat Toggle Button - Enhanced with label and animation */}
      <div className="fixed bottom-6 right-6 z-50 print:hidden">
        {/* Label badge - always visible when closed */}
        {!isOpen && (
          <div className="absolute -top-2 -left-2 bg-purple-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-md animate-bounce-subtle">
            AI
          </div>
        )}

        <button
          type="button"
          onClick={handleOpenChat}
          className={`relative p-4 rounded-full shadow-lg transition-all duration-300 ${
            isOpen
              ? 'bg-gray-600 hover:bg-gray-700'
              : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 hover:scale-110'
          } ${!isOpen && !hasInteracted ? 'animate-pulse-ring' : ''}`}
          aria-label={isOpen ? 'Close chat' : 'Open AI analytics assistant'}
        >
          {isOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <div className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-white" />
            </div>
          )}
        </button>

        {/* Hover label */}
        {!isOpen && (
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity hidden md:block">
            Ask AI Assistant
          </div>
        )}
      </div>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-h-[600px] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-1.5 rounded-lg">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">MTM Analytics Assistant</h3>
                <p className="text-white/70 text-xs">Powered by Claude</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {messages.length > 0 && (
                <button
                  onClick={clearChat}
                  className="text-white/70 hover:text-white text-xs"
                >
                  Clear
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white"
              >
                <ChevronDown className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] max-h-[400px]">
            {messages.length === 0 && showSuggestions && (
              <div className="space-y-4">
                <div className="text-center py-4">
                  <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Bot className="h-6 w-6 text-purple-600" />
                  </div>
                  <h4 className="font-medium text-gray-900">How can I help?</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    Ask me about your MTM metrics, Star Ratings, or how to improve outcomes.
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Suggested Questions
                  </p>
                  {SUGGESTED_QUESTIONS.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(question)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 bg-gray-50 hover:bg-purple-50 hover:text-purple-700 rounded-lg transition-colors flex items-start gap-2"
                    >
                      <HelpCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-gray-400" />
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === 'user'
                      ? 'bg-blue-100'
                      : 'bg-purple-100'
                  }`}
                >
                  {message.role === 'user' ? (
                    <User className="h-4 w-4 text-blue-600" />
                  ) : (
                    <Bot className="h-4 w-4 text-purple-600" />
                  )}
                </div>
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-md'
                      : 'bg-gray-100 text-gray-800 rounded-bl-md'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.role === 'user' ? 'text-blue-200' : 'text-gray-400'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-purple-600" />
                </div>
                <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-md">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
                    <span className="text-sm text-gray-500">Analyzing...</span>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
                <p className="text-xs text-red-500 mt-1">
                  Make sure ANTHROPIC_API_KEY is configured in your environment.
                </p>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your MTM data..."
                disabled={isLoading}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              AI responses are based on your current dashboard data
            </p>
          </form>
        </div>
      )}
    </>
  )
}
