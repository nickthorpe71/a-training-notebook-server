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
      time,
      date,
      notes,
      exercises
    } = req.body;

    //need to add time column to table
    const newWorkout = {
      workout_date: date,
      title,
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

        return ExercisesService.addExercises(req.app.get('db'), newExercises)
          .then(resExercises => {
            resWorkout.exercises = resExercises;

            const newSets = [];

            // exercise_id, set_weight, set_reps, set_number
            exercises.forEach((exercise, exerciseIndex) => {
              exercise.sets.forEach(set => {
                const newSet = {
                  exercise_id: resExercises[exerciseIndex].id,
                  set_weight: set.weight,
                  set_reps: set.reps,
                  set_number: set.setNum
                };

                newSets.push(newSet);
              });
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
  })
  .patch(bodyParser, (req, res, next) => {
    const { user_id, title, notes, time, date, exercises } = req.body;
    const workoutToUpdate = { title, notes, time, date, exercises };

    const numberOfValues = Object.values(workoutToUpdate).filter(Boolean).length;
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: 'Request body must contain title, notes, time, date or exercises'
        }
      });
    }

    const workoutToSend = {
      workout_date: date,
      title: title,
      notes: notes
    };

    WorkoutsService.updateWorkout(
      req.app.get('db'),
      req.query.workout_id,
      workoutToSend
    )
      .then(numRowsAffected => {
        if (exercises.length > 0) {
          //for each of these run an insert/update function (available in every version fo SQL)
          //only need one array for exercises and one for sets

          const newExercises = [];
          const newSets = [];

          exercises.forEach(exercise => {
            if (exercise.id === -1) {
              newExercises.push({
                id: exercise.id,
                title: exercise.title,
                workout_id: req.query.workout_id
              });

              exercise.sets.forEach(set => {
                newSets.push({
                  id: set.id,
                  exercise_id: exercise.id,
                  set_weight: set.weight,
                  set_reps: set.reps,
                  set_number: set.setNum
                });
              });
            }
          });

          return ExercisesService.insertOrUpdateExercises(req.app.get('db'), newExercises)
            .then(() => {
              SetsService.insertOrUpdateSets(req.app.get('db'), newSets)
                .then(() => {
                  res.status(204).end();
                });
            });


          // return ExercisesService.bulkUpdateExercises(req.app.get('db'), newExercises)
          //   .then(resExercises => {

          //     const newSets = [];

          //     exercises.forEach((exercise, exerciseIndex) => {
          //       exercise.sets.forEach(set => {
          //         const newSet = {
          //           id: set.exercise_id,
          //           exercise_id: resExercises[exerciseIndex].id,
          //           set_weight: set.weight,
          //           set_reps: set.reps,
          //           set_number: set.setNum
          //         };

          //         newSets.push(newSet);
          //       });
          //     });

          //     return SetsService.bulkUpdateSets(req.app.get('db'), newSets)
          //       .then(resSets => {
          //         res.status(204).end();
          //       });
          //   });
        } else {
          res.status(204).end();
        }
      })
      .catch(next);

  });

workoutsRouter
  .route('/:user_id')
  .all(requireAuth)
  .get((req, res, next) => {
    //use req.query to look for a month or a workout_date or a workout_id
    const { user_id } = req.params;

    //if workout_date
    if ('workout_date' in req.query) {
      const workout_date = req.query.workout_date;
      WorkoutsService.getworkoutsByUserAndDate(req.app.get('db'), user_id, workout_date)
        .then(workouts => {
          res
            .status(200)
            .json(workouts);
        })
        .catch(next);
    }

    //if month
    if ('month' in req.query) {
      const month = req.query.month;
      WorkoutsService.getWorkoutsByMonth(req.app.get('db'), month, user_id)
        .then(workouts => {
          res
            .status(200)
            .json(workouts);
        });
    }

    //if workout_id
    if ('workout_id' in req.query) {
      const workout_id = req.query.workout_id;

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
                      id: exercise.id,
                      title: exercise.title,
                      sets: sets
                        .filter(set => set.exercise_id === exercise.id)
                        .map(set => {
                          return {
                            id: set.id,
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
    }
  })
  .delete(bodyParser, (req, res, next) => {
    const { user_id, workout_id } = req.body;

    WorkoutsService.deleteWorkout(
      req.app.get('db'),
      user_id,
      workout_id
    )
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = workoutsRouter;