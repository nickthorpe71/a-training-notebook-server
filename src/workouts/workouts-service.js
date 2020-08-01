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

  getWorkoutsByMonth(db, month, user_id) {
    return db
      .select('*')
      .from('workouts')
      .andWhereRaw(`EXTRACT(MONTH FROM workout_date::date) = ?`, [month])
      .where('user_id', user_id);
  },

  addWorkout(db, newWorkout) {
    return db
      .insert(newWorkout)
      .into('workouts')
      .returning('*')
      .then(([workout]) => workout);
  },

  deleteWorkout(db, user_id, workout_id) {
    return db
      .from('workouts')
      .where({
        user_id: user_id,
        id: workout_id
      })
      .delete();
  },

  updateWorkout(db, id, newFields) {
    return db('workouts')
      .where({ id })
      .update(newFields);
  },

  serializeWorkout(workout) {
    return {
      id: workout.id,

    };
  }
};

module.exports = WorkoutsService;