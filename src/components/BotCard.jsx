export default function BotCard({ name, description, status }) {
  return (
    <article className="rounded-lg border border-[#26354F] bg-[#1B2740] p-5 shadow-[0_18px_45px_rgba(0,0,0,0.28)] transition hover:border-[#7C3AED]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-white">{name}</h3>
          <p className="mt-2 text-sm leading-6 text-[#94A3B8]">
            {description}
          </p>
        </div>
        <span className="rounded-full border border-[#10B981]/40 bg-[#10B981]/10 px-3 py-1 text-xs font-semibold text-[#10B981]">
          {status}
        </span>
      </div>
    </article>
  )
}
