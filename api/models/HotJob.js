/**
 * HotJob.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
const constants = require('../../constants');
const moment = require('moment');

module.exports = {

  attributes: {
    job: { model: 'job' },
    company: { model: 'company', required: true },
    status: {
      type: 'string',
      isIn: _.values(constants.HOT_JOB_STATUS),
      defaultsTo: constants.HOT_JOB_STATUS.PENDING
    },
    expiredDay: { 
      type: 'number', 
      defaultsTo: moment().add(1, "day").valueOf()
    },
    expiredAt: {
      type: 'number',
      defaultsTo: moment().add(1, "day").valueOf()
    },
    approvedAt: {
      type: 'number',
      defaultsTo: +new Date()
    },
    rejectedAt: {
      type: 'number',
      defaultsTo: +new Date()
    },
    activatedAt: {
      type: 'number',
      defaultsTo: +new Date()
    },
    deactivatedAt: {
      type: 'number',
      defaultsTo: +new Date()
    },

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝


    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

  },

};

