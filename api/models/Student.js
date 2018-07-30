/**
 * Student.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    firstName: { type: 'string', required: true },
    lastName: { type: 'string', required: true },
    status: { type: 'string', defaultsTo: 'ACTIVE' },
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

};

