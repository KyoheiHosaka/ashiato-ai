'use client';

import { Button } from '@/components/ui';
import { useAuthContext } from '@/components/auth';
import { useBookmark } from '@/hooks/use-bookmark';
import { Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BookmarkButtonProps {
  postId: string;
  className?: string;
}

export function BookmarkButton({ postId, className }: BookmarkButtonProps) {
  const { user, isAuthenticated, openLoginModal } = useAuthContext();
  const { isBookmarked, isLoading, toggleBookmark } = useBookmark({
    postId,
    userId: user?.id,
  });

  const handleClick = async () => {
    if (!isAuthenticated) {
      openLoginModal('ブックマークするにはログインが必要です');
      return;
    }

    await toggleBookmark();
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      disabled={isLoading}
      className={cn('gap-2', className)}
    >
      <Bookmark
        className={cn(
          'h-4 w-4',
          isBookmarked && 'fill-emerald-600 text-emerald-600'
        )}
      />
      {isBookmarked ? '保存済み' : '保存'}
    </Button>
  );
}
