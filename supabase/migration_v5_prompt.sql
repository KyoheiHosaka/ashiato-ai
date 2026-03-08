-- ============================================
-- Migration v5: promptカラムを追加
-- ============================================

ALTER TABLE public.posts
ADD COLUMN IF NOT EXISTS prompt TEXT CHECK (prompt IS NULL OR char_length(prompt) <= 1000);
