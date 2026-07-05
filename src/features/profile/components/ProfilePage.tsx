import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ParentGateModal } from '@/features/auth/components/ParentGateModal';
import { useLogout, useSession } from '@/features/auth/hooks/useAuth';
import { useParentAuthStore } from '@/features/auth/stores/parentAuthStore';
import { useUserProgress, XpBar } from '@/features/gamification';
import { Button } from '@/shared/components/ui/Button';
import { ErrorPage, LoadingPage } from '@/shared/components/ui/PageState';
import { formatGradeLevel } from '@/shared/lib/grade';

export function ProfilePage() {
  const navigate = useNavigate();
  const sessionQuery = useSession();
  const progressQuery = useUserProgress();
  const logoutMutation = useLogout();
  const clearParentAuth = useParentAuthStore((state) => state.clearParentAuth);
  const isParentAuthenticated = useParentAuthStore((state) => state.isParentAuthenticated);
  const [isParentGateOpen, setIsParentGateOpen] = useState(false);

  const user = sessionQuery.data?.user;

  if (sessionQuery.isLoading || progressQuery.isLoading) {
    return <LoadingPage message="Cargando perfil…" />;
  }

  if (sessionQuery.isError || !user || progressQuery.isError || !progressQuery.data) {
    return (
      <ErrorPage
        message="No se pudo cargar tu perfil."
        onRetry={() => {
          void sessionQuery.refetch();
          void progressQuery.refetch();
        }}
      />
    );
  }

  const progress = progressQuery.data;

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
        <p className="text-lg text-text-muted">{user.displayName}</p>
      </header>

      <div className="space-y-4 rounded-2xl bg-surface p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-lg text-text-primary">
            Nivel <span className="text-2xl font-extrabold text-primary">{progress.level}</span>
          </p>
          <p className="text-lg font-bold text-reward-gold">⭐ {progress.totalStars}</p>
        </div>
        <XpBar
          level={progress.level}
          xpInLevel={progress.xpInLevel}
          xpForNextLevel={progress.xpForNextLevel}
        />
        <p className="text-base text-text-muted">
          Racha actual: 🔥 {progress.currentStreak} días · Mejor racha: {progress.longestStreak} días
        </p>
      </div>

      <div className="space-y-3 rounded-2xl bg-surface p-6 shadow-sm">
        <p className="text-lg text-text-primary">
          Usuario: <span className="font-semibold">{user.username}</span>
        </p>
        <p className="text-lg text-text-primary">
          Curso: <span className="font-semibold">{formatGradeLevel(user.gradeLevel)}</span>
        </p>
      </div>

      <div className="space-y-3">
        {isParentAuthenticated() ? (
          <Button
            type="button"
            onClick={() => {
              navigate('/parent');
            }}
          >
            Ir al panel de padres
          </Button>
        ) : (
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setIsParentGateOpen(true);
            }}
          >
            Zona de papá/mamá
          </Button>
        )}

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
          navigate('/parent');
        }}
      />
    </section>
  );
}
