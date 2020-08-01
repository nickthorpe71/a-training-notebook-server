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

  // bulkUpdateSets(db, sets) {
  //   return db.transaction(trx => {
  //     const queries = sets.map(tuple =>
  //       db('sets')
  //         .where('id', tuple.id)
  //         .update(tuple)
  //         .transacting(trx)
  //     );
  //     return Promise.all(queries)
  //       .then(trx.commit)
  //       .catch(trx.rollback);
  //   });
  // }, 

  insertOrUpdateSets(db, setRows) {
    return db.transaction((trx) => {

      const queries = setRows.map((tuple) => {

        const insert = trx('sets').insert(tuple).toString();
        const update = trx('sets').update(tuple).toString().replace(/^update(.*?)set\s/gi, '');

        return trx.raw(`${insert} ON DUPLICATE KEY UPDATE ${update}`).transacting(trx);
      });

      return Promise.all(queries).then(trx.commit).catch(trx.rollback);
    });
  }

};

module.exports = SetsService;