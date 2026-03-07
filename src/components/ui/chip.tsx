'use client';

import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

export interface ChipProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  disabled?: boolean;
  className?: string;
}

export function Chip({
  label,
  selected = false,
  onClick,
  onRemove,
  disabled = false,
  className,
}: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1',
        selected
          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
    >
      {label}
      {selected && onRemove && (
        <X
          className="h-3.5 w-3.5 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        />
      )}
    </button>
  );
}

export interface ChipGroupProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  multiple?: boolean;
  label?: string;
  error?: string;
  className?: string;
}

export function ChipGroup({
  options,
  selected,
  onChange,
  multiple = true,
  label,
  error,
  className,
}: ChipGroupProps) {
  const handleClick = (option: string) => {
    if (multiple) {
      if (selected.includes(option)) {
        onChange(selected.filter((s) => s !== option));
      } else {
        onChange([...selected, option]);
      }
    } else {
      onChange([option]);
    }
  };

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="mb-2 block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <Chip
            key={option}
            label={option}
            selected={selected.includes(option)}
            onClick={() => handleClick(option)}
          />
        ))}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
