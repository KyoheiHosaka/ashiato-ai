'use client';

import { useState, useEffect, useRef } from 'react';
import { PostCard, PostCardSkeleton } from './post-card';
import { CategoryCards } from '@/components/filter/category-cards';
import { AdPlaceholder } from '@/components/ui';
import { Search, Loader2, ChevronDown } from 'lucide-react';
import { createBrowserClient } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import type { Post, PostFilters, TaskCategory, Result } from '@/types';

const POSTS_PER_PAGE = 12;
const CACHE_KEY = 'ashiato_post_list';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5分

interface ListCache {
  posts: Post[];
  page: number;
  hasMore: boolean;
  scrollY: number;
  ts: number;
}

function readCache(): ListCache | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const cache: ListCache = JSON.parse(raw);
    if (Date.now() - cache.ts > CACHE_TTL_MS) return null;
    return cache;
  } catch {
    return null;
  }
}

function writeCache(data: Omit<ListCache, 'ts'>) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ...data, ts: Date.now() }));
  } catch {}
}

function clearCache() {
  try {
    sessionStorage.removeItem(CACHE_KEY);
  } catch {}
}

// N+1解消: postsとreactionsを別々ではなく2クエリで取得
async function fetchPostsFromDB(
  pageNum: number,
  currentFilters: PostFilters
): Promise<Post[]> {
  const supabase = createBrowserClient();

  let query = supabase
    .from('posts')
    .select(`*, user:users(id, display_name, avatar_url)`)
    .order('created_at', { ascending: false })
    .range((pageNum - 1) * POSTS_PER_PAGE, pageNum * POSTS_PER_PAGE - 1);

  if (currentFilters.task_category) {
    query = query.eq('task_category', currentFilters.task_category);
  }
  if (currentFilters.result) {
    query = query.eq('result', currentFilters.result);
  }
  if (currentFilters.search) {
    query = query.or(
      `what.ilike.%${currentFilters.search}%,goal.ilike.%${currentFilters.search}%,challenge_summary.ilike.%${currentFilters.search}%`
    );
  }

  const { data, error } = await query;
  if (error || !data || data.length === 0) return [];

  // 取得した全投稿のリアクションを1クエリでまとめて取得
  const { data: reactionData } = await supabase
    .from('reactions')
    .select('post_id, type')
    .in('post_id', data.map((p) => p.id));

  const reactionMap = new Map<string, { helpful: number; same_problem: number }>();
  for (const r of reactionData ?? []) {
    const counts = reactionMap.get(r.post_id) ?? { helpful: 0, same_problem: 0 };
    if (r.type === 'helpful') counts.helpful++;
    else if (r.type === 'same_problem') counts.same_problem++;
    reactionMap.set(r.post_id, counts);
  }

  return data.map((post) => ({
    ...post,
    reaction_counts: reactionMap.get(post.id) ?? { helpful: 0, same_problem: 0 },
  }));
}

export function PostListSection() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filters, setFilters] = useState<PostFilters>({});
  const [searchInput, setSearchInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // フィルターeffectがキャッシュ復元時にfetchしないようにするフラグ
  const skipFetchRef = useRef(false);
  const scrollRestoreRef = useRef<number | null>(null);

  // マウント時: sessionStorageからキャッシュを復元
  useEffect(() => {
    const cache = readCache();
    if (cache) {
      setPosts(cache.posts);
      setPage(cache.page);
      setHasMore(cache.hasMore);
      scrollRestoreRef.current = cache.scrollY;
      skipFetchRef.current = true;
      setIsLoading(false);
    }
    // キャッシュがない場合はフィルターeffectが初回fetchを行う
  }, []);

  // postsが描画されたらスクロール位置を復元
  useEffect(() => {
    if (scrollRestoreRef.current !== null && posts.length > 0) {
      const y = scrollRestoreRef.current;
      scrollRestoreRef.current = null;
      requestAnimationFrame(() => {
        window.scrollTo(0, y);
      });
    }
  }, [posts]);

  // スクロール位置をキャッシュに随時保存（debounced）
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        try {
          const raw = sessionStorage.getItem(CACHE_KEY);
          if (raw) {
            const c = JSON.parse(raw);
            c.scrollY = window.scrollY;
            sessionStorage.setItem(CACHE_KEY, JSON.stringify(c));
          }
        } catch {}
      }, 150);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // フィルター変更時: 新規fetch（キャッシュ復元時はスキップ）
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (skipFetchRef.current) {
      skipFetchRef.current = false;
      return;
    }
    const load = async () => {
      setIsLoading(true);
      setPage(1);
      try {
        const data = await fetchPostsFromDB(1, filters);
        setPosts(data);
        setHasMore(data.length === POSTS_PER_PAGE);
        if (!filters.task_category && !filters.result && !filters.search) {
          writeCache({ posts: data, page: 1, hasMore: data.length === POSTS_PER_PAGE, scrollY: 0 });
        } else {
          clearCache();
        }
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [filters]);

  const loadMore = async () => {
    setIsLoadingMore(true);
    const nextPage = page + 1;
    try {
      const data = await fetchPostsFromDB(nextPage, filters);
      const newPosts = [...posts, ...data];
      const newHasMore = data.length === POSTS_PER_PAGE;
      setPosts(newPosts);
      setPage(nextPage);
      setHasMore(newHasMore);
      if (!filters.task_category && !filters.result && !filters.search) {
        writeCache({ posts: newPosts, page: nextPage, hasMore: newHasMore, scrollY: window.scrollY });
      }
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleCategoryChange = (category: TaskCategory | null) => {
    clearCache();
    setFilters((prev) => ({ ...prev, task_category: category || undefined }));
  };

  const handleResultChange = (result: Result | null) => {
    clearCache();
    setFilters((prev) => ({ ...prev, result: result || undefined }));
  };

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      clearCache();
      setFilters((prev) => ({ ...prev, search: value || undefined }));
    }, 400);
  };

  const RESULT_OPTIONS: { value: Result; label: string }[] = [
    { value: 'solved', label: '解決' },
    { value: 'partial', label: '部分解決' },
    { value: 'unsolved', label: '未解決' },
  ];

  return (
    <section id="posts" className="mx-auto max-w-5xl px-4 pb-16">
      {/* Search */}
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="キーワードで検索..."
          value={searchInput}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-gray-400 focus:ring-0"
        />
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-2.5">
        <CategoryCards
          selected={filters.task_category || null}
          onChange={handleCategoryChange}
        />
        <div className="flex flex-wrap gap-2">
          {RESULT_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => handleResultChange(filters.result === value ? null : value)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-sm transition-all',
                filters.result === value
                  ? 'border-gray-900 bg-gray-900 text-white'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Grid */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-gray-400">
            {(filters.task_category || filters.result || filters.search)
              ? '該当する事例が見つかりませんでした'
              : 'まだ投稿がありません。最初のあしあとを残しましょう！'}
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
            <div className="mt-10">
              <div className="mb-5 flex items-center gap-4">
                <div className="flex-1 border-t border-gray-200" />
                <span className="text-xs text-gray-400 tracking-wide">もっと見る</span>
                <div className="flex-1 border-t border-gray-200" />
              </div>
              <button
                onClick={loadMore}
                disabled={isLoadingMore}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 border-gray-900 bg-white text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-900 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    読み込み中...
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    さらに事例を見る
                  </>
                )}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
