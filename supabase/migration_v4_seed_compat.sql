-- ============================================================
-- Migration v4: トリガーを修正してシードデータ投入に対応
-- ============================================================
-- 背景:
--   Admin APIで作成したユーザーは Supabase が内部的に
--   app_metadata.provider = 'email' を設定するため、
--   既存のトリガーが CHECK 制約 (google|twitter) に
--   引っかかって失敗する。
--   トリガーを修正し、未知の provider は 'google' に
--   フォールバックさせる。

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, display_name, avatar_url, provider)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      'ユーザー'
    ),
    NEW.raw_user_meta_data->>'avatar_url',
    CASE
      WHEN NEW.raw_app_meta_data->>'provider' IN ('google', 'twitter')
        THEN NEW.raw_app_meta_data->>'provider'
      ELSE 'google'
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
