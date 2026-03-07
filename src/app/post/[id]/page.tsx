import { notFound } from 'next/navigation';
import { HeaderWrapper, Footer } from '@/components/layout';
import { PostDetail } from '@/components/post/post-detail';
import { createClient } from '@/lib/supabase/server';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from('posts')
    .select('challenge_summary, industry, role, ai_tools, result')
    .eq('id', id)
    .single();

  if (!post) {
    return {
      title: '投稿が見つかりません',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ashiato.ai';
  const ogParams = new URLSearchParams({
    title: post.challenge_summary,
    industry: post.industry,
    role: post.role,
    result: post.result,
    tools: post.ai_tools?.join(',') || '',
  });
  const ogImageUrl = `${siteUrl}/api/og?${ogParams.toString()}`;

  return {
    title: post.challenge_summary,
    description: `${post.industry}・${post.role}のAI活用事例`,
    openGraph: {
      title: post.challenge_summary,
      description: `${post.industry}・${post.role}のAI活用事例`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.challenge_summary,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.challenge_summary,
      description: `${post.industry}・${post.role}のAI活用事例`,
      images: [ogImageUrl],
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: post, error } = await supabase
    .from('posts')
    .select(
      `
      *,
      user:users(id, display_name, avatar_url)
    `
    )
    .eq('id', id)
    .single();

  if (error || !post) {
    notFound();
  }

  // Fetch reaction counts
  const { data: reactions } = await supabase
    .from('reactions')
    .select('type')
    .eq('post_id', id);

  const reactionCounts = {
    helpful: reactions?.filter((r) => r.type === 'helpful').length || 0,
    same_problem: reactions?.filter((r) => r.type === 'same_problem').length || 0,
  };

  const postWithReactions = {
    ...post,
    reaction_counts: reactionCounts,
  };

  return (
    <div className="flex min-h-screen flex-col">
      <HeaderWrapper />
      <main className="flex-1 bg-gray-50 py-8">
        <PostDetail post={postWithReactions} />
      </main>
      <Footer />
    </div>
  );
}
