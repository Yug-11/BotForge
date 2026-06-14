import { useEffect, useState } from 'react'

import LoadingSpinner from '../components/LoadingSpinner.jsx'
import { getBots } from '../services/botService.js'
import { chat as sendChatMessage } from '../services/chatService.js'

export default function Chat() {
  const [bots, setBots] = useState([])
  const [selectedBotName, setSelectedBotName] = useState('')
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [isLoadingBots, setIsLoadingBots] = useState(true)
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
    setAnswer('')

    try {
      const response = await sendChatMessage(selectedBotName, trimmedQuestion)
      setAnswer(response.answer)
      setQuestion('')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <section className="max-w-2xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-950">Chat</h2>
      <p className="mt-2 text-slate-600">
        Ask a saved bot a question and get an AI response.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="selected-bot"
            className="block text-sm font-medium text-slate-700"
          >
            Select Bot
          </label>
          <select
            id="selected-bot"
            value={selectedBotName}
            onChange={(event) => setSelectedBotName(event.target.value)}
            disabled={isLoadingBots || isSending || bots.length === 0}
            className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-100"
          >
            {bots.length === 0 ? (
              <option value="">No bots available</option>
            ) : (
              bots.map((bot) => (
                <option key={`${bot.bot_name}-${bot.type}`} value={bot.bot_name}>
                  {bot.bot_name}
                </option>
              ))
            )}
          </select>
        </div>

        <div>
          <label
            htmlFor="question"
            className="block text-sm font-medium text-slate-700"
          >
            Ask a question
          </label>
          <input
            id="question"
            type="text"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="What can this bot help me with?"
            disabled={isSending}
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-100"
          />
        </div>

        {error && (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isLoadingBots || isSending || bots.length === 0}
            className="rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            Send
          </button>

          {isSending && <LoadingSpinner />}
        </div>
      </form>

      {isLoadingBots && (
        <p className="mt-4 text-sm text-slate-600">Loading bots...</p>
      )}

      {!isLoadingBots && bots.length === 0 && !error && (
        <p className="mt-4 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
          No bots available. Create a bot first.
        </p>
      )}

      {answer && (
        <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-sm font-semibold text-slate-950">AI Response</h3>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
            {answer}
          </p>
        </div>
      )}
    </section>
  )
}
