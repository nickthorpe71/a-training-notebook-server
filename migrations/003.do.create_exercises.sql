CREATE TABLE exercises (
  id SERIAL PRIMARY KEY ,
  title TEXT NOT NULL,
  workout_id INTEGER
    REFERENCES workouts(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ
);