'use client';

import { Input } from '@/components/ui';
import { Search } from 'lucide-react';
import type { PostFilters } from '@/types';

interface PostFiltersProps {
  filters: PostFilters;
  onChange: (filters: PostFilters) => void;
}

export function PostFiltersComponent({ filters, onChange }: PostFiltersProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <Input
        placeholder="キーワードで検索..."
        value={filters.search || ''}
        onChange={(e) => onChange({ ...filters, search: e.target.value || undefined })}
        className="pl-10"
      />
    </div>
  );
}
