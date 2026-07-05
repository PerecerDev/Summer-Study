import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSession } from '@/features/auth/hooks/useAuth';
import { LoadingPage } from '@/shared/components/ui/PageState';

export function ProtectedRoute() {
  const location = useLocation();
  const sessionQuery = useSession();

  if (sessionQuery.isLoading) {
    return <LoadingPage message="Comprobando sesión…" />;
  }

  if (sessionQuery.isError) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!sessionQuery.data?.isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
