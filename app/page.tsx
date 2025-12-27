import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

// 動的レンダリングを強制（認証状態に応じてリダイレクトするため）
export const dynamic = 'force-dynamic';

export default async function RootPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 認証済みならホームへ、未認証ならログインへ
  if (user) {
    redirect('/home');
  } else {
    redirect('/login');
  }
}

