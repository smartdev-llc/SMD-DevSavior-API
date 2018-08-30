const passport = require('passport');
const constants = require('../../../constants');
const { ACCESS_TOKEN } = constants.TOKEN_TYPE;

module.exports = async function (req, res) {
  const provider = req.params.provider;
  if (!isValidSocialProvider(provider)) {
    return res.badRequest({
      message: "Invalid social provider."
    });
  }

  return passport.authenticate(provider, function (err, user, info) {
    if (err) {
      return res.serverError({
        message: "Something went wrong."
      });
    }

    if (!user) {
      return res.unauthorized(info);
    }

    req.logIn(user, function (err) {
      if (err) {
        return res.serverError({
          message: "Something went wrong."
        });
      }

      const decodedInfo = _.assign({}, _.pick(user, ['id', 'role']), { token_type: ACCESS_TOKEN })
      const token = JwtService.issue(decodedInfo);
      user = JSON.parse(JSON.stringify(user));
      user.token = token;

      res.ok(user);
    });
  })(req, res);
}

function isValidSocialProvider(provider) {
  const validProviders = ["facebook", "google"];
  return _.indexOf(validProviders, provider) !== -1;
}