module.exports = {

  attributes: {
    year: {
      type: 'number'
    },
    college: {
      type: 'string'
    },
    degree: {
      type: 'string'
    },
    major: {
      type: 'string'
    },
    award: {
      model: 'resume'
    }
  }
};