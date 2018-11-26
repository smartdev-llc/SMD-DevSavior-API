const moment = require('moment');
const path = require('path');
const validator = require('validator');

const constants = require('../constants');
const { PHONE } = constants.REGEX;
const { FIRST_TO_THIRD_YEAR, FOURTH_YEAR, FINAL_YEAR, GRADUATED } = constants.EDUCATIONAL_STATUS;
const { SINGLE, MARRIED } = constants.MARITAL_STATUS;
const { MALE, FEMALE } = constants.GENDER;
const { FULL_TIME, PART_TIME, INTERSHIP, CONTRACT, FREELANCE } = constants.JOB_TYPE;
const { ENGLISH, FRENCH, GERMAN, SPANISH, RUSSIAN, KOREAN, CHINESE, JAPANESE } = constants.LANGUAGES;
const { NO, BEGINNER, INTERMEDIATE, ADVANCED, NATIVE } = constants.LANGUAGE_LEVELS;
const { HIGH_SCHOOL, COLLEGE, BACHELOR, MASTER, DOCTORATE, OTHER } = constants.DEGREE_TYPE;
const { AVERAGE, GOOD, EXCELLENT } = constants.DEGREE_CLASSIFICATION;
const { ONE_WEEK, TWO_WEEKS, ONE_MONTH } = constants.EXPIRED_DAY;

const isValidPassword = (password) => {
  return validator.isLength(password, { min: 8, max: undefined })
};

const isValidPhoneNumber = (phone) => PHONE.test(phone);

const isValidSocialProvider = (provider) => {
  const validProviders = ["facebook", "google"];
  return _.indexOf(validProviders, provider) !== -1;
}

const isValidDateOfBirth = (date) => {
  if (!_.isString(date)) return false;
  const dateMoment = moment(date, 'DD-MM-YYYY', true);
  return dateMoment.isValid() && dateMoment.isBetween('1970-01-01');
}

const isValidGender = (gender) => (gender == MALE || gender == FEMALE);

const isValidMaritalStatus = (maritalStatus) => (maritalStatus == SINGLE || maritalStatus == MARRIED);

const isValidEducationalStatus = (educationalStatus) => _.indexOf([FIRST_TO_THIRD_YEAR, FOURTH_YEAR, FINAL_YEAR, GRADUATED], educationalStatus) > -1;

const isValidSalary = (fromSalary, toSalary) =>  (_.isNumber(fromSalary)  && _.isNumber(toSalary) && fromSalary >= 0 && toSalary >= fromSalary);

const isValidJobType = (jobType) => _.indexOf([FULL_TIME, PART_TIME, INTERSHIP, CONTRACT, FREELANCE], jobType) > -1;

const isArrayOfStrings = (strArr) => _.isArray(strArr) && _.every(strArr, str => _.isString(str));

const isArrayOfObjects = (objArr) => _.isArray(objArr) && _.every(objArr, obj => _.isObject(obj));

const isValidLanguagesObject = (langsObj) => {
  if (!_.isObject(langsObj)) return false;
  const keys = _.keys(langsObj), values = _.values(langsObj);
  const langArr = [ENGLISH, FRENCH, GERMAN, SPANISH, RUSSIAN, KOREAN, CHINESE, JAPANESE];
  const levelArr = [NO, BEGINNER, INTERMEDIATE, ADVANCED, NATIVE];
  if (!_.isEmpty(_.xor(langArr, keys))) return false;
  return _.every(values, value => _.indexOf[levelArr, value]) > -1;
};

const isValidPeriodOfMonthYear = (fromMonth, toMonth) => {
  const fromMoment = moment(fromMonth, 'MM-YYYY', true);
  const toMoment = toMonth == 'NOW' ? moment(moment().format('MM-YYYY'), 'MM-YYYY', true) : moment(toMonth, 'MM-YYYY', true);
  const isValidFrom = fromMoment.isValid() && fromMoment.isBetween('1970-01');
  const isValidTo = toMoment.isValid() && toMoment.isBetween('1970-01');
  if (!isValidFrom || !isValidTo) return false;
  return fromMoment.isSameOrBefore(toMoment);
}

const isValidDegreeType = (degreeType) => _.indexOf([HIGH_SCHOOL, COLLEGE, BACHELOR, MASTER, DOCTORATE, OTHER], degreeType) > -1;

const isValidDegreeClassification = (degreeClassification) => _.indexOf([AVERAGE, GOOD, EXCELLENT], degreeClassification) > -1;

const isImage = (imageName) => {
  if (!_.isString(imageName)) return false;
  const acceptedExts = ['.jpg', '.png', '.jpeg'];
  const imageExt = path.extname(imageName).toLowerCase();
  return _.indexOf(acceptedExts, imageExt) > -1;
}

const isValidExpiredDay = (expiredDay) => _.indexOf([ONE_WEEK, TWO_WEEKS, ONE_MONTH], expiredDay) > -1;

module.exports = {
  isValidPassword,
  isValidPhoneNumber,
  isValidSocialProvider,
  isValidDateOfBirth,
  isValidGender,
  isValidMaritalStatus,
  isValidEducationalStatus,
  isValidSalary,
  isValidJobType,
  isArrayOfStrings,
  isArrayOfObjects,
  isValidLanguagesObject,
  isValidPeriodOfMonthYear,
  isValidDegreeType,
  isValidDegreeClassification,
  isImage,
  isValidExpiredDay
}