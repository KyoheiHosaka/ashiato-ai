import { HeaderWrapper, Footer } from '@/components/layout';
import { PostListSection } from '@/components/post/post-list-section';
import { HeroSection } from '@/components/post/hero-section';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <HeaderWrapper />
      <main className="flex-1">
        <HeroSection />
        <PostListSection />
      </main>
      <Footer />
    </div>
  );
}
