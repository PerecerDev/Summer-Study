import { createBrowserRouter, Navigate } from 'react-router-dom';
import { RouteErrorPage } from '@/app/components/RouteErrorPage';
import { AppLayout } from '@/app/layouts/AppLayout';
import { ParentLayout } from '@/app/layouts/ParentLayout';
import { ParentRoute } from '@/app/router/ParentRoute';
import { ProtectedRoute } from '@/app/router/ProtectedRoute';
import { LoginPage } from '@/features/auth/components/LoginPage';
import { HistoryPage, RoundDetailPage } from '@/features/history';
import { AchievementsPage, ProgressPage } from '@/features/gamification';
import { HomePage } from '@/features/home/components/HomePage';
import { ParentOverviewPage } from '@/features/parent';
import { ProfilePage } from '@/features/profile';
import { ResultsPage, RoundPage } from '@/features/rounds';

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
            path: '/parent',
            element: <ParentRoute />,
            children: [
              {
                element: <ParentLayout />,
                children: [{ index: true, element: <ParentOverviewPage /> }],
              },
            ],
          },
          {
            path: '/',
            element: <AppLayout />,
            children: [
              { index: true, element: <HomePage /> },
              { path: 'history', element: <HistoryPage /> },
              { path: 'history/:roundId', element: <RoundDetailPage /> },
              { path: 'progress', element: <ProgressPage /> },
              { path: 'achievements', element: <AchievementsPage /> },
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
