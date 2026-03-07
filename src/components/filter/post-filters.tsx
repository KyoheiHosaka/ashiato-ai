'use client';

import { useState } from 'react';
import { Select, Button, Input } from '@/components/ui';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import {
  INDUSTRIES,
  ROLES,
  CHALLENGE_CATEGORIES,
  AI_TOOLS,
  RESULTS,
} from '@/constants';
import type { PostFilters } from '@/types';

interface PostFiltersProps {
  filters: PostFilters;
  onChange: (filters: PostFilters) => void;
}

export function PostFiltersComponent({ filters, onChange }: PostFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleChange = (key: keyof PostFilters, value: string) => {
    onChange({
      ...filters,
      [key]: value || undefined,
    });
  };

  const clearFilters = () => {
    onChange({});
  };

  const hasActiveFilters = Object.values(filters).some((v) => v);

  const industryOptions = INDUSTRIES.map((i) => ({ value: i, label: i }));
  const roleOptions = ROLES.map((r) => ({ value: r, label: r }));
  const categoryOptions = CHALLENGE_CATEGORIES.map((c) => ({
    value: c,
    label: c,
  }));
  const toolOptions = AI_TOOLS.map((t) => ({ value: t, label: t }));
  const resultOptions = RESULTS.map((r) => ({
    value: r.value,
    label: `${r.emoji} ${r.label}`,
  }));

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="キーワードで検索..."
          value={filters.search || ''}
          onChange={(e) => handleChange('search', e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Toggle filters */}
      <div className="mt-3 flex items-center justify-between">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <SlidersHorizontal className="h-4 w-4" />
          詳細フィルタ
          {hasActiveFilters && (
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">
              適用中
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
            クリア
          </button>
        )}
      </div>

      {/* Expanded filters */}
      {isExpanded && (
        <div className="mt-4 grid gap-4 border-t border-gray-100 pt-4 sm:grid-cols-2 lg:grid-cols-5">
          <Select
            label="業種"
            options={industryOptions}
            value={filters.industry || ''}
            onChange={(e) => handleChange('industry', e.target.value)}
            placeholder="すべて"
          />
          <Select
            label="職種"
            options={roleOptions}
            value={filters.role || ''}
            onChange={(e) => handleChange('role', e.target.value)}
            placeholder="すべて"
          />
          <Select
            label="課題カテゴリ"
            options={categoryOptions}
            value={filters.challenge_category || ''}
            onChange={(e) => handleChange('challenge_category', e.target.value)}
            placeholder="すべて"
          />
          <Select
            label="使用AI"
            options={toolOptions}
            value={filters.ai_tool || ''}
            onChange={(e) => handleChange('ai_tool', e.target.value)}
            placeholder="すべて"
          />
          <Select
            label="結果"
            options={resultOptions}
            value={filters.result || ''}
            onChange={(e) => handleChange('result', e.target.value)}
            placeholder="すべて"
          />
        </div>
      )}
    </div>
  );
}
