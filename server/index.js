const bodyParser = require('body-parser');
const path = require('path');
const db = require('../db/db');
const routes = require('./routers/routes.js');
const express = require('express');


const app = express();
app.port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', express.static(path.join(__dirname + '/../client')));

app.use('/', routes);

app.listen(app.port, function () {
  console.log('Example app listening on port ' + app.port);
});

module.exports = app;