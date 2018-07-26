/**
 * SkillSubscription.js
 *  Many-to-Many relationship between Skill & Student
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    student: {
      model: 'student'
    },
    skill: {
      model: 'skill'
    },
    // Student subcribes to receive email or not
    status: {
      type: 'string'
    },
    // How good at this skill is student?
    strengh: {
      type: 'number'
    }
  },

};

