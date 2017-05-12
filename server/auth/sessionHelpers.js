const knex = require('../../db/db.js');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);


const store = new KnexSessionStore({
  knex: knex,
  tablename: 'sessions'
})

module.exports.store = store;