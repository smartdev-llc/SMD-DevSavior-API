const jwt = require('jsonwebtoken');
const fs = require('fs');

const { JWT_EXPIRED_TIME: expiresIn, JWT_ALGORITHM: algorithm } = require('../../constants');

module.exports = {

  issue: function(payload, options = {}) {
    const apiKey = fs.readFileSync(__dirname + '/../../keys/api_key.pem');
    const defaultOptions = {
      algorithm,
      expiresIn
    }
    options = _.assign({}, defaultOptions, options);
    payload = _.pick(payload, ['id', 'email', 'role']);
    return jwt.sign(payload, apiKey, options)
  },

  verify: function(token, options = {}) {
    const apiCert = fs.readFileSync(__dirname + '/../../keys/api_cert.pem');
    const defaultOptions = {
      algorithms: [algorithm]
    };
    options = _.assign({}, defaultOptions, options);

    return jwt.verify(token, apiCert, options);
  }

};