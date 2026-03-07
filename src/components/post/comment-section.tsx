'use client';

import { useState, useEffect } from 'react';
import { Button, Textarea, Card } from '@/components/ui';
import { useAuthContext } from '@/components/auth';
import { createBrowserClient } from '@/lib/supabase';
import { MessageSquare, Send, Loader2 } from 'lucide-react';
import type { Comment } from '@/types';

interface CommentSectionProps {
  postId: string;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const { user, isAuthenticated, openLoginModal } = useAuthContext();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const supabase = createBrowserClient();

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      const { data, error } = await supabase
        .from('comments')
        .select(
          `
          *,
          user:users(id, display_name, avatar_url)
        `
        )
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (!error && data) {
        setComments(data);
      }
      setIsLoading(false);
    };

    fetchComments();
  }, [postId, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      openLoginModal('コメントするにはログインが必要です');
      return;
    }

    if (!newComment.trim()) return;

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          user_id: user!.id,
          body: newComment.trim(),
          is_anonymous: isAnonymous,
        })
        .select(
          `
          *,
          user:users(id, display_name, avatar_url)
        `
        )
        .single();

      if (!error && data) {
        setComments([...comments, data]);
        setNewComment('');
        setIsAnonymous(false);
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="mt-8">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
        <MessageSquare className="h-5 w-5" />
        コメント・アドバイス
        {comments.length > 0 && (
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-sm font-normal text-gray-600">
            {comments.length}
          </span>
        )}
      </h2>

      {/* Comment Form */}
      <Card className="mb-6">
        <form onSubmit={handleSubmit} className="p-4">
          <Textarea
            placeholder="アドバイスや感想を書いてみましょう..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            maxLength={500}
            showCount
          />

          <div className="mt-3 flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              匿名で投稿
            </label>

            <Button
              type="submit"
              size="sm"
              disabled={!newComment.trim() || isSubmitting}
              isLoading={isSubmitting}
            >
              <Send className="mr-2 h-4 w-4" />
              投稿
            </Button>
          </div>
        </form>
      </Card>

      {/* Comments List */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      ) : comments.length === 0 ? (
        <p className="py-8 text-center text-gray-500">
          まだコメントがありません。最初のコメントを書いてみましょう！
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => {
            const displayName = comment.is_anonymous
              ? '匿名ユーザー'
              : comment.user?.display_name || 'ユーザー';

            return (
              <Card key={comment.id} className="p-4">
                <div className="flex gap-3">
                  {/* Avatar */}
                  {comment.is_anonymous ? (
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-200 text-sm text-gray-500">
                      ?
                    </div>
                  ) : comment.user?.avatar_url ? (
                    <img
                      src={comment.user.avatar_url}
                      alt={displayName}
                      className="h-8 w-8 flex-shrink-0 rounded-full"
                    />
                  ) : (
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-medium text-emerald-600">
                      {displayName.charAt(0)}
                    </div>
                  )}

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">
                        {displayName}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatDate(comment.created_at)}
                      </span>
                    </div>
                    <p className="mt-1 whitespace-pre-wrap text-gray-700">
                      {comment.body}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
