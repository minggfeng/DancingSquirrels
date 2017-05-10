const app = require('./index.js');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const User = require('../db/models/User.js');


// app.get('/login/facebook',
//   passport.authenticate('facebook'));

passport.use(new FacebookStrategy({
    clientID: 343861912683387,
    clientSecret: 'b27751166b7231c39db513ae083319d9',
    callbackURL: `http://localhost:${app.port}/auth/facebook/return`
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      console.log('user', user);
      return cb(err, user);
    });
  }
));

passport.use(new GoogleStrategy({
  clientID: '151503092115-rhqu4imiqagpc4s30eimt72oi9g41152.apps.googleusercontent.com',
  clientSecret: 'iqPpvTu14XmKOgZss4ZfHtkA',
  callbackURL: `http://localhost:${app.port}/auth/google/return`,
  passReqToCallback: true
},
  function(request, accessToken, refreshToken, profile, done) {
    Users.forge().fetch()
    .then((user) => {
      console.log(user);
    })
  }
))

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

module.exports = passport;