import { notFound } from 'next/navigation';
import { HeaderWrapper, Footer } from '@/components/layout';
import { PostCard } from '@/components/post/post-card';
import { createClient } from '@/lib/supabase/server';
import { SITE_CONFIG } from '@/constants';
import type { Metadata } from 'next';

// Slug → display name mapping
const TOOL_DISPLAY: Record<string, string> = {
  chatgpt: 'ChatGPT',
  claude: 'Claude',
  gemini: 'Gemini',
  copilot: 'Copilot',
  perplexity: 'Perplexity',
  ai: 'その他のAI',
};

interface Props {
  params: Promise<{ tool: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tool } = await params;
  const displayName = TOOL_DISPLAY[tool];
  if (!displayName) return { title: '見つかりません' };

  const title = `${displayName}の失敗・成功ログ一覧`;
  const description = `${displayName}を使ったAI業務活用の失敗・成功事例まとめ。実際のプロンプトや結果も掲載。`;

  return {
    title,
    description,
    openGraph: { title, description, siteName: SITE_CONFIG.name },
    twitter: { card: 'summary', title, description },
  };
}

export default async function ToolPage({ params }: Props) {
  const { tool } = await params;
  const displayName = TOOL_DISPLAY[tool];

  if (!displayName) {
    notFound();
  }

  const supabase = await createClient();

  const { data: posts, error } = await supabase
    .from('posts')
    .select(`*, user:users(id, display_name, avatar_url)`)
    .contains('ai_tools', [displayName === 'その他のAI' ? 'その他' : displayName])
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    notFound();
  }

  // Fetch reaction counts
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

  return (
    <div className="flex min-h-screen flex-col">
      <HeaderWrapper />
      <main className="flex-1 bg-gray-50 py-8">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              {displayName}の失敗・成功ログ一覧
            </h1>
            <p className="mt-2 text-gray-500">
              {postsWithReactions.length}件の活用ログ
            </p>
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
