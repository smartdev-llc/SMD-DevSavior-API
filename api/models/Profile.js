/**
 * Profile.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
const constants = require('../../constants');
const { FIRST_TO_THIRD_YEAR, FOURTH_YEAR, FINAL_YEAR, GRADUATED } = constants.EDUCATIONAL_STATUS;
const { SINGLE, MARRIED } = constants.MARITAL_STATUS;
const { MALE, FEMALE } = constants.GENDER;

module.exports = {

  attributes: {
    fullName: {
      type: 'string'
    },
    email: {
      type: 'string'
    },
    phoneNumber: {
      type: 'string'
    },
    gender: {
      type: 'string',
      isIn: [MALE, FEMALE]
    },
    dateOfBirth: {
      type: 'string'
    },
    maritalStatus: {
      type: 'string',
      isIn: [SINGLE, MARRIED]
    },
    country: {
      type: 'string'
    },
    city: {
      type: 'string'
    },
    currentAddress: {
      type: 'string'
    },
    jobTitle: {
      type: 'string'
    },
    yearsOfExperience: {
      type: 'number'
    },
    educationalStatus: {
      type: 'string',
      isIn: [FIRST_TO_THIRD_YEAR, FOURTH_YEAR, FINAL_YEAR, GRADUATED]
    },
    isPrivate: { // will or will not show public information: phone, email
      type: 'boolean',
      defaultsTo: true
    },
    skills: {
      type: 'json', // use json type to store string array
      defaultsTo: []
    },
    languages: {
      type: 'json', // use json type to store object array
      defaultsTo: []
    },
    educationDegrees: {
      collection: 'educationdegree',
      via: 'studentProfile'
    },
    workingPreference: {
      collection: 'workingpreference',
      via: 'studentProfile'
    },
    workingExperiences: {
      collection: 'workingexperience',
      via: 'studentProfile'
    },
    owner: {
      model: 'student',
      unique: true
    },
  },

};

