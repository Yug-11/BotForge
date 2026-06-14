import { useState } from 'react'

import StatCard from '../components/StatCard.jsx'
import { getBots } from '../services/botService.js'

const stats = [
  { label: 'Active Bots', value: '12', detail: 'Ready to answer users' },
  { label: 'Conversations', value: '248', detail: 'Across all bot sessions' },
  { label: 'Knowledge Sources', value: '7', detail: 'Topics and PDFs indexed' },
]

export default function Dashboard() {
  const [bots, setBots] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleTestBackendConnection() {
    setIsLoading(true)
    setError('')

    try {
      const returnedBots = await getBots()
      setBots(returnedBots)
    } catch (requestError) {
      setBots([])
      setError(requestError.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-950">Dashboard</h2>
        <p className="mt-1 text-slate-600">
          Overview placeholder for your BotForge AI workspace.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-950">
              Backend Connection
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Fetch bots from the FastAPI backend.
            </p>
          </div>

          <button
            type="button"
            onClick={handleTestBackendConnection}
            disabled={isLoading}
            className="rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isLoading ? 'Loading...' : 'Test Backend Connection'}
          </button>
        </div>

        {error && (
          <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        {bots.length > 0 && (
          <div className="mt-4 space-y-3">
            {bots.map((bot) => (
              <div
                key={`${bot.bot_name}-${bot.type}`}
                className="rounded-md border border-slate-200 px-4 py-3"
              >
                <p className="font-medium text-slate-950">{bot.bot_name}</p>
                <p className="text-sm capitalize text-slate-600">
                  {bot.type}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
