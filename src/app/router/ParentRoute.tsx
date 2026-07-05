import { Navigate, Outlet } from 'react-router-dom';
import { useParentAuthStore } from '@/features/auth/stores/parentAuthStore';

export function ParentRoute() {
  const isParentAuthenticated = useParentAuthStore((state) => state.isParentAuthenticated);

  if (!isParentAuthenticated()) {
    return <Navigate to="/profile" replace />;
  }

  return <Outlet />;
}
