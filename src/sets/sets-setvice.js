const xss = require('xss');

const SetsService = {
  getSetsByExerciseIds(db, exerciseIds) {
    return db
      .select('*')
      .from('sets')
      .whereIn('exercise_id', exerciseIds);
  }
};

module.exports = SetsService;