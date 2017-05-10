const knex = require('../db.js')
const bookshelf = require('bookshelf')(knex);

class User extends bookshelf.Model {
  get tableName() {
    return 'users';
  }
}

const Users = bookshelf.Collection.extend({
  model: User
})

module.exports = Users