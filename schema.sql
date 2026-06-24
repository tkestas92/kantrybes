-- Paleisk šitą per Railway MySQL -> Query tab, arba per mysql CLI

CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  emoji VARCHAR(10) DEFAULT '🚀',
  tags JSON,
  github_url VARCHAR(500),
  live_url VARCHAR(500),
  live_type ENUM('web', 'app') NULL,
  status ENUM('shipped', 'in_progress', 'archived') DEFAULT 'shipped',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Sample duomenys
INSERT INTO projects (title, description, emoji, tags, github_url, status, sort_order) VALUES
('DJBook', 'Aplikacija DJ\'ams ir event organizatoriams — booking valdymas, finansai, kontaktai. iOS + Android.', '🎧', '["go", "rn"]', 'https://github.com/tkestas92/djbook-backend', 'in_progress', 1),
('Steam žaidimų rekomenduotojas', 'AI sistema kuri rekomenduoja žaidimus pagal žaidėjo istoriją. Treniruota su 500k+ žaidimų įrašų.', '🎮', '["py", "ml"]', 'https://github.com', 'shipped', 2),
('Dishcovery', 'Android aplikacija kuri leidžia naršyti tradicinius patiekalus pagal šalį su AI aprašymais.', '🍽️', '["kt", "ml"]', 'https://github.com', 'shipped', 3),
('VitaTrack', 'Asmeninių maisto papildų sekimo aplikacija su priminimais, statistika ir home screen widget.', '💊', '["kt"]', 'https://github.com', 'shipped', 4),
('TripSplit Pro', 'Kelionių išlaidų dalinimo aplikacija grupėms. Go REST API + Android klientas.', '✈️', '["go", "kt"]', 'https://github.com', 'shipped', 5),
('Spaceship Titanic', 'Kaggle ML competition — neural network keleivių išgyvenimo prognozei. Top 20% rezultatas.', '🚀', '["py", "ml"]', 'https://github.com', 'shipped', 6),
('Android Demo', 'Live Android aplikacijų demo platforma naršyklėje — redroid (Android-in-Docker), ws-scrcpy ir Caddy. Leidžia interaktyviai bandyti mobilias aplikacijas be diegimo.', '📱', '["kt"]', 'https://github.com/tkestas92/android-demo', 'shipped', 7),
('kantrybes.lt Portfolio', 'Dev & DJ portfolio svetainė su admin paneliu, MySQL projektų valdymu ir live demo modalu. Next.js 14 ant Railway.', '💻', '[]', 'https://github.com/tkestas92/kantrybes', 'shipped', 8);
