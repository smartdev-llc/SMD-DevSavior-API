const passport = require('passport');
const constants = require('../../../constants');
const { ACCESS_TOKEN } = constants.TOKEN_TYPE;

module.exports = async function (req, res) {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return res.serverError(err);
    }

    if (!user) {
      return res.unauthorized(info);
    }

    if (!user.emailVerified) {
      return res.forbidden({
        message: "Email is not verified."
      });
    }

    // Remove sensitive data before login
    user.password = undefined;
    req.logIn(user, function (err) {
      if (err) { 
        res.serverError(err);
      }

      const decodedInfo = _.assign({}, _.pick(user, [ 'id', 'role' ]), { token_type: ACCESS_TOKEN })
      const token = JwtService.issue(decodedInfo);
      user = JSON.parse(JSON.stringify(user));
      user.token = token;

      res.ok(user);
    });
  })(req, res);
}