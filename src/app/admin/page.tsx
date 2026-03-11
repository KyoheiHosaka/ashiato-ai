import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Admin' };

type AdminPost = {
  id: string;
  slug: string | null;
  what: string | null;
  task_category: string | null;
  result: string | null;
  is_anonymous: boolean;
  created_at: string;
  user: { display_name: string } | null;
};

type AdminComment = {
  id: string;
  body: string;
  is_anonymous: boolean;
  created_at: string;
  user: { display_name: string } | null;
  post: { slug: string | null; what: string | null } | null;
};

export default async function AdminPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    redirect('/');
  }

  const { data: posts } = await supabase
    .from('posts')
    .select('id, slug, what, task_category, result, is_anonymous, created_at, user:users(display_name)')
    .order('created_at', { ascending: false })
    .limit(30);

  const { data: comments } = await supabase
    .from('comments')
    .select('id, body, is_anonymous, created_at, user:users(display_name), post:posts(slug, what)')
    .order('created_at', { ascending: false })
    .limit(30);

  const fmt = (d: string) =>
    new Date(d).toLocaleString('ja-JP', {
      month: 'numeric', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold text-gray-900">管理ダッシュボード</h1>

      {/* 最新投稿 */}
      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">最新の投稿</h2>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500">
              <tr>
                <th className="px-4 py-2 text-left">日時</th>
                <th className="px-4 py-2 text-left">ユーザー</th>
                <th className="px-4 py-2 text-left">内容</th>
                <th className="px-4 py-2 text-left">結果</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {((posts || []) as unknown as AdminPost[]).map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-4 py-2 text-gray-400">{fmt(post.created_at)}</td>
                  <td className="px-4 py-2 text-gray-600">
                    {post.is_anonymous ? '匿名' : post.user?.display_name || '-'}
                  </td>
                  <td className="px-4 py-2 text-gray-800">
                    {post.slug ? (
                      <a href={`/logs/${post.slug}`} className="hover:underline">{post.what || '-'}</a>
                    ) : (post.what || '-')}
                  </td>
                  <td className="px-4 py-2 text-gray-500">{post.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 最新コメント */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-800">最新のコメント</h2>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500">
              <tr>
                <th className="px-4 py-2 text-left">日時</th>
                <th className="px-4 py-2 text-left">ユーザー</th>
                <th className="px-4 py-2 text-left">コメント</th>
                <th className="px-4 py-2 text-left">対象投稿</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {((comments || []) as unknown as AdminComment[]).map((comment) => (
                <tr key={comment.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-4 py-2 text-gray-400">{fmt(comment.created_at)}</td>
                  <td className="px-4 py-2 text-gray-600">
                    {comment.is_anonymous ? '匿名' : comment.user?.display_name || '-'}
                  </td>
                  <td className="max-w-xs truncate px-4 py-2 text-gray-800">{comment.body}</td>
                  <td className="px-4 py-2 text-gray-500">
                    {comment.post?.slug ? (
                      <a href={`/logs/${comment.post.slug}`} className="hover:underline">
                        {comment.post.what || '-'}
                      </a>
                    ) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
