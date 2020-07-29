const xss = require('xss');

const ExercisesService = {
  getExerciseByWorkoutId(db, workout_id) {
    return db
      .select('*')
      .from('exercises')
      .where('workout_id', workout_id);
  }
};

module.exports = ExercisesService;