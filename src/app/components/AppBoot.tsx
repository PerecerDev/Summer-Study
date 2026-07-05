import { useEffect, useState, type ReactNode } from 'react';
import { SplashScreen } from '@/app/components/SplashScreen';

const BOOT_MS = import.meta.env.VITE_SKIP_BOOT_SPLASH === 'true' ? 0 : 900;

interface AppBootProps {
  children: ReactNode;
}

export function AppBoot({ children }: AppBootProps) {
  const [isBooting, setIsBooting] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsBooting(false);
    }, BOOT_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  if (isBooting) {
    return <SplashScreen />;
  }

  return children;
}
