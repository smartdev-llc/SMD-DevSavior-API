
module.exports = {

  attributes: {
    jobTitle: {
      type: 'string'
    },

    company: {
      type: 'string'
    },

    fromMonth: {
      type: 'string'
    },

    toMonth: {
      type: 'string'
    },

    additionalInformation: {
      type: 'json'
    },

    student: {
      model: 'student'
    }
  }
};