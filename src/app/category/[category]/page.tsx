import { notFound } from 'next/navigation';
import { HeaderWrapper, Footer } from '@/components/layout';
import { PostCard } from '@/components/post/post-card';
import { createClient } from '@/lib/supabase/server';
import { SITE_CONFIG, TASK_CATEGORIES } from '@/constants';
import type { Metadata } from 'next';
import type { TaskCategory } from '@/types';

interface Props {
  params: Promise<{ category: string }>;
}

function getCategoryLabel(slug: string): TaskCategory | null {
  // URL decode for Japanese category names (e.g. ライティング)
  const decoded = decodeURIComponent(slug);
  const found = TASK_CATEGORIES.find((c) => c.value === decoded);
  return found ? found.value : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const categoryLabel = getCategoryLabel(category);

  if (!categoryLabel) return { title: '見つかりません' };

  const title = `${categoryLabel}業務のAI活用ログ一覧`;
  const description = `${categoryLabel}でのAI活用事例まとめ。成功・失敗の両方を掲載。実際のプロンプトや結果も共有。`;

  return {
    title,
    description,
    openGraph: { title, description, siteName: SITE_CONFIG.name },
    twitter: { card: 'summary', title, description },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const categoryLabel = getCategoryLabel(category);

  if (!categoryLabel) {
    notFound();
  }

  const supabase = await createClient();

  const { data: posts, error } = await supabase
    .from('posts')
    .select(`*, user:users(id, display_name, avatar_url)`)
    .eq('task_category', categoryLabel)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    notFound();
  }

  const postsWithReactions = await Promise.all(
    (posts || []).map(async (post) => {
      const { data: reactions } = await supabase
        .from('reactions')
        .select('type')
        .eq('post_id', post.id);
      return {
        ...post,
        reaction_counts: {
          helpful: reactions?.filter((r) => r.type === 'helpful').length || 0,
          same_problem: reactions?.filter((r) => r.type === 'same_problem').length || 0,
        },
      };
    })
  );

  const categoryMeta = TASK_CATEGORIES.find((c) => c.value === categoryLabel);

  return (
    <div className="flex min-h-screen flex-col">
      <HeaderWrapper />
      <main className="flex-1 bg-gray-50 py-8">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-8">
            <div className="mb-2 flex items-center gap-2">
              {categoryMeta && (
                <span className="text-2xl">{categoryMeta.icon}</span>
              )}
              <h1 className="text-2xl font-bold text-gray-900">
                {categoryLabel}業務のAI活用ログ一覧
              </h1>
            </div>
            <p className="text-gray-500">{postsWithReactions.length}件の活用ログ</p>
          </div>

          {postsWithReactions.length === 0 ? (
            <p className="py-16 text-center text-gray-400">
              まだ投稿がありません
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {postsWithReactions.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
