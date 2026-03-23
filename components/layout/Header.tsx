'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { APP_NAV } from '@/lib/config/nav';
import { SiteHeader } from './SiteHeader';

export function Header() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <SiteHeader
      mode="app"
      brandHref="/home"
      navItems={APP_NAV}
      userEmail={user?.email ?? null}
      onLogout={handleLogout}
    />
  );
}

