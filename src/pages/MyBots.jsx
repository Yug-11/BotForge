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
        <h2 className="text-2xl font-bold text-white">My Bots</h2>
        <p className="mt-1 text-[#94A3B8]">
          Bots created and saved by the FastAPI backend.
        </p>
      </div>

      {isLoading && (
        <div className="rounded-lg border border-[#26354F] bg-[#1B2740] p-6 text-sm text-[#94A3B8] shadow-[0_18px_45px_rgba(0,0,0,0.28)]">
          Loading bots...
        </div>
      )}

      {!isLoading && error && (
        <div className="rounded-lg border border-[#EF4444]/40 bg-[#EF4444]/10 p-6 text-sm text-[#EF4444]">
          {error}
        </div>
      )}

      {!isLoading && !error && bots.length === 0 && (
        <div className="rounded-lg border border-[#26354F] bg-[#1B2740] p-6 text-sm text-[#94A3B8] shadow-[0_18px_45px_rgba(0,0,0,0.28)]">
          No bots created yet.
        </div>
      )}

      {!isLoading && !error && bots.length > 0 && (
        <div className="grid gap-4 lg:grid-cols-2">
          {bots.map((bot) => (
            <article
              key={`${bot.bot_name}-${bot.type}`}
              className="rounded-lg border border-[#26354F] bg-[#1B2740] p-5 shadow-[0_18px_45px_rgba(0,0,0,0.28)] transition hover:border-[#7C3AED] hover:bg-[#1B2740]"
            >
              <h3 className="text-base font-semibold text-white">
                {bot.bot_name}
              </h3>
              <p className="mt-2 text-sm capitalize text-[#94A3B8]">
                {bot.type}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
