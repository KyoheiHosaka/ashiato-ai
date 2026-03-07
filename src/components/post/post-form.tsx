'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Select,
  Textarea,
  ChipGroup,
  Card,
  CardContent,
} from '@/components/ui';
import { useAuthContext } from '@/components/auth';
import { createBrowserClient } from '@/lib/supabase';
import {
  INDUSTRIES,
  ROLES,
  CHALLENGE_CATEGORIES,
  AI_TOOLS,
  METHODS,
  RESULTS,
  TIME_SPENT_OPTIONS,
  TECH_LEVELS,
  VALIDATION,
  PLACEHOLDERS,
} from '@/constants';
import type { PostFormData, Result } from '@/types';
import { Check, Loader2 } from 'lucide-react';

const STEPS = [
  { id: 1, title: '基本情報', description: '業種・職種・課題' },
  { id: 2, title: 'AI活用', description: 'ツール・方法・結果' },
  { id: 3, title: '詳細 (任意)', description: '補足情報' },
];

export function PostForm() {
  const router = useRouter();
  const { user, isAuthenticated, openLoginModal } = useAuthContext();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<PostFormData>({
    industry: '' as PostFormData['industry'],
    role: '' as PostFormData['role'],
    challenge_category: '' as PostFormData['challenge_category'],
    challenge_summary: '',
    ai_tools: [],
    methods: [],
    result: '' as Result,
    result_detail: '',
    time_spent: undefined,
    tech_level: undefined,
    tips: '',
    is_anonymous: false,
  });

  const updateFormData = <K extends keyof PostFormData>(
    key: K,
    value: PostFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.industry) newErrors.industry = '業種を選択してください';
      if (!formData.role) newErrors.role = '職種を選択してください';
      if (!formData.challenge_category)
        newErrors.challenge_category = '課題カテゴリを選択してください';
      if (!formData.challenge_summary.trim()) {
        newErrors.challenge_summary = '課題の概要を入力してください';
      } else if (
        formData.challenge_summary.length > VALIDATION.CHALLENGE_SUMMARY_MAX_LENGTH
      ) {
        newErrors.challenge_summary = `${VALIDATION.CHALLENGE_SUMMARY_MAX_LENGTH}文字以内で入力してください`;
      }
    }

    if (step === 2) {
      if (formData.ai_tools.length === 0)
        newErrors.ai_tools = '使用したAIを選択してください';
      if (formData.methods.length === 0)
        newErrors.methods = '使用した方法を選択してください';
      if (!formData.result) newErrors.result = '結果を選択してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      openLoginModal('投稿するにはログインが必要です');
      return;
    }

    if (!validateStep(1) || !validateStep(2)) {
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createBrowserClient();

      const { data, error } = await supabase
        .from('posts')
        .insert({
          user_id: user!.id,
          industry: formData.industry,
          role: formData.role,
          challenge_category: formData.challenge_category,
          challenge_summary: formData.challenge_summary,
          ai_tools: formData.ai_tools,
          methods: formData.methods,
          result: formData.result,
          result_detail: formData.result_detail || null,
          time_spent: formData.time_spent || null,
          tech_level: formData.tech_level || null,
          tips: formData.tips || null,
          is_anonymous: formData.is_anonymous,
        })
        .select()
        .single();

      if (error) throw error;

      router.push(`/post/${data.id}?created=true`);
    } catch (error) {
      console.error('Error creating post:', error);
      setErrors({ submit: '投稿に失敗しました。もう一度お試しください。' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const industryOptions = INDUSTRIES.map((i) => ({ value: i, label: i }));
  const roleOptions = ROLES.map((r) => ({ value: r, label: r }));
  const categoryOptions = CHALLENGE_CATEGORIES.map((c) => ({
    value: c,
    label: c,
  }));
  const timeSpentOptions = TIME_SPENT_OPTIONS.map((t) => ({
    value: t,
    label: t,
  }));
  const techLevelOptions = TECH_LEVELS.map((t) => ({ value: t, label: t }));

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                    currentStep > step.id
                      ? 'border-emerald-600 bg-emerald-600 text-white'
                      : currentStep === step.id
                        ? 'border-emerald-600 bg-white text-emerald-600'
                        : 'border-gray-300 bg-white text-gray-400'
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    step.id
                  )}
                </div>
                <div className="mt-2 text-center">
                  <p
                    className={`text-sm font-medium ${
                      currentStep >= step.id ? 'text-gray-900' : 'text-gray-400'
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className="hidden text-xs text-gray-500 sm:block">
                    {step.description}
                  </p>
                </div>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`mx-4 h-0.5 w-12 sm:w-24 ${
                    currentStep > step.id ? 'bg-emerald-600' : 'bg-gray-300'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form content */}
      <Card>
        <CardContent className="p-6">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">基本情報</h2>

              <Select
                label="業種 *"
                options={industryOptions}
                value={formData.industry}
                onChange={(e) =>
                  updateFormData(
                    'industry',
                    e.target.value as PostFormData['industry']
                  )
                }
                error={errors.industry}
              />

              <Select
                label="職種 *"
                options={roleOptions}
                value={formData.role}
                onChange={(e) =>
                  updateFormData('role', e.target.value as PostFormData['role'])
                }
                error={errors.role}
              />

              <Select
                label="課題カテゴリ *"
                options={categoryOptions}
                value={formData.challenge_category}
                onChange={(e) =>
                  updateFormData(
                    'challenge_category',
                    e.target.value as PostFormData['challenge_category']
                  )
                }
                error={errors.challenge_category}
              />

              <Textarea
                label="課題の概要 *"
                placeholder={PLACEHOLDERS.CHALLENGE_SUMMARY}
                value={formData.challenge_summary}
                onChange={(e) =>
                  updateFormData('challenge_summary', e.target.value)
                }
                maxLength={VALIDATION.CHALLENGE_SUMMARY_MAX_LENGTH}
                showCount
                rows={3}
                error={errors.challenge_summary}
              />
            </div>
          )}

          {/* Step 2: AI Usage */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">AI活用</h2>

              <ChipGroup
                label="使用したAI *"
                options={AI_TOOLS}
                selected={formData.ai_tools}
                onChange={(selected) =>
                  updateFormData('ai_tools', selected as PostFormData['ai_tools'])
                }
                error={errors.ai_tools}
              />

              <ChipGroup
                label="使用した方法 *"
                options={METHODS}
                selected={formData.methods}
                onChange={(selected) =>
                  updateFormData('methods', selected as PostFormData['methods'])
                }
                error={errors.methods}
              />

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  結果 *
                </label>
                <div className="flex flex-wrap gap-3">
                  {RESULTS.map((result) => (
                    <button
                      key={result.value}
                      type="button"
                      onClick={() => updateFormData('result', result.value)}
                      className={`rounded-lg border-2 px-4 py-2 text-sm font-medium transition-colors ${
                        formData.result === result.value
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {result.emoji} {result.label}
                    </button>
                  ))}
                </div>
                {errors.result && (
                  <p className="mt-1 text-sm text-red-600">{errors.result}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Details (Optional) */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">詳細 (任意)</h2>
              <p className="text-sm text-gray-500">
                より詳しい情報を追加すると、他のユーザーの参考になります。
              </p>

              <Textarea
                label="結果の詳細"
                placeholder={PLACEHOLDERS.RESULT_DETAIL}
                value={formData.result_detail || ''}
                onChange={(e) =>
                  updateFormData('result_detail', e.target.value)
                }
                maxLength={VALIDATION.RESULT_DETAIL_MAX_LENGTH}
                showCount
                rows={3}
              />

              <Select
                label="かかった時間"
                options={timeSpentOptions}
                value={formData.time_spent || ''}
                onChange={(e) =>
                  updateFormData(
                    'time_spent',
                    e.target.value as PostFormData['time_spent']
                  )
                }
              />

              <Select
                label="技術レベル"
                options={techLevelOptions}
                value={formData.tech_level || ''}
                onChange={(e) =>
                  updateFormData(
                    'tech_level',
                    e.target.value as PostFormData['tech_level']
                  )
                }
              />

              <Textarea
                label="コツ / Tips"
                placeholder={PLACEHOLDERS.TIPS}
                value={formData.tips || ''}
                onChange={(e) => updateFormData('tips', e.target.value)}
                maxLength={VALIDATION.TIPS_MAX_LENGTH}
                showCount
                rows={2}
              />

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_anonymous"
                  checked={formData.is_anonymous}
                  onChange={(e) =>
                    updateFormData('is_anonymous', e.target.checked)
                  }
                  className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="is_anonymous" className="text-sm text-gray-700">
                  匿名で投稿する
                </label>
              </div>
            </div>
          )}

          {/* Error message */}
          {errors.submit && (
            <p className="mt-4 text-center text-sm text-red-600">
              {errors.submit}
            </p>
          )}

          {/* Navigation */}
          <div className="mt-8 flex justify-between">
            {currentStep > 1 ? (
              <Button variant="outline" onClick={handleBack}>
                戻る
              </Button>
            ) : (
              <div />
            )}

            {currentStep < 3 ? (
              <Button onClick={handleNext}>次へ</Button>
            ) : (
              <Button
                onClick={handleSubmit}
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                投稿する
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
