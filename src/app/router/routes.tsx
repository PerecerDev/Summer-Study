import { createBrowserRouter, Navigate } from 'react-router-dom';
import { RouteErrorPage } from '@/app/components/RouteErrorPage';
import { AppLayout } from '@/app/layouts/AppLayout';
import { ProtectedRoute } from '@/app/router/ProtectedRoute';
import { LoginPage } from '@/features/auth/components/LoginPage';
import { HistoryPage, RoundDetailPage } from '@/features/history';
import { HomePage } from '@/features/home/components/HomePage';
import { ProfilePage } from '@/features/profile';
import { ResultsPage, RoundPage } from '@/features/rounds';
import { PlaceholderPage } from '@/shared/components/PlaceholderPage';

export const router = createBrowserRouter([
  {
    errorElement: <RouteErrorPage />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: '/round/:roundId',
            element: <RoundPage />,
          },
          {
            path: '/round/:roundId/results',
            element: <ResultsPage />,
          },
          {
            path: '/',
            element: <AppLayout />,
            children: [
              { index: true, element: <HomePage /> },
              { path: 'history', element: <HistoryPage /> },
              { path: 'history/:roundId', element: <RoundDetailPage /> },
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
    ],
  },
]);
