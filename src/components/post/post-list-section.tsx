'use client';

import { useState, useEffect } from 'react';
import { PostCard } from './post-card';
import { CategoryCards } from '@/components/filter/category-cards';
import { Button, Input, AdPlaceholder } from '@/components/ui';
import { Search, Loader2, X } from 'lucide-react';
import { createBrowserClient } from '@/lib/supabase';
import type { Post, PostFilters, ChallengeCategory } from '@/types';

export function PostListSection() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filters, setFilters] = useState<PostFilters>({});
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showSearch, setShowSearch] = useState(false);

  const POSTS_PER_PAGE = 12;

  const fetchPosts = async (pageNum: number, currentFilters: PostFilters) => {
    const supabase = createBrowserClient();

    let query = supabase
      .from('posts')
      .select(
        `
        *,
        user:users(id, display_name, avatar_url)
      `
      )
      .order('created_at', { ascending: false })
      .range((pageNum - 1) * POSTS_PER_PAGE, pageNum * POSTS_PER_PAGE - 1);

    if (currentFilters.challenge_category) {
      query = query.eq('challenge_category', currentFilters.challenge_category);
    }
    if (currentFilters.search) {
      query = query.ilike('challenge_summary', `%${currentFilters.search}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching posts:', error);
      return [];
    }

    const postsWithReactions = await Promise.all(
      (data || []).map(async (post) => {
        const { data: reactionData } = await supabase
          .from('reactions')
          .select('type')
          .eq('post_id', post.id);

        const helpful =
          reactionData?.filter((r) => r.type === 'helpful').length || 0;
        const same_problem =
          reactionData?.filter((r) => r.type === 'same_problem').length || 0;

        return {
          ...post,
          reaction_counts: { helpful, same_problem },
        };
      })
    );

    return postsWithReactions;
  };

  useEffect(() => {
    const loadPosts = async () => {
      setIsLoading(true);
      setPage(1);
      const data = await fetchPosts(1, filters);
      setPosts(data);
      setHasMore(data.length === POSTS_PER_PAGE);
      setIsLoading(false);
    };

    loadPosts();
  }, [filters]);

  const loadMore = async () => {
    const nextPage = page + 1;
    const data = await fetchPosts(nextPage, filters);
    setPosts([...posts, ...data]);
    setPage(nextPage);
    setHasMore(data.length === POSTS_PER_PAGE);
  };

  const handleCategoryChange = (category: ChallengeCategory | null) => {
    setFilters({
      ...filters,
      challenge_category: category || undefined,
    });
  };

  const handleSearchChange = (value: string) => {
    setFilters({
      ...filters,
      search: value || undefined,
    });
  };

  const clearFilters = () => {
    setFilters({});
    setShowSearch(false);
  };

  const hasActiveFilters = filters.challenge_category || filters.search;

  return (
    <section id="posts" className="mx-auto max-w-5xl px-4 pb-16">
      {/* Section Header */}
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">事例を探す</h2>
        <button
          onClick={() => setShowSearch(!showSearch)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
        >
          <Search className="h-4 w-4" />
          キーワード検索
        </button>
      </div>

      {/* Search Input */}
      {showSearch && (
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="課題やキーワードで検索..."
              value={filters.search || ''}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      )}

      {/* Category Cards */}
      <div className="mb-8">
        <CategoryCards
          selected={filters.challenge_category || null}
          onChange={handleCategoryChange}
        />
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="mb-6 flex items-center gap-2">
          <span className="text-sm text-gray-500">絞り込み中:</span>
          {filters.challenge_category && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-sm text-emerald-700">
              {filters.challenge_category}
            </span>
          )}
          {filters.search && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
              「{filters.search}」
            </span>
          )}
          <button
            onClick={clearFilters}
            className="ml-2 flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600"
          >
            <X className="h-3 w-3" />
            クリア
          </button>
        </div>
      )}

      {/* Posts Grid */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      ) : posts.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-gray-400">
            {hasActiveFilters
              ? '該当する事例が見つかりませんでした'
              : 'まだ投稿がありません。最初の足跡を残しましょう！'}
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {/* 広告スペース */}
          <AdPlaceholder variant="banner" className="mt-8" />

          {hasMore && (
            <div className="mt-6 flex justify-center">
              <Button variant="outline" onClick={loadMore}>
                もっと見る
              </Button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
