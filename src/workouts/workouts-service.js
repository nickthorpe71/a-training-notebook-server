const xss = require('xss');

const WorkoutsService = {
  getworkoutsByUserAndDate(db, user_id, workout_date) {
    return db
      .select('*')
      .from('workouts')
      .where({
        user_id: user_id,
        workout_date: workout_date
      });
  },

  getWorkoutById(db, workout_id) {
    return db
      .select('*')
      .from('workouts')
      .where('id', workout_id);
  },

  addWorkout(db, newWorkout) {
    return db
      .insert(newWorkout)
      .into('workout')
      .returning('*')
      .then(([workout]) => workout);
  },

  deleteWorkout(db, workout_id) {
    return db
      .from('workouts')
      .where('id', workout_id)
      .delete();
  },

  serializeWorkout(workout) {
    return {
      id: workout.id,

    };
  }
};

module.exports = WorkoutsService;