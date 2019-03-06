/**
 * CompanyRaking.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    stars: {
      type: "number",
      required: true
    },
    comment: {
      type: "json",
      required: true
    },
    company: {
      model: "company"
    },
    student: {
      model: "student"
    }
  },

};

