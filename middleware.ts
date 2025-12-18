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
          return request.cookies.getAll();
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

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  // デバッグ用ログ（本番環境では削除または条件付きで出力）
  if (process.env.NODE_ENV === 'development') {
    console.log('[Middleware] Path:', request.nextUrl.pathname);
    console.log('[Middleware] User:', user ? user.email : 'null');
    console.log('[Middleware] Auth Error:', authError);
    console.log('[Middleware] Cookies:', request.cookies.getAll().map(c => c.name));
  }

  // 認証が必要なパス
  const protectedPaths = ['/home', '/task', '/feedback', '/progress', '/vocab', '/rewrite', '/speak', '/fillin'];
  const isProtectedPath = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path));

  // ログインページは認証済みならリダイレクト
  if (request.nextUrl.pathname === '/login' && user) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Middleware] Redirecting authenticated user from /login to /home');
    }
    return NextResponse.redirect(new URL('/home', request.url));
  }

  // 保護されたパスで未認証の場合はログインページへ
  if (isProtectedPath && !user) {
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

