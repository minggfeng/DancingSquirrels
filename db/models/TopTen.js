const knex = require('../db.js');
const bookshelf = require('bookshelf')(knex);

const TopTen = bookshelf.Model.extend({
  tableName: 'top_ten'
});

const fetchCollection = (cb) => {
  TopTen
  .collection()
  .fetch()
  .then((collection) => {
    return cb(collection);
  })
}

const insertOne = (results, cb) => {
  TopTen
  .forge({ results: results })
  .save()
  .then((data) => {
    return cb(null, data);
  })
  .catch((err) => {
    return cb(err, null);
  })
}

module.exports.insertOne = insertOne;
module.exports.fetchCollection = fetchCollection;