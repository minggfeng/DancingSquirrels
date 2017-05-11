const passport = require('passport');
const app = require('./index.js');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const UserModel = require('../db/models/User.js');

const facebookStrategy = (callbackURL) => {
  return new FacebookStrategy({
    clientID: 343861912683387,
    clientSecret: 'b27751166b7231c39db513ae083319d9',
    callbackURL: callbackURL,
    passReqToCallback: true
  },
  function(request, accessToken, refreshToken, profile, cb) {
    cb(null, profile.id);
  });
};

const googleStrategy = (callbackURL) => {
  return new GoogleStrategy({
    clientID: '151503092115-rhqu4imiqagpc4s30eimt72oi9g41152.apps.googleusercontent.com',
    clientSecret: 'iqPpvTu14XmKOgZss4ZfHtkA',
    callbackURL: callbackURL,
    passReqToCallback: true
  },
  function(request, accessToken, refreshToken, profile, done) {
    done(null, profile.id);
  });
};

const localStrategy = () => {
  return new LocalStrategy((username, password, cb) => {
    UserModel.comparePasswords(username, password, cb);
  })
}

module.exports.facebookStrategy = facebookStrategy;
module.exports.googleStrategy = googleStrategy;
module.exports.localStrategy = localStrategy;