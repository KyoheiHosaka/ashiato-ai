'use client';

import { cn } from '@/lib/utils';
import {
  FileText,
  BarChart3,
  Wrench,
  MessageCircle,
  Megaphone,
  Search,
  MoreHorizontal,
} from 'lucide-react';
import type { ChallengeCategory } from '@/types';

const CATEGORY_CONFIG: {
  value: ChallengeCategory;
  label: string;
  icon: React.ElementType;
  color: string;
}[] = [
  {
    value: '書類作成',
    label: '書類作成',
    icon: FileText,
    color: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
  },
  {
    value: 'データ分析',
    label: 'データ分析',
    icon: BarChart3,
    color: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
  },
  {
    value: '社内ツール',
    label: '社内ツール',
    icon: Wrench,
    color: 'bg-orange-50 text-orange-600 hover:bg-orange-100',
  },
  {
    value: '問合せ対応',
    label: '問合せ対応',
    icon: MessageCircle,
    color: 'bg-green-50 text-green-600 hover:bg-green-100',
  },
  {
    value: 'マーケティング',
    label: 'マーケ',
    icon: Megaphone,
    color: 'bg-pink-50 text-pink-600 hover:bg-pink-100',
  },
  {
    value: 'リサーチ',
    label: 'リサーチ',
    icon: Search,
    color: 'bg-cyan-50 text-cyan-600 hover:bg-cyan-100',
  },
  {
    value: 'その他',
    label: 'その他',
    icon: MoreHorizontal,
    color: 'bg-gray-50 text-gray-600 hover:bg-gray-100',
  },
];

interface CategoryCardsProps {
  selected: ChallengeCategory | null;
  onChange: (category: ChallengeCategory | null) => void;
}

export function CategoryCards({ selected, onChange }: CategoryCardsProps) {
  const handleClick = (category: ChallengeCategory) => {
    if (selected === category) {
      onChange(null);
    } else {
      onChange(category);
    }
  };

  return (
    <div className="grid grid-cols-4 gap-3 sm:grid-cols-7">
      {CATEGORY_CONFIG.map(({ value, label, icon: Icon, color }) => (
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
          <Icon className="h-6 w-6" />
          <span className="text-xs font-medium">{label}</span>
        </button>
      ))}
    </div>
  );
}
