const knex = require('../db.js')
const bookshelf = require('bookshelf')(knex);

const Session = bookshelf.Model.extend({
  tableName: 'sessions'
})

const fetchOne = (sess, cb) => {
  Session
  .where('sess', JSON.stringify(sess))
  .fetch()
  .then((session) => {
    if (!session) {
      return cb(null, null);
    } else {
      return cb(null, session);
    }
  })
  .catch((err) => {
    return cb(err, null);
  })
}

module.exports.Session = Session;
module.exports.fetchOne = fetchOne;