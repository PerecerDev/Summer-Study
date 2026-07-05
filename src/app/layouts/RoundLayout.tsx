import type { ReactNode } from 'react';

interface RoundLayoutProps {
  children: ReactNode;
  header?: ReactNode;
}

export function RoundLayout({ children, header }: RoundLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {header}
      <div className="mx-auto w-full max-w-xl">{children}</div>
    </div>
  );
}
