/**
 * Resume.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    student: {
      collection: 'student'
    },
    university: {
      type: 'string'
    }
  },

};

