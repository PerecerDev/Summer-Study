import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@/app/layouts/AppLayout';
import { HomePage } from '@/features/home/components/HomePage';
import { PlaceholderPage } from '@/shared/components/PlaceholderPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <PlaceholderPage
        title="Iniciar sesión"
        description="Pantalla de login — pendiente de implementación (Epic E2)."
      />
    ),
  },
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
        element: (
          <PlaceholderPage
            title="Perfil"
            description="Perfil del estudiante — pendiente (Epic E6)."
          />
        ),
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);
