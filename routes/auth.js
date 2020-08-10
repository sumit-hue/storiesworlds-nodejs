const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/'
  }),
  (req, res) => {
    //successful user login success
    res.redirect('/');
  }
);


router.get('/verify', (req, res) => {
  if (req.user) {
    console.log(req.user);
  } else {
    console.log('No auth')
  }
})

router.get('/logout', (req, res) => {
  req.logOut();
  res.redirect('/')
})

module.exports = router;