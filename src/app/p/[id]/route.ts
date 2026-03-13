import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Short-URL redirect: /p/[id] → /logs/[slug]
// Used for X (Twitter) sharing to avoid Japanese characters in URLs.
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('posts')
      .select('slug')
      .eq('id', id)
      .single();

    if (data?.slug) {
      return NextResponse.redirect(
        new URL(`/logs/${data.slug}`, process.env.NEXT_PUBLIC_SITE_URL || 'https://www.myailogs.com'),
        { status: 301 }
      );
    }
  } catch {}

  return NextResponse.redirect(
    new URL('/', process.env.NEXT_PUBLIC_SITE_URL || 'https://www.myailogs.com')
  );
}
