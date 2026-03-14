-- Migration v7: Allow anonymous (no-login) post creation
-- user_id becomes nullable so unauthenticated users can post

-- 1. Make user_id nullable on posts
ALTER TABLE public.posts ALTER COLUMN user_id DROP NOT NULL;

-- 2. Update INSERT policy: allow when user_id is null (anonymous) or matches auth.uid()
DROP POLICY IF EXISTS "Users can create posts" ON public.posts;
CREATE POLICY "Anyone can create posts"
  ON public.posts FOR INSERT
  WITH CHECK (user_id IS NULL OR auth.uid() = user_id);
