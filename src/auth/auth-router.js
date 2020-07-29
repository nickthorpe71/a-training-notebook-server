const express = require('express');
const AuthService = require('./auth-service');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authRouter = express.Router();

authRouter
  .route('/login')
  .post(express.json(), (req, res, next) => {
    const { email, password } = req.body;
    const loginUser = { email, password };

    if (loginUser.email !== void (0))
      loginUser.email = email.toLowerCase();

    for (const [key, value] of Object.entries(loginUser))
      if (!value)
        return res.status(400).json({ error: `Missing '${key}' in request body` });


    return AuthService.getUserWithUserName(req.app.get('db'), loginUser.email)
      .then(user => {
        if (!user)
          return res.status(400).json({ error: 'Incorrect Email or Password' });

        return bcrypt.compare(password, user.password)
          .then(passwordMatch => {
            if (!passwordMatch)
              return res.status(400).json({ error: 'Incorrect Email or Password' });

            const token = jwt.sign({ user_id: user.id }, process.env.JWT_SECRET, { subject: user.email });

            return res.json({
              authToken: token,
              user_id: user.id
            });
          })
          .catch(next);
      })
      .catch(next);
  });

module.exports = authRouter;