import { Outlet, useNavigate } from 'react-router-dom';

export function ParentLayout() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto min-h-screen max-w-content bg-background px-4 py-6">
      <header className="mb-8 space-y-3">
        <button
          type="button"
          className="min-h-touch rounded-xl px-2 text-lg font-semibold text-primary"
          onClick={() => {
            navigate('/profile');
          }}
        >
          ← Volver al perfil
        </button>
        <div>
          <h1 className="text-3xl font-extrabold text-text-primary">Panel de padres</h1>
          <p className="text-lg text-text-muted">Resumen de práctica y materias</p>
        </div>
      </header>

      <main id="parent-content">
        <Outlet />
      </main>
    </div>
  );
}
