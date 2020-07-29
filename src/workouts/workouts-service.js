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
  }
};

module.exports = WorkoutsService;