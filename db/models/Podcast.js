const knex = require('knex')(require('../knexfile'));
const bookshelf = require('bookshelf')(knex);

const Podcast = bookshelf.Model.extend({
  tableName: 'podcasts'
})

module.exports = Podcast