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
        <h2 className="text-2xl font-bold text-white">Dashboard</h2>
        <p className="mt-1 text-[#94A3B8]">
          Overview placeholder for your BotForge AI workspace.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="rounded-lg border border-[#26354F] bg-[#1B2740] p-6 shadow-[0_18px_45px_rgba(0,0,0,0.28)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">
              Backend Connection
            </h3>
            <p className="mt-1 text-sm text-[#94A3B8]">
              Fetch bots from the FastAPI backend.
            </p>
          </div>

          <button
            type="button"
            onClick={handleTestBackendConnection}
            disabled={isLoading}
            className="rounded-md bg-[#7C3AED] px-4 py-2 text-sm font-medium text-white shadow-[0_0_22px_rgba(124,58,237,0.28)] transition hover:bg-[#8B5CF6] hover:shadow-[0_0_28px_rgba(124,58,237,0.42)] disabled:cursor-not-allowed disabled:bg-[#26354F] disabled:text-[#94A3B8] disabled:shadow-none"
          >
            {isLoading ? 'Loading...' : 'Test Backend Connection'}
          </button>
        </div>

        {error && (
          <p className="mt-4 rounded-md border border-[#EF4444]/40 bg-[#EF4444]/10 px-3 py-2 text-sm text-[#EF4444]">
            {error}
          </p>
        )}

        {bots.length > 0 && (
          <div className="mt-4 space-y-3">
            {bots.map((bot) => (
              <div
                key={`${bot.bot_name}-${bot.type}`}
                className="rounded-md border border-[#26354F] bg-[#071126]/40 px-4 py-3 transition hover:border-[#7C3AED] hover:bg-[#7C3AED]/10"
              >
                <p className="font-medium text-white">{bot.bot_name}</p>
                <p className="text-sm capitalize text-[#94A3B8]">
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
