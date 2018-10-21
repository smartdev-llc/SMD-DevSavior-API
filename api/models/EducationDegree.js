
module.exports = {

  attributes: {
    university: {
      type: 'string'
    },

    major: {
      type: 'string'
    },

    degreeType: {
      type: 'string'
    },

    degreeClassification: {
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

    studentProfile: {
      model: 'profile'
    }
    
  }
};