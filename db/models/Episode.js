const knex = require('knex')(require('../knexfile'));
const bookshelf = require('bookshelf')(knex);

const Episode = bookshelf.Model.extend({
  tableName: 'episodes'
})

module.exports = Episode