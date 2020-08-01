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

  // bulkUpdateExercises(db, exercises) {
  //   return db.transaction(trx => {
  //     const queries = exercises.map(tuple =>
  //       db('exercises')
  //         .where('id', tuple.id)
  //         .update(tuple)
  //         .transacting(trx)
  //     );
  //     return Promise.all(queries)
  //       .then(trx.commit)
  //       .catch(trx.rollback);
  //   });
  // },

  insertOrUpdateExercises(db, exerciseRows) {
    return db.transaction((trx) => {

      const queries = exerciseRows.map((tuple) => {

        const insert = trx('exercises').insert(tuple).toString();
        const update = trx('exercises').update(tuple).toString().replace(/^update(.*?)set\s/gi, '');

        return trx.raw(`${insert} ON DUPLICATE KEY UPDATE ${update}`).transacting(trx);
      });

      return Promise.all(queries).then(trx.commit).catch(trx.rollback);
    });
  }
};

module.exports = ExercisesService;