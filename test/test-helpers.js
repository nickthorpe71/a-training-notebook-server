const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function makeUsersArray() {
  return [
    {
      id: 1,
      username: 'test-user-1',
      email: 'test@gmail.com',
      password: 'password',
      created_at: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 2,
      username: 'test-user-2',
      email: 'test@gmail.com',
      password: 'password',
      created_at: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 3,
      username: 'test-user-3',
      email: 'test@gmail.com',
      password: 'password',
      created_at: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 4,
      username: 'test-user-4',
      email: 'test@gmail.com',
      password: 'password',
      created_at: '2029-01-22T16:28:32.615Z',
    },
  ];
}

function makeWorkoutsArray(users) {
  return [
    {
      id: 1,
      workout_date: '2020-07-27',
      title: 'Calisthenics',
      notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ',
      user_id: users[0].id,
      created_at: '2020-07-27T16:28:32.615Z',
      updated_at: '2020-07-28T16:28:32.615Z',
    },
    {
      id: 2,
      workout_date: '2020-07-26',
      title: 'Strength',
      notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ',
      user_id: users[0].id,
      created_at: '2020-07-26T16:28:32.615Z',
      updated_at: '2020-07-28T16:28:32.615Z',
    },
    {
      id: 3,
      workout_date: '2020-07-26',
      title: 'Run',
      notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ',
      user_id: users[0].id,
      created_at: '2020-07-26T16:28:32.615Z',
      updated_at: '2020-07-28T16:28:32.615Z',
    },
  ];
}

function makeExercisesArray(workouts) {
  return [
    {
      id: 1,
      title: 'Deadlift',
      workout_id: workouts[0].id,
      created_at: '2020-07-26T16:28:32.615Z',
      updated_at: '2020-07-28T16:28:32.615Z',
    },
    {
      id: 2,
      title: 'curls',
      workout_id: workouts[0].id,
      created_at: '2020-07-26T16:28:32.615Z',
      updated_at: '2020-07-28T16:28:32.615Z',
    },
    {
      id: 3,
      title: 'bench',
      workout_id: workouts[0].id,
      created_at: '2020-07-26T16:28:32.615Z',
      updated_at: '2020-07-28T16:28:32.615Z',
    },
  ];
}

function makeSetsArray(exercises) {
  return [
    {
      id: 1,
      exercise_id: exercises[0].id,
      set_number: 1,
      set_weight: '100lb',
      set_reps: 8,
      created_at: '2020-07-26T16:28:32.615Z',
      updated_at: '2020-07-28T16:28:32.615Z',
    },
    {
      id: 2,
      exercise_id: exercises[0].id,
      set_number: 2,
      set_weight: '130lb',
      set_reps: 6,
      created_at: '2020-07-26T16:28:32.615Z',
      updated_at: '2020-07-28T16:28:32.615Z',
    },
    {
      id: 3,
      exercise_id: exercises[0].id,
      set_number: 3,
      set_weight: '230lb',
      set_reps: 3,
      created_at: '2020-07-26T16:28:32.615Z',
      updated_at: '2020-07-28T16:28:32.615Z',
    },
  ];
}

function makeFixtures() {
  const testUsers = makeUsersArray();
  const testWorkouts = makeWorkoutsArray(testUsers);
  const testExercises = makeExercisesArray(testWorkouts);
  const testSets = makeSetsArray(testExercises);

  return { testUsers, testWorkouts, testExercises, testSets };
}

function cleanTables(db) {
  return db.raw(
    `TRUNCATE
      users,
      workouts,
      exercises,
      sets
      RESTART IDENTITY CASCADE`
  );
}

function seedUsersTable(db, users) {
  const preppedUsers = users.map((user) => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1),
  }));
  return db
    .into('users')
    .insert(preppedUsers)
    .then(() =>
      db.raw('SELECT setval(\'users_id_seq\', ?)', [
        users[users.length - 1].id,
      ])
    );
}

function seedOtherTables(db, workouts, exercises, sets, users) {
  return db.transaction(async (trx) => {
    await seedUsersTable(trx, users);
    await trx.into('workouts').insert(workouts);
    await trx.raw('SELECT setval(\'workouts_id_seq\', ?)', [
      workouts[workouts.length - 1].id,
    ]);
    await trx.into('exercises').insert(exercises);
    await trx.raw('SELECT setval(\'exercises_id_seq\', ?)', [
      exercises[exercises.length - 1].id,
    ]);
    await trx.into('sets').insert(sets);
    await trx.raw('SELECT setval(\'sets_id_seq\', ?)', [
      sets[sets.length - 1].id,
    ]);
  });
}

function seedMaliciousSpiirt(db, users, workouts) {
  return seedUsersTable(db, users).then(() =>
    db.into('spirits').insert(workouts)
  );
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.username,
    algorithm: 'HS256',
  });
  return `Bearer ${token}`;
}


module.exports = {
  makeUsersArray,
  makeWorkoutsArray,
  makeExercisesArray,
  makeSetsArray,

  makeFixtures,
  cleanTables,
  seedUsersTable,
  seedOtherTables,
  seedMaliciousSpiirt,
  makeAuthHeader,
};
