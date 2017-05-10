const knex = require('knex')(require('../knexfile'));
const bookshelf = require('bookshelf')(knex);

const User_episodes = bookshelf.Model.extend({
  tableName: 'user_episodes'
})

module.exports = user_episodes