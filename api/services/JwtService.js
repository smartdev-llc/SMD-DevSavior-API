const jwt = require('jsonwebtoken');
const fs = require('fs');

const { JWT_EXPIRED_TIME: expiresIn, JWT_ALGORITHM: algorithm } = require('../../constants');

module.exports = {

  issue: function(payload) {
    const apiKey = fs.readFileSync(__dirname + '/../../keys/api_key.pem');
    payload = _.pick(payload, ['id', 'email', 'role']);
    return jwt.sign(
      payload,
      apiKey,
      {
        algorithm,
        expiresIn
      }
    )
  },

  verify: function(token) {
    const apiCert = fs.readFileSync(__dirname + '/../../keys/api_cert.pem');
    return jwt.verify(
      token,
      apiCert,
      {
        algorithms: [algorithm]
      }
    )
  }

};