const knex = require('../db.js')
const bookshelf = require('bookshelf')(knex);

const User = bookshelf.Model.extend({
  tableName: 'users'
})

module.exports.User = User
