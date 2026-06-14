export default function BotCard({ name, description, status }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-slate-950">{name}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {description}
          </p>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          {status}
        </span>
      </div>
    </article>
  )
}
