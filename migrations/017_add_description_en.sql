-- Optional English title and description.
-- Does not update or delete existing rows. New columns stay NULL until edited in admin.
-- MySQL 8.4 has no ADD COLUMN IF NOT EXISTS, so the column check below is the guard.

SET @db := DATABASE();

SET @title_en_exists := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'projects' AND COLUMN_NAME = 'title_en'
);
SET @sql := IF(
  @title_en_exists = 0,
  'ALTER TABLE projects ADD COLUMN title_en VARCHAR(255) NULL AFTER title',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @description_en_exists := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'projects' AND COLUMN_NAME = 'description_en'
);
SET @sql := IF(
  @description_en_exists = 0,
  'ALTER TABLE projects ADD COLUMN description_en TEXT NULL AFTER description',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
