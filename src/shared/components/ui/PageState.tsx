interface LoadingPageProps {
  message?: string;
}

export function LoadingPage({ message = 'Cargando…' }: LoadingPageProps) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center px-6" role="status" aria-live="polite">
      <p className="text-lg text-text-muted">{message}</p>
    </div>
  );
}

interface ErrorPageProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorPage({
  title = 'No se pudo cargar',
  message = 'Ha ocurrido un error. Inténtalo de nuevo.',
  onRetry,
}: ErrorPageProps) {
  return (
    <div className="rounded-2xl bg-correction/10 p-6 text-center" role="alert">
      <h2 className="text-xl font-bold text-text-primary">{title}</h2>
      <p className="mt-2 text-lg text-text-muted">{message}</p>
      {onRetry ? (
        <button
          type="button"
          className="mt-4 min-h-touch rounded-xl bg-primary px-6 text-lg font-bold text-white"
          onClick={onRetry}
        >
          Reintentar
        </button>
      ) : null}
    </div>
  );
}
