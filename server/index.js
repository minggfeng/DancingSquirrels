const bodyParser = require('body-parser');
const path = require('path');
const db = require('../db/db.js');
const routes = require('./routers/routes.js');
const express = require('express');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const User = require('../db/models/User.js');

const app = express();
app.port = process.env.PORT || 8080;

passport.use(new FacebookStrategy({
    clientID: 343861912683387,
    clientSecret: 'b27751166b7231c39db513ae083319d9',
    callbackURL: `http://localhost:${app.port}/auth/facebook/return`
  },
  function(accessToken, refreshToken, profile, cb) {
    Users.findOrCreate({ facebookId: profile.id }, function (err, user) {
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
    Users.fetch()
    .then((user) => {
      console.log(user);
    })
  }
))

passport.use(new LocalStrategy(
  (username, password, cb) => {
    console.log('!!!', User);
    User.fetchAll()
    .then((user) => {
      if (!user) {
        return cb(null, false);
      }
      if (user.password != password) {
        return cb(null, false);
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
}))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUnintialized: true}));

app.use(passport.initialize());
app.use(passport.session());


app.use('/', express.static(path.join(__dirname + '/../client')));

app.use('/', routes);

// app.post('/login', (req, res) => {
//   console.log(req.body)
//   passport.authenticate('local')

// })

app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.listen(app.port, function () {
  console.log('Example app listening on port ' + app.port);
});

module.exports.app = app;
module.exports.passport = passport;
