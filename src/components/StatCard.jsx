export default function StatCard({ label, value, detail }) {
  return (
    <article className="rounded-lg border border-[#26354F] bg-[#1B2740] p-5 shadow-[0_18px_45px_rgba(0,0,0,0.28)] transition hover:border-[#7C3AED]">
      <p className="text-sm font-medium text-[#94A3B8]">{label}</p>
      <p className="mt-2 text-3xl font-bold text-white">{value}</p>
      <p className="mt-2 text-sm text-[#94A3B8]">{detail}</p>
    </article>
  )
}
