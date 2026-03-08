-- ============================================
-- Migration v6: Add slug column for programmatic SEO
-- myailogs (formerly ASHIATO.ai)
-- ============================================

-- 1. Add slug column (nullable initially for backfill)
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS slug TEXT;

-- 2. Backfill slugs for existing posts
DO $$
DECLARE
  rec RECORD;
  tool_slug TEXT;
  what_part TEXT;
  base_slug TEXT;
  final_slug TEXT;
  counter INT;
BEGIN
  FOR rec IN
    SELECT id, ai_tools, what, challenge_summary, result
    FROM public.posts
    WHERE slug IS NULL
    ORDER BY created_at ASC
  LOOP
    -- Map AI tool name to slug
    tool_slug := CASE rec.ai_tools[1]
      WHEN 'ChatGPT'    THEN 'chatgpt'
      WHEN 'Claude'     THEN 'claude'
      WHEN 'Gemini'     THEN 'gemini'
      WHEN 'Copilot'    THEN 'copilot'
      WHEN 'Perplexity' THEN 'perplexity'
      ELSE 'ai'
    END;

    -- Use 'what' field, fall back to challenge_summary for legacy posts
    what_part := left(COALESCE(NULLIF(trim(rec.what), ''), rec.challenge_summary, 'post'), 30);

    base_slug := tool_slug || '-' || what_part || '-' || rec.result;
    final_slug := base_slug;
    counter := 2;

    -- Ensure uniqueness
    WHILE EXISTS (SELECT 1 FROM public.posts WHERE slug = final_slug) LOOP
      final_slug := base_slug || '-' || counter;
      counter := counter + 1;
    END LOOP;

    UPDATE public.posts SET slug = final_slug WHERE id = rec.id;
  END LOOP;
END;
$$;

-- 3. Make slug NOT NULL and add unique constraint
ALTER TABLE public.posts ALTER COLUMN slug SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_posts_slug ON public.posts(slug);
