const constants = require('../../constants');
const { ACCESS_TOKEN } = constants.TOKEN_TYPE;

module.exports = async function (req, res, proceed) {
  const authorizationHeader = _.get(req, 'headers.authorization', _.get(req, 'headers.Authorization'));
  let accessToken;
  if (authorizationHeader) {
    const parts = authorizationHeader.split(' ');
    if ( parts.length == 2 ) {
      var scheme = parts[0],
        credentials = parts[1];
  
      if ( /^Bearer$/i.test(scheme) ) {
        accessToken = credentials;
      } else {
        return res.unauthorized({
          message: "Permission denied."
        });
      }
    } else {
      return res.unauthorized({
        message: "Permission denied."
      });
    }
  } else if (req.param('access_token')) {
    accessToken = req.param('access_token');
    // We delete the access_token from param to not mess with blueprints
    delete req.query.access_token;
  } else {
    return res.unauthorized({
      message: "Permission denied."
    });
  }

  let decoded;
  try {
    decoded = JwtService.verify(accessToken);
  } catch(err) {
    if (err) {
      return res.unauthorized({
        message: "Permission denied."
      });
    }
  }
  
  const userId = _.get(decoded, 'id');
  const role = _.get(decoded, 'role');
  const type = _.get(decoded, 'token_type');

  if (_.isNil(userId) || role !== 'company' || type !== ACCESS_TOKEN) {
    return res.unauthorized({
      message: "Permission denied."
    });
  }
  
  let user;
  try {
    user = await Company.findOne({ id: userId });
  } catch(err) {
    return res.serverError({
      message: "Something went wrong."
    });
  }

  if (!user) {
    return res.unauthorized({
      message: "Permission denied."
    });
  }

  if (!user.emailVerified) {
    return res.forbidden({
      message: "Email is not verified."
    });
  }

  req.user = user;

  proceed();
  
}