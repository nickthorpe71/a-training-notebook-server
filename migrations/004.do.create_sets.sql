CREATE TABLE sets (
  id SERIAL PRIMARY KEY ,
  exercise_id INTEGER
    REFERENCES exercises(id) ON DEELTE CASCADE NOT NULL,
  set_number INTEGER NOT NULL,
  set_weight INTEGER,
  set_reps INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ
);