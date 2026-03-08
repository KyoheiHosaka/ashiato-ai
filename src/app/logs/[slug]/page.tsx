import { notFound } from 'next/navigation';
import { HeaderWrapper, Footer } from '@/components/layout';
import { PostDetail } from '@/components/post/post-detail';
import { createClient } from '@/lib/supabase/server';
import { generatePostTitle } from '@/lib/utils';
import { SITE_CONFIG } from '@/constants';
import type { Metadata } from 'next';
import type { Result } from '@/types';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const supabase = await createClient();

  const { data: post } = await supabase
    .from('posts')
    .select('what, ai_tools, result, result_detail, task_category')
    .eq('slug', slug)
    .single();

  if (!post) {
    return { title: '投稿が見つかりません' };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || SITE_CONFIG.url;
  const title = generatePostTitle(post.ai_tools[0], post.what, post.result as Result);
  const description = post.result_detail
    ? post.result_detail.slice(0, 80) + (post.result_detail.length > 80 ? '...' : '')
    : `${post.ai_tools[0]}で${post.what}をやろうとした記録 - myailogs`;

  const ogParams = new URLSearchParams({
    title: post.what,
    result: post.result,
    tools: post.ai_tools?.join(',') || '',
  });
  const ogImageUrl = `${siteUrl}/api/og?${ogParams.toString()}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function LogPage({ params }: Props) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const supabase = await createClient();

  const { data: post, error } = await supabase
    .from('posts')
    .select(`*, user:users(id, display_name, avatar_url)`)
    .eq('slug', slug)
    .single();

  if (error || !post) {
    notFound();
  }

  const { data: reactions } = await supabase
    .from('reactions')
    .select('type')
    .eq('post_id', post.id);

  const reactionCounts = {
    helpful: reactions?.filter((r) => r.type === 'helpful').length || 0,
    same_problem: reactions?.filter((r) => r.type === 'same_problem').length || 0,
  };

  return (
    <div className="flex min-h-screen flex-col">
      <HeaderWrapper />
      <main className="flex-1 bg-gray-50 py-8">
        <PostDetail post={{ ...post, reaction_counts: reactionCounts }} />
      </main>
      <Footer />
    </div>
  );
}
