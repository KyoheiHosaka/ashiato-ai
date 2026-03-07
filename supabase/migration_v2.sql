-- ============================================
-- ASHIATO.ai - Migration v2: Simplified Post Schema
-- ============================================

-- Add new columns to posts table
ALTER TABLE public.posts
ADD COLUMN IF NOT EXISTS task_category TEXT CHECK (task_category IN ('自動化', '分析', 'ライティング', 'リサーチ', 'コーディング', 'デザイン', 'その他')),
ADD COLUMN IF NOT EXISTS what TEXT CHECK (what IS NULL OR char_length(what) <= 50),
ADD COLUMN IF NOT EXISTS goal TEXT CHECK (goal IS NULL OR char_length(goal) <= 100);

-- Make old required columns optional
ALTER TABLE public.posts
ALTER COLUMN industry DROP NOT NULL,
ALTER COLUMN role DROP NOT NULL,
ALTER COLUMN challenge_category DROP NOT NULL,
ALTER COLUMN challenge_summary DROP NOT NULL,
ALTER COLUMN methods DROP NOT NULL;

-- Create index for new task_category
CREATE INDEX IF NOT EXISTS idx_posts_task_category ON public.posts(task_category);
