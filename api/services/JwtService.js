const jwt = require('jsonwebtoken');
const fs = require('fs');

const constants = require('../../constants');
const { ACCESS_TOKEN_EXPIRATION: expiresIn, ALGORITHM: algorithm, DECODED_KEYS } = constants.JWT_OPTIONS;

module.exports = {

  issue: function (payload, options = {}) {
    const apiKey = fs.readFileSync(__dirname + '/../../keys/api_key.pem');
    const defaultOptions = {
      algorithm,
      expiresIn
    }
    options = _.assign({}, defaultOptions, options);
    payload = _.pick(payload, DECODED_KEYS);
    return jwt.sign(payload, apiKey, options)
  },

  verify: function (token, options = {}) {
    const apiCert = fs.readFileSync(__dirname + '/../../keys/api_cert.pem');
    const defaultOptions = {
      algorithms: [algorithm]
    };
    options = _.assign({}, defaultOptions, options);

    return jwt.verify(token, apiCert, options);
  }

};