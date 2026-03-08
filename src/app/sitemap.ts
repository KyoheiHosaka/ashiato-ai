import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';
import { SITE_CONFIG, TASK_CATEGORIES } from '@/constants';

const TOOL_SLUGS = ['chatgpt', 'claude', 'gemini', 'copilot', 'perplexity', 'ai'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || SITE_CONFIG.url;
  const supabase = await createClient();

  // Fetch all published post slugs
  const { data: posts } = await supabase
    .from('posts')
    .select('slug, created_at')
    .not('slug', 'is', null)
    .order('created_at', { ascending: false });

  const postUrls: MetadataRoute.Sitemap = (posts || []).map((post) => ({
    url: `${siteUrl}/logs/${encodeURIComponent(post.slug)}`,
    lastModified: new Date(post.created_at),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const toolUrls: MetadataRoute.Sitemap = TOOL_SLUGS.map((tool) => ({
    url: `${siteUrl}/tools/${tool}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  const categoryUrls: MetadataRoute.Sitemap = TASK_CATEGORIES.map((cat) => ({
    url: `${siteUrl}/category/${encodeURIComponent(cat.value)}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...toolUrls,
    ...categoryUrls,
    ...postUrls,
  ];
}
