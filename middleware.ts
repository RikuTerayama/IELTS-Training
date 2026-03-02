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
          // デバッグ: すべてのCookieの内容を確認
          console.log('[Middleware] getAll() called, cookies count:', cookies.length);
          const authCookies = cookies.filter(c => c.name.includes('auth-token'));
          if (authCookies.length > 0) {
            console.log('[Middleware] Auth cookie details:', authCookies.map(c => ({
              name: c.name,
              valueLength: c.value?.length || 0,
              valuePreview: c.value ? c.value.substring(0, 100) : 'EMPTY',
              hasValue: !!c.value
            })));
          } else {
            console.log('[Middleware] No auth cookies found in getAll()');
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

  // Cookieの詳細を確認（getAll()の前に）
  const allCookies = request.cookies.getAll();
  const authCookie = allCookies.find(c => c.name.includes('auth-token'));
  if (authCookie) {
    console.log('[Middleware] Found auth cookie:', {
      name: authCookie.name,
      valueLength: authCookie.value?.length || 0,
      hasValue: !!authCookie.value,
      valuePreview: authCookie.value ? authCookie.value.substring(0, 50) : 'EMPTY'
    });
  }

  // まずセッションを取得（getSession()はCookieから直接読み取る）
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) {
    console.log('[Middleware] getSession() error:', sessionError);
  }
  
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

  // AC-4: /vocab は恒久リダイレクトで /training/vocab へ（308）。?skill= ありなら維持、無ければクエリ無し
  if (request.nextUrl.pathname === '/vocab') {
    const skill = request.nextUrl.searchParams.get('skill');
    const path = (skill === 'writing' || skill === 'speaking') ? `/training/vocab?skill=${skill}` : '/training/vocab';
    return NextResponse.redirect(new URL(path, request.url), 308);
  }

  // W2-FR-2: /training/writing/task2 は廃止。308 で /task/select?task_type=Task%202 へ
  if (request.nextUrl.pathname === '/training/writing/task2') {
    return NextResponse.redirect(new URL('/task/select?task_type=Task%202', request.url), 308);
  }

  // 認証が必要なパス（/vocab は廃止のためリストから削除）
  const protectedPaths = ['/home', '/task', '/feedback', '/progress', '/rewrite', '/speak', '/fillin'];
  const isProtectedPath = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path));
  
  // ログインページは認証済みならリダイレクト
  if (request.nextUrl.pathname === '/login' && user) {
    // 目的ヒアリング完了状況を確認
    const { data: profile } = await supabase
      .from('profiles')
      .select('onboarding_completed')
      .eq('id', user.id)
      .single();

    if (profile && !profile.onboarding_completed) {
      console.log('[Middleware] Redirecting authenticated user from /login to /onboarding');
      return NextResponse.redirect(new URL('/onboarding', request.url));
    }
    console.log('[Middleware] Redirecting authenticated user from /login to /home');
    return NextResponse.redirect(new URL('/home', request.url));
  }

  // 目的ヒアリングページは認証が必要
  if (request.nextUrl.pathname === '/onboarding' && !user) {
    console.log('[Middleware] Redirecting unauthenticated user from /onboarding to /login');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 目的ヒアリングページで認証済みの場合、完了状況を確認
  if (request.nextUrl.pathname === '/onboarding' && user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('onboarding_completed')
      .eq('id', user.id)
      .single();

    if (profile?.onboarding_completed) {
      console.log('[Middleware] Redirecting user with completed onboarding to /home');
      return NextResponse.redirect(new URL('/home', request.url));
    }
  }

  // 保護されたパスで未認証の場合はログインページへ
  if (isProtectedPath && !user) {
    console.log('[Middleware] Redirecting unauthenticated user to /login');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 保護されたパスで認証済みの場合、目的ヒアリング完了状況を確認
  if (isProtectedPath && user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('onboarding_completed')
      .eq('id', user.id)
      .single();

    if (profile && !profile.onboarding_completed) {
      console.log('[Middleware] Redirecting user with incomplete onboarding to /onboarding');
      return NextResponse.redirect(new URL('/onboarding', request.url));
    }
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

