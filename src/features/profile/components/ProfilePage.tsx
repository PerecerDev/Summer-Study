import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ParentGateModal } from '@/features/auth/components/ParentGateModal';
import { useLogout, useSession } from '@/features/auth/hooks/useAuth';
import { useParentAuthStore } from '@/features/auth/stores/parentAuthStore';
import { Button } from '@/shared/components/ui/Button';

export function ProfilePage() {
  const navigate = useNavigate();
  const sessionQuery = useSession();
  const logoutMutation = useLogout();
  const clearParentAuth = useParentAuthStore((state) => state.clearParentAuth);
  const isParentAuthenticated = useParentAuthStore((state) => state.isParentAuthenticated);
  const [isParentGateOpen, setIsParentGateOpen] = useState(false);

  const user = sessionQuery.data?.user;

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        clearParentAuth();
        navigate('/login', { replace: true });
      },
    });
  };

  return (
    <section className="space-y-8 py-4">
      <header className="space-y-2">
        <h1 className="text-3xl font-extrabold text-text-primary">Perfil</h1>
        <p className="text-lg text-text-muted">{user?.displayName ?? 'Estudiante'}</p>
      </header>

      <div className="rounded-2xl bg-surface p-6 shadow-sm">
        <p className="text-lg text-text-primary">
          Usuario: <span className="font-semibold">{user?.username}</span>
        </p>
      </div>

      <div className="space-y-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            setIsParentGateOpen(true);
          }}
        >
          Zona de papá/mamá
        </Button>

        {isParentAuthenticated() ? (
          <p className="text-base text-success">Acceso de padres activo (15 min)</p>
        ) : null}

        <Button
          type="button"
          variant="secondary"
          onClick={handleLogout}
          isLoading={logoutMutation.isPending}
        >
          Cerrar sesión
        </Button>
      </div>

      <ParentGateModal
        isOpen={isParentGateOpen}
        onClose={() => {
          setIsParentGateOpen(false);
        }}
        onSuccess={() => {
          // Parent panel — Epic E9
        }}
      />
    </section>
  );
}
