'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, Badge, ResultBadge, Button, AdPlaceholder } from '@/components/ui';
import { ReactionButtons } from './reaction-buttons';
import { BookmarkButton } from './bookmark-button';
import { CommentSection } from './comment-section';
import { ArrowLeft, ArrowRight } from 'lucide-react';

function XLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
import Link from 'next/link';
import { TASK_CATEGORIES, SITE_CONFIG } from '@/constants';
import type { Post } from '@/types';

interface PostDetailProps {
  post: Post;
}

function buildXShareUrl(post: Post) {
  const tools = post.ai_tools?.join('・') || 'AI';
  const what = post.what || post.challenge_summary || '';
  const text = `${what}を${tools}で試してみた記録を残しました。 #myAIlogs\n`;
  // Use /p/[id] short URL (UUID = ASCII safe) to avoid Japanese in share links
  const shareUrl = `${SITE_CONFIG.url}/p/${post.id}`;
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
}

export function PostDetail({ post }: PostDetailProps) {
  const searchParams = useSearchParams();
  const isJustCreated = searchParams.get('created') === 'true';
  const [showBanner, setShowBanner] = useState(isJustCreated);

  const displayName = post.is_anonymous
    ? '匿名ユーザー'
    : post.user?.display_name || 'ユーザー';

  const taskCategory = TASK_CATEGORIES.find(
    (c) => c.value === post.task_category
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const pageUrl = `${SITE_CONFIG.url}/logs/${post.slug}`;

  return (
    <div className="mx-auto max-w-3xl px-4">
      {/* 投稿直後のシェアバナー */}
      {showBanner && (
        <div className="mb-4 flex items-center justify-between rounded-lg bg-emerald-50 px-4 py-3 text-emerald-800">
          <span className="text-sm font-medium">足跡を残しました！Xでシェアしてみませんか？</span>
          <div className="flex items-center gap-2">
            <a
              href={buildXShareUrl(post)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md bg-black px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-800"
            >
              <XLogo className="h-3 w-3" />
              ポスト
            </a>
            <button onClick={() => setShowBanner(false)} className="text-emerald-600 hover:text-emerald-800 text-lg leading-none">×</button>
          </div>
        </div>
      )}

      {/* Back link */}
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        事例一覧に戻る
      </Link>

      <Card>
        <CardContent className="p-6 md:p-8">
          {/* Header */}
          <div className="mb-6">
            {/* Task Category */}
            <div className="mb-4 flex items-center gap-2">
              {taskCategory && (
                <>
                  <span className="text-base">{taskCategory.icon}</span>
                  <Badge className={taskCategory.badgeClass}>{taskCategory.label}</Badge>
                </>
              )}
              {!taskCategory && post.challenge_category && (
                <Badge>{post.challenge_category}</Badge>
              )}
            </div>

            {/* Title: What → Goal */}
            {post.what && post.goal ? (
              <div className="mb-4">
                <h1 className="text-xl font-bold text-gray-900 md:text-2xl">
                  {post.what}
                </h1>
                <div className="mt-2 flex items-center gap-2 text-gray-500">
                  <ArrowRight className="h-4 w-4" />
                  <p className="text-lg">{post.goal}</p>
                </div>
              </div>
            ) : (
              <h1 className="mb-4 text-xl font-bold text-gray-900 md:text-2xl">
                {post.challenge_summary}
              </h1>
            )}

            {/* Author & Date */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                {post.is_anonymous ? (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-xs text-gray-500">
                    ?
                  </div>
                ) : post.user?.avatar_url ? (
                  <img
                    src={post.user.avatar_url}
                    alt={displayName}
                    className="h-6 w-6 rounded-full"
                  />
                ) : (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs text-emerald-600">
                    {displayName.charAt(0)}
                  </div>
                )}
                <span>{displayName}</span>
              </div>
              <span>{formatDate(post.created_at)}</span>
            </div>
          </div>

          {/* AI Tools */}
          <div className="mb-6 rounded-lg bg-gray-50 p-4">
            <h2 className="mb-3 font-medium text-gray-900">使用したAI</h2>
            <div className="flex flex-wrap gap-2">
              {post.ai_tools?.map((tool) => (
                <span
                  key={tool}
                  className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Result */}
          <div className="mb-6">
            <h2 className="mb-3 font-medium text-gray-900">結果</h2>
            <ResultBadge result={post.result} />
            {post.result_detail && (
              <p className="mt-2 text-gray-700">{post.result_detail}</p>
            )}
          </div>

          {/* Prompt (if exists) */}
          {post.prompt && (
            <div className="mb-6">
              <h2 className="mb-3 font-medium text-gray-900">使ったプロンプト（AIへの指示）</h2>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <p className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-gray-700">
                  {post.prompt}
                </p>
              </div>
            </div>
          )}

          {/* Tips (if exists) */}
          {post.tips && (
            <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <h3 className="font-medium text-amber-900">コツ / Tips</h3>
              <p className="mt-1 text-amber-800">{post.tips}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 pt-6">
            <ReactionButtons
              postId={post.id}
              initialCounts={post.reaction_counts || { helpful: 0, same_problem: 0 }}
            />

            <div className="flex gap-2">
              <BookmarkButton postId={post.id} />
              <a
                href={buildXShareUrl(post)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <XLogo className="h-4 w-4" />
                でシェア
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 広告スペース */}
      <AdPlaceholder variant="banner" className="my-6" />

      {/* Comments */}
      <CommentSection postId={post.id} />
    </div>
  );
}
