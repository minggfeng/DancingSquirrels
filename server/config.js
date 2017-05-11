const passport = require('passport');
const app = require('./index.js');
const auth = require('./auth.js')

app.use(passport.initialize());
app.use(passport.session());

var domain;

if (app.env === 'production') {
  domain = 'https://podiocast.herokuapp.com/';
} else if (app.env === 'staging') {
  domain = 'https://podiocast-staging.herokuapp.com/';
} else {
  domain = `http://localhost:${app.port}/`;
}

passport.use(auth.facebookStrategy(`${domain}auth/facebook/return`));

passport.use(auth.googleStrategy(`${domain}auth/google/return`));

passport.use(auth.githubStrategy(`${domain}auth/github/return`));

passport.use(auth.localStrategy());

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

app.get('/login/github', passport.authenticate('github'));

app.get('/login/local', passport.authenticate('local'));

app.get('/auth/facebook/return',
  passport.authenticate('facebook', { failureRedirect: '/#/login/facebook' }),
  function(req, res) {
    res.redirect('/#/');
  });

app.get('/auth/google/return',
  passport.authenticate('google', { failureRedirect: '/login/google' }),
  function(req, res) {
    res.redirect('/#/');
  });

app.get('/auth/github/return',
  passport.authenticate('github', { failureRedirect: '/login/github' }),
  function(req, res) {
    res.redirect('/#/');
  });

app.post('/login/local', 
  passport.authenticate('local', { failureRedirect: '/login/local' }),
  function(req, res) {
    res.send('validPassword');
  });