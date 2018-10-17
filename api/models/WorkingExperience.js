
module.exports = {

  attributes: {
    position: {
      type: 'string'
    },

    company: {
      type: 'string'
    },

    from: {
      type: 'json'
    },

    to: {
      type: 'json'
    },

    isCurrentJob: {
      type: 'boolean',
      defaultsTo: false
    },

    additionalInformation: {
      type: 'json'
    },

    studentCV: {
      model: 'resume'
    }
  }
};