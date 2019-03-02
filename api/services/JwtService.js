const jwt = require('jsonwebtoken');
const shortid = require('shortid');
const Redis = require('ioredis');
const fs = require('fs');

const constants = require('../../constants');
const { ACCESS_TOKEN_EXPIRATION: expiresIn, ALGORITHM: algorithm, DECODED_KEYS } = constants.JWT_OPTIONS;

// Init Redis, use options { showFriendlyErrorStack: true } in development mode if see more error details
const redisClient = new Redis(`${process.env.REDIS_URL}/${process.env.REDIS_DB_FOR_AUTH}`);

module.exports = {

  issue: function (payload, options = {}) {
    const apiKey = fs.readFileSync(__dirname + '/../../keys/api_key.pem');
    const defaultOptions = {
      algorithm,
      expiresIn
    }
    options = _.assign({}, defaultOptions, options);
    payload = _.pick(payload, DECODED_KEYS);
    payload.jwtid = constants.AUTH_PREFIX + shortid.generate();
    return jwt.sign(payload, apiKey, options)
  },

  verify: function (token, options = {}) {
    const apiCert = fs.readFileSync(__dirname + '/../../keys/api_cert.pem');
    const defaultOptions = {
      algorithms: [algorithm]
    };
    options = _.assign({}, defaultOptions, options);

    return jwt.verify(token, apiCert, options);
  },

  addToBlackList: function (key, expInSecond) {
    redisClient.set(key, 'true', 'EX', expInSecond);
  },

  isInBlackList: async function (key) {
    try {
      const redisKey = await redisClient.get(key);
      return !!redisKey;
    } catch (err) {
      return false;
    }
  }

};