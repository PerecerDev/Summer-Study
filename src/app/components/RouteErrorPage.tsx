import { isRouteErrorResponse, useRouteError } from 'react-router-dom';
import { Button } from '@/shared/components/ui/Button';

export function RouteErrorPage() {
  const error = useRouteError();

  let title = 'Algo ha ido mal';
  let message = 'Ha ocurrido un error inesperado. Inténtalo de nuevo.';

  if (isRouteErrorResponse(error)) {
    title = `Error ${String(error.status)}`;
    message = error.statusText || message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6 text-center">
      <p className="text-4xl" aria-hidden="true">
        😕
      </p>
      <div className="space-y-2">
        <h1 className="text-2xl font-extrabold text-text-primary">{title}</h1>
        <p className="text-lg text-text-muted">{message}</p>
      </div>
      <Button
        type="button"
        className="max-w-xs"
        onClick={() => {
          window.location.assign('/');
        }}
      >
        Volver al inicio
      </Button>
    </div>
  );
}
