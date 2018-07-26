/**
 * Job.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    company: { model: 'company' },
    category: { model: 'category' },
    status: { type: 'string' },
    title: { type: 'string', required: true },
    description: { type: 'string', required: true },
    students: {
      collection: 'student',
      via: 'job',
      through: 'jobapplication'
    },
    skills: {
      collection: 'skill',
      via: 'job',
      through: 'jobskill'
    }
  },

};

