const moment = require('moment');
const validator = require('validator');
const constants = require('../constants');
const { PHONE } = constants.REGEX;
const { FIRST_TO_THIRD_YEAR, FOURTH_YEAR, FINAL_YEAR, GRADUATED } = constants.EDUCATIONAL_STATUS;
const { SINGLE, MARRIED } = constants.MARITAL_STATUS;
const { MALE, FEMALE } = constants.GENDER;
const { FULL_TIME, PART_TIME, INTERSHIP } = constants.JOB_TYPE;

const isValidPassword = (password) => {
  return validator.isLength(password, { min: 8, max: undefined })
};

const isValidPhoneNumber = (phone) => PHONE.test(phone);

const isValidSocialProvider = (provider) => {
  const validProviders = ["facebook", "google"];
  return _.indexOf(validProviders, provider) !== -1;
}

const isValidDateOfBirth = (date) => {
  const dateMoment = moment(date, 'DD-MM-YYYY');
  return dateMoment.isValid() && dateMoment.isBetween('1970-01-01');
}

const isValidGender = (gender) => (gender == MALE || gender == FEMALE);

const isValidMaritalStatus = (maritalStatus) => (maritalStatus == SINGLE || maritalStatus == MARRIED);

const isValidEducationalStatus = (educationalStatus) => _.indexOf([FIRST_TO_THIRD_YEAR, FOURTH_YEAR, FINAL_YEAR, GRADUATED], educationalStatus) > -1;

const isValidSalary = (fromSalary, toSalary) =>  (_.isNumber(fromSalary)  && _.isNumber(toSalary) && fromSalary >= 0 && toSalary >= fromSalary);

const isValidJobType = (jobType) => _.indexOf([FULL_TIME, PART_TIME, INTERSHIP], jobType) > -1;

module.exports = {
  isValidPassword,
  isValidPhoneNumber,
  isValidSocialProvider,
  isValidDateOfBirth,
  isValidGender,
  isValidMaritalStatus,
  isValidEducationalStatus,
  isValidSalary,
  isValidJobType
}