import { lazy, Suspense, type ReactNode } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { RouteErrorPage } from '@/app/components/RouteErrorPage';
import { AppLayout } from '@/app/layouts/AppLayout';
import { ParentLayout } from '@/app/layouts/ParentLayout';
import { ParentRoute } from '@/app/router/ParentRoute';
import { ProtectedRoute } from '@/app/router/ProtectedRoute';
import { LoginPage } from '@/features/auth/components/LoginPage';
import { LoadingPage } from '@/shared/components/ui/PageState';

const HomePage = lazy(async () => {
  const module = await import('@/features/home/components/HomePage');
  return { default: module.HomePage };
});

const HistoryPage = lazy(async () => {
  const module = await import('@/features/history');
  return { default: module.HistoryPage };
});

const RoundDetailPage = lazy(async () => {
  const module = await import('@/features/history');
  return { default: module.RoundDetailPage };
});

const ProgressPage = lazy(async () => {
  const module = await import('@/features/gamification');
  return { default: module.ProgressPage };
});

const AchievementsPage = lazy(async () => {
  const module = await import('@/features/gamification');
  return { default: module.AchievementsPage };
});

const ProfilePage = lazy(async () => {
  const module = await import('@/features/profile');
  return { default: module.ProfilePage };
});

const ParentOverviewPage = lazy(async () => {
  const module = await import('@/features/parent');
  return { default: module.ParentOverviewPage };
});

const RoundPage = lazy(async () => {
  const module = await import('@/features/rounds');
  return { default: module.RoundPage };
});

const ResultsPage = lazy(async () => {
  const module = await import('@/features/rounds');
  return { default: module.ResultsPage };
});

function withSuspense(element: ReactNode) {
  return <Suspense fallback={<LoadingPage />}>{element}</Suspense>;
}

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
            element: withSuspense(<RoundPage />),
          },
          {
            path: '/round/:roundId/results',
            element: withSuspense(<ResultsPage />),
          },
          {
            path: '/parent',
            element: <ParentRoute />,
            children: [
              {
                element: <ParentLayout />,
                children: [{ index: true, element: withSuspense(<ParentOverviewPage />) }],
              },
            ],
          },
          {
            path: '/',
            element: <AppLayout />,
            children: [
              { index: true, element: withSuspense(<HomePage />) },
              { path: 'history', element: withSuspense(<HistoryPage />) },
              { path: 'history/:roundId', element: withSuspense(<RoundDetailPage />) },
              { path: 'progress', element: withSuspense(<ProgressPage />) },
              { path: 'achievements', element: withSuspense(<AchievementsPage />) },
              {
                path: 'profile',
                element: withSuspense(<ProfilePage />),
              },
            ],
          },
        ],
      },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);
