/**
 * HTTP Server Settings
 * (sails.config.http)
 *
 * Configuration for the underlying HTTP server in Sails.
 * (for additional recommended settings, see `config/env/production.js`)
 *
 * For more information on configuration, check out:
 * https://sailsjs.com/config/http
 */
const express = require('express');
const uuid = require('uuid');

const constants = require('../constants');
const { ACCESS_TOKEN } = constants.TOKEN_TYPE;

module.exports.http = {

  /****************************************************************************
  *                                                                           *
  * Sails/Express middleware to run for every HTTP request.                   *
  * (Only applies to HTTP requests -- not virtual WebSocket requests.)        *
  *                                                                           *
  * https://sailsjs.com/documentation/concepts/middleware                     *
  *                                                                           *
  ****************************************************************************/

  middleware: {

    passportInit: require('passport').initialize(),
    passportSession: require('passport').session(),
    swaggerAssets: process.env.NODE_ENV === 'production' ? () => {} : express.static(process.cwd() + "/swagger"),

    /***************************************************************************
    *                                                                          *
    * This middleware will set user to req if user is authenticated            *
    * (Every http requests will go through this middleware.)                   *
    *                                                                          *
    ***************************************************************************/

    authenticateUser: (() => authenticateUserMiddleware)(),

    /***************************************************************************
    *                                                                          *
    * The order in which middleware should be run for HTTP requests.           *
    * (This Sails app's routes are handled by the "router" middleware below.)  *
    *                                                                          *
    ***************************************************************************/

    traceRequest: (req, res, next) => {
      req.traceId = req.headers['x-trace-request-id'] || uuid.v4();
      sails.log.debug(req.method, req.url, req.traceId);
      next();
    },

    order: [
      'cookieParser',
      'session',
      'swaggerAssets',
      'passportInit',
      'passportSession',
      'bodyParser',
      'traceRequest',
      'compress',
      'authenticateUser',
      'poweredBy',
      'router',
      'www',
      'favicon',
    ],


    /***************************************************************************
    *                                                                          *
    * The body parser that will handle incoming multipart HTTP requests.       *
    *                                                                          *
    * https://sailsjs.com/config/http#?customizing-the-body-parser             *
    *                                                                          *
    ***************************************************************************/

    // bodyParser: (function _configureBodyParser(){
    //   var skipper = require('skipper');
    //   var middlewareFn = skipper({ strict: true });
    //   return middlewareFn;
    // })(),

  },

};

async function authenticateUserMiddleware(req, res, proceed) {
  // Remove suspicious data from req
  delete req.user;
  delete req.accessToken;

  const accessToken = parseAccessTokenFromReq(req);
  if (!accessToken) return proceed();

  let decoded;
  try {
    decoded = await JwtService.verify(accessToken);
  } catch (err) {
    return proceed();
  }

  const userId = _.get(decoded, 'id');
  const email = _.get(decoded, 'email');
  const role = _.get(decoded, 'role');
  const password = _.get(decoded, 'password');
  const type = _.get(decoded, 'token_type');
  const jwtid = _.get(decoded, 'jwtid');

  if (_.isNil(jwtid) || _.isNil(userId) || _.isNil(role) || _.isNil(email) || type !== ACCESS_TOKEN) {
    return proceed();
  }

  if (await JwtService.isInBlackList(jwtid)) {
    return proceed();
  }

  let user;
  try {
    let UserModel;
    if (role === "company") {
      UserModel = Company;
    } else if (role === "admin") {
      UserModel = Admin;
    } else {
      UserModel = Student;
    }
    user = await UserModel.findOne({ id: userId, email });

    if (role === 'student' && user.password && password !== user.password) {
      return proceed();
    }

    user.role = role;
    delete user.password;
  } catch (err) {
    return proceed();
  }

  if (!user) {
    return proceed();
  }

  // Set req.user if user is authenticated
  req.user = user;
  req.accessToken = accessToken;
  req.isAuthenticated = true;

  proceed();
}

function parseAccessTokenFromReq(req) {
  const authorizationHeader = _.get(req, 'headers.authorization', _.get(req, 'headers.Authorization'));
  let accessToken = null;
  if (authorizationHeader) {
    const parts = authorizationHeader.split(' ');
    if (parts.length == 2) {
      var scheme = parts[0],
        credentials = parts[1];

      if (/^Bearer$/i.test(scheme)) {
        accessToken = credentials;
      }
    }
  } else if (_.get(req, 'query.access_token')) {
    accessToken = req.query['access_token'];
  }
  return accessToken;
}
