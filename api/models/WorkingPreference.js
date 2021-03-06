const constants = require('../../constants');
const { FULL_TIME, PART_TIME, INTERNSHIP, CONTRACT, FREELANCE } = constants.JOB_TYPE;

module.exports = {

  attributes: {
    preferredWorkingLocation: {
      type: 'string'
    },

    willingToRelocate: {
      type: 'boolean',
      defaultsTo: false
    },

    expectedSalaryFrom: {
      type: 'number',
    },

    expectedSalaryTo: {
      type: 'number',
    },

    isNegotiableSalary: {
      type: 'boolean',
      defaultsTo: false
    },

    jobType: {
      type: 'string',
      isIn: [FULL_TIME, PART_TIME, INTERNSHIP, CONTRACT, FREELANCE]
    },

    careerObjectives: {
      type: 'json'
    },

    student: {
      model: 'student',
      unique: true
    }
    
  }
};