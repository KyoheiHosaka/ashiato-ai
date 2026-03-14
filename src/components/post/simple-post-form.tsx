'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChipGroup } from '@/components/ui';
import { useAuthContext } from '@/components/auth';
import { createBrowserClient } from '@/lib/supabase';
import { TASK_CATEGORIES, AI_TOOLS, RESULTS, VALIDATION, PLACEHOLDERS } from '@/constants';
import { generateUniqueSlug } from '@/lib/utils';
import type { TaskCategory, AITool, Result } from '@/types';
import { cn } from '@/lib/utils';
import { ArrowRight, Check } from 'lucide-react';

// Section card — white on cream, left accent border for rhythm
const S = 'rounded-xl bg-white px-4 py-5 mb-3 shadow-sm border-l-[3px] border-emerald-400';
const STEP = 'text-[11px] font-bold tracking-[0.18em] text-emerald-600 uppercase mb-3 flex items-center gap-2';
const LINE_INPUT = 'w-full border-0 border-b-[2.5px] border-gray-300 bg-transparent px-0 py-2 text-sm placeholder:text-gray-300 focus:border-emerald-500 focus:outline-none focus:ring-0 transition-colors duration-150';
const LINE_TEXTAREA = 'w-full resize-none border-0 border-b-2 border-gray-200 bg-transparent px-0 py-1.5 text-sm placeholder:text-gray-300 focus:border-emerald-400 focus:outline-none focus:ring-0 transition-colors duration-150';

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

  const updateField = <K extends keyof typeof formData>(key: K, value: (typeof formData)[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.task_category) newErrors.task_category = 'カテゴリを選択してください';
    if (!formData.what.trim())   newErrors.what = '入力してください';
    if (!formData.goal.trim())   newErrors.goal = '入力してください';
    if (formData.ai_tools.length === 0) newErrors.ai_tools = '使用したAIを選択してください';
    if (!formData.result)        newErrors.result = '結果を選択してください';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [createdSlug, setCreatedSlug] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const supabase = createBrowserClient();
      const slug = await generateUniqueSlug(supabase, formData.ai_tools[0], formData.what, formData.result as Result);
      const { data, error } = await supabase.from('posts').insert({
        user_id: user?.id ?? null, slug,
        task_category: formData.task_category,
        what: formData.what, goal: formData.goal,
        ai_tools: formData.ai_tools, result: formData.result,
        result_detail: formData.result_detail || null,
        prompt: formData.prompt || null,
        is_anonymous: isAuthenticated ? formData.is_anonymous : true,
      }).select().single();
      if (error) throw error;
      setCreatedSlug(data.slug);
      setShowSuccess(true);
      // Auto-redirect only for logged-in users; anonymous users see the login CTA first
      if (isAuthenticated) {
        setTimeout(() => router.push(`/logs/${data.slug}?created=true`), 2000);
      }
    } catch (error) {
      console.error('Error creating post:', error);
      setErrors({ submit: '投稿に失敗しました。もう一度お試しください。' });
      setIsSubmitting(false);
    }
  };

  const selectedCategory = TASK_CATEGORIES.find((c) => c.value === formData.task_category);

  return (
    <div className="mx-auto max-w-2xl">
      {/* ── Page stack — diagonal tilt for visibility ── */}
      <div className="relative pb-4">
        {/* Sheet 3 (deepest) */}
        <div className="absolute inset-0 origin-bottom rounded-2xl bg-[#a09b88] shadow-md" style={{ transform: 'rotate(3.5deg) translateY(6px)' }} />
        {/* Sheet 2 */}
        <div className="absolute inset-0 origin-bottom rounded-2xl bg-[#c4bfac] shadow-md" style={{ transform: 'rotate(2deg) translateY(3px)' }} />
        {/* Sheet 1 */}
        <div className="absolute inset-0 origin-bottom rounded-2xl bg-[#ddd9cc] shadow-sm" style={{ transform: 'rotate(0.8deg) translateY(1.5px)' }} />

        {/* ── Main page ── */}
        <div className="relative overflow-hidden rounded-2xl shadow-2xl shadow-gray-400/40">

          {/* Notepad header */}
          <div className="relative bg-gradient-to-r from-emerald-500 to-emerald-400 px-6 pb-5 pt-3">
            {/* Spiral holes */}
            <div className="absolute -top-0.5 left-0 right-0 flex justify-around px-4">
              {[...Array(13)].map((_, i) => (
                <div
                  key={i}
                  className="h-[18px] w-[18px] rounded-full bg-white/85 shadow-[inset_0_2px_4px_rgba(0,0,0,0.25)]"
                />
              ))}
            </div>
            <div className="pt-5">
              <p className="text-[10px] font-semibold tracking-[0.3em] text-emerald-100">MY AI LOGS</p>
              <h2 className="mt-0.5 text-lg font-bold text-white">AI あしあとメモ</h2>
              <p className="mt-1 text-[11px] text-emerald-100/80">さっと書いて、記録に残そう</p>
            </div>
          </div>

          {/* Paper body */}
          <div className="bg-[#fffef7] px-4 pb-6 pt-4">

            {/* 01 — Category */}
            <div className={S}>
              <p className={STEP}>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-black text-white shadow-sm">1</span>
                どんなタスク？
              </p>
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
                {TASK_CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => updateField('task_category', cat.value)}
                    className={cn(
                      'flex flex-col items-center gap-1.5 rounded-xl p-2.5 text-center transition-all duration-150',
                      cat.color,
                      formData.task_category === cat.value
                        ? 'scale-110 shadow-lg ring-2 ring-emerald-500 ring-offset-2'
                        : 'hover:scale-105 hover:shadow-md'
                    )}
                  >
                    <span className="text-2xl leading-none">{cat.icon}</span>
                    <span className="text-[10px] font-semibold leading-tight">{cat.label}</span>
                  </button>
                ))}
              </div>
              {errors.task_category && <p className="mt-2 text-xs text-red-500">{errors.task_category}</p>}
            </div>

            {/* 02 — What → Goal */}
            <div className={S}>
              <p className={STEP}>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-black text-white shadow-sm">2</span>
                何をどうしたかった？
              </p>
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
                <div className="flex-1">
                  <p className="mb-1 text-[11px] font-medium text-gray-400">何を</p>
                  <input
                    type="text"
                    placeholder={PLACEHOLDERS.WHAT}
                    value={formData.what}
                    onChange={(e) => updateField('what', e.target.value)}
                    maxLength={VALIDATION.WHAT_MAX_LENGTH}
                    className={LINE_INPUT}
                  />
                  {errors.what && <p className="mt-1 text-xs text-red-500">{errors.what}</p>}
                </div>
                <ArrowRight className="mb-3 hidden h-5 w-5 shrink-0 text-emerald-300 sm:block" />
                <div className="flex-1">
                  <p className="mb-1 text-[11px] font-medium text-gray-400">どうしたかった</p>
                  <input
                    type="text"
                    placeholder={PLACEHOLDERS.GOAL}
                    value={formData.goal}
                    onChange={(e) => updateField('goal', e.target.value)}
                    maxLength={VALIDATION.GOAL_MAX_LENGTH}
                    className={LINE_INPUT}
                  />
                  {errors.goal && <p className="mt-1 text-xs text-red-500">{errors.goal}</p>}
                </div>
              </div>
              {selectedCategory && (
                <p className="mt-2 text-[11px] text-gray-400">例: {selectedCategory.example}</p>
              )}
            </div>

            {/* 03 — AI Tools */}
            <div className={S}>
              <p className={STEP}>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-black text-white shadow-sm">3</span>
                使ったAI
              </p>
              <ChipGroup
                options={AI_TOOLS}
                selected={formData.ai_tools}
                onChange={(selected) => updateField('ai_tools', selected as AITool[])}
                error={errors.ai_tools}
              />
            </div>

            {/* 04 — Result */}
            <div className={S}>
              <p className={STEP}>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-black text-white shadow-sm">4</span>
                結果どうだった？
              </p>
              <div className="flex gap-3">
                {RESULTS.map((result) => (
                  <button
                    key={result.value}
                    type="button"
                    onClick={() => updateField('result', result.value)}
                    className={cn(
                      'flex flex-1 flex-col items-center gap-2 rounded-2xl border-2 py-5 transition-all duration-150',
                      formData.result === result.value
                        ? result.value === 'solved'
                          ? 'scale-105 border-emerald-500 bg-emerald-500 shadow-lg shadow-emerald-200'
                          : result.value === 'partial'
                            ? 'scale-105 border-amber-400 bg-amber-400 shadow-lg shadow-amber-200'
                            : 'scale-105 border-slate-400 bg-slate-400 shadow-lg shadow-slate-200'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                    )}
                  >
                    <span className="text-3xl leading-none">{result.emoji}</span>
                    <p className={cn(
                      'text-[11px] font-bold',
                      formData.result === result.value ? 'text-white' : 'text-gray-600'
                    )}>
                      {result.label}
                    </p>
                  </button>
                ))}
              </div>
              {errors.result && <p className="mt-2 text-xs text-red-500">{errors.result}</p>}

              {formData.result && (
                <div className="mt-4">
                  <p className="mb-1 text-[11px] font-medium text-gray-400">もう少し教えてください（任意）</p>
                  <textarea
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
                    rows={3}
                    className={LINE_TEXTAREA}
                  />
                </div>
              )}
            </div>

            {/* 05 — Prompt (optional) */}
            <div className="rounded-xl bg-white px-4 py-5 mb-3 shadow-sm border-l-[3px] border-gray-200">
              <p className={STEP}>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-300 text-[10px] font-black text-white shadow-sm">5</span>
                使ったプロンプト
                <span className="ml-1 text-[10px] font-normal normal-case tracking-normal text-gray-400">任意</span>
              </p>
              <textarea
                placeholder={PLACEHOLDERS.PROMPT}
                value={formData.prompt}
                onChange={(e) => updateField('prompt', e.target.value)}
                maxLength={VALIDATION.PROMPT_MAX_LENGTH}
                rows={4}
                className={LINE_TEXTAREA}
              />
              <p className="mt-2 text-[11px] text-gray-400">実際にAIに入力した文章を共有すると、読んだ人がすぐ試せます</p>
            </div>

            {/* Anonymous + Submit */}
            <div className="px-1 pt-1">
              {isAuthenticated && (
                <div className="mb-5 flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    id="is_anonymous"
                    checked={formData.is_anonymous}
                    onChange={(e) => updateField('is_anonymous', e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <label htmlFor="is_anonymous" className="text-xs text-gray-500">匿名で投稿する</label>
                </div>
              )}

              {errors.submit && (
                <p className="mb-4 text-center text-sm text-red-600">{errors.submit}</p>
              )}

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || showSuccess}
                className="group w-full overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 py-4 text-sm font-bold text-white shadow-lg shadow-emerald-200 transition-all duration-200 hover:from-emerald-600 hover:to-emerald-500 hover:shadow-emerald-300 disabled:opacity-50"
              >
                <span className="flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      投稿中…
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      あしあとを残す
                      <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                    </>
                  )}
                </span>
              </button>
            </div>
          </div>

          {/* ── Catharsis overlay ── */}
          {showSuccess && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center overflow-hidden bg-[#fffef7] px-6">
              <div className="relative flex items-center justify-center">
                <div className="animate-ink-spread absolute h-24 w-24 rounded-full border-2 border-emerald-400 opacity-0" />
                <div className="animate-stamp-drop flex h-24 w-24 items-center justify-center rounded-full border-[3px] border-emerald-500 bg-[#fffef7]">
                  <svg viewBox="0 0 28 28" className="h-11 w-11" fill="none">
                    <polyline
                      points="4,15 11,22 24,7"
                      stroke="#10b981"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="animate-draw-check"
                    />
                  </svg>
                </div>
              </div>
              <p className="animate-fade-up mt-8 text-xl font-bold text-gray-800">あしあとを残しました</p>

              {isAuthenticated ? (
                <p className="animate-fade-up-delay mt-2 text-sm text-gray-400">ページに移動します…</p>
              ) : (
                <div className="animate-fade-up-delay mt-6 w-full max-w-xs text-center">
                  <p className="mb-4 text-sm text-gray-500">
                    アカウントを作ると、この足跡を後から見返せます。
                  </p>
                  <button
                    type="button"
                    onClick={() => openLoginModal()}
                    className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 py-3 text-sm font-bold text-white hover:bg-gray-700"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Googleでアカウント作成
                  </button>
                  {createdSlug && (
                    <button
                      type="button"
                      onClick={() => router.push(`/logs/${createdSlug}?created=true`)}
                      className="text-sm text-gray-400 underline underline-offset-2 hover:text-gray-600"
                    >
                      このまま投稿を見る →
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
