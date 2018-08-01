/**
 * Company.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
const bcrypt = require('bcrypt-nodejs');

module.exports = {

  attributes: {
    email: {
      type: 'string',
      required: true,
      unique: true
    },
    password: {
      type: 'string',
      required: true
    },
    name: {
      type: 'string',
      required: true
    },
    address: {
      type: 'string'
    },
    profileImageURL: {
      type: 'string'
    },
    status: {
      type: 'string',
      defaultsTo: 'ACTIVE'
    },
    jobs: {
      collection: 'job',
      via: 'company'
    }
  },

  customToJSON: function () {
    return _.omit(this, ['password']);
  },

  beforeCreate: function (user, cb) {
    if (user.password) {
      bcrypt.genSalt(10, function (err, salt) {
        if (err) return cb(err);
        bcrypt.hash(user.password, salt, null, function (err, hash) {
          if (err) return cb(err);
          user.password = hash;
          return cb();
        });
      });
    } else {
      return cb();
    }
  }

};

