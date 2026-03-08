// ============================================
// myailogs - Slug Generation Utility
// ============================================

import type { AITool, Result } from '@/types';

// AI tool name → URL slug mapping
const TOOL_SLUG_MAP: Record<string, string> = {
  ChatGPT: 'chatgpt',
  Claude: 'claude',
  Gemini: 'gemini',
  Copilot: 'copilot',
  Perplexity: 'perplexity',
  その他: 'ai',
};

export function toolToSlug(tool: AITool | string): string {
  return TOOL_SLUG_MAP[tool] || tool.toLowerCase().replace(/\s+/g, '-');
}

/**
 * Generate a base slug from post fields.
 * Format: {tool}-{what(max30chars)}-{result}
 * Example: chatgpt-エクセルのマクロ-partial
 */
export function generateBaseSlug(tool: string, what: string, result: string): string {
  const toolSlug = toolToSlug(tool);
  const whatSlug = what.trim().slice(0, 30);
  return `${toolSlug}-${whatSlug}-${result}`;
}

/**
 * Find a unique slug by appending a counter if the base slug is taken.
 * Queries Supabase client for existing slugs with the same prefix.
 */
export async function generateUniqueSlug(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  tool: AITool | string,
  what: string,
  result: Result
): Promise<string> {
  const base = generateBaseSlug(tool, what, result);

  const { data } = await supabase
    .from('posts')
    .select('slug')
    .like('slug', `${base}%`);

  const existingSlugs = new Set<string>(
    (data || []).map((p: { slug: string }) => p.slug)
  );

  if (!existingSlugs.has(base)) return base;

  let counter = 2;
  while (existingSlugs.has(`${base}-${counter}`)) {
    counter++;
  }
  return `${base}-${counter}`;
}

// Result label for SEO title
export const RESULT_LABEL_JA: Record<Result, string> = {
  solved: 'できた',
  partial: '惜しい',
  unsolved: 'お手上げ',
};

/**
 * Generate page title for a post.
 * Format: 【できた】ChatGPTでエクセルのマクロをやろうとした記録
 */
export function generatePostTitle(tool: string, what: string, result: Result): string {
  const resultLabel = RESULT_LABEL_JA[result] || result;
  return `【${resultLabel}】${tool}で${what}をやろうとした記録`;
}
