-- ============================================================
-- ロールバック用SQL（2026-11-02 JST）
-- 対象マイグレーション: relax_learning_mode_and_fruits_checks
--
-- 元に戻すと、教科練習（math/kokugo/shakai/doutoku/rika/genso）の
-- 記録が再び弾かれる状態に戻る。既存データは壊れない。
--
-- ⚠️ 実行前に必ず確認：
--   fruits > 3 の行、または mode が下記3種以外の行があると
--   NOT VALID なしの ADD CONSTRAINT は失敗する。
--   そのため NOT VALID を付け、既存行は検査せず新規書き込みだけを制限する。
-- ============================================================

begin;

alter table public.learning_sessions
  drop constraint if exists learning_sessions_mode_check;
alter table public.learning_sessions
  add constraint learning_sessions_mode_check
  check (mode = any (array['mission'::text, 'okurigana'::text, 'clock'::text])) not valid;

alter table public.user_progress
  drop constraint if exists user_progress_fruits_check;
alter table public.user_progress
  add constraint user_progress_fruits_check
  check ((fruits >= 0) and (fruits <= 3)) not valid;

commit;
