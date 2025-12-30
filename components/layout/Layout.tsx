import { Header } from './Header';
import { Footer } from './Footer';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

