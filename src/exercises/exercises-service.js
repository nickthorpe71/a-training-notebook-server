const xss = require('xss');

const ExercisesService = {
  getExerciseByWorkoutId(db, workout_id) {
    return db
      .select('*')
      .from('exercises')
      .where('workout_id', workout_id);
  },

  addExercises(db, newExercises) {
    return db
      .insert(newExercises)
      .into('exercises')
      .returning('*')
      .then(exercises => exercises);
  },

};

module.exports = ExercisesService;