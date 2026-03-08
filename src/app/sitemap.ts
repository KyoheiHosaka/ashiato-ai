import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';
import { SITE_CONFIG } from '@/constants';
import { toolToSlug } from '@/lib/utils/slug';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || SITE_CONFIG.url;
  const supabase = await createClient();

  // 投稿・ツール・カテゴリを一括取得
  const { data: posts } = await supabase
    .from('posts')
    .select('slug, ai_tools, task_category, created_at, updated_at')
    .not('slug', 'is', null)
    .order('created_at', { ascending: false });

  // 個別ログページ
  const postUrls: MetadataRoute.Sitemap = (posts || []).map((post) => ({
    url: `${siteUrl}/logs/${post.slug}`,
    lastModified: new Date(post.updated_at ?? post.created_at),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  // DBからユニークなツールスラッグを抽出
  const toolSlugs = new Set<string>();
  for (const post of posts || []) {
    for (const tool of post.ai_tools || []) {
      toolSlugs.add(toolToSlug(tool));
    }
  }
  const toolUrls: MetadataRoute.Sitemap = [...toolSlugs].map((slug) => ({
    url: `${siteUrl}/tools/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  // DBからユニークなカテゴリを抽出
  const categories = new Set<string>();
  for (const post of posts || []) {
    if (post.task_category) categories.add(post.task_category);
  }
  const categoryUrls: MetadataRoute.Sitemap = [...categories].map((cat) => ({
    url: `${siteUrl}/category/${encodeURIComponent(cat)}`,
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
