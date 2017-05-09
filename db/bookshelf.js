const knex = require('knex')(require('./knexfile'));
const bookshelf = require('bookshelf')(knex);

var Users = bookshelf.Model.extend({
  tableName: 'users'
})

var Podcasts = bookshelf.Model.extend({
  tableName: 'podcasts'
})

var Episodes = bookshelf.Model.extend({
  tableName: 'episodes'
})

var user_episodes = bookshelf.Model.extend({
  tableName: 'user_episodes'
})

module.exports = bookshelf;