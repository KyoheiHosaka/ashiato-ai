'use client';

import { Card, CardContent, Badge, ResultBadge, Button, AdPlaceholder } from '@/components/ui';
import { ReactionButtons } from './reaction-buttons';
import { BookmarkButton } from './bookmark-button';
import { CommentSection } from './comment-section';
import { ArrowLeft, ArrowRight, Share2 } from 'lucide-react';
import Link from 'next/link';
import { TASK_CATEGORIES } from '@/constants';
import type { Post } from '@/types';

interface PostDetailProps {
  post: Post;
}

export function PostDetail({ post }: PostDetailProps) {
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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.what ? `${post.what} → ${post.goal}` : post.challenge_summary,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('URLをコピーしました');
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4">
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
                  <Badge>{taskCategory.label}</Badge>
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
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                シェア
              </Button>
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
