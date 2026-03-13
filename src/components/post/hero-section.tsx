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

        {/* Headline */}
        <div className="animate-fade-up mb-10 text-center">
          <h1 className="text-3xl font-bold leading-snug tracking-tight text-gray-900 md:text-4xl">
            試した。どうだった？残そう。
          </h1>
          <p className="mt-3 text-base text-gray-400 md:text-lg">
            うまくいっても、いかなくても。
          </p>
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
