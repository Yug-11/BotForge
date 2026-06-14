import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { createTopicBot } from '../services/botService.js'

export default function CreateTopicBot() {
  const navigate = useNavigate()
  const [botName, setBotName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()

    const trimmedBotName = botName.trim()
    if (!trimmedBotName) {
      setError('Bot name is required.')
      return
    }

    setIsSubmitting(true)
    setError('')
    setSuccessMessage('')

    try {
      await createTopicBot(trimmedBotName)
      setSuccessMessage('Bot created successfully.')
      setTimeout(() => {
        navigate('/my-bots')
      }, 700)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="max-w-xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-950">Create Topic Bot</h2>
      <p className="mt-2 text-slate-600">
        Create a saved topic bot that can be listed from the backend.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="bot-name"
            className="block text-sm font-medium text-slate-700"
          >
            Bot Name
          </label>
          <input
            id="bot-name"
            type="text"
            value={botName}
            onChange={(event) => setBotName(event.target.value)}
            placeholder="IPL Bot"
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-200"
            disabled={isSubmitting}
          />
        </div>

        {error && (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        {successMessage && (
          <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {successMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isSubmitting ? 'Creating...' : 'Create Bot'}
        </button>
      </form>
    </section>
  )
}
