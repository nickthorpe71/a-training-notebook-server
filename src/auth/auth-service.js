const AuthService = {
  getUserWithUserName(db, email) {
    return db('users')
      .select('*')
      .where({ email })
      .first();
  },
};

module.exports = AuthService;