import { HeaderWrapper, Footer } from '@/components/layout';
import { PostListSection } from '@/components/post/post-list-section';
import { HeroSection } from '@/components/post/hero-section';
import { MarqueeTrack } from '@/components/post/marquee-strip';
import { createClient } from '@/lib/supabase/server';

async function getMarqueePosts() {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('posts')
      .select('id, slug, what, challenge_summary, task_category, ai_tools, result')
      .order('created_at', { ascending: false })
      .limit(16);
    return data ?? [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const marqueePosts = await getMarqueePosts();

  return (
    <div className="flex min-h-screen flex-col">
      <HeaderWrapper />
      <main className="flex-1">
        <HeroSection />

        {/* Marquee — flowing cards as visual separator */}
        {marqueePosts.length >= 3 && (
          <div className="bg-gray-50/60 pb-2 pt-1">
            <MarqueeTrack posts={marqueePosts} />
          </div>
        )}

        {/* Section intro before post list */}
        <div className="bg-gray-50/60 px-6 pb-2 pt-6">
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
