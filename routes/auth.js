const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const router = express.Router();
const { forwardAuthenticated } = require('../middleware/authCheck');

router
  .route('/login')
  .get(forwardAuthenticated, (req, res) => {
    res.render('login', { layout: 'layouts/full-width' });
  })
  .post(
    forwardAuthenticated,
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: true,
      failureMessage: true,
    })
  );

router
  .route('/register')
  .get(forwardAuthenticated, (req, res) => {
    res.render('register', { layout: 'layouts/full-width' });
  })
  // .post(checkNotAuthenticated, async (req, res, next) => {
  //     try {

  //         console.log(req.body);
  //         const hashedPassword = await bcrypt.hash(req.body.password, 10)
  //         users.push({
  //             id: Date.now().toString(),
  //             name: req.body.name,
  //             email: req.body.email,
  //             password: hashedPassword
  //         })
  //         res.redirect('/login')
  //     } catch {
  //         res.redirect('/register')
  //     }
  // });
  .post(forwardAuthenticated, (req, res) => {
    const { username, email, password, password2 } = req.body;
    let hasError = false;
    const errors = [];
    // check required fields
    if (!username || !email || !password || !password2) {
      hasError = true;
      errors.push('Please fill in all fields. ');
      //   req.flash('error_msg', 'test. ');
      // req.flash('error_msg', 'Please fill in all fields. ');
    }
    // check pwd match
    if (password != password2) {
      //   console.log('Password do not match. ');
      hasError = true;
      errors.push('Passwords do not match. ');
      errors.push('test. ');

      // req.flash('error_msg', 'Password do not match. ');
      //   console.log('error:', hasError);
    }
    // TODO: chekc pwd lenth

    if (hasError) {
      //   req.flash('error_msg', errors);
      res.render('register', {
        error_msg: errors,
        username,
        email,
        layout: 'layouts/full-width',
      });
    } else {
      User.findOne({ username }).then((user) => {
        if (user) {
          errors.push('Username already exists. ');
          hasError = true;
          //   req.flash('error_msg', 'Username already exists. ');
          res.render('register', {
            error_msg: errors,
            username,
            email,
            layout: 'layouts/full-width',
          });
        } else {
          const newUser = new User({ username, email, password });
          bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
              throw err;
            }
            newUser.password = hashedPassword;
            console.log(newUser);
            newUser
              .save()
              .then((user) => {
                //
                req.flash(
                  'success_msg',
                  'You are now registered and can log in. '
                );
                res.redirect('/login');
              })
              .catch((e) => console.log(e));
          });
        }
      });
    }
  });

router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.log(err);
    } else {
      req.flash('success_msg', 'You are logged out. ');
      res.redirect('/login');
    }
  });
});

module.exports = router;
// AdminRoutes.js

// router.use((req, res, next) => {
//     // changing layout for my admin panel
//     req.app.set('layout', 'layouts/admin');
//     next();
// });

// router.get('/', (req, res) => {
//    res.render('admin/index'); // will use admin layout
// });
