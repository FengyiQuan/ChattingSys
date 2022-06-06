const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/User');

function initPassport(passport) {
  const authenticateUser = (username, password, done) => {
    User.findOne({ username })
      .then((user) => {
        // console.log(user);
        if (!user) {
          done(null, false, { message: 'No user with that username. ' });
        } else {
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
              throw err;
            }
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: 'Password incorrect. ' });
            }
          });
        }
      })
      .catch((err) => console.log(err.message));
  };

  passport.use(
    new LocalStrategy(
      { usernameField: 'username' }, //passReqToCallback: true },
      authenticateUser
    )
  );

  passport.serializeUser((user, done) => {
    process.nextTick(function () {
      done(null, { id: user.id, username: user.username });
    });
  });

  passport.deserializeUser((user, done) => {
    process.nextTick(() => {
      return done(null, user);
    });
  });
}

module.exports = initPassport;
