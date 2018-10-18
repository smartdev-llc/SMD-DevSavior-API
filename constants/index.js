module.exports = {
  JWT_OPTIONS: {
    ACCESS_TOKEN_EXPIRATION: '24h',
    VERIFICATION_TOKEN_EXPIRATION: '1h',
    RESET_PASSWORD_TOKEN_EXPIRATION: '1h',
    ALGORITHM: 'RS256',
    DECODED_KEYS: ['id', 'email', 'token_type', 'role']
  },

  TOKEN_TYPE: {
    VERIFICATION_TOKEN: 'VERIFICATION_TOKEN',
    ACCESS_TOKEN: 'ACCESS_TOKEN',
    RESET_PASSWORD_TOKEN: 'RESET_PASSWORD_TOKEN'
  },

  FILE_LIMIT_SIZE: 10000000, // 10MB,

  COMPANY_PUBLIC_FIELDS: [ 'id', 'name', 'email', 'address', 'city', 'contactName', 'phoneNumber', 'website', 'description', 'logoURL', 'coverURL', 'videoURL'],

  STUDENT_PUBLIC_FIELDS: [ 'id', 'firstName', 'lastName', 'profileImageURL'],

  EDUCATIONAL_STATUS: {
    FIRST_TO_THIRD_YEAR: 'FIRST_TO_THIRD_YEAR',
    FOURTH_YEAR: 'FOURTH_YEAR',
    FINAL_YEAR: 'FINAL_YEAR',
    GRADUATED: 'GRADUATED'
  },

  MARITAL_STATUS: {
    SINGLE: 'SINGLE',
    MARRIED: 'MARRIED'
  },

  GENDER: {
    MALE: 'MALE',
    FEMALE: 'FEMALE'
  },

  STATUS: {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE'
  },

  WORKING_LOCATION: {
    HN: "Ha Noi",
    TPHCM: "TP Ho Chi Minh",
    DN: 'Da Nang'
  },

  JOB_TYPE: {
    FULL_TIME: 'FULL_TIME', 
    PART_TIME: 'PART_TIME', 
    INTERSHIP: 'INTERSHIP'
  },

  REGEX: {
    PHONE: /^[0-9\+]{1,}[0-9\-]{3,15}$/
  },

  AUTH_PREFIX: 'auth_token_id:'
}