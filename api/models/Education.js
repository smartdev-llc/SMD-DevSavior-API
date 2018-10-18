
module.exports = {

  attributes: {
    university: {
      type: 'string'
    },

    major: {
      type: 'string'
    },

    from: {
      type: 'json'
    },

    to: {
      type: 'json'
    },

    additionalInformation: {
      type: 'json'
    },

    studentProfile: {
      model: 'profile'
    }
    
  }
};