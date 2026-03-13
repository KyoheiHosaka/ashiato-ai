'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, ChipGroup, Card } from '@/components/ui';
import { useAuthContext } from '@/components/auth';
import { createBrowserClient } from '@/lib/supabase';
import { TASK_CATEGORIES, AI_TOOLS, RESULTS, VALIDATION, PLACEHOLDERS } from '@/constants';
import { generateUniqueSlug } from '@/lib/utils';
import { Textarea } from '@/components/ui';
import type { TaskCategory, AITool, Result } from '@/types';
import { cn } from '@/lib/utils';
import { ArrowRight, Check, Info } from 'lucide-react';

// Pre-computed confetti positions (12 particles, evenly distributed around a circle)
const CONFETTI = [
  { x:  80, y:   0, color: '#10b981', delay: 0.00 },
  { x:  69, y:  40, color: '#fbbf24', delay: 0.04 },
  { x:  40, y:  69, color: '#a78bfa', delay: 0.08 },
  { x:   0, y:  80, color: '#34d399', delay: 0.12 },
  { x: -40, y:  69, color: '#f59e0b', delay: 0.16 },
  { x: -69, y:  40, color: '#6ee7b7', delay: 0.20 },
  { x: -80, y:   0, color: '#10b981', delay: 0.24 },
  { x: -69, y: -40, color: '#fbbf24', delay: 0.28 },
  { x: -40, y: -69, color: '#a78bfa', delay: 0.32 },
  { x:   0, y: -80, color: '#34d399', delay: 0.36 },
  { x:  40, y: -69, color: '#f59e0b', delay: 0.40 },
  { x:  69, y: -40, color: '#6ee7b7', delay: 0.44 },
];

