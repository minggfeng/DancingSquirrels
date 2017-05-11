const bodyParser = require('body-parser');
const path = require('path');
const db = require('../db/db.js');
const routes = require('./routers/routes.js');
const express = require('express');
const session = require('express-session');

var app = module.exports = express();
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

const config = require('./config.js');

app.listen(app.port, function () {
  console.log('Example app listening on port ' + app.port);
});

