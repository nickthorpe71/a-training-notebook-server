const AuthService = {
  getUserWithUserName(db, username) {
    return db('users')
      .select('*')
      .where({ username })
      .first();
  },
};

module.exports = AuthService;