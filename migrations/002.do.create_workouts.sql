CREATE TABLE workouts (
  id SERIAL PRIMARY KEY ,
  workout_date DATE NOT NULL,
  title TEXT NOT NULL,
  notes TEXT,
  user_id INTEGER
    REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ
);