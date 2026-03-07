'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HeaderWrapper, Footer } from '@/components/layout';
import { PostCard } from '@/components/post';
import { Card, CardContent, Button } from '@/components/ui';
import { useAuthContext } from '@/components/auth';
import { createBrowserClient } from '@/lib/supabase';
import { PenSquare, Bookmark, Loader2, LogOut } from 'lucide-react';
import type { Post } from '@/types';

type Tab = 'posts' | 'bookmarks';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading: authLoading, isAuthenticated, logout } = useAuthContext();
  const [activeTab, setActiveTab] = useState<Tab>('posts');
  const [posts, setPosts] = useState<Post[]>([]);
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalHelpful: 0,
    totalSameProblem: 0,
  });

  const supabase = createBrowserClient();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      setIsLoading(true);

      // Fetch user's posts
      const { data: userPosts } = await supabase
        .from('posts')
        .select(
          `
          *,
          user:users(id, display_name, avatar_url)
        `
        )
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // Fetch bookmarked posts
      const { data: bookmarks } = await supabase
        .from('bookmarks')
        .select(
          `
          post:posts(
            *,
            user:users(id, display_name, avatar_url)
          )
        `
        )
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // Fetch reaction counts for posts
      const postsWithReactions = await Promise.all(
        (userPosts || []).map(async (post) => {
          const { data: reactions } = await supabase
            .from('reactions')
            .select('type')
            .eq('post_id', post.id);

          const helpful = reactions?.filter((r) => r.type === 'helpful').length || 0;
          const same_problem =
            reactions?.filter((r) => r.type === 'same_problem').length || 0;

          return {
            ...post,
            reaction_counts: { helpful, same_problem },
          };
        })
      );

      // Fetch reaction counts for bookmarked posts
      const bookmarkedWithReactions = await Promise.all(
        (bookmarks || [])
          .filter((b) => b.post)
          .map(async (bookmark) => {
            const post = bookmark.post as unknown as Post;
            const { data: reactions } = await supabase
              .from('reactions')
              .select('type')
              .eq('post_id', post.id);

            const helpful = reactions?.filter((r) => r.type === 'helpful').length || 0;
            const same_problem =
              reactions?.filter((r) => r.type === 'same_problem').length || 0;

            return {
              ...post,
              reaction_counts: { helpful, same_problem },
            };
          })
      );

      setPosts(postsWithReactions);
      setBookmarkedPosts(bookmarkedWithReactions);

      // Calculate stats
      const totalHelpful = postsWithReactions.reduce(
        (acc, p) => acc + (p.reaction_counts?.helpful || 0),
        0
      );
      const totalSameProblem = postsWithReactions.reduce(
        (acc, p) => acc + (p.reaction_counts?.same_problem || 0),
        0
      );

      setStats({
        totalPosts: postsWithReactions.length,
        totalHelpful,
        totalSameProblem,
      });

      setIsLoading(false);
    };

    fetchData();
  }, [user, supabase]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <HeaderWrapper />
      <main className="flex-1 bg-gray-50 py-8">
        <div className="mx-auto max-w-4xl px-4">
          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                {/* Avatar */}
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.display_name}
                    className="h-20 w-20 rounded-full"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-2xl font-bold text-emerald-600">
                    {user.display_name.charAt(0)}
                  </div>
                )}

                <div className="flex-1 text-center sm:text-left">
                  <h1 className="text-xl font-bold text-gray-900">
                    {user.display_name}
                  </h1>

                  {/* Stats */}
                  <div className="mt-4 flex justify-center gap-6 sm:justify-start">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-emerald-600">
                        {stats.totalPosts}
                      </p>
                      <p className="text-sm text-gray-500">投稿</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-emerald-600">
                        {stats.totalHelpful}
                      </p>
                      <p className="text-sm text-gray-500">役に立った</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-emerald-600">
                        {stats.totalSameProblem}
                      </p>
                      <p className="text-sm text-gray-500">同じ課題</p>
                    </div>
                  </div>
                </div>

                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  ログアウト
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <div className="mb-6 flex gap-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'posts'
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <PenSquare className="h-4 w-4" />
              投稿した事例 ({posts.length})
            </button>
            <button
              onClick={() => setActiveTab('bookmarks')}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'bookmarks'
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Bookmark className="h-4 w-4" />
              保存した事例 ({bookmarkedPosts.length})
            </button>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            </div>
          ) : activeTab === 'posts' ? (
            posts.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-gray-500">まだ投稿がありません</p>
                <Button
                  className="mt-4"
                  onClick={() => router.push('/post/new')}
                >
                  <PenSquare className="mr-2 h-4 w-4" />
                  最初の足跡を残す
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )
          ) : bookmarkedPosts.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-500">保存した事例がありません</p>
              <Button className="mt-4" onClick={() => router.push('/')}>
                事例を探す
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {bookmarkedPosts.map((post) => (
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
