import { notFound, redirect } from 'next/navigation';
import { HeaderWrapper, Footer } from '@/components/layout';
import { PostDetail } from '@/components/post/post-detail';
import { createClient } from '@/lib/supabase/server';

interface Props {
  params: Promise<{ id: string }>;
}

/**
 * /post/[id] - slug があれば /logs/[slug] へ 301 リダイレクト。
 * slug が未設定（マイグレーション前の投稿）の場合はそのまま表示する。
 */
export default async function PostPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: post, error } = await supabase
    .from('posts')
    .select(`*, user:users(id, display_name, avatar_url)`)
    .eq('id', id)
    .single();

  if (error || !post) {
    notFound();
  }

  // slug があれば /logs/[slug] へリダイレクト
  if (post.slug) {
    redirect(`/logs/${post.slug}`);
  }

  // slug がない場合はそのまま表示（フォールバック）
  const { data: reactions } = await supabase
    .from('reactions')
    .select('type')
    .eq('post_id', id);

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
