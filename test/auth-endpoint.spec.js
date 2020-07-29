const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');
const supertest = require('supertest');
const jwt = require('jsonwebtoken');

describe('Auth Endpoints', function () {
  let db;

  const { testUsers } = helpers.makeFixtures();
  const testUser = testUsers[0];

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

  describe('POST /api/auth/login', () => {
    beforeEach('insert users', () => helpers.seedUsersTable(db, testUsers));
    const requiredFields = ['email', 'password'];

    requiredFields.forEach((field) => {
      const loginAttemptBody = {
        email: testUser.email,
        password: testUser.password,
      };
      it(`Responds with 400 required error when '${field}' is missing`, () => {
        delete loginAttemptBody[field];

        return supertest(app)
          .post('/api/auth/login')
          .send(loginAttemptBody)
          .expect(400, { error: `Missing '${field}' in request body` });
      });
    });
    it('Responds 400 \'Invalid email or password\' when bad email', () => {
      const userInvalidEmail = {
        email: 'user_not',
        password: 'existy',
      };
      return supertest(app)
        .post('/api/auth/login')
        .send(userInvalidEmail)
        .expect(400, { error: 'Incorrect Email or Password' });
    });
    it('Responds 400 \'Invalid email or password\' when bad password', () => {
      const userInvalidPassword = {
        email: testUser.email,
        password: 'existy',
      };
      return supertest(app)
        .post('/api/auth/login')
        .send(userInvalidPassword)
        .expect(400, { error: 'Incorrect Email or Password' });
    });
    it('Responds 200 and JWT auth Token and user ID using secret when valid', () => {
      const userValid = {
        username: testUser.username,
        email: testUser.email,
        password: testUser.password,
      };
      const expectedToken = jwt.sign(
        { user_id: testUser.id },
        process.env.JWT_SECRET,
        {
          subject: testUser.email,
          algorithm: 'HS256',
        }
      );
      const expectedID = testUser.id;

      return supertest(app).post('/api/auth/login').send(userValid).expect(200, {
        authToken: expectedToken,
        user_id: expectedID
      });
    });
  });
});
