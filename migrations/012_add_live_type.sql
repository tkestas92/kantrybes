-- Railway MySQL -> Query tab

ALTER TABLE projects
  ADD COLUMN live_type ENUM('web', 'app') NULL AFTER live_url;

UPDATE projects
SET
  live_url = 'https://demo-djbook.kantrybes.lt',
  live_type = 'app'
WHERE title = 'DJBook';

UPDATE projects
SET
  live_url = 'https://demo-dishcovery.kantrybes.lt',
  live_type = 'app'
WHERE title = 'Dishcovery';

UPDATE projects
SET live_type = 'web'
WHERE live_url IS NOT NULL
  AND live_type IS NULL
  AND title NOT IN ('DJBook', 'Dishcovery');
