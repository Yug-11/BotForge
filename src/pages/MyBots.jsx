import { useEffect, useState } from 'react'

import { getBots } from '../services/botService.js'

export default function MyBots() {
  const [bots, setBots] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadCreatedBots() {
      setIsLoading(true)
      setError('')

      try {
        const returnedBots = await getBots()

        if (isMounted) {
          setBots(returnedBots)
        }
      } catch (requestError) {
        if (isMounted) {
          setBots([])
          setError(requestError.message)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadCreatedBots()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-950">My Bots</h2>
        <p className="mt-1 text-slate-600">
          Bots created and saved by the FastAPI backend.
        </p>
      </div>

      {isLoading && (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          Loading bots...
        </div>
      )}

      {!isLoading && error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          {error}
        </div>
      )}

      {!isLoading && !error && bots.length === 0 && (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          No bots created yet.
        </div>
      )}

      {!isLoading && !error && bots.length > 0 && (
        <div className="grid gap-4 lg:grid-cols-2">
          {bots.map((bot) => (
            <article
              key={`${bot.bot_name}-${bot.type}`}
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
            >
              <h3 className="text-base font-semibold text-slate-950">
                {bot.bot_name}
              </h3>
              <p className="mt-2 text-sm capitalize text-slate-600">
                {bot.type}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
