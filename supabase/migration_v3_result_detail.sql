-- ============================================
-- Migration: Update result_detail max length to 400
-- ============================================

-- Drop existing constraint if exists
ALTER TABLE public.posts
DROP CONSTRAINT IF EXISTS posts_result_detail_check;

-- Add new constraint with 400 character limit
ALTER TABLE public.posts
ADD CONSTRAINT posts_result_detail_check
CHECK (result_detail IS NULL OR char_length(result_detail) <= 400);
