const passport = require('passport');

const {
  INTERNAL_SERVER_ERROR,
  UNVERIFIED_EMAIL
} = require('../../../constants/error-code');

const constants = require('../../../constants');
const { ACCESS_TOKEN } = constants.TOKEN_TYPE;

module.exports = async function (req, res) {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return res.serverError({
        message: "Something went wrong.",
        devMessage: err.message,
        code: INTERNAL_SERVER_ERROR
      });
    }

    if (!user) {
      return res.unauthorized(info);
    }

    if (!user.emailVerified) {
      return res.forbidden({
        message: "Email is unverified.",
        devMessage: "Email is unverified",
        code: UNVERIFIED_EMAIL
      });
    }

    // Remove sensitive data before login
    user.password = undefined;
    const decodedInfo = _.assign({}, _.pick(user, ['id', 'email', 'role']), { token_type: ACCESS_TOKEN })
    const token = JwtService.issue(decodedInfo);
    user = JSON.parse(JSON.stringify(user));
    user.token = token;

    res.ok(user);
  })(req, res);
}