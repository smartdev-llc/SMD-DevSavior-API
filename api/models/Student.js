/**
 * Student.js
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
    profileImageURL: {
      type: 'string'
    },
    gender: {
      type: 'string',
      defaultsTo: 'UNKNOWN'
    },
    status: { 
      type: 'string', 
      defaultsTo: 'ACTIVE' 
    },
    providers: {
      type: 'json', 
      defaultsTo: []
    },
    providerData: {
      type: 'json',
      defaultsTo: {}
    },
    skills: {
      collection: 'skill',
      via: 'student',
      through: 'skillsubscription'
    },
    jobs: {
      collection: 'job',
      via: 'student',
      through: 'jobapplication'
    }
  },

  customToJSON: function() {
    this.displayName = `${this.firstName} ${this.lastName}`;
    return _.omit(this, ['password']);
  },

  beforeCreate: function(user, cb){
    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(user.password, salt, null, function(err, hash){
        if(err) return cb(err);
        user.password = hash;
        return cb();
      });
    });
  }

};

