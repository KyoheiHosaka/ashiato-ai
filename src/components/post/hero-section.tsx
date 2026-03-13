import { SITE_CONFIG } from '@/constants';
import { SimplePostForm } from '@/components/post/simple-post-form';

export function HeroSection() {
  return (
    <section className="px-4 pb-10 pt-8 md:pb-14 md:pt-10">
      <div className="mx-auto max-w-2xl">

        <div className="animate-fade-up mb-6 text-center">
          <p className="mb-2 text-[10px] tracking-[0.25em] text-gray-300">
            {SITE_CONFIG.tagline}
          </p>
          <h1 className="text-2xl font-bold leading-snug text-gray-900 md:text-3xl">
            あなたの<span className="text-emerald-500">AI あしあと</span>を残す
          </h1>
        </div>

        <div className="animate-fade-up-delay">
          <SimplePostForm />
        </div>

      </div>
    </section>
  );
}
