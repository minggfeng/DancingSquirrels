const bodyParser = require('body-parser');
const path = require('path');
const db = require('../db/db.js');
const routes = require('./routers/routes.js');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const UserModel = require('../db/models/User.js');
const bcrypt = require('bcrypt');

const saltRounds = 10;

const app = express();
app.port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(require('morgan')('combined'));
app.use(session({ 
  secret: 'keyboard cat', 
  resave: false, 
  saveUnintialized: true,
  cookie: { secure: true }
}));



app.use('/', express.static(path.join(__dirname + '/../client')));

app.use('/', routes);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new FacebookStrategy({
    clientID: 343861912683387,
    clientSecret: 'b27751166b7231c39db513ae083319d9',
    callbackURL: `http://localhost:${app.port}/auth/facebook/return`,
    passReqToCallback: true
  },
  function(request, accessToken, refreshToken, profile, cb) {
    cb(null, profile.id);
  }
));

passport.use(new GoogleStrategy({
  clientID: '151503092115-rhqu4imiqagpc4s30eimt72oi9g41152.apps.googleusercontent.com',
  clientSecret: 'iqPpvTu14XmKOgZss4ZfHtkA',
  callbackURL: `http://localhost:${app.port}/auth/google/return`,
  passReqToCallback: true
},
  function(request, accessToken, refreshToken, profile, done) {
    done(null, profile.id);
  }
))

passport.use(new LocalStrategy(
  (username, password, cb) => {
    UserModel.User
    .where( 'username', username )
    .fetch()
    .then((user) => {
      if (!user) {
        return cb(null, false);
      } else {
        let hash = user.attributes.password;
        bcrypt.compare(password, hash, (err, res) => {
          if (res) {
            return cb(null, true);
          } else {
            return cb(null, false);
          }
        })
      }
    })
  }
))

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

app.get('/login/facebook', passport.authenticate('facebook'));

app.get('/login/google', passport.authenticate('google', {
  scope: [ 'https://www.googleapis.com/auth/plus.login',
      'https://www.googleapis.com/auth/plus.profile.emails.read' ]
}));

app.get('/login/local', passport.authenticate('local'));

app.get('/auth/facebook/return',
  passport.authenticate('facebook', { failureRedirect: '/login/facebook' }),
  function(req, res) {
    res.redirect('/#/');
  });

app.get('/auth/google/return',
  passport.authenticate('google', { failureRedirect: '/login/google' }),
  function(req, res) {
    res.redirect('/#/');
  });


app.post('/login/local', 
  passport.authenticate('local', { failureRedirect: '/login/local' }),
  function(req, res) {
    res.send('validPassword');
  });

app.listen(app.port, function () {
  console.log('Example app listening on port ' + app.port);
});

module.exports.app = app;
module.exports.passport = passport;
