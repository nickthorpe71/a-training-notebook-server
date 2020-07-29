const express = require('express');
const WorkoutsService = require('./workouts-service');
const ExercisesService = require('../exercises/exercises-service');
const SetsService = require('../sets/sets-setvice');
const { requireAuth } = require('../middleware/jwt-auth');

const workoutsRouter = express.Router();

workoutsRouter
  .route('/:user_id/:workout_date')
  .all(requireAuth)
  .get((req, res, next) => {
    const { user_id, workout_date } = req.params;
    WorkoutsService.getworkoutsByUserAndDate(req.app.get('db'), user_id, workout_date)
      .then(workouts => {
        res
          .status(200)
          .json(workouts);
      })
      .catch(next);
  });

workoutsRouter
  .route('/:workout_id')
  .all(requireAuth)
  .get((req, res, next) => {
    const { workout_id } = req.params;

    let resWorkout = {};

    WorkoutsService.getWorkoutById(req.app.get('db'), workout_id)
      .then(workout => {
        resWorkout = workout[0];

        //get exercises with this workout_id
        return ExercisesService.getExerciseByWorkoutId(req.app.get('db'), workout_id)
          .then(exercises => {

            //for each exercise get an array of set objects
            const exerciseIds = exercises.map(exercise => exercise.id);
            return SetsService.getSetsByExerciseIds(req.app.get('db'), exerciseIds)
              .then(sets => {

                //add set objects as a sets array to their respecitve exercise
                const exercisesWithSets = exercises.map(exercise => {
                  return {
                    title: exercise.title,
                    sets: sets
                      .filter(set => set.exercise_id === exercise.id)
                      .map(set => {
                        return {
                          setNum: set.set_number,
                          weight: set.set_weight,
                          reps: set.set_reps
                        };
                      })
                  };
                });

                //add exercises as array work resWorkout
                resWorkout.exercises = exercisesWithSets;

                res
                  .status(200)
                  .json(resWorkout);
              });
          });
      })
      .catch(next);
  });

module.exports = workoutsRouter;