interface SplashScreenProps {
  message?: string;
}

export function SplashScreen({ message = 'Cargando…' }: SplashScreenProps) {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center bg-background px-6"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div
        className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary text-3xl font-extrabold text-white motion-safe:animate-pulse"
        aria-hidden="true"
      >
        S
      </div>
      <h1 className="text-3xl font-extrabold text-text-primary">Summer Study</h1>
      <p className="mt-2 text-lg text-text-muted">{message}</p>
    </div>
  );
}
