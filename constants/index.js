module.exports = {
  JWT_OPTIONS: {
    ACCESS_TOKEN_EXPIRATION: '30 days',
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

  COMPANY_PUBLIC_FIELDS: [ 'id', 'name', 'city', 'contactName', 'phoneNumber', 'website', 'description', 'logoURL', 'videoURL'],

  QUALIFICATION: {
    NAM_1_TO_3: '1-3',
    NAM_4: '4',
    NAM_CUOI: 'last',
    GRADUATED: 'graduated',
    WORKED: 'worked'
  }
}