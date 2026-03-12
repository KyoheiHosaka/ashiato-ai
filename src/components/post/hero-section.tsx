import Link from 'next/link';
import { PenSquare } from 'lucide-react';
import { SITE_CONFIG } from '@/constants';

export function HeroSection() {
  return (
    <section className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-3xl text-center">

        <h1 className="animate-fade-up mb-6 text-3xl leading-tight tracking-tight md:text-4xl lg:text-5xl">
          <span className="font-bold text-emerald-500">「この課題、AIでこう解決した」</span>
          <br />
          <span className="font-light text-gray-400">が集まる場所</span>
        </h1>

        <p className="animate-fade-up-delay mb-12 text-sm tracking-[0.15em] text-gray-300">
          {SITE_CONFIG.tagline}
        </p>

        <div className="animate-fade-up-delay-2">
          <Link
            href="/post/new"
            className="group inline-flex items-center gap-2.5 rounded-full border border-gray-900 bg-transparent px-7 py-3 text-sm font-medium text-gray-900 transition-all duration-300 hover:bg-gray-900 hover:text-white"
          >
            <PenSquare className="h-4 w-4 transition-transform duration-300 group-hover:rotate-[-8deg]" />
            あしあとを残す
          </Link>
        </div>

      </div>
    </section>
  );
}
