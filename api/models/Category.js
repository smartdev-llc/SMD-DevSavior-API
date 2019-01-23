/**
 * Category.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
const constants = require('../../constants');
const { ACTIVE, INACTIVE, PENDING } = constants.STATUS;

module.exports = {

  attributes: {
    name: { type: 'string' },
    jobs: {
      collection: 'job',
      via: 'category'
    },
    status: {
      type: 'string',
      isIn: [ACTIVE, INACTIVE, PENDING],
      defaultsTo: ACTIVE
    }
  },
};

