CREATE TABLE workouts (
  id SERIAL PRIMARY KEY ,
  title TEXT NOT NULL,
  workout_id INTEGER
    REFERENCES workouts(id) ON DEELTE CASCADE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ
);