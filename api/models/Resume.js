/**
 * Resume.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
const constants = require('../../constants');
const { NAM_1_TO_3, NAM_4, NAM_CUOI, GRADUATED, WORKED } = constants.QUALIFICATION;

module.exports = {

  attributes: {
    subject: {
      type: 'string',
      required: true
    },
    university: {
      type: 'string',
      required: true
    },
    qualification: {
      type: 'string',
      isIn: [NAM_1_TO_3, NAM_4, NAM_CUOI, GRADUATED, WORKED],
      required: true
    },
    fromDate: {
      type: 'string'
    },
    toDate: {
      type: 'string'
    },
    student: {
      model: 'student'
    },
    achievements: {
      collection: 'achievement',
      via: 'resume'
    }
  },

};