export function SimplePostForm() {
  const router = useRouter();
  const { user, isAuthenticated, openLoginModal } = useAuthContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    task_category: '' as TaskCategory | '',
    what: '',
    goal: '',
    ai_tools: [] as AITool[],
    result: '' as Result | '',
    result_detail: '',
    prompt: '',
    is_anonymous: false,
  });

  const updateField = <K extends keyof typeof formData>(
    key: K,
    value: (typeof formData)[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.task_category) {
      newErrors.task_category = 'カテゴリを選択してください';
    }
    if (!formData.what.trim()) {
      newErrors.what = '入力してください';
    }
    if (!formData.goal.trim()) {
      newErrors.goal = '入力してください';
    }
    if (formData.ai_tools.length === 0) {
      newErrors.ai_tools = '使用したAIを選択してください';
    }
    if (!formData.result) {
      newErrors.result = '結果を選択してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      openLoginModal('投稿するにはログインが必要です');
      return;
    }

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const supabase = createBrowserClient();

      const slug = await generateUniqueSlug(
        supabase,
        formData.ai_tools[0],
        formData.what,
        formData.result as import('@/types').Result
      );

      const { data, error } = await supabase
        .from('posts')
        .insert({
          user_id: user!.id,
          slug,
          task_category: formData.task_category,
          what: formData.what,
          goal: formData.goal,
          ai_tools: formData.ai_tools,
          result: formData.result,
          result_detail: formData.result_detail || null,
          prompt: formData.prompt || null,
          is_anonymous: formData.is_anonymous,
        })
        .select()
        .single();

      if (error) throw error;

      // Catharsis: show success animation, then navigate
      setShowSuccess(true);
      setTimeout(() => {
        router.push(`/logs/${data.slug}?created=true`);
      }, 2000);
    } catch (error) {
      console.error('Error creating post:', error);
      setErrors({ submit: '投稿に失敗しました。もう一度お試しください。' });
      setIsSubmitting(false);
    }
  };

  const selectedCategory = TASK_CATEGORIES.find(
    (c) => c.value === formData.task_category
  );

  return (
    <div className="mx-auto max-w-2xl">
      <div className="relative">
        <Card className="p-6 md:p-8">

          {/* Disclaimer */}
          <div className="mb-7 flex gap-2.5 rounded-lg bg-gray-50 px-4 py-3 text-xs text-gray-500">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400" />
            <p>
              ここは自分のAI活用記録をみんなと共有する場所です。
              投稿すると他のメンバーがコメントやリアクションを送ることがありますが、
              <span className="font-medium text-gray-600">必ずしも回答やフィードバックがつくことを保証するものではありません。</span>
              まずは自分の記録として気軽に残しましょう。
            </p>
          </div>

          {/* Task Category */}
          <div className="mb-8">
            <label className="mb-3 block text-sm font-medium text-gray-700">
              どんなタスク？
            </label>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
              {TASK_CATEGORIES.map((category) => (
                <button
                  key={category.value}
                  type="button"
                  onClick={() => updateField('task_category', category.value)}
                  className={cn(
                    'flex flex-col items-center gap-1 rounded-xl p-3 transition-all',
                    category.color,
                    formData.task_category === category.value &&
                      'ring-2 ring-emerald-500 ring-offset-2'
                  )}
                >
                  <span className="text-xl">{category.icon}</span>
                  <span className="text-xs font-medium">{category.label}</span>
                </button>
              ))}
            </div>
            {errors.task_category && (
              <p className="mt-2 text-sm text-red-600">{errors.task_category}</p>
            )}
          </div>

          {/* What + Goal */}
          <div className="mb-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
              <div className="flex-1">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  何を
                </label>
                <Input
                  placeholder={PLACEHOLDERS.WHAT}
                  value={formData.what}
                  onChange={(e) => updateField('what', e.target.value)}
                  maxLength={VALIDATION.WHAT_MAX_LENGTH}
                  error={errors.what}
                />
              </div>
              <ArrowRight className="mt-8 hidden h-5 w-5 text-gray-300 sm:block" />
              <div className="flex-1">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  どうしたかった
                </label>
                <Input
                  placeholder={PLACEHOLDERS.GOAL}
                  value={formData.goal}
                  onChange={(e) => updateField('goal', e.target.value)}
                  maxLength={VALIDATION.GOAL_MAX_LENGTH}
                  error={errors.goal}
                />
              </div>
            </div>
            {selectedCategory && (
              <p className="mt-2 text-xs text-gray-400">
                例: {selectedCategory.example}
              </p>
            )}
          </div>

          {/* AI Tools */}
          <div className="mb-8">
            <ChipGroup
              label="使ったAI"
              options={AI_TOOLS}
              selected={formData.ai_tools}
              onChange={(selected) =>
                updateField('ai_tools', selected as AITool[])
              }
              error={errors.ai_tools}
            />
          </div>

          {/* Result */}
          <div className="mb-8">
            <label className="mb-3 block text-sm font-medium text-gray-700">
              結果
            </label>
            <div className="flex gap-3">
              {RESULTS.map((result) => (
                <button
                  key={result.value}
                  type="button"
                  onClick={() => updateField('result', result.value)}
                  className={cn(
                    'flex-1 rounded-xl border-2 py-3 text-center transition-all',
                    formData.result === result.value
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <span className="text-lg">{result.emoji}</span>
                  <p className="mt-1 text-xs font-medium text-gray-600">
                    {result.label}
                  </p>
                </button>
              ))}
            </div>
            {errors.result && (
              <p className="mt-2 text-sm text-red-600">{errors.result}</p>
            )}

            {/* Result Detail */}
            {formData.result && (
              <div className="mt-4">
                <Textarea
                  placeholder={
                    formData.result === 'solved'
                      ? '例: 作業時間が3時間から30分に短縮。精度も問題なし！'
                      : formData.result === 'partial'
                        ? '例: 8割は自動化できたが、一部手動での確認が必要だった'
                        : '例: プロンプトの工夫が必要そう。もっと具体的な指示が必要だった'
                  }
                  value={formData.result_detail}
                  onChange={(e) => updateField('result_detail', e.target.value)}
                  maxLength={VALIDATION.RESULT_DETAIL_MAX_LENGTH}
                  showCount
                  rows={3}
                  helperText="満足度やつまづきポイントを共有すると、他の人の参考になります（任意）"
                />
              </div>
            )}
          </div>

          {/* Prompt */}
          <div className="mb-8">
            <Textarea
              label="使ったプロンプト（AIへの指示）"
              placeholder={PLACEHOLDERS.PROMPT}
              value={formData.prompt}
              onChange={(e) => updateField('prompt', e.target.value)}
              maxLength={VALIDATION.PROMPT_MAX_LENGTH}
              showCount
              rows={4}
              helperText="実際にAIに入力した文章を共有すると、読んだ人がすぐ試せます（任意）"
            />
          </div>

          {/* Anonymous toggle */}
          <div className="mb-8 flex items-center gap-3">
            <input
              type="checkbox"
              id="is_anonymous"
              checked={formData.is_anonymous}
              onChange={(e) => updateField('is_anonymous', e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            />
            <label htmlFor="is_anonymous" className="text-sm text-gray-600">
              匿名で投稿する
            </label>
          </div>

          {/* Error message */}
          {errors.submit && (
            <p className="mb-4 text-center text-sm text-red-600">
              {errors.submit}
            </p>
          )}

          {/* Submit */}
          <Button
            className="w-full"
            size="lg"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            disabled={isSubmitting || showSuccess}
          >
            <Check className="mr-2 h-5 w-5" />
            あしあとを残す
          </Button>
        </Card>

        {/* Catharsis success overlay */}
        {showSuccess && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center overflow-hidden rounded-xl bg-white">
            {/* Confetti particles */}
            <div className="relative flex items-center justify-center">
              {CONFETTI.map((p, i) => (
                <div
                  key={i}
                  className="animate-confetti-burst absolute h-2.5 w-2.5 rounded-full"
                  style={{
                    backgroundColor: p.color,
                    '--tx': `${p.x}px`,
                    '--ty': `${p.y}px`,
                    animationDelay: `${p.delay}s`,
                  } as React.CSSProperties}
                />
              ))}

              {/* Stamp circle */}
              <div className="animate-stamp animate-success-glow flex h-24 w-24 items-center justify-center rounded-full border-[3px] border-emerald-500">
                <Check className="h-12 w-12 text-emerald-500" strokeWidth={2.5} />
              </div>
            </div>

            <p className="animate-fade-up mt-8 text-xl font-bold text-gray-800">
              あしあとを残しました！
            </p>
            <p className="animate-fade-up-delay mt-2 text-sm text-gray-400">
              ページに移動します…
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
