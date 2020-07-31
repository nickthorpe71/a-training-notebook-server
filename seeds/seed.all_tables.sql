BEGIN;

TRUNCATE
  users,
  workouts,
  exercises,
  sets
  RESTART IDENTITY CASCADE;

INSERT INTO users (username, email, password)
VALUES
  ('dunder', 'dundermifflin@gmail.com', '$2a$12$z0u7H3yrQTbfxhv55C0JleoQFXK5uvZ2wqKUqqV3NsOBcfZ9B5NOW'),
  ('b.deboop', 'dodeepdeboop@gmail.com', '$2a$12$U6TplukfN6js3rmm90DwFuKzayxbQ/wKckLCqkFZoiqloPW/1UwWa'),
  ('c.bloggs', 'charliebloggs@gmail.com', '$2a$12$Aa7x/0x3XDU5XiqF7byj3eiFDD63jy5mmLWbh5tINvF/zWMktVPBW'),
  ('s.smith', 'samsmith@gmail.com', '$2a$12$dahEoDZZ21FV4Z3xBjw5Xeki1fVfWZIFmvdipXlS5/o5pRa2kbdtO'),
  ('lexlor', 'alextaylor@gmail.com', '$2a$12$JSCRiCJexxcp/a.R9.432OBiKMSTfthP27APem/cW3iXIota0GapC'),
  ('wippy', 'pingwonIn@gmail.com', '$2a$12$mWXM5jGoOla3qf0O/D4UL..swbYT3S/pK9hVOtJsu8e7j72rhMGuK');

INSERT INTO workouts (workout_date, title, user_id, notes)
VALUES
  ('2020-07-13', 'Strength', 1, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. '),
  ('2020-07-23', 'Calisthenics', 1, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. '),
  ('2020-07-27', 'Run', 1, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. '),
  ('2020-07-28', 'Swim', 1, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. '),
  ('2020-07-29', 'Body Building', 1, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. '),
  ('2020-07-30', 'Martial Arts', 1, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. '),
  ('2020-07-22', 'Strength', 2, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. '),
  ('2020-07-27', 'Calisthenics', 2, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. '),
  ('2020-07-27', 'Run', 3, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. '),
  ('2020-07-27', 'Swim', 4, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. '),
  ('2020-07-27', 'Body Building', 5, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. '),
  ('2020-07-27', 'Martial Arts', 6, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ');

INSERT INTO exercises (title, workout_id)
VALUES
  ('dunder', 1), ('b.deboop', 1), ('c.bloggs', 1), ('s.smith', 1), ('lexlor', 1),
  ('wippy', 1), ('bench', 2), ('squat', 2), ('curl', 2), ('tri extension', 2),
  ('cable rows', 2), ('deadlift', 2), ('bench', 3), ('squat', 3),('curl', 3),
  ('tri extension', 3),('cable rows', 3),('deadlift', 3),('bench', 4),('squat', 4),
  ('curl', 4),('tri extension', 5),('cable rows', 5),('deadlift', 5),('bench', 6),
  ('squat', 6),('curl', 6),('tri extension', 7),('cable rows', 7),('deadlift', 7),
  ('bench', 8),('squat', 9),('curl', 10),('tri extension', 11),('cable rows', 11),
  ('deadlift', 12);

INSERT INTO sets (exercise_id, set_weight, set_reps, set_number)
VALUES
  (1, '135', 4, 1), (1, '12', 6, 2),(1, '15', 10, 3),(1, '240', 3, 4),(1, 'Body', 8, 5),
  (2, '235', 4, 2), (2, '22', 6, 2),(2, '25', 20, 3),(2, '240', 3, 4),(2, 'Body', 8, 5),
  (3, '335', 4, 3), (3, '32', 6, 2),(3, '35', 30, 3),(3, '240', 3, 4),(3, 'Body', 8, 5),
  (4, '435', 4, 4), (4, '42', 6, 2),(4, '45', 40, 3),(4, '240', 3, 4),(4, 'Body', 8, 5),
  (5, '535', 4, 5), (5, '52', 6, 2),(5, '55', 50, 3),(5, '240', 3, 4),(5, 'Body', 8, 5),
  (6, '635', 4, 6), (6, '62', 6, 2),(6, '65', 60, 3),(6, '240', 3, 4),(6, 'Body', 8, 5),
  (7, '735', 4, 7), (7, '72', 6, 2),(7, '75', 70, 3),(7, '240', 3, 4),(7, 'Body', 8, 5),
  (8, '835', 4, 8), (8, '82', 6, 2),(8, '85', 80, 3),(8, '240', 3, 4),(8, 'Body', 8, 5),
  (9, '935', 4, 9), (9, '92', 6, 2),(9, '95', 90, 3),(9, '240', 3, 4),(9, 'Body', 8, 5),
  (10, '1035', 4, 10), (10, '102', 6, 2),(10, '105', 100, 3),(10, '240', 3, 4),(10, 'Body', 8, 5),
  (11, '1135', 4, 11), (11, '112', 6, 2),(11, '115', 110, 3),(11, '240', 3, 4),(11, 'Body', 8, 5),
  (12, '1235', 4, 12), (12, '122', 6, 2),(12, '125', 120, 3),(12, '240', 3, 4),(12, 'Body', 8, 5),
  (13, '1335', 4, 13), (13, '132', 6, 2),(13, '135', 130, 3),(13, '240', 3, 4),(13, 'Body', 8, 5),
  (14, '1435', 4, 14), (14, '142', 6, 2),(14, '145', 140, 3),(14, '240', 3, 4),(14, 'Body', 8, 5),
  (15, '135', 4, 15), (15, '12', 6, 2),(15, '15', 10, 3),(15, '240', 3, 4),(15, 'Body', 8, 5),
  (16, '135', 4, 1), (16, '12', 6, 2),(17, '15', 10, 3),(17, '240', 3, 4),(18, 'Body', 8, 6),
  (20, '135', 4, 1), (20, '12', 6, 2),(19, '15', 10, 3),(19, '240', 3, 4),(18, 'Body', 8, 5),
  (21, '135', 4, 1), (22, '12', 6, 2),(22, '15', 10, 3),(23, '240', 3, 4),(24, 'Body', 8, 5),
  (25, '135', 4, 1), (25, '12', 6, 2),(26, '15', 10, 3),(26, '240', 3, 4),(27, 'Body', 8, 5),
  (27, '135', 4, 1), (28, '12', 6, 2),(28, '15', 10, 3),(29, '240', 3, 4),(30, 'Body', 8, 5),
  (30, '135', 4, 1), (30, '12', 6, 2),(31, '15', 10, 3),(31, '240', 3, 4),(31, 'Body', 8, 5),
  (31, '135', 4, 1), (32, '12', 6, 2),(32, '15', 10, 3),(33, '240', 3, 4),(34, 'Body', 8, 5),
  (34, '135', 4, 1), (34, '12', 6, 2),(35, '15', 10, 3),(35, '240', 3, 4),(35, 'Body', 8, 5);
  

COMMIT;
