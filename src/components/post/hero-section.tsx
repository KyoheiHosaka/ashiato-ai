import Link from 'next/link';
import { Button } from '@/components/ui';
import { PenSquare } from 'lucide-react';
import { SITE_CONFIG } from '@/constants';

export function HeroSection() {
  return (
    <section className="px-4 py-20 md:py-28">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="mb-6 text-3xl font-bold leading-tight text-gray-900 md:text-4xl lg:text-5xl">
          <span className="text-emerald-600">「この課題、AIでこう解決した」</span>
          <br />
          が集まる場所
        </h1>
        <p className="mb-10 text-lg text-gray-500">
          {SITE_CONFIG.tagline}
        </p>

        <Link href="/post/new">
          <Button size="lg" className="gap-2 px-8">
            <PenSquare className="h-5 w-5" />
            足跡を残す
          </Button>
        </Link>
      </div>
    </section>
  );
}
