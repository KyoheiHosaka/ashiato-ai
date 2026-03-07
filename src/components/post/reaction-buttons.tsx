'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui';
import { useAuthContext } from '@/components/auth';
import { createBrowserClient } from '@/lib/supabase';
import { ThumbsUp, Users } from 'lucide-react';
import type { ReactionCounts, ReactionType } from '@/types';

interface ReactionButtonsProps {
  postId: string;
  initialCounts: ReactionCounts;
}

export function ReactionButtons({ postId, initialCounts }: ReactionButtonsProps) {
  const { user, isAuthenticated, openLoginModal } = useAuthContext();
  const [counts, setCounts] = useState<ReactionCounts>(initialCounts);
  const [userReactions, setUserReactions] = useState<ReactionType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const supabase = createBrowserClient();

  // Fetch user's reactions on mount
  useEffect(() => {
    const fetchUserReactions = async () => {
      if (!user) return;

      const { data } = await supabase
        .from('reactions')
        .select('type')
        .eq('post_id', postId)
        .eq('user_id', user.id);

      if (data) {
        setUserReactions(data.map((r) => r.type as ReactionType));
      }
    };

    fetchUserReactions();
  }, [user, postId, supabase]);

  const handleReaction = async (type: ReactionType) => {
    if (!isAuthenticated) {
      openLoginModal('リアクションするにはログインが必要です');
      return;
    }

    setIsLoading(true);

    try {
      const hasReacted = userReactions.includes(type);

      if (hasReacted) {
        // Remove reaction
        await supabase
          .from('reactions')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user!.id)
          .eq('type', type);

        setUserReactions((prev) => prev.filter((r) => r !== type));
        setCounts((prev) => ({
          ...prev,
          [type]: Math.max(0, prev[type] - 1),
        }));
      } else {
        // Add reaction
        await supabase.from('reactions').insert({
          post_id: postId,
          user_id: user!.id,
          type,
        });

        setUserReactions((prev) => [...prev, type]);
        setCounts((prev) => ({
          ...prev,
          [type]: prev[type] + 1,
        }));
      }
    } catch (error) {
      console.error('Error toggling reaction:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const hasHelpful = userReactions.includes('helpful');
  const hasSameProblem = userReactions.includes('same_problem');

  return (
    <div className="flex gap-2">
      <Button
        variant={hasHelpful ? 'primary' : 'outline'}
        size="sm"
        onClick={() => handleReaction('helpful')}
        disabled={isLoading}
        className="gap-2"
      >
        <ThumbsUp className="h-4 w-4" />
        役に立った
        <span className="ml-1 rounded-full bg-white/20 px-1.5 text-xs">
          {counts.helpful}
        </span>
      </Button>

      <Button
        variant={hasSameProblem ? 'primary' : 'outline'}
        size="sm"
        onClick={() => handleReaction('same_problem')}
        disabled={isLoading}
        className="gap-2"
      >
        <Users className="h-4 w-4" />
        同じ課題
        <span className="ml-1 rounded-full bg-white/20 px-1.5 text-xs">
          {counts.same_problem}
        </span>
      </Button>
    </div>
  );
}
