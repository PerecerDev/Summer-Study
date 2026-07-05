import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Modal } from '@/shared/components/ui/Modal';
import { ApiClientError } from '@/shared/lib/api-client';
import { useVerifyParentPassword } from '../hooks/useAuth';
import { parentPasswordSchema, type ParentPasswordFormValues } from '../schemas/authSchemas';
import { useParentAuthStore } from '../stores/parentAuthStore';

interface ParentGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ParentGateModal({ isOpen, onClose, onSuccess }: ParentGateModalProps) {
  const verifyMutation = useVerifyParentPassword();
  const setParentAuth = useParentAuthStore((state) => state.setParentAuth);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<ParentPasswordFormValues>({
    resolver: zodResolver(parentPasswordSchema),
    defaultValues: { password: '' },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = handleSubmit(async (values) => {
    try {
      const result = await verifyMutation.mutateAsync(values.password);
      setParentAuth(result.parentToken, result.expiresAt);
      reset();
      onSuccess?.();
      onClose();
    } catch (error) {
      const message =
        error instanceof ApiClientError ? error.message : 'Contraseña incorrecta';
      setError('password', { message });
    }
  });

  return (
    <Modal isOpen={isOpen} title="Zona de papá/mamá" onClose={handleClose}>
      <p className="mb-6 text-lg text-text-muted">
        Introduce la contraseña de papá/mamá para continuar.
      </p>

      <form
        className="space-y-6"
        onSubmit={(event) => {
          void onSubmit(event);
        }}
        noValidate
      >
        <Input
          label="Contraseña"
          type="password"
          autoComplete="current-password"
          {...register('password')}
          error={errors.password?.message}
        />

        <div className="flex flex-col gap-3">
          <Button type="submit" isLoading={isSubmitting || verifyMutation.isPending}>
            Entrar
          </Button>
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
        </div>
      </form>
    </Modal>
  );
}
