import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  const { pathname, searchParams, origin } = request.nextUrl;

  // SupabaseがSite URL（ルートパス）にcodeを送ってきた場合は/auth/callbackに転送
  const code = searchParams.get('code');
  if (code && pathname === '/') {
    const callbackUrl = new URL('/auth/callback', origin);
    callbackUrl.searchParams.set('code', code);
    return NextResponse.redirect(callbackUrl);
  }

  // /auth/callbackはPKCEフローを処理するため、updateSessionをスキップ
  if (pathname === '/auth/callback') {
    return NextResponse.next();
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
