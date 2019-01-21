/**
 * Skill.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
const constants = require('../../constants');
const { ACTIVE, INACTIVE, PENDING } = constants.STATUS;

module.exports = {
  attributes: {
    name: { type: 'string', unique: true, required: true },
    students: {
      collection: 'student',
      via: 'skill',
      through: 'skillsubscription'
    },
    jobs: {
      collection: 'job',
      via: 'skill',
      through: 'jobskill'
    },
    status: {
      type: 'string',
      isIn: [ACTIVE, INACTIVE, PENDING],
    }
  },
};

