import { NavLink, Outlet } from 'react-router-dom';

const tabs = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/history', label: 'Historial', end: false },
  { to: '/progress', label: 'Progreso', end: false },
  { to: '/achievements', label: 'Logros', end: false },
  { to: '/profile', label: 'Perfil', end: false },
] as const;

export function AppLayout() {
  return (
    <div className="mx-auto flex min-h-screen max-w-content flex-col px-4 pb-24 pt-6">
      <main className="flex-1">
        <Outlet />
      </main>

      <nav
        className="fixed bottom-0 left-0 right-0 border-t border-black/5 bg-surface"
        aria-label="Navegación principal"
      >
        <ul className="mx-auto flex max-w-content justify-between gap-1 px-2 py-2">
          {tabs.map((tab) => (
            <li key={tab.to} className="flex-1">
              <NavLink
                to={tab.to}
                end={tab.end}
                className={({ isActive }) =>
                  [
                    'flex min-h-touch-lg flex-col items-center justify-center rounded-xl px-1 text-sm font-bold transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-text-muted hover:bg-black/5',
                  ].join(' ')
                }
              >
                {tab.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
