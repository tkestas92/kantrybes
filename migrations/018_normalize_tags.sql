-- Rewrites projects.tags only. Idempotent: a second run leaves the same JSON.
-- Unknown tags are dropped. Linux and DevOps become "Linux / DevOps" without duplicates.
-- Extra tags are added only for the three titles below, and only when missing.
--
-- docker exec -i kantrybes-db-1 sh -c 'mysql -uroot -p"$MYSQL_ROOT_PASSWORD" kantrybes' < migrations/018_normalize_tags.sql

START TRANSACTION;

DROP TEMPORARY TABLE IF EXISTS tmp_project_tags;
CREATE TEMPORARY TABLE tmp_project_tags (
  project_id INT NOT NULL,
  tag VARCHAR(64) NOT NULL,
  sort_order INT NOT NULL,
  PRIMARY KEY (project_id, tag)
);

INSERT IGNORE INTO tmp_project_tags (project_id, tag, sort_order)
SELECT p.id, mapped.tag, mapped.sort_order
FROM projects p
JOIN JSON_TABLE(
  IF(JSON_TYPE(p.tags) = 'ARRAY', p.tags, JSON_ARRAY()),
  '$[*]' COLUMNS (raw VARCHAR(64) PATH '$')
) jt
JOIN (
  SELECT 'py' AS raw, 'Python' AS tag, 1 AS sort_order
  UNION ALL SELECT 'python', 'Python', 1
  UNION ALL SELECT 'ml', 'ML / AI', 2
  UNION ALL SELECT 'ml / ai', 'ML / AI', 2
  UNION ALL SELECT 'typescript', 'TypeScript', 3
  UNION ALL SELECT 'next.js', 'Next.js', 4
  UNION ALL SELECT 'nextjs', 'Next.js', 4
  UNION ALL SELECT 'rn', 'React Native', 5
  UNION ALL SELECT 'react native', 'React Native', 5
  UNION ALL SELECT 'kt', 'Kotlin', 6
  UNION ALL SELECT 'kotlin', 'Kotlin', 6
  UNION ALL SELECT 'go', 'Go', 7
  UNION ALL SELECT 'mysql', 'MySQL', 8
  UNION ALL SELECT 'docker', 'Docker', 9
  UNION ALL SELECT 'linux', 'Linux / DevOps', 10
  UNION ALL SELECT 'devops', 'Linux / DevOps', 10
  UNION ALL SELECT 'linux / devops', 'Linux / DevOps', 10
) mapped ON mapped.raw = LOWER(TRIM(jt.raw));

INSERT IGNORE INTO tmp_project_tags (project_id, tag, sort_order)
SELECT id, 'TypeScript', 3 FROM projects WHERE TRIM(title) = 'kantrybes.lt Portfolio'
UNION ALL
SELECT id, 'Next.js', 4 FROM projects WHERE TRIM(title) = 'kantrybes.lt Portfolio'
UNION ALL
SELECT id, 'MySQL', 8 FROM projects WHERE TRIM(title) = 'kantrybes.lt Portfolio'
UNION ALL
SELECT id, 'Docker', 9 FROM projects WHERE TRIM(title) = 'kantrybes.lt Portfolio'
UNION ALL
SELECT id, 'Docker', 9 FROM projects WHERE TRIM(title) = 'Home Linux Server'
UNION ALL
SELECT id, 'Linux / DevOps', 10 FROM projects WHERE TRIM(title) = 'Home Linux Server'
UNION ALL
SELECT id, 'Kotlin', 6 FROM projects WHERE TRIM(title) = 'Android Demo'
UNION ALL
SELECT id, 'Docker', 9 FROM projects WHERE TRIM(title) = 'Android Demo'
UNION ALL
SELECT id, 'Linux / DevOps', 10 FROM projects WHERE TRIM(title) = 'Android Demo';

UPDATE projects p
SET p.tags = COALESCE(
  (
    SELECT JSON_ARRAYAGG(t.tag ORDER BY t.sort_order)
    FROM tmp_project_tags t
    WHERE t.project_id = p.id
  ),
  JSON_ARRAY()
);

DROP TEMPORARY TABLE IF EXISTS tmp_project_tags;

COMMIT;
