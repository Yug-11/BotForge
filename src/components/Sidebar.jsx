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
    <aside className="w-full shrink-0 border-b border-slate-200 bg-white px-4 py-6 md:min-h-screen md:w-64 md:border-b-0 md:border-r">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          BotForge
        </p>
        <h1 className="mt-1 text-xl font-bold text-slate-950">AI Studio</h1>
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
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950',
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
