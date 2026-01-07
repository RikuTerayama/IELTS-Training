-- Task1 アセット対応: tasksテーブルに asset_id と image_path を追加
-- 既存レコードとの互換性のため nullable で追加

ALTER TABLE tasks
ADD COLUMN IF NOT EXISTS asset_id TEXT,
ADD COLUMN IF NOT EXISTS image_path TEXT;

-- インデックス追加（オプション: 検索が速くなる）
CREATE INDEX IF NOT EXISTS idx_tasks_asset_id ON tasks(asset_id);
CREATE INDEX IF NOT EXISTS idx_tasks_image_path ON tasks(image_path);

-- 既存レコードは変更なし（nullable のため）
-- 新規生成される Task 1 のみ asset_id と image_path が設定される

