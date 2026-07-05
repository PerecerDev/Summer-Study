import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from '@/shared/components/ui/Button';

interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface AppErrorBoundaryState {
  hasError: boolean;
}

export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('App error:', error, info.componentStack);
  }

  private handleRetry = () => {
    this.setState({ hasError: false });
    window.location.assign('/');
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6 text-center">
          <p className="text-4xl" aria-hidden="true">
            😕
          </p>
          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-text-primary">Algo ha ido mal</h1>
            <p className="text-lg text-text-muted">
              Ha ocurrido un error inesperado. Inténtalo de nuevo.
            </p>
          </div>
          <Button type="button" className="max-w-xs" onClick={this.handleRetry}>
            Reintentar
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
