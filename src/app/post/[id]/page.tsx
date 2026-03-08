import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

interface Props {
  params: Promise<{ id: string }>;
}

/**
 * 301 redirect: /post/[uuid] → /logs/[slug]
 * Preserves SEO link equity for previously shared URLs.
 */
export default async function PostRedirectPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from('posts')
    .select('slug')
    .eq('id', id)
    .single();

  if (!post) {
    notFound();
  }

  redirect(`/logs/${post.slug}`);
}
