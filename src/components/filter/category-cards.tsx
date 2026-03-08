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
    <div className="grid grid-cols-4 gap-3 sm:grid-cols-7">
      {TASK_CATEGORIES.map(({ value, label, icon, color }) => (
        <button
          key={value}
          onClick={() => handleClick(value)}
          className={cn(
            'flex flex-col items-center gap-2 rounded-xl p-4 transition-all',
            color,
            selected === value && 'ring-2 ring-emerald-500 ring-offset-2',
            selected && selected !== value && 'opacity-50'
          )}
        >
          <span className="text-2xl">{icon}</span>
          <span className="text-xs font-medium">{label}</span>
        </button>
      ))}
    </div>
  );
}
