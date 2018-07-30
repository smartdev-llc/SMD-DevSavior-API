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
        return res.unauthorized();
      }
    } else {
      return res.unauthorized();
    }
  } else if (req.param('access_token')) {
    accessToken = req.param('access_token');
    // We delete the access_token from param to not mess with blueprints
    delete req.query.access_token;
  } else {
    return res.unauthorized();
  }

  console.log('std accessToken: ', accessToken);

  let decoded;
  try {
    decoded = JwtService.verify(accessToken);
  } catch(err) {
    if (err) {
      console.log("loi decode");
      return res.unauthorized();
    }
  }
  
  const userId = _.get(decoded, 'id');
  const role = _.get(decoded, 'role');

  if (_.isNil(userId) || role !== 'student') {
    return res.unauthorized();
  }
  
  let user;
  try {
    user = await Student.findOne({ id: userId });
  } catch(err) {
    return res.serverError();
  }

  if (!user) return res.unauthorized();

  req.user = user;

  proceed();
  
}