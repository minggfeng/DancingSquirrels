const knex = require('../db.js')
const bookshelf = require('bookshelf')(knex);
const bcrypt = require('bcrypt');

const saltRounds = 10;

const User = bookshelf.Model.extend({
  tableName: 'users'
})

insertOne = (username, password, cb) => {
  bcrypt.hash(password, saltRounds, (err, hash) => {
    User
    .forge({ username: username, password: hash })
    .save()
    .then((data) => {
      return cb(data);
    })
    .catch((err) => {
      return cb(err);
    })
  })
}

comparePasswords = (username, password, cb) => {
  User
  .where('username', username)
  .fetch()
  .then((user) => {
    if (!user) {
      return cb(null, false);
    } else {
      let hash = user.attributes.password;
      bcrypt.compare(password, hash, (err, res) => {
        if (res) {
          return cb(null, true);
        } else {
          return cb(null, false);
        }
      })
    }
  })
}

module.exports.User = User;
module.exports.insertOne = insertOne;
module.exports.comparePasswords = comparePasswords;
