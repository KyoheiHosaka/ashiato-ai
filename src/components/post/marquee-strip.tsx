'use client';

import Link from 'next/link';
import { TASK_CATEGORIES } from '@/constants';
import { cn } from '@/lib/utils';

interface MarqueePost {
  id: string;
  slug: string;
  what: string | null;
  challenge_summary: string | null;
  task_category: string | null;
  ai_tools: string[] | null;
  result: string | null;
}

const resultAccent: Record<string, string> = {
  solved:   'bg-emerald-400',
  partial:  'bg-amber-400',
  unsolved: 'bg-gray-300',
};

function MiniCard({ post }: { post: MarqueePost }) {
  const category = TASK_CATEGORIES.find((c) => c.value === post.task_category);
  const title = post.what || post.challenge_summary || '';
  const accent = resultAccent[post.result ?? ''] ?? 'bg-gray-200';

  return (
    <Link
      href={`/logs/${post.slug}`}
      className="block w-52 shrink-0 rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow duration-150 hover:shadow-md overflow-hidden"
    >
      {/* Result accent bar */}
      <div className={cn('h-1', accent)} />
      <div className="px-4 py-3">
        <div className="mb-2 flex items-center gap-1.5">
          {category && <span className="text-base leading-none">{category.icon}</span>}
          <span className="text-[10px] font-medium text-gray-400">{category?.label ?? ''}</span>
        </div>
        <p className="line-clamp-2 text-xs font-medium leading-relaxed text-gray-800">
          {title}
        </p>
        {post.ai_tools?.[0] && (
          <span className="mt-2.5 inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] text-emerald-600">
            {post.ai_tools[0]}
          </span>
        )}
      </div>
    </Link>
  );
}

export function MarqueeTrack({ posts }: { posts: MarqueePost[] }) {
  if (posts.length === 0) return null;
  // Double the list for seamless loop
  const doubled = [...posts, ...posts];

  return (
    <div className="overflow-hidden py-5 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <div className="flex w-max animate-marquee gap-3 hover:[animation-play-state:paused]">
        {doubled.map((post, i) => (
          <MiniCard key={`${post.id}-${i}`} post={post} />
        ))}
      </div>
    </div>
  );
}
