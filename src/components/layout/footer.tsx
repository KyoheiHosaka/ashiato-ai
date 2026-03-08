import Link from 'next/link';
import { SITE_CONFIG } from '@/constants';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex flex-col items-center gap-1 md:items-start">
            <span className="text-lg font-bold text-emerald-600">
              {SITE_CONFIG.name}
            </span>
            <p className="text-sm text-gray-500">{SITE_CONFIG.tagline}</p>
          </div>

        </div>

        <div className="mt-8 border-t border-gray-200 pt-6 text-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} {SITE_CONFIG.brand}. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
