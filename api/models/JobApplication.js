/**
 * JobApplication.js
 * Many-to-Many relationship between Job & Student
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */


module.exports = {

  attributes: {
    student: {
      model: 'student'
    },
    job: {
      model: 'job'
    }
  },

};

