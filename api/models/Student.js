/**
 * Student.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
const bcrypt = require('bcrypt-nodejs');

const constants = require('../../constants');
const { FIRST_TO_THIRD_YEAR, FOURTH_YEAR, FINAL_YEAR, GRADUATED } = constants.EDUCATIONAL_STATUS;
const { SINGLE, MARRIED } = constants.MARITAL_STATUS;
const { MALE, FEMALE } = constants.GENDER;
const { ACTIVE } = constants.STATUS;

module.exports = {

  attributes: {
    email: {
      type: 'string',
      required: true,
      unique: true
    },
    password: {
      type: 'string'
    },
    firstName: {
      type: 'string',
      required: true
    },
    lastName: {
      type: 'string',
      required: true
    },
    displayName: {
      type: 'string'
    },
    profileImageURL: {
      type: 'string'
    },
    status: { 
      type: 'string', 
      defaultsTo: ACTIVE
    },
    providers: {
      type: 'json', 
      defaultsTo: []
    },
    providerData: {
      type: 'json',
      defaultsTo: {}
    },
    emailVerified: {
      type: 'boolean',
      defaultsTo: false
    },
    // FOR PROFILE
    displayEmail: {
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
      via: 'student'
    },
    workingPreference: {
      collection: 'workingpreference',
      via: 'student'
    },
    workingExperiences: {
      collection: 'workingexperience',
      via: 'student'
    },
    // FOR JOB APPLICATION
    jobs: {
      collection: 'job',
      via: 'student',
      through: 'jobapplication'
    },
    // FOR JOB SCRIPTION
    subscribedSkills: {
      collection: 'skill',
      via: 'student',
      through: 'skillsubscription'
    },
    companyReviews:{
      collection: 'company',
      via: 'student',
      through: 'companyreview'
    }
  },

  customToJSON: function() {
    return _.omit(this, ['password']);
  },

  beforeCreate: function(user, cb){
    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(user.password, salt, null, function(err, hash){
        if (err) return cb(err);
        user.password = hash;
        return cb();
      });
    });
  }

};

