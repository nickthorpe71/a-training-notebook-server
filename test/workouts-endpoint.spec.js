const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');
const supertest = require('supertest');

describe('Workouts Endpoints', () => {
  let db;

  const {
    testUsers,
    testWorkouts,
    testExercises,
    testSets,
  } = helpers.makeFixtures();
  const testUser = testUsers[0];
  const testWorkout = testWorkouts[0];

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());
  before('cleanup', () => helpers.cleanTables(db));
  afterEach('cleanup', () => helpers.cleanTables(db));

  describe('GET /api/workouts/:user_id/:date', () => {
    beforeEach('insert data', () =>
      helpers.seedOtherTables(
        db,
        testWorkouts,
        testExercises,
        testSets,
        testUsers
      )
    );
    it('responds 200 with workouts', () => {
      const userId = testUser.id;
      const date = testWorkout.workout_date;

      const expectedWorkouts = testWorkouts.filter(workout =>
        (workout.user_id === userId) && (workout.workout_date === date));

      return supertest(app)
        .get(`/api/workouts/${userId}/${date}`)
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .expect(200, expectedWorkouts);

    });
  });
});