'use client';

import { useState } from 'react';
import { Button, Input } from '@/components/ui';
import { createBrowserClient } from '@/lib/supabase';
import { X } from 'lucide-react';

interface ProfileSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  currentName: string;
  onUpdate: (newName: string) => void;
}

export function ProfileSetupModal({
  isOpen,
  onClose,
  userId,
  currentName,
  onUpdate,
}: ProfileSetupModalProps) {
  const [displayName, setDisplayName] = useState(currentName);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!displayName.trim()) {
      setError('ユーザー名を入力してください');
      return;
    }

    if (displayName.length > 30) {
      setError('ユーザー名は30文字以内にしてください');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const supabase = createBrowserClient();
      const { error: updateError } = await supabase
        .from('users')
        .update({ display_name: displayName.trim() })
        .eq('id', userId);

      if (updateError) throw updateError;

      onUpdate(displayName.trim());
      onClose();
    } catch (err) {
      console.error('Error updating display name:', err);
      setError('更新に失敗しました。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleSkip}
      />

      {/* Modal */}
      <div className="relative z-10 mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <button
          onClick={handleSkip}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <span className="text-3xl">👋</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900">ようこそ！</h2>
          <p className="mt-2 text-sm text-gray-500">
            表示名を設定できます（後から変更可能）
          </p>
        </div>

        <div className="mb-6">
          <Input
            label="表示名"
            placeholder="例: たろう"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            maxLength={30}
            error={error}
            helperText="他のユーザーに表示される名前です"
          />
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleSkip}
          >
            このまま使う
          </Button>
          <Button
            className="flex-1"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            設定する
          </Button>
        </div>
      </div>
    </div>
  );
}
