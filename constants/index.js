module.exports = {
  JWT_OPTIONS: {
    ACCESS_TOKEN_EXPIRATION: '30 days',
    VERIFICATION_TOKEN_EXPIRATION: '1h',
    RESET_PASSWORD_TOKEN_EXPIRATION: '1h',
    ALGORITHM: 'RS256',
    DECODED_KEY: ['id', 'token_type', 'role']
  },

  TOKEN_TYPE: {
    VERIFICATION_TOKEN: 'VERIFICATION_TOKEN',
    ACCESS_TOKEN: 'ACCESS_TOKEN',
    RESET_PASSWORD_TOKEN: 'RESET_PASSWORD_TOKEN'
  }
}