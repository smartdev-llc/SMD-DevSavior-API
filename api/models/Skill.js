/**
 * Skill.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

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
    }
  },
  
};

