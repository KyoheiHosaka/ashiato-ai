'use client';

import Link from 'next/link';
import { Card, CardContent, CardFooter, Badge, ResultBadge } from '@/components/ui';
import { ThumbsUp, Users, ArrowRight } from 'lucide-react';
import { TASK_CATEGORIES } from '@/constants';
import { cn } from '@/lib/utils';
import type { Post, Result } from '@/types';

interface PostCardProps {
  post: Post;
}

const resultAccent: Record<Result, string> = {
  solved: 'bg-emerald-400',
  partial: 'bg-amber-400',
  unsolved: 'bg-gray-300',
};

export function PostCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm overflow-hidden">
      <div className="h-0.5 -mx-4 -mt-4 mb-4 bg-gray-100 animate-pulse" />
      <div className="mb-3 h-5 w-16 rounded-full bg-gray-100 animate-pulse" />
      <div className="mb-3 space-y-2">
        <div className="h-4 rounded bg-gray-100 animate-pulse" />
        <div className="h-4 w-3/4 rounded bg-gray-100 animate-pulse" />
      </div>
      <div className="mb-3 flex gap-1.5">
        <div className="h-5 w-16 rounded bg-gray-100 animate-pulse" />
        <div className="h-5 w-12 rounded bg-gray-100 animate-pulse" />
      </div>
      <div className="h-5 w-20 rounded-full bg-gray-100 animate-pulse" />
      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-gray-100 animate-pulse" />
          <div className="h-3 w-20 rounded bg-gray-100 animate-pulse" />
        </div>
        <div className="flex gap-3">
          <div className="h-3 w-8 rounded bg-gray-100 animate-pulse" />
          <div className="h-3 w-8 rounded bg-gray-100 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function PostCard({ post }: PostCardProps) {
  const displayName = post.is_anonymous
    ? '匿名ユーザー'
    : post.user?.display_name || 'ユーザー';

  const taskCategory = TASK_CATEGORIES.find(
    (c) => c.value === post.task_category
  );

  // Support both new and legacy schema
  const title = post.what && post.goal
    ? `${post.what} → ${post.goal}`
    : post.challenge_summary || '';

  return (
    <Link href={post.slug ? `/logs/${post.slug}` : `/post/${post.id}`}>
      <Card hover className="flex h-full flex-col">
        {/* Result accent bar */}
        <div className={cn('h-0.5 -mx-4 -mt-4 mb-4', resultAccent[post.result] ?? 'bg-gray-200')} />
        <CardContent className="flex-1">
          {/* Task Category Badge */}
          <div className="mb-3 flex items-center gap-2">
            {taskCategory && (
              <Badge className={taskCategory.badgeClass}>{taskCategory.label}</Badge>
            )}
            {!taskCategory && post.challenge_category && (
              <Badge>{post.challenge_category}</Badge>
            )}
          </div>

          {/* Title: What → Goal */}
          {post.what && post.goal ? (
            <div className="mb-3">
              <p className="line-clamp-2 font-medium text-gray-900">{post.what}</p>
              <div className="flex items-start gap-1 text-gray-400">
                <ArrowRight className="mt-0.5 h-3 w-3 shrink-0" />
                <p className="line-clamp-1 text-sm text-gray-600">{post.goal}</p>
              </div>
            </div>
          ) : (
            <h3 className="mb-3 line-clamp-2 font-medium text-gray-900">
              {post.challenge_summary}
            </h3>
          )}

          {/* AI Tools */}
          <div className="mb-3 flex flex-wrap gap-1.5">
            {post.ai_tools?.map((tool) => (
              <span
                key={tool}
                className="rounded bg-emerald-50 px-1.5 py-0.5 text-xs text-emerald-700"
              >
                {tool}
              </span>
            ))}
          </div>

          {/* Result */}
          <ResultBadge result={post.result} />
        </CardContent>

        <CardFooter>
          {/* Author */}
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
            <span className="truncate text-sm text-gray-500 max-w-[8rem]">{displayName}</span>
          </div>

          {/* Reactions */}
          <div className="ml-auto flex items-center gap-3 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <ThumbsUp className="h-4 w-4" />
              {post.reaction_counts?.helpful || 0}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {post.reaction_counts?.same_problem || 0}
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
