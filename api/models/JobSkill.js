/**
 * JobSkill.js
 *  Many-to-Many relationship between Job & Skill
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    job: {
      model: 'job'
    },
    skill: {
      model: 'skill'
    }
  },

};

