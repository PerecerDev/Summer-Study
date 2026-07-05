import { Navigate } from 'react-router-dom';
import { SplashScreen } from '@/app/components/SplashScreen';
import { LoginForm } from './LoginForm';
import { useSession } from '../hooks/useAuth';

export function LoginPage() {
  const sessionQuery = useSession();

  if (sessionQuery.isLoading) {
    return <SplashScreen message="Comprobando sesión…" />;
  }

  if (sessionQuery.data?.isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-content flex-col justify-center px-4 py-8">
      <main id="main-content">
      <header className="mb-8 space-y-2 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-2xl font-extrabold text-white">
          S
        </div>
        <h1 className="text-3xl font-extrabold text-text-primary">Summer Study</h1>
        <p className="text-lg text-text-muted">Inicia sesión para empezar a practicar</p>
      </header>

      <LoginForm />

      <p className="mt-6 text-center text-base text-text-muted">
        Si no recuerdas tu contraseña, pide ayuda a papá o mamá.
      </p>
      </main>
    </div>
  );
}
