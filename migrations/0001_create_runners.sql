CREATE TABLE runners (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  bib_number INTEGER NOT NULL
);

INSERT INTO runners (name, bib_number) VALUES
  ('Alice', 101),
  ('Bob', 102),
  ('Charlie', 103);
