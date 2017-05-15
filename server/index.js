const worker = require('./worker.js');
const bodyParser = require('body-parser');
const path = require('path');
const knex = require('../db/db.js');
const routes = require('./routers/routes.js');
const express = require('express');
const session = require('express-session');
const authHelpers = require('./auth/authHelpers.js');
const sessionHelpers = require('./auth/sessionHelpers.js');

const app = module.exports = express();

app.port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(require('morgan')('combined'));

app.use(session({ 
  secret: process.env.COOKIE_SECRET || 'keyboard cat',
  store: sessionHelpers.store,
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 60000 * 60 * 24 }
}));

app.use('/', express.static(path.join(__dirname + '/../client')));

app.use('/', routes);

const authentication = require('./auth/authentication.js');

app.listen(app.port, function () {
  console.log('Example app listening on port ' + app.port);
});


