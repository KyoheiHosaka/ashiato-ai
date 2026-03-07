'use client';

import { useState, useEffect, useCallback } from 'react';
import { createBrowserClient } from '@/lib/supabase';

interface UseBookmarkProps {
  postId: string;
  userId?: string;
}

export function useBookmark({ postId, userId }: UseBookmarkProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const supabase = createBrowserClient();

  // Check if bookmarked on mount
  useEffect(() => {
    const checkBookmark = async () => {
      if (!userId) return;

      const { data } = await supabase
        .from('bookmarks')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .single();

      setIsBookmarked(!!data);
    };

    checkBookmark();
  }, [postId, userId, supabase]);

  const toggleBookmark = useCallback(async () => {
    if (!userId) return false;

    setIsLoading(true);

    try {
      if (isBookmarked) {
        await supabase
          .from('bookmarks')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', userId);

        setIsBookmarked(false);
      } else {
        await supabase.from('bookmarks').insert({
          post_id: postId,
          user_id: userId,
        });

        setIsBookmarked(true);
      }

      return true;
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [postId, userId, isBookmarked, supabase]);

  return { isBookmarked, isLoading, toggleBookmark };
}
