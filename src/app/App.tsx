import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { AppBoot } from '@/app/components/AppBoot';
import { AppErrorBoundary } from '@/app/components/AppErrorBoundary';
import { SkipLink } from '@/app/components/SkipLink';
import { router } from '@/app/router/routes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
    },
  },
});

export function App() {
  return (
    <AppErrorBoundary>
      <SkipLink />
      <QueryClientProvider client={queryClient}>
        <AppBoot>
          <RouterProvider router={router} />
        </AppBoot>
      </QueryClientProvider>
    </AppErrorBoundary>
  );
}
