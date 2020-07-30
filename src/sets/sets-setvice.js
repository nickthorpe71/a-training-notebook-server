const xss = require('xss');

const SetsService = {
  getSetsByExerciseIds(db, exerciseIds) {
    return db
      .select('*')
      .from('sets')
      .whereIn('exercise_id', exerciseIds);
  },

  addSets(db, newSets) {
    return db
      .insert(newSets)
      .into('sets')
      .returning('*')
      .then(sets => sets);
  },
};

module.exports = SetsService;