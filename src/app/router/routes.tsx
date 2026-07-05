import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@/app/layouts/AppLayout';
import { ProtectedRoute } from '@/app/router/ProtectedRoute';
import { LoginPage } from '@/features/auth/components/LoginPage';
import { HomePage } from '@/features/home/components/HomePage';
import { ProfilePage } from '@/features/profile';
import { PlaceholderPage } from '@/shared/components/PlaceholderPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <AppLayout />,
        children: [
          { index: true, element: <HomePage /> },
          {
            path: 'history',
            element: (
              <PlaceholderPage
                title="Historial"
                description="Listado de rondas completadas — pendiente (Epic E5)."
              />
            ),
          },
          {
            path: 'progress',
            element: (
              <PlaceholderPage
                title="Progreso"
                description="Estadísticas de avance — pendiente (Fase 2)."
              />
            ),
          },
          {
            path: 'achievements',
            element: (
              <PlaceholderPage
                title="Logros"
                description="Insignias y logros — pendiente (Fase 2)."
              />
            ),
          },
          {
            path: 'profile',
            element: <ProfilePage />,
          },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);
