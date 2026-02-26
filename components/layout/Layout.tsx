import { Header } from './Header';
import { Footer } from './Footer';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen min-w-0 flex-col overflow-x-hidden bg-[rgb(var(--bg))] text-[rgb(var(--text))] font-sans">
      <Header />
      <main className="min-w-0 flex-1 relative z-10">{children}</main>
      <Footer />
    </div>
  );
}

