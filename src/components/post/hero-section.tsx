import { SITE_CONFIG } from '@/constants';
import { SimplePostForm } from '@/components/post/simple-post-form';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">

      {/* Stage light — radial gradient anchors the eye to the form */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 90% 60% at 50% 38%, #ffffff 30%, #f0f9f5 75%, #e8f5ee 100%)',
        }}
      />

      <div className="relative mx-auto max-w-4xl px-6 pb-20 pt-16 md:pb-28 md:pt-24">

        {/* Eyebrow — hairlines flank the tagline, framing the stage */}
        <div className="animate-fade-up mb-10 flex flex-col items-center gap-2.5">
          <div className="flex items-center gap-5">
            <span className="h-px w-12 bg-emerald-200" />
            <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-gray-400">
              {SITE_CONFIG.tagline}
            </p>
            <span className="h-px w-12 bg-emerald-200" />
          </div>
          <h1 className="text-lg font-medium text-gray-400 md:text-xl">
            あなたの{' '}
            <span className="font-bold text-gray-800">AI あしあと</span>
            {' '}を残す
          </h1>
        </div>

        {/* Form — the sole protagonist */}
        <div className="animate-fade-up-delay mx-auto max-w-2xl">
          <SimplePostForm />
        </div>

      </div>

      {/* Transition to post list */}
      <div className="h-10 bg-gradient-to-b from-transparent to-gray-50/60" />

    </section>
  );
}
