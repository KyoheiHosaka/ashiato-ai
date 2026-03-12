'use client';

import { cn } from '@/lib/utils';
import { TASK_CATEGORIES } from '@/constants';
import type { TaskCategory } from '@/types';

interface CategoryCardsProps {
  selected: TaskCategory | null;
  onChange: (category: TaskCategory | null) => void;
}

export function CategoryCards({ selected, onChange }: CategoryCardsProps) {
  const handleClick = (category: TaskCategory) => {
    onChange(selected === category ? null : category);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {TASK_CATEGORIES.map(({ value, label, icon }) => (
        <button
          key={value}
          onClick={() => handleClick(value)}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-all',
            selected === value
              ? 'border-gray-900 bg-gray-900 text-white'
              : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400'
          )}
        >
          <span className="text-sm">{icon}</span>
          {label}
        </button>
      ))}
    </div>
  );
}
