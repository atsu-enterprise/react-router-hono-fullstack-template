DROP TABLE IF EXISTS locations;
CREATE TABLE locations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  summary TEXT,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL
);

INSERT INTO locations (title, summary, latitude, longitude) VALUES
  ('五稜郭タワー', '函館の景色を一望できるタワーです。', 41.7968, 140.756),
  ('函館朝市', '新鮮な海産物が楽しめる市場です。', 41.770, 140.725),
  ('金森赤レンガ倉庫', 'ショッピングや食事が楽しめる観光スポットです。', 41.765, 140.719);
