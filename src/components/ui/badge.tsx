import { cn } from '@/lib/utils';
import type { Result } from '@/types';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({
  children,
  variant = 'default',
  size = 'sm',
  className,
}: BadgeProps) {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    error: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}

// Result-specific badge
export function ResultBadge({ result }: { result: Result }) {
  const config: Record<Result, { variant: BadgeProps['variant']; label: string }> = {
    solved: { variant: 'success', label: '✅ 解決' },
    partial: { variant: 'warning', label: '△ 部分的に解決' },
    unsolved: { variant: 'error', label: '❌ 解決できなかった' },
  };

  const { variant, label } = config[result];

  return <Badge variant={variant}>{label}</Badge>;
}
