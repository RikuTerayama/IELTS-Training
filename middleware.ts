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

  // 縺ｾ縺壹そ繝・す繝ｧ繝ｳ繧貞叙蠕暦ｼ・etSession()縺ｯCookie縺九ｉ逶ｴ謗･隱ｭ縺ｿ蜿悶ｋ・・
  const { data: { session } } = await supabase.auth.getSession();
  
  // 繧ｻ繝・す繝ｧ繝ｳ縺九ｉ繝ｦ繝ｼ繧ｶ繝ｼ繧貞叙蠕・
  let user = session?.user ?? null;
  
  // getUser()繧りｩｦ縺励※縺ｿ繧具ｼ医そ繝・す繝ｧ繝ｳ縺悟叙蠕励〒縺阪↑縺・ｴ蜷茨ｼ・
  if (!user) {
    const { data: { user: getUserResult } } = await supabase.auth.getUser();
    user = getUserResult;
  }

  // Canonical public entry: /vocab. Legacy /training/vocab 竊・/vocab (308), preserve query
  if (request.nextUrl.pathname === '/training/vocab') {
    const to = new URL('/vocab', request.url);
    request.nextUrl.searchParams.forEach((v, k) => to.searchParams.set(k, v));
    return NextResponse.redirect(to, 308);
  }

  // W2-FR-2: /training/writing/task2 縺ｯ蟒・ｭ｢縲・08 縺ｧ /task/select?task_type=Task%202 縺ｸ
  if (request.nextUrl.pathname === '/training/writing/task2') {
    return NextResponse.redirect(new URL('/task/select?task_type=Task%202', request.url), 308);
  }

  // Auth boundary: protected paths (public /speaking and /speaking/topics/* are NOT protected)
  const pathname = request.nextUrl.pathname;
  const pathProtected =
    pathname.startsWith('/home') ||
    pathname.startsWith('/vocab') ||
    pathname.startsWith('/training') ||
    pathname.startsWith('/task') ||
    pathname.startsWith('/feedback') ||
    pathname.startsWith('/progress') ||
    pathname.startsWith('/rewrite') ||
    pathname.startsWith('/speak') ||
    pathname.startsWith('/fillin') ||
    pathname.startsWith('/exam') ||
    pathname.startsWith('/speaking/feedback') ||
    pathname.startsWith('/billing/manage') ||
    pathname.startsWith('/pro') ||
    pathname.startsWith('/admin');
  const isProtectedPath = pathProtected;
  
  // 繝ｭ繧ｰ繧､繝ｳ繝壹・繧ｸ縺ｯ隱崎ｨｼ貂医∩縺ｪ繧峨Μ繝繧､繝ｬ繧ｯ繝・
  if (request.nextUrl.pathname === '/login' && user) {
    // 逶ｮ逧・ヲ繧｢繝ｪ繝ｳ繧ｰ螳御ｺ・憾豕√ｒ遒ｺ隱・
    const { data: profile } = await supabase
      .from('profiles')
      .select('onboarding_completed')
      .eq('id', user.id)
      .single();

    if (profile && !profile.onboarding_completed) {
      return NextResponse.redirect(new URL('/onboarding', request.url));
    }
    return NextResponse.redirect(new URL('/home', request.url));
  }

  // 逶ｮ逧・ヲ繧｢繝ｪ繝ｳ繧ｰ繝壹・繧ｸ縺ｯ隱崎ｨｼ縺悟ｿ・ｦ・
  if (request.nextUrl.pathname === '/onboarding' && !user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 逶ｮ逧・ヲ繧｢繝ｪ繝ｳ繧ｰ繝壹・繧ｸ縺ｧ隱崎ｨｼ貂医∩縺ｮ蝣ｴ蜷医∝ｮ御ｺ・憾豕√ｒ遒ｺ隱・
  if (request.nextUrl.pathname === '/onboarding' && user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('onboarding_completed')
      .eq('id', user.id)
      .single();

    if (profile?.onboarding_completed) {
      return NextResponse.redirect(new URL('/home', request.url));
    }
  }

  // 菫晁ｭｷ縺輔ｌ縺溘ヱ繧ｹ縺ｧ譛ｪ隱崎ｨｼ縺ｮ蝣ｴ蜷医・繝ｭ繧ｰ繧､繝ｳ繝壹・繧ｸ縺ｸ・・eturn-path 繧剃ｿ晄戟・・
  if (isProtectedPath && !user) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname + request.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  // 菫晁ｭｷ縺輔ｌ縺溘ヱ繧ｹ縺ｧ隱崎ｨｼ貂医∩縺ｮ蝣ｴ蜷医∫岼逧・ヲ繧｢繝ｪ繝ｳ繧ｰ螳御ｺ・憾豕√ｒ遒ｺ隱・
  if (isProtectedPath && user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('onboarding_completed')
      .eq('id', user.id)
      .single();

    if (profile && !profile.onboarding_completed) {
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


