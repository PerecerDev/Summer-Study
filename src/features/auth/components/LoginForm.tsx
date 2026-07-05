import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { ApiClientError } from '@/shared/lib/api-client';
import { useLogin } from '../hooks/useAuth';
import { loginSchema, type LoginFormValues } from '../schemas/authSchemas';

export function LoginForm() {
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await loginMutation.mutateAsync(values);
    } catch (error) {
      const message =
        error instanceof ApiClientError
          ? error.message
          : 'No hemos podido iniciar sesión. Inténtalo de nuevo.';

      setError('root', { message });
    }
  });

  return (
    <form
      className="space-y-6"
      onSubmit={(event) => {
        void onSubmit(event);
      }}
      noValidate
    >
      <Input
        label="Usuario"
        autoComplete="username"
        autoCapitalize="none"
        data-testid="login-username"
        {...register('username')}
        error={errors.username?.message}
      />

      <Input
        label="Contraseña"
        type="password"
        autoComplete="current-password"
        data-testid="login-password"
        {...register('password')}
        error={errors.password?.message}
      />

      {errors.root?.message ? (
        <p className="rounded-xl bg-correction/10 px-4 py-3 text-base text-text-primary" role="alert">
          {errors.root.message}
        </p>
      ) : null}

      <Button type="submit" isLoading={isSubmitting || loginMutation.isPending} data-testid="login-submit">
        Entrar
      </Button>
    </form>
  );
}
