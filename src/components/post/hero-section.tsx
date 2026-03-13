import { SimplePostForm } from '@/components/post/simple-post-form';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">

      {/* Stage light */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 90% 60% at 50% 38%, #ffffff 30%, #f0f9f5 75%, #e8f5ee 100%)',
        }}
      />

      <div className="relative mx-auto max-w-4xl px-6 pb-20 pt-16 md:pb-28 md:pt-24">

        {/* Headline — bilingual, polite */}
        <div className="animate-fade-up mb-10 text-center">
          <h1 className="text-3xl font-bold leading-snug tracking-tight text-gray-900 md:text-4xl">
            AIで試したこと、残してみませんか。
          </h1>
          <p className="mt-1.5 text-sm font-medium tracking-wide text-gray-400 md:text-base">
            Wrestled with AI? Log it here.
          </p>
          <p className="mt-4 text-base text-gray-400 md:text-lg">
            うまくいっても、いかなくても。
          </p>
          <p className="mt-1 text-xs text-gray-300 md:text-sm">
            Whether it worked or not.
          </p>
        </div>

        {/* Form */}
        <div className="animate-fade-up-delay mx-auto max-w-2xl">
          <SimplePostForm />
        </div>

      </div>

      {/* Transition to post list */}
      <div className="h-10 bg-gradient-to-b from-transparent to-gray-50/60" />

    </section>
  );
}
