const knex = require('../db.js')
const bookshelf = require('bookshelf')(knex);
const bcrypt = require('bcrypt');

const saltRounds = 10;

const User = bookshelf.Model.extend({
  tableName: 'users'
})

const insertOne = (username, password, cb) => {
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

const fetchOneExternal = (username, password, cb) => {
  User
  .where('username', username)
  .fetch()
  .then((user) => {
    if (!user) {
      return cb(null, null);
    } else {
      return cb(null, true);
    }
  })
  .catch((err) => {
    return cb(err, null);
  })
}

const insertOneExternal = (username, password, provider, id, cb) => {
  let options = {
    username: username
  }
  if (provider === 'facebook') {
    options.facebookId = id;
  } else if (provider === 'google') {
    options.googleId = id;
  } else if (provider === 'github') {
    options.githubId = id;
  }
  bcrypt.hash(password, saltRounds, (err, hash) => {
    options.password = hash;

    User
    .forge(options)
    .save()
    .then((data) => {
      return cb(null, data);
    })
    .catch((err) => {
      return cb(err, null);
    })
  })
}

const comparePasswords = (username, password, cb) => {
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
          return cb(null, username);
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
module.exports.fetchOneExternal = fetchOneExternal;
module.exports.insertOneExternal = insertOneExternal;
