const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./keys');

const User = require('../models/User')
module.exports = function (passport) {
  passport.use(
    new GoogleStrategy({
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: '/auth/google/callback',
        proxy: true,
      },
      (accessToken, refreshToken, profile, done) => {
        const newUser = {
          googleID: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          image: profile.photos[0].value
        }
              console.log(profile)

        User.findOne({
            googleID: profile.id
          })
          .then((user) => {
            if (user) {
              done(null, user)
            } else {
              new User(newUser)
                .save()
                .then((user) => {
                  done(null, user)
                })
            }
          })
      }
    )
  );
  passport.serializeUser(function (user, done) {
    done(null, user.id)
  });
  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user)
    })
  })
};