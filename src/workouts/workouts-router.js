const express = require('express');
const path = require('path');
const WorkoutsService = require('./workouts-service');
const ExercisesService = require('../exercises/exercises-service');
const SetsService = require('../sets/sets-setvice');
const { requireAuth } = require('../middleware/jwt-auth');
const bodyParser = express.json();

const workoutsRouter = express.Router();

workoutsRouter
  .route('/')
  .all(requireAuth)
  .post(bodyParser, (req, res, next) => {
    const {
      user_id,
      title,
      numExercises,
      numSetsPer,
      time,
      date,
      notes,
      exercises
    } = req.body;

    //need to add time column to table
    const newWorkout = {
      date,
      title,
      notes,
    };

    for (const [key, value] of Object.entries(newWorkout))
      if (!value)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        });

    newWorkout.user_id = user_id;

    WorkoutsService.addWorkout(req.app.get('db'), newWorkout)
      .then(workout => {
        let resWorkout = workout;


        const newExercises = exercises.map(exercise => {
          return {
            title: exercise.title,
            workout_id: workout.id
          };
        });

        newExercises.forEach(exercise => {
          for (const [key, value] of Object.entries(newWorkout))
            if (!value)
              return res.status(400).json({
                error: `Missing '${key}' in request body`
              });
        });

        return ExercisesService.addExercises(req.app.get('db'), newExercises)
          .then(resExercises => {
            resWorkout.exercises = resExercises;

            const newSets = [];

            exercises.forEach(exercise => {
              exercise.sets.forEach(set => newSets.push(set));
            });

            return SetsService.addSets(req.app.get('db'), newSets)
              .then(resSets => {
                resWorkout.exercises[0].sets = resSets;

                res
                  .status(201)
                  .location(path.posix.join(req.originalUrl, `/${workout.id}`))
                  .json(resWorkout); //need to add serialization

              })
              .catch(next);
          });
      });
  });

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