import { NavLink } from 'react-router-dom'

const links = [
  { label: 'Dashboard', to: '/' },
  { label: 'Create Topic Bot', to: '/create-topic-bot' },
  { label: 'Create PDF Bot', to: '/create-pdf-bot' },
  { label: 'Chat', to: '/chat' },
  { label: 'My Bots', to: '/my-bots' },
]

export default function Sidebar() {
  return (
    <aside className="w-full shrink-0 border-b border-[#26354F] bg-[#08101F] px-4 py-6 shadow-[0_18px_45px_rgba(0,0,0,0.28)] md:min-h-screen md:w-64 md:border-b-0 md:border-r">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#A855F7]">
          BotForge
        </p>
        <h1 className="mt-1 text-xl font-bold text-white">AI Studio</h1>
      </div>

      <nav
        className="grid gap-1 sm:grid-cols-2 md:block md:space-y-1"
        aria-label="Primary navigation"
      >
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              [
                'block rounded-md px-3 py-2 text-sm font-medium transition',
                isActive
                  ? 'bg-[#7C3AED] text-white shadow-[0_0_22px_rgba(124,58,237,0.35)]'
                  : 'text-[#94A3B8] hover:bg-[#1B2740] hover:text-white',
              ].join(' ')
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
