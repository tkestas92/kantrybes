-- Railway MySQL -> Query tab

INSERT INTO projects (title, description, emoji, tags, github_url, live_url, live_type, status, sort_order) VALUES
(
  'Android Demo',
  'Live Android aplikacijų demo platforma naršyklėje — redroid (Android-in-Docker), ws-scrcpy ir Caddy. Leidžia interaktyviai bandyti mobilias aplikacijas be diegimo.',
  '📱',
  '["kt"]',
  'https://github.com/tkestas92/android-demo',
  NULL,
  NULL,
  'shipped',
  6
),
(
  'kantrybes.lt Portfolio',
  'Dev & DJ portfolio svetainė su admin paneliu, MySQL projektų valdymu ir live demo modalu. Next.js 14 ant Railway.',
  '💻',
  '[]',
  'https://github.com/tkestas92/kantrybes',
  'https://www.kantrybes.lt/dev',
  'web',
  'shipped',
  7
);
