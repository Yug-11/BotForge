import { useEffect, useRef, useState } from 'react'

import LoadingSpinner from '../components/LoadingSpinner.jsx'
import { getBots } from '../services/botService.js'
import {
  chat as sendChatMessage,
  clearChatHistory,
  getChatHistory,
} from '../services/chatService.js'

function createLocalMessage(role, content) {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    role,
    content,
    timestamp: new Date().toISOString(),
  }
}

function formatTimestamp(timestamp) {
  const date = new Date(timestamp)

  if (Number.isNaN(date.getTime())) {
    return timestamp
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

export default function Chat() {
  const messagesEndRef = useRef(null)
  const [bots, setBots] = useState([])
  const [selectedBotName, setSelectedBotName] = useState('')
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState([])
  const [isLoadingBots, setIsLoadingBots] = useState(true)
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadBots() {
      setIsLoadingBots(true)
      setError('')

      try {
        const returnedBots = await getBots()

        if (isMounted) {
          setBots(returnedBots)
          setSelectedBotName(returnedBots[0]?.bot_name ?? '')
        }
      } catch (requestError) {
        if (isMounted) {
          setBots([])
          setError(requestError.message)
        }
      } finally {
        if (isMounted) {
          setIsLoadingBots(false)
        }
      }
    }

    loadBots()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    async function loadHistory() {
      if (!selectedBotName) {
        setMessages([])
        return
      }

      setIsLoadingHistory(true)
      setError('')

      try {
        const history = await getChatHistory(selectedBotName)

        if (isMounted) {
          setMessages(history.messages || [])
        }
      } catch (requestError) {
        if (isMounted) {
          setMessages([])
          setError(requestError.message)
        }
      } finally {
        if (isMounted) {
          setIsLoadingHistory(false)
        }
      }
    }

    loadHistory()

    return () => {
      isMounted = false
    }
  }, [selectedBotName])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isSending])

  function handleNewChat() {
    setQuestion('')
    setError('')
    setMessages([])
  }

  async function handleClearHistory() {
    if (!selectedBotName) {
      setError('Select a bot before clearing history.')
      return
    }

    setIsLoadingHistory(true)
    setError('')

    try {
      await clearChatHistory(selectedBotName)
      setMessages([])
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsLoadingHistory(false)
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const trimmedQuestion = question.trim()
    if (!selectedBotName) {
      setError('Select a bot before sending a message.')
      return
    }

    if (!trimmedQuestion) {
      setError('Ask a question before sending.')
      return
    }

    setIsSending(true)
    setError('')
    setMessages((currentMessages) => [
      ...currentMessages,
      createLocalMessage('user', trimmedQuestion),
    ])

    try {
      const response = await sendChatMessage(selectedBotName, trimmedQuestion)
      setMessages((currentMessages) => [
        ...currentMessages,
        createLocalMessage('assistant', response.answer),
      ])
      setQuestion('')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <section className="grid min-h-[calc(100vh-9rem)] overflow-hidden rounded-lg border border-[#26354F] bg-[#1B2740] shadow-[0_18px_45px_rgba(0,0,0,0.28)] lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="border-b border-[#26354F] bg-[#08101F] p-4 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white">Chats</h2>
            <p className="mt-1 text-sm text-[#94A3B8]">Select a bot.</p>
          </div>
          <button
            type="button"
            onClick={handleNewChat}
            disabled={!selectedBotName || isSending}
            className="rounded-md border border-[#26354F] px-3 py-2 text-sm font-medium text-white transition hover:border-[#7C3AED] hover:bg-[#7C3AED]/20 disabled:cursor-not-allowed disabled:text-[#94A3B8]"
          >
            New Chat
          </button>
        </div>

        <div className="mt-4 space-y-2">
          {isLoadingBots && (
            <p className="text-sm text-[#94A3B8]">Loading bots...</p>
          )}

          {!isLoadingBots && bots.length === 0 && (
            <p className="rounded-md border border-[#26354F] bg-[#071126]/40 px-3 py-2 text-sm text-[#94A3B8]">
              No bots available. Create a bot first.
            </p>
          )}

          {bots.map((bot) => {
            const isSelected = bot.bot_name === selectedBotName

            return (
              <button
                key={`${bot.bot_name}-${bot.type}`}
                type="button"
                onClick={() => setSelectedBotName(bot.bot_name)}
                disabled={isSending}
                className={[
                  'w-full rounded-md border px-3 py-3 text-left transition',
                  isSelected
                    ? 'border-[#7C3AED] bg-[#7C3AED]/20 text-white shadow-[0_0_22px_rgba(124,58,237,0.2)]'
                    : 'border-[#26354F] bg-[#071126]/40 text-[#94A3B8] hover:border-[#7C3AED] hover:text-white',
                ].join(' ')}
              >
                <span className="block text-sm font-semibold">
                  {bot.bot_name}
                </span>
                <span className="mt-1 block text-xs capitalize text-[#94A3B8]">
                  {bot.type}
                </span>
              </button>
            )
          })}
        </div>
      </aside>

      <div className="flex min-h-0 flex-col">
        <header className="flex flex-col gap-3 border-b border-[#26354F] bg-[#1B2740] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {selectedBotName || 'Chat'}
            </h2>
            <p className="mt-1 text-sm text-[#94A3B8]">
              Ask a saved bot a question and review previous messages.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClearHistory}
            disabled={!selectedBotName || isLoadingHistory || isSending}
            className="rounded-md border border-[#EF4444]/40 px-4 py-2 text-sm font-medium text-[#EF4444] transition hover:bg-[#EF4444]/10 disabled:cursor-not-allowed disabled:border-[#26354F] disabled:text-[#94A3B8]"
          >
            Clear History
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto bg-[#071126] p-4">
          {error && (
            <p className="mb-4 rounded-md border border-[#EF4444]/40 bg-[#EF4444]/10 px-3 py-2 text-sm text-[#EF4444]">
              {error}
            </p>
          )}

          {isLoadingHistory && (
            <div className="flex items-center gap-3 text-sm text-[#94A3B8]">
              <LoadingSpinner />
              Loading chat history...
            </div>
          )}

          {!isLoadingHistory && selectedBotName && messages.length === 0 && (
            <div className="mx-auto mt-16 max-w-md text-center">
              <h3 className="text-lg font-semibold text-white">
                Start a conversation
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#94A3B8]">
                Previous messages for this bot will appear here after you send
                your first question.
              </p>
            </div>
          )}

          {!isLoadingHistory && !selectedBotName && (
            <div className="mx-auto mt-16 max-w-md text-center">
              <h3 className="text-lg font-semibold text-white">Select a bot</h3>
              <p className="mt-2 text-sm leading-6 text-[#94A3B8]">
                Choose a bot from the sidebar to load its saved chat history.
              </p>
            </div>
          )}

          <div className="mx-auto flex max-w-3xl flex-col gap-5">
            {messages.map((message) => {
              const isUser = message.role === 'user'

              return (
                <article
                  key={message.id}
                  className={[
                    'flex',
                    isUser ? 'justify-end' : 'justify-start',
                  ].join(' ')}
                >
                  <div
                    className={[
                      'max-w-[85%] rounded-2xl border px-4 py-3 shadow-[0_12px_30px_rgba(0,0,0,0.24)]',
                      isUser
                        ? 'border-[#7C3AED]/40 bg-[#7C3AED] text-white'
                        : 'border-[#26354F] bg-[#1B2740] text-white',
                    ].join(' ')}
                  >
                    <div className="mb-2 flex items-center justify-between gap-4 text-xs">
                      <span className="font-semibold">
                        {isUser ? 'You' : 'Assistant'}
                      </span>
                      <time
                        dateTime={message.timestamp}
                        className={isUser ? 'text-white/75' : 'text-[#94A3B8]'}
                      >
                        {formatTimestamp(message.timestamp)}
                      </time>
                    </div>
                    <p className="whitespace-pre-wrap text-sm leading-6">
                      {message.content}
                    </p>
                  </div>
                </article>
              )
            })}

            {isSending && (
              <div className="flex items-center gap-3 text-sm text-[#94A3B8]">
                <LoadingSpinner />
                Assistant is responding...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        <form
          className="border-t border-[#26354F] bg-[#1B2740] p-4"
          onSubmit={handleSubmit}
        >
          <div className="mx-auto flex max-w-3xl gap-3">
            <input
              id="question"
              type="text"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Ask a question..."
              disabled={isSending || !selectedBotName}
              className="min-w-0 flex-1 rounded-md border border-[#26354F] bg-[#071126]/60 px-3 py-3 text-white outline-none transition placeholder:text-[#94A3B8] focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 disabled:cursor-not-allowed disabled:bg-[#26354F] disabled:text-[#94A3B8]"
            />
            <button
              type="submit"
              disabled={isLoadingBots || isSending || bots.length === 0}
              className="rounded-md bg-[#7C3AED] px-5 py-3 text-sm font-medium text-white shadow-[0_0_22px_rgba(124,58,237,0.28)] transition hover:bg-[#8B5CF6] hover:shadow-[0_0_28px_rgba(124,58,237,0.42)] disabled:cursor-not-allowed disabled:bg-[#26354F] disabled:text-[#94A3B8] disabled:shadow-none"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
