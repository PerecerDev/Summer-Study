import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSession } from '@/features/auth/hooks/useAuth';

export function ProtectedRoute() {
  const location = useLocation();
  const sessionQuery = useSession();

  if (sessionQuery.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-text-muted">Cargando…</p>
      </div>
    );
  }

  if (!sessionQuery.data?.isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
