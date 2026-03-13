import { HeaderWrapper, Footer } from '@/components/layout';
import { PostListSection } from '@/components/post/post-list-section';
import { HeroSection } from '@/components/post/hero-section';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <HeaderWrapper />
      <main className="flex-1">
        <HeroSection />

        {/* Section intro before post list */}
        <div className="bg-gray-50/60 px-6 pb-2 pt-10">
          <div className="mx-auto max-w-6xl">
            <p className="text-lg font-bold text-gray-800">みんなのあしあと</p>
            <p className="text-xs font-medium tracking-wide text-gray-400">
              What the community has been trying
            </p>
          </div>
        </div>

        <PostListSection />
      </main>
      <Footer />
    </div>
  );
}
