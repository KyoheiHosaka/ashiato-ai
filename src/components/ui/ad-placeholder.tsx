// 広告プレイスホルダー
// 実際の広告ネットワーク（Google AdSense等）に置き換える際は
// このコンポーネントを差し替えるだけでOK

import { cn } from '@/lib/utils';

interface AdPlaceholderProps {
  variant?: 'banner' | 'rectangle';
  className?: string;
}

export function AdPlaceholder({ variant = 'banner', className }: AdPlaceholderProps) {
  if (variant === 'rectangle') {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-xl bg-gray-50',
          'border border-dashed border-gray-100',
          'min-h-[250px]',
          className
        )}
        aria-label="広告スペース"
        data-ad-slot="rectangle"
      >
        <span className="text-[10px] tracking-widest text-gray-200">SPONSORED</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex w-full items-center justify-center rounded-xl bg-gray-50',
        'border border-dashed border-gray-100',
        'h-20',
        className
      )}
      aria-label="広告スペース"
      data-ad-slot="banner"
    >
      <span className="text-[10px] tracking-widest text-gray-200">SPONSORED</span>
    </div>
  );
}
