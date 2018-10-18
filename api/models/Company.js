/**
 * Company.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
const bcrypt = require('bcrypt-nodejs');

const constants = require('../../constants');
const { ACTIVE } = constants.STATUS;

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
    city: {
      type: 'string'
    },
    contactName: {
      type: 'string'
    },
    phoneNumber: {
      type: 'string'
    },
    website: {
      type: 'string'
    },
    description: {
      type: 'string'
    },
    logoURL: {
      type: 'string'
    },
    coverURL: {
      type: 'string'
    },
    photoURLs: {
      type: 'json'
    },
    videoURL: {
      type: 'string'
    },
    status: {
      type: 'string',
      defaultsTo: ACTIVE
    },
    emailVerified: {
      type: 'boolean',
      defaultsTo: false
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

