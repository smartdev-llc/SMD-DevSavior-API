/**
 * Job.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
const constants = require('../../constants');
const { FULL_TIME, PART_TIME, INTERNSHIP, CONTRACT, FREELANCE } = constants.JOB_TYPE;

module.exports = {

  attributes: {
    company: { model: 'company' },
    category: { model: 'category' },
    status: { type: 'string', defaultsTo: constants.STATUS.PENDING },
    title: { type: 'string', required: true },
    fromSalary: { type: 'number', required: true },
    toSalary: { type: 'number', required: true },
    description: { type: 'json', required: true },
    requirements: { type: 'json', required: true },
    expiredAt: { type: 'number' },
    approvedAt: { type: 'number' },
    jobType: {
      type: 'string',
      isIn: [FULL_TIME, PART_TIME, INTERNSHIP, CONTRACT, FREELANCE],
      required: true
    },
    benefits: { type: 'json' },
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

