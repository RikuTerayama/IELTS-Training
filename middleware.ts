import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          const cookies = request.cookies.getAll();
          // デバッグ: Cookieの内容を確認
          const authCookies = cookies.filter(c => c.name.includes('auth-token'));
          if (authCookies.length > 0) {
            console.log('[Middleware] Auth cookie details:', authCookies.map(c => ({
              name: c.name,
              valueLength: c.value?.length || 0,
              valuePreview: c.value?.substring(0, 50) || 'empty'
            })));
          }
          return cookies;
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // まずセッションを取得（getSession()はCookieから直接読み取る）
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  // セッションからユーザーを取得
  let user = session?.user ?? null;
  
  // getUser()も試してみる（セッションが取得できない場合）
  if (!user) {
    const { data: { user: getUserResult }, error: authError } = await supabase.auth.getUser();
    user = getUserResult;
    if (authError) {
      console.log('[Middleware] getUser() error:', authError);
    }
  }

  // デバッグ用ログ（本番環境でも出力）
  const cookieNames = request.cookies.getAll().map(c => c.name);
  console.log('[Middleware] Path:', request.nextUrl.pathname);
  console.log('[Middleware] User:', user ? user.email : 'null');
  console.log('[Middleware] Session exists:', !!session);
  console.log('[Middleware] Cookies:', cookieNames);
  console.log('[Middleware] Has auth cookies:', cookieNames.some(name => name.includes('auth-token')));

  // 認証が必要なパス
  const protectedPaths = ['/home', '/task', '/feedback', '/progress', '/vocab', '/rewrite', '/speak', '/fillin'];
  const isProtectedPath = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path));
  
  // ログインページは認証済みならリダイレクト
  if (request.nextUrl.pathname === '/login' && user) {
    console.log('[Middleware] Redirecting authenticated user from /login to /home');
    return NextResponse.redirect(new URL('/home', request.url));
  }

  // 保護されたパスで未認証の場合はログインページへ
  if (isProtectedPath && !user) {
    console.log('[Middleware] Redirecting unauthenticated user to /login');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api routes (API routes are handled separately)
     */
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
};

