-- Railway MySQL -> Query tab

ALTER TABLE projects
  ADD COLUMN platform ENUM('app', 'web') NULL AFTER image_url;
