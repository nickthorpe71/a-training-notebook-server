const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function makeUsersArray() {
  return [
    {
      id: 1,
      username: 'test-user-1',
      email: 'test@gmail.com',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 2,
      user_name: 'test-user-2',
      email: 'test@gmail.com',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 3,
      user_name: 'test-user-3',
      email: 'test@gmail.com',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 4,
      user_name: 'test-user-4',
      email: 'test@gmail.com',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615Z',
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
      date_created: '2029-01-22T16:28:32.615Z',
      created_at: '2020-07-26T16:28:32.615Z',
      updated_at: '2020-07-28T16:28:32.615Z',
    },
    {
      id: 2,
      title: 'curls',
      workout_id: workouts[0].id,
      date_created: '2029-01-22T16:28:32.615Z',
      created_at: '2020-07-26T16:28:32.615Z',
      updated_at: '2020-07-28T16:28:32.615Z',
    },
    {
      id: 3,
      title: 'bench',
      workout_id: workouts[0].id,
      date_created: '2029-01-22T16:28:32.615Z',
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

function makeExpectedThing(users, thing, reviews = []) {
  const user = users
    .find(user => user.id === thing.user_id);

  const thingReviews = reviews
    .filter(review => review.thing_id === thing.id);

  const number_of_reviews = thingReviews.length;
  const average_review_rating = calculateAverageReviewRating(thingReviews);

  return {
    id: thing.id,
    image: thing.image,
    title: thing.title,
    content: thing.content,
    date_created: thing.date_created,
    number_of_reviews,
    average_review_rating,
    user: {
      id: user.id,
      user_name: user.user_name,
      full_name: user.full_name,
      nickname: user.nickname,
      date_created: user.date_created,
    },
  };
}

function calculateAverageReviewRating(reviews) {
  if (!reviews.length) return 0;

  const sum = reviews
    .map(review => review.rating)
    .reduce((a, b) => a + b);

  return Math.round(sum / reviews.length);
}

function makeExpectedThingReviews(users, thingId, reviews) {
  const expectedReviews = reviews
    .filter(review => review.thing_id === thingId);

  return expectedReviews.map(review => {
    const reviewUser = users.find(user => user.id === review.user_id);
    return {
      id: review.id,
      text: review.text,
      rating: review.rating,
      date_created: review.date_created,
      user: {
        id: reviewUser.id,
        user_name: reviewUser.user_name,
        full_name: reviewUser.full_name,
        nickname: reviewUser.nickname,
        date_created: reviewUser.date_created,
      }
    };
  });
}

function makeMaliciousThing(user) {
  const maliciousThing = {
    id: 911,
    image: 'http://placehold.it/500x500',
    date_created: new Date().toISOString(),
    title: 'Naughty naughty very naughty <script>alert("xss");</script>',
    user_id: user.id,
    content: 'Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.',
  };
  const expectedThing = {
    ...makeExpectedThing([user], maliciousThing),
    title: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    content: 'Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.',
  };
  return {
    maliciousThing,
    expectedThing,
  };
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

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1),
  }));
  return db.into('thingful_users').insert(preppedUsers)
    .then(() =>
      // update the auto sequence to stay in sync
      db.raw(
        'SELECT setval(\'thingful_users_id_seq\', ?)',
        [users[users.length - 1].id],
      )
    );
}

function seedThingsTables(db, users, things, reviews = []) {
  return seedUsers(db, users)
    .then(() =>
      db
        .into('thingful_things')
        .insert(things)
    )
    .then(() =>
      reviews.length && db.into('thingful_reviews').insert(reviews)
    );
}

function seedMaliciousThing(db, user, thing) {
  return seedUsers(db, [user])
    .then(() =>
      db
        .into('thingful_things')
        .insert([thing])
    );
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign(
    {
      user_id: user.id
    },
    secret,
    {
      subject: user.user_name,
    }
  );

  return `Bearer ${token}`;
}


module.exports = {
  makeUsersArray,
  makeWorkoutsArray,
  makeExercisesArray,
  makeSetsArray,
  makeExpectedThing,
  makeExpectedThingReviews,
  makeMaliciousThing,

  makeFixtures,
  cleanTables,
  seedUsers,
  seedThingsTables,
  seedMaliciousThing,
  makeAuthHeader,
};
