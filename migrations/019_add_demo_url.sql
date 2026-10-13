-- Optional public-profile demo URL. Shown on a project card only when set.
-- Does not update or delete existing rows. The new column stays NULL until edited in admin.
-- MySQL 8.4 has no ADD COLUMN IF NOT EXISTS, so the column check below is the guard.
--
-- docker exec -i kantrybes-db-1 sh -c 'mysql -uroot -p"$MYSQL_ROOT_PASSWORD" kantrybes' < migrations/019_add_demo_url.sql

SET @db := DATABASE();

SET @demo_url_exists := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'projects' AND COLUMN_NAME = 'demo_url'
);
SET @sql := IF(
  @demo_url_exists = 0,
  'ALTER TABLE projects ADD COLUMN demo_url VARCHAR(500) NULL AFTER live_type',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
