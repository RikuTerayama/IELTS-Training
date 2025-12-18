import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // createBrowserClientは自動的にCookieを管理します
  // 明示的なCookie設定は不要（@supabase/ssrが自動処理）
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

