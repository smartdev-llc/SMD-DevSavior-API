/**
 * Student.js
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
      type: 'string'
    },
    firstName: {
      type: 'string',
      required: true
    },
    lastName: {
      type: 'string',
      required: true
    },
    displayName: {
      type: "string"
    },
    profileImageURL: {
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
    role: {
        type: 'string',
        required: true
    }
  },

  customToJSON: function() {
    return _.omit(this, ['password']);
  },

  beforeCreate: function(user, cb){
    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(user.password, salt, null, function(err, hash){
        if (err) return cb(err);
        user.password = hash;
        return cb();
      });
    });
  }

};

