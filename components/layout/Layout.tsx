import { Header } from './Header';
import { Footer } from './Footer';
import { PublicHeader } from './PublicHeader';
import { PublicFooter } from './PublicFooter';

export type LayoutVariant = 'public' | 'app';

export function Layout({
  children,
  variant = 'app',
}: {
  children: React.ReactNode;
  variant?: LayoutVariant;
}) {
  const isPublic = variant === 'public';
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      {isPublic ? <PublicHeader /> : <Header />}
      <main className="flex-1">{children}</main>
      {isPublic ? <PublicFooter /> : <Footer />}
    </div>
  );
}

